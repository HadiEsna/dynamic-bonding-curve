use std::fs;

use dynamic_bonding_curve::state::{PoolConfig, VirtualPool};

mod test_quote_exact_out;
mod test_quote_partial_fill;

fn get_fee_in_quote_accounts() -> (PoolConfig, VirtualPool) {
    let account_data =
        fs::read(&"./fixtures/fee_in_quote_config.bin").expect("Failed to read account data");

    let mut data_without_discriminator = account_data[8..].to_vec();
    let config_state: &PoolConfig = bytemuck::from_bytes(&mut data_without_discriminator);

    assert!(config_state.collect_fee_mode == 0); // fee in quote

    let account_data =
        fs::read(&"./fixtures/fee_in_quote_pool.bin").expect("Failed to read account data");

    let mut data_without_discriminator = account_data[8..].to_vec();
    let pool_state: &VirtualPool = bytemuck::from_bytes_mut(&mut data_without_discriminator);

    (*config_state, *pool_state)
}
