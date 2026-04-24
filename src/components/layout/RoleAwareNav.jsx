import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const RoleAwareNav = ({ className = "" }) => {
  const navigate = useNavigate();
  const { user } = useAppContext();

  if (!user) return null;

  // Separate role checks - NO overlap
  const isBuyer = user.canBuy;
  const isSeller = user.canSell;
  const isCreator = user.canCreate;

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {/* SELLER NAVIGATION - Commerce focused */}
      {isSeller && (
        <button 
          onClick={() => navigate('/add-product')}
          className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors cursor-pointer"
        >
          🛍️ Sell Item
        </button>
      )}
      
      {/* CREATOR NAVIGATION - Transformation focused */}
      {isCreator && (
        <button 
          onClick={() => navigate('/upcycle-product')}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-green-600 text-white font-medium hover:from-purple-700 hover:to-green-700 transition-all cursor-pointer"
        >
          🎨 Create & Transform
        </button>
      )}
      
      {/* BUYER NAVIGATION - Discovery focused */}
      {isBuyer && (
        <button 
          onClick={() => navigate('/marketplace')}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          🛒 Browse Marketplace
        </button>
      )}
    </div>
  );
};

export default RoleAwareNav;
