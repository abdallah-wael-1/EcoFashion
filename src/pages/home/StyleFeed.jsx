import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import SectionTitle from '../../components/common/SectionTitle';

// ─── Design System Class Tokens ──────────────────────────────────────────────
// Centralised so every section stays in sync when you change one place.
const ds = {
  // Page / section backgrounds
  pageBg:    'bg-gray-100 dark:bg-gray-900',
  cardBg:    'bg-gray-50  dark:bg-gray-800',
  modalBg:   'bg-gray-50  dark:bg-gray-800',
  // Text
  textPrimary:   'text-gray-900 dark:text-gray-100',
  textSecondary: 'text-gray-600 dark:text-gray-400',
  textMuted:     'text-gray-500 dark:text-gray-500',
  // Borders
  border:        'border-gray-300 dark:border-gray-700',
  borderLight:   'border-gray-200 dark:border-gray-700',
  // Interactive surfaces
  surfaceHover:  'hover:bg-gray-200 dark:hover:bg-gray-700',
  surfaceBase:   'bg-gray-200 dark:bg-gray-700',
  // Inputs
  inputBg:       'bg-white dark:bg-gray-700',
  // Unselected pill / button
  pillIdle: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600',
};

// Convenience: card wrapper classes
const cardCls = `${ds.cardBg} border ${ds.border} rounded-xl`;

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_FEED_ITEMS = [
  { id: 1,  name: "Vintage Levi's 501 Denim",   price: 180, images: ['https://picsum.photos/seed/1/400/400'],  condition: 'Excellent', material: 'Denim',    size: 'M',        seller: { name: 'Fashion Lover',     avatar: 'https://picsum.photos/seed/seller1/48/48',  trustScore: 98 }, ecoCredits: 22, isUpcycled: false, isSwappable: true,  category: 'Bottoms',     aesthetic: 'Vintage',     upcycleLevel: 1, imageHeight: 380, likes: 234, matchScore: 0 },
  { id: 2,  name: 'Upcycled Patchwork Jacket',  price: 280, images: ['https://picsum.photos/seed/2/400/420'],  condition: 'New',       material: 'Cotton',   size: 'S',        seller: { name: 'EcoCreations',      avatar: 'https://picsum.photos/seed/seller2/48/48',  trustScore: 95 }, ecoCredits: 35, isUpcycled: true,  isSwappable: true,  category: 'Outerwear',   aesthetic: 'Casual',      upcycleLevel: 5, imageHeight: 420, likes: 567, matchScore: 0 },
  { id: 3,  name: 'Silk Slip Dress',            price: 150, images: ['https://picsum.photos/seed/3/400/480'],  condition: 'Good',      material: 'Silk',     size: 'XS',       seller: { name: 'Vintage Vibes',     avatar: 'https://picsum.photos/seed/seller3/48/48',  trustScore: 92 }, ecoCredits: 18, isUpcycled: false, isSwappable: false, category: 'Dresses',     aesthetic: 'Formal',      upcycleLevel: 1, imageHeight: 480, likes: 342, matchScore: 0 },
  { id: 4,  name: 'Recycled Wool Sweater',      price: 120, images: ['https://picsum.photos/seed/4/400/350'],  condition: 'Excellent', material: 'Wool',     size: 'L',        seller: { name: 'Sustainable Style', avatar: 'https://picsum.photos/seed/seller4/48/48',  trustScore: 99 }, ecoCredits: 15, isUpcycled: true,  isSwappable: true,  category: 'Tops',        aesthetic: 'Minimal',     upcycleLevel: 4, imageHeight: 350, likes: 189, matchScore: 0 },
  { id: 5,  name: 'Designer Handbag',           price: 450, images: ['https://picsum.photos/seed/5/400/400'],  condition: 'Excellent', material: 'Leather',  size: 'M',        seller: { name: 'Luxury Swap',       avatar: 'https://picsum.photos/seed/seller5/48/48',  trustScore: 97 }, ecoCredits: 56, isUpcycled: false, isSwappable: false, category: 'Bags',        aesthetic: 'Formal',      upcycleLevel: 1, imageHeight: 400, likes: 456, matchScore: 0 },
  { id: 6,  name: 'Upcycled Crop Top',          price: 85,  images: ['https://picsum.photos/seed/6/400/380'],  condition: 'New',       material: 'Recycled', size: 'M',        seller: { name: 'EcoCreations',      avatar: 'https://picsum.photos/seed/seller2/48/48',  trustScore: 95 }, ecoCredits: 10, isUpcycled: true,  isSwappable: true,  category: 'Tops',        aesthetic: 'Y2K',         upcycleLevel: 4, imageHeight: 380, likes: 678, matchScore: 0 },
  { id: 7,  name: 'Vintage Adidas Sneakers',    price: 200, images: ['https://picsum.photos/seed/7/400/350'],  condition: 'Good',      material: 'Canvas',   size: '42',       seller: { name: 'Sneaker Hub',       avatar: 'https://picsum.photos/seed/seller6/48/48',  trustScore: 94 }, ecoCredits: 25, isUpcycled: false, isSwappable: true,  category: 'Shoes',       aesthetic: 'Streetwear',  upcycleLevel: 1, imageHeight: 350, likes: 234, matchScore: 0 },
  { id: 8,  name: 'Linen Summer Dress',         price: 110, images: ['https://picsum.photos/seed/8/400/450'],  condition: 'Excellent', material: 'Linen',    size: 'L',        seller: { name: 'Summer Style',      avatar: 'https://picsum.photos/seed/seller7/48/48',  trustScore: 93 }, ecoCredits: 13, isUpcycled: false, isSwappable: true,  category: 'Dresses',     aesthetic: 'Boho',        upcycleLevel: 1, imageHeight: 450, likes: 312, matchScore: 0 },
  { id: 9,  name: 'Upcycled Denim Shorts',      price: 65,  images: ['https://picsum.photos/seed/9/400/320'],  condition: 'New',       material: 'Denim',    size: 'S',        seller: { name: 'Denim Head',        avatar: 'https://picsum.photos/seed/seller8/48/48',  trustScore: 91 }, ecoCredits: 8,  isUpcycled: true,  isSwappable: true,  category: 'Bottoms',     aesthetic: 'Y2K',         upcycleLevel: 3, imageHeight: 320, likes: 456, matchScore: 0 },
  { id: 10, name: 'Wool Coat',                  price: 350, images: ['https://picsum.photos/seed/10/400/500'], condition: 'Good',      material: 'Wool',     size: 'M',        seller: { name: 'Winter Wear',       avatar: 'https://picsum.photos/seed/seller9/48/48',  trustScore: 96 }, ecoCredits: 44, isUpcycled: false, isSwappable: false, category: 'Outerwear',   aesthetic: 'Minimal',     upcycleLevel: 1, imageHeight: 500, likes: 389, matchScore: 0 },
  { id: 11, name: 'Vintage Band T-Shirt',       price: 125, images: ['https://picsum.photos/seed/11/400/370'], condition: 'Good',      material: 'Cotton',   size: 'M',        seller: { name: 'Band Merch',        avatar: 'https://picsum.photos/seed/seller16/48/48', trustScore: 90 }, ecoCredits: 15, isUpcycled: false, isSwappable: true,  category: 'Tops',        aesthetic: 'Streetwear',  upcycleLevel: 1, imageHeight: 370, likes: 523, matchScore: 0 },
  { id: 12, name: 'Upcycled Denim Skirt',       price: 70,  images: ['https://picsum.photos/seed/12/400/410'], condition: 'New',       material: 'Denim',    size: 'M',        seller: { name: 'Skirt Creator',     avatar: 'https://picsum.photos/seed/seller17/48/48', trustScore: 93 }, ecoCredits: 8,  isUpcycled: true,  isSwappable: true,  category: 'Bottoms',     aesthetic: 'Y2K',         upcycleLevel: 4, imageHeight: 410, likes: 612, matchScore: 0 },
  { id: 13, name: 'Cashmere Scarf',             price: 220, images: ['https://picsum.photos/seed/13/400/300'], condition: 'Excellent', material: 'Cashmere', size: 'One Size', seller: { name: 'Luxury Accents',    avatar: 'https://picsum.photos/seed/seller18/48/48', trustScore: 99 }, ecoCredits: 27, isUpcycled: false, isSwappable: false, category: 'Accessories', aesthetic: 'Formal',      upcycleLevel: 1, imageHeight: 300, likes: 278, matchScore: 0 },
  { id: 14, name: 'Upcycled Blazer',            price: 195, images: ['https://picsum.photos/seed/14/400/420'], condition: 'New',       material: 'Recycled', size: 'S',        seller: { name: 'Office Style',      avatar: 'https://picsum.photos/seed/seller19/48/48', trustScore: 94 }, ecoCredits: 24, isUpcycled: true,  isSwappable: true,  category: 'Outerwear',   aesthetic: 'Minimal',     upcycleLevel: 5, imageHeight: 420, likes: 334, matchScore: 0 },
  { id: 15, name: 'Vintage Floral Dress',       price: 165, images: ['https://picsum.photos/seed/15/400/460'], condition: 'Good',      material: 'Cotton',   size: 'S',        seller: { name: 'Retro Fashion',     avatar: 'https://picsum.photos/seed/seller20/48/48', trustScore: 91 }, ecoCredits: 20, isUpcycled: false, isSwappable: true,  category: 'Dresses',     aesthetic: 'Cottagecore', upcycleLevel: 1, imageHeight: 460, likes: 445, matchScore: 0 },
];

