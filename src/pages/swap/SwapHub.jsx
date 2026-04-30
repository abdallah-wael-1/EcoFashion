import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { isSwapper } from '../../utils/rolePermissions';
import { RefreshCw, Plus, MapPin, ArrowRight, Check, X, MessageSquare } from 'lucide-react';

// ===== MOCK DATA (same as original components) =====
const INITIAL_REQUESTS = [
  {
    id: 1,
    from: 'EcoCreations',
    avatar: 'EC',
    avatarColor: 'bg-emerald-500',
    itemOffered: { name: 'Upcycled Denim Jacket', condition: 'Like New', ecoValue: 85, image: '🧥' },
    itemRequested: { name: 'Vintage Silk Dress', condition: 'Good', ecoValue: 70, image: '👗' },
    ecoCreditsDiff: +15,
    status: 'pending',
    timeAgo: '2h ago',
    trustScore: 4.8,
  },
  {
    id: 2,
    from: 'Vintage Vibes',
    avatar: 'VV',
    avatarColor: 'bg-violet-500',
    itemOffered: { name: 'Silk Wrap Dress', condition: 'Excellent', ecoValue: 120, image: '👘' },
    itemRequested: { name: 'Linen Blazer', condition: 'Good', ecoValue: 95, image: '🥼' },
    ecoCreditsDiff: +25,
    status: 'pending',
    timeAgo: '5h ago',
    trustScore: 4.5,
  },
  {
    id: 3,
    from: 'GreenThread Co.',
    avatar: 'GT',
    avatarColor: 'bg-teal-500',
    itemOffered: { name: 'Hemp Canvas Tote', condition: 'New', ecoValue: 40, image: '👜' },
    itemRequested: { name: 'Upcycled Sneakers', condition: 'Good', ecoValue: 60, image: '👟' },
    ecoCreditsDiff: -20,
    status: 'pending',
    timeAgo: '1d ago',
    trustScore: 4.2,
  },
  {
    id: 4,
    from: 'ReWear Studio',
    avatar: 'RS',
    avatarColor: 'bg-rose-500',
    itemOffered: { name: 'Organic Cotton Tee', condition: 'Like New', ecoValue: 30, image: '👕' },
    itemRequested: { name: 'Bamboo Scarf', condition: 'Excellent', ecoValue: 45, image: '🧣' },
    ecoCreditsDiff: -15,
    status: 'accepted',
    timeAgo: '2d ago',
    trustScore: 4.9,
  },
];

const CATEGORIES = ['All', 'Jackets', 'Dresses', 'Shoes', 'Accessories', 'Tops', 'Bottoms'];

const NEARBY_USERS = [
  {
    id: 1,
    name: 'Layla Hassan',
    avatar: 'LH',
    avatarColor: 'bg-rose-500',
    distance: 0.8,
    trustScore: 4.9,
    reviews: 42,
    item: { name: 'Upcycled Linen Blazer', category: 'Jackets', condition: 'Like New', ecoValue: 90, image: '🥼', tags: ['Upcycled', 'Linen'] },
    online: true,
    productId: 101,
  },
  {
    id: 2,
    name: 'Omar Farouk',
    avatar: 'OF',
    avatarColor: 'bg-blue-500',
    distance: 1.4,
    trustScore: 4.6,
    reviews: 18,
    item: { name: 'Vintage Denim Jumpsuit', category: 'Tops', condition: 'Good', ecoValue: 65, image: '👗', tags: ['Vintage', 'Denim'] },
    online: false,
    productId: 102,
  },
  {
    id: 3,
    name: 'Nour Eldin',
    avatar: 'NE',
    avatarColor: 'bg-teal-500',
    distance: 2.1,
    trustScore: 4.7,
    reviews: 27,
    item: { name: 'Hand-dyed Silk Scarf', category: 'Accessories', condition: 'New', ecoValue: 55, image: '🧣', tags: ['Handmade', 'Silk'] },
    online: true,
    productId: 103,
  },
  {
    id: 4,
    name: 'Aya Mostafa',
    avatar: 'AM',
    avatarColor: 'bg-violet-500',
    distance: 3.0,
    trustScore: 4.3,
    reviews: 11,
    item: { name: 'Upcycled Leather Boots', category: 'Shoes', condition: 'Good', ecoValue: 100, image: '👢', tags: ['Leather', 'Upcycled'] },
    online: true,
    productId: 104,
  },
  {
    id: 5,
    name: 'Kareem Salah',
    avatar: 'KS',
    avatarColor: 'bg-amber-500',
    distance: 4.5,
    trustScore: 4.8,
    reviews: 61,
    item: { name: 'Organic Cotton Midi Dress', category: 'Dresses', condition: 'Excellent', ecoValue: 78, image: '👚', tags: ['Organic', 'Cotton'] },
    online: false,
    productId: 105,
  },
  {
    id: 6,
    name: 'Rania Samir',
    avatar: 'RS',
    avatarColor: 'bg-pink-500',
    distance: 5.2,
    trustScore: 4.5,
    reviews: 33,
    item: { name: 'Bamboo Wide-Leg Trousers', category: 'Bottoms', condition: 'Like New', ecoValue: 60, image: '👖', tags: ['Bamboo', 'Sustainable'] },
    online: true,
    productId: 106,
  },
];

