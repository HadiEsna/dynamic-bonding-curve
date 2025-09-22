use anchor_lang::prelude::*;
use ed25519_dalek::{PublicKey as DalekPublicKey, Signature as DalekSignature, Verifier};

use crate::{
    admin::admin::ADMINS,
    params::authorization::{AuthorizationAction, AuthorizationPayload},
    state::AuthorizationNonce,
    PoolError,
};

const AUTHORIZATION_MESSAGE_LEN: usize = 1 + 32 + 32 + 8 + 8;

pub fn verify_admin_authorization(
    payload: &AuthorizationPayload,
    action: AuthorizationAction,
    user: &Pubkey,
    target: &Pubkey,
    current_slot: u64,
    nonce_account: &mut AuthorizationNonce,
) -> Result<()> {
    require!(
        current_slot <= payload.expiry_slot,
        PoolError::AuthorizationExpired
    );

    let message = build_message(action, user, target, payload.nonce, payload.expiry_slot);

    let signature = DalekSignature::from_bytes(&payload.signature)
        .map_err(|_| PoolError::InvalidAdminSignature)?;

    let mut verified = false;
    for admin in ADMINS.iter() {
        let admin_key = DalekPublicKey::from_bytes(admin.as_ref())
            .map_err(|_| PoolError::InvalidAdminSignature)?;
        if admin_key.verify(&message, &signature).is_ok() {
            verified = true;
            break;
        }
    }

    require!(verified, PoolError::InvalidAdminSignature);

    nonce_account.consume(user, payload.nonce)?;
    Ok(())
}

fn build_message(
    action: AuthorizationAction,
    user: &Pubkey,
    target: &Pubkey,
    nonce: u64,
    expiry_slot: u64,
) -> [u8; AUTHORIZATION_MESSAGE_LEN] {
    let mut buf = [0u8; AUTHORIZATION_MESSAGE_LEN];
    buf[0] = action as u8;
    buf[1..33].copy_from_slice(user.as_ref());
    buf[33..65].copy_from_slice(target.as_ref());
    buf[65..73].copy_from_slice(&nonce.to_le_bytes());
    buf[73..81].copy_from_slice(&expiry_slot.to_le_bytes());
    buf
}
