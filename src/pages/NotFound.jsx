import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from '../utils/icons';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 transition-colors duration-300">
      <div className="text-center max-w-lg">
        {/* 404 Visual Element */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl opacity-20">🔍</div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-6">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>

          {/* Message */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Oops! Page not found
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            The page you're looking for seems to have vanished into the digital void. 
            Don't worry, even the best fashion pieces get misplaced sometimes!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
            >
              <Home className="w-5 h-5" />
              Go back home
            </Link>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer"
            >
              <Search className="w-5 h-5" />
              Browse marketplace
            </Link>
          </div>
        </div>

        {/* Helpful Tips */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You might want to:
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
              Check the URL
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
              Use the search bar
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
              Browse categories
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
