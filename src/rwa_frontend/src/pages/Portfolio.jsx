
import { useEffect, useState } from 'react';
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
import { useWalletConnect } from '../hooks/useWallet';
import { getPortfolio, listTokensByUser, getAsset } from '../api/canister';

const Portfolio = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const { principal, isConnected } = useWalletConnect();
  const [portfolio, setPortfolio] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!principal) return;
    setLoading(true);
    setError('');
    Promise.all([
      getPortfolio(principal),
      listTokensByUser(principal)
    ])
      .then(async ([p, t]) => {
        setPortfolio(p);
        setTokens(t);
        // Fetch asset details for each token
        const assetIds = Array.from(new Set(t.map(token => token.asset_id)));
        const assetDetails = await Promise.all(assetIds.map(getAsset));
        setAssets(assetDetails);
      })
      .catch(() => setError('Failed to load portfolio'))
      .finally(() => setLoading(false));
  }, [principal]);

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

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600">{error}</div>;
  }

  if (!portfolio) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">No portfolio data available.</div>;
  }

  const holdings = assets.map(asset => {
    const token = tokens.find(t => t.asset_id === asset.id);
    if (!token) return null;

    const holding = {
      id: asset.id,
      name: asset.name,
      category: asset.category,
      tokensOwned: token.amount,
      currentValue: token.current_value,
      invested: token.invested_amount,
      return: token.current_value - token.invested_amount,
      returnPercentage: ((token.current_value - token.invested_amount) / token.invested_amount) * 100,
      monthlyIncome: token.monthly_income,
      apy: token.apy,
      status: 'active'
    };
    return holding;
  }).filter(holding => holding !== null);

  const transactions = []; // No mock transactions for now

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Portfolio Value</p>
                <p className="text-2xl font-bold">{formatCurrency(portfolio.total_value)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Return</p>
                  <p className="text-2xl font-bold text-green-600">
                  +{formatCurrency(portfolio.total_return)}
                  </p>
                <p className="text-sm text-green-600">+{portfolio.return_percentage}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Income</p>
                <p className="text-2xl font-bold">{formatCurrency(portfolio.monthly_income)}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Assets</p>
                <p className="text-2xl font-bold">{portfolio.total_assets}</p>
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
