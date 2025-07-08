use candid::Principal;
use std::cell::RefCell;
use std::collections::HashMap;
use crate::user::is_admin;

#[derive(Clone, Debug, candid::CandidType, candid::Deserialize)]
pub struct Notification {
    pub id: u64,
    pub user_id: Principal,
    pub notification_type: NotificationType,
    pub message: String,
    pub read: bool,
    pub created_at: String,
}

#[derive(Clone, Debug, candid::CandidType, candid::Deserialize, PartialEq)]
pub enum NotificationType {
    Trade,
    Investment,
    Kyc,
    Admin,
    Other,
}

thread_local! {
    static NOTIFICATIONS: RefCell<HashMap<u64, Notification>> = RefCell::new(HashMap::new());
    static NOTIFICATION_ID_COUNTER: RefCell<u64> = RefCell::new(1);
}

#[ic_cdk::update]
pub fn create_notification(user_id: Principal, notification_type: NotificationType, message: String, created_at: String) -> Notification {
    let id = NOTIFICATION_ID_COUNTER.with(|counter| {
        let mut c = counter.borrow_mut();
        let id = *c;
        *c += 1;
        id
    });
    let notification = Notification {
        id,
        user_id,
        notification_type,
        message,
        read: false,
        created_at,
    };
    NOTIFICATIONS.with(|notifications| notifications.borrow_mut().insert(id, notification.clone()));
    notification
}

#[ic_cdk::query]
pub fn get_notification(id: u64) -> Option<Notification> {
    NOTIFICATIONS.with(|notifications| notifications.borrow().get(&id).cloned())
}

#[ic_cdk::query]
pub fn list_notifications_by_user(user_id: Principal) -> Vec<Notification> {
    NOTIFICATIONS.with(|notifications| notifications.borrow().values().filter(|n| n.user_id == user_id).cloned().collect())
}

#[ic_cdk::query]
pub fn list_all_notifications() -> Vec<Notification> {
    let caller = ic_cdk::caller();
    if !is_admin(&caller) {
        return vec![];
    }
    NOTIFICATIONS.with(|notifications| notifications.borrow().values().cloned().collect())
}

#[ic_cdk::update]
pub fn mark_notification_read(id: u64) -> Option<Notification> {
    let caller = ic_cdk::caller();
    NOTIFICATIONS.with(|notifications| {
        let mut notifications = notifications.borrow_mut();
        if let Some(notification) = notifications.get_mut(&id) {
            if notification.user_id == caller || is_admin(&caller) {
                notification.read = true;
                return Some(notification.clone());
            }
        }
        None
    })
} 