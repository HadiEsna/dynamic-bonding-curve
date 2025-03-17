import { useState, useEffect } from 'react'
import { Link } from '@remix-run/react'
import type { MetaFunction } from '@remix-run/cloudflare'
import {
  Search,
  CheckCircle,
  Box,
  TrendingUp,
  LineChart,
  Waves,
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const meta: MetaFunction = () => {
  return [
    { title: 'Explore Pools - Virtual Curve' },
    {
      name: 'description',
      content: 'Browse and discover token pools on Virtual Curve.',
    },
  ]
}

// Mock data for pools - in a real implementation, this would come from your API
const MOCK_POOLS = [
  {
    id: '1',
    name: 'BONK Clone',
    symbol: 'BONKC',
    creator: '7xKX...9Ys3',
    type: 'Pump.fun Style',
    liquidity: '45,230 SOL',
    volume24h: '12,450 SOL',
    price: '0.00000124 SOL',
    priceChange: '+15.4%',
    createdAt: '2023-12-15',
    curve: 'exponential',
    verified: true,
  },
  {
    id: '2',
    name: 'Solana Meme',
    symbol: 'SMEME',
    creator: '3jKL...7Pq2',
    type: 'Custom Curve',
    liquidity: '23,450 SOL',
    volume24h: '8,320 SOL',
    price: '0.0000342 SOL',
    priceChange: '+5.2%',
    createdAt: '2023-12-10',
    curve: 'custom',
    verified: true,
  },
  {
    id: '3',
    name: 'Degen Token',
    symbol: 'DEGEN',
    creator: '9pQR...2Zx4',
    type: 'Standard Launch',
    liquidity: '12,780 SOL',
    volume24h: '4,560 SOL',
    price: '0.00000078 SOL',
    priceChange: '-2.3%',
    createdAt: '2023-12-05',
    curve: 'linear',
    verified: false,
  },
  {
    id: '4',
    name: 'Moon Shot',
    symbol: 'MOON',
    creator: '5tYU...8Vb6',
    type: 'Pump.fun Style',
    liquidity: '78,900 SOL',
    volume24h: '34,560 SOL',
    price: '0.0000567 SOL',
    priceChange: '+45.7%',
    createdAt: '2023-12-18',
    curve: 'exponential',
    verified: true,
  },
  {
    id: '5',
    name: 'Solana Inu',
    symbol: 'SINU',
    creator: '2wER...4Dc8',
    type: 'Custom Curve',
    liquidity: '56,700 SOL',
    volume24h: '23,450 SOL',
    price: '0.00000234 SOL',
    priceChange: '+8.9%',
    createdAt: '2023-12-12',
    curve: 'custom',
    verified: false,
  },
  {
    id: '6',
    name: 'Pepe Sol',
    symbol: 'PSOL',
    creator: '6hJK...1Mn3',
    type: 'Standard Launch',
    liquidity: '34,560 SOL',
    volume24h: '12,340 SOL',
    price: '0.00000456 SOL',
    priceChange: '-1.2%',
    createdAt: '2023-12-08',
    curve: 'linear',
    verified: true,
  },
]

export default function ExplorePools() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('liquidity')
  const [pools, setPools] = useState(MOCK_POOLS)

  // Filter and sort pools based on user selections
  useEffect(() => {
    let filteredPools = [...MOCK_POOLS]

    // Apply search filter
    if (searchTerm) {
      filteredPools = filteredPools.filter(
        (pool) =>
          pool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pool.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply type filter
    if (filterType !== 'all') {
      filteredPools = filteredPools.filter((pool) => pool.type === filterType)
    }

    // Apply sorting
    filteredPools.sort((a, b) => {
      switch (sortBy) {
        case 'liquidity':
          return parseFloat(a.liquidity.replace(/[^0-9.]/g, '')) >
            parseFloat(b.liquidity.replace(/[^0-9.]/g, ''))
            ? -1
            : 1
        case 'volume':
          return parseFloat(a.volume24h.replace(/[^0-9.]/g, '')) >
            parseFloat(b.volume24h.replace(/[^0-9.]/g, ''))
            ? -1
            : 1
        case 'newest':
          return new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1
        case 'price':
          return parseFloat(a.price.replace(/[^0-9.]/g, '')) >
            parseFloat(b.price.replace(/[^0-9.]/g, ''))
            ? -1
            : 1
        default:
          return 0
      }
    })

    setPools(filteredPools)
  }, [searchTerm, filterType, sortBy])

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white">
      {/* Header */}
      <Header currentPath="/explore" />

      {/* Page Content */}
      <main className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-2">Explore Pools</h1>
            <p className="text-gray-300">
              Discover and trade on Virtual Curve pools
            </p>
          </div>
          <Link
            to="/create"
            className="mt-4 md:mt-0 bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 rounded-full font-medium hover:opacity-90 transition"
          >
            Create New Pool
          </Link>
        </div>

        {/* Search and Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Search Input */}
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-purple-300" strokeWidth={1.5} />
              </div>
              <input
                type="search"
                className="block w-full p-2.5 pl-9 text-sm bg-white/5 border border-white/10 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
                placeholder="Search by name or symbol"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex gap-4">
            <select
              className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl p-3 text-sm focus:ring-purple-500 focus:border-purple-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Pump.fun Style">Pump.fun Style</option>
              <option value="Standard Launch">Standard Launch</option>
              <option value="Custom Curve">Custom Curve</option>
            </select>

            <select
              className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl p-3 text-sm focus:ring-purple-500 focus:border-purple-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="liquidity">Highest Liquidity</option>
              <option value="volume">Highest Volume</option>
              <option value="newest">Newest First</option>
              <option value="price">Highest Price</option>
            </select>
          </div>
        </div>

        {/* Pools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pools.length > 0 ? (
            pools.map((pool) => (
              <div
                key={pool.id}
                className="bg-white/5 rounded-xl overflow-hidden backdrop-blur-sm hover:bg-white/10 transition border border-white/10"
              >
                {/* Pool curve visualization at the top */}
                <div className="h-20 w-full relative">
                  {pool.curve === 'exponential' && (
                    <div className="w-full h-full bg-gradient-to-tr from-pink-500/5 to-purple-500/5 relative overflow-hidden flex items-center justify-center">
                      <TrendingUp
                        className="w-10 h-10 text-pink-500/40"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}
                  {pool.curve === 'linear' && (
                    <div className="w-full h-full bg-gradient-to-tr from-blue-500/5 to-teal-500/5 relative overflow-hidden flex items-center justify-center">
                      <LineChart
                        className="w-10 h-10 text-blue-500/40"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}
                  {pool.curve === 'custom' && (
                    <div className="w-full h-full bg-gradient-to-tr from-purple-500/5 to-indigo-500/5 relative overflow-hidden flex items-center justify-center">
                      <Waves
                        className="w-10 h-10 text-purple-500/40"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}

                  {/* Pool type badge */}
                  <span
                    className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-xs font-medium ${
                      pool.type === 'Pump.fun Style'
                        ? 'bg-pink-500/70 text-white'
                        : pool.type === 'Custom Curve'
                        ? 'bg-purple-500/70 text-white'
                        : 'bg-blue-500/70 text-white'
                    }`}
                  >
                    {pool.type}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-1">
                        <h3 className="text-lg font-bold">{pool.name}</h3>
                        {pool.verified && (
                          <CheckCircle
                            className="w-3.5 h-3.5 text-blue-400"
                            strokeWidth={1.5}
                          />
                        )}
                      </div>
                      <p className="text-gray-400 text-xs">${pool.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{pool.price}</p>
                      <span
                        className={`text-xs ${
                          pool.priceChange.startsWith('+')
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {pool.priceChange}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs">Liquidity</p>
                      <p className="font-medium">{pool.liquidity}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">24h Volume</p>
                      <p className="font-medium">{pool.volume24h}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Creator</p>
                      <p className="font-medium">{pool.creator}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Created</p>
                      <p className="font-medium">
                        {new Date(pool.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/pool/${pool.id}`}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 px-3 py-2 rounded-lg font-medium hover:opacity-90 transition text-center text-sm"
                    >
                      Trade
                    </Link>
                    <Link
                      to={`/pool/${pool.id}/details`}
                      className="flex-1 bg-transparent border border-white/20 px-3 py-2 rounded-lg font-medium hover:bg-white/10 transition text-center text-sm"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 bg-white/5 rounded-lg border border-white/10">
              <Box
                className="w-8 h-8 mx-auto mb-2 text-gray-400"
                strokeWidth={1.5}
              />
              <h3 className="text-base font-bold mb-1">No pools found</h3>
              <p className="text-gray-400 text-xs">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
