import React, { useState } from 'react';
import { createStellarWallet, fundTestnetAccount, getAccountBalance } from './stellarClient';

function App() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [foodListings, setFoodListings] = useState([
    { id: 1, title: 'Fresh Vegetables', type: 'Produce', quantity: '10kg', location: 'Downtown', status: 'Available', icon: '🥬' },
    { id: 2, title: 'Bread Items', type: 'Bakery', quantity: '20 loaves', location: 'Midtown', status: 'Available', icon: '🥖' },
    { id: 3, title: 'Dairy Products', type: 'Dairy', quantity: '5 gallons', location: 'Uptown', status: 'Available', icon: '🥛' },
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-warm-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🍎</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">FoodBridge</h1>
            </div>
            <div className="flex gap-4">
              {wallet ? (
                <div className="bg-primary-50 border border-primary-200 px-4 py-2 rounded-xl flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-primary-800 font-medium">{wallet.publicKey.slice(0, 8)}...{wallet.publicKey.slice(-8)}</span>
                </div>
              ) : (
                <button
                  onClick={handleCreateWallet}
                  disabled={loading}
                  className="bg-black text-white px-6 py-2.5 rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      Create Wallet
                    </>
                  )}
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
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Stellar Wallet</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Public Key</p>
                <p className="font-mono text-sm bg-gray-50 p-3 rounded-xl border border-gray-200">{wallet.publicKey}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Secret Key</p>
                <p className="font-mono text-sm bg-gray-50 p-3 rounded-xl border border-gray-200">{wallet.secretKey}</p>
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">⚠️ Keep your secret key safe!</p>
              </div>
              {balance && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-2">Balance</p>
                  <div className="flex flex-wrap gap-2">
                    {balance.map((bal, idx) => (
                      <div key={idx} className="bg-primary-50 border border-primary-200 px-4 py-2 rounded-xl">
                        <span className="font-semibold text-primary-800">{bal.asset}:</span> <span className="text-primary-600">{bal.balance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Food Listings */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Available Food Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foodListings.map((food) => (
              <div key={food.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center text-2xl">
                      {food.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{food.title}</h3>
                      <span className="text-sm text-gray-500">{food.type}</span>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-3 py-1.5 rounded-full font-medium">{food.status}</span>
                </div>
                <div className="space-y-3 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📦</span>
                    <span className="font-medium text-gray-700">Quantity:</span> {food.quantity}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📍</span>
                    <span className="font-medium text-gray-700">Location:</span> {food.location}
                  </div>
                </div>
                <button className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-all font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 group-hover:scale-[1.02]">
                  <span>🛒</span>
                  Claim This Item
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center text-3xl mb-4">
              🔗
            </div>
            <h3 className="font-semibold mb-2 text-gray-800 text-lg">Stellar Integration</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Transparent food tracking on blockchain with immutable records</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-warm-100 to-warm-200 rounded-2xl flex items-center justify-center text-3xl mb-4">
              💰
            </div>
            <h3 className="font-semibold mb-2 text-gray-800 text-lg">Micro-Donations</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Low-cost transactions to support food rescue operations</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center text-3xl mb-4">
              🌍
            </div>
            <h3 className="font-semibold mb-2 text-gray-800 text-lg">Global Access</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Accessible to anyone with a smartphone, no bank account needed</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2024 FoodBridge. Built on Stellar blockchain.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
