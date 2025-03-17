export type IDL = {
  version: '0.1.0'
  name: 'virtual_curve'
  metadata: {
    address: '2grmPSxKzQBhRrTRjWazVtMkRGFbFaqLakxGEZfnXB5u'
  }
  instructions: [
    {
      name: 'createClaimFeeOperator'
      docs: ['ADMIN FUNCTIONS ////']
      accounts: [
        {
          name: 'claimFeeOperator'
          isMut: true
          isSigner: false
        },
        {
          name: 'operator'
          isMut: false
          isSigner: false
        },
        {
          name: 'admin'
          isMut: true
          isSigner: true
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'eventAuthority'
          isMut: false
          isSigner: false
        },
        {
          name: 'program'
          isMut: false
          isSigner: false
        }
      ]
      args: []
    },
    {
      name: 'closeClaimFeeOperator'
      accounts: [
        {
          name: 'claimFeeOperator'
          isMut: true
          isSigner: false
        },
        {
          name: 'rentReceiver'
          isMut: true
          isSigner: false
        },
        {
          name: 'admin'
          isMut: false
          isSigner: true
        },
        {
          name: 'eventAuthority'
          isMut: false
          isSigner: false
        },
        {
          name: 'program'
          isMut: false
          isSigner: false
        }
      ]
      args: []
    },
    {
      name: 'claimProtocolFee'
      accounts: [
        {
          name: 'poolAuthority'
          isMut: false
          isSigner: false
        },
        {
          name: 'config'
          isMut: false
          isSigner: false
        },
        {
          name: 'pool'
          isMut: true
          isSigner: false
        },
        {
          name: 'baseVault'
          isMut: true
          isSigner: false
          docs: ['The vault token account for input token']
        },
        {
          name: 'quoteVault'
          isMut: true
          isSigner: false
          docs: ['The vault token account for output token']
        },
        {
          name: 'baseMint'
          isMut: false
          isSigner: false
          docs: ['The mint of token a']
        },
        {
          name: 'quoteMint'
          isMut: false
          isSigner: false
          docs: ['The mint of token b']
        },
        {
          name: 'tokenBaseAccount'
          isMut: true
          isSigner: false
          docs: ['The treasury token a account']
        },
        {
          name: 'tokenQuoteAccount'
          isMut: true
          isSigner: false
          docs: ['The treasury token b account']
        },
        {
          name: 'claimFeeOperator'
          isMut: false
          isSigner: false
          docs: ['Claim fee operator']
        },
        {
          name: 'operator'
          isMut: false
          isSigner: true
          docs: ['Operator']
        },
        {
          name: 'tokenBaseProgram'
          isMut: false
          isSigner: false
          docs: ['Token a program']
        },
        {
          name: 'tokenQuoteProgram'
          isMut: false
          isSigner: false
          docs: ['Token b program']
        },
        {
          name: 'eventAuthority'
          isMut: false
          isSigner: false
        },
        {
          name: 'program'
          isMut: false
          isSigner: false
        }
      ]
      args: []
    },
    {
      name: 'createConfig'
      docs: ['PARTNER FUNCTIONS ////']
      accounts: [
        {
          name: 'config'
          isMut: true
          isSigner: true
        },
        {
          name: 'feeClaimer'
          isMut: false
          isSigner: false
        },
        {
          name: 'owner'
          isMut: false
          isSigner: false
        },
        {
          name: 'quoteMint'
          isMut: false
          isSigner: false
          docs: ['quote mint']
        },
        {
          name: 'payer'
          isMut: true
          isSigner: true
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'eventAuthority'
          isMut: false
          isSigner: false
        },
        {
          name: 'program'
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: 'configParameters'
          type: {
            defined: 'ConfigParameters'
          }
        }
      ]
    },
    {
      name: 'claimTradingFee'
      accounts: [
        {
          name: 'poolAuthority'
          isMut: false
          isSigner: false
        },
        {
          name: 'config'
          isMut: false
          isSigner: false
        },
        {
          name: 'pool'
          isMut: true
          isSigner: false
        },
        {
          name: 'tokenAAccount'
          isMut: true
          isSigner: false
          docs: ['The treasury token a account']
        },
        {
          name: 'tokenBAccount'
          isMut: true
          isSigner: false
          docs: ['The treasury token b account']
        },
        {
          name: 'baseVault'
          isMut: true
          isSigner: false
          docs: ['The vault token account for input token']
        },
        {
          name: 'quoteVault'
          isMut: true
          isSigner: false
          docs: ['The vault token account for output token']
        },
        {
          name: 'baseMint'
          isMut: false
          isSigner: false
          docs: ['The mint of token a']
        },
        {
          name: 'quoteMint'
          isMut: false
          isSigner: false
          docs: ['The mint of token b']
        },
        {
          name: 'feeClaimer'
          isMut: false
          isSigner: true
        },
        {
          name: 'tokenBaseProgram'
          isMut: false
          isSigner: false
          docs: ['Token a program']
        },
        {
          name: 'tokenQuoteProgram'
          isMut: false
          isSigner: false
          docs: ['Token b program']
        },
        {
          name: 'eventAuthority'
          isMut: false
          isSigner: false
        },
        {
          name: 'program'
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: 'maxAmountA'
          type: 'u64'
        },
        {
          name: 'maxAmountB'
          type: 'u64'
        }
      ]
    },
    {
      name: 'initializeVirtualPoolWithSplToken'
      docs: ['USER FUNCTIONS ////']
      accounts: [
        {
          name: 'config'
          isMut: false
          isSigner: false
          docs: ['Which config the pool belongs to.']
        },
        {
          name: 'poolAuthority'
          isMut: false
          isSigner: false
        },
        {
          name: 'creator'
          isMut: false
          isSigner: false
        },
        {
          name: 'baseMint'
          isMut: true
          isSigner: true
        },
        {
          name: 'quoteMint'
          isMut: false
          isSigner: false
        },
        {
          name: 'pool'
          isMut: true
          isSigner: false
          docs: ['Initialize an account to store the pool state']
        },
        {
          name: 'baseVault'
          isMut: true
          isSigner: false
          docs: ['Token a vault for the pool']
        },
        {
          name: 'quoteVault'
          isMut: true
          isSigner: false
          docs: ['Token b vault for the pool']
        },
        {
          name: 'mintMetadata'
          isMut: true
          isSigner: false
        },
        {
          name: 'metadataProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'payer'
          isMut: true
          isSigner: true
          docs: ['Address paying to create the pool. Can be anyone']
        },
        {
          name: 'tokenQuoteProgram'
          isMut: false
          isSigner: false
          docs: ['Program to create mint account and mint tokens']
        },
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'eventAuthority'
          isMut: false
          isSigner: false
        },
        {
          name: 'program'
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: 'params'
          type: {
            defined: 'InitializePoolParameters'
          }
        }
      ]
    },
    {
      name: 'initializeVirtualPoolWithToken2022'
      accounts: [
        {
          name: 'config'
          isMut: false
          isSigner: false
          docs: ['Which config the pool belongs to.']
        },
        {
          name: 'poolAuthority'
          isMut: false
          isSigner: false
        },
        {
          name: 'creator'
          isMut: false
          isSigner: false
        },
        {
          name: 'baseMint'
          isMut: true
          isSigner: true
          docs: ['Unique token mint address, initialize in contract']
        },
        {
          name: 'quoteMint'
          isMut: false
          isSigner: false
        },
        {
          name: 'pool'
          isMut: true
          isSigner: false
          docs: ['Initialize an account to store the pool state']
        },
        {
          name: 'baseVault'
          isMut: true
          isSigner: false
        },
        {
          name: 'quoteVault'
          isMut: true
          isSigner: false
          docs: ['Token quote vault for the pool']
        },
        {
          name: 'payer'
          isMut: true
          isSigner: true
          docs: ['Address paying to create the pool. Can be anyone']
        },
        {
          name: 'tokenQuoteProgram'
          isMut: false
          isSigner: false
          docs: ['Program to create mint account and mint tokens']
        },
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'eventAuthority'
          isMut: false
          isSigner: false
        },
        {
          name: 'program'
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: 'params'
          type: {
            defined: 'InitializePoolParameters'
          }
        }
      ]
    },
    {
      name: 'swap'
      accounts: [
        {
          name: 'poolAuthority'
          isMut: false
          isSigner: false
        },
        {
          name: 'config'
          isMut: false
          isSigner: false
          docs: ['config key']
        },
        {
          name: 'pool'
          isMut: true
          isSigner: false
          docs: ['Pool account']
        },
        {
          name: 'inputTokenAccount'
          isMut: true
          isSigner: false
          docs: ['The user token account for input token']
        },
        {
          name: 'outputTokenAccount'
          isMut: true
          isSigner: false
          docs: ['The user token account for output token']
        },
        {
          name: 'baseVault'
          isMut: true
          isSigner: false
          docs: ['The vault token account for base token']
        },
        {
          name: 'quoteVault'
          isMut: true
          isSigner: false
          docs: ['The vault token account for quote token']
        },
        {
          name: 'baseMint'
          isMut: false
          isSigner: false
          docs: ['The mint of base token']
        },
        {
          name: 'quoteMint'
          isMut: false
          isSigner: false
          docs: ['The mint of quote token']
        },
        {
          name: 'payer'
          isMut: false
          isSigner: true
          docs: ['The user performing the swap']
        },
        {
          name: 'tokenBaseProgram'
          isMut: false
          isSigner: false
          docs: ['Token base program']
        },
        {
          name: 'tokenQuoteProgram'
          isMut: false
          isSigner: false
          docs: ['Token quote program']
        },
        {
          name: 'referralTokenAccount'
          isMut: true
          isSigner: false
          isOptional: true
          docs: ['referral token account']
        },
        {
          name: 'eventAuthority'
          isMut: false
          isSigner: false
        },
        {
          name: 'program'
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: 'params'
          type: {
            defined: 'SwapParameters'
          }
        }
      ]
    },
    {
      name: 'migrationMeteoraDammCreateMetadata'
      docs: ['PERMISSIONLESS FUNCTIONS ///']
      accounts: [
        {
          name: 'virtualPool'
          isMut: false
          isSigner: false
        },
        {
          name: 'config'
          isMut: false
          isSigner: false
        },
        {
          name: 'migrationMetadata'
          isMut: true
          isSigner: false
        },
        {
          name: 'payer'
          isMut: true
          isSigner: true
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'eventAuthority'
          isMut: false
          isSigner: false
        },
        {
          name: 'program'
          isMut: false
          isSigner: false
        }
      ]
      args: []
    },
    {
      name: 'migrateMeteoraDamm'
      accounts: [
        {
          name: 'virtualPool'
          isMut: true
          isSigner: false
          docs: ['virtual pool']
        },
        {
          name: 'migrationMetadata'
          isMut: true
          isSigner: false
        },
        {
          name: 'config'
          isMut: false
          isSigner: false
        },
        {
          name: 'poolAuthority'
          isMut: true
          isSigner: false
        },
        {
          name: 'pool'
          isMut: true
          isSigner: false
        },
        {
          name: 'dammConfig'
          isMut: false
          isSigner: false
          docs: ['pool config']
        },
        {
          name: 'lpMint'
          isMut: true
          isSigner: false
        },
        {
          name: 'tokenAMint'
          isMut: true
          isSigner: false
        },
        {
          name: 'tokenBMint'
          isMut: false
          isSigner: false
        },
        {
          name: 'aVault'
          isMut: true
          isSigner: false
        },
        {
          name: 'bVault'
          isMut: true
          isSigner: false
        },
        {
          name: 'aTokenVault'
          isMut: true
          isSigner: false
        },
        {
          name: 'bTokenVault'
          isMut: true
          isSigner: false
        },
        {
          name: 'aVaultLpMint'
          isMut: true
          isSigner: false
        },
        {
          name: 'bVaultLpMint'
          isMut: true
          isSigner: false
        },
        {
          name: 'aVaultLp'
          isMut: true
          isSigner: false
        },
        {
          name: 'bVaultLp'
          isMut: true
          isSigner: false
        },
        {
          name: 'baseVault'
          isMut: true
          isSigner: false
        },
        {
          name: 'quoteVault'
          isMut: true
          isSigner: false
        },
        {
          name: 'virtualPoolLp'
          isMut: true
          isSigner: false
        },
        {
          name: 'protocolTokenAFee'
          isMut: true
          isSigner: false
        },
        {
          name: 'protocolTokenBFee'
          isMut: true
          isSigner: false
        },
        {
          name: 'payer'
          isMut: true
          isSigner: true
        },
        {
          name: 'rent'
          isMut: false
          isSigner: false
        },
        {
          name: 'mintMetadata'
          isMut: true
          isSigner: false
        },
        {
          name: 'metadataProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'ammProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'vaultProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
          docs: ['token_program']
        },
        {
          name: 'associatedTokenProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
          docs: ['System program.']
        }
      ]
      args: []
    },
    {
      name: 'migrateMeteoraDammLockLpTokenForCreator'
      accounts: [
        {
          name: 'migrationMetadata'
          isMut: true
          isSigner: false
          docs: ['presale']
        },
        {
          name: 'poolAuthority'
          isMut: true
          isSigner: false
        },
        {
          name: 'pool'
          isMut: true
          isSigner: false
        },
        {
          name: 'lpMint'
          isMut: false
          isSigner: false
        },
        {
          name: 'lockEscrow'
          isMut: true
          isSigner: false
        },
        {
          name: 'owner'
          isMut: false
          isSigner: false
        },
        {
          name: 'sourceTokens'
          isMut: true
          isSigner: false
        },
        {
          name: 'escrowVault'
          isMut: true
          isSigner: false
        },
        {
          name: 'ammProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'aVault'
          isMut: false
          isSigner: false
        },
        {
          name: 'bVault'
          isMut: false
          isSigner: false
        },
        {
          name: 'aVaultLp'
          isMut: false
          isSigner: false
        },
        {
          name: 'bVaultLp'
          isMut: false
          isSigner: false
        },
        {
          name: 'aVaultLpMint'
          isMut: false
          isSigner: false
        },
        {
          name: 'bVaultLpMint'
          isMut: false
          isSigner: false
        },
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
          docs: ['token_program']
        }
      ]
      args: []
    },
    {
      name: 'migrateMeteoraDammLockLpTokenForPartner'
      accounts: [
        {
          name: 'migrationMetadata'
          isMut: true
          isSigner: false
          docs: ['presale']
        },
        {
          name: 'poolAuthority'
          isMut: true
          isSigner: false
        },
        {
          name: 'pool'
          isMut: true
          isSigner: false
        },
        {
          name: 'lpMint'
          isMut: false
          isSigner: false
        },
        {
          name: 'lockEscrow'
          isMut: true
          isSigner: false
        },
        {
          name: 'owner'
          isMut: false
          isSigner: false
        },
        {
          name: 'sourceTokens'
          isMut: true
          isSigner: false
        },
        {
          name: 'escrowVault'
          isMut: true
          isSigner: false
        },
        {
          name: 'ammProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'aVault'
          isMut: false
          isSigner: false
        },
        {
          name: 'bVault'
          isMut: false
          isSigner: false
        },
        {
          name: 'aVaultLp'
          isMut: false
          isSigner: false
        },
        {
          name: 'bVaultLp'
          isMut: false
          isSigner: false
        },
        {
          name: 'aVaultLpMint'
          isMut: false
          isSigner: false
        },
        {
          name: 'bVaultLpMint'
          isMut: false
          isSigner: false
        },
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
          docs: ['token_program']
        }
      ]
      args: []
    }
  ]
  accounts: [
    {
      name: 'ClaimFeeOperator'
      docs: ['Parameter that set by the protocol']
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'operator'
            docs: ['operator']
            type: 'publicKey'
          },
          {
            name: 'padding'
            docs: ['Reserve']
            type: {
              array: ['u8', 128]
            }
          }
        ]
      }
    },
    {
      name: 'Config'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'quoteMint'
            docs: ['quote mint']
            type: 'publicKey'
          },
          {
            name: 'feeClaimer'
            docs: ['Address to get the fee']
            type: 'publicKey'
          },
          {
            name: 'owner'
            docs: ['Owner of that config key']
            type: 'publicKey'
          },
          {
            name: 'poolFees'
            docs: ['Pool fee']
            type: {
              defined: 'PoolFeesConfig'
            }
          },
          {
            name: 'collectFeeMode'
            docs: ['Collect fee mode']
            type: 'u8'
          },
          {
            name: 'migrationOption'
            docs: ['migration option']
            type: 'u8'
          },
          {
            name: 'activationType'
            docs: ['whether mode slot or timestamp']
            type: 'u8'
          },
          {
            name: 'tokenDecimal'
            docs: ['token decimals']
            type: 'u8'
          },
          {
            name: 'tokenType'
            docs: ['token type']
            type: 'u8'
          },
          {
            name: 'creatorPostMigrationFeePercentage'
            docs: ['creator post migration fee percentage']
            type: 'u8'
          },
          {
            name: 'padding0'
            docs: ['padding 0']
            type: {
              array: ['u8', 2]
            }
          },
          {
            name: 'swapBaseAmount'
            docs: ['swap base amount']
            type: 'u64'
          },
          {
            name: 'migrationQuoteThreshold'
            docs: ['migration quote threshold (in quote token)']
            type: 'u64'
          },
          {
            name: 'migrationBaseThreshold'
            docs: ['migration base threshold (in base token)']
            type: 'u64'
          },
          {
            name: 'padding'
            docs: ['padding']
            type: {
              array: ['u128', 8]
            }
          },
          {
            name: 'sqrtStartPrice'
            docs: ['minimum price']
            type: 'u128'
          },
          {
            name: 'curve'
            docs: [
              'curve, only use 20 point firstly, we can extend that latter'
            ]
            type: {
              array: [
                {
                  defined: 'LiquidityDistributionConfig'
                },
                20
              ]
            }
          }
        ]
      }
    },
    {
      name: 'MeteoraDammMigrationMetadata'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'virtualPool'
            docs: ['operator']
            type: 'publicKey'
          },
          {
            name: 'owner'
            docs: ['owner']
            type: 'publicKey'
          },
          {
            name: 'partner'
            docs: ['partner']
            type: 'publicKey'
          },
          {
            name: 'lpMint'
            docs: ['lp mint']
            type: 'publicKey'
          },
          {
            name: 'lpMintedAmountForCreator'
            docs: ['minted lp amount for creator']
            type: 'u64'
          },
          {
            name: 'lpMintedAmountForPartner'
            docs: ['minted lp amount for partner']
            type: 'u64'
          },
          {
            name: 'progress'
            docs: ['progress']
            type: 'u8'
          },
          {
            name: 'creatorLockedStatus'
            docs: ['flag to check whether lp is locked for creator']
            type: 'u8'
          },
          {
            name: 'partnerLockedStatus'
            docs: ['flag to check whether lp is locked for partner']
            type: 'u8'
          },
          {
            name: 'padding'
            docs: ['Reserve']
            type: {
              array: ['u8', 125]
            }
          }
        ]
      }
    },
    {
      name: 'VirtualPool'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'poolFees'
            docs: ['Pool fee']
            type: {
              defined: 'PoolFeesStruct'
            }
          },
          {
            name: 'config'
            docs: ['config key']
            type: 'publicKey'
          },
          {
            name: 'creator'
            docs: ['creator']
            type: 'publicKey'
          },
          {
            name: 'baseMint'
            docs: ['base mint']
            type: 'publicKey'
          },
          {
            name: 'baseVault'
            docs: ['base vault']
            type: 'publicKey'
          },
          {
            name: 'quoteVault'
            docs: ['quote vault']
            type: 'publicKey'
          },
          {
            name: 'baseReserve'
            docs: ['base reserve']
            type: 'u64'
          },
          {
            name: 'quoteReserve'
            docs: ['quote reserve']
            type: 'u64'
          },
          {
            name: 'protocolBaseFee'
            docs: ['protocol base fee']
            type: 'u64'
          },
          {
            name: 'protocolQuoteFee'
            docs: ['protocol quote fee']
            type: 'u64'
          },
          {
            name: 'tradingBaseFee'
            docs: ['trading base fee']
            type: 'u64'
          },
          {
            name: 'tradingQuoteFee'
            docs: ['trading quote fee']
            type: 'u64'
          },
          {
            name: 'sqrtPrice'
            docs: ['current price']
            type: 'u128'
          },
          {
            name: 'activationPoint'
            docs: ['Activation point']
            type: 'u64'
          },
          {
            name: 'poolType'
            docs: ['pool type, spl token or token2022']
            type: 'u8'
          },
          {
            name: 'isMigrated'
            docs: ['is migrated']
            type: 'u8'
          },
          {
            name: 'padding0'
            docs: ['padding']
            type: {
              array: ['u8', 6]
            }
          },
          {
            name: 'metrics'
            docs: ['pool metrics']
            type: {
              defined: 'PoolMetrics'
            }
          },
          {
            name: 'padding1'
            docs: ['Padding for further use']
            type: {
              array: ['u64', 10]
            }
          }
        ]
      }
    }
  ]
  types: [
    {
      name: 'InitializePoolParameters'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'symbol'
            type: 'string'
          },
          {
            name: 'uri'
            type: 'string'
          }
        ]
      }
    },
    {
      name: 'SwapParameters'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'amountIn'
            type: 'u64'
          },
          {
            name: 'minimumAmountOut'
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'ConfigParameters'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'poolFees'
            type: {
              defined: 'PoolFeeParamters'
            }
          },
          {
            name: 'collectFeeMode'
            type: 'u8'
          },
          {
            name: 'migrationOption'
            type: 'u8'
          },
          {
            name: 'activationType'
            type: 'u8'
          },
          {
            name: 'tokenType'
            type: 'u8'
          },
          {
            name: 'tokenDecimal'
            type: 'u8'
          },
          {
            name: 'creatorPostMigrationFeePercentage'
            type: 'u8'
          },
          {
            name: 'migrationQuoteThreshold'
            type: 'u64'
          },
          {
            name: 'sqrtStartPrice'
            type: 'u128'
          },
          {
            name: 'padding'
            docs: ['padding for future use']
            type: {
              array: ['u64', 6]
            }
          },
          {
            name: 'curve'
            type: {
              vec: {
                defined: 'LiquidityDistributionParameters'
              }
            }
          }
        ]
      }
    },
    {
      name: 'PoolFeeParamters'
      docs: ['Information regarding fee charges']
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'baseFee'
            docs: ['Base fee']
            type: {
              defined: 'BaseFeeParameters'
            }
          },
          {
            name: 'dynamicFee'
            docs: ['dynamic fee']
            type: {
              option: {
                defined: 'DynamicFeeParameters'
              }
            }
          }
        ]
      }
    },
    {
      name: 'BaseFeeParameters'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'cliffFeeNumerator'
            type: 'u64'
          },
          {
            name: 'numberOfPeriod'
            type: 'u16'
          },
          {
            name: 'periodFrequency'
            type: 'u64'
          },
          {
            name: 'reductionFactor'
            type: 'u64'
          },
          {
            name: 'feeSchedulerMode'
            type: 'u8'
          }
        ]
      }
    },
    {
      name: 'DynamicFeeParameters'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'binStep'
            type: 'u16'
          },
          {
            name: 'binStepU128'
            type: 'u128'
          },
          {
            name: 'filterPeriod'
            type: 'u16'
          },
          {
            name: 'decayPeriod'
            type: 'u16'
          },
          {
            name: 'reductionFactor'
            type: 'u16'
          },
          {
            name: 'maxVolatilityAccumulator'
            type: 'u32'
          },
          {
            name: 'variableFeeControl'
            type: 'u32'
          }
        ]
      }
    },
    {
      name: 'LiquidityDistributionParameters'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'sqrtPrice'
            type: 'u128'
          },
          {
            name: 'liquidity'
            type: 'u128'
          }
        ]
      }
    },
    {
      name: 'PoolFeesConfig'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'baseFee'
            type: {
              defined: 'BaseFeeConfig'
            }
          },
          {
            name: 'protocolFeePercent'
            type: 'u8'
          },
          {
            name: 'referralFeePercent'
            type: 'u8'
          },
          {
            name: 'padding0'
            type: {
              array: ['u8', 6]
            }
          },
          {
            name: 'dynamicFee'
            docs: ['dynamic fee']
            type: {
              defined: 'DynamicFeeConfig'
            }
          },
          {
            name: 'padding1'
            type: {
              array: ['u64', 2]
            }
          }
        ]
      }
    },
    {
      name: 'BaseFeeConfig'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'cliffFeeNumerator'
            type: 'u64'
          },
          {
            name: 'feeSchedulerMode'
            type: 'u8'
          },
          {
            name: 'padding'
            type: {
              array: ['u8', 5]
            }
          },
          {
            name: 'numberOfPeriod'
            type: 'u16'
          },
          {
            name: 'periodFrequency'
            type: 'u64'
          },
          {
            name: 'reductionFactor'
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'DynamicFeeConfig'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'initialized'
            type: 'u8'
          },
          {
            name: 'padding'
            type: {
              array: ['u8', 7]
            }
          },
          {
            name: 'maxVolatilityAccumulator'
            type: 'u32'
          },
          {
            name: 'variableFeeControl'
            type: 'u32'
          },
          {
            name: 'binStep'
            type: 'u16'
          },
          {
            name: 'filterPeriod'
            type: 'u16'
          },
          {
            name: 'decayPeriod'
            type: 'u16'
          },
          {
            name: 'reductionFactor'
            type: 'u16'
          },
          {
            name: 'binStepU128'
            type: 'u128'
          }
        ]
      }
    },
    {
      name: 'LiquidityDistributionConfig'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'sqrtPrice'
            type: 'u128'
          },
          {
            name: 'liquidity'
            type: 'u128'
          }
        ]
      }
    },
    {
      name: 'PoolFeesStruct'
      docs: [
        'Information regarding fee charges',
        'trading_fee = amount * trade_fee_numerator / denominator',
        'protocol_fee = trading_fee * protocol_fee_percentage / 100',
        'referral_fee = protocol_fee * referral_percentage / 100',
        'partner_fee = trading_fee - protocol_fee - referral_fee'
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'baseFee'
            docs: [
              'Trade fees are extra token amounts that are held inside the token',
              'accounts during a trade, making the value of liquidity tokens rise.',
              'Trade fee numerator'
            ]
            type: {
              defined: 'BaseFeeStruct'
            }
          },
          {
            name: 'protocolFeePercent'
            docs: [
              'Protocol trading fees are extra token amounts that are held inside the token',
              'accounts during a trade, with the equivalent in pool tokens minted to',
              'the protocol of the program.',
              'Protocol trade fee numerator'
            ]
            type: 'u8'
          },
          {
            name: 'referralFeePercent'
            docs: ['referral fee']
            type: 'u8'
          },
          {
            name: 'padding0'
            docs: ['padding']
            type: {
              array: ['u8', 6]
            }
          },
          {
            name: 'dynamicFee'
            docs: ['dynamic fee']
            type: {
              defined: 'DynamicFeeStruct'
            }
          },
          {
            name: 'padding1'
            docs: ['padding']
            type: {
              array: ['u64', 2]
            }
          }
        ]
      }
    },
    {
      name: 'BaseFeeStruct'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'cliffFeeNumerator'
            type: 'u64'
          },
          {
            name: 'feeSchedulerMode'
            type: 'u8'
          },
          {
            name: 'padding0'
            type: {
              array: ['u8', 5]
            }
          },
          {
            name: 'numberOfPeriod'
            type: 'u16'
          },
          {
            name: 'periodFrequency'
            type: 'u64'
          },
          {
            name: 'reductionFactor'
            type: 'u64'
          },
          {
            name: 'padding1'
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'DynamicFeeStruct'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'initialized'
            type: 'u8'
          },
          {
            name: 'padding'
            type: {
              array: ['u8', 7]
            }
          },
          {
            name: 'maxVolatilityAccumulator'
            type: 'u32'
          },
          {
            name: 'variableFeeControl'
            type: 'u32'
          },
          {
            name: 'binStep'
            type: 'u16'
          },
          {
            name: 'filterPeriod'
            type: 'u16'
          },
          {
            name: 'decayPeriod'
            type: 'u16'
          },
          {
            name: 'reductionFactor'
            type: 'u16'
          },
          {
            name: 'lastUpdateTimestamp'
            type: 'u64'
          },
          {
            name: 'binStepU128'
            type: 'u128'
          },
          {
            name: 'sqrtPriceReference'
            type: 'u128'
          },
          {
            name: 'volatilityAccumulator'
            type: 'u128'
          },
          {
            name: 'volatilityReference'
            type: 'u128'
          }
        ]
      }
    },
    {
      name: 'PoolMetrics'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'totalProtocolBaseFee'
            type: 'u64'
          },
          {
            name: 'totalProtocolQuoteFee'
            type: 'u64'
          },
          {
            name: 'totalTradingBaseFee'
            type: 'u64'
          },
          {
            name: 'totalTradingQuoteFee'
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'SwapResult'
      docs: ['Encodes all results of swapping']
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'outputAmount'
            type: 'u64'
          },
          {
            name: 'nextSqrtPrice'
            type: 'u128'
          },
          {
            name: 'tradingFee'
            type: 'u64'
          },
          {
            name: 'protocolFee'
            type: 'u64'
          },
          {
            name: 'referralFee'
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'Rounding'
      docs: ['Round up, down']
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'Up'
          },
          {
            name: 'Down'
          }
        ]
      }
    },
    {
      name: 'TradeDirection'
      docs: ['Trade (swap) direction']
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'BasetoQuote'
          },
          {
            name: 'QuotetoBase'
          }
        ]
      }
    },
    {
      name: 'MigrationOption'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'MeteoraDamm'
          }
        ]
      }
    },
    {
      name: 'TokenType'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'SplToken'
          },
          {
            name: 'Token2022'
          }
        ]
      }
    },
    {
      name: 'FeeSchedulerMode'
      docs: ['collect fee mode']
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'Linear'
          },
          {
            name: 'Exponential'
          }
        ]
      }
    },
    {
      name: 'MigrationMeteoraDammProgress'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'Init'
          },
          {
            name: 'CreatedPool'
          }
        ]
      }
    },
    {
      name: 'CollectFeeMode'
      docs: ['collect fee mode']
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'OnlyB'
          },
          {
            name: 'BothToken'
          }
        ]
      }
    },
    {
      name: 'PoolType'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'SplToken'
          },
          {
            name: 'Token2022'
          }
        ]
      }
    },
    {
      name: 'ActivationType'
      docs: ['Type of the activation']
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'Slot'
          },
          {
            name: 'Timestamp'
          }
        ]
      }
    },
    {
      name: 'TokenProgramFlags'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'TokenProgram'
          },
          {
            name: 'TokenProgram2022'
          }
        ]
      }
    }
  ]
  events: [
    {
      name: 'EvtCreateConfig'
      fields: [
        {
          name: 'config'
          type: 'publicKey'
          index: false
        },
        {
          name: 'quoteMint'
          type: 'publicKey'
          index: false
        },
        {
          name: 'feeClaimer'
          type: 'publicKey'
          index: false
        },
        {
          name: 'owner'
          type: 'publicKey'
          index: false
        },
        {
          name: 'poolFees'
          type: {
            defined: 'PoolFeeParamters'
          }
          index: false
        },
        {
          name: 'collectFeeMode'
          type: 'u8'
          index: false
        },
        {
          name: 'migrationOption'
          type: 'u8'
          index: false
        },
        {
          name: 'activationType'
          type: 'u8'
          index: false
        },
        {
          name: 'tokenDecimal'
          type: 'u8'
          index: false
        },
        {
          name: 'tokenType'
          type: 'u8'
          index: false
        },
        {
          name: 'swapBaseAmount'
          type: 'u64'
          index: false
        },
        {
          name: 'migrationQuoteThreshold'
          type: 'u64'
          index: false
        },
        {
          name: 'migrationBaseAmount'
          type: 'u64'
          index: false
        },
        {
          name: 'sqrtStartPrice'
          type: 'u128'
          index: false
        },
        {
          name: 'curve'
          type: {
            vec: {
              defined: 'LiquidityDistributionParameters'
            }
          }
          index: false
        }
      ]
    },
    {
      name: 'EvtCreateClaimFeeOperator'
      fields: [
        {
          name: 'operator'
          type: 'publicKey'
          index: false
        }
      ]
    },
    {
      name: 'EvtCloseClaimFeeOperator'
      fields: [
        {
          name: 'claimFeeOperator'
          type: 'publicKey'
          index: false
        },
        {
          name: 'operator'
          type: 'publicKey'
          index: false
        }
      ]
    },
    {
      name: 'EvtInitializePool'
      fields: [
        {
          name: 'pool'
          type: 'publicKey'
          index: false
        },
        {
          name: 'config'
          type: 'publicKey'
          index: false
        },
        {
          name: 'creator'
          type: 'publicKey'
          index: false
        },
        {
          name: 'baseMint'
          type: 'publicKey'
          index: false
        },
        {
          name: 'poolType'
          type: 'u8'
          index: false
        },
        {
          name: 'activationPoint'
          type: 'u64'
          index: false
        }
      ]
    },
    {
      name: 'EvtSwap'
      fields: [
        {
          name: 'pool'
          type: 'publicKey'
          index: false
        },
        {
          name: 'config'
          type: 'publicKey'
          index: false
        },
        {
          name: 'tradeDirection'
          type: 'u8'
          index: false
        },
        {
          name: 'isReferral'
          type: 'bool'
          index: false
        },
        {
          name: 'params'
          type: {
            defined: 'SwapParameters'
          }
          index: false
        },
        {
          name: 'swapResult'
          type: {
            defined: 'SwapResult'
          }
          index: false
        },
        {
          name: 'transferFeeExcludedAmountIn'
          type: 'u64'
          index: false
        },
        {
          name: 'currentTimestamp'
          type: 'u64'
          index: false
        }
      ]
    },
    {
      name: 'EvtCurveComplete'
      fields: [
        {
          name: 'pool'
          type: 'publicKey'
          index: false
        },
        {
          name: 'config'
          type: 'publicKey'
          index: false
        },
        {
          name: 'baseReserve'
          type: 'u64'
          index: false
        },
        {
          name: 'quoteReserve'
          type: 'u64'
          index: false
        }
      ]
    },
    {
      name: 'EvtClaimProtocolFee'
      fields: [
        {
          name: 'pool'
          type: 'publicKey'
          index: false
        },
        {
          name: 'tokenBaseAmount'
          type: 'u64'
          index: false
        },
        {
          name: 'tokenQuoteAmount'
          type: 'u64'
          index: false
        }
      ]
    },
    {
      name: 'EvtClaimTradingFee'
      fields: [
        {
          name: 'pool'
          type: 'publicKey'
          index: false
        },
        {
          name: 'tokenBaseAmount'
          type: 'u64'
          index: false
        },
        {
          name: 'tokenQuoteAmount'
          type: 'u64'
          index: false
        }
      ]
    },
    {
      name: 'EvtCreateMeteoraMigrationMetadata'
      fields: [
        {
          name: 'virtualPool'
          type: 'publicKey'
          index: false
        }
      ]
    }
  ]
  errors: [
    {
      code: 6000
      name: 'MathOverflow'
      msg: 'Math operation overflow'
    },
    {
      code: 6001
      name: 'InvalidFee'
      msg: 'Invalid fee setup'
    },
    {
      code: 6002
      name: 'InvalidInvariant'
      msg: 'Invalid invariant d'
    },
    {
      code: 6003
      name: 'FeeCalculationFailure'
      msg: 'Fee calculation failure'
    },
    {
      code: 6004
      name: 'ExceededSlippage'
      msg: 'Exceeded slippage tolerance'
    },
    {
      code: 6005
      name: 'InvalidCalculation'
      msg: 'Invalid curve calculation'
    },
    {
      code: 6006
      name: 'ZeroTradingTokens'
      msg: 'Given pool token amount results in zero trading tokens'
    },
    {
      code: 6007
      name: 'ConversionError'
      msg: 'Math conversion overflow'
    },
    {
      code: 6008
      name: 'FaultyLpMint'
      msg: "LP mint authority must be 'A' vault lp, without freeze authority, and 0 supply"
    },
    {
      code: 6009
      name: 'MismatchedTokenMint'
      msg: 'Token mint mismatched'
    },
    {
      code: 6010
      name: 'MismatchedLpMint'
      msg: 'LP mint mismatched'
    },
    {
      code: 6011
      name: 'MismatchedOwner'
      msg: 'Invalid lp token owner'
    },
    {
      code: 6012
      name: 'InvalidVaultAccount'
      msg: 'Invalid vault account'
    },
    {
      code: 6013
      name: 'InvalidVaultLpAccount'
      msg: 'Invalid vault lp account'
    },
    {
      code: 6014
      name: 'InvalidPoolLpMintAccount'
      msg: 'Invalid pool lp mint account'
    },
    {
      code: 6015
      name: 'PoolDisabled'
      msg: 'Pool disabled'
    },
    {
      code: 6016
      name: 'InvalidAdminAccount'
      msg: 'Invalid admin account'
    },
    {
      code: 6017
      name: 'InvalidProtocolFeeAccount'
      msg: 'Invalid protocol fee account'
    },
    {
      code: 6018
      name: 'SameAdminAccount'
      msg: 'Same admin account'
    },
    {
      code: 6019
      name: 'IdenticalSourceDestination'
      msg: 'Identical user source and destination token account'
    },
    {
      code: 6020
      name: 'ApyCalculationError'
      msg: 'Apy calculation error'
    },
    {
      code: 6021
      name: 'InsufficientSnapshot'
      msg: 'Insufficient virtual price snapshot'
    },
    {
      code: 6022
      name: 'NonUpdatableCurve'
      msg: 'Current curve is non-updatable'
    },
    {
      code: 6023
      name: 'MisMatchedCurve'
      msg: 'New curve is mismatched with old curve'
    },
    {
      code: 6024
      name: 'InvalidAmplification'
      msg: 'Amplification is invalid'
    },
    {
      code: 6025
      name: 'UnsupportedOperation'
      msg: 'Operation is not supported'
    },
    {
      code: 6026
      name: 'ExceedMaxAChanges'
      msg: 'Exceed max amplification changes'
    },
    {
      code: 6027
      name: 'InvalidRemainingAccountsLen'
      msg: 'Invalid remaining accounts length'
    },
    {
      code: 6028
      name: 'InvalidRemainingAccounts'
      msg: 'Invalid remaining account'
    },
    {
      code: 6029
      name: 'MismatchedDepegMint'
      msg: "Token mint B doesn't matches depeg type token mint"
    },
    {
      code: 6030
      name: 'InvalidApyAccount'
      msg: 'Invalid APY account'
    },
    {
      code: 6031
      name: 'InvalidTokenMultiplier'
      msg: 'Invalid token multiplier'
    },
    {
      code: 6032
      name: 'InvalidDepegInformation'
      msg: 'Invalid depeg information'
    },
    {
      code: 6033
      name: 'UpdateTimeConstraint'
      msg: 'Update time constraint violated'
    },
    {
      code: 6034
      name: 'ExceedMaxFeeBps'
      msg: 'Exceeded max fee bps'
    },
    {
      code: 6035
      name: 'InvalidAdmin'
      msg: 'Invalid admin'
    },
    {
      code: 6036
      name: 'PoolIsNotPermissioned'
      msg: 'Pool is not permissioned'
    },
    {
      code: 6037
      name: 'InvalidDepositAmount'
      msg: 'Invalid deposit amount'
    },
    {
      code: 6038
      name: 'InvalidFeeOwner'
      msg: 'Invalid fee owner'
    },
    {
      code: 6039
      name: 'NonDepletedPool'
      msg: 'Pool is not depleted'
    },
    {
      code: 6040
      name: 'AmountNotPeg'
      msg: 'Token amount is not 1:1'
    },
    {
      code: 6041
      name: 'AmountIsZero'
      msg: 'Amount is zero'
    },
    {
      code: 6042
      name: 'TypeCastFailed'
      msg: 'Type cast error'
    },
    {
      code: 6043
      name: 'AmountIsNotEnough'
      msg: 'Amount is not enough'
    },
    {
      code: 6044
      name: 'InvalidActivationDuration'
      msg: 'Invalid activation duration'
    },
    {
      code: 6045
      name: 'PoolIsNotLaunchPool'
      msg: 'Pool is not launch pool'
    },
    {
      code: 6046
      name: 'UnableToModifyActivationPoint'
      msg: 'Unable to modify activation point'
    },
    {
      code: 6047
      name: 'InvalidAuthorityToCreateThePool'
      msg: 'Invalid authority to create the pool'
    },
    {
      code: 6048
      name: 'InvalidActivationType'
      msg: 'Invalid activation type'
    },
    {
      code: 6049
      name: 'InvalidActivationPoint'
      msg: 'Invalid activation point'
    },
    {
      code: 6050
      name: 'PreActivationSwapStarted'
      msg: 'Pre activation swap window started'
    },
    {
      code: 6051
      name: 'InvalidPoolType'
      msg: 'Invalid pool type'
    },
    {
      code: 6052
      name: 'InvalidQuoteMint'
      msg: 'Quote token must be SOL,USDC'
    },
    {
      code: 6053
      name: 'InvalidFeeCurve'
      msg: 'Invalid fee curve'
    },
    {
      code: 6054
      name: 'InvalidPriceRange'
      msg: 'Invalid Price Range'
    },
    {
      code: 6055
      name: 'PriceRangeViolation'
      msg: 'Trade is over price range'
    },
    {
      code: 6056
      name: 'InvalidParameters'
      msg: 'Invalid parameters'
    },
    {
      code: 6057
      name: 'InvalidCollectFeeMode'
      msg: 'Invalid collect fee mode'
    },
    {
      code: 6058
      name: 'InvalidInput'
      msg: 'Invalid input'
    },
    {
      code: 6059
      name: 'CannotCreateTokenBadgeOnSupportedMint'
      msg: 'Cannot create token badge on supported mint'
    },
    {
      code: 6060
      name: 'InvalidTokenBadge'
      msg: 'Invalid token badge'
    },
    {
      code: 6061
      name: 'InvalidMinimumLiquidity'
      msg: 'Invalid minimum liquidity'
    },
    {
      code: 6062
      name: 'InvalidPositionOwner'
      msg: 'Invalid position owner'
    },
    {
      code: 6063
      name: 'InvalidVestingInfo'
      msg: 'Invalid vesting information'
    },
    {
      code: 6064
      name: 'InsufficientLiquidity'
      msg: 'Insufficient liquidity'
    },
    {
      code: 6065
      name: 'InvalidVestingAccount'
      msg: 'Invalid vesting account'
    },
    {
      code: 6066
      name: 'InvalidPoolStatus'
      msg: 'Invalid pool status'
    },
    {
      code: 6067
      name: 'UnsupportNativeMintToken2022'
      msg: 'Unsupported native mint token2022'
    },
    {
      code: 6068
      name: 'RewardMintIsNotSupport'
      msg: 'Reward mint is not support'
    },
    {
      code: 6069
      name: 'InvalidRewardIndex'
      msg: 'Invalid reward index'
    },
    {
      code: 6070
      name: 'InvalidRewardDuration'
      msg: 'Invalid reward duration'
    },
    {
      code: 6071
      name: 'RewardInitialized'
      msg: 'Reward already initialized'
    },
    {
      code: 6072
      name: 'RewardUninitialized'
      msg: 'Reward not initialized'
    },
    {
      code: 6073
      name: 'InvalidRewardVault'
      msg: 'Invalid reward vault'
    },
    {
      code: 6074
      name: 'MustWithdrawnIneligibleReward'
      msg: 'Must withdraw ineligible reward'
    },
    {
      code: 6075
      name: 'WithdrawToWrongTokenAccount'
      msg: 'Withdraw to wrong token account'
    },
    {
      code: 6076
      name: 'IdenticalRewardDuration'
      msg: 'Reward duration is the same'
    },
    {
      code: 6077
      name: 'RewardCampaignInProgress'
      msg: 'Reward campaign in progress'
    },
    {
      code: 6078
      name: 'IdenticalFunder'
      msg: 'Identical funder'
    },
    {
      code: 6079
      name: 'InvalidFunder'
      msg: 'Invalid funder'
    },
    {
      code: 6080
      name: 'RewardNotEnded'
      msg: 'Reward not ended'
    },
    {
      code: 6081
      name: 'InvalidExtension'
      msg: 'Invalid extension'
    },
    {
      code: 6082
      name: 'FeeInverseIsIncorrect'
      msg: 'Fee inverse is incorrect'
    },
    {
      code: 6083
      name: 'NotEnoughLiquidity'
      msg: 'Not enough liquidity'
    },
    {
      code: 6084
      name: 'PoolIsCompleted'
      msg: 'Pool is completed'
    },
    {
      code: 6085
      name: 'PoolIsIncompleted'
      msg: 'Pool is incompleted'
    },
    {
      code: 6086
      name: 'InvalidMigrationOption'
      msg: 'Invalid migration option'
    },
    {
      code: 6087
      name: 'InvalidTokenDecimals'
      msg: 'Invalid activation type'
    },
    {
      code: 6088
      name: 'InvalidTokenType'
      msg: 'Invalid token type'
    },
    {
      code: 6089
      name: 'InvalidFeePercentage'
      msg: 'Invalid fee percentage'
    },
    {
      code: 6090
      name: 'InvalidQuoteThreshold'
      msg: 'Invalid quote threshold'
    },
    {
      code: 6091
      name: 'InvalidCurve'
      msg: 'Invalid curve'
    },
    {
      code: 6092
      name: 'NotPermitToDoThisAction'
      msg: 'Not permit to do this action'
    },
    {
      code: 6093
      name: 'InvalidPartnerAccount'
      msg: 'Invalid partner account'
    },
    {
      code: 6094
      name: 'InvalidOwnerAccount'
      msg: 'Invalid owner account'
    },
    {
      code: 6095
      name: 'InvalidConfigAccount'
      msg: 'Invalid config account'
    }
  ]
}

