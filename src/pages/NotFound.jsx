import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-2">Page Not Found</p>
        <p className="text-gray-500 mb-8">Sorry, the page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="inline-flex px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors cursor-pointer"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
