import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { isActiveSeller } from "../utils/rolePermissions";

const MyListings = () => {
  const navigate = useNavigate();
  const { user, userProducts = [] } = useAppContext();

  if (!isActiveSeller(user)) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Seller active role required</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Switch your active role to Seller from the dashboard role switcher to access listings.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-5 inline-flex px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors cursor-pointer"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">My Listings</h1>
          <button to="/add-product" onClick={() => navigate("/add-product")} className="inline-flex px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-semibold transition-colors cursor-pointer">
            + List New Item
          </button>
        </div>

        {!userProducts.length ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 mb-4">You haven''t listed any items yet.</p>
            <button onClick={() => navigate("/add-product")} className="inline-flex px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-semibold transition-colors cursor-pointer">
              List Your First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProducts.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg dark:hover:shadow-green-900/20 transition-all">
                <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-4xl"></span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
                <button onClick={() => navigate(`/edit-product/${item.id}`)} className="block text-center w-full px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-semibold transition-colors text-sm cursor-pointer">
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;
