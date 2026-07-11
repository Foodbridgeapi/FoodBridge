import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPostings: 0,
    claimedPostings: 0,
    topDonors: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch total postings
      const { count: totalCount } = await supabase
        .from('postings')
        .select('*', { count: 'exact', head: true })

      // Fetch claimed postings
      const { count: claimedCount } = await supabase
        .from('postings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'claimed')

      // Fetch top donors (users with most postings)
      const { data: donorsData } = await supabase
        .from('postings')
        .select('user_id, count')
        .group('user_id')
        .order('count', { ascending: false })
        .limit(5)

      setStats({
        totalPostings: totalCount || 0,
        claimedPostings: claimedCount || 0,
        topDonors: donorsData || []
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Impact Dashboard</h1>
        <p className="text-gray-600">Track the community's food rescue impact</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-gray-100 text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Postings</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalPostings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-green-100 text-green-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Successful Pickups</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.claimedPostings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Impact Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalPostings > 0 
                  ? Math.round((stats.claimedPostings / stats.totalPostings) * 100) 
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Contributing Donors</h2>
        {stats.topDonors.length > 0 ? (
          <div className="space-y-3">
            {stats.topDonors.map((donor, index) => (
              <div key={donor.user_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-gray-900 mr-4">#{index + 1}</span>
                  <span className="text-sm text-gray-600">User ID: {donor.user_id.slice(0, 8)}...</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{donor.count} postings</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No donor data available yet</p>
        )}
      </div>
    </div>
  )
}
