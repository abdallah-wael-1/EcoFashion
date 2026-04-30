// src/components/layout/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import {
  Menu, X, Bell, ChevronDown, LogOut, LogIn,
  User, UserPlus, ShoppingBag, Repeat, LayoutDashboard,
  Shirt, Sparkles, Sun, Moon, Home, Store, RefreshCw,
  Info, Mail, Check, Wallet, Settings,
} from '../../utils/icons';
import { useTheme } from '../../context/ThemeContext';
import { getRoleBadgeColor, roleMetadata } from '../../config/rolesConfig';
import { isAdmin, isRegularUser, isSwapper } from '../../utils/rolePermissions';

// Helper for regular user checks
const isUser = (user) => user && !isAdmin(user);

// ─── Static — never mutated ───────────────────────────────────────────────────
const NAV_ITEMS = [
  { to: '/',              label: 'Home',       icon: Home      },
  { to: '/marketplace',   label: 'Marketplace',icon: Store     },
  { to: '/style-feed',    label: 'Style Feed', icon: Sparkles,  userOnly: true },
  { to: '/swap-requests', label: 'Swap',       icon: RefreshCw, requiresSwapper: true, userOnly: true },
  { to: '/about',         label: 'About',      icon: Info      },
  { to: '/contact',       label: 'Contact',    icon: Mail      },
];

// Regular user menu items
const USER_MENU_ITEMS = [
  { to: '/dashboard',      icon: LayoutDashboard, label: 'Dashboard'      },
  { to: '/digital-closet', icon: Shirt,           label: 'Digital Closet', userOnly: true },
  { to: '/swap-requests',  icon: Repeat,          label: 'Swap Requests',  requiresSwapper: true, userOnly: true },
  { to: '/profile',        icon: User,            label: 'My Profile'     },
];

// Admin-only profile dropdown items (minimal)
const ADMIN_PROFILE_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/profile',   icon: User,            label: 'Profile'   },
];

// Admin-only menu items
const ADMIN_MENU_ITEMS = [
  { to: '/admin/users',    icon: User,     label: 'Manage Users'    },
  { to: '/marketplace', icon: Store,    label: 'Manage Items' },
  { to: '/admin/swaps',    icon: Repeat,   label: 'Manage Swaps'    },
  { to: '/admin/settings', icon: Settings, label: 'Admin Settings'  },
];

