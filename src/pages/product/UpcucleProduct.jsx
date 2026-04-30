import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { isActiveCreator } from '../../utils/rolePermissions';

const UpcycleProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, addProduct, products } = useAppContext();
  const [originalProduct, setOriginalProduct] = useState(null);

  const beforeImageRef = useRef(null);
  const afterImageRef = useRef(null);

  if (!isActiveCreator(user)) {
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
  const [beforeImage, setBeforeImage] = useState('');
  const [afterImage, setAfterImage] = useState('');
  const [beforeImageFile, setBeforeImageFile] = useState(null);
  const [afterImageFile, setAfterImageFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const product = products.find((p) => String(p.id) === id);
      if (product) {
        setOriginalProduct(product);
        setBeforeImage(product.image || product.images?.[0] || '');
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

  const handleBeforeImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBeforeImage(reader.result);
        setBeforeImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAfterImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAfterImage(reader.result);
        setAfterImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.description.trim() || Number(form.price) <= 0) {
      setError('Please complete all required fields with valid values.');
      return;
    }
    if (!id && !beforeImage) {
      setError('Please upload a before image to show the original item.');
      return;
    }
    if (!afterImage) {
      setError('Please upload an after image to show your creation.');
      return;
    }
    setLoading(true);

    const item = await addProduct({
      ...form,
      price: Number(form.price),
      image: afterImage,
      images: [beforeImage, afterImage],
      upcycled: true,
      beforeImage: beforeImage,
      afterImage: afterImage,
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

      {/* Before/After Images Section */}
      <div className="mb-8 p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-purple-100 dark:border-purple-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Before & After Images</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Before Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Before Image (Original){!id && ' *'}
            </label>
            <div className="relative group">
              {beforeImage ? (
                <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700">
                  <img
                    src={beforeImage}
                    alt="Before"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Original
                  </div>
                  {!id && (
                    <button
                      type="button"
                      onClick={() => {
                        setBeforeImage('');
                        setBeforeImageFile(null);
                      }}
                      className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ) : (
                <div className="aspect-w-3 aspect-h-4 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer" onClick={() => beforeImageRef.current?.click()}>
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {id ? 'No original image' : 'Click to upload before image'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            {!id && (
              <input
                ref={beforeImageRef}
                type="file"
                accept="image/*"
                onChange={handleBeforeImageUpload}
                className="hidden"
              />
            )}
          </div>

          {/* After Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">After Image (Your Creation) *</label>
            <div className="relative group">
              {afterImage ? (
                <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-green-200 dark:border-green-700">
                  <img
                    src={afterImage}
                    alt="After"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Your Creation
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAfterImage('');
                      setAfterImageFile(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="aspect-w-3 aspect-h-4 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer" onClick={() => document.getElementById('after-image-upload')?.click()}>
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Click to upload your creation</p>
                  </div>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAfterImageUpload}
              className="hidden"
              id="after-image-upload"
            />
          </div> {/* ← closes After Image div */}
        </div>   {/* ← closes grid */}
      </div>     {/* ← closes Before/After Images Section */}

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
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">After: Your Creative Vision</label>
            <textarea
              value={form.afterDescription}
              onChange={(e) => setForm({ ...form, afterDescription: e.target.value })}
              placeholder="Describe your transformation - techniques, materials added, new purpose..."
              rows={3}
              className="w-full border border-green-200 dark:border-green-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all resize-none"
            ></textarea>
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price (EGP) *</label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-gray-500 dark:text-gray-400">EGP</span>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0.00"
              className="w-full border border-purple-200 dark:border-purple-700 rounded-lg pl-14 pr-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
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