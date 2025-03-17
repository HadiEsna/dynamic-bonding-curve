import { useState, useEffect } from 'react'
import { Link } from '@remix-run/react'
import type { MetaFunction } from '@remix-run/cloudflare'
import { z } from 'zod'
import {
  Settings,
  TrendingUp,
  LineChart,
  Waves,
  ArrowRight,
  Check,
  AlertCircle,
} from 'lucide-react'
import { useForm } from '@tanstack/react-form'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CurveChart from '../components/CurveChart'
import { useWallet } from '@jup-ag/wallet-adapter'
import LiquidityDistributionChart from '../components/LiquidityDistributionChart'
import { useVirtualProgram } from '../contexts/VirtualProgramContext'
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js'
import { BN } from 'bn.js'

export const meta: MetaFunction = () => {
  return [
    { title: 'Create Configuration - Virtual Curve' },
    {
      name: 'description',
      content:
        'Create and save pool configurations for your Virtual Curve pools.',
    },
  ]
}

// Define the schema for the configuration form based on SDK requirements
const configSchema = z.object({
  // Required SDK parameters
  feeClaimer: z.string().min(32, 'Fee claimer must be a valid Solana address'),
  owner: z.string().min(32, 'Owner must be a valid Solana address'),
  quoteMint: z.string().min(32, 'Quote mint must be a valid Solana address'),

  // Pool fees - Base fee
  baseFee: z.object({
    cliffFeeNumerator: z.number().int().min(0),
    numberOfPeriod: z.number().int().min(1),
    periodFrequency: z.number().int().min(0),
    reductionFactor: z.number().int().min(0),
    feeSchedulerMode: z.number().int().min(0).max(1), // 0: FLAT, 1: DECAY
  }),

  // Pool fees - Dynamic fee
  dynamicFee: z.object({
    binStep: z.number().int().min(1),
    binStepU128: z.number().int().min(0),
    filterPeriod: z.number().int().min(1),
    decayPeriod: z.number().int().min(1),
    reductionFactor: z.number().int().min(0),
    maxVolatilityAccumulator: z.number().int().min(0),
    variableFeeControl: z.number().int().min(0),
  }),

  // Other configuration parameters
  collectFeeMode: z.number().int().min(0).max(1), // 0: QuoteToken only, 1: Both tokens
  migrationOption: z.number().int().min(0).max(0), // 0: MeteoraDAMM (only option for now)
  activationType: z.number().int().min(0).max(1), // 0: Slot, 1: Timestamp
  tokenDecimal: z.number().int().min(0).max(9),
  tokenType: z.number().int().min(0).max(1), // 0: SplToken, 1: Token2022
  creatorPostMigrationFeePercentage: z.number().int().min(0).max(100),
  migrationQuoteThreshold: z.number().int().min(0),
  sqrtStartPrice: z.number().int().min(1),

  // Liquidity distribution parameters
  liquidityDistribution: z
    .array(
      z.object({
        sqrtPrice: z.number().int().min(1),
        liquidity: z.number().int().min(0),
      })
    )
    .min(1),
})

// Define the type based on the schema
type ConfigFormValues = z.infer<typeof configSchema>

