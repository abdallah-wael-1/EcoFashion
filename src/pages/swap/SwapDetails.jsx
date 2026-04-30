import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
// Mock swap data — in production, receive via route state or props
const MOCK_SWAP = {
  id: 1,
  from: 'EcoCreations',
  avatar: 'EC',
  avatarColor: 'bg-emerald-500',
  trustScore: 4.8,
  reviews: 34,
  memberSince: 'Mar 2023',
  location: 'Cairo, EG',
  itemOffered: {
    name: 'Upcycled Denim Jacket',
    image: '🧥',
    condition: 'Like New',
    ecoValue: 85,
    size: 'M',
    brand: 'Self-made',
    material: 'Recycled Denim',
    description: 'Hand-crafted from reclaimed denim jeans. Custom patches and reinforced stitching. One-of-a-kind piece with zero factory impact.',
    tags: ['Upcycled', 'Handmade', 'Denim', 'Outerwear'],
  },
  itemRequested: {
    name: 'Vintage Silk Dress',
    image: '👗',
    condition: 'Good',
    ecoValue: 70,
    size: 'S',
    brand: 'Unknown Vintage',
    material: '100% Silk',
    description: 'A classic 1980s wrap-style silk dress in ivory. Minor wear at hem. Dry-clean only. Perfect for sustainable fashion collectors.',
    tags: ['Vintage', 'Silk', 'Dress', '80s'],
  },
  timeAgo: '2h ago',
  message: 'Hi! I love your vintage silk dress and think my upcycled jacket would be a great match for you. I\'m open to negotiation if needed!',
};

const CONDITION_COLOR = {
  'New': 'text-emerald-600 dark:text-emerald-400',
  'Like New': 'text-emerald-500 dark:text-emerald-400',
  'Excellent': 'text-blue-600 dark:text-blue-400',
  'Good': 'text-amber-600 dark:text-amber-400',
  'Fair': 'text-orange-600 dark:text-orange-400',
};

