import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { isActiveSeller, isAdmin } from '../../utils/rolePermissions';
import {
  Upload, X, Plus, Tag, Ruler, Layers, Leaf,
  RefreshCw, ChevronRight, AlertCircle, ImagePlus,
  Image as ImageIcon,
} from 'lucide-react';
import SectionTitle from '../../components/common/SectionTitle';

// ── helpers ──────────────────────────────────────────────────────────────────

const SELECT_CLS = `w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
  bg-white dark:bg-gray-800 text-gray-900 dark:text-white
  focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500
  transition-all cursor-pointer text-sm`;

const LABEL_CLS = 'block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5';

// ── Access Guard ──────────────────────────────────────────────────────────────

const AccessDenied = ({ navigate }) => (
  <div className="max-w-md mx-auto mt-16 text-center">
    <div className="h-16 w-16 rounded-2xl bg-red-100 dark:bg-red-900/20
      flex items-center justify-center mx-auto mb-5">
      <AlertCircle size={28} className="text-red-600 dark:text-red-400" />
    </div>
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
      Seller Access Required
    </h2>
    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
      You need seller permissions to list items for sale.
      Update your profile to enable the seller role.
    </p>
    <button onClick={() => navigate('/profile')}
      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white
        bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
        shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
      Update Profile <ChevronRight size={15} />
    </button>
  </div>
);

// ── Single Image Uploader ───────────────────────────────────────────────────────

const SingleImageUploader = ({ image, onChange }) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFiles = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const remove = () => onChange(null);

  return (
    <div className="flex justify-center">
      {image ? (
        <div className="relative group">
          <div className="w-64 h-64 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg">
            <img src={image} alt="Product" className="w-full h-full object-cover" />
          </div>
          <button
            type="button"
            onClick={remove}
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/70 text-white flex items-center justify-center
              opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 cursor-pointer">
            <X size={16} />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 px-3 py-1.5 bg-green-600 text-white text-xs font-medium
              rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-green-700 cursor-pointer">
            Replace
          </button>
        </div>
      ) : (
        <div
          className={`w-64 h-64 rounded-2xl border-2 border-dashed transition-all duration-200
            ${isDragging 
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50'
            }
            flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20`}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}>
          <ImageIcon size={48} className="text-gray-400" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Image</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click or drag & drop</p>
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFiles}
      />
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const CATEGORIES = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories', 'Shoes', 'Bags'];
const SIZES      = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
const CONDITIONS = ['New with tags', 'Like New', 'Excellent', 'Good', 'Fair'];
const MATERIALS  = ['Cotton', 'Organic Cotton', 'Linen', 'Wool', 'Silk', 'Denim', 'Polyester', 'Recycled', 'Other'];

const AddProduct = () => {
  const navigate = useNavigate();
  const { user, addProduct, addNotification } = useAppContext();

  const [image,   setImage]   = useState(null);
  const [form,    setForm]    = useState({
    name: '', description: '', price: '', brand: '',
    category: 'Tops', size: 'M', condition: 'Good', material: 'Cotton',
    isSwappable: true,
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  // Admin has full access, active seller can also add products
  if (!isActiveSeller(user) && !isAdmin(user)) return <AccessDenied navigate={navigate} />;

  const set = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    if (errors[key]) setErrors(p => { const n = { ...p }; delete n[key]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name        = 'Item name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.price || Number(form.price) <= 0) e.price = 'Enter a valid price';
    if (!image)                     e.image       = 'Please upload a product image';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);

    const item = await addProduct({
      ...form,
      price:      Number(form.price),
      images:     [image],
      ecoCredits: Math.floor(Number(form.price) / 10) + 5,
      seller:     { name: user?.name || 'Member', avatar: '', trustScore: 92 },
    });

    setLoading(false);
    
    addNotification({
      title: 'Product added successfully 🎉',
      message: `${form.name} is now live in the marketplace!`,
      type: 'success'
    });
    
    navigate('/marketplace');
  };

  const inputCls = (f) => `w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 dark:text-white
    placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800
    focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all
    ${errors[f]
      ? 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/10'
      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="mx-auto max-w-xl space-y-8">

        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Add New Product
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            List your item for eco-conscious buyers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ── Single Image Upload ── */}
          <div className="flex flex-col items-center space-y-4">
            <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Product Image *
            </label>
            <SingleImageUploader image={image} onChange={setImage} />
            {errors.image && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={11} /> {errors.image}
              </p>
            )}
          </div>

          {/* ── Basic Info ── */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Tag size={15} className="text-green-600" /> Item Details
            </h3>

            <div>
              <label className={LABEL_CLS}>Item Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="e.g., Vintage Levi's 501 Denim Jacket" className={inputCls('name')} />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className={LABEL_CLS}>Brand <span className="normal-case font-normal text-gray-400">(optional)</span></label>
              <input value={form.brand} onChange={e => set('brand', e.target.value)}
                placeholder="e.g., Levi's, Zara, H&M..." className={inputCls('brand')} />
            </div>

            <div>
              <label className={LABEL_CLS}>Description *</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="Describe the condition, styling tips, any flaws, original price..."
                rows={4}
                className={`${inputCls('description')} resize-none`} />
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
            </div>

            {/* Price */}
            <div>
              <label className={LABEL_CLS}>Price (EGP) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">EGP</span>
                <input
                  type="number" min="0"
                  value={form.price} onChange={e => set('price', e.target.value)}
                  placeholder="0"
                  className={`${inputCls('price')} pl-14`} />
              </div>
              {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
              {form.price > 0 && (
                <p className="mt-1.5 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <Leaf size={11} /> Buyer earns {Math.floor(Number(form.price) / 10) + 5} EcoCredits
                </p>
              )}
            </div>
          </div>

          {/* ── Specs ── */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Layers size={15} className="text-green-600" /> Specifications
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLS}>Category</label>
                <select value={form.category} onChange={e => set('category', e.target.value)} className={SELECT_CLS}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL_CLS}>Size</label>
                <select value={form.size} onChange={e => set('size', e.target.value)} className={SELECT_CLS}>
                  {SIZES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLS}>Condition</label>
                <select value={form.condition} onChange={e => set('condition', e.target.value)} className={SELECT_CLS}>
                  {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL_CLS}>Material</label>
                <select value={form.material} onChange={e => set('material', e.target.value)} className={SELECT_CLS}>
                  {MATERIALS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* ── Toggles ── */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <RefreshCw size={15} className="text-green-600" /> Listing Options
            </h3>

            <label
              className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 dark:border-gray-800
                hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">🔄 Available for Swap</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Allow other users to propose a swap for this item</p>
              </div>
              <div
                onClick={() => set('isSwappable', !form.isSwappable)}
                className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 cursor-pointer shrink-0 ml-4
                  ${form.isSwappable ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                style={{ height: '22px', width: '40px' }}>
                <div className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white shadow-sm
                  transition-transform duration-200
                  ${form.isSwappable ? 'translate-x-[18px]' : 'translate-x-0.5'}`}
                  style={{ height: '18px', width: '18px' }} />
              </div>
            </label>
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white
              bg-gradient-to-r from-green-600 to-emerald-600
              hover:from-green-700 hover:to-emerald-700
              shadow-md hover:shadow-lg hover:-translate-y-0.5
              disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
              transition-all duration-200 cursor-pointer">
            {loading ? (
              <><span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Adding product...</>
            ) : (
              <><Upload size={16} /> Add Product</>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddProduct;