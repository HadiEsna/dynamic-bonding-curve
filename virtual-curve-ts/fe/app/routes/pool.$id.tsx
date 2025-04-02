import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData, useParams } from '@remix-run/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState, useCallback, useRef, useEffect, memo } from 'react'
import { useVirtualProgram } from '~/contexts/VirtualProgramContext'
import BN from 'bn.js'
import { type VirtualPool, type PoolConfig } from '../../../lib/src/types'
import { TOKEN_PROGRAM_ID, type VirtualCurveSDK } from '../../../lib/src/index'
import { toast } from 'sonner'
import { useWallet } from '@jup-ag/wallet-adapter'
import { useSendTransaction } from '~/hooks/useSendTransaction'
import { Connection, Transaction } from '@solana/web3.js'

// Props for the new SwapForm component
interface SwapFormProps {
  sdk: VirtualCurveSDK | null
  pool: VirtualPool | undefined
  config: PoolConfig | undefined
  connection: Connection | null
}

// Helper to safely get mint display string
const getMintDisplay = (mint: any): string => {
  if (!mint) return '?'
  const str = mint.toString()
  return `${str.substring(0, 4)}...`
}

// Extracted and Memoized SwapForm Component
const SwapForm: React.FC<SwapFormProps> = memo(
  ({ connection, sdk, pool, config }) => {
    const params = useParams()
    const queryClient = useQueryClient()
    const [inputAmount, setInputAmount] = useState('')
    const [outputAmount, setOutputAmount] = useState<string | null>(null)
    const [calculationError, setCalculationError] = useState<string | null>(
      null
    )
    const [isCalculating, setIsCalculating] = useState(false)
    const [isSwapping, setIsSwapping] = useState(false)
    const [swapDirection, setSwapDirection] = useState<
      'quoteToBase' | 'baseToQuote'
    >('quoteToBase')
    const wallet = useWallet()
    const poolPubkey: string = params.id as string
    const { sendTransaction } = useSendTransaction()

    const debounceTimeoutRef = useRef<number | null>(null)

    useEffect(() => {
      return () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current)
        }
      }
    }, [])

    const handleAmountChange = useCallback(
      async (value: string) => {
        // Reset state
        setOutputAmount(null)
        setCalculationError(null)

        if (!value || value.trim() === '') {
          return
        }

        let amountInBN: BN
        try {
          amountInBN = new BN(value.trim())
          if (amountInBN.isNeg() || amountInBN.isZero()) {
            return // Don't proceed with calculation for zero/negative
          }
        } catch (e) {
          setCalculationError('Invalid amount format.')
          return
        }

        if (!sdk || !pool || !config) {
          setCalculationError('SDK or Pool data not available.') // Simplified error
          return
        }

        try {
          const isBaseToQuote = swapDirection === 'baseToQuote'
          const swapBaseForQuoteFlag = isBaseToQuote
          const currentPointBN = new BN(0) // Assuming 0 for current point, adjust if needed

          // Using quoteExactIn for calculation
          const quoteResult = await sdk.quoteExactIn(
            // Assuming async based on previous code
            pool,
            config,
            swapBaseForQuoteFlag,
            amountInBN,
            false, // await_next_update
            currentPointBN
          )

          if (!quoteResult || !quoteResult.amountOut) {
            throw new Error('Could not calculate quote.')
          }

          setOutputAmount(quoteResult.amountOut.toString())
        } catch (err: any) {
          console.error('Quote calculation error:', err)
          setCalculationError(err.message || 'Failed to calculate quote')
        }
      },
      [sdk, pool, config, swapDirection]
    )

    const debouncedHandleAmountChange = useCallback(
      (value: string) => {
        setInputAmount(value) // Update input immediately
        // Clear previous results before debouncing
        setOutputAmount(null)
        setCalculationError(null)
        setIsCalculating(false) // Reset calculating state

        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current)
        }

        if (!value || value.trim() === '') {
          return // Don't start calculation if input is empty
        }

        // Only set calculating state when we are about to start the timer
        setIsCalculating(true)

        debounceTimeoutRef.current = window.setTimeout(async () => {
          try {
            // Pass the latest value from state in case it changed? No, pass the triggering value.
            await handleAmountChange(value)
          } finally {
            setIsCalculating(false)
          }
        }, 500)
      },
      [handleAmountChange] // Keep dependency here
    )

    const handleSwap = useCallback(async () => {
      // Re-check conditions clearly
      if (
        !sdk ||
        !pool ||
        !config ||
        !inputAmount ||
        !outputAmount ||
        isCalculating ||
        isSwapping ||
        calculationError ||
        !wallet.publicKey ||
        !connection
      ) {
        toast.error('Cannot swap. Check inputs or wait for calculations.')
        return
      }

      setIsSwapping(true)
      // Use sonner toast methods
      const toastId = toast.loading('Processing swap...')

      try {
        const amountInBN = new BN(inputAmount.trim())
        const minAmountOutBN = new BN(outputAmount.trim()) // Using calculated output as min amount out (0 slippage)

        if (amountInBN.isZero()) {
          // Only need to check amountIn
          throw new Error('Input amount cannot be zero.')
        }

        const isBaseToQuote = swapDirection === 'baseToQuote'
        const swapBaseForQuoteFlag = isBaseToQuote
        const currentPointBN = new BN(0) // Assuming 0, confirm if SDK needs real value

        // *** ATTEMPTING swapExactIn CALL - SIGNATURE MAY DIFFER ***
        // This assumes swapExactIn exists, takes these args, and returns a string signature.
        // This might need significant changes based on the actual SDK.
        const ixs = await sdk.swap(
          {
            baseMint: pool.baseMint,
            baseVault: pool.baseVault,
            config: pool.config,
            user: wallet.publicKey,
            payer: wallet.publicKey,
            pool: poolPubkey,
            quoteMint: config.quoteMint,
            quoteVault: pool.quoteVault,
            referralTokenAccount: null,
            tokenBaseProgram: TOKEN_PROGRAM_ID,
            tokenQuoteProgram: TOKEN_PROGRAM_ID,
          },
          {
            amountIn: amountInBN,
            minimumAmountOut: new BN(0),
          }
        )

        const latestBlockhash = await connection.getLatestBlockhash()
        const transaction = new Transaction({
          ...latestBlockhash,
          feePayer: wallet.publicKey,
        }).add(...ixs)

        // Use the sendTransaction hook instead of directly sending and confirming
        const resp = await sendTransaction(transaction, connection, {
          onSuccess: (signature) => {
            console.log('Swap successful, tx:', signature)
          },
          onError: (err) => {
            console.error('Failed to swap:', err)
            // setError(err.message)
          },
        })
        await resp?.unwrap()

        // Reset form and refetch pool data on success
        setInputAmount('')
        setOutputAmount(null)
        setCalculationError(null)
        // Invalidate query to refetch pool data
        queryClient.invalidateQueries({ queryKey: ['pool', params.id] })
      } catch (err: any) {
        console.error('Swap failed:', err)
        const errorMessage = err.message || 'Swap transaction failed.'
        toast.error(`Swap failed: ${errorMessage}`, { id: toastId })
        setCalculationError(errorMessage) // Optionally display error in form area too
      } finally {
        setIsSwapping(false)
      }
    }, [
      sdk,
      pool,
      config,
      inputAmount,
      outputAmount,
      calculationError,
      isCalculating,
      isSwapping,
      swapDirection,
      queryClient,
      params.id,
    ])

    // Derived state for disabling the button
    const canSwap =
      !isCalculating &&
      !isSwapping &&
      !!inputAmount &&
      !!outputAmount &&
      !calculationError

    // Determine input/output mints based on direction
    const inputMint =
      swapDirection === 'quoteToBase' ? config?.quoteMint : pool?.baseMint
    const outputMint =
      swapDirection === 'quoteToBase' ? pool?.baseMint : config?.quoteMint

    return (
      <div className="mt-6 pt-4 border-t border-white/10">
        <h4 className="text-lg font-semibold mb-3 text-white">
          Swap (Raw Amounts)
        </h4>
        {/* TODO: Add Swap Direction Toggle Button Here */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="inputAmount"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              {/* Safely display mints */}
              You Pay ({getMintDisplay(inputMint)} Token - Raw Amount)
            </label>
            <input
              type="text" // Use text for BN compatibility, patterns handle numeric input
              inputMode="numeric" // Hint for mobile keyboards
              pattern="[0-9]*" // Allow only digits
              id="inputAmount"
              name="inputAmount"
              value={inputAmount}
              onChange={(e) => debouncedHandleAmountChange(e.target.value)}
              placeholder="0"
              className="block w-full p-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-pink-500 focus:border-pink-500 disabled:opacity-70"
              disabled={isSwapping} // Disable input while swapping
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {/* Safely display mints */}
              You Receive ({getMintDisplay(outputMint)} Token - Raw Amount)
              (Est.)
            </label>
            <div className="block w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white min-h-[44px] flex items-center">
              {isCalculating ? (
                <span className="text-gray-400 text-sm">Calculating...</span>
              ) : calculationError ? (
                <span className="text-red-400 text-xs break-all">
                  Error: {calculationError}
                </span>
              ) : outputAmount !== null ? (
                <span className="break-all">{outputAmount}</span>
              ) : (
                <span className="text-gray-500">-</span> // Placeholder when no amount/error/loading
              )}
            </div>
          </div>
          <button
            onClick={handleSwap}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2.5 rounded-lg font-medium hover:opacity-90 transition text-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canSwap} // Use derived boolean for clarity
          >
            {isSwapping ? 'Swapping...' : 'Swap'}
          </button>
        </div>
      </div>
    )
  }
)
SwapForm.displayName = 'SwapForm' // Helps in React DevTools

