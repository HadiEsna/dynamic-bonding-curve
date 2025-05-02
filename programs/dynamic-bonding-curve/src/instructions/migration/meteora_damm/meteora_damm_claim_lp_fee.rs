use crate::{const_pda, state::MigrationProgress, *};

pub fn handle_migrate_meteora_damm_claim_lp_fee_token<'info>(
    ctx: Context<'_, '_, '_, 'info, MigrateMeteoraDammClaimLpTokenCtx<'info>>,
) -> Result<()> {
    let virtual_pool = ctx.accounts.virtual_pool.load()?;

    require!(
        virtual_pool.get_migration_progress()? == MigrationProgress::CreatedPool,
        PoolError::NotPermitToDoThisAction
    );

    let mut migration_metadata = ctx.accounts.migration_metadata.load_mut()?;

    let is_partner = ctx.accounts.owner.key() == migration_metadata.partner;
    let is_creator = ctx.accounts.owner.key() == migration_metadata.pool_creator;

    let lp_to_claim = match (is_partner, is_creator) {
        (true, true) => migration_metadata.claim_lp_fee_as_self_partnered_creator()?,
        (true, false) => migration_metadata.claim_lp_fee_as_partner()?,
        (false, true) => migration_metadata.claim_lp_fee_as_creator()?,
        (false, false) => return Err(PoolError::InvalidOwnerAccount.into()),
    };

    ctx.accounts
        .transfer(const_pda::pool_authority::BUMP, lp_to_claim)
}
