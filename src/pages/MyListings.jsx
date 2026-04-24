import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const MyListings = () => {
  const navigate = useNavigate();
  const { userProducts = [] } = useAppContext();

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
