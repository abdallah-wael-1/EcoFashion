import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const ProductCard = ({
  id,
  name,
  price,
  images = [],
  condition,
  material,
  size,
  seller,
  ecoCredits,
  isUpcycled,
  isSwappable,
  category,
  description,
}) => {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, addToCart, isInCart } = useAppContext();
  const isSaved = wishlist.some((item) => item.id === id);
  const itemInCart = isInCart(id);
  const [imageError, setImageError] = useState(false);
  const product = { id, name, price, images, condition, material, size, seller, ecoCredits, isUpcycled, isSwappable, category, description };

  // Get condition colors
  const getConditionColor = (cond) => {
    switch (cond) {
      case 'New':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700';
      case 'Excellent':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700';
      case 'Good':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700';
      case 'Fair':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600';
    }
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg dark:hover:shadow-xl transition-all duration-300">
      {/* Image Area */}
      <div className="relative h-52 bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center cursor-pointer" onClick={() => navigate(`/product/${id}`)}>
        <img
          src={
            !imageError && images[0]
              ? images[0]
              : `https://picsum.photos/seed/${id}/400/500`
          }
          alt={name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Upcycled Badge */}
        {isUpcycled && (
          <div className="absolute top-3 left-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <span>♻</span>
            <span>Upcycled</span>
          </div>
        )}

        {/* Condition Badge */}
        <div
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold border ${getConditionColor(
            condition
          )}`}
        >
          {condition}
        </div>

        {/* Save Button */}
      <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
          className="absolute bottom-3 right-3 h-9 w-9 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer z-10"
          aria-label="Save item"
        >
          <span  pan className={`text-lg ${isSaved ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
            {isSaved ? '❤️' : '🤍'}
          </span>
        </button>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Seller Row */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(`/profile/${seller?.id}`)}>
          <img
            src={seller?.avatar || `https://picsum.photos/seed/${seller?.name}/32/32`}
            alt={seller?.name}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{seller?.name}</span>
        </div>
        {seller?.trustScore && (
          <div className="flex items-center gap-0.5 text-xs">
            <span>⭐</span>
            <span className="text-gray-600 dark:text-gray-400 font-medium">{seller.trustScore}%</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Product Name */}
        <h3 
          className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-sm group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors cursor-pointer"
          onClick={() => navigate(`/product/${id}`)}
        >
          {name}
        </h3>

        {/* Details */}
        <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-2">
          {material && <span className="px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded">{material}</span>}
          {size && <span className="px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded">{size}</span>}
        </div>

        {/* Price & EcoCredits */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-900 dark:text-white">EGP {price}</span>
          </div>
          {ecoCredits > 0 && (
            <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
              +{ecoCredits} 🌱
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <button onClick={() => navigate(`/product/${id}`)} className="flex-1 px-3 py-2 rounded-lg bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors cursor-pointer">
            View
          </button>
          {itemInCart ? (
            <button
              onClick={() => navigate("/cart")}
              className="flex-1 px-3 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold text-sm border-2 border-emerald-500 dark:border-emerald-600 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors cursor-pointer"
            >
              View Cart →
            </button>
          ) : (
            <button
              onClick={() => {
                addToCart(product);
                navigate("/cart");
              }}
              className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              + Cart
            </button>
          )}
          {isSwappable && (
            <button onClick={() => navigate('/swap-requests')} className="flex-1 px-3 py-2 rounded-lg border-2 border-green-600 text-green-600 font-semibold text-sm hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors cursor-pointer">
              Swap?
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