// Template configurations
const TEMPLATES: Record<string, Partial<ConfigFormValues>> = {
  exponential: {
    quoteMint: 'So11111111111111111111111111111111111111112', // SOL (wrapped)
    feeClaimer: '',
    owner: '',
    baseFee: {
      cliffFeeNumerator: 250, // 2.5%
      numberOfPeriod: 10,
      periodFrequency: 86400, // 1 day in seconds
      reductionFactor: 10,
      feeSchedulerMode: 1, // DECAY
    },
    dynamicFee: {
      binStep: 100,
      binStepU128: 100,
      filterPeriod: 600, // 10 minutes
      decayPeriod: 600, // 10 minutes
      reductionFactor: 10,
      maxVolatilityAccumulator: 100000,
      variableFeeControl: 10000,
    },
    collectFeeMode: 1, // Both tokens
    migrationOption: 0, // MeteoraDAMM
    activationType: 1, // Timestamp
    tokenDecimal: 9,
    tokenType: 0, // SplToken
    creatorPostMigrationFeePercentage: 0,
    migrationQuoteThreshold: 0,

    sqrtStartPrice: 1000,
    liquidityDistribution: [
      { sqrtPrice: 1000, liquidity: 0 },
      { sqrtPrice: 1414, liquidity: 100000000 },
      { sqrtPrice: 2000, liquidity: 200000000 },
      { sqrtPrice: 2828, liquidity: 300000000 },
      { sqrtPrice: 4000, liquidity: 400000000 },
    ],
  },
  linear: {
    quoteMint: 'So11111111111111111111111111111111111111112', // SOL (wrapped)
    feeClaimer: '',
    owner: '',
    baseFee: {
      cliffFeeNumerator: 150, // 1.5%
      numberOfPeriod: 1,
      periodFrequency: 0,
      reductionFactor: 0,
      feeSchedulerMode: 0, // FLAT
    },
    dynamicFee: {
      binStep: 50,
      binStepU128: 50,
      filterPeriod: 300, // 5 minutes
      decayPeriod: 300, // 5 minutes
      reductionFactor: 5,
      maxVolatilityAccumulator: 50000,
      variableFeeControl: 5000,
    },
    collectFeeMode: 0, // QuoteToken only
    migrationOption: 0, // MeteoraDAMM
    activationType: 0, // Slot
    tokenDecimal: 9,
    tokenType: 0, // SplToken
    creatorPostMigrationFeePercentage: 0,
    migrationQuoteThreshold: 0,
    sqrtStartPrice: 10000,
    liquidityDistribution: [
      { sqrtPrice: 10000, liquidity: 0 },
      { sqrtPrice: 15000, liquidity: 25000000 },
      { sqrtPrice: 20000, liquidity: 50000000 },
      { sqrtPrice: 25000, liquidity: 75000000 },
      { sqrtPrice: 30000, liquidity: 100000000 },
    ],
  },
  custom: {
    quoteMint: 'So11111111111111111111111111111111111111112', // SOL (wrapped)
    feeClaimer: '',
    owner: '',
    baseFee: {
      cliffFeeNumerator: 200, // 2%
      numberOfPeriod: 5,
      periodFrequency: 43200, // 12 hours in seconds
      reductionFactor: 20,
      feeSchedulerMode: 1, // DECAY
    },
    dynamicFee: {
      binStep: 75,
      binStepU128: 75,
      filterPeriod: 450, // 7.5 minutes
      decayPeriod: 450, // 7.5 minutes
      reductionFactor: 15,
      maxVolatilityAccumulator: 75000,
      variableFeeControl: 7500,
    },
    collectFeeMode: 1, // Both tokens
    migrationOption: 0, // MeteoraDAMM
    activationType: 1, // Timestamp
    tokenDecimal: 9,
    tokenType: 0, // SplToken
    creatorPostMigrationFeePercentage: 0,
    migrationQuoteThreshold: 0,
    sqrtStartPrice: 1000,
    liquidityDistribution: [
      { sqrtPrice: 1000, liquidity: 0 },
      { sqrtPrice: 2500, liquidity: 25000000 },
      { sqrtPrice: 5000, liquidity: 50000000 },
      { sqrtPrice: 7500, liquidity: 75000000 },
      { sqrtPrice: 10000, liquidity: 100000000 },
    ],
  },
}

