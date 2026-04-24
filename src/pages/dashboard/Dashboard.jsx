import { useAppContext } from '../../context/AppContext';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

const Dashboard = () => {
  const { user } = useAppContext();
  if (!user) return null;
  if (user.role === 'admin') return <AdminDashboard />;
  return <UserDashboard />;
};

export default Dashboard;