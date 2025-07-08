use candid::Principal;
use std::cell::RefCell;
use std::collections::HashMap;
use crate::user::{is_admin, is_kyc_approved};
use crate::notification::{create_notification, NotificationType};

#[derive(Clone, Debug, candid::CandidType, candid::Deserialize)]
pub struct Trade {
    pub id: u64,
    pub buyer_id: Principal,
    pub seller_id: Principal,
    pub token_id: u64,
    pub asset_id: u64,
    pub quantity: u64,
    pub price: u64,
    pub currency: Currency,
    pub status: TradeStatus,
    pub created_at: String,
    pub filled: u64,
}

#[derive(Clone, Debug, candid::CandidType, candid::Deserialize, PartialEq)]
pub enum TradeStatus {
    Pending,
    Completed,
    Cancelled,
}

#[derive(Clone, Debug, candid::CandidType, candid::Deserialize, PartialEq)]
pub enum Currency {
    ICP,
    USD,
    INR,
}

thread_local! {
    static TRADES: RefCell<HashMap<u64, Trade>> = RefCell::new(HashMap::new());
    static TRADE_ID_COUNTER: RefCell<u64> = RefCell::new(1);
}

#[ic_cdk::update]
pub fn create_trade(
    buyer_id: Principal,
    seller_id: Principal,
    token_id: u64,
    asset_id: u64,
    quantity: u64,
    price: u64,
    currency: Currency,
    created_at: String,
) -> Trade {
    let caller = ic_cdk::caller();
    if !is_kyc_approved(&buyer_id) || !is_kyc_approved(&seller_id) {
        ic_cdk::trap("KYC not approved for buyer or seller");
    }
    let id = TRADE_ID_COUNTER.with(|counter| {
        let mut c = counter.borrow_mut();
        let id = *c;
        *c += 1;
        id
    });
    let created_at_clone = created_at.clone();
    let trade = Trade {
        id,
        buyer_id,
        seller_id,
        token_id,
        asset_id,
        quantity,
        price,
        currency,
        status: TradeStatus::Pending,
        created_at,
        filled: 0,
    };
    TRADES.with(|trades| trades.borrow_mut().insert(id, trade.clone()));
    // Notify buyer and seller
    create_notification(buyer_id, NotificationType::Trade, format!("Trade #{} created for token #{}", id, token_id), created_at_clone.clone());
    create_notification(seller_id, NotificationType::Trade, format!("Trade #{} created for token #{}", id, token_id), created_at_clone);
    trade
}

#[ic_cdk::query]
pub fn get_trade(id: u64) -> Option<Trade> {
    TRADES.with(|trades| trades.borrow().get(&id).cloned())
}

#[ic_cdk::query]
pub fn list_trades() -> Vec<Trade> {
    TRADES.with(|trades| trades.borrow().values().cloned().collect())
}

#[ic_cdk::query]
pub fn list_trades_by_user(user_id: Principal) -> Vec<Trade> {
    TRADES.with(|trades| trades.borrow().values().filter(|t| t.buyer_id == user_id || t.seller_id == user_id).cloned().collect())
}

#[ic_cdk::query]
pub fn list_trades_by_asset(asset_id: u64) -> Vec<Trade> {
    TRADES.with(|trades| trades.borrow().values().filter(|t| t.asset_id == asset_id).cloned().collect())
}

#[ic_cdk::update]
pub fn update_trade_status(id: u64, status: TradeStatus, filled: u64) -> Option<Trade> {
    let caller = ic_cdk::caller();
    TRADES.with(|trades| {
        let mut trades = trades.borrow_mut();
        if let Some(trade) = trades.get_mut(&id) {
            if trade.buyer_id == caller || trade.seller_id == caller || is_admin(&caller) {
                trade.status = status.clone();
                trade.filled = filled;
                // Notify both parties
                create_notification(trade.buyer_id, NotificationType::Trade, format!("Trade #{} status updated to {:?}", id, status), ic_cdk::api::time().to_string());
                create_notification(trade.seller_id, NotificationType::Trade, format!("Trade #{} status updated to {:?}", id, status), ic_cdk::api::time().to_string());
                return Some(trade.clone());
            }
        }
        None
    })
} 