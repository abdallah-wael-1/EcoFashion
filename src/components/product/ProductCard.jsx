import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { isSeller, isCreator, isAdmin } from '../../utils/rolePermissions';

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
const DeleteModal = ({ productName, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    />

    {/* Modal */}
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4 border border-gray-200 dark:border-gray-700">
      {/* Icon */}
      <div className="flex items-center justify-center w-14 h-14 mx-auto rounded-full bg-red-100 dark:bg-red-900/30">
        <span className="text-2xl">🗑️</span>
      </div>

      {/* Text */}
      <div className="text-center space-y-1">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Delete Product?
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            "{productName}"
          </span>
          ? This action cannot be undone.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 px-4 cursor-pointer py-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 cursor-pointer py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── ProductCard ──────────────────────────────────────────────────────────────
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
  const {
    wishlist,
    toggleWishlist,
    addToCart,
    isInCart,
    user,
    products = [],
    setProducts,
  } = useAppContext();

  const [imageError, setImageError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Computed flags
  const isSaved = wishlist.some((item) => item.id === id);
  const itemInCart = isInCart(id);
  const isOwner = seller?.name === user?.name;
  const canBuy = user?.activeRole === 'buyer' && !isOwner;
  const canSell = isSeller(user) && isOwner;
  const canSwap = user?.activeRole === 'swapper' && !isOwner && isSwappable;
  const canCreate = user?.activeRole === 'creator' && !isOwner;
  const canDelete = isAdmin(user) || user?.id === seller?.id;

  // Product object for operations
  const product = {
    id, name, price, images, condition, material, size,
    seller, ecoCredits, isUpcycled, isSwappable, category, description,
  };

  // ── Delete handlers ──────────────────────────────────────────
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.filter((p) => p.id !== id);
      localStorage.setItem('eco_products', JSON.stringify(updatedProducts));
      return updatedProducts;
    });
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  // Condition badge colors
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
    <>
      {/* ── Delete Confirmation Modal ── */}
      {showDeleteModal && (
        <DeleteModal
          productName={name}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}

      <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg dark:hover:shadow-xl transition-all duration-300">
        {/* Image Area */}
        <div
          className="relative h-52 bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center cursor-pointer"
          onClick={() => navigate(`/product/${id}`)}
        >
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

          {/* Save Button */}
          {user?.activeRole === 'buyer' && (
            <button
              onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
              className="absolute bottom-3 right-3 h-9 w-9 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer z-10"
              aria-label="Save item"
            >
              <span className={`text-lg ${isSaved ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
                {isSaved ? '❤️' : '🤍'}
              </span>
            </button>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Seller Row */}
        <div className="px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(`/profile/${seller?.id}`)}
          >
            <img
              src={seller?.avatar || `https://picsum.photos/seed/${seller?.name}/32/32`}
              alt={seller?.name}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {seller?.name}
            </span>
          </div>
          {seller?.trustScore && (
            <div className="flex items-center gap-0.5 text-xs">
              <span>⭐</span>
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                {seller.trustScore}%
              </span>
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
            {material && (
              <span className="px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded">{material}</span>
            )}
            {size && (
              <span className="px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded">{size}</span>
            )}
          </div>

          {/* Price & EcoCredits */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                EGP {price}
              </span>
            </div>
            {ecoCredits > 0 && (
              <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                +{ecoCredits} 🌱
              </span>
            )}
          </div>

          {/* ── Buttons ── */}
          <div className="flex gap-2 pt-2">

            {/* View button — always visible */}
            <button
              onClick={() => navigate(`/product/${id}`)}
              className="flex-1 px-3 py-2 rounded-lg bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors cursor-pointer"
            >
              View
            </button>

            {/* Delete button — admin or owner only */}
            {canDelete && (
              <button
                onClick={handleDeleteClick}
                className="flex-1 px-3  py-2 rounded-lg border border-red-600 text-red-600 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
              >
                Delete
              </button>
            )}

            {/* Cart button — buyers only */}
            {canBuy && (
              itemInCart ? (
                <button
                  onClick={() => navigate('/cart')}
                  className="flex-1 px-3 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold text-sm border-2 border-emerald-500 dark:border-emerald-600 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors cursor-pointer"
                >
                  View Cart →
                </button>
              ) : (
                <button
                  onClick={() => { addToCart(product); navigate('/cart'); }}
                  className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  + Cart
                </button>
              )
            )}

            {/* Swap button */}
            {canSwap && (
              <button
                onClick={() => navigate(`/create-swap/${id}`)}
                className="flex-1 px-3 py-2 rounded-lg border-2 border-purple-600 text-purple-600 font-semibold text-sm hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors cursor-pointer"
              >
                Request Swap
              </button>
            )}

            {/* Reimagine button — creators only */}
            {canCreate && (
              <button
                onClick={() => navigate(`/upcycle-product/${id}`)}
                className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-green-600 text-white font-semibold text-sm hover:from-purple-700 hover:to-green-700 transition-colors cursor-pointer"
              >
                Reimagine
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;