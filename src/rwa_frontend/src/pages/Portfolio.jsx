
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Activity, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const Portfolio = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');

  const portfolioSummary = {
    totalValue: 125750,
    totalInvested: 98500,
    totalReturn: 27250,
    returnPercentage: 27.7,
    monthlyIncome: 1247,
    totalAssets: 8
  };

  const holdings = [
    {
      id: 1,
      name: 'Manhattan Luxury Apartment',
      category: 'Real Estate',
      tokensOwned: 15000,
      currentValue: 15750,
      invested: 15000,
      return: 750,
      returnPercentage: 5.0,
      monthlyIncome: 126,
      apy: 8.5,
      status: 'active'
    },
    {
      id: 2,
      name: 'Vintage Wine Collection',
      category: 'Collectibles',
      tokensOwned: 8500,
      currentValue: 9520,
      invested: 8500,
      return: 1020,
      returnPercentage: 12.0,
      monthlyIncome: 98,
      apy: 12.3,
      status: 'active'
    },
    {
      id: 3,
      name: 'Gold Mining Rights',
      category: 'Commodities',
      tokensOwned: 25000,
      currentValue: 28750,
      invested: 25000,
      return: 3750,
      returnPercentage: 15.0,
      monthlyIncome: 328,
      apy: 15.7,
      status: 'active'
    },
    {
      id: 4,
      name: 'Modern Art Collection',
      category: 'Art',
      tokensOwned: 12000,
      currentValue: 12960,
      invested: 12000,
      return: 960,
      returnPercentage: 8.0,
      monthlyIncome: 102,
      apy: 10.2,
      status: 'active'
    },
    {
      id: 5,
      name: 'Commercial Office Building',
      category: 'Real Estate',
      tokensOwned: 30000,
      currentValue: 32400,
      invested: 30000,
      return: 2400,
      returnPercentage: 8.0,
      monthlyIncome: 294,
      apy: 9.8,
      status: 'active'
    }
  ];

  const transactions = [
    {
      id: 1,
      type: 'buy',
      asset: 'Manhattan Luxury Apartment',
      amount: 5000,
      tokens: 5000,
      price: 1.00,
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: 2,
      type: 'dividend',
      asset: 'Gold Mining Rights',
      amount: 328,
      tokens: 0,
      price: 0,
      date: '2024-01-01',
      status: 'completed'
    },
    {
      id: 3,
      type: 'buy',
      asset: 'Vintage Wine Collection',
      amount: 3500,
      tokens: 3500,
      price: 1.00,
      date: '2023-12-20',
      status: 'completed'
    },
    {
      id: 4,
      type: 'sell',
      asset: 'Modern Art Collection',
      amount: 2000,
      tokens: 2000,
      price: 1.08,
      date: '2023-12-10',
      status: 'completed'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Portfolio Value</p>
                <p className="text-2xl font-bold">{formatCurrency(portfolioSummary.totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Return</p>
                <p className="text-2xl font-bold text-green-600">
                  +{formatCurrency(portfolioSummary.totalReturn)}
                </p>
                <p className="text-sm text-green-600">+{portfolioSummary.returnPercentage}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Income</p>
                <p className="text-2xl font-bold">{formatCurrency(portfolioSummary.monthlyIncome)}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Assets</p>
                <p className="text-2xl font-bold">{portfolioSummary.totalAssets}</p>
              </div>
              <PieChart className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Your Asset Holdings</h3>
            <Link to="/marketplace">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                Browse More Assets
              </button>
            </Link>
          </div>

          <div className="grid gap-6">
            {holdings.map((holding) => (
              <div key={holding.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">{holding.name}</h4>
                    <p className="text-gray-600">{holding.category}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    holding.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {holding.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-5 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Tokens Owned</p>
                    <p className="font-semibold">{holding.tokensOwned.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Value</p>
                    <p className="font-semibold">{formatCurrency(holding.currentValue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Return</p>
                    <div className="flex items-center">
                      <p className="font-semibold text-green-600">
                        +{formatCurrency(holding.return)}
                      </p>
                      <ArrowUpRight className="h-4 w-4 text-green-600 ml-1" />
                    </div>
                    <p className="text-sm text-green-600">+{holding.returnPercentage}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monthly Income</p>
                    <p className="font-semibold">{formatCurrency(holding.monthlyIncome)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">APY</p>
                    <p className="font-semibold text-blue-600">{holding.apy}%</p>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button className="px-3 py-1 text-sm font-semibold text-red-600 border border-red-600 rounded-md hover:bg-red-50">
                    Buy More
                  </button>
                  <button className="px-3 py-1 text-sm font-semibold text-red-600 border border-red-600 rounded-md hover:bg-red-50">
                    Sell
                  </button>
                  <Link to={`/asset/${holding.id}`}>
                    <button className="px-3 py-1 text-sm font-semibold text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions Tab */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Transaction History</h3>
            <button className="px-3 py-1 text-sm font-semibold text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
              Export CSV
            </button>
          </div>

          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'buy' ? 'bg-green-100' :
                    transaction.type === 'sell' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {transaction.type === 'buy' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : transaction.type === 'sell' ? (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    ) : (
                      <DollarSign className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{transaction.asset}</p>
                    <p className="text-sm text-gray-600">
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      {transaction.tokens > 0 && ` • ${transaction.tokens.toLocaleString()} tokens`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'buy' ? 'text-red-600' :
                    transaction.type === 'sell' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {transaction.type === 'buy' ? '-' : '+'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Tab */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Portfolio Analytics</h3>
            <div className="flex space-x-2">
              {['7D', '1M', '3M', '1Y', 'ALL'].map((period) => (
                <button
                  key={period}
                  className={`px-3 py-1 text-sm font-semibold rounded-md ${
                    selectedTimeframe === period ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedTimeframe(period)}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-2">Asset Allocation</h4>
              <p className="text-sm text-gray-600 mb-4">By category</p>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Real Estate</span>
                    <span className="text-sm font-semibold">38%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '38%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Commodities</span>
                    <span className="text-sm font-semibold">23%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Collectibles</span>
                    <span className="text-sm font-semibold">19%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '19%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Art</span>
                    <span className="text-sm font-semibold">20%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-2">Performance Metrics</h4>
              <p className="text-sm text-gray-600 mb-4">Last 30 days</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Best Performer</span>
                  <div className="text-right">
                    <p className="font-semibold">Gold Mining Rights</p>
                    <p className="text-sm text-green-600">+15.0%</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Worst Performer</span>
                  <div className="text-right">
                    <p className="font-semibold">Manhattan Apartment</p>
                    <p className="text-sm text-green-600">+5.0%</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg. Monthly Yield</span>
                  <div className="text-right">
                    <p className="font-semibold">10.4%</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sharpe Ratio</span>
                  <div className="text-right">
                    <p className="font-semibold">1.83</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
