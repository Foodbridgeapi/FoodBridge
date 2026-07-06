import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DarkModeProvider } from './contexts/DarkModeContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import PostFood from './pages/PostFood'
import Listings from './pages/Listings'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Favorites from './pages/Favorites'
import Admin from './pages/Admin'

function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post" element={<PostFood />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </BrowserRouter>
    </DarkModeProvider>
  )
}

export default App

// Micro change commit 1

// Micro change commit 11

// Micro change commit 21

// Micro change commit 31

// Micro change commit 41

// Micro change commit 51