const ItemCard = ({ item, label, side }) => {
  const borderColor = side === 'offered'
    ? 'border-emerald-200 dark:border-emerald-800'
    : 'border-violet-200 dark:border-violet-800';
  const headerBg = side === 'offered'
    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
    : 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300';

  return (
    <div className={`bg-white dark:bg-gray-900 border-2 ${borderColor} rounded-2xl overflow-hidden shadow-sm flex flex-col`}>
      {/* Label */}
      <div className={`px-4 py-2 text-xs font-bold uppercase tracking-widest ${headerBg}`}>
        {label}
      </div>

      {/* Image Area */}
      <div className="bg-gray-50 dark:bg-gray-800 flex items-center justify-center h-44 text-7xl select-none">
        {item.image}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{item.brand} · Size {item.size}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2.5 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Condition</p>
            <p className={`text-sm font-bold ${CONDITION_COLOR[item.condition] ?? 'text-gray-600 dark:text-gray-300'}`}>
              {item.condition}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2.5 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Material</p>
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{item.material}</p>
          </div>
        </div>

        {/* Eco Value */}
        <div className={`rounded-xl p-3 flex items-center justify-between ${
          side === 'offered'
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800'
            : 'bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800'
        }`}>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Eco Value</span>
          <span className={`text-lg font-black ${side === 'offered' ? 'text-emerald-700 dark:text-emerald-400' : 'text-violet-700 dark:text-violet-400'}`}>
            {item.ecoValue} 🌿
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const BalanceIndicator = ({ offeredValue, requestedValue }) => {
  const diff = offeredValue - requestedValue;
  const isFair = Math.abs(diff) <= 10;
  const offererOwes = diff < 0; // offered < requested → offerer owes more

  const percentage = Math.min(Math.abs(diff) / Math.max(offeredValue, requestedValue) * 100, 100);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
        Swap Balance
      </h3>

      {/* Visual Bar */}
      <div className="relative mb-5">
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-1.5">
          <span>Their Offer · {offeredValue} 🌿</span>
          <span>Your Item · {requestedValue} 🌿</span>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${(offeredValue / (offeredValue + requestedValue)) * 100}%` }}
          />
          <div
            className="h-full bg-violet-500 rounded-full transition-all duration-500"
            style={{ width: `${(requestedValue / (offeredValue + requestedValue)) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs font-bold mt-1">
          <span className="text-emerald-600 dark:text-emerald-400">{offeredValue} pts</span>
          <span className="text-violet-600 dark:text-violet-400">{requestedValue} pts</span>
        </div>
      </div>

      {/* Verdict */}
      {isFair ? (
        <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl p-4">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-bold text-emerald-700 dark:text-emerald-400">Fair Swap!</p>
            <p className="text-sm text-emerald-600/70 dark:text-emerald-500">Both items have similar eco value. Great trade!</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl p-4">
          <span className="text-2xl">⚖️</span>
          <div>
            <p className="font-bold text-amber-700 dark:text-amber-400">
              {offererOwes ? 'Their item is worth less' : 'Their item is worth more'}
            </p>
            <p className="text-sm text-amber-600/70 dark:text-amber-500">
              Gap of <strong>{Math.abs(diff)} EcoCredits</strong>.{' '}
              {offererOwes
                ? 'You could request a top-up or counter-offer.'
                : 'Consider offering EcoCredits to balance the swap.'}
            </p>
          </div>
        </div>
      )}

      {/* Top-up suggestion */}
      {!isFair && (
        <div className="mt-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-dashed border-gray-300 dark:border-gray-600">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Suggested Cash Top-up</p>
            <p className="text-lg font-black text-gray-800 dark:text-white">
              ${(Math.abs(diff) * 0.5).toFixed(2)}
              <span className="text-xs font-normal text-gray-400 ml-1">or {Math.abs(diff)} EcoCredits</span>
            </p>
          </div>
          <button className="text-xs font-bold px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-80 transition-opacity cursor-pointer">
            Add to Offer
          </button>
        </div>
      )}
    </div>
  );
};

export default function SwapDetails({ swap: propSwap, onBack }) {
  const { addTransaction, addNotification } = useAppContext();
  const swap = propSwap ?? MOCK_SWAP;
  const [action, setAction] = useState(null); // null | 'accepted' | 'declined' | 'countering'
  const [counterNote, setCounterNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCounter = () => {
    if (!counterNote.trim()) return;
    setSubmitted(true);
    setTimeout(() => setAction('countered'), 600);
  };

  const handleAcceptSwap = () => {
    setAction('accepted');
    
    // Add wallet transaction for completed swap
    const transaction = addTransaction({
      type: 'credit',
      amount: 0, // No money for swaps
      title: `Swap completed: ${swap.itemOffered.name} for ${swap.itemRequested.name}`
    });

    // Add notification
    addNotification({
      title: 'Swap completed!',
      message: `Successfully swapped ${swap.itemOffered.name} for ${swap.itemRequested.name}`,
      type: 'swap',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Back + Header */}
        <div className="mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors cursor-pointer"
            >
              ← Back to Requests
            </button>
          )}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Swap Details</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Review the proposed item exchange carefully</p>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">{swap.timeAgo}</span>
          </div>
        </div>

        {/* Proposer Info */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 mb-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${swap.avatarColor} flex items-center justify-center text-white font-bold text-sm`}>
              {swap.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 dark:text-white text-lg">{swap.from}</span>
                <span className="text-amber-500 text-sm font-semibold">★ {swap.trustScore}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">({swap.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                <span>📍 {swap.location}</span>
                <span>· Member since {swap.memberSince}</span>
              </div>
            </div>
          </div>
          <button className="text-sm font-medium px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
            View Profile
          </button>
        </div>

        {/* Message */}
        {swap.message && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 mb-6 shadow-sm">
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-2">Their Message</p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">"{swap.message}"</p>
          </div>
        )}

        {/* Items Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <ItemCard item={swap.itemOffered} label="🟢 They Offer" side="offered" />
          <ItemCard item={swap.itemRequested} label="🟣 They Want" side="requested" />
        </div>

        {/* Balance */}
        <div className="mb-6">
          <BalanceIndicator
            offeredValue={swap.itemOffered.ecoValue}
            requestedValue={swap.itemRequested.ecoValue}
          />
        </div>

        {/* Actions */}
        {!action && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Your Response</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAcceptSwap}
                className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all duration-200 shadow-sm hover:shadow-emerald-200 dark:hover:shadow-none cursor-pointer"
              >
                ✓ Accept Swap
              </button>
              <button
                onClick={() => setAction('countering')}
                className="flex-1 py-3.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-700 transition-colors cursor-pointer"
              >
                ↩ Counter Offer
              </button>
              <button
                onClick={() => setAction('declined')}
                className="flex-1 py-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-bold border border-red-200 dark:border-red-800 transition-colors cursor-pointer"
              >
                ✕ Decline
              </button>
            </div>
          </div>
        )}

        {/* Counter Offer Form */}
        {action === 'countering' && !submitted && (
          <div className="bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 shadow-sm animate-fadeIn">
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Counter Offer</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Describe your counter-proposal clearly</p>
            <textarea
              value={counterNote}
              onChange={(e) => setCounterNote(e.target.value)}
              placeholder="e.g. I'd like to add 10 EcoCredits on my side, or I can also include the matching belt..."
              rows={4}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 text-sm resize-none outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-600 transition"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleCounter}
                disabled={!counterNote.trim()}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold transition-colors cursor-pointer"
              >
                Send Counter Offer
              </button>
              <button
                onClick={() => setAction(null)}
                className="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Result States */}
        {action === 'accepted' && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 text-center shadow-sm">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-1">Swap Accepted!</h3>
            <p className="text-sm text-emerald-600/70 dark:text-emerald-500">{swap.from} will be notified. You can now coordinate the exchange.</p>
            <button className="mt-5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer">
              Open Chat →
            </button>
          </div>
        )}

        {action === 'declined' && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 text-center shadow-sm">
            <div className="text-5xl mb-3">💔</div>
            <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-1">Swap Declined</h3>
            <p className="text-sm text-red-500/70 dark:text-red-500">{swap.from} will be notified that you passed on this swap.</p>
          </div>
        )}

        {action === 'countered' && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-8 text-center shadow-sm">
            <div className="text-5xl mb-3">↩️</div>
            <h3 className="text-xl font-bold text-amber-700 dark:text-amber-400 mb-1">Counter Offer Sent!</h3>
            <p className="text-sm text-amber-600/70 dark:text-amber-500">{swap.from} will review your counter proposal.</p>
          </div>
        )}
      </div>
    </div>
  );
}