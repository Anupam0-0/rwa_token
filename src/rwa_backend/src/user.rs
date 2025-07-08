use candid::Principal;
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(Clone, Debug, candid::CandidType, candid::Deserialize)]
pub struct User {
    pub id: Principal,
    pub username: String,
    pub email: String,
    pub wallet_address: String,
    pub kyc_status: KycStatus,
    pub role: UserRole,
    pub profile: Option<UserProfile>,
    pub notifications: Vec<Notification>,
}

#[derive(Clone, Debug, candid::CandidType, candid::Deserialize, PartialEq)]
pub enum KycStatus {
    Pending,
    Approved,
    Rejected,
}

#[derive(Clone, Debug, candid::CandidType, candid::Deserialize, PartialEq)]
pub enum UserRole {
    User,
    Admin,
}

#[derive(Clone, Debug, candid::CandidType, candid::Deserialize)]
pub struct UserProfile {
    pub bio: Option<String>,
    pub avatar: Option<String>,
}

use crate::notification::{Notification, create_notification, NotificationType};

thread_local! {
    static USERS: RefCell<HashMap<Principal, User>> = RefCell::new(HashMap::new());
}

// Register a new user
#[ic_cdk::update]
pub fn register_user(username: String, email: String, wallet_address: String) -> Option<User> {
    let caller = ic_cdk::caller();
    let user = User {
        id: caller,
        username: username.clone(),
        email: email.clone(),
        wallet_address,
        kyc_status: KycStatus::Pending,
        role: UserRole::User,
        profile: None,
        notifications: vec![],
    };
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        if users.contains_key(&caller) {
            None
        } else {
            users.insert(caller, user.clone());
            Some(user)
        }
    })
}

// Get user by principal
#[ic_cdk::query]
pub fn get_user(principal: Principal) -> Option<User> {
    USERS.with(|users| users.borrow().get(&principal).cloned())
}

// Update user profile
#[ic_cdk::update]
pub fn update_profile(bio: Option<String>, avatar: Option<String>) -> Option<User> {
    let caller = ic_cdk::caller();
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        if let Some(user) = users.get_mut(&caller) {
            user.profile = Some(UserProfile { bio, avatar });
            return Some(user.clone());
        } else {
            None
        }
    })
}

// Set KYC status (admin only)
#[ic_cdk::update]
pub fn set_kyc_status(user_id: Principal, status: KycStatus) -> Option<User> {
    let caller = ic_cdk::caller();
    if !is_admin(&caller) {
        return None;
    }
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        if let Some(user) = users.get_mut(&user_id) {
            user.kyc_status = status.clone();
            // Notify user
            create_notification(user_id, NotificationType::Kyc, format!("Your KYC status changed to {:?}", status), ic_cdk::api::time().to_string());
            return Some(user.clone());
        }
        None
    })
}

// List all users (admin only)
#[ic_cdk::query]
pub fn list_users() -> Vec<User> {
    let caller = ic_cdk::caller();
    if !is_admin(&caller) {
        return vec![];
    }
    USERS.with(|users| {
        let users = users.borrow();
        users.values().cloned().collect()
    })
}

// Helper: Check if caller is admin
pub fn is_admin(caller: &Principal) -> bool {
    USERS.with(|users| {
        users.borrow().get(caller).map_or(false, |u| u.role == UserRole::Admin)
    })
}

// Helper: Check if user is KYC approved
pub fn is_kyc_approved(principal: &Principal) -> bool {
    USERS.with(|users| {
        users.borrow().get(principal).map_or(false, |u| u.kyc_status == KycStatus::Approved)
    })
}

// Admin: Change user role (moderation)
#[ic_cdk::update]
pub fn set_user_role(user_id: Principal, role: UserRole) -> Option<User> {
    let caller = ic_cdk::caller();
    if !is_admin(&caller) {
        return None;
    }
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        if let Some(user) = users.get_mut(&user_id) {
            user.role = role.clone();
            // Notify user
            create_notification(user_id, NotificationType::Admin, format!("Your role changed to {:?}", role), ic_cdk::api::time().to_string());
            return Some(user.clone());
        }
        None
    })
} 