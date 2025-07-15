import { HttpAgent, Actor } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory } from 'declarations/rwa_backend/rwa_backend.did.js';

const CANISTER_ID = import.meta.env.CANISTER_ID_RWA_BACKEND || '<rwa_backend_canister_id>';

const agent = new HttpAgent({
  host: 'http://localhost:4943', // Change to mainnet if needed
});

export async function getBackendActor() {
  return Actor.createActor(idlFactory, {
    agent,
    canisterId: CANISTER_ID,
  });
}

export async function registerUser(username, email, wallet_address) {
  // If username/email/wallet_address are principal strings, convert them
  const userPrincipal = Principal.fromText(username);
  const backend = await getBackendActor();
  return backend.register_user(userPrincipal, email, wallet_address);
}

export async function getUser(principal) {
  const backend = await getBackendActor();
  const principalObj = Principal.fromText(principal);
  return backend.get_user(principalObj);
}

export async function updateProfile(bio, avatar) {
  const backend = await getBackendActor();
  return backend.update_profile(bio, avatar);
}

export async function listAssets() {
  const backend = await getBackendActor();
  return backend.list_assets();
}

export async function createAsset({
  name,
  description,
  category,
  location,
  images,
  documents,
  total_value,
  token_price,
  total_tokens,
  apy,
  launch_date,
  funding_deadline,
  monthly_income,
  risk_rating,
  key_metrics
}) {
  const backend = await getBackendActor();
  return backend.create_asset(
    name,
    description,
    category,
    location,
    images,
    documents,
    total_value,
    token_price,
    total_tokens,
    apy,
    launch_date,
    funding_deadline,
    monthly_income,
    risk_rating,
    key_metrics
  );
}

export async function getAsset(id) {
  const backend = await getBackendActor();
  return backend.get_asset(Number(id));
}

export async function mintToken(asset_id, owner_id, amount, price) {
  const backend = await getBackendActor();
  return backend.mint_token(Number(asset_id), owner_id, Number(amount), Number(price));
}

export async function getPortfolio(principal) {
  const backend = await getBackendActor();
  const principalObj = Principal.fromText(principal);
  return backend.get_portfolio(principalObj);
}

export async function listTokensByUser(principal) {
  const backend = await getBackendActor();
  const principalObj = Principal.fromText(principal);
  return backend.list_tokens_by_user(principalObj);
}

export async function listTrades() {
  const backend = await getBackendActor();
  return backend.list_trades();
}

export async function createTrade(buyer_id, seller_id, token_id, asset_id, quantity, price, currency, created_at) {
  const backend = await getBackendActor();
  return backend.create_trade(buyer_id, seller_id, Number(token_id), Number(asset_id), Number(quantity), Number(price), currency, created_at);
}

export async function updateTradeStatus(id, status, filled) {
  const backend = await getBackendActor();
  return backend.update_trade_status(Number(id), status, Number(filled));
}

export async function listNotificationsByUser(principal) {
  const backend = await getBackendActor();
  const principalObj = Principal.fromText(principal);
  return backend.list_notifications_by_user(principalObj);
}

export async function markNotificationRead(id) {
  const backend = await getBackendActor();
  return backend.mark_notification_read(Number(id));
}

export async function listUsers() {
  const backend = await getBackendActor();
  return backend.list_users();
}

export async function setKycStatus(user_id, status) {
  const backend = await getBackendActor();
  return backend.set_kyc_status(user_id, status);
}

export async function approveAsset(asset_id) {
  const backend = await getBackendActor();
  return backend.approve_asset(Number(asset_id));
}

export async function setUserRole(user_id, role) {
  const backend = await getBackendActor();
  return backend.set_user_role(user_id, role);
} 