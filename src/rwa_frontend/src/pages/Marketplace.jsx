
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, TrendingUp, Building, Palette, Coins, Plus } from 'lucide-react';
import { listAssets } from '../api/canister';
import { useWalletConnect } from '../hooks/useWallet';
import FeaturesAssetsSection from '../components/FeaturesAssetsSection';
import { CardDetails } from '../components/FeaturesAssetsSection';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { principal, isConnected } = useWalletConnect();

  useEffect(() => {
    setLoading(true);
    setError('');
    listAssets()
      .then((realAssets) => {
        // Map dummy assets to match the marketplace asset structure
        const dummyAssets = CardDetails.map(card => ({
          ...card,
          id: card.id,
          name: card.title, // map title to name
          category: card.Category, // map Category to category
          total_value: card.total_value,
          token_price: card.token_price,
          available_tokens: card.available_tokens,
          total_tokens: card.total_tokens,
          apy: card.apy,
          location: card.location,
        }));
        // Avoid duplicates by id
        const allAssets = [
          ...realAssets,
          ...dummyAssets.filter(d => !realAssets.some(r => r.id === d.id))
        ];
        setAssets(allAssets);
      })
      .catch(() => setError('Failed to load assets'))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { id: 'all', name: 'All Assets', icon: Filter },
    { id: 'real-estate', name: 'Real Estate', icon: Building },
    { id: 'art', name: 'Art & Collectibles', icon: Palette },
    { id: 'commodities', name: 'Commodities', icon: Coins },
    { id: 'collectibles', name: 'Luxury Items', icon: TrendingUp }
  ];

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Bar: Search, Filter, and List Asset */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 flex gap-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          {isConnected && (
            <Link to="/tokenize" className="flex items-center gap-2 px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition">
              <Plus className="w-4 h-4" /> List Asset
            </Link>
          )}
          </div>

          {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <category.icon className="h-4 w-4 mr-2" />
              {category.name}
            </button>
              ))}
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading assets...' : error ? error : `Showing ${filteredAssets.length} asset${filteredAssets.length !== 1 ? 's' : ''}${selectedCategory !== 'all' ? ` in ${categories.find(c => c.id === selectedCategory)?.name}` : ''}`}
          </p>
        </div>

        {/* Assets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <div key={asset.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200">
                <div className="w-full h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {asset.category.charAt(0).toUpperCase() + asset.category.slice(1).replace('-', ' ')}
                  </span>
                </div>
              <div className="p-4">
                <h3 className="text-lg font-bold line-clamp-2">{asset.name}</h3>
                <p className="text-gray-600 text-sm">{asset.location}</p>
                <div className="flex items-center mt-4 text-sm text-gray-600">
                  <span>Total Value:</span>
                  <span className="font-semibold ml-1">{formatCurrency(asset.total_value)}</span>
                  </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span>Token Price:</span>
                  <span className="font-semibold ml-1">${asset.token_price}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span>Available:</span>
                  <span className="font-semibold ml-1">{asset.available_tokens?.toLocaleString()}</span>
                  </div>
                <div className="flex items-center text-sm text-green-600">
                  <span>Expected APY:</span>
                  <span className="font-semibold ml-1">{asset.apy}%</span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Funding Progress</span>
                    <span>{Math.round(((asset.total_tokens - asset.available_tokens) / asset.total_tokens) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((asset.total_tokens - asset.available_tokens) / asset.total_tokens) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <Link to={`/asset/${asset.id}`} className="mt-4 block text-center px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