const MOCK_UPCYCLERS = [
  { id: 1, name: 'EcoCreations',      avatar: 'https://picsum.photos/seed/seller2/64/64',  items: 234, trustScore: 95 },
  { id: 2, name: 'Sustainable Style', avatar: 'https://picsum.photos/seed/seller4/64/64',  items: 156, trustScore: 99 },
  { id: 3, name: 'Denim Head',        avatar: 'https://picsum.photos/seed/seller8/64/64',  items: 89,  trustScore: 91 },
  { id: 4, name: 'Vintage Vibes',     avatar: 'https://picsum.photos/seed/seller3/64/64',  items: 203, trustScore: 92 },
  { id: 5, name: 'Luxury Swap',       avatar: 'https://picsum.photos/seed/seller5/64/64',  items: 124, trustScore: 97 },
  { id: 6, name: 'Summer Style',      avatar: 'https://picsum.photos/seed/seller7/64/64',  items: 98,  trustScore: 93 },
  { id: 7, name: 'Winter Wear',       avatar: 'https://picsum.photos/seed/seller9/64/64',  items: 167, trustScore: 96 },
  { id: 8, name: 'Retro Fashion',     avatar: 'https://picsum.photos/seed/seller20/64/64', items: 145, trustScore: 91 },
];

const MOCK_BOARDS = [
  { id: 1, name: 'Summer Upcycle Inspo 🌿', creator: '@EcoCreations',     items: 42, images: ['1',  '2',  '3',  '4']  },
  { id: 2, name: 'Streetwear Remix 🔥',     creator: '@DenimHead',         items: 38, images: ['7',  '11', '6',  '9']  },
  { id: 3, name: 'Vintage Gems 💎',         creator: '@VintageVibes',      items: 56, images: ['3',  '8',  '15', '1']  },
  { id: 4, name: 'Minimal Wardrobe ✨',     creator: '@SustainableStyle',  items: 29, images: ['4',  '10', '14', '13'] },
  { id: 5, name: 'Y2K Revival 💕',          creator: '@SkirtCreator',      items: 67, images: ['6',  '12', '9',  '2']  },
  { id: 6, name: 'Festival Fits 🎪',        creator: '@SummerStyle',       items: 34, images: ['8',  '15', '3',  '6']  },
];

