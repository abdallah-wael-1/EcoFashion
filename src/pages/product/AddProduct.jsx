import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const AddProduct = () => {
  const navigate = useNavigate();
  const { user, addProduct } = useAppContext();
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Tops', size: 'M', condition: 'Good', material: 'Cotton' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user has seller permissions ONLY - no cross-role dependencies
  if (!user?.canSell) {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded-2xl shadow-sm p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Seller Access Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You need seller permissions to list items for sale.</p>
          <button 
            onClick={() => navigate('/profile')}
            className="px-6 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors cursor-pointer"
          >
            Update Profile
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.description.trim() || Number(form.price) <= 0) {
      setError('Please complete all required fields with valid values.');
      return;
    }
    setLoading(true);
    const item = await addProduct({ ...form, price: Number(form.price), images: [`https://picsum.photos/seed/${Date.now()}/400/500`], isUpcycled: false, isSwappable: true, ecoCredits: 10, seller: { name: user?.name || 'Member', avatar: '', trustScore: 92 } });
    setLoading(false);
    navigate(`/product/${item.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 border border-green-100 dark:border-green-900 rounded-2xl shadow-sm p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100">Sell Your Item</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">List your pre-owned item as-is on the marketplace</p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Item Name *</label>
          <input 
            value={form.name} 
            onChange={(e) => setForm({ ...form, name: e.target.value })} 
            placeholder="e.g., Vintage Denim Jacket" 
            className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all" 
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
          <textarea 
            value={form.description} 
            onChange={(e) => setForm({ ...form, description: e.target.value })} 
            placeholder="Describe your item's condition, brand, size, and any notable features..." 
            rows={4}
            className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all resize-none" 
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price ($) *</label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-gray-500 dark:text-gray-400">$</span>
            <input 
              type="number" 
              value={form.price} 
              onChange={(e) => setForm({ ...form, price: e.target.value })} 
              placeholder="0.00" 
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg pl-8 pr-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all" 
            />
          </div>
        </div>

        {/* Category & Size Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <select 
              value={form.category} 
              onChange={(e) => setForm({ ...form, category: e.target.value })} 
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all"
            >
              <option value="Tops">Tops</option>
              <option value="Bottoms">Bottoms</option>
              <option value="Dresses">Dresses</option>
              <option value="Outerwear">Outerwear</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Size</label>
            <select 
              value={form.size} 
              onChange={(e) => setForm({ ...form, size: e.target.value })} 
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all"
            >
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </div>
        </div>

        {/* Condition & Material Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Condition</label>
            <select 
              value={form.condition} 
              onChange={(e) => setForm({ ...form, condition: e.target.value })} 
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all"
            >
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Worn">Worn</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Material</label>
            <select 
              value={form.material} 
              onChange={(e) => setForm({ ...form, material: e.target.value })} 
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all"
            >
              <option value="Cotton">Cotton</option>
              <option value="Wool">Wool</option>
              <option value="Synthetic">Synthetic</option>
              <option value="Denim">Denim</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button 
            disabled={loading} 
            className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-medium disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Listing Item...' : 'List Item for Sale'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