const Navbar = () => {
  const {
    user, ecoCredits = 0, trustScore = 0, cartCount = 0,
    logout, notifications, markNotificationAsRead,
    markAllNotificationsAsRead, clearNotifications,
    wallet, balanceAnimation,
  } = useAppContext();

  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [mobileOpen,        setMobileOpen]        = useState(false);
  const [profileOpen,       setProfileOpen]       = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showToast,         setShowToast]         = useState(false);
  const [ecoPopup,          setEcoPopup]          = useState(false);
  const [trustPopup,        setTrustPopup]        = useState(false);

  const profileRef       = useRef(null);
  const notificationsRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const activeRole  = user?.activeRole || user?.roles?.[0] || 'buyer';

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (notificationsRef.current && !notificationsRef.current.contains(e.target))
        setNotificationsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const mobileLinkCls = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all cursor-pointer ${
      isActive
        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-100'
    }`;

  // Filtered nav items based on role
  const visibleNavItems = NAV_ITEMS.filter(item => {
    if (isAdmin(user) && item.userOnly) return false;
    if (item.requiresSwapper && (!isSwapper(user) || isAdmin(user))) return false;
    return true;
  });

  // Profile dropdown items based on role
  const profileDropdownItems = isAdmin(user)
    ? ADMIN_PROFILE_ITEMS
    : [
        ...USER_MENU_ITEMS.filter(item =>
          !item.userOnly && (!item.requiresSwapper || isSwapper(user))
        ),
      ];

  // Mobile account menu items based on role
  const mobileAccountItems = isAdmin(user)
    ? ADMIN_MENU_ITEMS
    : [
        ...USER_MENU_ITEMS.filter(item =>
          !item.userOnly && (!item.requiresSwapper || isSwapper(user))
        ),
        ...ADMIN_MENU_ITEMS, // empty for non-admins since isAdmin(user) is false
      ].filter((item, index, self) =>
        self.findIndex(i => i.to === item.to) === index
      );

  return (
    <>
      {/* ══════════════════════════ HEADER ══════════════════════════════════ */}
      <header className="sticky top-0 z-[60] bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800/80 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">

          {/* Brand */}
          <Link to="/" className="flex items-center mr-4 shrink-0 group cursor-pointer">
            <div className="flex mr-2 h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white text-base shadow-md shadow-green-200 dark:shadow-green-900/40 transition-all group-hover:scale-105">
              🌿
            </div>
          </Link>

          {/* ── Center Nav ── */}
          <nav className="hidden lg:flex items-center">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={15} />
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-green-500 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-1.5">

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="h-9 w-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {user ? (
              <>
                {/* ── Divider ── */}
                <div className="hidden md:block w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

                {/* User stats — hidden for admin */}
                {isRegularUser(user) && (
                  <>
                    <div className="hidden md:flex items-center bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setEcoPopup(true)}
                        className="flex items-center gap-1.5 px-3 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors cursor-pointer"
                        title="EcoCredits"
                      >
                        <span className="text-sm leading-none">🌱</span>
                        <span className="text-sm font-bold text-green-600 dark:text-green-400 tabular-nums leading-none">{ecoCredits}</span>
                      </button>
                      <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
                      <button
                        onClick={() => setTrustPopup(true)}
                        className="flex items-center gap-1.5 px-3 py-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors cursor-pointer"
                        title="Trust Score"
                      >
                        <span className="text-sm leading-none">⭐</span>
                        <span className="text-sm font-bold text-amber-600 dark:text-amber-400 tabular-nums leading-none">{trustScore}%</span>
                      </button>
                    </div>

                    {/* Wallet chip — hidden for admin */}
                    <button
                      onClick={() => navigate('/wallet')}
                      className={`hidden md:flex items-center gap-2 pl-2.5 pr-3 py-1.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                        balanceAnimation
                          ? 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700 shadow-md shadow-green-100 dark:shadow-green-900/30'
                          : 'bg-gray-50 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/80 hover:bg-blue-50/70 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800'
                      }`}
                      title="Wallet"
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        balanceAnimation ? 'bg-green-500 scale-110' : 'bg-blue-100 dark:bg-blue-900/50'
                      }`}>
                        <Wallet size={14} className={balanceAnimation ? 'text-white' : 'text-blue-600 dark:text-blue-400'} />
                      </div>
                      <div className="flex flex-col items-start leading-none gap-0.5">
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-wide uppercase">
                          Balance
                        </span>
                        <span className={`text-sm font-bold tabular-nums transition-all duration-300 ${
                          balanceAnimation
                            ? 'text-green-600 dark:text-green-400 scale-105'
                            : 'text-gray-800 dark:text-gray-100'
                        }`}>
                          EGP {(wallet?.balance || 0).toLocaleString()}
                        </span>
                      </div>
                    </button>
                  </>
                )}

                {/* ── Divider ── */}
                <div className="hidden md:block w-px h-5 bg-gray-200 dark:bg-gray-700 mx-0.5" />

                {/* Cart — hidden for admin */}
                {isUser(user) && (
                  <button
                    onClick={() => navigate('/cart')}
                    className="relative h-9 w-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
                    title="Cart"
                  >
                    <ShoppingBag size={18} />
                    {cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-emerald-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-sm">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </button>
                )}

                {/* Notifications — hidden for admin */}
                {isRegularUser(user) && (
                  <div ref={notificationsRef} className="relative">
                    <button
                      onClick={() => setNotificationsOpen(!notificationsOpen)}
                      className="relative h-9 w-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
                      title="Notifications"
                    >
                      <Bell size={18} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-sm">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {notificationsOpen && (
                      <div className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Notifications</h3>
                            {unreadCount > 0 && (
                              <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold rounded-md">{unreadCount}</span>
                            )}
                          </div>
                          {notifications.length > 0 && (
                            <button onClick={clearNotifications} className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                              Clear all
                            </button>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="py-10 text-center">
                              <Bell size={28} className="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                              <p className="text-sm text-gray-400 dark:text-gray-500">All caught up!</p>
                            </div>
                          ) : (
                            notifications.map((notif) => (
                              <div
                                key={notif.id}
                                onClick={() => markNotificationAsRead(notif.id)}
                                className={`px-4 py-3 border-b border-gray-50 dark:border-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer transition-colors ${!notif.read ? 'bg-green-50/60 dark:bg-green-900/10' : ''}`}
                              >
                                {!notif.read && <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mr-2 mb-0.5 align-middle" />}
                                <p className="text-sm font-medium text-gray-900 dark:text-white inline">{notif.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notif.message}</p>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                              </div>
                            ))
                          )}
                        </div>
                        {notifications.length > 0 && (
                          <div className="p-2.5 border-t border-gray-100 dark:border-gray-800">
                            <button
                              onClick={() => {
                                if (unreadCount > 0) {
                                  markAllNotificationsAsRead();
                                  setShowToast(true);
                                  setTimeout(() => setShowToast(false), 3000);
                                }
                                setNotificationsOpen(false);
                              }}
                              className="w-full py-1.5 text-xs font-semibold text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-colors cursor-pointer"
                            >
                              Mark all as read
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Profile dropdown */}
                <div ref={profileRef} className="relative ml-0.5">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
                  >
                    <div className="h-7 w-7 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                      {user.avatar
                        ? <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                        : <div className="h-full w-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-[11px] font-bold text-white">
                            {user.name?.slice(0, 2).toUpperCase() ?? 'U'}
                          </div>
                      }
                    </div>
                    <span className="hidden sm:block max-w-[72px] truncate text-sm font-medium text-gray-700 dark:text-gray-200">
                      {user.name?.split(' ')[0] ?? 'Member'}
                    </span>
                    <ChevronDown size={13} className={`text-gray-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2.5 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50">
                      <div className="px-4 py-3.5 bg-gradient-to-br from-green-50 to-emerald-50/50 dark:from-gray-800 dark:to-gray-800/80 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user.email}</p>
                          </div>
                      {!isAdmin(user) && (
                      <span className={`shrink-0 inline-flex items-center rounded-lg border px-1.5 py-0.5 text-[10px] font-bold ${getRoleBadgeColor(activeRole)}`}>
                        {roleMetadata[activeRole]?.name || activeRole}
                      </span>
                      )}
                          </div>

                        {/* Stats row — hidden for admin */}
                        {isRegularUser(user) && (
                          <div className="flex gap-2 mt-3">
                            <div className="flex-1 bg-white/80 dark:bg-gray-900/60 rounded-lg px-2 py-1.5 text-center">
                              <p className="text-xs font-bold text-green-600 dark:text-green-400">{ecoCredits}</p>
                              <p className="text-[9px] text-gray-400 uppercase tracking-wide font-medium">🌱 Eco</p>
                            </div>
                            <div className="flex-1 bg-white/80 dark:bg-gray-900/60 rounded-lg px-2 py-1.5 text-center">
                              <p className="text-xs font-bold text-amber-600 dark:text-amber-400">{trustScore}%</p>
                              <p className="text-[9px] text-gray-400 uppercase tracking-wide font-medium">⭐ Trust</p>
                            </div>
                            <div className="flex-1 bg-white/80 dark:bg-gray-900/60 rounded-lg px-2 py-1.5 text-center">
                              <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{wallet?.balance || 0}</p>
                              <p className="text-[9px] text-gray-400 uppercase tracking-wide font-medium">💳 EGP</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="py-1.5">
                        {profileDropdownItems.map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors cursor-pointer"
                            onClick={() => setProfileOpen(false)}
                          >
                            <item.icon size={15} className="text-gray-400 dark:text-gray-500" />
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      <div className="border-t border-gray-100 dark:border-gray-800 py-1.5">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/60 rounded-xl transition-all cursor-pointer"
                >
                  <LogIn size={15} /> Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 shadow-md transition-all cursor-pointer"
                >
                  <UserPlus size={15} /> Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden h-9 w-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer ml-1"
            >
              {mobileOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════ MOBILE DRAWER ═══════════════════════════ */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />
      <div
        className={`fixed right-0 top-0 bottom-0 w-[300px] max-w-[88vw] bg-white dark:bg-gray-950 shadow-2xl z-50 lg:hidden flex flex-col transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-sm shadow-sm">🌿</div>
            <span className="font-bold text-gray-900 dark:text-white">EcoFashion</span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {user && (
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-11 w-11 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                {user.avatar
                  ? <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  : <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-base">
                      {user.name?.slice(0, 2).toUpperCase() ?? 'U'}
                    </div>
                }
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user.email}</p>
              </div>
            </div>

            {/* Stats grid — hidden for admin */}
            {isRegularUser(user) && (
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-2.5 text-center">
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">{ecoCredits}</p>
                  <p className="text-[9px] text-gray-400 uppercase tracking-wide font-medium">🌱 Eco</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-2.5 text-center">
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{trustScore}%</p>
                  <p className="text-[9px] text-gray-400 uppercase tracking-wide font-medium">⭐ Trust</p>
                </div>
                <button
                  onClick={() => { navigate('/wallet'); setMobileOpen(false); }}
                  className={`rounded-xl p-2.5 text-center transition-all cursor-pointer ${balanceAnimation ? 'bg-green-100 dark:bg-green-900/40' : 'bg-blue-50 dark:bg-blue-900/20'}`}
                >
                  <p className={`text-sm font-bold tabular-nums ${balanceAnimation ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                    {wallet?.balance || 0}
                  </p>
                  <p className="text-[9px] text-gray-400 uppercase tracking-wide font-medium">💳 EGP</p>
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
          <p className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Navigation</p>
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={mobileLinkCls}
              onClick={() => setMobileOpen(false)}
            >
              {({ isActive }) => (<><item.icon size={16} />{item.label}</>)}
            </NavLink>
          ))}

          {user && (
            <>
              <div className="h-px bg-gray-100 dark:bg-gray-800 my-2" />
              <p className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account</p>

              {/* Cart — hidden for admin */}
              {isUser(user) && (
                <Link
                  to="/cart"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-100 transition-all cursor-pointer"
                  onClick={() => setMobileOpen(false)}
                >
                  <ShoppingBag size={16} />
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="ml-auto h-5 w-5 bg-emerald-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Wallet — hidden for admin */}
              {isUser(user) && (
                <Link
                  to="/wallet"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-100 transition-all cursor-pointer"
                  onClick={() => setMobileOpen(false)}
                >
                  <Wallet size={16} />
                  <span>Wallet</span>
                  <span className="ml-auto text-sm font-bold text-blue-600 dark:text-blue-400">EGP {wallet?.balance || 0}</span>
                </Link>
              )}

              {/* Admin: show admin pages. Regular user: show user pages. */}
              {isAdmin(user)
                ? ADMIN_MENU_ITEMS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-100 transition-all cursor-pointer"
                      onClick={() => setMobileOpen(false)}
                    >
                      <item.icon size={16} />
                      {item.label}
                    </Link>
                  ))
                : USER_MENU_ITEMS
                    .filter(item => !item.userOnly && (!item.requiresSwapper || isSwapper(user)))
                    .map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-100 transition-all cursor-pointer"
                        onClick={() => setMobileOpen(false)}
                      >
                        <item.icon size={16} />
                        {item.label}
                      </Link>
                    ))
              }

              <div className="h-px bg-gray-100 dark:bg-gray-800 my-2" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </>
          )}

          {!user && (
            <div className="pt-3 space-y-2">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer"
                onClick={() => setMobileOpen(false)}
              >
                <LogIn size={16} /> Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 shadow-md transition-all cursor-pointer"
                onClick={() => setMobileOpen(false)}
              >
                <UserPlus size={16} /> Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════ POPUPS ══════════════════════════════════ */}

      {ecoPopup && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" onClick={() => setEcoPopup(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-72 border border-green-100 dark:border-green-900/50" onClick={e => e.stopPropagation()}>
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto text-2xl">🌱</div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">EcoCredits</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Your environmental impact score</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 rounded-xl py-4">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{ecoCredits}</p>
                <p className="text-xs text-green-700/70 dark:text-green-500/70 font-medium mt-0.5">credits earned</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {ecoCredits >= 100 ? '🌿 Incredible eco impact!' : ecoCredits >= 50 ? '🌱 Great progress!' : '🌱 Start earning with sustainable choices.'}
              </p>
            </div>
            <button onClick={() => setEcoPopup(false)} className="w-full mt-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer">Got it</button>
          </div>
        </div>
      )}

      {trustPopup && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" onClick={() => setTrustPopup(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-72 border border-amber-100 dark:border-amber-900/50" onClick={e => e.stopPropagation()}>
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mx-auto text-2xl">⭐</div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Trust Score</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Community reputation rating</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/30 rounded-xl py-4">
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{trustScore}%</p>
                <p className="text-xs text-amber-700/70 dark:text-amber-500/70 font-medium mt-0.5">trust level</p>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" style={{ width: `${trustScore}%` }} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {trustScore >= 95 ? '⭐ Highly trusted!' : trustScore >= 80 ? '🌟 Trusted seller.' : trustScore >= 60 ? '✅ Growing trust.' : '🌱 Keep engaging.'}
              </p>
            </div>
            <button onClick={() => setTrustPopup(false)} className="w-full mt-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer">Got it</button>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-5 right-5 z-[70]">
          <div className="flex items-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <Check size={12} className="text-white" />
            </div>
            All notifications marked as read
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;