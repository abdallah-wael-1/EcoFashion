// src/components/layout/BottomNav.jsx — mobile: icon + label, thumb-friendly, no sidebar
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Store, Repeat2, Shirt, User } from 'lucide-react';

const ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/marketplace', icon: Store, label: 'Shop' },
  { to: '/swap-requests', icon: Repeat2, label: 'Swap' },
  { to: '/digital-closet', icon: Shirt, label: 'Closet' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const BottomNav = () => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200/70 bg-white/95 dark:bg-gray-950/95 dark:border-gray-700 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1 shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.06)] backdrop-blur-md lg:hidden"
      aria-label="Primary navigation"
    >
      <div className="mx-auto flex max-w-md items-end justify-between gap-0.5 px-2 sm:px-4">
        {ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `flex min-w-0 flex-1 flex-col items-center justify-end gap-0.5 rounded-xl px-1.5 py-2 transition-all duration-200 ease-out active:scale-[0.94] cursor-pointer ${
                isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`relative flex h-8 w-10 items-center justify-center rounded-xl transition-all duration-200 ease-out ${
                    isActive
                      ? 'bg-green-50 dark:bg-green-900/30 shadow-sm ring-1 ring-green-600/12 dark:ring-green-400/12'
                      : ''
                  }`}
                >
                  <item.icon
                    size={22}
                    strokeWidth={isActive ? 2.4 : 2}
                    className="relative z-10"
                  />
                </span>
                <span
                  className={`max-w-[4.5rem] truncate text-center text-[10px] font-medium leading-tight tracking-wide transition-colors duration-200 ${
                    isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
