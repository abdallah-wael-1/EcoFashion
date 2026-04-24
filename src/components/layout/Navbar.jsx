// src/components/layout/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Menu, X, Bell, ChevronDown, LogOut, User, ShoppingBag, Repeat, LayoutDashboard, Shirt, Sparkles, Sun, Moon, Home, Store, RefreshCw, Info, Mail } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/marketplace', label: 'Marketplace', icon: Store },
  { to: '/style-feed', label: 'Style Feed', icon: Sparkles },
  { to: '/swap-requests', label: 'Swap', icon: RefreshCw },
  { to: '/about', label: 'About', icon: Info },
  { to: '/contact', label: 'Contact', icon: Mail },
];

const userMenuItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  // { to: '/my-listings', icon: ShoppingBag, label: 'My Listings' },
  // { to: '/digital-closet', icon: Shirt, label: 'Digital Closet' },
  // { to: '/swap-requests', icon: Repeat, label: 'Swap Requests' },
  { to: '/profile', icon: User, label: 'My Profile' },
];

const Navbar = () => {
  const { user, ecoCredits = 0, trustScore = 0, cartCount = 0, logout, notifications, markNotificationAsRead, clearNotifications } = useAppContext();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
      isActive
        ? 'bg-green-600 text-white shadow-md'
        : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-gray-800'
    }`;

  const dropdownLinkClass =
    'flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 transition-all duration-150 hover:bg-gray-50 dark:hover:bg-gray-800 hover:pl-5 cursor-pointer';

  return (
    <header className="sticky top-0 z-[60] border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group cursor-pointer">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-base font-bold shadow-md transition-transform group-hover:scale-105">
              🌿
            </span>
            <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-400">
              EcoFashion
            </span>
          </Link>
        </div>

        {/* Center Navigation - Desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-gray-800'
                }`
              }
              end={item.to === '/'}
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          
         <button onClick={toggleTheme} className="cursor-pointer">
  {isDark ? <Sun /> : <Moon />}
</button>

          {/* Desktop User Area */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* EcoCredits Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 rounded-full border border-green-200 dark:border-green-800 cursor-pointer" onClick={() => navigate('/dashboard')}>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">{ecoCredits}</span>
                  <span className="text-xs text-green-600 dark:text-green-400">🌱</span>
                </div>

                {/* Trust Score Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/30 rounded-full border border-amber-200 dark:border-amber-800 cursor-pointer" onClick={() => navigate('/profile')}>
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{trustScore}%</span>
                  <span className="text-xs text-amber-600 dark:text-amber-400">⭐</span>
                </div>

                {/* Shopping Cart Button */}
                <button
                  onClick={() => navigate('/cart')}
                  className="relative h-9 w-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                  aria-label="Shopping cart"
                  title="Shopping cart"
                >
                  <ShoppingBag size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </button>

                {/* Notifications */}
                <div ref={notificationsRef} className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative h-9 w-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        {notifications.length > 0 && (
                          <button
                            onClick={clearNotifications}
                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                            <Bell size={24} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => markNotificationAsRead(notif.id)}
                              className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${!notif.read ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
                            >
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{notif.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.message}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {new Date(notif.createdAt).toLocaleString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700">
                          <button className="text-xs text-green-600 dark:text-green-400 hover:underline cursor-pointer">
                            View all notifications
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* User Profile Dropdown */}
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-xs font-bold text-white">
                      {user.name?.slice(0, 2).toUpperCase() ?? 'U'}
                    </span>
                    <span className="max-w-[90px] truncate font-medium">{user.name ?? 'Member'}</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user.email}</p>
                      </div>

                      {userMenuItems.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className={dropdownLinkClass}
                          onClick={() => setProfileOpen(false)}
                        >
                          <item.icon size={16} />
                          {item.label}
                        </Link>
                      ))}

                      <div className="border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150 cursor-pointer"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Sign In
                </NavLink>
                <Link
                  to="/register"
                  className="rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden h-9 w-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in cursor-pointer"
            onClick={() => setMobileOpen(false)}
          />
          
          {/* Drawer */}
          <div className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 lg:hidden animate-slide-in-right cursor-default">
            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌿</span>
                <span className="font-bold text-lg text-gray-900 dark:text-white">EcoFashion</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* User Info (if logged in) */}
            {user && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                    {user.name?.slice(0, 2).toUpperCase() ?? 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-500">EcoCredits</p>
                    <p className="text-lg font-bold text-green-600">{ecoCredits}</p>
                  </div>
                  <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-500">Trust Score</p>
                    <p className="text-lg font-bold text-amber-600">{trustScore}%</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>

              {user && (
                <>
                  <div className="h-px bg-gray-200 dark:bg-gray-700 my-4" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Account</p>
                    {/* Cart Link */}
                    <Link
                      to="/cart"
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 relative cursor-pointer"
                      onClick={() => setMobileOpen(false)}
                    >
                      <ShoppingBag size={18} />
                      <span>Shopping Cart</span>
                      {cartCount > 0 && (
                        <span className="absolute right-3 h-5 w-5 bg-emerald-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                          {cartCount > 9 ? '9+' : cartCount}
                        </span>
                      )}
                    </Link>

                    {userMenuItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer"
                        onClick={() => setMobileOpen(false)}
                      >
                        <item.icon size={18} />
                        {item.label}
                      </Link>
                    ))}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 cursor-pointer"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </>
              )}

              {!user && (
                <div className="mt-6 space-y-3">
                  <Link
                    to="/login"
                    className="block w-full rounded-lg bg-gray-100 dark:bg-gray-800 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 py-3 text-center text-sm font-semibold text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md cursor-pointer"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign Up Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;