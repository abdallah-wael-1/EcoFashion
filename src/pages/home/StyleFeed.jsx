import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import SectionTitle from '../../components/common/SectionTitle';
import { Heart, ArrowRight, TrendingUp, Leaf, Target, Repeat2, Sparkles, Users, Eye, Plus, X } from '../../utils/icons';

// ─── Design System ────────────────────────────────────────────────────────────
const ds = {
  pageBg:        'bg-gray-100 dark:bg-gray-900',
  cardBg:        'bg-gray-50  dark:bg-gray-800',
  modalBg:       'bg-white dark:bg-gray-900',
  textPrimary:   'text-gray-900 dark:text-gray-100',
  textSecondary: 'text-gray-600 dark:text-gray-400',
  textMuted:     'text-gray-500 dark:text-gray-500',
  border:        'border-gray-300 dark:border-gray-700',
  borderLight:   'border-gray-200 dark:border-gray-700',
  surfaceHover:  'hover:bg-gray-100 dark:hover:bg-gray-700',
  surfaceBase:   'bg-gray-200 dark:bg-gray-700',
  inputBg:       'bg-white dark:bg-gray-800',
  pillIdle:      'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
};

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
];

const MOCK_BOARDS = [
  { id: 1, name: 'Summer Upcycle Inspo 🌿', creator: '@EcoCreations',    items: 42, images: ['1','2','3','4']   },
  { id: 2, name: 'Streetwear Remix 🔥',     creator: '@DenimHead',        items: 38, images: ['7','11','6','9']  },
  { id: 3, name: 'Vintage Gems 💎',         creator: '@VintageVibes',     items: 56, images: ['3','8','15','1']  },
  { id: 4, name: 'Minimal Wardrobe ✨',     creator: '@SustainableStyle', items: 29, images: ['4','10','14','13']},
  { id: 5, name: 'Y2K Revival 💕',          creator: '@SkirtCreator',     items: 67, images: ['6','12','9','2']  },
];

const MOCK_SWAPS = [
  { id: 1, location: 'Cairo, Maadi',      date: 'Sat 25 Jan', items: 12, swappers: 8  },
  { id: 2, location: 'Cairo, Downtown',   date: 'Sun 26 Jan', items: 18, swappers: 12 },
  { id: 3, location: 'Cairo, Heliopolis', date: 'Sat 25 Jan', items: 9,  swappers: 6  },
];