const DISTANCE_RANGES = [
  { label: 'Any', max: Infinity },
  { label: '< 1 km', max: 1 },
  { label: '< 3 km', max: 3 },
  { label: '< 5 km', max: 5 },
  { label: '< 10 km', max: 10 },
];

const STATUS_CONFIG = {
  pending:  { label: 'Pending',  bg: 'bg-amber-100 dark:bg-amber-900/30',  text: 'text-amber-700 dark:text-amber-400',  dot: 'bg-amber-500' },
  accepted: { label: 'Accepted', bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
  declined: { label: 'Declined', bg: 'bg-red-100 dark:bg-red-900/30',    text: 'text-red-700 dark:text-red-400',    dot: 'bg-red-500' },
};

const CONDITION_DOT = {
  'New': 'bg-emerald-500',
  'Like New': 'bg-emerald-400',
  'Excellent': 'bg-blue-500',
  'Good': 'bg-amber-500',
  'Fair': 'bg-orange-500',
};

// ===== HELPER COMPONENTS =====
const DistanceDots = ({ distance }) => {
  const level = distance < 1 ? 4 : distance < 3 ? 3 : distance < 5 ? 2 : 1;
  return (
    <div className="flex gap-0.5 items-center">
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`block w-1.5 h-1.5 rounded-full transition-colors ${i <= level ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`}
        />
      ))}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const EcoDiffBadge = ({ diff }) => {
  const isPositive = diff >= 0;
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
      isPositive
        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
        : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    }`}>
      {isPositive ? `+${diff}` : diff} 🌿
    </span>
  );
};

// ===== MAIN COMPONENT =====
const SwapHub = () => {
  const navigate = useNavigate();
  const { user, addTransaction, addNotification, products } = useAppContext();

  // Check if user is swapper
  const userIsSwapper = isSwapper(user);

  // ===== STATE =====
  // Quick Actions
  const userProducts = useMemo(() => {
    if (!user) return [];
    return products.filter(p => p.seller?.id === user.id || p.seller?.name === user.name);
  }, [products, user]);

  // Swap Requests Section
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [requestFilter, setRequestFilter] = useState('all');
  const [pendingAction, setPendingAction] = useState(null); // { type: 'accept'|'counter'|'decline', requestId }
  const [counterNote, setCounterNote] = useState('');

  // Nearby Swappers Section
  const [distanceFilter, setDistanceFilter] = useState(Infinity);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('distance');
  const [requestedIds, setRequestedIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // ===== HANDLERS =====
  // Handle Accept with inline confirmation
  const handleAcceptClick = (requestId) => {
    setPendingAction({ type: 'accept', requestId });
  };

  const handleConfirmAccept = () => {
    if (!pendingAction) return;
    
    const request = requests.find(r => r.id === pendingAction.requestId);
    
    // Update request status
    setRequests(prev => prev.map(r => r.id === pendingAction.requestId ? { ...r, status: 'accepted' } : r));
    
    // Add transaction
    addTransaction({
      type: 'credit',
      amount: 0,
      title: `Swap completed: ${request.itemOffered.name} for ${request.itemRequested.name}`
    });

    // Add notification
    addNotification({
      title: 'Swap accepted! 🎉',
      message: `You accepted the swap offer from ${request.from}`,
      type: 'swap',
    });

    // Clear pending action
    setPendingAction(null);
  };

  const handleDeclineClick = (requestId) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'declined' } : r));
    
    const request = requests.find(r => r.id === requestId);
    addNotification({
      title: 'Swap declined',
      message: `You declined the swap offer from ${request.from}`,
      type: 'info',
    });
  };

  const handleCounterClick = (requestId) => {
    setPendingAction({ type: 'counter', requestId });
  };

  const handleSendCounter = () => {
    if (!counterNote.trim() || !pendingAction) return;
    
    const request = requests.find(r => r.id === pendingAction.requestId);
    
    addNotification({
      title: 'Counter offer sent ↩️',
      message: `You sent a counter offer to ${request.from}`,
      type: 'swap',
    });

    setPendingAction(null);
    setCounterNote('');
  };

  const handleCancelAction = () => {
    setPendingAction(null);
    setCounterNote('');
  };

  // Handle swap request from nearby swappers
  const handleRequestSwap = (userId, productId) => {
    setRequestedIds(prev => new Set([...prev, userId]));
    
    addNotification({
      title: 'Swap request sent! 🔄',
      message: 'Your swap request has been sent successfully.',
      type: 'success',
    });

    // Redirect to create swap page
    navigate(`/create-swap/${productId}`);
  };

  // Handle create new swap
  const handleCreateSwap = () => {
    if (userProducts.length === 0) {
      addNotification({
        title: 'No items available',
        message: 'Add items to your Digital Closet first to create swap offers.',
        type: 'warning',
      });
      return;
    }
    
    // Navigate to marketplace to select an item to swap for
    navigate('/marketplace');
  };

  // ===== FILTERED DATA =====
  const filteredRequests = requestFilter === 'all' 
    ? requests 
    : requests.filter(r => r.status === requestFilter);

  const filteredNearbyUsers = useMemo(() => {
    let list = NEARBY_USERS.filter((u) => {
      const withinDistance = u.distance <= distanceFilter;
      const inCategory = categoryFilter === 'All' || u.item.category === categoryFilter;
      const matchesSearch =
        !searchQuery ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return withinDistance && inCategory && matchesSearch;
    });

    if (sortBy === 'distance') list = [...list].sort((a, b) => a.distance - b.distance);
    else if (sortBy === 'trust') list = [...list].sort((a, b) => b.trustScore - a.trustScore);
    else if (sortBy === 'ecoValue') list = [...list].sort((a, b) => b.item.ecoValue - a.item.ecoValue);

    return list;
  }, [distanceFilter, categoryFilter, sortBy, searchQuery]);

  // ===== NON-SWAPPER VIEW =====
  if (!userIsSwapper) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Upgrade to Swapper</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Upgrade to Swapper to use this feature. Swap items with other eco-conscious fashion lovers and keep fashion circular.
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium hover:from-emerald-700 hover:to-green-700 transition-all cursor-pointer"
            >
              Upgrade Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        
        {/* ===== SECTION 1: QUICK ACTIONS ===== */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
          </div>
          
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Create New Swap</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {userProducts.length === 0 
                    ? 'You need to add items to your Digital Closet first'
                    : `You have ${userProducts.length} item${userProducts.length > 1 ? 's' : ''} available for swapping`
                  }
                </p>
              </div>
              <button
                onClick={handleCreateSwap}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-5 h-5" />
                Create New Swap
              </button>
            </div>
            
            {userProducts.length === 0 && (
              <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <p className="text-sm text-amber-800 dark:text-amber-200 flex items-center gap-2">
                  <span>⚠️</span>
                  Add items to your Digital Closet first to create swap offers.
                </p>
                <button
                  onClick={() => navigate('/digital-closet')}
                  className="mt-2 text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 underline cursor-pointer"
                >
                  Go to Digital Closet →
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ===== SECTION 2: SWAP REQUESTS ===== */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Swap Requests</h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-1 w-fit shadow-sm">
            {['all', 'pending', 'accepted', 'declined'].map((tab) => (
              <button
                key={tab}
                onClick={() => setRequestFilter(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 capitalize cursor-pointer ${
                  requestFilter === tab
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {tab}
                {tab !== 'all' && (
                  <span className="ml-1.5 text-xs opacity-60">
                    ({requests.filter((r) => r.status === tab).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Request Cards */}
          <div className="space-y-4">
            {filteredRequests.length === 0 && (
              <div className="text-center py-16 text-gray-400 dark:text-gray-600 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
                <p className="text-5xl mb-3">🌿</p>
                <p className="font-medium">No {requestFilter} requests</p>
              </div>
            )}

            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm"
              >
                {/* Top Row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${req.avatarColor} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                      {req.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white">{req.from}</span>
                        <span className="flex items-center gap-0.5 text-xs text-amber-500 font-semibold">★ {req.trustScore}</span>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{req.timeAgo}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <EcoDiffBadge diff={req.ecoCreditsDiff} />
                    <StatusBadge status={req.status} />
                  </div>
                </div>

                {/* Items Exchange */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wide font-medium">They Offer</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{req.itemOffered.image}</span>
                      <div>
                        <p className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">{req.itemOffered.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{req.itemOffered.condition} · {req.itemOffered.ecoValue} 🌿</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    ⇄
                  </div>

                  <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wide font-medium">They Want</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{req.itemRequested.image}</span>
                      <div>
                        <p className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">{req.itemRequested.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{req.itemRequested.condition} · {req.itemRequested.ecoValue} 🌿</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inline Actions or Pending Action UI */}
                {pendingAction?.requestId === req.id ? (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    {pendingAction.type === 'accept' && (
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white mb-1">Confirm Accept Swap?</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            This will complete the swap and create a transaction record.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleConfirmAccept}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-4 h-4" />
                            Confirm
                          </button>
                          <button
                            onClick={handleCancelAction}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {pendingAction.type === 'counter' && (
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white mb-2">Counter Offer</p>
                        <textarea
                          value={counterNote}
                          onChange={(e) => setCounterNote(e.target.value)}
                          placeholder="Describe your counter proposal..."
                          rows={3}
                          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={handleSendCounter}
                            disabled={!counterNote.trim()}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                          >
                            Send Counter
                          </button>
                          <button
                            onClick={handleCancelAction}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <button
                      onClick={() => navigate(`/swap/${req.id}`)}
                      className="flex-1 py-2 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      View Details
                    </button>

                    {req.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAcceptClick(req.id)}
                          className="flex-1 py-2 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleCounterClick(req.id)}
                          className="flex-1 py-2 text-sm font-semibold rounded-xl bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700 transition-colors cursor-pointer"
                        >
                          Counter
                        </button>
                        <button
                          onClick={() => handleDeclineClick(req.id)}
                          className="flex-1 py-2 text-sm font-semibold rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800 transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {req.status === 'accepted' && (
                      <div className="flex-1 py-2 text-sm font-semibold rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-center flex items-center justify-center gap-1">
                        <Check className="w-4 h-4" />
                        Accepted
                      </div>
                    )}

                    {req.status === 'declined' && (
                      <div className="flex-1 py-2 text-sm font-semibold rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-center flex items-center justify-center gap-1">
                        <X className="w-4 h-4" />
                        Declined
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ===== SECTION 3: NEARBY SWAPPERS ===== */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Find Swappers Near You</h2>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 mb-6 shadow-sm space-y-4">
            {/* Search */}
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search by name or item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-600 transition"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              {/* Distance Filter */}
              <div className="flex-1 min-w-[160px]">
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Distance</label>
                <div className="flex flex-wrap gap-1.5">
                  {DISTANCE_RANGES.map(({ label, max }) => (
                    <button
                      key={label}
                      onClick={() => setDistanceFilter(max)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        distanceFilter === max
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="flex-shrink-0">
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-600 transition cursor-pointer"
                >
                  <option value="distance">Distance</option>
                  <option value="trust">Trust Score</option>
                  <option value="ecoValue">Eco Value</option>
                </select>
              </div>
            </div>

            {/* Category Tabs */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Category</label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User Grid */}
          {filteredNearbyUsers.length === 0 ? (
            <div className="text-center py-20 text-gray-400 dark:text-gray-600 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
              <p className="text-5xl mb-3">🌍</p>
              <p className="font-semibold text-lg">No swappers found nearby</p>
              <p className="text-sm mt-1">Try expanding your distance or changing filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredNearbyUsers.map((nearbyUser) => (
                <div
                  key={nearbyUser.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col gap-4"
                >
                  {/* User Header */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-11 h-11 rounded-full ${nearbyUser.avatarColor} flex items-center justify-center text-white text-sm font-bold`}>
                        {nearbyUser.avatar}
                      </div>
                      {nearbyUser.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900 dark:text-white truncate">{nearbyUser.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                        <span className="text-amber-500 font-semibold">★ {nearbyUser.trustScore}</span>
                        <span>· {nearbyUser.reviews} swaps</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 justify-end mb-0.5">
                        <DistanceDots distance={nearbyUser.distance} />
                      </div>
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{nearbyUser.distance} km</span>
                    </div>
                  </div>

                  {/* Item */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex items-center gap-3 border border-gray-100 dark:border-gray-700">
                    <span className="text-3xl flex-shrink-0">{nearbyUser.item.image}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{nearbyUser.item.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${CONDITION_DOT[nearbyUser.item.condition] ?? 'bg-gray-400'}`} />
                        <span className="text-xs text-gray-400 dark:text-gray-500">{nearbyUser.item.condition}</span>
                        <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{nearbyUser.item.ecoValue} 🌿</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {nearbyUser.item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Request Button */}
                  <button
                    onClick={() => handleRequestSwap(nearbyUser.id, nearbyUser.productId)}
                    disabled={requestedIds.has(nearbyUser.id)}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                      requestedIds.has(nearbyUser.id)
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 cursor-not-allowed opacity-70 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 shadow-sm cursor-pointer'
                    }`}
                  >
                    {requestedIds.has(nearbyUser.id) ? '✓ Request Sent' : '⇄ Request Swap'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Footer note */}
          {filteredNearbyUsers.length > 0 && (
            <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-8">
              📡 Showing {filteredNearbyUsers.length} swappers within{' '}
              {distanceFilter === Infinity ? 'any distance' : `${distanceFilter} km`}
            </p>
          )}
        </section>

      </div>
    </div>
  );
};

export default SwapHub;
