import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Listings() {
  const [postings, setPostings] = useState([])
  const [filteredPostings, setFilteredPostings] = useState([])
  const [filters, setFilters] = useState({
    status: 'all',
    foodType: '',
    category: 'all'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPostings()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [postings, filters])

  const fetchPostings = async () => {
    try {
      const { data, error } = await supabase
        .from('postings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPostings(data || [])
    } catch (error) {
      console.error('Error fetching postings:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...postings]

    if (filters.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.status)
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category)
    }

    if (filters.foodType) {
      filtered = filtered.filter(p => 
        p.description.toLowerCase().includes(filters.foodType.toLowerCase())
      )
    }

    setFilteredPostings(filtered)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading listings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Food Listings</h1>
        <p className="text-gray-600">Browse available food donations in your area</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            >
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="claimed">Claimed</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            >
              <option value="all">All Categories</option>
              <option value="prepared">Prepared Food</option>
              <option value="bakery">Bakery Items</option>
              <option value="produce">Fresh Produce</option>
              <option value="dairy">Dairy Products</option>
              <option value="canned">Canned Goods</option>
              <option value="beverages">Beverages</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={filters.foodType}
              onChange={(e) => setFilters({ ...filters, foodType: e.target.value })}
              placeholder="Search by food type..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Pickup Window
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Posted
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredPostings.map((posting) => (
              <tr key={posting.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{posting.description}</div>
                  <div className="text-sm text-gray-500 mt-1">{posting.address}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                  {posting.category || 'Other'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {posting.quantity}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(posting.pickup_start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(posting.pickup_end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${
                    posting.status === 'available' ? 'bg-green-100 text-green-700' :
                    posting.status === 'claimed' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {posting.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(posting.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {filteredPostings.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  No listings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredPostings.map((posting) => (
          <div key={posting.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-900">{posting.description}</h3>
              <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${
                posting.status === 'available' ? 'bg-green-100 text-green-700' :
                posting.status === 'claimed' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {posting.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">Category:</span> {posting.category || 'Other'}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">Quantity:</span> {posting.quantity}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">Pickup:</span> {new Date(posting.pickup_start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(posting.pickup_end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">Address:</span> {posting.address}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">Posted:</span> {new Date(posting.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
        {filteredPostings.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
            No listings found
          </div>
        )}
      </div>
    </div>
  )
}
