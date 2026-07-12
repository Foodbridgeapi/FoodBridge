import React, { useState } from 'react';
import { createStellarWallet, fundTestnetAccount, getAccountBalance } from './stellarClient';

function App() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showSecretModal, setShowSecretModal] = useState(false);
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
      
      // Show secret key modal one time
      setShowSecretModal(true);
    } catch (error) {
      console.error('Error creating wallet:', error);
      alert('Failed to create wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleCloseSecretModal = () => {
    setShowSecretModal(false);
  };

  const handleClaimItem = (id) => {
    console.log('Claim item clicked for ID:', id);
    alert('Claim functionality not yet implemented');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍎</span>
          <h1 className="text-xl font-bold text-neutral-900">FoodBridge</h1>
        </div>
        {wallet ? (
          <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
            {wallet.publicKey.slice(0, 8)}...{wallet.publicKey.slice(-8)}
          </div>
        ) : (
          <button
            onClick={handleCreateWallet}
            disabled={loading}
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-5 py-2.5 rounded-full transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Stellar Wallet'}
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Wallet Info */}
        {wallet && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-neutral-100">
            <h2 className="text-xl font-semibold mb-4 text-neutral-900">Your Stellar Wallet</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Public Key</p>
                <p className="font-mono text-sm bg-neutral-50 p-3 rounded-xl border border-neutral-200">{wallet.publicKey}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">Secret Key</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm bg-neutral-50 p-3 rounded-xl border border-neutral-200 flex-1">
                    {showSecretKey ? wallet.secretKey : '•••••••••••••••••••••••••'}
                  </p>
                  <button
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    title={showSecretKey ? 'Hide' : 'Show'}
                  >
                    {showSecretKey ? '🙈' : '👁️'}
                  </button>
                </div>
                <p className="text-xs text-red-500 mt-2">⚠️ Keep your secret key safe!</p>
              </div>
              {balance && (
                <div className="md:col-span-2">
                  <p className="text-sm text-neutral-600 mb-2">Balance</p>
                  <div className="flex flex-wrap gap-2">
                    {balance.map((bal, idx) => (
                      <div key={idx} className="bg-primary-50 border border-primary-200 px-4 py-2 rounded-xl">
                        <span className="font-semibold text-primary-700">{bal.asset}:</span> <span className="text-primary-600">{bal.balance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Food Listings */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-neutral-900">Available Food Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {foodListings.map((food) => (
              <div key={food.id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 border border-neutral-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-neutral-900">{food.title}</h3>
                  <span className="bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1 rounded-full">
                    Available
                  </span>
                </div>
                <div className="space-y-1.5 text-sm text-neutral-600 mb-4">
                  <p><span className="font-medium text-neutral-900">Type:</span> {food.type}</p>
                  <p><span className="font-medium text-neutral-900">Quantity:</span> {food.quantity}</p>
                  <p><span className="font-medium text-neutral-900">Location:</span> {food.location}</p>
                </div>
                <button 
                  onClick={() => handleClaimItem(food.id)}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2.5 rounded-xl transition-colors"
                >
                  Claim This Item
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-50 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">🔗</div>
            <h3 className="font-semibold text-neutral-900 mb-2">Stellar Integration</h3>
            <p className="text-sm text-neutral-600">Transparent food tracking on blockchain with immutable records</p>
          </div>
          <div className="bg-neutral-50 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-semibold text-neutral-900 mb-2">Micro-Donations</h3>
            <p className="text-sm text-neutral-600">Low-cost transactions to support food rescue operations</p>
          </div>
          <div className="bg-neutral-50 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="font-semibold text-neutral-900 mb-2">Global Access</h3>
            <p className="text-sm text-neutral-600">Accessible to anyone with a smartphone, no bank account needed</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-neutral-500 py-8 border-t border-neutral-100 mt-12">
        © 2024 FoodBridge. Built on Stellar blockchain.
      </footer>

      {/* Secret Key Modal */}
      {showSecretModal && wallet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔑</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Save Your Secret Key</h3>
              <p className="text-sm text-red-600 font-medium">⚠️ This will not be shown again!</p>
            </div>
            
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 mb-4">
              <p className="text-xs text-neutral-600 mb-2">Secret Key:</p>
              <p className="font-mono text-sm break-all bg-white p-3 rounded border border-neutral-200">{wallet.secretKey}</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => copyToClipboard(wallet.secretKey)}
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-xl transition-colors"
              >
                📋 Copy to Clipboard
              </button>
              <button
                onClick={handleCloseSecretModal}
                className="flex-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-medium py-3 rounded-xl transition-colors"
              >
                I've Saved It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
