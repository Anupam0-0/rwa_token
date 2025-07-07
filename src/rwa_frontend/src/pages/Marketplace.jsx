
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, TrendingUp, Building, Palette, Coins } from 'lucide-react';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const assets = [
    {
      id: 1,
      name: 'Manhattan Luxury Apartment',
      category: 'real-estate',
      location: 'New York, USA',
      totalValue: 2500000,
      tokenPrice: 1.00,
      totalTokens: 2500000,
      availableTokens: 750000,
      apy: 8.5,
      status: 'active',
      image: 'photo-1649972904349-6e44c42644a7'
    },
    {
      id: 2,
      name: 'Vintage Wine Collection',
      category: 'collectibles',
      location: 'Bordeaux, France',
      totalValue: 450000,
      tokenPrice: 1.00,
      totalTokens: 450000,
      availableTokens: 180000,
      apy: 12.3,
      status: 'active',
      image: 'photo-1518770660439-4636190af475'
    },
    {
      id: 3,
      name: 'Gold Mining Rights',
      category: 'commodities',
      location: 'Nevada, USA',
      totalValue: 1200000,
      tokenPrice: 1.00,
      totalTokens: 1200000,
      availableTokens: 600000,
      apy: 15.7,
      status: 'active',
      image: 'photo-1488590528505-98d2b5aba04b'
    },
    {
      id: 4,
      name: 'Modern Art Collection',
      category: 'art',
      location: 'London, UK',
      totalValue: 800000,
      tokenPrice: 1.00,
      totalTokens: 800000,
      availableTokens: 320000,
      apy: 10.2,
      status: 'funding',
      image: 'photo-1461749280684-dccba630e2f6'
    },
    {
      id: 5,
      name: 'Commercial Office Building',
      category: 'real-estate',
      location: 'Dubai, UAE',
      totalValue: 5000000,
      tokenPrice: 1.00,
      totalTokens: 5000000,
      availableTokens: 2000000,
      apy: 9.8,
      status: 'active',
      image: 'photo-1581091226825-a6a2a5aee158'
    },
    {
      id: 6,
      name: 'Rare Whiskey Portfolio',
      category: 'collectibles',
      location: 'Scotland, UK',
      totalValue: 350000,
      tokenPrice: 1.00,
      totalTokens: 350000,
      availableTokens: 140000,
      apy: 18.5,
      status: 'funding',
      image: 'photo-1526374965328-7f61d4dc18c5'
    }
  ];

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
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
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
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''}
            {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
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
                  <span className="font-semibold ml-1">{formatCurrency(asset.totalValue)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span>Token Price:</span>
                  <span className="font-semibold ml-1">${asset.tokenPrice}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span>Available:</span>
                  <span className="font-semibold ml-1">{asset.availableTokens.toLocaleString()}</span>
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <span>Expected APY:</span>
                  <span className="font-semibold ml-1">{asset.apy}%</span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Funding Progress</span>
                    <span>{Math.round(((asset.totalTokens - asset.availableTokens) / asset.totalTokens) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((asset.totalTokens - asset.availableTokens) / asset.totalTokens) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <Link to={`/asset/${asset.id}`}>
                  <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors">
                    View Details & Invest
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredAssets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No assets found matching your criteria.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
              className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
