use anchor_lang::prelude::*;

use crate::PoolError;

#[account]
#[derive(Debug, InitSpace, Default)]
pub struct AuthorizationNonce {
    pub authority: Pubkey,
    pub last_nonce: u64,
}

// INIT_SPACE accounts for: Pubkey (32) + u64 (8) + padding (if any). Anchor 0.31 derives 48 here.
// If Anchor's layout changes, adjust accordingly.

impl AuthorizationNonce {
    pub fn consume(&mut self, authority: &Pubkey, nonce: u64) -> Result<()> {
        if self.authority == Pubkey::default() {
            self.authority = *authority;
            self.last_nonce = nonce;
            return Ok(());
        } else {
            require!(
                self.authority == *authority,
                PoolError::UnauthorizedAuthorityForSignature
            );
        }

        require!(
            nonce > self.last_nonce,
            PoolError::AuthorizationNonceNotIncreasing
        );
        self.last_nonce = nonce;
        Ok(())
    }
}
