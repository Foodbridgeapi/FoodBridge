import React, { useState } from 'react';
import { createStellarWallet, fundTestnetAccount, getAccountBalance } from './stellarClient';
import './App.css';

function App() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [foodListings, setFoodListings] = useState([
    { id: 1, title: 'Fresh Vegetables', type: 'Produce', quantity: '10kg', location: 'Downtown', status: 'Available' },
    { id: 2, title: 'Bread Items', type: 'Bakery', quantity: '20 loaves', location: 'Midtown', status: 'Available' },
    { id: 3, title: 'Dairy Products', type: 'Dairy', quantity: '5 gallons', location: 'Uptown', status: 'Available' },
  ]);

  const handleCreateWallet = async () => {
    setLoading(true);
    try {
      const newWallet = createStellarWallet();
      setWallet(newWallet);
      
      // Fund testnet account
      if (import.meta.env.VITE_STELLAR_NETWORK === 'testnet') {
        await fundTestnetAccount(newWallet.publicKey);
      }
      
      // Get balance
      const balances = await getAccountBalance(newWallet.publicKey);
      setBalance(balances);
    } catch (error) {
      console.error('Error creating wallet:', error);
      alert('Failed to create wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-green-600">🍎 FoodBridge</h1>
            <div className="flex gap-4">
              {wallet ? (
                <div className="bg-green-100 px-4 py-2 rounded-lg">
                  <span className="text-sm text-green-800">Wallet: {wallet.publicKey.slice(0, 8)}...{wallet.publicKey.slice(-8)}</span>
                </div>
              ) : (
                <button
                  onClick={handleCreateWallet}
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Stellar Wallet'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Wallet Info */}
        {wallet && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Stellar Wallet</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Public Key:</p>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">{wallet.publicKey}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Secret Key:</p>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">{wallet.secretKey}</p>
                <p className="text-xs text-red-500 mt-1">⚠️ Keep your secret key safe!</p>
              </div>
              {balance && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Balance:</p>
                  <div className="mt-2">
                    {balance.map((bal, idx) => (
                      <div key={idx} className="bg-green-50 p-2 rounded mb-1">
                        <span className="font-semibold">{bal.asset}:</span> {bal.balance}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Food Listings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Available Food Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foodListings.map((food) => (
              <div key={food.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{food.title}</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{food.status}</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Type:</span> {food.type}</p>
                  <p><span className="font-medium">Quantity:</span> {food.quantity}</p>
                  <p><span className="font-medium">Location:</span> {food.location}</p>
                </div>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                  Claim This Item
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-3">🔗</div>
            <h3 className="font-semibold mb-2">Stellar Integration</h3>
            <p className="text-sm text-gray-600">Transparent food tracking on blockchain with immutable records</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-semibold mb-2">Micro-Donations</h3>
            <p className="text-sm text-gray-600">Low-cost transactions to support food rescue operations</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="font-semibold mb-2">Global Access</h3>
            <p className="text-sm text-gray-600">Accessible to anyone with a smartphone, no bank account needed</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2024 FoodBridge. Built on Stellar blockchain.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
