import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { supabase } from '../supabaseClient'
import 'leaflet/dist/leaflet.css'

export default function Home() {
  const [postings, setPostings] = useState([])
  const [filteredPostings, setFilteredPostings] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [selectedPosting, setSelectedPosting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [radius, setRadius] = useState(50) // Default 50km radius

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => console.log('Geolocation error:', error)
      )
    }

    // Fetch postings
    fetchPostings()

    // Set up realtime subscription
    const subscription = supabase
      .channel('postings-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'postings' }, (payload) => {
        fetchPostings()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    filterByRadius()
  }, [postings, radius, userLocation])

  const fetchPostings = async () => {
    try {
      const { data, error } = await supabase
        .from('postings')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPostings(data || [])
    } catch (error) {
      console.error('Error fetching postings:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterByRadius = () => {
    if (!userLocation) {
      setFilteredPostings(postings)
      return
    }

    const filtered = postings.filter(posting => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        posting.lat,
        posting.lng
      )
      return distance <= radius
    })

    setFilteredPostings(filtered)
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const handleClaim = async (postingId) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      alert('Please login to claim food')
      return
    }

    try {
      const { error } = await supabase
        .from('claims')
        .insert({
          posting_id: postingId,
          claimant_id: user.id
        })

      if (error) throw error

      alert('Food claimed successfully!')
      setSelectedPosting(null)
      fetchPostings()
    } catch (error) {
      console.error('Error claiming food:', error)
      alert('Error claiming food. It may already be claimed.')
    }
  }

  if (loading) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-64px)] relative">
      {/* Radius Filter Control */}
      <div className="absolute top-4 left-4 z-[1000] bg-white rounded-xl shadow-lg border border-gray-100 p-4 w-64">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Radius: {radius} km
        </label>
        <input
          type="range"
          min="5"
          max="200"
          step="5"
          value={radius}
          onChange={(e) => setRadius(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>5km</span>
          <span>200km</span>
        </div>
        {userLocation && (
          <p className="text-xs text-gray-600 mt-2">
            Showing {filteredPostings.length} of {postings.length} postings
          </p>
        )}
      </div>

      <MapContainer
        center={userLocation || [40.7128, -74.0060]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {filteredPostings.map((posting) => (
          <Marker
            key={posting.id}
            position={[posting.lat, posting.lng]}
            eventHandlers={{
              click: () => setSelectedPosting(posting)
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg">{posting.description}</h3>
                <p className="text-sm text-gray-600">Quantity: {posting.quantity}</p>
                <p className="text-sm text-gray-600">
                  Pickup: {new Date(posting.pickup_start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(posting.pickup_end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
                <button
                  onClick={() => handleClaim(posting.id)}
                  className="mt-2 w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800"
                >
                  Claim This
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {selectedPosting && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-5 z-[1000]">
          <button
            onClick={() => setSelectedPosting(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 className="font-semibold text-lg mb-3 text-gray-900 pr-8">{selectedPosting.description}</h3>
          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">Quantity:</span> {selectedPosting.quantity}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">Pickup:</span> {new Date(selectedPosting.pickup_start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(selectedPosting.pickup_end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">Address:</span> {selectedPosting.address}
            </p>
          </div>
          {selectedPosting.photo_url && (
            <img src={selectedPosting.photo_url} alt="Food" className="w-full h-40 object-cover rounded-xl mb-4" />
          )}
          <button
            onClick={() => handleClaim(selectedPosting.id)}
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors font-medium"
          >
            Claim This
          </button>
        </div>
      )}
    </div>
  )
}
