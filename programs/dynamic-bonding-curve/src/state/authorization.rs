use anchor_lang::prelude::*;
use static_assertions::const_assert_eq;

use crate::PoolError;

#[account]
#[derive(Debug, InitSpace, Default)]
pub struct AuthorizationNonce {
    pub authority: Pubkey,
    pub last_nonce: u64,
}

const_assert_eq!(AuthorizationNonce::INIT_SPACE, 48);

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
