import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function PostFood() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    description: '',
    quantity: '',
    address: '',
    pickup_start: '',
    pickup_end: '',
    dietary_notes: '',
    photo_url: '',
    category: 'other'
  })
  const [loading, setLoading] = useState(false)
  const [coordinates, setCoordinates] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const geocodeAddress = async () => {
    if (!formData.address) return

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}`
      )
      const data = await response.json()
      if (data && data.length > 0) {
        setCoordinates({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        })
      }
    } catch (error) {
      console.error('Geocoding error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!coordinates) {
      alert('Please enter an address and click "Find Location" to geocode it')
      setLoading(false)
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('Please login to post food')
        navigate('/login')
        return
      }

      const { error } = await supabase
        .from('postings')
        .insert({
          user_id: user.id,
          description: formData.description,
          quantity: formData.quantity,
          photo_url: formData.photo_url || null,
          lat: coordinates.lat,
          lng: coordinates.lng,
          address: formData.address,
          pickup_start: new Date(formData.pickup_start).toISOString(),
          pickup_end: new Date(formData.pickup_end).toISOString(),
          dietary_notes: formData.dietary_notes,
          category: formData.category,
          status: 'available'
        })

      if (error) throw error

      alert('Food posted successfully!')
      navigate('/')
    } catch (error) {
      console.error('Error posting food:', error)
      alert('Error posting food. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Post Surplus Food</h1>
        <p className="text-gray-600">Share your excess food with those who need it</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Food Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            rows="3"
            placeholder="Describe the food (e.g., 20 sandwiches, assorted pastries, etc.)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          >
            <option value="other">Other</option>
            <option value="prepared">Prepared Food</option>
            <option value="bakery">Bakery Items</option>
            <option value="produce">Fresh Produce</option>
            <option value="dairy">Dairy Products</option>
            <option value="canned">Canned Goods</option>
            <option value="beverages">Beverages</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity / Portions *
          </label>
          <input
            type="text"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            placeholder="e.g., 20 portions, 5 kg, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo URL (optional)
          </label>
          <input
            type="url"
            name="photo_url"
            value={formData.photo_url}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Address *
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              placeholder="Enter address"
            />
            <button
              type="button"
              onClick={geocodeAddress}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium whitespace-nowrap"
            >
              Find Location
            </button>
          </div>
          {coordinates && (
            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Location found
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pickup Start Time *
            </label>
            <input
              type="datetime-local"
              name="pickup_start"
              value={formData.pickup_start}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pickup End Time *
            </label>
            <input
              type="datetime-local"
              name="pickup_end"
              value={formData.pickup_end}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dietary / Allergen Notes (optional)
          </label>
          <textarea
            name="dietary_notes"
            value={formData.dietary_notes}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            rows="2"
            placeholder="e.g., Contains nuts, vegetarian, gluten-free, etc."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white py-4 px-4 rounded-xl hover:bg-gray-800 disabled:bg-gray-300 font-medium transition-colors"
        >
          {loading ? 'Posting...' : 'Post Food'}
        </button>
      </form>
    </div>
  )
}
