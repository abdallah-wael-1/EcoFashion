import { useNavigate } from 'react-router-dom';
import { useRoles } from '../../hooks/useRoles';

const RoleAwareNav = ({ className = "" }) => {
  const navigate = useNavigate();

  const { user, isBuyer, isSeller, isCreator, isSwapper, isAdmin } = useRoles();

  // Admin sees all navigation buttons
  const showAllButtons = isAdmin(user);

  if (!user) return null;


  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {/* SELLER NAVIGATION - Commerce focused */}
      {(isSeller || showAllButtons) && (
        <button 
          onClick={() => navigate('/add-product')}
          className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors cursor-pointer"
        >
          🛍️ Sell Item
        </button>
      )}
      
      {/* CREATOR NAVIGATION - Transformation focused */}
      {(isCreator || showAllButtons) && (
        <button 
          onClick={() => navigate('/upcycle-product')}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-green-600 text-white font-medium hover:from-purple-700 hover:to-green-700 transition-all cursor-pointer"
        >
          🎨 Create & Transform
        </button>
      )}
      
      {/* SWAPPER NAVIGATION - Exchange focused */}
      {(isSwapper(user) || showAllButtons) && (
        <NavLink 
          to="/swap-marketplace"
          className="px-3 py-2 rounded-lg text-white font-medium hover:bg-white/10 transition-all"
        >
          🔄 Swap
        </NavLink>
      )}
      
      {/* BUYER NAVIGATION - Discovery focused */}
      {(isBuyer || showAllButtons) && (
        <button 
          onClick={() => navigate('/marketplace')}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          🛒 Browse Marketplace
        </button>
      )}

      {/* ADMIN NAVIGATION - Management focused */}
      {isAdmin && (
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors cursor-pointer"
        >
          👑 Admin Panel
        </button>
      )}
    </div>
  );
};

export default RoleAwareNav;
