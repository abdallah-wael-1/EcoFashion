import { useAppContext } from '../../context/AppContext';
import { isAdmin } from '../../utils/rolePermissions';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

const Dashboard = () => {
  const { user } = useAppContext();
  if (!user) return null;
  if (isAdmin(user)) return <AdminDashboard />;
  return <UserDashboard />;
};

export default Dashboard;