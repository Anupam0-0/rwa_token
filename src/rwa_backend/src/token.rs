use candid::Principal;
use std::cell::RefCell;
use std::collections::HashMap;
use crate::user::{is_admin, is_kyc_approved};
use crate::notification::{create_notification, NotificationType};

#[derive(Clone, Debug, candid::CandidType, candid::Deserialize)]
pub struct Token {
    pub id: u64,
    pub asset_id: u64,
    pub owner_id: Principal,
    pub amount: u64,
    pub price: u64,
    pub status: TokenStatus,
}

#[derive(Clone, Debug, candid::CandidType, candid::Deserialize, PartialEq)]
pub enum TokenStatus {
    Available,
    Sold,
    Locked,
}

thread_local! {
    static TOKENS: RefCell<HashMap<u64, Token>> = RefCell::new(HashMap::new());
    static TOKEN_ID_COUNTER: RefCell<u64> = RefCell::new(1);
}

#[ic_cdk::update]
pub fn mint_token(asset_id: u64, owner_id: Principal, amount: u64, price: u64) -> Token {
    let caller = ic_cdk::caller();
    if !is_kyc_approved(&caller) {
        ic_cdk::trap("KYC not approved");
    }
    let id = TOKEN_ID_COUNTER.with(|counter| {
        let mut c = counter.borrow_mut();
        let id = *c;
        *c += 1;
        id
    });
    let token = Token {
        id,
        asset_id,
        owner_id,
        amount,
        price,
        status: TokenStatus::Available,
    };
    TOKENS.with(|tokens| tokens.borrow_mut().insert(id, token.clone()));
    token
}

#[ic_cdk::query]
pub fn get_token(id: u64) -> Option<Token> {
    TOKENS.with(|tokens| tokens.borrow().get(&id).cloned())
}

#[ic_cdk::update]
pub fn transfer_token(token_id: u64, new_owner: Principal) -> Option<Token> {
    let caller = ic_cdk::caller();
    if !is_kyc_approved(&new_owner) {
        ic_cdk::trap("Recipient KYC not approved");
    }
    TOKENS.with(|tokens| {
        let mut tokens = tokens.borrow_mut();
        if let Some(token) = tokens.get_mut(&token_id) {
            if token.owner_id == caller || is_admin(&caller) {
                token.owner_id = new_owner;
                token.status = TokenStatus::Sold;
                // Notify new owner
                create_notification(new_owner, NotificationType::Investment, format!("You received token #{} for asset #{}", token.id, token.asset_id), ic_cdk::api::time().to_string());
                return Some(token.clone());
            }
        }
        None
    })
}

#[ic_cdk::query]
pub fn list_tokens() -> Vec<Token> {
    TOKENS.with(|tokens| tokens.borrow().values().cloned().collect())
}

#[ic_cdk::query]
pub fn list_tokens_by_user(user_id: Principal) -> Vec<Token> {
    TOKENS.with(|tokens| tokens.borrow().values().filter(|t| t.owner_id == user_id).cloned().collect())
}

#[ic_cdk::query]
pub fn list_tokens_by_asset(asset_id: u64) -> Vec<Token> {
    TOKENS.with(|tokens| tokens.borrow().values().filter(|t| t.asset_id == asset_id).cloned().collect())
} 