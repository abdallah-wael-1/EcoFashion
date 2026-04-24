import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const RoleBasedActions = ({ product, className = "" }) => {
  const navigate = useNavigate();
  const { user, addToCart, toggleWishlist, wishlist } = useAppContext();
  
  if (!user) return null;

  const saved = wishlist.some((item) => item.id === product.id);
  const isOwner = product.seller?.name === user.name;
  
  // Separate role checks - NO overlap
  const isBuyer = user.canBuy;
  const isSeller = user.canSell;
  const isCreator = user.canCreate;

  const handleAddToCart = () => addToCart(product);
  const handleToggleWishlist = () => toggleWishlist(product);
  const handleTransform = () => navigate(`/upcycle-product/${product.id}`);
  const handleEdit = () => navigate(`/edit-product/${product.id}`);

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {/* BUYER ACTIONS - Commerce focused */}
      {isBuyer && !isOwner && (
        <>
          <button 
            onClick={handleAddToCart}
            className="px-5 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 cursor-pointer transition-colors"
          >
            Buy Now
          </button>
          <button 
            onClick={handleToggleWishlist}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            {saved ? 'Remove Wishlist' : 'Add Wishlist'}
          </button>
          {product.isSwappable && (
            <button 
              onClick={() => navigate('/swap-requests')}
              className="px-5 py-2.5 rounded-lg border border-green-600 text-green-600 hover:bg-green-50 cursor-pointer transition-colors"
            >
              Request Swap
            </button>
          )}
        </>
      )}

      {/* SELLER ACTIONS - Commerce focused, OWN items only */}
      {isSeller && isOwner && (
        <button 
          onClick={handleEdit}
          className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
        >
          Edit Listing
        </button>
      )}

      {/* CREATOR ACTIONS - Transformation focused, NOT OWN items only */}
      {isCreator && !isOwner && (
        <button 
          onClick={handleTransform}
          className="px-5 py-2.5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 cursor-pointer transition-colors"
        >
          Reimagine This Item
        </button>
      )}
    </div>
  );
};

export default RoleBasedActions;
