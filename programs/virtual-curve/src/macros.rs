//! Macro functions
macro_rules! pool_authority_seeds {
    ($bump:expr) => {
        &[b"pool_authority".as_ref(), &[$bump]]
    };
}

macro_rules! base_vault_seeds {
    ($base_mint:expr, $pool:expr, $bump:expr) => {
        &[
            b"token_vault".as_ref(),
            $base_mint.as_ref(),
            $pool.as_ref(),
            &[$bump],
        ]
    };
}