export default function ConfigPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [liquidityPoints, setLiquidityPoints] = useState<
    { sqrtPrice: number; liquidity: number }[]
  >([])
  const { publicKey, signTransaction } = useWallet()
  const virtualProgram = useVirtualProgram()

  // Initialize TanStack Form
  const form = useForm({
    defaultValues: {
      ...TEMPLATES[selectedTemplate],
      feeClaimer: publicKey?.toBase58() || '',
      owner: publicKey?.toBase58() || '',
    } as ConfigFormValues,
    onSubmit: async ({ value }) => {
      if (!virtualProgram.sdk) {
        throw new Error('Virtual program not initialized')
      }

      if (!publicKey || !signTransaction) {
        throw new Error('Wallet not connected')
      }

      if (!virtualProgram.connection) {
        throw new Error('Connection not initialized')
      }

      const { connection, sdk } = virtualProgram
      const tempKeypair = Keypair.generate()
      const ix = await sdk.createConfig({
        config: tempKeypair.publicKey, // we can use a create seed from the user
        feeClaimer: value.feeClaimer,
        owner: value.owner,
        quoteMint: value.quoteMint,
        payer: publicKey,
        systemProgram: SystemProgram.programId,
        configParameters: {
          padding: [],
          activationType: value.activationType,
          collectFeeMode: value.collectFeeMode,
          migrationOption: value.migrationOption,
          poolFees: {
            baseFee: {
              cliffFeeNumerator: new BN(value.baseFee.cliffFeeNumerator),
              numberOfPeriod: value.baseFee.numberOfPeriod,
              periodFrequency: new BN(value.baseFee.periodFrequency),
              reductionFactor: new BN(value.baseFee.reductionFactor),
              feeSchedulerMode: value.baseFee.feeSchedulerMode,
            },
            dynamicFee: {
              binStep: value.dynamicFee.binStep,
              binStepU128: new BN(value.dynamicFee.binStepU128),
              filterPeriod: value.dynamicFee.filterPeriod,
              decayPeriod: value.dynamicFee.decayPeriod,
              reductionFactor: value.dynamicFee.reductionFactor,
              maxVolatilityAccumulator:
                value.dynamicFee.maxVolatilityAccumulator,
              variableFeeControl: value.dynamicFee.variableFeeControl,
            },
          },
          creatorPostMigrationFeePercentage:
            value.creatorPostMigrationFeePercentage,
          curve: value.liquidityDistribution.map(
            ({ sqrtPrice, liquidity }) => ({
              sqrtPrice: new BN(sqrtPrice),
              liquidity: new BN(liquidity),
            })
          ),
          migrationQuoteThreshold: new BN(value.migrationQuoteThreshold),
          sqrtStartPrice: new BN(value.sqrtStartPrice),
          tokenDecimal: value.tokenDecimal,
          tokenType: value.tokenType,
        },
      })

      const blockhash = await connection.getLatestBlockhash()
      const transaction = new Transaction({
        feePayer: publicKey,
        ...blockhash,
      }).add(ix)

      signTransaction(transaction)
    },
    validators: {
      onSubmit: configSchema,
    },
  })

  // Watch for liquidityDistribution changes
  useEffect(() => {
    if (form.state.values.liquidityDistribution) {
      setLiquidityPoints(form.state.values.liquidityDistribution)
    }
  }, [form.state.values.liquidityDistribution])

  // Handle template selection
  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template)
    // Update the form values with the template values
    form.reset({
      ...form.state.values,
      ...TEMPLATES[template],
      feeClaimer: publicKey?.toBase58() || '',
      owner: publicKey?.toBase58() || '',
    })

    // Directly update the liquidity points for immediate chart update
    if (TEMPLATES[template]?.liquidityDistribution) {
      setLiquidityPoints(TEMPLATES[template].liquidityDistribution)
    }

    setError('')
  }

  // Add a new liquidity distribution point
  const addLiquidityPoint = () => {
    const currentValues = form.state.values
    const liquidityDistribution = [...currentValues.liquidityDistribution]
    const lastPoint = liquidityDistribution[liquidityDistribution.length - 1]

    const newSqrtPrice = lastPoint
      ? Math.round(lastPoint.sqrtPrice * 1.5)
      : 1000
    const newLiquidity = lastPoint
      ? Math.round(lastPoint.liquidity * 1.5)
      : 100000000

    const newDistribution = [
      ...liquidityDistribution,
      { sqrtPrice: newSqrtPrice, liquidity: newLiquidity },
    ]

    form.setFieldValue('liquidityDistribution', newDistribution)

    // Update state directly for immediate chart update
    setLiquidityPoints(newDistribution)
  }

  // Remove a liquidity distribution point
  const removeLiquidityPoint = (index: number) => {
    const currentValues = form.state.values
    if (currentValues.liquidityDistribution.length <= 1) {
      setError('Cannot remove the last liquidity distribution point')
      return
    }

    const newDistribution = [...currentValues.liquidityDistribution]
    newDistribution.splice(index, 1)

    form.setFieldValue('liquidityDistribution', newDistribution)

    // Update state directly for immediate chart update
    setLiquidityPoints(newDistribution)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white">
      {/* Header */}
      <Header currentPath="/config" />

      {/* Page Content */}
      <main className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-2">Create Configuration</h1>
            <p className="text-gray-300">
              Design and save pool configurations for future use
            </p>
          </div>
          <Link
            to="/create"
            className="mt-4 md:mt-0 bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 rounded-full font-medium hover:opacity-90 transition flex items-center gap-2"
          >
            <span>Create Pool</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Template Selection */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Choose a Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pump.fun Style Template */}
            <div
              className={`bg-white/5 rounded-xl p-6 backdrop-blur-sm hover:bg-white/10 transition border cursor-pointer ${
                selectedTemplate === 'exponential'
                  ? 'border-pink-500'
                  : 'border-white/10'
              }`}
              onClick={() => handleTemplateSelect('exponential')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === 'Enter' && handleTemplateSelect('exponential')
              }
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-pink-500/20 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-pink-500" />
                </div>
                {selectedTemplate === 'exponential' && (
                  <div className="bg-pink-500 rounded-full p-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">Pump.fun Style</h3>
              <p className="text-gray-300 text-sm mb-4">
                Exponential price growth similar to pump.fun
              </p>
              <div className="h-24 bg-gradient-to-tr from-pink-500/5 to-purple-500/5 rounded-lg flex items-center justify-center">
                <CurveChart
                  curveType="exponential"
                  initialPrice={0.000001}
                  maxSupply={1000000000}
                  height={96}
                />
              </div>
            </div>

            {/* Standard Launch Template */}
            <div
              className={`bg-white/5 rounded-xl p-6 backdrop-blur-sm hover:bg-white/10 transition border cursor-pointer ${
                selectedTemplate === 'linear'
                  ? 'border-blue-500'
                  : 'border-white/10'
              }`}
              onClick={() => handleTemplateSelect('linear')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === 'Enter' && handleTemplateSelect('linear')
              }
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <LineChart className="w-6 h-6 text-blue-500" />
                </div>
                {selectedTemplate === 'linear' && (
                  <div className="bg-blue-500 rounded-full p-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">Standard Launch</h3>
              <p className="text-gray-300 text-sm mb-4">
                Linear price growth for traditional token launches
              </p>
              <div className="h-24 bg-gradient-to-tr from-blue-500/5 to-teal-500/5 rounded-lg flex items-center justify-center">
                <CurveChart
                  curveType="linear"
                  initialPrice={0.0001}
                  maxSupply={100000000}
                  height={96}
                />
              </div>
            </div>

            {/* Custom Curve Template */}
            <div
              className={`bg-white/5 rounded-xl p-6 backdrop-blur-sm hover:bg-white/10 transition border cursor-pointer ${
                selectedTemplate === 'custom'
                  ? 'border-purple-500'
                  : 'border-white/10'
              }`}
              onClick={() => handleTemplateSelect('custom')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === 'Enter' && handleTemplateSelect('custom')
              }
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <Waves className="w-6 h-6 text-purple-500" />
                </div>
                {selectedTemplate === 'custom' && (
                  <div className="bg-purple-500 rounded-full p-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">Custom Curve</h3>
              <p className="text-gray-300 text-sm mb-4">
                Fully customizable price curve
              </p>
              <div className="h-24 bg-gradient-to-tr from-purple-500/5 to-indigo-500/5 rounded-lg flex items-center justify-center">
                <CurveChart
                  curveType="custom"
                  initialPrice={0.0001}
                  maxSupply={100000000}
                  customPoints={[
                    { x: 0, y: 0.0001 },
                    { x: 25, y: 0.0002 },
                    { x: 50, y: 0.0005 },
                    { x: 75, y: 0.001 },
                    { x: 100, y: 0.0025 },
                  ]}
                  height={96}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Form */}
        {selectedTemplate && (
          <div className="bg-white/5 rounded-xl p-8 backdrop-blur-sm border border-white/10 mb-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              <span>Configure Your Pool</span>
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-300">Error</h3>
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
              className="space-y-6"
            >
              {/* Fee Claimer and Owner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Fee Claimer</h3>
                  {form.Field({
                    name: 'feeClaimer',
                    children: (field) => (
                      <input
                        type="text"
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full bg-white/10 p-2 rounded-lg"
                      />
                    ),
                  })}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Owner</h3>
                  {form.Field({
                    name: 'owner',
                    children: (field) => (
                      <input
                        type="text"
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full bg-white/10 p-2 rounded-lg"
                      />
                    ),
                  })}
                </div>
              </div>

              {/* Quote Mint and Token Decimal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Quote Mint</h3>
                  {form.Field({
                    name: 'quoteMint',
                    children: (field) => (
                      <input
                        type="text"
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full bg-white/10 p-2 rounded-lg"
                      />
                    ),
                  })}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Token Decimal</h3>
                  {form.Field({
                    name: 'tokenDecimal',
                    children: (field) => (
                      <input
                        type="number"
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(parseInt(e.target.value, 10))
                        }
                        className="w-full bg-white/10 p-2 rounded-lg"
                      />
                    ),
                  })}
                </div>
              </div>

              {/* Token Type and Collect Fee Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Token Type</h3>
                  {form.Field({
                    name: 'tokenType',
                    children: (field) => (
                      <select
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(parseInt(e.target.value, 10))
                        }
                        className="w-full bg-white/10 p-2 rounded-lg"
                      >
                        <option value="0">SplToken</option>
                        <option value="1">Token2022</option>
                      </select>
                    ),
                  })}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Collect Fee Mode
                  </h3>
                  {form.Field({
                    name: 'collectFeeMode',
                    children: (field) => (
                      <select
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(parseInt(e.target.value, 10))
                        }
                        className="w-full bg-white/10 p-2 rounded-lg"
                      >
                        <option value="0">QuoteToken only</option>
                        <option value="1">Both tokens</option>
                      </select>
                    ),
                  })}
                </div>
              </div>

              {/* Migration Option and Activation Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Migration Option
                  </h3>
                  {form.Field({
                    name: 'migrationOption',
                    children: (field) => (
                      <select
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(parseInt(e.target.value, 10))
                        }
                        className="w-full bg-white/10 p-2 rounded-lg"
                      >
                        <option value="0">MeteoraDAMM</option>
                      </select>
                    ),
                  })}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Activation Type
                  </h3>
                  {form.Field({
                    name: 'activationType',
                    children: (field) => (
                      <select
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(parseInt(e.target.value, 10))
                        }
                        className="w-full bg-white/10 p-2 rounded-lg"
                      >
                        <option value="0">Slot</option>
                        <option value="1">Timestamp</option>
                      </select>
                    ),
                  })}
                </div>
              </div>

              {/* Creator Post Migration Fee Percentage and Migration Quote Threshold */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Creator Post Migration Fee Percentage
                  </h3>
                  {form.Field({
                    name: 'creatorPostMigrationFeePercentage',
                    children: (field) => (
                      <input
                        type="number"
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(parseInt(e.target.value, 10))
                        }
                        className="w-full bg-white/10 p-2 rounded-lg"
                      />
                    ),
                  })}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Migration Quote Threshold
                  </h3>
                  {form.Field({
                    name: 'migrationQuoteThreshold',
                    children: (field) => (
                      <input
                        type="number"
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(parseInt(e.target.value, 10))
                        }
                        className="w-full bg-white/10 p-2 rounded-lg"
                      />
                    ),
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Sqrt Start Price
                  </h3>
                  {form.Field({
                    name: 'sqrtStartPrice',
                    children: (field) => (
                      <input
                        type="number"
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(parseInt(e.target.value, 10))
                        }
                        className="w-full bg-white/10 p-2 rounded-lg"
                      />
                    ),
                  })}
                </div>
              </div>

              {/* Base Fee Section */}
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-xl font-semibold mb-4">
                  Base Fee Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Cliff Fee Numerator
                    </h3>
                    {form.Field({
                      name: 'baseFee.cliffFeeNumerator',
                      children: (field) => (
                        <input
                          type="number"
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(parseInt(e.target.value, 10))
                          }
                          className="w-full bg-white/10 p-2 rounded-lg"
                        />
                      ),
                    })}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Number of Period
                    </h3>
                    {form.Field({
                      name: 'baseFee.numberOfPeriod',
                      children: (field) => (
                        <input
                          type="number"
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(parseInt(e.target.value, 10))
                          }
                          className="w-full bg-white/10 p-2 rounded-lg"
                        />
                      ),
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Period Frequency
                    </h3>
                    {form.Field({
                      name: 'baseFee.periodFrequency',
                      children: (field) => (
                        <input
                          type="number"
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(parseInt(e.target.value, 10))
                          }
                          className="w-full bg-white/10 p-2 rounded-lg"
                        />
                      ),
                    })}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Reduction Factor
                    </h3>
                    {form.Field({
                      name: 'baseFee.reductionFactor',
                      children: (field) => (
                        <input
                          type="number"
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(parseInt(e.target.value, 10))
                          }
                          className="w-full bg-white/10 p-2 rounded-lg"
                        />
                      ),
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Fee Scheduler Mode
                    </h3>
                    {form.Field({
                      name: 'baseFee.feeSchedulerMode',
                      children: (field) => (
                        <select
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(parseInt(e.target.value, 10))
                          }
                          className="w-full bg-white/10 p-2 rounded-lg"
                        >
                          <option value="0">FLAT</option>
                          <option value="1">DECAY</option>
                        </select>
                      ),
                    })}
                  </div>
                </div>
              </div>

              {/* Dynamic Fee Section */}
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-xl font-semibold mb-4">
                  Dynamic Fee Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Bin Step</h3>
                    {form.Field({
                      name: 'dynamicFee.binStep',
                      children: (field) => (
                        <input
                          type="number"
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(parseInt(e.target.value, 10))
                          }
                          className="w-full bg-white/10 p-2 rounded-lg"
                        />
                      ),
                    })}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Bin Step U128
                    </h3>
                    {form.Field({
                      name: 'dynamicFee.binStepU128',
                      children: (field) => (
                        <input
                          type="number"
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(parseInt(e.target.value, 10))
                          }
                          className="w-full bg-white/10 p-2 rounded-lg"
                        />
                      ),
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Filter Period
                    </h3>
                    {form.Field({
                      name: 'dynamicFee.filterPeriod',
                      children: (field) => (
                        <input
                          type="number"
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(parseInt(e.target.value, 10))
                          }
                          className="w-full bg-white/10 p-2 rounded-lg"
                        />
                      ),
                    })}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Decay Period</h3>
                    {form.Field({
                      name: 'dynamicFee.decayPeriod',
                      children: (field) => (
                        <input
                          type="number"
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(parseInt(e.target.value, 10))
                          }
                          className="w-full bg-white/10 p-2 rounded-lg"
                        />
                      ),
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Reduction Factor
                    </h3>
                    {form.Field({
                      name: 'dynamicFee.reductionFactor',
                      children: (field) => (
                        <input
                          type="number"
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(parseInt(e.target.value, 10))
                          }
                          className="w-full bg-white/10 p-2 rounded-lg"
                        />
                      ),
                    })}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Max Volatility Accumulator
                    </h3>
                    {form.Field({
                      name: 'dynamicFee.maxVolatilityAccumulator',
                      children: (field) => (
                        <input
                          type="number"
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(parseInt(e.target.value, 10))
                          }
                          className="w-full bg-white/10 p-2 rounded-lg"
                        />
                      ),
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Variable Fee Control
                    </h3>
                    {form.Field({
                      name: 'dynamicFee.variableFeeControl',
                      children: (field) => (
                        <input
                          type="number"
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(parseInt(e.target.value, 10))
                          }
                          className="w-full bg-white/10 p-2 rounded-lg"
                        />
                      ),
                    })}
                  </div>
                </div>
              </div>

              {/* Liquidity Distribution Preview Graph */}
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-xl font-semibold mb-4">
                  Liquidity Distribution Preview
                </h3>
                <div className="bg-white/5 rounded-lg p-4 h-64">
                  {liquidityPoints.length > 0 && (
                    <div className="h-full">
                      <LiquidityDistributionChart
                        liquidityPoints={liquidityPoints}
                        height={220}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Liquidity Distribution Section */}
              <div className="border-t border-white/10 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">
                    Liquidity Distribution
                  </h3>
                  <button
                    type="button"
                    onClick={addLiquidityPoint}
                    className="bg-white/10 px-3 py-1 rounded-lg text-sm hover:bg-white/20 transition"
                  >
                    + Add Point
                  </button>
                </div>

                {form.Field({
                  name: 'liquidityDistribution',
                  children: (field) => (
                    <>
                      {field.state.value.map(
                        (
                          item: { sqrtPrice: number; liquidity: number },
                          index: number
                        ) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 relative"
                          >
                            <div>
                              <h3 className="text-lg font-semibold mb-2">
                                Sqrt Price {index + 1}
                              </h3>
                              <input
                                type="number"
                                value={item.sqrtPrice}
                                onChange={(e) => {
                                  const newValue = parseInt(e.target.value, 10)
                                  const newDistribution = [...field.state.value]
                                  newDistribution[index] = {
                                    ...newDistribution[index],
                                    sqrtPrice: isNaN(newValue) ? 0 : newValue,
                                  }
                                  field.handleChange(newDistribution)

                                  // Update state directly for immediate chart update
                                  setLiquidityPoints(newDistribution)
                                }}
                                className="w-full bg-white/10 p-2 rounded-lg"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-semibold">
                                  Liquidity {index + 1}
                                </h3>
                                {field.state.value.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeLiquidityPoint(index)}
                                    className="text-red-400 hover:text-red-300 text-sm"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                              <input
                                type="number"
                                value={item.liquidity}
                                onChange={(e) => {
                                  const newValue = parseInt(e.target.value, 10)
                                  const newDistribution = [...field.state.value]
                                  newDistribution[index] = {
                                    ...newDistribution[index],
                                    liquidity: isNaN(newValue) ? 0 : newValue,
                                  }
                                  field.handleChange(newDistribution)

                                  // Update state directly for immediate chart update
                                  setLiquidityPoints(newDistribution)
                                }}
                                className="w-full bg-white/10 p-2 rounded-lg"
                              />
                            </div>
                          </div>
                        )
                      )}
                    </>
                  ),
                })}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 rounded-full font-medium hover:opacity-90 transition"
              >
                Create Pool Configuration
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
