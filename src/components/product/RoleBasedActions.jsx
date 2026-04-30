import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { isBuyer, isSeller, isCreator, isSwapper } from '../../utils/rolePermissions';

const RoleBasedActions = ({ product, className = "" }) => {
  const navigate = useNavigate();
  const { user, addToCart, toggleWishlist, wishlist } = useAppContext();
  
  if (!user) return null;

  const saved = wishlist.some((item) => item.id === product.id);
  const isOwner = product.seller?.name === user.name;
  
  const buyer = user.activeRole === 'buyer';
  const seller = isSeller(user);
  const creator = user.activeRole === 'creator';
  const swapper = user.activeRole === 'swapper';

  const handleAddToCart = () => addToCart(product);
  const handleToggleWishlist = () => toggleWishlist(product);
  const handleTransform = () => navigate(`/upcycle-product/${product.id}`);
  const handleEdit = () => navigate(`/edit-product/${product.id}`);

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {/* BUYER ACTIONS - Commerce focused */}
      {buyer && !isOwner && (
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
          {product.isSwappable && swapper && (
            <button 
              onClick={() => navigate(`/create-swap/${product.id}`)}
              className="px-5 py-2.5 rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-50 cursor-pointer transition-colors"
            >
              Request Swap
            </button>
          )}
        </>
      )}

      {/* SELLER ACTIONS - Commerce focused, OWN items only */}
      {seller && isOwner && (
        <button 
          onClick={handleEdit}
          className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
        >
          Edit Listing
        </button>
      )}

      {/* CREATOR ACTIONS - Transformation focused, NOT OWN items only */}
      {creator && !isOwner && (
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
