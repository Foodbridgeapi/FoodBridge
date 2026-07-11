import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    org_name: '',
    role: 'recipient'
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        navigate('/login')
        return
      }

      setUser(authUser)

      const { data: profileData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) throw error

      setProfile(profileData)
      setFormData({
        name: profileData.name,
        org_name: profileData.org_name || '',
        role: profileData.role
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: formData.name,
          org_name: formData.org_name || null,
          role: formData.role
        })
        .eq('id', user.id)

      if (error) throw error

      await fetchProfile()
      setEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account settings</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              >
                <option value="recipient">Recipient</option>
                <option value="donor">Donor</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name (optional)
              </label>
              <input
                type="text"
                value={formData.org_name}
                onChange={(e) => setFormData({ ...formData, org_name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                placeholder="If representing an organization"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-xl hover:bg-gray-800 disabled:bg-gray-300 font-medium transition-colors"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Name</p>
              <p className="text-lg font-medium text-gray-900">{profile?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="text-lg font-medium text-gray-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Role</p>
              <p className="text-lg font-medium text-gray-900 capitalize">{profile?.role}</p>
            </div>
            {profile?.org_name && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Organization</p>
                <p className="text-lg font-medium text-gray-900">{profile.org_name}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500 mb-1">Member Since</p>
              <p className="text-lg font-medium text-gray-900">
                {new Date(profile?.created_at).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl hover:bg-gray-800 font-medium transition-colors mt-4"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-red-50 text-red-600 py-3 px-4 rounded-xl hover:bg-red-100 font-medium transition-colors"
      >
        Sign Out
      </button>
    </div>
  )
}