export default function PoolDetailsPage() {
  const params = useParams()
  const { sdk, connection } = useVirtualProgram()

  const {
    data,
    isLoading: isLoadingPool,
    error: poolError,
  } = useQuery({
    queryKey: ['pool', params.id],
    queryFn: async () => {
      if (!sdk || !params.id) return null
      try {
        const pool = await sdk.getPool(params.id as string)
        if (!pool) throw new Error('Pool not found')
        // Ensure config is fetched only if pool exists
        const config = await sdk.getPoolConfig(pool.config.toString())
        if (!config) throw new Error('Config not found for pool')
        return { pool, config } // Return both together
      } catch (err) {
        console.error('Error fetching pool data:', err)
        // Rethrow to let react-query handle the error state
        throw err
      }
    },
    enabled: !!sdk && !!params.id, // Only run query if sdk and id are available
    // Optional: Add staleTime or refetchInterval if desired
    // staleTime: 1000 * 60, // 1 minute
    // refetchInterval: 1000 * 60 * 5, // 5 minutes
  })

  // Extract pool and config safely after loading and error checks
  const pool = data?.pool
  const config = data?.config

  // --- Loading State ---
  if (isLoadingPool) {
    return (
      <div className="container mx-auto p-4 text-white">
        Loading Pool Data...
      </div>
    )
  }

  // --- Error State ---
  if (poolError) {
    return (
      <div className="container mx-auto p-4 text-red-400">
        Error Loading Pool: {poolError.message}
      </div>
    )
  }

  // --- Data Not Available State ---
  // This covers cases where queryFn returns null or data is undefined after loading finishes without error
  if (!pool || !config) {
    return (
      <div className="container mx-auto p-4 text-white">
        Pool data not found or incomplete.
      </div>
    )
  }

  // --- Success State (Render Page) ---
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Pool Details</h1>
      <p className="mb-2 text-gray-300">
        <span className="font-semibold">Pool ID:</span> {params.id}
      </p>

      <div className="bg-white/5 rounded-xl overflow-hidden backdrop-blur-sm border border-white/10 mt-4">
        <div className="h-20 w-full relative bg-gradient-to-r from-indigo-800 to-purple-800 flex items-center justify-center">
          <span className="text-gray-300 text-sm">Pool Visualization Area</span>
          {/* Display Pool Type (SPL / Token2022) */}
          {pool.poolType !== undefined && (
            <span
              className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-xs font-medium bg-black/30`}
            >
              {pool.poolType === 0 ? 'SPL-Token' : 'Token2022'}
            </span>
          )}
        </div>

        <div className="p-4 text-white">
          {/* Pool Header: Pair Info */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-1">
                <h3 className="text-lg font-bold">
                  {/* Display Base/Quote mints safely */}
                  Pair: {getMintDisplay(pool.baseMint)} /{' '}
                  {getMintDisplay(config.quoteMint)}
                </h3>
              </div>
              <p className="text-gray-400 text-xs">
                Base Mint: {pool.baseMint?.toString() ?? 'N/A'} <br />
                Quote Mint: {config.quoteMint?.toString() ?? 'N/A'}
              </p>
            </div>
            {/* Potential placeholder for icons or actions */}
            <div className="text-right"></div>
          </div>

          {/* Pool Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs">Base Reserve (Liquidity)</p>
              <p className="font-medium">
                {pool.baseReserve?.toString() ?? 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Quote Reserve</p>
              <p className="font-medium">
                {pool.quoteReserve?.toString() ?? 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">
                Total Trading Fee (Base) {/* Check actual fee units/token */}
              </p>
              <p className="font-medium">
                {pool.metrics?.totalTradingBaseFee?.toString() ?? 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Creator</p>
              <p className="font-medium break-all">
                {' '}
                {/* Allow long creator address to wrap */}
                {pool.creator?.toString() ?? 'N/A'}
              </p>
            </div>
          </div>

          {/* Swap Form Component */}
          <SwapForm
            connection={connection}
            sdk={sdk}
            pool={pool}
            config={config}
          />
        </div>
      </div>
    </div>
  )
}
