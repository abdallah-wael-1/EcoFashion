import { Link } from 'react-router-dom';
import { Lock, Shield, Home, User } from '../utils/icons';

const Unauthorized = () => {
  return (
    <div className="min-h-screen  flex items-center justify-center px-4 sm:px-6 transition-colors duration-300">
      <div className="text-center max-w-lg">
        {/* Lock Visual Element */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400">
            403
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl opacity-20">🔒</div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-6">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>

          {/* Message */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Access Denied
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            You don't have permission to view this page
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            This area is restricted to users with specific roles. 
            Make sure you're signed in with the correct account type.
          </p>

          {/* Role Information */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Required roles may include:
            </h3>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                🛍️ Seller
              </span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                🎨 Creator
              </span>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                🔄 Swapper
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
            >
              <Home className="w-5 h-5" />
              Go to Dashboard
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer"
            >
              <User className="w-5 h-5" />
              Sign In
            </Link>
          </div>
        </div>

        {/* Helpful Tips */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If you believe this is an error:
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
              Check your account role
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
              Contact support
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
              Sign in with correct account
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
