
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const Trading = () => {
  const { toast } = useToast();
  const [orderType, setOrderType] = useState('market');
  const [tradeType, setTradeType] = useState('buy');
  const [selectedAsset, setSelectedAsset] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const availableAssets = [
    {
      id: 1,
      name: 'Manhattan Luxury Apartment',
      symbol: 'MLA',
      currentPrice: 1.05,
      change: 0.05,
      changePercent: 5.0,
      volume: 45320,
      liquidity: 'High',
      category: 'Real Estate'
    },
    {
      id: 2,
      name: 'Vintage Wine Collection',
      symbol: 'VWC',
      currentPrice: 1.12,
      change: 0.12,
      changePercent: 12.0,
      volume: 28450,
      liquidity: 'Medium',
      category: 'Collectibles'
    },
    {
      id: 3,
      name: 'Gold Mining Rights',
      symbol: 'GMR',
      currentPrice: 1.15,
      change: 0.15,
      changePercent: 15.0,
      volume: 67890,
      liquidity: 'High',
      category: 'Commodities'
    },
    {
      id: 4,
      name: 'Modern Art Collection',
      symbol: 'MAC',
      currentPrice: 1.08,
      change: 0.08,
      changePercent: 8.0,
      volume: 19230,
      liquidity: 'Low',
      category: 'Art'
    }
  ];

  const openOrders = [
    {
      id: 1,
      asset: 'Manhattan Luxury Apartment',
      symbol: 'MLA',
      type: 'buy',
      orderType: 'limit',
      quantity: 5000,
      price: 1.02,
      status: 'pending',
      created: '2024-01-15 14:30',
      filled: 0
    },
    {
      id: 2,
      asset: 'Gold Mining Rights',
      symbol: 'GMR',
      type: 'sell',
      orderType: 'limit',
      quantity: 10000,
      price: 1.18,
      status: 'pending',
      created: '2024-01-15 12:15',
      filled: 3500
    }
  ];

  const tradeHistory = [
    {
      id: 1,
      asset: 'Vintage Wine Collection',
      symbol: 'VWC',
      type: 'buy',
      quantity: 8500,
      price: 1.00,
      total: 8500,
      date: '2024-01-14 16:45',
      status: 'completed'
    },
    {
      id: 2,
      asset: 'Manhattan Luxury Apartment',
      symbol: 'MLA',
      type: 'sell',
      quantity: 2000,
      price: 1.03,
      total: 2060,
      date: '2024-01-14 11:20',
      status: 'completed'
    },
    {
      id: 3,
      asset: 'Gold Mining Rights',
      symbol: 'GMR',
      type: 'buy',
      quantity: 15000,
      price: 1.00,
      total: 15000,
      date: '2024-01-13 09:30',
      status: 'completed'
    }
  ];

  const handlePlaceOrder = () => {
    if (!selectedAsset || !quantity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const asset = availableAssets.find(a => a.id === parseInt(selectedAsset));
    const orderValue = parseFloat(quantity) * (orderType === 'market' ? asset.currentPrice : parseFloat(price));

    toast({
      title: "Order Placed Successfully!",
      description: `${tradeType.toUpperCase()} order for ${quantity} ${asset.symbol} tokens (${orderType} order) - Total: $${orderValue.toFixed(2)}`,
    });

    // Reset form
    setQuantity('');
    setPrice('');
  };

  const handleCancelOrder = (orderId) => {
    toast({
      title: "Order Cancelled",
      description: "Your order has been cancelled successfully.",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Trading Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">Place Order</h2>
              <p className="text-sm text-gray-600 mb-4">Trade asset tokens on the secondary market</p>

              {/* Trade Type Toggle */}
              <div className="flex border rounded-lg p-1 mb-4">
                <button
                  onClick={() => setTradeType('buy')}
                  className={`flex-1 py-2 px-4 rounded-l-md ${tradeType === 'buy' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setTradeType('sell')}
                  className={`flex-1 py-2 px-4 rounded-r-md ${tradeType === 'sell' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Sell
                </button>
              </div>

              {/* Asset Selection */}
              <div className="mb-4">
                <label htmlFor="asset" className="block text-sm font-medium text-gray-700 mb-1">Select Asset</label>
                <select
                  id="asset"
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Choose an asset</option>
                  {availableAssets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.symbol} - {asset.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Order Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Type</label>
                <div className="flex border rounded-lg p-1">
                  <button
                    onClick={() => setOrderType('market')}
                    className={`py-2 px-4 rounded-l-md ${orderType === 'market' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Market
                  </button>
                  <button
                    onClick={() => setOrderType('limit')}
                    className={`py-2 px-4 rounded-r-md ${orderType === 'limit' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Limit
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity (Tokens)</label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Price (for limit orders) */}
              {orderType === 'limit' && (
                <div className="mb-4">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price per Token (USD)</label>
                  <input
                    type="number"
                    id="price"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              )}

              {/* Order Summary */}
              {selectedAsset && quantity && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2 text-sm">Order Summary</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Tokens:</span>
                      <span>{parseInt(quantity).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span>
                        {orderType === 'market' 
                          ? formatCurrency(availableAssets.find(a => a.id === parseInt(selectedAsset))?.currentPrice || 0)
                          : formatCurrency(parseFloat(price) || 0)
                        }
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>
                        {formatCurrency(
                          parseInt(quantity) * (orderType === 'market' 
                            ? availableAssets.find(a => a.id === parseInt(selectedAsset))?.currentPrice || 0
                            : parseFloat(price) || 0
                          )
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button 
                onClick={handlePlaceOrder}
                className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
                  tradeType === 'buy' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Place {tradeType.toUpperCase()} Order
              </button>
            </div>
          </div>

          {/* Market Data & Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">Market Data</h2>
              <p className="text-sm text-gray-600 mb-4">Real-time token prices and market data</p>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Asset
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Change
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Volume
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Liquidity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {availableAssets.map((asset) => (
                      <tr key={asset.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {asset.symbol}
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">{asset.name}</p>
                              <p className="text-xs text-gray-500">{asset.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="text-lg font-bold">{formatCurrency(asset.currentPrice)}</span>
                            <div className={`flex items-center ${asset.change >= 0 ? 'text-green-600' : 'text-red-600'} ml-2`}>
                              {asset.change >= 0 ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                              )}
                              <span className="text-xs font-medium">
                                {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent}%
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="text-sm">Vol: {asset.volume.toLocaleString()}</span>
                            <span className="mx-1">•</span>
                            <span className="text-xs font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded-full">
                              {asset.liquidity}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-2">Open Orders</h2>
              <p className="text-sm text-gray-600 mb-4">Your pending and partially filled orders</p>

              {openOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Asset
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {openOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className={`p-2 rounded-full ${
                              order.type === 'buy' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              {order.type === 'buy' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4 text-green-600">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4 text-red-600">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.symbol}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <span>{formatCurrency(order.price)}</span>
                              <span className="mx-1">•</span>
                              <span className="text-xs font-medium text-gray-900">
                                Filled: {order.filled.toLocaleString()} ({Math.round((order.filled / order.quantity) * 100)}%)
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.quantity.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <span className="text-xs font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3 w-3 mr-1">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Pending
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No open orders</p>
                </div>
              )}
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-2">Trade History</h2>
              <p className="text-sm text-gray-600 mb-4">Your completed trades</p>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Asset
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tradeHistory.map((trade) => (
                      <tr key={trade.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className={`p-2 rounded-full ${
                            trade.type === 'buy' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {trade.type === 'buy' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4 text-green-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4 text-red-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                              </svg>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {trade.symbol}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {trade.quantity.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <span>{formatCurrency(trade.price)}</span>
                            <span className="mx-1">•</span>
                            <span className="text-xs font-medium text-gray-900">
                              Total: {formatCurrency(trade.total)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="text-xs font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3 w-3 mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Completed
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(trade.date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;
