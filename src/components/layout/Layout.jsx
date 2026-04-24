// src/components/layout/Layout.jsx
import { Outlet } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import BottomNav from './BottomNav';
import ScrollToTop from '../common/ScrollToTop';

const Layout = () => {
  const { isAuthenticated } = useAppContext();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300">

      {/* Navbar — sticky, full width */}
      <Navbar />

      {/* Body: sidebar + content */}
      <div className="flex flex-1 min-h-0">

        {/* Sidebar — fixed, desktop only, authenticated only */}
        {isAuthenticated && <Sidebar />}

        {/* Main content — pl-[72px] so fixed sidebar does not overlap */}
        <div className={`flex flex-col flex-1 min-w-0 ${
          isAuthenticated ? 'lg:pl-[72px]' : ''
        }`}>
          <main className={`flex-1 ${
            isAuthenticated
              ? 'pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0'
              : ''
          }`}>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
              <Outlet />
            </div>
          </main>

          <Footer />
        </div>
      </div>

      {/* Mobile bottom nav */}
      {isAuthenticated && <BottomNav />}

      {/* Scroll to top button */}
      <ScrollToTop showAfter={300} />
    </div>
  );
};

export default Layout;