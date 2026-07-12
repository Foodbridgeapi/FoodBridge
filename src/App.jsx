import React, { useState } from 'react';
import { createStellarWallet, fundTestnetAccount, getAccountBalance } from './stellarClient';

function App() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [claimModalItem, setClaimModalItem] = useState(null);
  const [claimedItems, setClaimedItems] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donateForm, setDonateForm] = useState({
    title: '',
    type: 'Produce',
    quantity: '',
    location: 'Downtown',
    expiryDate: ''
  });
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

  const handleClaimItem = (item) => {
    setClaimModalItem(item);
  };

  const handleConfirmClaim = () => {
    if (claimModalItem) {
      setClaimedItems([...claimedItems, claimModalItem.id]);
      setToastMessage(`Successfully claimed "${claimModalItem.title}"!`);
      setShowToast(true);
      setClaimModalItem(null);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleCancelClaim = () => {
    setClaimModalItem(null);
  };

  const handleDonateFormChange = (e) => {
    setDonateForm({
      ...donateForm,
      [e.target.name]: e.target.value
    });
  };

  const handleDonateSubmit = (e) => {
    e.preventDefault();
    if (!donateForm.title || !donateForm.quantity) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newListing = {
      id: Date.now(),
      title: donateForm.title,
      type: donateForm.type,
      quantity: donateForm.quantity,
      location: donateForm.location,
      status: 'Available'
    };
    
    setFoodListings([newListing, ...foodListings]);
    setToastMessage(`Successfully donated "${donateForm.title}"!`);
    setShowToast(true);
    setShowDonateModal(false);
    setDonateForm({
      title: '',
      type: 'Produce',
      quantity: '',
      location: 'Downtown',
      expiryDate: ''
    });
    setTimeout(() => setShowToast(false), 3000);
  };

  const filteredListings = foodListings.filter(food => {
    const matchesSearch = food.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         food.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         food.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || food.type === filterType;
    const matchesLocation = filterLocation === 'All' || food.location === filterLocation;
    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-primary-50 to-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍎</span>
          <h1 className="text-xl font-bold text-neutral-900">FoodBridge</h1>
        </div>
        {wallet ? (
          <div className="flex gap-2">
            <button
              onClick={() => setShowDonateModal(true)}
              className="bg-accent-500 hover:bg-accent-600 text-white font-medium px-4 py-2 rounded-full transition-colors shadow-sm"
            >
              🍎 Donate Food
            </button>
            <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
              {wallet.publicKey.slice(0, 8)}...{wallet.publicKey.slice(-8)}
            </div>
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
          
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl shadow-md p-4 mb-6 border border-neutral-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name, type, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="All">All Types</option>
                  <option value="Produce">Produce</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Dairy">Dairy</option>
                </select>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="All">All Locations</option>
                  <option value="Downtown">Downtown</option>
                  <option value="Midtown">Midtown</option>
                  <option value="Uptown">Uptown</option>
                </select>
              </div>
            </div>
          </div>
          
          
          {listingsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md p-6 border border-neutral-100">
                  <div className="animate-pulse">
                    <div className="h-6 bg-neutral-200 rounded mb-3 w-3/4"></div>
                    <div className="h-4 bg-neutral-200 rounded mb-2 w-1/2"></div>
                    <div className="h-4 bg-neutral-200 rounded mb-2 w-2/3"></div>
                    <div className="h-4 bg-neutral-200 rounded mb-4 w-1/2"></div>
                    <div className="h-10 bg-neutral-200 rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 border border-neutral-100 text-center">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">No Food Listings Available</h3>
              <p className="text-sm text-neutral-600">Check back later or donate food to help others!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredListings.map((food) => {
                const isClaimed = claimedItems.includes(food.id);
                return (
                  <div key={food.id} className={`bg-white rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 p-6 border border-neutral-100 ${
                    food.type === 'Produce' ? 'border-l-4 border-l-primary-500' :
                    food.type === 'Bakery' ? 'border-l-4 border-l-amber-500' :
                    food.type === 'Dairy' ? 'border-l-4 border-l-blue-500' : ''
                  } ${isClaimed ? 'opacity-60 bg-neutral-50' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`text-lg font-semibold ${isClaimed ? 'line-through text-neutral-400' : 'text-neutral-900'}`}>{food.title}</h3>
                      <span className={`${isClaimed ? 'bg-neutral-200 text-neutral-600' : 'bg-primary-50 text-primary-700'} text-xs font-medium px-3 py-1 rounded-full`}>
                        {isClaimed ? 'Claimed' : 'Available'}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-sm text-neutral-600 mb-4">
                      <p><span className="font-medium text-neutral-900">Type:</span> {food.type}</p>
                      <p><span className="font-medium text-neutral-900">Quantity:</span> {food.quantity}</p>
                      <p><span className="font-medium text-neutral-900">Location:</span> {food.location}</p>
                    </div>
                    <button 
                      onClick={() => handleClaimItem(food)}
                      disabled={isClaimed}
                      className={`w-full font-medium py-2.5 rounded-xl transition-colors ${
                        isClaimed 
                          ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed' 
                          : 'bg-primary-500 hover:bg-primary-600 text-white'
                      }`}
                    >
                      {isClaimed ? 'Already Claimed' : 'Claim This Item'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-50 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center text-2xl mx-auto mb-3">🔗</div>
            <h3 className="font-semibold text-neutral-900 mb-2">Stellar Integration</h3>
            <p className="text-sm text-neutral-600">Transparent food tracking on blockchain with immutable records</p>
          </div>
          <div className="bg-neutral-50 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-accent-100 flex items-center justify-center text-2xl mx-auto mb-3">💰</div>
            <h3 className="font-semibold text-neutral-900 mb-2">Micro-Donations</h3>
            <p className="text-sm text-neutral-600">Low-cost transactions to support food rescue operations</p>
          </div>
          <div className="bg-neutral-50 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl mx-auto mb-3">🌍</div>
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

      {/* Claim Confirmation Modal */}
      {claimModalItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛒</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Claim This Item?</h3>
              <p className="text-sm text-neutral-600">You are about to claim:</p>
            </div>
            
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 mb-4">
              <p className="font-semibold text-neutral-900">{claimModalItem.title}</p>
              <p className="text-sm text-neutral-600">{claimModalItem.type} • {claimModalItem.quantity}</p>
              <p className="text-sm text-neutral-600">📍 {claimModalItem.location}</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleCancelClaim}
                className="flex-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-medium py-3 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClaim}
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-xl transition-colors"
              >
                Confirm Claim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Donate Food Modal */}
      {showDonateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🍎</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Donate Food</h3>
              <p className="text-sm text-neutral-600">Help others by donating food to those in need</p>
            </div>
            
            <form onSubmit={handleDonateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Item Name *</label>
                <input
                  type="text"
                  name="title"
                  value={donateForm.title}
                  onChange={handleDonateFormChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
                  placeholder="e.g., Fresh Vegetables"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Type</label>
                <select
                  name="type"
                  value={donateForm.type}
                  onChange={handleDonateFormChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="Produce">Produce</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Dairy">Dairy</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Quantity *</label>
                <input
                  type="text"
                  name="quantity"
                  value={donateForm.quantity}
                  onChange={handleDonateFormChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
                  placeholder="e.g., 10kg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Location</label>
                <select
                  name="location"
                  value={donateForm.location}
                  onChange={handleDonateFormChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="Downtown">Downtown</option>
                  <option value="Midtown">Midtown</option>
                  <option value="Uptown">Uptown</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Expiry Date (Optional)</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={donateForm.expiryDate}
                  onChange={handleDonateFormChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDonateModal(false)}
                  className="flex-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-medium py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-accent-500 hover:bg-accent-600 text-white font-medium py-3 rounded-xl transition-colors"
                >
                  Donate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
