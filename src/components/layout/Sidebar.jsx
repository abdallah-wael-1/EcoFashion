import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, User, Shirt, Repeat,
  Sparkles, Heart, Plus, Store, Palette,
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const BASE_NAV = [
  { to: '/dashboard',      icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/profile',        icon: User,            label: 'Profile' },
  { to: '/digital-closet', icon: Shirt,           label: 'Closet' },
  { to: '/swap-requests',  icon: Repeat,          label: 'Swap' },
  { to: '/style-feed',     icon: Sparkles,        label: 'Feed' },
  { to: '/saved',          icon: Heart,           label: 'Saved' },
];

const SELLER_NAV  = { to: '/my-listings', icon: Store,   label: 'My Listings' };
const CREATOR_NAV = { to: '/upcycle-product', icon: Palette, label: 'Create & Transform' };

const Sidebar = () => {
  const { user } = useAppContext();

  const nav = [...BASE_NAV];
  
  // Independent role rendering - NO cross-role dependencies
  if (user?.canSell) nav.splice(2, 0, SELLER_NAV);
  if (user?.canCreate) nav.splice(user?.canSell ? 3 : 2, 0, CREATOR_NAV);

  const linkBase =
    'group/link relative flex items-center justify-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out group-hover/sidebar:justify-start cursor-pointer';

  return (
    <aside
      className="
        group/sidebar
        hidden lg:flex flex-col
        fixed top-0 left-0
        h-screen
        w-[72px] hover:w-60
        shrink-0
        overflow-hidden
        border-r border-gray-200/70 dark:border-gray-800
        bg-white dark:bg-gray-900
        transition-[width] duration-300 ease-in-out
        shadow-[1px_0_0_0_rgba(0,0,0,0.06)]
        z-40
      "
      aria-label="Sidebar"
    >
      {/* Brand */}
      <div className="flex h-[60px] shrink-0 items-center justify-center gap-2.5 border-b border-gray-100 dark:border-gray-800 px-3 transition-[justify-content] duration-200 group-hover/sidebar:justify-start">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-sm shadow-sm">
          🌿
        </span>
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white opacity-0 transition-all duration-200 group-hover/sidebar:max-w-[160px] group-hover/sidebar:opacity-100">
          EcoFashion
        </span>
      </div>

      {/* Role badges */}
      {user?.roles?.length > 0 && (
        <div className="overflow-hidden border-b border-gray-100 dark:border-gray-800 px-3 transition-all duration-200 ease-in-out max-h-0 opacity-0 group-hover/sidebar:max-h-20 group-hover/sidebar:opacity-100 group-hover/sidebar:py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">Your roles</p>
          <div className="flex flex-wrap gap-1">
            {user.roles.map(r => (
              <span key={r} className="rounded-full bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:text-green-400">
                {r === 'buyer' ? '🛍 Buyer' : r === 'seller' ? '🏪 Seller' : '🎨 Creator'}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="custom-scroll flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
        {nav.map(item => (
          <NavLink
            key={item.to + item.label}
            to={item.to}
            end={item.end}
            title={item.label}
            className={({ isActive }) =>
              `${linkBase} ${isActive
                ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 ring-1 ring-green-500/20 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-100'}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full bg-green-500 group-hover/sidebar:hidden" />
                )}
                <item.icon size={21} strokeWidth={isActive ? 2.4 : 2} className="shrink-0" />
                <span className="min-w-0 max-w-0 flex-1 overflow-hidden truncate text-left opacity-0 transition-all duration-200 group-hover/sidebar:max-w-[160px] group-hover/sidebar:opacity-100">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Role-specific CTAs - Independent rendering */}
      <div className="border-t border-gray-100 dark:border-gray-800 p-2 space-y-1">
        {/* Seller CTA */}
        {user?.canSell && (
          <NavLink
            to="/add-product"
            title="Sell Item"
            className={({ isActive }) =>
              `flex items-center justify-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-semibold
              transition-all duration-200 group-hover/sidebar:justify-start cursor-pointer
              ${isActive
                ? 'bg-green-600 text-white shadow-sm'
                : 'bg-green-500/10 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-600 hover:text-white'}`
            }
          >
            <Plus size={21} className="shrink-0" strokeWidth={2.2} />
            <span className="min-w-0 max-w-0 flex-1 overflow-hidden truncate opacity-0 transition-all duration-200 group-hover/sidebar:max-w-[160px] group-hover/sidebar:opacity-100">
              🛍️ Sell Item
            </span>
          </NavLink>
        )}
        
        {/* Creator CTA */}
        {user?.canCreate && (
          <NavLink
            to="/upcycle-product"
            title="Create & Transform"
            className={({ isActive }) =>
              `flex items-center justify-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-semibold
              transition-all duration-200 group-hover/sidebar:justify-start cursor-pointer
              ${isActive
                ? 'bg-gradient-to-r from-purple-600 to-green-600 text-white shadow-sm'
                : 'bg-gradient-to-r from-purple-500/10 to-green-500/10 dark:from-purple-900/20 dark:to-green-900/20 text-purple-700 dark:text-purple-400 hover:from-purple-600 hover:to-green-600 hover:text-white'}`
            }
          >
            <Plus size={21} className="shrink-0" strokeWidth={2.2} />
            <span className="min-w-0 max-w-0 flex-1 overflow-hidden truncate opacity-0 transition-all duration-200 group-hover/sidebar:max-w-[160px] group-hover/sidebar:opacity-100">
              🎨 Create & Transform
            </span>
          </NavLink>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;