const MOCK_SWAPS = [
  { id: 1, location: 'Cairo, Maadi',      date: 'Sat 25 Jan', items: 12, swappers: 8  },
  { id: 2, location: 'Cairo, Downtown',   date: 'Sun 26 Jan', items: 18, swappers: 12 },
  { id: 3, location: 'Cairo, Heliopolis', date: 'Sat 25 Jan', items: 9,  swappers: 6  },
];

// ─── Preferences Modal ────────────────────────────────────────────────────────
const PreferencesModal = ({ isOpen, onClose, onSave }) => {
  const [prefs, setPrefs] = useState(() => {
    const saved = localStorage.getItem('ecofashion-preferences');
    return saved
      ? JSON.parse(saved)
      : { sizes: ['M'], aesthetics: ['Vintage', 'Casual'], upcycleIntensity: 3, budget: 500, materials: ['Cotton', 'Denim'] };
  });

  const handleSave = () => {
    localStorage.setItem('ecofashion-preferences', JSON.stringify(prefs));
    onSave(prefs);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className={`${ds.modalBg} rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>

        {/* Header */}
        <div className={`sticky top-0 ${ds.modalBg} border-b ${ds.border} px-6 py-4 flex items-center justify-between`}>
          <h2 className={`text-2xl font-bold ${ds.textPrimary}`}>Tune Your Feed</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${ds.surfaceHover} ${ds.textSecondary} transition-colors cursor-pointer`}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">

          {/* Sizes */}
          <div>
            <h3 className={`text-lg font-semibold ${ds.textPrimary} mb-4`}>Your Sizes</h3>
            <div className="space-y-3">
              {['Tops', 'Bottoms', 'Shoes'].map((type) => (
                <div key={type}>
                  <label className={`text-sm font-medium ${ds.textSecondary} mb-2 block`}>{type}</label>
                  <select
                    value={prefs.sizes?.[0] || 'M'}
                    onChange={(e) => setPrefs({ ...prefs, sizes: [e.target.value] })}
                    className={`w-full px-4 py-2 rounded-lg border ${ds.border} ${ds.inputBg} ${ds.textPrimary} focus:outline-none focus:ring-2 focus:ring-green-600`}
                  >
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Aesthetics */}
          <div>
            <h3 className={`text-lg font-semibold ${ds.textPrimary} mb-4`}>Your Aesthetic</h3>
            <div className="flex flex-wrap gap-2">
              {['Vintage', 'Streetwear', 'Minimal', 'Boho', 'Y2K', 'Cottagecore', 'Formal', 'Casual'].map((aes) => {
                const selected = (prefs.aesthetics || []).includes(aes);
                return (
                  <button
                    key={aes}
                    onClick={() => {
                      const current = prefs.aesthetics || [];
                      setPrefs({
                        ...prefs,
                        aesthetics: current.includes(aes)
                          ? current.filter((a) => a !== aes)
                          : [...current, aes],
                      });
                    }}
                    className={`px-4 py-2 rounded-full font-medium transition-colors cursor-pointer ${
                      selected ? 'bg-green-600 text-white' : ds.pillIdle
                    }`}
                  >
                    {aes}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upcycle Intensity */}
          <div>
            <h3 className={`text-lg font-semibold ${ds.textPrimary} mb-4`}>Upcycle Intensity</h3>
            <div className="flex items-center gap-4">
              <input
                type="range" min="1" max="5"
                value={prefs.upcycleIntensity || 3}
                onChange={(e) => setPrefs({ ...prefs, upcycleIntensity: parseInt(e.target.value) })}
                className="flex-1"
              />
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className={`text-lg ${i <= (prefs.upcycleIntensity || 3) ? 'text-green-600' : 'text-gray-300 dark:text-gray-600'}`}>
                    🌱
                  </span>
                ))}
              </div>
            </div>
            <p className={`text-xs ${ds.textMuted} mt-2`}>1 = Any item, 5 = Heavily upcycled only</p>
          </div>

          {/* Budget */}
          <div>
            <h3 className={`text-lg font-semibold ${ds.textPrimary} mb-4`}>Budget Range</h3>
            <input
              type="range" min="0" max="1000"
              value={prefs.budget || 500}
              onChange={(e) => setPrefs({ ...prefs, budget: parseInt(e.target.value) })}
              className="w-full"
            />
            <p className={`text-sm ${ds.textSecondary} mt-2`}>Up to EGP {prefs.budget || 500}</p>
          </div>

          {/* Materials */}
          <div>
            <h3 className={`text-lg font-semibold ${ds.textPrimary} mb-4`}>Favorite Materials</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Cotton', 'Linen', 'Denim', 'Silk', 'Wool', 'Recycled'].map((mat) => (
                <label key={mat} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(prefs.materials || []).includes(mat)}
                    onChange={() => {
                      const current = prefs.materials || [];
                      setPrefs({
                        ...prefs,
                        materials: current.includes(mat)
                          ? current.filter((m) => m !== mat)
                          : [...current, mat],
                      });
                    }}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-green-600"
                  />
                  <span className={ds.textSecondary}>{mat}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`sticky bottom-0 ${ds.modalBg} border-t ${ds.border} px-6 py-4 flex gap-3`}>
          <button
            onClick={onClose}
            className={`flex-1 px-6 py-3 rounded-lg border-2 ${ds.border} ${ds.textSecondary} font-semibold ${ds.surfaceHover} transition-colors cursor-pointer`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Quick View Modal ─────────────────────────────────────────────────────────
const QuickViewModal = ({ item, isOpen, onClose, onAddToCart, onGoSwap, onGoDetails }) => {
  if (!isOpen || !item) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`${ds.modalBg} rounded-2xl max-w-2xl w-full my-8`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

          {/* Image */}
          <div className="flex flex-col gap-3">
            <img src={item.images[0]} alt={item.name} className="w-full rounded-xl object-cover h-96" />
            {item.isUpcycled && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-full text-sm font-semibold w-fit">
                <span>♻</span>
                <span>Upcycled</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div>
              <h2 className={`text-3xl font-bold ${ds.textPrimary} mb-2`}>{item.name}</h2>
              <div className={`flex items-center gap-2 text-sm ${ds.textSecondary}`}>
                <img src={item.seller.avatar} alt={item.seller.name} className="h-6 w-6 rounded-full" />
                <span>{item.seller.name}</span>
                <span>⭐ {item.seller.trustScore}%</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 text-2xl">
              <span className={`font-bold ${ds.textPrimary}`}>EGP {item.price}</span>
              {item.ecoCredits > 0 && (
                <span className="text-lg text-green-600 dark:text-green-400 font-semibold">+{item.ecoCredits} 🌱</span>
              )}
            </div>

            {/* Specs */}
            <div className={`grid grid-cols-3 gap-4 py-4 border-y ${ds.borderLight}`}>
              {[
                { label: 'Size',      value: item.size      },
                { label: 'Material',  value: item.material  },
                { label: 'Condition', value: item.condition },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className={`text-xs ${ds.textMuted} font-medium`}>{label}</p>
                  <p className={`text-sm font-semibold ${ds.textPrimary}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Carbon */}
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                ♻ Buying this item saves <strong>6.2kg CO₂</strong> vs buying new
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => onAddToCart(item)}
                className="flex-1 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors cursor-pointer"
              >
                Add to Cart
              </button>
              {item.isSwappable && (
                <button
                  onClick={onGoSwap}
                  className="flex-1 px-6 py-3 rounded-lg border-2 border-green-600 text-green-600 dark:text-green-400 font-semibold hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors cursor-pointer"
                >
                  Request Swap
                </button>
              )}
            </div>

            <button
              onClick={onGoDetails}
              className={`w-full px-6 py-2 rounded-lg border ${ds.border} ${ds.textSecondary} font-semibold ${ds.surfaceHover} transition-colors cursor-pointer`}
            >
              View Full Listing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Feed Card ────────────────────────────────────────────────────────────────
const FeedCard = ({ item, onQuickView }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div
      className={`break-inside-avoid mb-4 ${cardCls} overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer`}
      onClick={() => onQuickView(item)}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${ds.surfaceBase}`} style={{ aspectRatio: '1/1' }}>
        <img
          src={item.images[0]}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Upcycled badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          {item.isUpcycled && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-green-100 dark:bg-green-900/70 text-green-800 dark:text-green-300 rounded-full text-xs font-semibold border border-green-300 dark:border-green-700">
              <span>♻</span>
              <span>Upcycled</span>
            </div>
          )}
        </div>

        {/* Like */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-white/90 dark:bg-gray-900/80 rounded-full px-3 py-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
            className="text-lg transition-transform hover:scale-125"
          >
            {isLiked ? '❤️' : '🤍'}
          </button>
          <span className={`text-sm font-medium ${ds.textSecondary}`}>{item.likes}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        {/* Seller */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <img src={item.seller.avatar} alt={item.seller.name} className="h-5 w-5 rounded-full" />
            <span className={ds.textSecondary}>@{item.seller.name.split(' ')[0].toLowerCase()}</span>
          </div>
          <span className={ds.textMuted}>2h ago</span>
        </div>

        {/* Title */}
        <h3 className={`font-semibold ${ds.textPrimary} text-sm line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors`}>
          {item.name}
        </h3>
        <p className={`text-xs ${ds.textMuted}`}>{item.material} • {item.size}</p>

        {/* Match score */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${ds.textSecondary}`}>Match</span>
            <span className="text-xs font-bold text-green-600 dark:text-green-400">{item.matchScore}%</span>
          </div>
          <div className={`h-1.5 ${ds.surfaceBase} rounded-full overflow-hidden`}>
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
              style={{ width: `${item.matchScore}%` }}
            />
          </div>
        </div>

        {/* Price & actions */}
        <div className={`pt-3 border-t ${ds.borderLight} flex items-center justify-between`}>
          <div>
            <span className={`font-bold ${ds.textPrimary}`}>EGP {item.price}</span>
            <span className="text-xs text-green-600 dark:text-green-400 font-medium ml-2">+{item.ecoCredits} 🌱</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onQuickView(item); }}
              className="px-2 py-1 rounded text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 transition-colors cursor-pointer"
            >
              Buy
            </button>
            {item.isSwappable && (
              <button
                onClick={(e) => e.stopPropagation()}
                className="px-2 py-1 rounded text-xs font-medium border border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors cursor-pointer"
              >
                Swap?
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main StyleFeed ───────────────────────────────────────────────────────────
const StyleFeed = () => {
  const navigate = useNavigate();
  const { user, addToCart } = useAppContext();
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('ecofashion-preferences');
    return saved ? JSON.parse(saved) : null;
  });
  const [showPrefsModal, setShowPrefsModal] = useState(false);
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [followedUpcyclers, setFollowedUpcyclers] = useState([]);
  const [onboardingStep, setOnboardingStep] = useState(preferences ? 0 : 1);

  const feedItemsWithScores = useMemo(() => {
    if (!preferences) return MOCK_FEED_ITEMS;
    return MOCK_FEED_ITEMS.map((item) => {
      let score = 0;
      if (preferences.sizes?.includes(item.size))              score += 30;
      if (preferences.aesthetics?.includes(item.aesthetic))    score += 25;
      if (item.price <= (preferences.budget || 500))           score += 20;
      if (item.upcycleLevel >= (preferences.upcycleIntensity || 1)) score += 15;
      if (preferences.materials?.includes(item.material))      score += 10;
      return { ...item, matchScore: Math.min(score + ((item.id % 3) + 1), 99) };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [preferences]);

  // ── Unauthenticated view ──────────────────────────────────────────────────
  if (!user) {
    return (
      <div className={`min-h-screen  flex items-center justify-center p-4`}>
        <div className="relative">
          {/* Blurred ghost grid */}
          <div className="absolute inset-0 blur-sm opacity-20 pointer-events-none">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-8 max-w-6xl">
              {MOCK_FEED_ITEMS.slice(0, 8).map((item) => (
                <div key={item.id} className={`${ds.cardBg} rounded-lg h-64`} />
              ))}
            </div>
          </div>

          {/* CTA card */}
          <div className={`${ds.cardBg} rounded-3xl shadow-2xl p-8 max-w-md mx-auto relative z-10 text-center space-y-6`}>
              <div className="text-sm text-left space-y-1.5">
                <SectionTitle 
                title='Your Personal Style Feed'
                subtitle='Sign in to unlock your personalized feed'
                />
                {['Items matched to your size', 'Your aesthetic preferences', 'EcoCredits tracking', 'Swap recommendations'].map((feat) => (
                  <div key={feat} className="flex items-center gap-2">
                    <span>✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/login')}
                className="flex-1 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="flex-1 px-6 py-3 rounded-lg border-2 border-green-600 text-green-600 dark:text-green-400 font-semibold hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Onboarding flow ───────────────────────────────────────────────────────
  if (onboardingStep > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className={`${ds.cardBg} rounded-3xl shadow-2xl p-8 max-w-md w-full space-y-8`}>

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h1 className={`text-2xl font-bold ${ds.textPrimary}`}>Set Up Your Feed</h1>
              <span className={`text-sm font-medium ${ds.textMuted}`}>Step {onboardingStep} of 4</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-2 flex-1 rounded-full ${step <= onboardingStep ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                />
              ))}
            </div>
          </div>

          {/* Step 1 – Size */}
          {onboardingStep === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className={`text-xl font-bold ${ds.textPrimary} mb-2`}>What's your size?</h2>
                <p className={`text-sm ${ds.textSecondary}`}>This helps us find items that fit you</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => { setPreferences({ ...preferences, sizes: [size] }); setOnboardingStep(2); }}
                    className={`px-4 py-2 rounded-lg ${ds.pillIdle} font-medium hover:bg-green-100 dark:hover:bg-green-900/40 hover:text-green-700 dark:hover:text-green-300 transition-colors cursor-pointer`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 – Aesthetic */}
          {onboardingStep === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className={`text-xl font-bold ${ds.textPrimary} mb-2`}>Your aesthetic?</h2>
                <p className={`text-sm ${ds.textSecondary}`}>Select what speaks to your style</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Vintage', 'Streetwear', 'Minimal', 'Boho', 'Y2K', 'Cottagecore', 'Formal', 'Casual'].map((aes) => {
                  const selected = (preferences?.aesthetics || []).includes(aes);
                  return (
                    <button
                      key={aes}
                      onClick={() => {
                        const current = preferences?.aesthetics || [];
                        setPreferences({
                          ...preferences,
                          aesthetics: current.includes(aes) ? current.filter((a) => a !== aes) : [...current, aes],
                        });
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                        selected ? 'bg-green-600 text-white' : ds.pillIdle
                      }`}
                    >
                      {aes}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3 – Upcycle intensity */}
          {onboardingStep === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className={`text-xl font-bold ${ds.textPrimary} mb-2`}>Upcycle intensity?</h2>
                <p className={`text-sm ${ds.textSecondary}`}>How much do you love upcycled pieces?</p>
              </div>
              <div className="space-y-4">
                <input
                  type="range" min="1" max="5"
                  value={preferences?.upcycleIntensity || 3}
                  onChange={(e) => setPreferences({ ...preferences, upcycleIntensity: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className={`text-2xl ${i <= (preferences?.upcycleIntensity || 3) ? '' : 'opacity-30'}`}>
                      🌱
                    </span>
                  ))}
                </div>
                <p className={`text-xs ${ds.textMuted} text-center`}>
                  {preferences?.upcycleIntensity === 5
                    ? 'Only heavily upcycled pieces!'
                    : preferences?.upcycleIntensity === 1
                    ? 'Any item works for me'
                    : 'Mix of regular and upcycled'}
                </p>
              </div>
            </div>
          )}

          {/* Step 4 – Budget */}
          {onboardingStep === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className={`text-xl font-bold ${ds.textPrimary} mb-2`}>Budget range?</h2>
                <p className={`text-sm ${ds.textSecondary}`}>Max you'd spend on an item</p>
              </div>
              <div className="space-y-4">
                <input
                  type="range" min="0" max="1000"
                  value={preferences?.budget || 500}
                  onChange={(e) => setPreferences({ ...preferences, budget: parseInt(e.target.value) })}
                  className="w-full"
                />
                <p className="text-center text-2xl font-bold text-green-600 dark:text-green-400">
                  Up to EGP {preferences?.budget || 500}
                </p>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3">
            {onboardingStep > 1 && (
              <button
                onClick={() => setOnboardingStep(onboardingStep - 1)}
                className={`flex-1 px-6 py-3 rounded-lg border ${ds.border} ${ds.textSecondary} font-semibold ${ds.surfaceHover} transition-colors cursor-pointer`}
              >
                Back
              </button>
            )}
            <button
              onClick={() => {
                if (onboardingStep === 4) {
                  localStorage.setItem('ecofashion-preferences', JSON.stringify(preferences));
                  setOnboardingStep(0);
                } else {
                  setOnboardingStep(onboardingStep + 1);
                }
              }}
              className="flex-1 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors cursor-pointer"
            >
              {onboardingStep === 4 ? 'Create Feed' : 'Next'}
            </button>
          </div>

          <button
            onClick={() => setOnboardingStep(0)}
            className={`w-full text-center text-sm ${ds.textMuted} hover:${ds.textSecondary} transition-colors cursor-pointer`}
          >
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  // ── Main feed ─────────────────────────────────────────────────────────────
  return (
    <div className={` min-h-screen py-8`}>
      {/* Modals */}
      <PreferencesModal
        isOpen={showPrefsModal}
        onClose={() => setShowPrefsModal(false)}
        onSave={(prefs) => setPreferences(prefs)}
      />
      <QuickViewModal
        item={quickViewItem}
        isOpen={!!quickViewItem}
        onClose={() => setQuickViewItem(null)}
        onAddToCart={(item) => addToCart(item)}
        onGoSwap={() => navigate('/swap-requests')}
        onGoDetails={() => navigate(`/product/${quickViewItem.id}`)}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
            <SectionTitle
              title="Your Style Feed "
              subtitle="Based on your preferences · Updated 2h ago."
              align="center"
              size="md"
            />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPrefsModal(true)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg border ${ds.border} ${ds.textSecondary} font-semibold ${ds.surfaceHover} transition-colors cursor-pointer`}
              >
                <span>⚙</span>
                <span>Tune Feed</span>
              </button>
              <button
                onClick={() => window.location.reload()}
                className={`p-3 rounded-lg border ${ds.border} ${ds.textSecondary} ${ds.surfaceHover} transition-colors cursor-pointer`}
              >
                <span>🔄</span>
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className={`h-1 ${ds.surfaceBase} rounded-full overflow-hidden`}>
              <div className="h-full bg-green-600 rounded-full" style={{ width: '78%' }} />
            </div>
            <p className={`text-xs ${ds.textSecondary}`}>Your feed is 78% personalized — complete your profile</p>
          </div>
        </div>

        {/* ── Preference Tags ───────────────────────────────────────────────── */}
        {preferences && (
          <div className="overflow-x-auto">
            <div className="flex gap-2 pb-2">
              {preferences.sizes?.map((size) => (
                <button
                  key={size}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700 text-sm font-medium whitespace-nowrap hover:bg-green-200 dark:hover:bg-green-900/60 transition-colors"
                >
                  Size {size} <span className="cursor-pointer">×</span>
                </button>
              ))}
              {preferences.aesthetics?.slice(0, 2).map((aes) => (
                <button
                  key={aes}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700 text-sm font-medium whitespace-nowrap hover:bg-green-200 dark:hover:bg-green-900/60 transition-colors"
                >
                  {aes} <span className="cursor-pointer">×</span>
                </button>
              ))}
              <button
                onClick={() => setShowPrefsModal(true)}
                className={`px-4 py-2 rounded-full ${ds.pillIdle} text-sm font-medium whitespace-nowrap transition-colors`}
              >
                + Add Preference
              </button>
            </div>
          </div>
        )}

        {/* ── Trending Upcyclers ────────────────────────────────────────────── */}
        <div>
          <h2 className={`text-2xl font-bold ${ds.textPrimary} mb-6`}>🔥 Trending Upcyclers</h2>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-full">
              {MOCK_UPCYCLERS.map((upcycler) => (
                <div
                  key={upcycler.id}
                  className={`flex-shrink-0 w-40 ${cardCls} p-4 text-center space-y-3 hover:shadow-md transition-shadow`}
                >
                  <img src={upcycler.avatar} alt={upcycler.name} className="w-16 h-16 rounded-full mx-auto object-cover" />
                  <div>
                    <p className={`font-semibold ${ds.textPrimary}`}>@{upcycler.name}</p>
                    <p className={`text-xs ${ds.textMuted}`}>🌱 {upcycler.items} items</p>
                    <p className={`text-xs ${ds.textMuted}`}>⭐ {upcycler.trustScore}% trust</p>
                  </div>
                  <button
                    onClick={() => {
                      setFollowedUpcyclers(
                        followedUpcyclers.includes(upcycler.id)
                          ? followedUpcyclers.filter((id) => id !== upcycler.id)
                          : [...followedUpcyclers, upcycler.id]
                      );
                    }}
                    className={`w-full px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                      followedUpcyclers.includes(upcycler.id)
                        ? 'bg-green-600 text-white'
                        : `${ds.pillIdle}`
                    }`}
                  >
                    {followedUpcyclers.includes(upcycler.id) ? 'Following ✓' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main Feed Grid ────────────────────────────────────────────────── */}
        <div>
          <h2 className={`text-2xl font-bold ${ds.textPrimary} mb-6`}>Just For You</h2>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
            {feedItemsWithScores.map((item) => (
              <FeedCard key={item.id} item={item} onQuickView={setQuickViewItem} onLike={() => {}} />
            ))}
          </div>
        </div>

        {/* ── Style Boards ──────────────────────────────────────────────────── */}
        <div>
          <div className="mb-6">
            <h2 className={`text-2xl font-bold ${ds.textPrimary}`}>✨ Style Boards You Might Like</h2>
            <p className={ds.textSecondary}>Curated collections from the community</p>
          </div>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-full">
              {MOCK_BOARDS.map((board) => (
                <div
                  key={board.id}
                  className={`flex-shrink-0 w-48 ${cardCls} overflow-hidden hover:shadow-md transition-shadow`}
                >
                  <div className="grid grid-cols-2 gap-1 aspect-square overflow-hidden">
                    {board.images.slice(0, 4).map((img, idx) => (
                      <img
                        key={idx}
                        src={`https://picsum.photos/seed/${img}/100/100`}
                        alt="board"
                        className="w-full h-full object-cover"
                      />
                    ))}
                  </div>
                  <div className="p-4 space-y-2">
                    <p className={`font-semibold ${ds.textPrimary} text-sm`}>{board.name}</p>
                    <p className={`text-xs ${ds.textMuted}`}>{board.creator} · {board.items} items</p>
                    <button
                      onClick={() => navigate('/marketplace')}
                      className="w-full px-3 py-2 rounded-lg bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 font-medium text-sm hover:bg-green-200 dark:hover:bg-green-900/60 transition-colors"
                    >
                      Follow Board
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Swap Meet ─────────────────────────────────────────────────────── */}
        <div>
          <div className="mb-6">
            <h2 className={`text-2xl font-bold ${ds.textPrimary}`}>📍 Swap Meet Near You</h2>
            <p className={ds.textSecondary}>In-person swaps in Cairo · No shipping needed</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_SWAPS.map((swap) => (
              <div key={swap.id} className={`${cardCls} p-6 hover:shadow-md transition-shadow space-y-4`}>
                <div className="text-3xl">📍</div>
                <div className="space-y-2">
                  <p className={`font-semibold ${ds.textPrimary} text-lg`}>{swap.location}</p>
                  <p className={`text-sm ${ds.textSecondary}`}>{swap.date}</p>
                  <p className={`text-sm ${ds.textSecondary}`}>{swap.items} items listed</p>
                  <p className={`text-sm ${ds.textSecondary}`}>{swap.swappers} swappers</p>
                </div>
                <button
                  onClick={() => navigate('/swap-requests')}
                  className="w-full px-4 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                >
                  Join Swap Meet
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StyleFeed;