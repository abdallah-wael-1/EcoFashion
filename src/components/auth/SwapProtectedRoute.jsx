import { Navigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { isActiveSwapper, isAdmin } from '../../utils/rolePermissions';

const SwapProtectedRoute = ({ children }) => {
  const { user } = useAppContext();

  // Access is tied to active role context
  if (!isActiveSwapper(user) && !isAdmin(user)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default SwapProtectedRoute;
