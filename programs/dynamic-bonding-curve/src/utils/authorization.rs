use anchor_lang::prelude::*;
use ed25519_dalek::{PublicKey as DalekPublicKey, Signature as DalekSignature, Verifier};
use anchor_lang::solana_program::{
    ed25519_program,
    instruction::{get_processed_sibling_instruction, get_stack_height},
};

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
    require!(current_slot <= payload.expiry_slot, PoolError::AuthorizationExpired);

    let message = build_message(action, user, target, payload.nonce, payload.expiry_slot);

    // First try to validate an Ed25519 verification sibling instruction to save compute.
    if verify_with_ed25519_ix(&message).is_ok() {
        nonce_account.consume(user, payload.nonce)?;
        return Ok(());
    }

    // Fallback to in-program ed25519_dalek verification for backward compatibility.
    let signature =
        DalekSignature::from_bytes(&payload.signature).map_err(|_| PoolError::InvalidAdminSignature)?;

    let mut verified = false;
    for admin in ADMINS.iter() {
        let admin_key =
            DalekPublicKey::from_bytes(admin.as_ref()).map_err(|_| PoolError::InvalidAdminSignature)?;
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

/// Attempts to locate and validate a preceding Ed25519Program verification instruction
/// that verified the exact `message` bytes. This avoids heavy in-program curve work.
///
/// NOTE: We only verify that an Ed25519 ix ran and that its message equals `message` and
/// signer is one of ADMINS. The runtime guarantees the signature check itself.
fn verify_with_ed25519_ix(expected_message: &[u8]) -> Result<()> {
    // Scan previously-processed instructions in this transaction.
    // get_stack_height returns the number of instructions in the current stack frame.
    let height = get_stack_height();
    // Iterate through prior instructions (skip the current one at `height - 1`).
    for i in 0..height.saturating_sub(1) {
        if let Some(ix) = get_processed_sibling_instruction(i as usize) {
            if ix.program_id != ed25519_program::ID {
                continue;
            }

            // Ed25519 ix data layout (single sig) is:
            // [sig_count: u8][padding: u8]
            // [sig_offset: u16][sig_len: u16]
            // [pubkey_offset: u16][pubkey_len: u16]
            // [msg_offset: u16][msg_len: u16]
            // followed by concatenated [signature][pubkey][message] at the specified offsets.
            let data = ix.data.as_slice();
            if data.len() < 16 {
                continue;
            }

            let sig_count = data[0];
            if sig_count != 1 {
                continue;
            }

            // Read 8 u16 values starting at index 2.
            let read_u16 = |off: usize| -> Option<u16> {
                if off + 2 <= data.len() {
                    Some(u16::from_le_bytes([data[off], data[off + 1]]))
                } else {
                    None
                }
            };

            let sig_offset = read_u16(2).ok_or(PoolError::InvalidAdminSignature)? as usize;
            let sig_len = read_u16(4).ok_or(PoolError::InvalidAdminSignature)? as usize;
            let pubkey_offset = read_u16(6).ok_or(PoolError::InvalidAdminSignature)? as usize;
            let pubkey_len = read_u16(8).ok_or(PoolError::InvalidAdminSignature)? as usize;
            let msg_offset = read_u16(10).ok_or(PoolError::InvalidAdminSignature)? as usize;
            let msg_len = read_u16(12).ok_or(PoolError::InvalidAdminSignature)? as usize;

            // Basic bounds checks
            let total = data.len();
            require!(sig_offset + sig_len <= total, PoolError::InvalidAdminSignature);
            require!(pubkey_offset + pubkey_len <= total, PoolError::InvalidAdminSignature);
            require!(msg_offset + msg_len <= total, PoolError::InvalidAdminSignature);
            require!(pubkey_len == 32, PoolError::InvalidAdminSignature);

            // Pull pubkey and message
            let pubkey_bytes = &data[pubkey_offset..pubkey_offset + pubkey_len];
            let message_bytes = &data[msg_offset..msg_offset + msg_len];

            // Ensure signer is one of ADMINS
            let mut signer_ok = false;
            for admin in ADMINS.iter() {
                if admin.as_ref() == pubkey_bytes {
                    signer_ok = true;
                    break;
                }
            }
            require!(signer_ok, PoolError::InvalidAdminSignature);

            // Ensure exact message match
            require!(message_bytes == expected_message, PoolError::InvalidAdminSignature);

            // If we reach here, an Ed25519 ix already verified this exact message by an admin.
            return Ok(());
        }
    }
    Err(PoolError::InvalidAdminSignature.into())
}
