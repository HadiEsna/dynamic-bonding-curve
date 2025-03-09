use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

use crate::{
    params::{
        fee_parameters::PoolFeeParamters, liquidity_distribution::LiquidityDistributionParameters,
    },
    state::Config,
};

#[derive(AnchorSerialize, AnchorDeserialize, Debug)]
pub struct ConfigParameters {
    pub pool_fees: PoolFeeParamters,
    pub collect_fee_mode: u8,
    pub migration_option: u8,
    pub activation_type: u8,
    pub token_decimal: u8,
    pub total_supply: u64,
    pub migration_threshold: u64,
    pub sqrt_start_price: u128,
    /// padding for future use
    pub padding: [u64; 6],
    pub curve: Vec<LiquidityDistributionParameters>,
}

#[event_cpi]
#[derive(Accounts)]
#[instruction(config_parameters: ConfigParameters)]
pub struct CreateConfigCtx<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + Config::INIT_SPACE
    )]
    pub config: AccountLoader<'info, Config>,

    /// CHECK: fee_claimer
    pub fee_claimer: UncheckedAccount<'info>,
    /// CHECK: owner of the config
    pub owner: UncheckedAccount<'info>,
    /// quote mint
    pub quote_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handle_create_config(
    ctx: Context<CreateConfigCtx>,
    config_parameters: ConfigParameters,
) -> Result<()> {
    let ConfigParameters {
        pool_fees,
        collect_fee_mode,
        migration_option,
        activation_type,
        token_decimal,
        total_supply,
        migration_threshold,
        sqrt_start_price,
        curve,
        ..
    } = config_parameters;

    // TODO validate

    let mut config = ctx.accounts.config.load_init()?;
    config.init(
        &ctx.accounts.quote_mint.key(),
        ctx.accounts.fee_claimer.key,
        ctx.accounts.owner.key,
        &pool_fees,
        collect_fee_mode,
        migration_option,
        activation_type,
        token_decimal,
        total_supply,
        migration_threshold,
        sqrt_start_price,
        &curve,
    );

    // TODO emit event

    Ok(())
}