// ─── Confirm Delete Mini-Modal ────────────────────────────────────────────────
const ConfirmDeleteModal = ({ isOpen, label, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      onClick={onCancel}
    >
      {/* Soft backdrop — doesn't black out the page, just dims slightly */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <div
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl px-6 py-5 w-72 border border-gray-100 dark:border-gray-700"
        style={{ animation: 'miniModalIn 0.18s cubic-bezier(0.34,1.56,0.64,1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
            <span className="text-base">🗑</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">Remove preference?</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Remove <span className="font-semibold text-gray-700 dark:text-gray-300">"{label}"</span> from your feed filters
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
          >
            Keep it
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-xl text-xs font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors cursor-pointer"
          >
            Remove
          </button>
        </div>
      </div>
      <style>{`
        @keyframes miniModalIn {
          from { opacity:0; transform: scale(0.85) translateY(6px); }
          to   { opacity:1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </div>
  );
};

// ─── Preferences Modal (redesigned) ──────────────────────────────────────────
const STEPS = [
  { key: 'sizes',            label: 'Size',       icon: '👗', desc: 'Find items that fit perfectly'        },
  { key: 'aesthetics',       label: 'Aesthetic',  icon: '✨', desc: 'Styles that speak to you'             },
  { key: 'upcycleIntensity', label: 'Upcycle',    icon: '♻️', desc: 'How eco-forward do you want to go?'  },
  { key: 'budget',           label: 'Budget',     icon: '💰', desc: 'Your max spend per item'              },
  { key: 'materials',        label: 'Materials',  icon: '🧵', desc: 'Preferred fabrics'                   },
];

const SIZES      = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const AESTHETICS = ['Vintage', 'Streetwear', 'Minimal', 'Boho', 'Y2K', 'Cottagecore', 'Formal', 'Casual'];
const MATERIALS  = ['Cotton', 'Linen', 'Denim', 'Silk', 'Wool', 'Cashmere', 'Recycled', 'Canvas'];

const defaultPrefs = { sizes: ['M'], aesthetics: ['Vintage'], upcycleIntensity: 3, budget: 500, materials: ['Cotton', 'Denim'] };

const PreferencesModal = ({ isOpen, onClose, onSave, initialPreferences }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [prefs, setPrefs] = useState(initialPreferences || defaultPrefs);

  useEffect(() => {
    if (initialPreferences) setPrefs(initialPreferences);
  }, [initialPreferences, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const toggle = (field, value) => {
    const current = prefs[field] || [];
    setPrefs(p => ({
      ...p,
      [field]: current.includes(value) ? current.filter(v => v !== value) : [...current, value],
    }));
  };

  const handleSave = () => {
    localStorage.setItem('ecofashion-preferences', JSON.stringify(prefs));
    onSave(prefs);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ animation: 'backdropIn 0.2s ease' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      <div
        className="relative bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-gray-100 dark:border-gray-800"
        style={{ animation: 'modalSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="px-8 pt-7 pb-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tune Your Feed</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Personalize what you see</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Step tabs ── */}
        <div className="px-8 py-4 flex gap-2 overflow-x-auto border-b border-gray-100 dark:border-gray-800">
          {STEPS.map((step, i) => (
            <button
              key={step.key}
              onClick={() => setActiveStep(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0 ${
                activeStep === i
                  ? 'bg-green-600 text-white shadow-md shadow-green-200 dark:shadow-green-950'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span>{step.icon}</span>
              <span>{step.label}</span>
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto px-8 py-7">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{STEPS[activeStep].desc}</p>

          {/* Sizes */}
          {activeStep === 0 && (
            <div className="space-y-6">
              {['Tops', 'Bottoms', 'Shoes'].map(type => (
                <div key={type}>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">{type}</p>
                  <div className="grid grid-cols-6 gap-2">
                    {SIZES.map(size => {
                      const active = prefs.sizes?.includes(size);
                      return (
                        <button
                          key={size}
                          onClick={() => toggle('sizes', size)}
                          className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                            active
                              ? 'bg-green-600 text-white shadow-md shadow-green-100 dark:shadow-green-950 scale-105'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Aesthetics */}
          {activeStep === 1 && (
            <div className="flex flex-wrap gap-2.5">
              {AESTHETICS.map(aes => {
                const active = (prefs.aesthetics || []).includes(aes);
                return (
                  <button
                    key={aes}
                    onClick={() => toggle('aesthetics', aes)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-150 cursor-pointer ${
                      active
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md shadow-green-100 dark:shadow-green-950 scale-105'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {aes}
                  </button>
                );
              })}
            </div>
          )}

          {/* Upcycle Intensity */}
          {activeStep === 2 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="range" min="1" max="5"
                    value={prefs.upcycleIntensity || 3}
                    onChange={(e) => setPrefs(p => ({ ...p, upcycleIntensity: +e.target.value }))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between mt-2 px-0.5">
                    {['Any', '', 'Mix', '', 'Only eco'].map((l, i) => (
                      <span key={i} className="text-xs text-gray-400 dark:text-gray-600">{l}</span>
                    ))}
                  </div>
                </div>

                {/* Visual indicator */}
                <div className="flex justify-center gap-2 py-4">
                  {[1,2,3,4,5].map(i => (
                    <div
                      key={i}
                      className={`transition-all duration-200 ${
                        i <= (prefs.upcycleIntensity || 3)
                          ? 'text-2xl scale-110'
                          : 'text-xl opacity-25 grayscale'
                      }`}
                    >🌱</div>
                  ))}
                </div>

                <div className="rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900 p-4 text-center">
                  <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                    {prefs.upcycleIntensity === 5 ? '🌿 Only heavily upcycled pieces!'
                     : prefs.upcycleIntensity === 4 ? '🌿 Mostly upcycled'
                     : prefs.upcycleIntensity === 3 ? '🌱 Good mix of regular and upcycled'
                     : prefs.upcycleIntensity === 2 ? '🌱 Mostly regular, some upcycled'
                     : '🌱 Any item works for me'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Budget */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="text-center py-4">
                <p className="text-5xl font-bold text-green-600 dark:text-green-400">
                  EGP {(prefs.budget || 500).toLocaleString()}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">maximum per item</p>
              </div>
              <input
                type="range" min="0" max="2000" step="50"
                value={prefs.budget || 500}
                onChange={(e) => setPrefs(p => ({ ...p, budget: +e.target.value }))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-600 px-0.5">
                <span>EGP 0</span>
                <span>EGP 2,000</span>
              </div>

              {/* Budget range presets */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {[200, 500, 1000, 2000].map(b => (
                  <button
                    key={b}
                    onClick={() => setPrefs(p => ({ ...p, budget: b }))}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                      prefs.budget === b
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    EGP {b.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Materials */}
          {activeStep === 4 && (
            <div className="grid grid-cols-2 gap-3">
              {MATERIALS.map(mat => {
                const active = (prefs.materials || []).includes(mat);
                return (
                  <button
                    key={mat}
                    onClick={() => toggle('materials', mat)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-150 cursor-pointer ${
                      active
                        ? 'border-green-500 bg-green-50 dark:bg-green-950/30 dark:border-green-600'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      active ? 'bg-green-600 border-green-600' : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {active && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm font-semibold ${active ? 'text-green-800 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      {mat}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4 bg-white dark:bg-gray-900">
          {/* Step dots */}
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`rounded-full transition-all duration-200 cursor-pointer ${
                  i === activeStep ? 'w-5 h-2 bg-green-600' : 'w-2 h-2 bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            {activeStep < STEPS.length - 1 ? (
              <button
                onClick={() => setActiveStep(s => s + 1)}
                className="px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white text-sm font-bold shadow-lg shadow-green-100 dark:shadow-green-950 hover:from-green-700 hover:to-emerald-600 transition-all cursor-pointer"
              >
                Save & Apply ✓
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes backdropIn { from { opacity:0; } to { opacity:1; } }
        @keyframes modalSlideIn {
          from { opacity:0; transform: scale(0.95) translateY(12px); }
          to   { opacity:1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </div>
  );
};

// ─── Quick View Modal ─────────────────────────────────────────────────────────
const QuickViewModal = ({ item, isOpen, onClose, onAddToCart, onGoSwap, onGoDetails }) => {
  if (!isOpen || !item) return null;
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className={`${ds.modalBg} rounded-2xl max-w-2xl w-full my-8`} onClick={(e) => e.stopPropagation()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="flex flex-col gap-3">
            <img src={item.images[0]} alt={item.name} className="w-full rounded-xl object-cover h-96" />
            {item.isUpcycled && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-full text-sm font-semibold w-fit">
                <span>♻</span><span>Upcycled</span>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <h2 className={`text-3xl font-bold ${ds.textPrimary} mb-2`}>{item.name}</h2>
              <div className={`flex items-center gap-2 text-sm ${ds.textSecondary}`}>
                <img src={item.seller.avatar} alt={item.seller.name} className="h-6 w-6 rounded-full" />
                <span>{item.seller.name}</span>
                <span>⭐ {item.seller.trustScore}%</span>
              </div>
            </div>
            <div className="flex items-baseline gap-4 text-2xl">
              <span className={`font-bold ${ds.textPrimary}`}>EGP {item.price}</span>
              {item.ecoCredits > 0 && <span className="text-lg text-green-600 dark:text-green-400 font-semibold">+{item.ecoCredits} 🌱</span>}
            </div>
            <div className={`grid grid-cols-3 gap-4 py-4 border-y ${ds.borderLight}`}>
              {[{ label: 'Size', value: item.size }, { label: 'Material', value: item.material }, { label: 'Condition', value: item.condition }].map(({ label, value }) => (
                <div key={label}>
                  <p className={`text-xs ${ds.textMuted} font-medium`}>{label}</p>
                  <p className={`text-sm font-semibold ${ds.textPrimary}`}>{value}</p>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
              <p className="text-sm font-medium text-green-800 dark:text-green-300">♻ Buying this saves <strong>6.2kg CO₂</strong> vs buying new</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => onAddToCart(item)} className="flex-1 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors cursor-pointer">Add to Cart</button>
              {item.isSwappable && (
                <button onClick={onGoSwap} className="flex-1 px-6 py-3 rounded-lg border-2 border-green-600 text-green-600 dark:text-green-400 font-semibold hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors cursor-pointer">Request Swap</button>
              )}
            </div>
            <button onClick={onGoDetails} className={`w-full px-6 py-2 rounded-lg border ${ds.border} ${ds.textSecondary} font-semibold ${ds.surfaceHover} transition-colors cursor-pointer`}>View Full Listing</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Smart Feed Card (Enhanced) ────────────────────────────────────────────────────────
const SmartFeedCard = ({ item, onQuickView, onAddToCart, onRequestSwap }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Generate AI-style explanation
  const getMatchExplanation = (item) => {
    const reasons = [];
    if (item.matchScore >= 80) reasons.push("Perfect aesthetic match");
    else if (item.matchScore >= 60) reasons.push("Fits your style");
    else reasons.push("Similar to your taste");
    
    if (item.isUpcycled) reasons.push("Eco-friendly choice");
    if (item.price <= 200) reasons.push("Within your budget");
    if (item.size === 'M' || item.size === 'S') reasons.push("Your preferred size");
    
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  return (
    <div
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 ${isHovered ? 'ring-2 ring-green-500/20' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onQuickView(item)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
        <img 
          src={item.images[0]} 
          alt={item.name} 
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`} 
        />
        
        {/* Eco Badge */}
        {item.isUpcycled && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1.5 bg-green-500/90 backdrop-blur-sm text-white rounded-full text-xs font-bold shadow-lg">
            <Leaf size={12} />
            <span>Eco</span>
          </div>
        )}
        
        {/* Quick Actions (appear on hover) */}
        {isHovered && (
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <Heart size={16} className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onQuickView(item); }}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <Eye size={16} className="text-gray-600" />
            </button>
          </div>
        )}
        
        {/* Match Score Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Target size={14} />
              <span className="text-sm font-bold">{item.matchScore}% Match</span>
            </div>
            <div className="text-xs opacity-80">{getMatchExplanation(item)}</div>
          </div>
          <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-700" 
              style={{ width: `${item.matchScore}%` }} 
            />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title & Price */}
        <div className="space-y-1">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
            {item.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white">EGP {item.price}</span>
              {item.ecoCredits > 0 && (
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">+{item.ecoCredits} 🌱</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <span>{item.likes}</span>
              <Heart size={12} className={isLiked ? 'fill-red-500 text-red-500' : ''} />
            </div>
          </div>
        </div>
        
        {/* Why this item explanation */}
        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-xs font-medium text-green-800 dark:text-green-300">
            ✨ {getMatchExplanation(item)}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
            className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
          >
            <span>View</span>
            <ArrowRight size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Heart size={14} className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
          </button>
          {item.isSwappable && (
            <button
              onClick={(e) => { e.stopPropagation(); onRequestSwap(item); }}
              className="px-3 py-2 border-2 border-green-600 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
            >
              <Repeat2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Personalized Header Component ────────────────────────────────────────────────────────
const PersonalizedHeader = ({ user, preferences, onOpenPrefs }) => {
  const getPersonalizedMessage = () => {
    if (!preferences) return "Let's build your style";
    
    const messages = [
      `Picked for you, ${user?.name?.split(' ')[0]} 👀`,
      `Your vibe today: ${preferences.aesthetics?.join(' x ') || 'Unique'} 🌿`,
      `Based on your taste in ${preferences.materials?.slice(0, 2).join(' & ') || 'Fashion'}`,
      `Curated for your ${preferences.aesthetics?.[0] || 'style'} aesthetic ✨`
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          {getPersonalizedMessage()}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {preferences 
            ? `${preferences.aesthetics?.length || 0} styles • ${preferences.sizes?.length || 0} sizes • Budget: EGP ${preferences.budget || 500}`
            : "Personalize your feed to see items that match your style"
          }
        </p>
      </div>
      
      {!preferences && (
        <button
          onClick={onOpenPrefs}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Sparkles size={18} />
          <span>Let's build your style</span>
        </button>
      )}
      
      {preferences && (
        <div className="flex flex-wrap justify-center gap-2">
          {preferences.aesthetics?.slice(0, 3).map(aes => (
            <span key={aes} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-semibold">
              {aes}
            </span>
          ))}
          <button
            onClick={onOpenPrefs}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-full text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Edit preferences
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Story Layer Component ────────────────────────────────────────────────────────────────
const StoryLayer = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Discover</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {/* Top Upcyclers */}
        <div className="flex-shrink-0 space-y-2">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Top Upcyclers</div>
          <div className="flex gap-3">
            {MOCK_UPCYCLERS.slice(0, 4).map(upcycler => (
              <div key={upcycler.id} className="text-center space-y-1 cursor-pointer group">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-green-500 transition-all">
                  <img src={upcycler.avatar} alt={upcycler.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate w-16">{upcycler.name.split(' ')[0]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Style Boards */}
        <div className="flex-shrink-0 space-y-2">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Style Boards</div>
          <div className="flex gap-3">
            {MOCK_BOARDS.slice(0, 3).map(board => (
              <div key={board.id} className="w-20 space-y-1 cursor-pointer group">
                <div className="grid grid-cols-2 gap-0.5 rounded-lg overflow-hidden group-hover:ring-2 ring-green-500 transition-all">
                  {board.images.slice(0, 4).map((img, i) => (
                    <div key={i} className="w-5 h-5 bg-gray-200 dark:bg-gray-700" />
                  ))}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate w-20">{board.name.split(' ')[0]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Inspired by your taste */}
        <div className="flex-shrink-0 space-y-2">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Inspired by you</div>
          <div className="flex gap-2">
            {['Vintage', 'Minimal', 'Eco'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer hover:scale-105 transition-transform">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Smart Feed Section Component ────────────────────────────────────────────────────────
const SmartFeedSection = ({ title, subtitle, icon: IconComponent, items, onQuickView, onAddToCart, onRequestSwap }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
          <IconComponent size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.slice(0, 8).map(item => (
          <SmartFeedCard
            key={item.id}
            item={item}
            onQuickView={onQuickView}
            onAddToCart={onAddToCart}
            onRequestSwap={onRequestSwap}
          />
        ))}
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
  const [showPrefsModal, setShowPrefsModal]   = useState(false);
  const [quickViewItem, setQuickViewItem]     = useState(null);
  const [followedUpcyclers, setFollowedUpcyclers] = useState([]);

  // Confirm-delete state
  const [confirmDelete, setConfirmDelete] = useState(null); // { field, value, label }

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(
    () => localStorage.getItem('hasCompletedOnboarding') === 'true'
  );
  const [onboardingStep, setOnboardingStep] = useState(hasCompletedOnboarding ? 0 : 1);

  // ── Apply prefs save from modal immediately to page tags ──
  const handlePrefsSave = (prefs) => {
    setPreferences(prefs);
    localStorage.setItem('ecofashion-preferences', JSON.stringify(prefs));
  };

  // ── Tag removal with confirm ──
  const requestRemoveTag = (field, value, label) => {
    setConfirmDelete({ field, value, label });
  };

  const confirmRemoveTag = () => {
    if (!confirmDelete) return;
    const { field, value } = confirmDelete;
    setPreferences(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        [field]: Array.isArray(prev[field])
          ? prev[field].filter(v => v !== value)
          : prev[field],
      };
      localStorage.setItem('ecofashion-preferences', JSON.stringify(updated));
      return updated;
    });
    setConfirmDelete(null);
  };

  const feedItemsWithScores = useMemo(() => {
    if (!preferences) return MOCK_FEED_ITEMS;
    return MOCK_FEED_ITEMS.map((item) => {
      let score = 0;
      if (preferences.sizes?.includes(item.size))                   score += 30;
      if (preferences.aesthetics?.includes(item.aesthetic))         score += 25;
      if (item.price <= (preferences.budget || 500))                score += 20;
      if (item.upcycleLevel >= (preferences.upcycleIntensity || 1)) score += 15;
      if (preferences.materials?.includes(item.material))           score += 10;
      return { ...item, matchScore: Math.min(score + ((item.id % 3) + 1), 99) };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [preferences]);

  // ── Unauthenticated ──────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="relative">
          <div className="absolute inset-0 blur-sm opacity-20 pointer-events-none">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-8 max-w-6xl">
              {MOCK_FEED_ITEMS.slice(0, 8).map((item) => (
                <div key={item.id} className={`${ds.cardBg} rounded-lg h-64`} />
              ))}
            </div>
          </div>
          <div className={`${ds.cardBg} rounded-3xl shadow-2xl p-8 max-w-md mx-auto relative z-10 text-center space-y-6`}>
            <div className="text-sm text-left space-y-1.5">
              <SectionTitle title="Your Personal Style Feed" subtitle="Sign in to unlock your personalized feed" />
              {['Items matched to your size', 'Your aesthetic preferences', 'EcoCredits tracking', 'Swap recommendations'].map(feat => (
                <div key={feat} className="flex items-center gap-2"><span>✓</span><span>{feat}</span></div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate('/login')} className="flex-1 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors cursor-pointer">Sign In</button>
              <button onClick={() => navigate('/register')} className="flex-1 px-6 py-3 rounded-lg border-2 border-green-600 text-green-600 dark:text-green-400 font-semibold hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors cursor-pointer">Create Account</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Onboarding ───────────────────────────────────────────────────────────
  if (onboardingStep > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className={`${ds.cardBg} rounded-3xl shadow-2xl p-8 max-w-md w-full space-y-8`}>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h1 className={`text-2xl font-bold ${ds.textPrimary}`}>Set Up Your Feed</h1>
              <span className={`text-sm font-medium ${ds.textMuted}`}>Step {onboardingStep} of 4</span>
            </div>
            <div className="flex gap-2">
              {[1,2,3,4].map(step => (
                <div key={step} className={`h-2 flex-1 rounded-full ${step <= onboardingStep ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
              ))}
            </div>
          </div>

          {onboardingStep === 1 && (
            <div className="space-y-4">
              <div><h2 className={`text-xl font-bold ${ds.textPrimary} mb-2`}>What's your size?</h2><p className={`text-sm ${ds.textSecondary}`}>This helps us find items that fit you</p></div>
              <div className="grid grid-cols-3 gap-2">
                {SIZES.map(size => (
                  <button key={size} onClick={() => { setPreferences({ ...preferences, sizes: [size] }); setOnboardingStep(2); }}
                    className={`px-4 py-2 rounded-lg ${ds.pillIdle} font-medium transition-colors cursor-pointer`}>{size}</button>
                ))}
              </div>
            </div>
          )}
          {onboardingStep === 2 && (
            <div className="space-y-4">
              <div><h2 className={`text-xl font-bold ${ds.textPrimary} mb-2`}>Your aesthetic?</h2><p className={`text-sm ${ds.textSecondary}`}>Select what speaks to your style</p></div>
              <div className="flex flex-wrap gap-2">
                {AESTHETICS.map(aes => {
                  const selected = (preferences?.aesthetics || []).includes(aes);
                  return (
                    <button key={aes} onClick={() => { const c = preferences?.aesthetics || []; setPreferences({ ...preferences, aesthetics: c.includes(aes) ? c.filter(a => a !== aes) : [...c, aes] }); }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${selected ? 'bg-green-600 text-white' : ds.pillIdle}`}>{aes}</button>
                  );
                })}
              </div>
            </div>
          )}
          {onboardingStep === 3 && (
            <div className="space-y-4">
              <div><h2 className={`text-xl font-bold ${ds.textPrimary} mb-2`}>Upcycle intensity?</h2><p className={`text-sm ${ds.textSecondary}`}>How much do you love upcycled pieces?</p></div>
              <input type="range" min="1" max="5" value={preferences?.upcycleIntensity || 3} onChange={(e) => setPreferences({ ...preferences, upcycleIntensity: +e.target.value })} className="w-full" />
              <div className="flex justify-center gap-1">
                {[1,2,3,4,5].map(i => <span key={i} className={`text-2xl ${i <= (preferences?.upcycleIntensity || 3) ? '' : 'opacity-30'}`}>🌱</span>)}
              </div>
            </div>
          )}
          {onboardingStep === 4 && (
            <div className="space-y-4">
              <div><h2 className={`text-xl font-bold ${ds.textPrimary} mb-2`}>Budget range?</h2><p className={`text-sm ${ds.textSecondary}`}>Max you'd spend on an item</p></div>
              <input type="range" min="0" max="2000" value={preferences?.budget || 500} onChange={(e) => setPreferences({ ...preferences, budget: +e.target.value })} className="w-full" />
              <p className="text-center text-2xl font-bold text-green-600 dark:text-green-400">Up to EGP {preferences?.budget || 500}</p>
            </div>
          )}

          <div className="flex gap-3">
            {onboardingStep > 1 && (
              <button onClick={() => setOnboardingStep(onboardingStep - 1)} className={`flex-1 px-6 py-3 rounded-lg border ${ds.border} ${ds.textSecondary} font-semibold ${ds.surfaceHover} transition-colors cursor-pointer`}>Back</button>
            )}
            <button
              onClick={() => {
                if (onboardingStep === 4) {
                  localStorage.setItem('ecofashion-preferences', JSON.stringify(preferences));
                  localStorage.setItem('hasCompletedOnboarding', 'true');
                  setHasCompletedOnboarding(true);
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
          <button onClick={() => setOnboardingStep(0)} className={`w-full text-center text-sm ${ds.textMuted} transition-colors cursor-pointer`}>Skip for now</button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ─── Personalized Header Component ──────────────────────────────────────────────────────────────── */}
      <PersonalizedHeader 
        user={user} 
        preferences={preferences} 
        onOpenPrefs={() => setShowPrefsModal(true)} 
      />
      {/* ─── Story Layer Component ──────────────────────────────────────────────────────────────── */}
      <StoryLayer />
      {/* ─── Smart Feed Section Component ──────────────────────────────────────────────────────── */}
      <SmartFeedSection 
        title="Your Feed" 
        subtitle="Based on your style preferences" 
        icon={Heart} 
        items={feedItemsWithScores} 
        onQuickView={setQuickViewItem} 
        onAddToCart={addToCart} 
        onRequestSwap={() => navigate('/swap-requests')} 
        onSave={handlePrefsSave}
        initialPreferences={preferences}
      />
      <QuickViewModal
        item={quickViewItem}
        isOpen={!!quickViewItem}
        onClose={() => setQuickViewItem(null)}
        onAddToCart={(item) => addToCart(item)}
        onGoSwap={() => navigate('/swap-requests')}
        onGoDetails={() => navigate(`/product/${quickViewItem.id}`)}
      />
      <ConfirmDeleteModal
        isOpen={!!confirmDelete}
        label={confirmDelete?.label}
        onConfirm={confirmRemoveTag}
        onCancel={() => setConfirmDelete(null)}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-12">

        {/* ── Personalized Header ── */}
        <PersonalizedHeader 
          user={user} 
          preferences={preferences} 
          onOpenPrefs={() => setShowPrefsModal(true)} 
        />

        {/* ── Story Layer ── */}
        <StoryLayer />

        {/* ── Smart Feed Sections ── */}
        
        {/* Trending Now */}
        <SmartFeedSection
          title="🔥 Trending Now"
          subtitle="What's hot in the EcoFashion community right now"
          icon={TrendingUp}
          items={feedItemsWithScores.filter(item => item.likes > 300)}
          onQuickView={setQuickViewItem}
          onAddToCart={addToCart}
          onRequestSwap={() => navigate('/swap-requests')}
        />

        {/* Best for the Planet */}
        <SmartFeedSection
          title="🌱 Best for the Planet"
          subtitle="High EcoCredits items that make a real difference"
          icon={Leaf}
          items={feedItemsWithScores.filter(item => item.ecoCredits > 20)}
          onQuickView={setQuickViewItem}
          onAddToCart={addToCart}
          onRequestSwap={() => navigate('/swap-requests')}
        />

        {/* Perfect Matches */}
        {preferences && (
          <SmartFeedSection
            title="🎯 Perfect Matches"
            subtitle="Items that match your preferences perfectly"
            icon={Target}
            items={feedItemsWithScores.filter(item => item.matchScore >= 70)}
            onQuickView={setQuickViewItem}
            onAddToCart={addToCart}
            onRequestSwap={() => navigate('/swap-requests')}
          />
        )}

        {/* Swap Picks */}
        <SmartFeedSection
          title="🔄 Swap Picks"
          subtitle="Items available for swapping in your area"
          icon={Repeat2}
          items={feedItemsWithScores.filter(item => item.isSwappable)}
          onQuickView={setQuickViewItem}
          onAddToCart={addToCart}
          onRequestSwap={() => navigate('/swap-requests')}
        />

      </div>
    </>
  );
};

export default StyleFeed;