use candid::Principal;
use std::cell::RefCell;
use std::collections::HashMap;
use crate::user::{is_admin, is_kyc_approved};
use crate::notification::{create_notification, NotificationType};

#[derive(Clone, Debug, candid::CandidType, candid::Deserialize)]
pub struct Asset {
    pub id: u64,
    pub owner_id: Principal,
    pub name: String,
    pub description: String,
    pub category: String,
    pub location: String,
    pub images: Vec<String>,
    pub documents: Vec<String>,
    pub total_value: u64,
    pub token_price: u64,
    pub total_tokens: u64,
    pub available_tokens: u64,
    pub apy: f64,
    pub status: AssetStatus,
    pub launch_date: Option<String>,
    pub funding_deadline: Option<String>,
    pub monthly_income: Option<u64>,
    pub risk_rating: Option<String>,
    pub key_metrics: Option<KeyMetrics>,
}

#[derive(Clone, Debug, candid::CandidType, candid::Deserialize, PartialEq)]
pub enum AssetStatus {
    Pending,
    Approved,
    Rejected,
    Active,
    Funding,
    Sold,
}

#[derive(Clone, Debug, candid::CandidType, candid::Deserialize)]
pub struct KeyMetrics {
    pub cap_rate: Option<f64>,
    pub occupancy_rate: Option<f64>,
    pub location_score: Option<f64>,
    pub liquidity_rating: Option<String>,
}

thread_local! {
    static ASSETS: RefCell<HashMap<u64, Asset>> = RefCell::new(HashMap::new());
    static ASSET_ID_COUNTER: RefCell<u64> = RefCell::new(1);
}

#[ic_cdk::update]
pub fn create_asset(
    name: String,
    description: String,
    category: String,
    location: String,
    images: Vec<String>,
    documents: Vec<String>,
    total_value: u64,
    token_price: u64,
    total_tokens: u64,
    apy: f64,
    launch_date: Option<String>,
    funding_deadline: Option<String>,
    monthly_income: Option<u64>,
    risk_rating: Option<String>,
    key_metrics: Option<KeyMetrics>,
) -> Asset {
    let owner_id = ic_cdk::caller();
    if !is_kyc_approved(&owner_id) {
        ic_cdk::trap("KYC not approved");
    }
    let id = ASSET_ID_COUNTER.with(|counter| {
        let mut c = counter.borrow_mut();
        let id = *c;
        *c += 1;
        id
    });
    let asset = Asset {
        id,
        owner_id,
        name,
        description,
        category,
        location,
        images,
        documents,
        total_value,
        token_price,
        total_tokens,
        available_tokens: total_tokens,
        apy,
        status: AssetStatus::Pending,
        launch_date,
        funding_deadline,
        monthly_income,
        risk_rating,
        key_metrics,
    };
    ASSETS.with(|assets| assets.borrow_mut().insert(id, asset.clone()));
    asset
}

#[ic_cdk::query]
pub fn get_asset(id: u64) -> Option<Asset> {
    ASSETS.with(|assets| assets.borrow().get(&id).cloned())
}

#[ic_cdk::update]
pub fn update_asset(
    id: u64,
    name: Option<String>,
    description: Option<String>,
    category: Option<String>,
    location: Option<String>,
    images: Option<Vec<String>>,
    documents: Option<Vec<String>>,
    total_value: Option<u64>,
    token_price: Option<u64>,
    total_tokens: Option<u64>,
    apy: Option<f64>,
    launch_date: Option<String>,
    funding_deadline: Option<String>,
    monthly_income: Option<u64>,
    risk_rating: Option<String>,
    key_metrics: Option<KeyMetrics>,
) -> Option<Asset> {
    let caller = ic_cdk::caller();
    ASSETS.with(|assets| {
        let mut assets = assets.borrow_mut();
        if let Some(asset) = assets.get_mut(&id) {
            if asset.owner_id == caller || is_admin(&caller) {
                if let Some(v) = name { asset.name = v; }
                if let Some(v) = description { asset.description = v; }
                if let Some(v) = category { asset.category = v; }
                if let Some(v) = location { asset.location = v; }
                if let Some(v) = images { asset.images = v; }
                if let Some(v) = documents { asset.documents = v; }
                if let Some(v) = total_value { asset.total_value = v; }
                if let Some(v) = token_price { asset.token_price = v; }
                if let Some(v) = total_tokens { asset.total_tokens = v; }
                if let Some(v) = apy { asset.apy = v; }
                if let Some(v) = launch_date { asset.launch_date = Some(v); }
                if let Some(v) = funding_deadline { asset.funding_deadline = Some(v); }
                if let Some(v) = monthly_income { asset.monthly_income = Some(v); }
                if let Some(v) = risk_rating { asset.risk_rating = Some(v); }
                if let Some(v) = key_metrics { asset.key_metrics = Some(v); }
                return Some(asset.clone());
            }
        }
        None
    })
}

#[ic_cdk::query]
pub fn list_assets() -> Vec<Asset> {
    ASSETS.with(|assets| assets.borrow().values().cloned().collect())
}

#[ic_cdk::update]
pub fn approve_asset(id: u64) -> Option<Asset> {
    let caller = ic_cdk::caller();
    if !is_admin(&caller) {
        return None;
    }
    ASSETS.with(|assets| {
        let mut assets = assets.borrow_mut();
        if let Some(asset) = assets.get_mut(&id) {
            asset.status = AssetStatus::Approved;
            // Notify asset owner
            create_notification(asset.owner_id, NotificationType::Admin, format!("Your asset '{}' has been approved", asset.name), ic_cdk::api::time().to_string());
            return Some(asset.clone());
        }
        None
    })
}

#[ic_cdk::update]
pub fn delete_asset(id: u64) -> bool {
    let caller = ic_cdk::caller();
    ASSETS.with(|assets| {
        let mut assets = assets.borrow_mut();
        if let Some(asset) = assets.get(&id) {
            if asset.owner_id == caller || is_admin(&caller) {
                assets.remove(&id);
                return true;
            }
        }
        false
    })
} 