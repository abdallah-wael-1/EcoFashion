import { Link } from 'react-router-dom';
import { useState } from 'react';

const LINKS = {
  Explore: [
    { label: 'Marketplace',    to: '/marketplace' },
    { label: 'Style Feed',     to: '/style-feed' },
    { label: 'Swap Requests',  to: '/swap-requests' },
    { label: 'Upcycled Items', to: '/marketplace' },
  ],
  Account: [
    { label: 'Sign Up',        to: '/register' },
    { label: 'Sign In',        to: '/login' },
    { label: 'Dashboard',      to: '/dashboard' },
    { label: 'Digital Closet', to: '/digital-closet' },
  ],
  Company: [
    { label: 'About Us',     to: '/about' },
    { label: 'Contact',      to: '/contact' },
    { label: 'How It Works', to: '/about' },
    { label: 'Blog',         to: '/' },
  ],
};

const STATS = [
  { value: '12.8K+', label: 'Members' },
  { value: '5.2K+',  label: 'Items Swapped' },
  { value: '847T',   label: 'CO₂ Saved' },
  { value: '4.9★',   label: 'Avg. Trust Score' },
];

const Footer = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-sm mt-auto">

      {/* Stats bar */}
      <div className="border-b border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {STATS.map(s => (
              <div key={s.label} className="text-center group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <p className="text-3xl font-bold text-gray-900 dark:text-white transition-colors group-hover:text-green-600 dark:group-hover:text-green-400">
                  {s.value}
                </p>
                <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Brand col */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 group cursor-pointer">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl
                bg-gradient-to-br from-green-500 to-emerald-600 text-white text-lg font-bold
                shadow-sm transition-transform group-hover:scale-105">
                🌿
              </span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">EcoFashion</span>
            </Link>

            <p className="mt-6 text-base leading-relaxed text-gray-600 dark:text-gray-400 max-w-sm">
              A sustainable marketplace for buying, selling, and swapping
              second-hand clothing. Every transaction saves CO₂ and earns
              EcoCredits.
            </p>

            {/* Newsletter */}
            <div className="mt-8">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Stay updated</p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 min-w-0 rounded-lg border border-gray-300 dark:border-gray-700
                    px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                    bg-white dark:bg-gray-800
                    focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500
                    transition-all duration-200"
                />
                <button
                  onClick={() => {
                    if (!email.includes('@')) {
                      setMsg('Enter valid email');
                      return;
                    }
                    setMsg('Subscribed');
                    setEmail('');
                  }}
                  className="shrink-0 rounded-lg bg-green-600 hover:bg-green-500
                    px-6 py-3 text-sm font-semibold text-white shadow-sm
                    transition-all duration-200 hover:shadow-md cursor-pointer"
                >
                  Subscribe
                </button>
              </div>
              {msg && (
                <p className={`text-sm mt-3 ${msg === 'Subscribed' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {msg}
                </p>
              )}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-6">
                {group}
              </p>
              <ul className="space-y-4">
                {items.map(item => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-base text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 cursor-pointer"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8
          flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2026 EcoFashion Marketplace. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
            <span>Carbon-neutral platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;