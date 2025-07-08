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

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo1.svg" alt="Assetify Logo" className="h-8 w-8" />
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
              <button onClick={() => { console.log("Connect clicked"); connect(undefined); }} className="px-4 py-1 rounded bg-purple-600 text-white hover:bg-purple-700 transition">Connect Wallet</button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
