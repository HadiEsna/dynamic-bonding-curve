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
import Header from '../components/Header'
import Footer from '../components/Footer'
import TokenomicsChart from '../components/TokenomicsChart'
import { TEMPLATES } from '../lib/templates'

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

// Define the saved config type
interface SavedConfig {
  id: string
  name: string
  description?: string
  curveType: 'exponential' | 'linear' | 'custom'
  initialPrice: number
  maxSupply: number
  creatorFee: number
  tradingFee: number
}

export default function CreatePool() {
  const [searchParams] = useSearchParams()
  const configId = searchParams.get('config')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

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

  // Mock saved configurations (in a real app, this would come from a database or local storage)
  const savedConfigs: SavedConfig[] = [
    {
      id: '1',
      name: 'Pump.fun Style',
      description: 'Exponential price growth similar to pump.fun',
      curveType: 'exponential',
      initialPrice: 0.000001,
      maxSupply: 1000000000,
      creatorFee: 2.5,
      tradingFee: 1,
    },
    {
      id: '2',
      name: 'Standard Launch',
      description: 'Linear price growth for traditional token launches',
      curveType: 'linear',
      initialPrice: 0.0001,
      maxSupply: 100000000,
      creatorFee: 1.5,
      tradingFee: 0.5,
    },
  ]

  // Load configuration if configId is provided
  useEffect(() => {
    if (configId) {
      const config = savedConfigs.find((c) => c.id === configId)
      if (config) {
        setFormValues((prev) => ({
          ...prev,
          initialPrice: config.initialPrice,
          maxSupply: config.maxSupply,
          creatorFee: config.creatorFee,
          tradingFee: config.tradingFee,
          curveType: config.curveType,
        }))
      }
    }
  }, [configId])

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white">
      {/* Header */}
      <Header currentPath="/create" />

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
                to="/create"
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

            {/* Pool Configuration Section */}
            <div className="bg-white/5 rounded-xl p-8 backdrop-blur-sm border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Pool Configuration</h2>
                {configId && (
                  <div className="bg-purple-500/20 px-3 py-1 rounded-full text-sm text-purple-300 flex items-center gap-1">
                    <Info className="w-4 h-4" />
                    <span>Using saved configuration</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label
                      htmlFor="initialPrice"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Initial Price (SOL)*
                    </label>
                    <input
                      id="initialPrice"
                      name="initialPrice"
                      type="number"
                      step="0.000001"
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                      value={formValues.initialPrice}
                      onChange={handleInputChange}
                      required
                      min="0.000001"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="maxSupply"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Maximum Supply*
                    </label>
                    <input
                      id="maxSupply"
                      name="maxSupply"
                      type="number"
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                      value={formValues.maxSupply}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-4">
                    <label
                      htmlFor="curveType"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Curve Type*
                    </label>
                    <select
                      id="curveType"
                      name="curveType"
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                      value={formValues.curveType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="exponential">
                        Exponential (Pump.fun Style)
                      </option>
                      <option value="linear">Linear (Standard Launch)</option>
                      <option value="custom">Custom Curve</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label
                        htmlFor="creatorFee"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Creator Fee (%)*
                      </label>
                      <input
                        id="creatorFee"
                        name="creatorFee"
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                        value={formValues.creatorFee}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="tradingFee"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Trading Fee (%)*
                      </label>
                      <input
                        id="tradingFee"
                        name="tradingFee"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                        value={formValues.tradingFee}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Curve Visualization */}
              <div className="mt-6 p-6 bg-white/5 border border-white/10 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">
                  Price Curve Preview
                </h3>
                <div className="h-64 rounded-lg flex items-center justify-center">
                  <TokenomicsChart
                    liquidityPoints={
                      formValues.curveType === 'custom' &&
                      formValues.customCurveParams
                        ? formValues.customCurveParams.points.map((point) => ({
                            sqrtPrice: Math.sqrt(point.y * Math.pow(10, 9)), // Convert price to sqrtPrice
                            liquidity: Math.round(
                              (point.x * formValues.maxSupply) / 100
                            ), // Convert percentage to tokens
                          }))
                        : formValues.curveType === 'exponential'
                        ? TEMPLATES.exponential.liquidityDistribution || []
                        : TEMPLATES.linear.liquidityDistribution || []
                    }
                    height={256}
                    decimals={9} // Use default decimal places
                    showLiquidity={false}
                    lineColor={
                      formValues.curveType === 'exponential'
                        ? '#ec4899'
                        : formValues.curveType === 'custom'
                        ? '#a855f7'
                        : '#3b82f6'
                    }
                  />
                </div>
                <p className="text-center text-gray-400 text-sm mt-4">
                  This visualization shows how the token price will change as
                  more tokens are sold.
                  {formValues.curveType === 'exponential' &&
                    ' The exponential curve creates rapid price growth as supply decreases.'}
                  {formValues.curveType === 'linear' &&
                    ' The linear curve creates steady, predictable price growth.'}
                  {formValues.curveType === 'custom' &&
                    ' The custom curve allows for precise control over price points.'}
                </p>
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
