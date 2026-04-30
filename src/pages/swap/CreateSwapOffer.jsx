import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { isSwapper } from '../../utils/rolePermissions';
import SectionTitle from '../../components/common/SectionTitle';
import { RefreshCw } from 'lucide-react';

const CreateSwapOffer = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, user, addNotification } = useAppContext();

  const [selectedItemId, setSelectedItemId] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find the target product
  const targetProduct = products.find(p => p.id === parseInt(productId));
  // Get user's own products - use stable ID comparison
  const userProducts = useMemo(() => {
    if (!user) return [];
    return products.filter(p => p.seller?.id === user.id || p.seller?.name === user.name);
  }, [products, user]);

  if (!targetProduct) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product not found</h2>
          <p className="text-gray-600 dark:text-gray-400">The item you're trying to swap for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (!isSwapper(user)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access denied</h2>
          <p className="text-gray-600 dark:text-gray-400">You need swapper role to create swap offers.</p>
        </div>
      </div>
    );
  }

  const selectedItem = userProducts.find(p => p.id === parseInt(selectedItemId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItemId) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      addNotification({
        title: 'Swap request sent! 🔄',
        message: `Your swap offer for "${selectedItem.name}" has been sent.`,
        type: 'success',
      });

      navigate('/swap-hub');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <SectionTitle
            title="Create Swap Offer"
            subtitle="Propose an item exchange to keep fashion circular"
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Target Item */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-purple-600">🎯</span>
              Item You Want
            </h3>
            <div className="flex items-center gap-4">
              <img
                src={targetProduct.images[0] || `https://picsum.photos/seed/${targetProduct.id}/100/100`}
                alt={targetProduct.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{targetProduct.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{targetProduct.condition} · {targetProduct.material}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">From {targetProduct.seller?.name}</p>
              </div>
            </div>
          </div>

          {/* Offer Form */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-green-600" />
              Your Offer
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Select Your Item */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Select item from your listings
                </label>
                {userProducts.length === 0 ? (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                    <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
                      📦 No items in your Digital Closet
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Add items to your Digital Closet first to create swap offers.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/digital-closet')}
                      className="mt-3 text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 underline cursor-pointer"
                    >
                      Go to Digital Closet →
                    </button>
                  </div>
                ) : (
                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                    required
                  >
                    <option value="">Choose an item...</option>
                    {userProducts.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.condition} ({product.material})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Selected Item Preview */}
              {selectedItem && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedItem.images[0] || `https://picsum.photos/seed/${selectedItem.id}/60/60`}
                      alt={selectedItem.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{selectedItem.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedItem.condition} · {selectedItem.material}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Optional Message */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Message (optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal message to your swap request..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !selectedItemId || userProducts.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 disabled:from-purple-400 disabled:to-green-400 text-white font-semibold py-3 rounded-xl transition-all duration-200 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Send Swap Request
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSwapOffer;