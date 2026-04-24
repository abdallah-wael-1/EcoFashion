import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const UpcycleProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, addProduct, products } = useAppContext();
  const [originalProduct, setOriginalProduct] = useState(null);

  // Check if user has creator permissions ONLY - no cross-role dependencies
  if (!user?.canCreate) {
    return (
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800 rounded-2xl shadow-sm p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent mb-2">Creator Access Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You need creator permissions to upcycle and transform items.</p>
          <button 
            onClick={() => navigate('/profile')}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-green-600 text-white font-medium hover:from-purple-700 hover:to-green-700 transition-all cursor-pointer"
          >
            Update Profile
          </button>
        </div>
      </div>
    );
  }
  const [form, setForm] = useState({ 
    name: '', 
    description: '', 
    price: '', 
    category: 'Tops', 
    size: 'M', 
    condition: 'Good', 
    material: 'Cotton',
    story: '',
    beforeDescription: '',
    afterDescription: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const product = products.find((p) => String(p.id) === id);
      if (product) {
        setOriginalProduct(product);
        setForm(prev => ({
          ...prev,
          name: `Reimagined ${product.name}`,
          category: product.category,
          size: product.size,
          condition: product.condition,
          material: product.material,
          beforeDescription: `${product.name} - ${product.description}`,
        }));
      }
    }
  }, [id, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.description.trim() || Number(form.price) <= 0) {
      setError('Please complete all required fields with valid values.');
      return;
    }
    setLoading(true);
    const item = await addProduct({ 
      ...form, 
      price: Number(form.price), 
      images: [
        `https://picsum.photos/seed/before-${Date.now()}/400/500`,
        `https://picsum.photos/seed/after-${Date.now()}/400/500`
      ], 
      isUpcycled: true, 
      isSwappable: true, 
      ecoCredits: 25,
      seller: { 
        name: user?.name || 'Creator', 
        avatar: '', 
        trustScore: 92 
      } 
    });
    setLoading(false);
    navigate(`/product/${item.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-green-50 dark:from-purple-900/20 dark:to-green-900/20 border border-purple-100 dark:border-purple-800 rounded-2xl shadow-sm p-8">
      {/* Creative Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-green-500 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
              {originalProduct ? `Transform: ${originalProduct.name}` : 'Reimagine Your Item'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {originalProduct 
                ? 'Give this item new life through your creative vision' 
                : 'Transform pre-loved fashion into sustainable art'
              }
            </p>
          </div>
        </div>
        {originalProduct && (
          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg">
            <p className="text-sm text-purple-700 dark:text-purple-300">
              <span className="font-medium">Original Item:</span> {originalProduct.name} (EGP {originalProduct.price})
            </p>
          </div>
        )}
      </div>

      {/* Before/After Story Section */}
      <div className="mb-8 p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-purple-100 dark:border-purple-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">The Transformation Story</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Before: The Original Item</label>
            <textarea 
              value={form.beforeDescription}
              onChange={(e) => setForm({ ...form, beforeDescription: e.target.value })}
              placeholder="Describe the item as it was - its history, condition, and story..."
              rows={3}
              className="w-full border border-purple-200 dark:border-purple-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">After: Your Creative Vision</label>
            <textarea 
              value={form.afterDescription}
              onChange={(e) => setForm({ ...form, afterDescription: e.target.value })}
              placeholder="Describe your transformation - techniques, materials added, new purpose..."
              rows={3}
              className="w-full border border-green-200 dark:border-green-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Creation Name *</label>
          <input 
            value={form.name} 
            onChange={(e) => setForm({ ...form, name: e.target.value })} 
            placeholder="e.g., Reimagined Denim Garden Tote" 
            className="w-full border border-purple-200 dark:border-purple-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all" 
          />
        </div>

        {/* Creative Story */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Creative Story *</label>
          <textarea 
            value={form.description} 
            onChange={(e) => setForm({ ...form, description: e.target.value })} 
            placeholder="Share your inspiration, creative process, and the sustainability impact of your work..." 
            rows={4}
            className="w-full border border-purple-200 dark:border-purple-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all resize-none" 
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
              className="w-full border border-purple-200 dark:border-purple-700 rounded-lg pl-8 pr-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all" 
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Price reflects your creative value and sustainability impact</p>
        </div>

        {/* Category & Size Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <select 
              value={form.category} 
              onChange={(e) => setForm({ ...form, category: e.target.value })} 
              className="w-full border border-purple-200 dark:border-purple-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            >
              <option value="Tops">Tops</option>
              <option value="Bottoms">Bottoms</option>
              <option value="Dresses">Dresses</option>
              <option value="Outerwear">Outerwear</option>
              <option value="Accessories">Accessories</option>
              <option value="Art">Art Pieces</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Size</label>
            <select 
              value={form.size} 
              onChange={(e) => setForm({ ...form, size: e.target.value })} 
              className="w-full border border-purple-200 dark:border-purple-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            >
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="One Size">One Size</option>
            </select>
          </div>
        </div>

        {/* Condition & Material Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original Condition</label>
            <select 
              value={form.condition} 
              onChange={(e) => setForm({ ...form, condition: e.target.value })} 
              className="w-full border border-purple-200 dark:border-purple-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            >
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Worn">Worn</option>
              <option value="Vintage">Vintage</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Material</label>
            <select 
              value={form.material} 
              onChange={(e) => setForm({ ...form, material: e.target.value })} 
              className="w-full border border-purple-200 dark:border-purple-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            >
              <option value="Cotton">Cotton</option>
              <option value="Wool">Wool</option>
              <option value="Denim">Denim</option>
              <option value="Synthetic">Synthetic</option>
              <option value="Mixed">Mixed Materials</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Eco Impact Section */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
          <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">🌱 Environmental Impact</h4>
          <p className="text-xs text-green-600 dark:text-green-400">Your creation will earn +25 Eco Credits and contribute to circular fashion</p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button 
            disabled={loading} 
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white font-medium disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Creating Your Masterpiece...' : 'Share Your Creation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpcycleProduct;
