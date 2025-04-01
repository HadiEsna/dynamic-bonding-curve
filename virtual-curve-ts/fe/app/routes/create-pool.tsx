import { useState, useEffect } from 'react'
import { Link, useSearchParams } from '@remix-run/react'
import type { MetaFunction } from '@remix-run/cloudflare'
import { z } from 'zod'
import {
  Rocket,
  ArrowLeft,
  Save,
  Upload,
  Check,
  AlertCircle,
  Info,
  Loader2,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TokenomicsChart from '../components/TokenomicsChart'
import { TEMPLATES } from '../lib/templates'
import { useVirtualProgram } from '~/contexts/VirtualProgramContext'
import { useWallet } from '@solana/wallet-adapter-react'
import { FEE_DENOMINATOR } from '../../../lib/src'

export const meta: MetaFunction = () => {
  return [
    { title: 'Create Pool - Virtual Curve' },
    {
      name: 'description',
      content:
        'Create a new token pool on Virtual Curve with customizable price curves.',
    },
  ]
}

// Define the schema for the pool creation form
const poolSchema = z.object({
  // Token Details
  tokenName: z.string().min(3, 'Token name must be at least 3 characters'),
  tokenSymbol: z
    .string()
    .min(1, 'Token symbol is required')
    .max(10, 'Token symbol must be 10 characters or less'),
  tokenDescription: z.string().optional(),
  tokenLogo: z.any().optional(), // In a real app, this would be a file upload

  // Pool Settings (these would come from a configuration)
  initialPrice: z.number().positive('Initial price must be positive'),
  maxSupply: z.number().positive('Max supply must be positive'),
  creatorFee: z
    .number()
    .min(0)
    .max(10, 'Creator fee must be between 0% and 10%'),
  tradingFee: z.number().min(0).max(5, 'Trading fee must be between 0% and 5%'),
  curveType: z.enum(['exponential', 'linear', 'custom']),

  // Social Links
  website: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  twitter: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  telegram: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  discord: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
})

// Define the type based on the schema
type PoolFormValues = z.infer<typeof poolSchema>

// Define the custom curve params type
interface CustomCurveParams {
  points: Array<{ x: number; y: number }>
}

// Define the form values type with the custom curve params
interface FormValues extends PoolFormValues {
  customCurveParams?: CustomCurveParams
}

// Define the saved config type - updated to match what we'll get from the SDK

export default function CreatePool() {
  const [searchParams, setSearchParams] = useSearchParams()
  const configId = searchParams.get('config')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const { sdk } = useVirtualProgram()
  const wallet = useWallet()

  // Query to fetch configs owned by the current wallet
  const { data: userConfigs, isLoading: isLoadingConfigs } = useQuery({
    queryKey: ['configs', wallet.publicKey?.toString()],
    queryFn: async () => {
      if (!wallet.publicKey || !sdk) return []

      const configs = await sdk.getPoolConfigs(wallet.publicKey)

      return configs.map((config) => ({
        id: config.publicKey.toString(),
        account: config.account,
      }))
    },
    enabled: !!wallet.publicKey && !!sdk,
  })

  // Default form values
  const [formValues, setFormValues] = useState<FormValues>({
    tokenName: '',
    tokenSymbol: '',
    tokenDescription: '',
    tokenLogo: null,
    initialPrice: 0.000001,
    maxSupply: 1000000000,
    creatorFee: 2.5,
    tradingFee: 1,
    curveType: 'exponential',
    website: '',
    twitter: '',
    telegram: '',
    discord: '',
    customCurveParams: {
      points: [
        { x: 0, y: 0.0001 },
        { x: 25, y: 0.0002 },
        { x: 50, y: 0.0005 },
        { x: 75, y: 0.001 },
        { x: 100, y: 0.002 },
      ],
    },
  })

  // Load configuration if configId is provided
  useEffect(() => {
    if (configId && userConfigs) {
      const config = userConfigs.find((c) => c.id === configId)
      if (config) {
        // Map from SDK config to form values
        // This will need to be adjusted based on the actual data structure
        const tradingFeePercentage =
          (Number(config.account.poolFees.baseFee.cliffFeeNumerator) /
            Number(FEE_DENOMINATOR)) *
          100

        const creatorFeePercentage = 1 // You'll need to extract this from your config data

        setFormValues((prev) => ({
          ...prev,
          initialPrice: 0.000001, // Set based on your config data
          maxSupply: 1000000000, // Set based on your config data
          creatorFee: creatorFeePercentage,
          tradingFee: tradingFeePercentage,
          curveType: 'exponential', // Set based on your config data
        }))
      }
    }
  }, [configId, userConfigs])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      try {
        // In a real app, this would be an API call to create the pool
        console.log('Creating pool with values:', formValues)
        setIsSuccess(true)
        setIsSubmitting(false)
      } catch (err) {
        setError('Failed to create pool. Please try again.')
        setIsSubmitting(false)
      }
    }, 2000)
  }

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]:
        name === 'initialPrice' ||
        name === 'maxSupply' ||
        name === 'creatorFee' ||
        name === 'tradingFee'
          ? parseFloat(value)
          : value,
    }))
  }

  // Add a section to display the user's configs
  const renderUserConfigs = () => {
    if (isLoadingConfigs) {
      return (
        <div className="text-center py-4">
          <Loader2 className="w-6 h-6 animate-spin mx-auto" />
        </div>
      )
    }

    if (!userConfigs || userConfigs.length === 0) {
      return (
        <div className="text-center py-4 text-gray-400">
          No configurations found.{' '}
          <Link
            to="/config"
            className="text-purple-500 underline cursor-pointer"
          >
            Create your first one!
          </Link>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {userConfigs.map((config) => {
          // Extract the actual liquidity points from the config's curve data
          const liquidityPoints =
            config.account.curve?.map((point) => ({
              sqrtPrice: point.sqrtPrice.toString(),
              liquidity: point.liquidity.toString(),
            })) || []

          const feePercentage =
            (Number(config.account.poolFees.baseFee.cliffFeeNumerator) /
              Number(FEE_DENOMINATOR)) *
            100

          // Determine color based on fee percentage
          const lineColor = feePercentage > 2 ? '#ec4899' : '#3b82f6'

          // Check if this config is currently selected
          const isSelected = config.id === configId

          return (
            <div
              key={config.id}
              className={`${
                isSelected
                  ? 'bg-purple-800/30 border-purple-500'
                  : 'bg-white/10 border-white/20 hover:border-purple-500/50'
              } rounded-lg border transition flex flex-col h-full relative overflow-hidden`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-medium py-1 px-2 rounded-bl-md">
                  Selected
                </div>
              )}

              <div className="p-4 pb-3 relative z-10">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-white mb-4">
                    Config: {config.id.substring(0, 8)}...
                  </h3>
                </div>
                <TokenomicsChart
                  liquidityPoints={liquidityPoints}
                  height={100}
                  baseDecimals={config.account.tokenDecimal}
                  showAnalytics={false}
                  showLiquidity={false}
                  showExplanation={false}
                  lineColor={lineColor}
                  migrationQuoteThreshold={config.account.migrationQuoteThreshold.toNumber()}
                />

                <div className="text-sm text-gray-300 space-y-2 mb-4">
                  <p className="flex justify-between items-center">
                    <span>Trading Fee:</span>
                    <span className="font-medium text-white">
                      {feePercentage.toFixed(2)}%
                    </span>
                  </p>
                  <p className="flex justify-between items-center">
                    <span>Fee Schedule:</span>
                    <span className="font-medium text-white">
                      {config.account.poolFees.baseFee.feeSchedulerMode === 0
                        ? 'Fixed'
                        : 'Dynamic'}
                    </span>
                  </p>
                </div>
              </div>

              <Link
                to={`/create-pool?config=${config.id}`}
                preventScrollReset
                className={`mt-auto ${
                  isSelected
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-purple-600/30 hover:bg-purple-600/50'
                } transition py-3 text-center text-sm font-medium w-full rounded-b-lg relative z-10`}
              >
                {isSelected ? 'Selected Configuration' : 'Use This Config'}
              </Link>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white">
      {/* Header */}
      <Header currentPath="/create-pool" />

      {/* Page Content */}
      <main className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-2">Create Pool</h1>
            <p className="text-gray-300">
              Launch your token with a customizable price curve
            </p>
          </div>
          <Link
            to="/config"
            className="mt-4 md:mt-0 bg-white/10 px-6 py-3 rounded-full font-medium hover:bg-white/20 transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Configurations</span>
          </Link>
        </div>

        {/* Your Saved Configurations Section */}
        {wallet.connected && (
          <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 mb-8">
            <h2 className="text-xl font-bold mb-4">
              Your Saved Configurations
            </h2>
            {renderUserConfigs()}
          </div>
        )}

        {isSuccess ? (
          <div className="bg-white/5 rounded-xl p-8 backdrop-blur-sm border border-white/10 text-center">
            <div className="bg-green-500/20 p-4 rounded-full inline-flex mb-6">
              <Check className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Pool Created Successfully!
            </h2>
            <p className="text-gray-300 mb-8 max-w-lg mx-auto">
              Your token pool has been created and is now live on the Virtual
              Curve platform. Users can now buy and trade your tokens.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/explore"
                className="bg-white/10 px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition"
              >
                Explore Pools
              </Link>
              <Link
                to="/create-pool"
                className="bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
              >
                Create Another Pool
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Token Details Section */}
            <div className="bg-white/5 rounded-xl p-8 backdrop-blur-sm border border-white/10">
              <h2 className="text-2xl font-bold mb-6">Token Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label
                      htmlFor="tokenName"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Token Name*
                    </label>
                    <input
                      id="tokenName"
                      name="tokenName"
                      type="text"
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="e.g. Virtual Coin"
                      value={formValues.tokenName}
                      onChange={handleInputChange}
                      required
                      minLength={3}
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="tokenSymbol"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Token Symbol*
                    </label>
                    <input
                      id="tokenSymbol"
                      name="tokenSymbol"
                      type="text"
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="e.g. VRTL"
                      value={formValues.tokenSymbol}
                      onChange={handleInputChange}
                      required
                      maxLength={10}
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="tokenDescription"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="tokenDescription"
                      name="tokenDescription"
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="Describe your token"
                      rows={4}
                      value={formValues.tokenDescription || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="tokenLogo"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Token Logo
                  </label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                    <Upload className="w-10 h-10 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-300 mb-2">
                      Drag and drop your logo here
                    </p>
                    <p className="text-gray-400 text-sm mb-4">
                      PNG, JPG or SVG (max. 2MB)
                    </p>
                    <button
                      type="button"
                      className="bg-white/10 px-4 py-2 rounded-lg text-sm hover:bg-white/20 transition"
                    >
                      Browse Files
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="bg-white/5 rounded-xl p-8 backdrop-blur-sm border border-white/10">
              <h2 className="text-2xl font-bold mb-6">
                Social Links (Optional)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="mb-4">
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Website
                  </label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    placeholder="https://yourwebsite.com"
                    value={formValues.website}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="twitter"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Twitter
                  </label>
                  <input
                    id="twitter"
                    name="twitter"
                    type="url"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    placeholder="https://twitter.com/yourusername"
                    value={formValues.twitter}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="telegram"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Telegram
                  </label>
                  <input
                    id="telegram"
                    name="telegram"
                    type="url"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    placeholder="https://t.me/yourchannel"
                    value={formValues.telegram}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="discord"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Discord
                  </label>
                  <input
                    id="discord"
                    name="discord"
                    type="url"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    placeholder="https://discord.gg/yourinvite"
                    value={formValues.discord}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <p className="text-red-200">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-4 rounded-xl font-medium hover:opacity-90 transition flex items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Pool...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    <span>Launch Pool</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
