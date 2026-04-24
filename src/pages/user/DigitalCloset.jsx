import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Heart, Eye, X, ShoppingBag, Sparkles } from 'lucide-react';
import SectionTitle from '../../components/common/SectionTitle'; 
const DigitalCloset = () => {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useAppContext();
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleRemoveFromWishlist = (item) => {
    toggleWishlist(item);
    setHoveredItem(null);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Tops': 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
      'Bottoms': 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
      'Dresses': 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300',
      'Outerwear': 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300',
      'Accessories': 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300',
      'Art': 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
    };
    return colors[category] || 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300';
  };

  if (!wishlist.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="w-24 h-24  rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-12 h-12 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Your Digital Closet is Empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Start building your sustainable wardrobe by saving fashion pieces you love.
          </p>
          <button 
            onClick={() => navigate('/marketplace')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            Explore Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
              <SectionTitle
              title="My Digital Closet"
              subtitle="Your personal sustainable fashion archive • {wishlist.length} pieces saved."
            />
        </div>
      </div>

      {/* Fashion Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="group relative"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Fashion Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Product Image */}
                <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img 
                    src={item.images?.[0] || `https://picsum.photos/seed/${item.id}/400/500`}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Eco Badge */}
                  {item.ecoCredits && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <span>🌱</span>
                      <span className="font-medium">{item.ecoCredits}</span>
                    </div>
                  )}

                  {/* Upcycled Badge */}
                  {item.isUpcycled && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-green-500 text-white text-xs px-2 py-1 rounded-full">
                      <span className="font-medium">Upcycled</span>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  {hoveredItem === item.id && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 transition-opacity duration-300">
                      <button
                        onClick={() => navigate(`/product/${item.id}`)}
                        className="p-3 cursor-pointer bg-white/90 rounded-full hover:bg-white transition-colors"
                        title="View product"
                      >
                        <Eye className="w-5 h-5 text-gray-800" />
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(item)}
                        className="p-3 cursor-pointer bg-red-500/90 rounded-full hover:bg-red-500 transition-colors"
                        title="Remove from closet"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                  {/* Category Badge */}
                  <div className="inline-block">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>

                  {/* Product Name */}
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight">
                    {item.name}
                  </h3>

                  {/* Price & Meta */}
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      EGP {item.price}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>{item.size}</span>
                      <span>•</span>
                      <span>{item.condition}</span>
                    </div>
                  </div>

                  {/* Material */}
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {item.material}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DigitalCloset;