export const Idl: IDL = {
  version: '0.1.0',
  name: 'virtual_curve',
  metadata: {
    address: '2grmPSxKzQBhRrTRjWazVtMkRGFbFaqLakxGEZfnXB5u',
  },
  instructions: [
    {
      name: 'createClaimFeeOperator',
      docs: ['ADMIN FUNCTIONS ////'],
      accounts: [
        {
          name: 'claimFeeOperator',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'operator',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'admin',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'eventAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'program',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'closeClaimFeeOperator',
      accounts: [
        {
          name: 'claimFeeOperator',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'rentReceiver',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'admin',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'eventAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'program',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'claimProtocolFee',
      accounts: [
        {
          name: 'poolAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'config',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'pool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'baseVault',
          isMut: true,
          isSigner: false,
          docs: ['The vault token account for input token'],
        },
        {
          name: 'quoteVault',
          isMut: true,
          isSigner: false,
          docs: ['The vault token account for output token'],
        },
        {
          name: 'baseMint',
          isMut: false,
          isSigner: false,
          docs: ['The mint of token a'],
        },
        {
          name: 'quoteMint',
          isMut: false,
          isSigner: false,
          docs: ['The mint of token b'],
        },
        {
          name: 'tokenBaseAccount',
          isMut: true,
          isSigner: false,
          docs: ['The treasury token a account'],
        },
        {
          name: 'tokenQuoteAccount',
          isMut: true,
          isSigner: false,
          docs: ['The treasury token b account'],
        },
        {
          name: 'claimFeeOperator',
          isMut: false,
          isSigner: false,
          docs: ['Claim fee operator'],
        },
        {
          name: 'operator',
          isMut: false,
          isSigner: true,
          docs: ['Operator'],
        },
        {
          name: 'tokenBaseProgram',
          isMut: false,
          isSigner: false,
          docs: ['Token a program'],
        },
        {
          name: 'tokenQuoteProgram',
          isMut: false,
          isSigner: false,
          docs: ['Token b program'],
        },
        {
          name: 'eventAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'program',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'createConfig',
      docs: ['PARTNER FUNCTIONS ////'],
      accounts: [
        {
          name: 'config',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'feeClaimer',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'owner',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'quoteMint',
          isMut: false,
          isSigner: false,
          docs: ['quote mint'],
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'eventAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'program',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'configParameters',
          type: {
            defined: 'ConfigParameters',
          },
        },
      ],
    },
    {
      name: 'claimTradingFee',
      accounts: [
        {
          name: 'poolAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'config',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'pool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenAAccount',
          isMut: true,
          isSigner: false,
          docs: ['The treasury token a account'],
        },
        {
          name: 'tokenBAccount',
          isMut: true,
          isSigner: false,
          docs: ['The treasury token b account'],
        },
        {
          name: 'baseVault',
          isMut: true,
          isSigner: false,
          docs: ['The vault token account for input token'],
        },
        {
          name: 'quoteVault',
          isMut: true,
          isSigner: false,
          docs: ['The vault token account for output token'],
        },
        {
          name: 'baseMint',
          isMut: false,
          isSigner: false,
          docs: ['The mint of token a'],
        },
        {
          name: 'quoteMint',
          isMut: false,
          isSigner: false,
          docs: ['The mint of token b'],
        },
        {
          name: 'feeClaimer',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'tokenBaseProgram',
          isMut: false,
          isSigner: false,
          docs: ['Token a program'],
        },
        {
          name: 'tokenQuoteProgram',
          isMut: false,
          isSigner: false,
          docs: ['Token b program'],
        },
        {
          name: 'eventAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'program',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'maxAmountA',
          type: 'u64',
        },
        {
          name: 'maxAmountB',
          type: 'u64',
        },
      ],
    },
    {
      name: 'initializeVirtualPoolWithSplToken',
      docs: ['USER FUNCTIONS ////'],
      accounts: [
        {
          name: 'config',
          isMut: false,
          isSigner: false,
          docs: ['Which config the pool belongs to.'],
        },
        {
          name: 'poolAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'creator',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'baseMint',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'quoteMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'pool',
          isMut: true,
          isSigner: false,
          docs: ['Initialize an account to store the pool state'],
        },
        {
          name: 'baseVault',
          isMut: true,
          isSigner: false,
          docs: ['Token a vault for the pool'],
        },
        {
          name: 'quoteVault',
          isMut: true,
          isSigner: false,
          docs: ['Token b vault for the pool'],
        },
        {
          name: 'mintMetadata',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'metadataProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
          docs: ['Address paying to create the pool. Can be anyone'],
        },
        {
          name: 'tokenQuoteProgram',
          isMut: false,
          isSigner: false,
          docs: ['Program to create mint account and mint tokens'],
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'eventAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'program',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'params',
          type: {
            defined: 'InitializePoolParameters',
          },
        },
      ],
    },
    {
      name: 'initializeVirtualPoolWithToken2022',
      accounts: [
        {
          name: 'config',
          isMut: false,
          isSigner: false,
          docs: ['Which config the pool belongs to.'],
        },
        {
          name: 'poolAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'creator',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'baseMint',
          isMut: true,
          isSigner: true,
          docs: ['Unique token mint address, initialize in contract'],
        },
        {
          name: 'quoteMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'pool',
          isMut: true,
          isSigner: false,
          docs: ['Initialize an account to store the pool state'],
        },
        {
          name: 'baseVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'quoteVault',
          isMut: true,
          isSigner: false,
          docs: ['Token quote vault for the pool'],
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
          docs: ['Address paying to create the pool. Can be anyone'],
        },
        {
          name: 'tokenQuoteProgram',
          isMut: false,
          isSigner: false,
          docs: ['Program to create mint account and mint tokens'],
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'eventAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'program',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'params',
          type: {
            defined: 'InitializePoolParameters',
          },
        },
      ],
    },
    {
      name: 'swap',
      accounts: [
        {
          name: 'poolAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'config',
          isMut: false,
          isSigner: false,
          docs: ['config key'],
        },
        {
          name: 'pool',
          isMut: true,
          isSigner: false,
          docs: ['Pool account'],
        },
        {
          name: 'inputTokenAccount',
          isMut: true,
          isSigner: false,
          docs: ['The user token account for input token'],
        },
        {
          name: 'outputTokenAccount',
          isMut: true,
          isSigner: false,
          docs: ['The user token account for output token'],
        },
        {
          name: 'baseVault',
          isMut: true,
          isSigner: false,
          docs: ['The vault token account for base token'],
        },
        {
          name: 'quoteVault',
          isMut: true,
          isSigner: false,
          docs: ['The vault token account for quote token'],
        },
        {
          name: 'baseMint',
          isMut: false,
          isSigner: false,
          docs: ['The mint of base token'],
        },
        {
          name: 'quoteMint',
          isMut: false,
          isSigner: false,
          docs: ['The mint of quote token'],
        },
        {
          name: 'payer',
          isMut: false,
          isSigner: true,
          docs: ['The user performing the swap'],
        },
        {
          name: 'tokenBaseProgram',
          isMut: false,
          isSigner: false,
          docs: ['Token base program'],
        },
        {
          name: 'tokenQuoteProgram',
          isMut: false,
          isSigner: false,
          docs: ['Token quote program'],
        },
        {
          name: 'referralTokenAccount',
          isMut: true,
          isSigner: false,
          isOptional: true,
          docs: ['referral token account'],
        },
        {
          name: 'eventAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'program',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'params',
          type: {
            defined: 'SwapParameters',
          },
        },
      ],
    },
    {
      name: 'migrationMeteoraDammCreateMetadata',
      docs: ['PERMISSIONLESS FUNCTIONS ///'],
      accounts: [
        {
          name: 'virtualPool',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'config',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'migrationMetadata',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'eventAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'program',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'migrateMeteoraDamm',
      accounts: [
        {
          name: 'virtualPool',
          isMut: true,
          isSigner: false,
          docs: ['virtual pool'],
        },
        {
          name: 'migrationMetadata',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'config',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'poolAuthority',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'pool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'dammConfig',
          isMut: false,
          isSigner: false,
          docs: ['pool config'],
        },
        {
          name: 'lpMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenAMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenBMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'aVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'bVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'aTokenVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'bTokenVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'aVaultLpMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'bVaultLpMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'aVaultLp',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'bVaultLp',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'baseVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'quoteVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'virtualPoolLp',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'protocolTokenAFee',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'protocolTokenBFee',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'mintMetadata',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'metadataProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'ammProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'vaultProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
          docs: ['token_program'],
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
          docs: ['System program.'],
        },
      ],
      args: [],
    },
    {
      name: 'migrateMeteoraDammLockLpTokenForCreator',
      accounts: [
        {
          name: 'migrationMetadata',
          isMut: true,
          isSigner: false,
          docs: ['presale'],
        },
        {
          name: 'poolAuthority',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'pool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'lpMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'lockEscrow',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'owner',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'sourceTokens',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'escrowVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'ammProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'aVault',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'bVault',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'aVaultLp',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'bVaultLp',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'aVaultLpMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'bVaultLpMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
          docs: ['token_program'],
        },
      ],
      args: [],
    },
    {
      name: 'migrateMeteoraDammLockLpTokenForPartner',
      accounts: [
        {
          name: 'migrationMetadata',
          isMut: true,
          isSigner: false,
          docs: ['presale'],
        },
        {
          name: 'poolAuthority',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'pool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'lpMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'lockEscrow',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'owner',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'sourceTokens',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'escrowVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'ammProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'aVault',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'bVault',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'aVaultLp',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'bVaultLp',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'aVaultLpMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'bVaultLpMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
          docs: ['token_program'],
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: 'ClaimFeeOperator',
      docs: ['Parameter that set by the protocol'],
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'operator',
            docs: ['operator'],
            type: 'publicKey',
          },
          {
            name: 'padding',
            docs: ['Reserve'],
            type: {
              array: ['u8', 128],
            },
          },
        ],
      },
    },
    {
      name: 'Config',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'quoteMint',
            docs: ['quote mint'],
            type: 'publicKey',
          },
          {
            name: 'feeClaimer',
            docs: ['Address to get the fee'],
            type: 'publicKey',
          },
          {
            name: 'owner',
            docs: ['Owner of that config key'],
            type: 'publicKey',
          },
          {
            name: 'poolFees',
            docs: ['Pool fee'],
            type: {
              defined: 'PoolFeesConfig',
            },
          },
          {
            name: 'collectFeeMode',
            docs: ['Collect fee mode'],
            type: 'u8',
          },
          {
            name: 'migrationOption',
            docs: ['migration option'],
            type: 'u8',
          },
          {
            name: 'activationType',
            docs: ['whether mode slot or timestamp'],
            type: 'u8',
          },
          {
            name: 'tokenDecimal',
            docs: ['token decimals'],
            type: 'u8',
          },
          {
            name: 'tokenType',
            docs: ['token type'],
            type: 'u8',
          },
          {
            name: 'creatorPostMigrationFeePercentage',
            docs: ['creator post migration fee percentage'],
            type: 'u8',
          },
          {
            name: 'padding0',
            docs: ['padding 0'],
            type: {
              array: ['u8', 2],
            },
          },
          {
            name: 'swapBaseAmount',
            docs: ['swap base amount'],
            type: 'u64',
          },
          {
            name: 'migrationQuoteThreshold',
            docs: ['migration quote threshold (in quote token)'],
            type: 'u64',
          },
          {
            name: 'migrationBaseThreshold',
            docs: ['migration base threshold (in base token)'],
            type: 'u64',
          },
          {
            name: 'padding',
            docs: ['padding'],
            type: {
              array: ['u128', 8],
            },
          },
          {
            name: 'sqrtStartPrice',
            docs: ['minimum price'],
            type: 'u128',
          },
          {
            name: 'curve',
            docs: [
              'curve, only use 20 point firstly, we can extend that latter',
            ],
            type: {
              array: [
                {
                  defined: 'LiquidityDistributionConfig',
                },
                20,
              ],
            },
          },
        ],
      },
    },
    {
      name: 'MeteoraDammMigrationMetadata',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'virtualPool',
            docs: ['operator'],
            type: 'publicKey',
          },
          {
            name: 'owner',
            docs: ['owner'],
            type: 'publicKey',
          },
          {
            name: 'partner',
            docs: ['partner'],
            type: 'publicKey',
          },
          {
            name: 'lpMint',
            docs: ['lp mint'],
            type: 'publicKey',
          },
          {
            name: 'lpMintedAmountForCreator',
            docs: ['minted lp amount for creator'],
            type: 'u64',
          },
          {
            name: 'lpMintedAmountForPartner',
            docs: ['minted lp amount for partner'],
            type: 'u64',
          },
          {
            name: 'progress',
            docs: ['progress'],
            type: 'u8',
          },
          {
            name: 'creatorLockedStatus',
            docs: ['flag to check whether lp is locked for creator'],
            type: 'u8',
          },
          {
            name: 'partnerLockedStatus',
            docs: ['flag to check whether lp is locked for partner'],
            type: 'u8',
          },
          {
            name: 'padding',
            docs: ['Reserve'],
            type: {
              array: ['u8', 125],
            },
          },
        ],
      },
    },
    {
      name: 'VirtualPool',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'poolFees',
            docs: ['Pool fee'],
            type: {
              defined: 'PoolFeesStruct',
            },
          },
          {
            name: 'config',
            docs: ['config key'],
            type: 'publicKey',
          },
          {
            name: 'creator',
            docs: ['creator'],
            type: 'publicKey',
          },
          {
            name: 'baseMint',
            docs: ['base mint'],
            type: 'publicKey',
          },
          {
            name: 'baseVault',
            docs: ['base vault'],
            type: 'publicKey',
          },
          {
            name: 'quoteVault',
            docs: ['quote vault'],
            type: 'publicKey',
          },
          {
            name: 'baseReserve',
            docs: ['base reserve'],
            type: 'u64',
          },
          {
            name: 'quoteReserve',
            docs: ['quote reserve'],
            type: 'u64',
          },
          {
            name: 'protocolBaseFee',
            docs: ['protocol base fee'],
            type: 'u64',
          },
          {
            name: 'protocolQuoteFee',
            docs: ['protocol quote fee'],
            type: 'u64',
          },
          {
            name: 'tradingBaseFee',
            docs: ['trading base fee'],
            type: 'u64',
          },
          {
            name: 'tradingQuoteFee',
            docs: ['trading quote fee'],
            type: 'u64',
          },
          {
            name: 'sqrtPrice',
            docs: ['current price'],
            type: 'u128',
          },
          {
            name: 'activationPoint',
            docs: ['Activation point'],
            type: 'u64',
          },
          {
            name: 'poolType',
            docs: ['pool type, spl token or token2022'],
            type: 'u8',
          },
          {
            name: 'isMigrated',
            docs: ['is migrated'],
            type: 'u8',
          },
          {
            name: 'padding0',
            docs: ['padding'],
            type: {
              array: ['u8', 6],
            },
          },
          {
            name: 'metrics',
            docs: ['pool metrics'],
            type: {
              defined: 'PoolMetrics',
            },
          },
          {
            name: 'padding1',
            docs: ['Padding for further use'],
            type: {
              array: ['u64', 10],
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'InitializePoolParameters',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'symbol',
            type: 'string',
          },
          {
            name: 'uri',
            type: 'string',
          },
        ],
      },
    },
    {
      name: 'SwapParameters',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'amountIn',
            type: 'u64',
          },
          {
            name: 'minimumAmountOut',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'ConfigParameters',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'poolFees',
            type: {
              defined: 'PoolFeeParamters',
            },
          },
          {
            name: 'collectFeeMode',
            type: 'u8',
          },
          {
            name: 'migrationOption',
            type: 'u8',
          },
          {
            name: 'activationType',
            type: 'u8',
          },
          {
            name: 'tokenType',
            type: 'u8',
          },
          {
            name: 'tokenDecimal',
            type: 'u8',
          },
          {
            name: 'creatorPostMigrationFeePercentage',
            type: 'u8',
          },
          {
            name: 'migrationQuoteThreshold',
            type: 'u64',
          },
          {
            name: 'sqrtStartPrice',
            type: 'u128',
          },
          {
            name: 'padding',
            docs: ['padding for future use'],
            type: {
              array: ['u64', 6],
            },
          },
          {
            name: 'curve',
            type: {
              vec: {
                defined: 'LiquidityDistributionParameters',
              },
            },
          },
        ],
      },
    },
    {
      name: 'PoolFeeParamters',
      docs: ['Information regarding fee charges'],
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'baseFee',
            docs: ['Base fee'],
            type: {
              defined: 'BaseFeeParameters',
            },
          },
          {
            name: 'dynamicFee',
            docs: ['dynamic fee'],
            type: {
              option: {
                defined: 'DynamicFeeParameters',
              },
            },
          },
        ],
      },
    },
    {
      name: 'BaseFeeParameters',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'cliffFeeNumerator',
            type: 'u64',
          },
          {
            name: 'numberOfPeriod',
            type: 'u16',
          },
          {
            name: 'periodFrequency',
            type: 'u64',
          },
          {
            name: 'reductionFactor',
            type: 'u64',
          },
          {
            name: 'feeSchedulerMode',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'DynamicFeeParameters',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'binStep',
            type: 'u16',
          },
          {
            name: 'binStepU128',
            type: 'u128',
          },
          {
            name: 'filterPeriod',
            type: 'u16',
          },
          {
            name: 'decayPeriod',
            type: 'u16',
          },
          {
            name: 'reductionFactor',
            type: 'u16',
          },
          {
            name: 'maxVolatilityAccumulator',
            type: 'u32',
          },
          {
            name: 'variableFeeControl',
            type: 'u32',
          },
        ],
      },
    },
    {
      name: 'LiquidityDistributionParameters',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'sqrtPrice',
            type: 'u128',
          },
          {
            name: 'liquidity',
            type: 'u128',
          },
        ],
      },
    },
    {
      name: 'PoolFeesConfig',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'baseFee',
            type: {
              defined: 'BaseFeeConfig',
            },
          },
          {
            name: 'protocolFeePercent',
            type: 'u8',
          },
          {
            name: 'referralFeePercent',
            type: 'u8',
          },
          {
            name: 'padding0',
            type: {
              array: ['u8', 6],
            },
          },
          {
            name: 'dynamicFee',
            docs: ['dynamic fee'],
            type: {
              defined: 'DynamicFeeConfig',
            },
          },
          {
            name: 'padding1',
            type: {
              array: ['u64', 2],
            },
          },
        ],
      },
    },
    {
      name: 'BaseFeeConfig',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'cliffFeeNumerator',
            type: 'u64',
          },
          {
            name: 'feeSchedulerMode',
            type: 'u8',
          },
          {
            name: 'padding',
            type: {
              array: ['u8', 5],
            },
          },
          {
            name: 'numberOfPeriod',
            type: 'u16',
          },
          {
            name: 'periodFrequency',
            type: 'u64',
          },
          {
            name: 'reductionFactor',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'DynamicFeeConfig',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'initialized',
            type: 'u8',
          },
          {
            name: 'padding',
            type: {
              array: ['u8', 7],
            },
          },
          {
            name: 'maxVolatilityAccumulator',
            type: 'u32',
          },
          {
            name: 'variableFeeControl',
            type: 'u32',
          },
          {
            name: 'binStep',
            type: 'u16',
          },
          {
            name: 'filterPeriod',
            type: 'u16',
          },
          {
            name: 'decayPeriod',
            type: 'u16',
          },
          {
            name: 'reductionFactor',
            type: 'u16',
          },
          {
            name: 'binStepU128',
            type: 'u128',
          },
        ],
      },
    },
    {
      name: 'LiquidityDistributionConfig',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'sqrtPrice',
            type: 'u128',
          },
          {
            name: 'liquidity',
            type: 'u128',
          },
        ],
      },
    },
    {
      name: 'PoolFeesStruct',
      docs: [
        'Information regarding fee charges',
        'trading_fee = amount * trade_fee_numerator / denominator',
        'protocol_fee = trading_fee * protocol_fee_percentage / 100',
        'referral_fee = protocol_fee * referral_percentage / 100',
        'partner_fee = trading_fee - protocol_fee - referral_fee',
      ],
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'baseFee',
            docs: [
              'Trade fees are extra token amounts that are held inside the token',
              'accounts during a trade, making the value of liquidity tokens rise.',
              'Trade fee numerator',
            ],
            type: {
              defined: 'BaseFeeStruct',
            },
          },
          {
            name: 'protocolFeePercent',
            docs: [
              'Protocol trading fees are extra token amounts that are held inside the token',
              'accounts during a trade, with the equivalent in pool tokens minted to',
              'the protocol of the program.',
              'Protocol trade fee numerator',
            ],
            type: 'u8',
          },
          {
            name: 'referralFeePercent',
            docs: ['referral fee'],
            type: 'u8',
          },
          {
            name: 'padding0',
            docs: ['padding'],
            type: {
              array: ['u8', 6],
            },
          },
          {
            name: 'dynamicFee',
            docs: ['dynamic fee'],
            type: {
              defined: 'DynamicFeeStruct',
            },
          },
          {
            name: 'padding1',
            docs: ['padding'],
            type: {
              array: ['u64', 2],
            },
          },
        ],
      },
    },
    {
      name: 'BaseFeeStruct',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'cliffFeeNumerator',
            type: 'u64',
          },
          {
            name: 'feeSchedulerMode',
            type: 'u8',
          },
          {
            name: 'padding0',
            type: {
              array: ['u8', 5],
            },
          },
          {
            name: 'numberOfPeriod',
            type: 'u16',
          },
          {
            name: 'periodFrequency',
            type: 'u64',
          },
          {
            name: 'reductionFactor',
            type: 'u64',
          },
          {
            name: 'padding1',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'DynamicFeeStruct',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'initialized',
            type: 'u8',
          },
          {
            name: 'padding',
            type: {
              array: ['u8', 7],
            },
          },
          {
            name: 'maxVolatilityAccumulator',
            type: 'u32',
          },
          {
            name: 'variableFeeControl',
            type: 'u32',
          },
          {
            name: 'binStep',
            type: 'u16',
          },
          {
            name: 'filterPeriod',
            type: 'u16',
          },
          {
            name: 'decayPeriod',
            type: 'u16',
          },
          {
            name: 'reductionFactor',
            type: 'u16',
          },
          {
            name: 'lastUpdateTimestamp',
            type: 'u64',
          },
          {
            name: 'binStepU128',
            type: 'u128',
          },
          {
            name: 'sqrtPriceReference',
            type: 'u128',
          },
          {
            name: 'volatilityAccumulator',
            type: 'u128',
          },
          {
            name: 'volatilityReference',
            type: 'u128',
          },
        ],
      },
    },
    {
      name: 'PoolMetrics',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'totalProtocolBaseFee',
            type: 'u64',
          },
          {
            name: 'totalProtocolQuoteFee',
            type: 'u64',
          },
          {
            name: 'totalTradingBaseFee',
            type: 'u64',
          },
          {
            name: 'totalTradingQuoteFee',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'SwapResult',
      docs: ['Encodes all results of swapping'],
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'outputAmount',
            type: 'u64',
          },
          {
            name: 'nextSqrtPrice',
            type: 'u128',
          },
          {
            name: 'tradingFee',
            type: 'u64',
          },
          {
            name: 'protocolFee',
            type: 'u64',
          },
          {
            name: 'referralFee',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'Rounding',
      docs: ['Round up, down'],
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Up',
          },
          {
            name: 'Down',
          },
        ],
      },
    },
    {
      name: 'TradeDirection',
      docs: ['Trade (swap) direction'],
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'BasetoQuote',
          },
          {
            name: 'QuotetoBase',
          },
        ],
      },
    },
    {
      name: 'MigrationOption',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'MeteoraDamm',
          },
        ],
      },
    },
    {
      name: 'TokenType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'SplToken',
          },
          {
            name: 'Token2022',
          },
        ],
      },
    },
    {
      name: 'FeeSchedulerMode',
      docs: ['collect fee mode'],
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Linear',
          },
          {
            name: 'Exponential',
          },
        ],
      },
    },
    {
      name: 'MigrationMeteoraDammProgress',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Init',
          },
          {
            name: 'CreatedPool',
          },
        ],
      },
    },
    {
      name: 'CollectFeeMode',
      docs: ['collect fee mode'],
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'OnlyB',
          },
          {
            name: 'BothToken',
          },
        ],
      },
    },
    {
      name: 'PoolType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'SplToken',
          },
          {
            name: 'Token2022',
          },
        ],
      },
    },
    {
      name: 'ActivationType',
      docs: ['Type of the activation'],
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Slot',
          },
          {
            name: 'Timestamp',
          },
        ],
      },
    },
    {
      name: 'TokenProgramFlags',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'TokenProgram',
          },
          {
            name: 'TokenProgram2022',
          },
        ],
      },
    },
  ],
  events: [
    {
      name: 'EvtCreateConfig',
      fields: [
        {
          name: 'config',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'quoteMint',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'feeClaimer',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'owner',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'poolFees',
          type: {
            defined: 'PoolFeeParamters',
          },
          index: false,
        },
        {
          name: 'collectFeeMode',
          type: 'u8',
          index: false,
        },
        {
          name: 'migrationOption',
          type: 'u8',
          index: false,
        },
        {
          name: 'activationType',
          type: 'u8',
          index: false,
        },
        {
          name: 'tokenDecimal',
          type: 'u8',
          index: false,
        },
        {
          name: 'tokenType',
          type: 'u8',
          index: false,
        },
        {
          name: 'swapBaseAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'migrationQuoteThreshold',
          type: 'u64',
          index: false,
        },
        {
          name: 'migrationBaseAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'sqrtStartPrice',
          type: 'u128',
          index: false,
        },
        {
          name: 'curve',
          type: {
            vec: {
              defined: 'LiquidityDistributionParameters',
            },
          },
          index: false,
        },
      ],
    },
    {
      name: 'EvtCreateClaimFeeOperator',
      fields: [
        {
          name: 'operator',
          type: 'publicKey',
          index: false,
        },
      ],
    },
    {
      name: 'EvtCloseClaimFeeOperator',
      fields: [
        {
          name: 'claimFeeOperator',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'operator',
          type: 'publicKey',
          index: false,
        },
      ],
    },
    {
      name: 'EvtInitializePool',
      fields: [
        {
          name: 'pool',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'config',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'creator',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'baseMint',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'poolType',
          type: 'u8',
          index: false,
        },
        {
          name: 'activationPoint',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'EvtSwap',
      fields: [
        {
          name: 'pool',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'config',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'tradeDirection',
          type: 'u8',
          index: false,
        },
        {
          name: 'isReferral',
          type: 'bool',
          index: false,
        },
        {
          name: 'params',
          type: {
            defined: 'SwapParameters',
          },
          index: false,
        },
        {
          name: 'swapResult',
          type: {
            defined: 'SwapResult',
          },
          index: false,
        },
        {
          name: 'transferFeeExcludedAmountIn',
          type: 'u64',
          index: false,
        },
        {
          name: 'currentTimestamp',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'EvtCurveComplete',
      fields: [
        {
          name: 'pool',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'config',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'baseReserve',
          type: 'u64',
          index: false,
        },
        {
          name: 'quoteReserve',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'EvtClaimProtocolFee',
      fields: [
        {
          name: 'pool',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'tokenBaseAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'tokenQuoteAmount',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'EvtClaimTradingFee',
      fields: [
        {
          name: 'pool',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'tokenBaseAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'tokenQuoteAmount',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'EvtCreateMeteoraMigrationMetadata',
      fields: [
        {
          name: 'virtualPool',
          type: 'publicKey',
          index: false,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'MathOverflow',
      msg: 'Math operation overflow',
    },
    {
      code: 6001,
      name: 'InvalidFee',
      msg: 'Invalid fee setup',
    },
    {
      code: 6002,
      name: 'InvalidInvariant',
      msg: 'Invalid invariant d',
    },
    {
      code: 6003,
      name: 'FeeCalculationFailure',
      msg: 'Fee calculation failure',
    },
    {
      code: 6004,
      name: 'ExceededSlippage',
      msg: 'Exceeded slippage tolerance',
    },
    {
      code: 6005,
      name: 'InvalidCalculation',
      msg: 'Invalid curve calculation',
    },
    {
      code: 6006,
      name: 'ZeroTradingTokens',
      msg: 'Given pool token amount results in zero trading tokens',
    },
    {
      code: 6007,
      name: 'ConversionError',
      msg: 'Math conversion overflow',
    },
    {
      code: 6008,
      name: 'FaultyLpMint',
      msg: "LP mint authority must be 'A' vault lp, without freeze authority, and 0 supply",
    },
    {
      code: 6009,
      name: 'MismatchedTokenMint',
      msg: 'Token mint mismatched',
    },
    {
      code: 6010,
      name: 'MismatchedLpMint',
      msg: 'LP mint mismatched',
    },
    {
      code: 6011,
      name: 'MismatchedOwner',
      msg: 'Invalid lp token owner',
    },
    {
      code: 6012,
      name: 'InvalidVaultAccount',
      msg: 'Invalid vault account',
    },
    {
      code: 6013,
      name: 'InvalidVaultLpAccount',
      msg: 'Invalid vault lp account',
    },
    {
      code: 6014,
      name: 'InvalidPoolLpMintAccount',
      msg: 'Invalid pool lp mint account',
    },
    {
      code: 6015,
      name: 'PoolDisabled',
      msg: 'Pool disabled',
    },
    {
      code: 6016,
      name: 'InvalidAdminAccount',
      msg: 'Invalid admin account',
    },
    {
      code: 6017,
      name: 'InvalidProtocolFeeAccount',
      msg: 'Invalid protocol fee account',
    },
    {
      code: 6018,
      name: 'SameAdminAccount',
      msg: 'Same admin account',
    },
    {
      code: 6019,
      name: 'IdenticalSourceDestination',
      msg: 'Identical user source and destination token account',
    },
    {
      code: 6020,
      name: 'ApyCalculationError',
      msg: 'Apy calculation error',
    },
    {
      code: 6021,
      name: 'InsufficientSnapshot',
      msg: 'Insufficient virtual price snapshot',
    },
    {
      code: 6022,
      name: 'NonUpdatableCurve',
      msg: 'Current curve is non-updatable',
    },
    {
      code: 6023,
      name: 'MisMatchedCurve',
      msg: 'New curve is mismatched with old curve',
    },
    {
      code: 6024,
      name: 'InvalidAmplification',
      msg: 'Amplification is invalid',
    },
    {
      code: 6025,
      name: 'UnsupportedOperation',
      msg: 'Operation is not supported',
    },
    {
      code: 6026,
      name: 'ExceedMaxAChanges',
      msg: 'Exceed max amplification changes',
    },
    {
      code: 6027,
      name: 'InvalidRemainingAccountsLen',
      msg: 'Invalid remaining accounts length',
    },
    {
      code: 6028,
      name: 'InvalidRemainingAccounts',
      msg: 'Invalid remaining account',
    },
    {
      code: 6029,
      name: 'MismatchedDepegMint',
      msg: "Token mint B doesn't matches depeg type token mint",
    },
    {
      code: 6030,
      name: 'InvalidApyAccount',
      msg: 'Invalid APY account',
    },
    {
      code: 6031,
      name: 'InvalidTokenMultiplier',
      msg: 'Invalid token multiplier',
    },
    {
      code: 6032,
      name: 'InvalidDepegInformation',
      msg: 'Invalid depeg information',
    },
    {
      code: 6033,
      name: 'UpdateTimeConstraint',
      msg: 'Update time constraint violated',
    },
    {
      code: 6034,
      name: 'ExceedMaxFeeBps',
      msg: 'Exceeded max fee bps',
    },
    {
      code: 6035,
      name: 'InvalidAdmin',
      msg: 'Invalid admin',
    },
    {
      code: 6036,
      name: 'PoolIsNotPermissioned',
      msg: 'Pool is not permissioned',
    },
    {
      code: 6037,
      name: 'InvalidDepositAmount',
      msg: 'Invalid deposit amount',
    },
    {
      code: 6038,
      name: 'InvalidFeeOwner',
      msg: 'Invalid fee owner',
    },
    {
      code: 6039,
      name: 'NonDepletedPool',
      msg: 'Pool is not depleted',
    },
    {
      code: 6040,
      name: 'AmountNotPeg',
      msg: 'Token amount is not 1:1',
    },
    {
      code: 6041,
      name: 'AmountIsZero',
      msg: 'Amount is zero',
    },
    {
      code: 6042,
      name: 'TypeCastFailed',
      msg: 'Type cast error',
    },
    {
      code: 6043,
      name: 'AmountIsNotEnough',
      msg: 'Amount is not enough',
    },
    {
      code: 6044,
      name: 'InvalidActivationDuration',
      msg: 'Invalid activation duration',
    },
    {
      code: 6045,
      name: 'PoolIsNotLaunchPool',
      msg: 'Pool is not launch pool',
    },
    {
      code: 6046,
      name: 'UnableToModifyActivationPoint',
      msg: 'Unable to modify activation point',
    },
    {
      code: 6047,
      name: 'InvalidAuthorityToCreateThePool',
      msg: 'Invalid authority to create the pool',
    },
    {
      code: 6048,
      name: 'InvalidActivationType',
      msg: 'Invalid activation type',
    },
    {
      code: 6049,
      name: 'InvalidActivationPoint',
      msg: 'Invalid activation point',
    },
    {
      code: 6050,
      name: 'PreActivationSwapStarted',
      msg: 'Pre activation swap window started',
    },
    {
      code: 6051,
      name: 'InvalidPoolType',
      msg: 'Invalid pool type',
    },
    {
      code: 6052,
      name: 'InvalidQuoteMint',
      msg: 'Quote token must be SOL,USDC',
    },
    {
      code: 6053,
      name: 'InvalidFeeCurve',
      msg: 'Invalid fee curve',
    },
    {
      code: 6054,
      name: 'InvalidPriceRange',
      msg: 'Invalid Price Range',
    },
    {
      code: 6055,
      name: 'PriceRangeViolation',
      msg: 'Trade is over price range',
    },
    {
      code: 6056,
      name: 'InvalidParameters',
      msg: 'Invalid parameters',
    },
    {
      code: 6057,
      name: 'InvalidCollectFeeMode',
      msg: 'Invalid collect fee mode',
    },
    {
      code: 6058,
      name: 'InvalidInput',
      msg: 'Invalid input',
    },
    {
      code: 6059,
      name: 'CannotCreateTokenBadgeOnSupportedMint',
      msg: 'Cannot create token badge on supported mint',
    },
    {
      code: 6060,
      name: 'InvalidTokenBadge',
      msg: 'Invalid token badge',
    },
    {
      code: 6061,
      name: 'InvalidMinimumLiquidity',
      msg: 'Invalid minimum liquidity',
    },
    {
      code: 6062,
      name: 'InvalidPositionOwner',
      msg: 'Invalid position owner',
    },
    {
      code: 6063,
      name: 'InvalidVestingInfo',
      msg: 'Invalid vesting information',
    },
    {
      code: 6064,
      name: 'InsufficientLiquidity',
      msg: 'Insufficient liquidity',
    },
    {
      code: 6065,
      name: 'InvalidVestingAccount',
      msg: 'Invalid vesting account',
    },
    {
      code: 6066,
      name: 'InvalidPoolStatus',
      msg: 'Invalid pool status',
    },
    {
      code: 6067,
      name: 'UnsupportNativeMintToken2022',
      msg: 'Unsupported native mint token2022',
    },
    {
      code: 6068,
      name: 'RewardMintIsNotSupport',
      msg: 'Reward mint is not support',
    },
    {
      code: 6069,
      name: 'InvalidRewardIndex',
      msg: 'Invalid reward index',
    },
    {
      code: 6070,
      name: 'InvalidRewardDuration',
      msg: 'Invalid reward duration',
    },
    {
      code: 6071,
      name: 'RewardInitialized',
      msg: 'Reward already initialized',
    },
    {
      code: 6072,
      name: 'RewardUninitialized',
      msg: 'Reward not initialized',
    },
    {
      code: 6073,
      name: 'InvalidRewardVault',
      msg: 'Invalid reward vault',
    },
    {
      code: 6074,
      name: 'MustWithdrawnIneligibleReward',
      msg: 'Must withdraw ineligible reward',
    },
    {
      code: 6075,
      name: 'WithdrawToWrongTokenAccount',
      msg: 'Withdraw to wrong token account',
    },
    {
      code: 6076,
      name: 'IdenticalRewardDuration',
      msg: 'Reward duration is the same',
    },
    {
      code: 6077,
      name: 'RewardCampaignInProgress',
      msg: 'Reward campaign in progress',
    },
    {
      code: 6078,
      name: 'IdenticalFunder',
      msg: 'Identical funder',
    },
    {
      code: 6079,
      name: 'InvalidFunder',
      msg: 'Invalid funder',
    },
    {
      code: 6080,
      name: 'RewardNotEnded',
      msg: 'Reward not ended',
    },
    {
      code: 6081,
      name: 'InvalidExtension',
      msg: 'Invalid extension',
    },
    {
      code: 6082,
      name: 'FeeInverseIsIncorrect',
      msg: 'Fee inverse is incorrect',
    },
    {
      code: 6083,
      name: 'NotEnoughLiquidity',
      msg: 'Not enough liquidity',
    },
    {
      code: 6084,
      name: 'PoolIsCompleted',
      msg: 'Pool is completed',
    },
    {
      code: 6085,
      name: 'PoolIsIncompleted',
      msg: 'Pool is incompleted',
    },
    {
      code: 6086,
      name: 'InvalidMigrationOption',
      msg: 'Invalid migration option',
    },
    {
      code: 6087,
      name: 'InvalidTokenDecimals',
      msg: 'Invalid activation type',
    },
    {
      code: 6088,
      name: 'InvalidTokenType',
      msg: 'Invalid token type',
    },
    {
      code: 6089,
      name: 'InvalidFeePercentage',
      msg: 'Invalid fee percentage',
    },
    {
      code: 6090,
      name: 'InvalidQuoteThreshold',
      msg: 'Invalid quote threshold',
    },
    {
      code: 6091,
      name: 'InvalidCurve',
      msg: 'Invalid curve',
    },
    {
      code: 6092,
      name: 'NotPermitToDoThisAction',
      msg: 'Not permit to do this action',
    },
    {
      code: 6093,
      name: 'InvalidPartnerAccount',
      msg: 'Invalid partner account',
    },
    {
      code: 6094,
      name: 'InvalidOwnerAccount',
      msg: 'Invalid owner account',
    },
    {
      code: 6095,
      name: 'InvalidConfigAccount',
      msg: 'Invalid config account',
    },
  ],
}
