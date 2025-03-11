use anchor_lang::prelude::*;
use num_enum::{IntoPrimitive, TryFromPrimitive};
use static_assertions::const_assert_eq;

#[repr(u8)]
#[derive(
    Clone,
    Copy,
    Debug,
    PartialEq,
    IntoPrimitive,
    TryFromPrimitive,
    AnchorDeserialize,
    AnchorSerialize,
)]
pub enum MigrationMeteoraDammProgress {
    Init,
    CreatedPool,
    LockLp,
}

#[account(zero_copy)]
#[derive(InitSpace, Debug)]
pub struct MeteoraDammMigrationMetadata {
    /// operator
    pub virtual_pool: Pubkey,
    /// owner
    pub owner: Pubkey,
    /// lp mint
    pub lp_mint: Pubkey,
    /// minted lp amount
    pub lp_minted_amount: u64,
    /// progress
    pub progress: u8,
    /// Reserve
    pub _padding: [u8; 127],
}
const_assert_eq!(MeteoraDammMigrationMetadata::INIT_SPACE, 232);

impl MeteoraDammMigrationMetadata {
    pub fn set_progress(&mut self, progress: u8) {
        self.progress = progress;
    }

    pub fn set_lp_minted(&mut self, lp_mint: Pubkey, amount: u64) {
        self.lp_mint = lp_mint;
        self.lp_minted_amount = amount;
    }
}
