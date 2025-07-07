import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const [connectedWallet, setConnectedWallet] = useState(false);
  const handleConnectWallet = () => {
    setConnectedWallet((prev) => !prev);
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
          <button
            onClick={handleConnectWallet}
            className={`px-4 py-2 rounded-xl font-medium text-white transition-colors ${connectedWallet ? 'bg-gray-400 hover:bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {connectedWallet ? 'Wallet Connected' : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
