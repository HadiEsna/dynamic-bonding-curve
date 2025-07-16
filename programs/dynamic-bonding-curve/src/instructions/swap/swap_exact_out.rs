use crate::{PoolError, ProcessSwapParams, ProcessSwapResult, SwapParameters};
use anchor_lang::prelude::*;

pub fn process_swap_exact_out(params: ProcessSwapParams<'_>) -> Result<ProcessSwapResult> {
    let ProcessSwapParams {
        pool,
        config,
        fee_mode,
        trade_direction,
        current_point,
        amount_0: amount_out,
        amount_1: maximum_amount_in,
        ..
    } = params;

    let swap_result = pool.get_swap_result_from_exact_output(
        config,
        amount_out,
        fee_mode,
        trade_direction,
        current_point,
    )?;

    let included_fee_in_amount = swap_result.get_included_fee_amount_in(fee_mode.fees_on_input)?;

    require!(
        included_fee_in_amount <= maximum_amount_in,
        PoolError::ExceededSlippage
    );

    Ok(ProcessSwapResult {
        swap_result,
        user_pay_input_amount: included_fee_in_amount,
        // For backward compatibility because we are emitting EvtSwap and EvtSwap2
        swap_in_parameters: SwapParameters {
            amount_in: included_fee_in_amount,
            minimum_amount_out: swap_result.output_amount,
        },
    })
}
