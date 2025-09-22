use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct AuthorizationPayload {
    pub signature: [u8; 64],
    pub nonce: u64,
    pub expiry_slot: u64,
}

#[repr(u8)]
#[derive(Copy, Clone, Debug, PartialEq, Eq)]
pub enum AuthorizationAction {
    InitializePool = 1,
    Swap = 2,
}
