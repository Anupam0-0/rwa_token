use candid::Principal;
use std::cell::RefCell;
use std::collections::HashMap;
use crate::user::{is_admin, is_kyc_approved};
use crate::notification::{create_notification, NotificationType};

#[derive(Clone, Debug, candid::CandidType, candid::Deserialize)]
pub struct Portfolio {
    pub user_id: Principal,
    pub tokens: Vec<u64>,
    pub assets: Vec<u64>,
}

thread_local! {
    static PORTFOLIOS: RefCell<HashMap<Principal, Portfolio>> = RefCell::new(HashMap::new());
}

#[ic_cdk::update]
pub fn create_portfolio(user_id: Principal) -> Portfolio {
    let caller = ic_cdk::caller();
    if !is_kyc_approved(&user_id) {
        ic_cdk::trap("KYC not approved");
    }
    let portfolio = Portfolio {
        user_id,
        tokens: vec![],
        assets: vec![],
    };
    PORTFOLIOS.with(|portfolios| portfolios.borrow_mut().insert(user_id, portfolio.clone()));
    portfolio
}

#[ic_cdk::query]
pub fn get_portfolio(user_id: Principal) -> Option<Portfolio> {
    PORTFOLIOS.with(|portfolios| portfolios.borrow().get(&user_id).cloned())
}

#[ic_cdk::update]
pub fn update_portfolio(user_id: Principal, tokens: Vec<u64>, assets: Vec<u64>) -> Option<Portfolio> {
    let caller = ic_cdk::caller();
    if caller != user_id && !is_admin(&caller) {
        return None;
    }
    if !is_kyc_approved(&user_id) {
        ic_cdk::trap("KYC not approved");
    }
    PORTFOLIOS.with(|portfolios| {
        let mut portfolios = portfolios.borrow_mut();
        if let Some(portfolio) = portfolios.get_mut(&user_id) {
            portfolio.tokens = tokens;
            portfolio.assets = assets;
            // Notify user
            create_notification(user_id, NotificationType::Investment, "Your portfolio was updated".to_string(), ic_cdk::api::time().to_string());
            return Some(portfolio.clone());
        }
        None
    })
}

#[ic_cdk::query]
pub fn list_portfolios() -> Vec<Portfolio> {
    PORTFOLIOS.with(|portfolios| portfolios.borrow().values().cloned().collect())
} 