import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useWalletConnect } from '../hooks/useWallet';
import { Bell } from 'lucide-react';
import { listNotificationsByUser, markNotificationRead } from '../api/canister';
import userSolid from '../assets/user-solid.svg';

const Navbar = () => {
  const {
    connect,
    disconnect,
    isConnected,
    principal,
    activeProvider,
  } = useWalletConnect();
  console.log("connect function:", connect);

  const navigate = useNavigate();

  // Modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Add wallet modal state
  const [showWalletSelect, setShowWalletSelect] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isConnected || !principal) return;
    listNotificationsByUser(principal).then(n => {
      setNotifications(n);
      setUnreadCount(n.filter(notif => !notif.read).length);
    });
  }, [isConnected, principal, showNotifications]);

  const handleOpenNotifications = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      // Mark all as read
      await Promise.all(
        notifications.filter(n => !n.read).map(n => markNotificationRead(n.id))
      );
      setUnreadCount(0);
    }
  };

  // Handle auth form submit
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!email || !password || (authMode === 'register' && !confirmPassword)) {
      setFormError('Please fill all fields.');
      return;
    }
    if (authMode === 'register' && password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    // Open custom wallet selection modal, close auth modal
    setShowAuthModal(false);
    setShowWalletSelect(true);
  };

  // Handle wallet connect for a specific provider
  const handleProviderConnect = (provider) => {
    connect(provider);
  };

  // Close modals only after wallet is connected
  useEffect(() => {
    if (isConnected) {
      setShowAuthModal(false);
      setShowWalletModal(false);
      setShowWalletSelect(false);
    }
  }, [isConnected]);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo1.svg" alt="Assetify Logo" className="h-8 w-8" />
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-8 w-8 fill-current text-blue-600"
              >
                <path d="public/logo1.svg" />
              </svg> */}

              <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">Assetify</h1>
            </Link>
        </div>
          <nav className="hidden md:flex space-x-8">
            <NavLink
              to="/marketplace"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 border-b-2 border-blue-600 font-semibold transition-colors"
                  : "text-gray-700 hover:text-blue-600 transition-colors"
              }
            >
              Marketplace
            </NavLink>
            <NavLink
              to="/tokenize"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 border-b-2 border-blue-600 font-semibold transition-colors"
                  : "text-gray-700 hover:text-blue-600 transition-colors"
              }
            >
              Tokenize Asset
            </NavLink>
            <NavLink
              to="/portfolio"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 border-b-2 border-blue-600 font-semibold transition-colors"
                  : "text-gray-700 hover:text-blue-600 transition-colors"
              }
            >
              Portfolio
            </NavLink>
            <NavLink
              to="/trading"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 border-b-2 border-blue-600 font-semibold transition-colors"
                  : "text-gray-700 hover:text-blue-600 transition-colors"
              }
            >
              Trading
            </NavLink>
          </nav>
          <div className="flex items-center gap-4">
            {isConnected && principal ? (
              <>
                {/* Notifications Bell */}
                <div className="relative">
                  <button onClick={handleOpenNotifications} className="p-2 rounded-full hover:bg-gray-100 transition" title="Notifications">
                    <Bell className="w-6 h-6 text-purple-600" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">{unreadCount}</span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                      <div className="p-4 border-b font-semibold">Notifications</div>
                      {notifications.length === 0 ? (
                        <div className="p-4 text-gray-500">No notifications</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className={`p-4 border-b last:border-b-0 ${n.read ? 'bg-gray-50' : 'bg-purple-50'}`}>{n.message}</div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 truncate max-w-[120px]" title={principal}>{principal?.toString()}</span>
                  <span className="text-xs text-purple-600 font-semibold">{activeProvider?.meta?.name || 'Wallet'}</span>
                  <button onClick={disconnect} className="ml-2 px-3 py-1 rounded bg-purple-600 text-white hover:bg-purple-700 transition">Disconnect</button>
                </div>
                <button
                  onClick={() => navigate('/profile')}
                  className="ml-2 p-2 rounded-full hover:bg-gray-100 transition"
                  title="Profile"
                >
                  <img src={userSolid} alt="Profile" className="w-6 h-6" />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setShowAuthModal(true)} className="px-4 py-1 rounded bg-purple-600 text-white hover:bg-purple-700 transition">Connect Wallet</button>
                {/* Auth Modal */}
                {showAuthModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                      <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowAuthModal(false)}>&times;</button>
                      <div className="flex justify-center mb-4">
                        <button onClick={() => setAuthMode('login')} className={`px-4 py-2 rounded-l ${authMode === 'login' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Login</button>
                        <button onClick={() => setAuthMode('register')} className={`px-4 py-2 rounded-r ${authMode === 'register' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Register</button>
                      </div>
                      <form onSubmit={handleAuthSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Email</label>
                          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
                          <label className="block text-sm font-medium mb-1">Password</label>
                          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" required />
                        </div>
                        {authMode === 'register' && (
                          <div>
                            <label className="block text-sm font-medium mb-1">Confirm Password</label>
                            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full border rounded px-3 py-2" required />
                          </div>
                        )}
                        {formError && <div className="text-red-600 text-sm">{formError}</div>}
                        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition">Connect Wallet</button>
                      </form>
                    </div>
                  </div>
                )}
                {/* Wallet Connect Modal Trigger */}
                {showWalletModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative flex flex-col items-center">
                      <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowWalletModal(false)}>&times;</button>
                      <h2 className="text-xl font-bold mb-4">Connect Your Wallet</h2>
                      <button onClick={handleWalletConnect} className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition">Open Wallet Connect</button>
                    </div>
                  </div>
                )}
                {/* Custom IC Wallet Selection Modal */}
                {showWalletSelect && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xs relative">
                      <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowWalletSelect(false)}>&times;</button>
                      <h2 className="text-2xl font-bold mb-6 text-center">Select Wallet</h2>
                      <div className="flex flex-col gap-4">
                        <button onClick={() => handleProviderConnect('ii')} className="flex items-center gap-3 px-4 py-3 rounded-lg border hover:bg-gray-100 transition">
                          <span role="img" aria-label="Internet Identity" className="text-2xl">🆔</span>
                          <span className="font-medium">Internet Identity</span>
                        </button>
                        <button onClick={() => handleProviderConnect('plug')} className="flex items-center gap-3 px-4 py-3 rounded-lg border hover:bg-gray-100 transition">
                          <span role="img" aria-label="Plug" className="text-2xl">🔌</span>
                          <span className="font-medium">Plug Wallet</span>
          </button>
                        {/* Add more wallets here if needed */}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
