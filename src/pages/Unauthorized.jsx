import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-red-600 mb-4">401</h1>
        <p className="text-2xl text-gray-600 mb-2">Unauthorized</p>
        <p className="text-gray-500 mb-8">You need to sign in to access this page.</p>
        <Link
          to="/login"
          className="inline-flex px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors cursor-pointer"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
