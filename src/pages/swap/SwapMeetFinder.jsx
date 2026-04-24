import { useState, useMemo } from 'react';

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
  },
  {
    id: 7,
    name: 'Mohamed Tarek',
    avatar: 'MT',
    avatarColor: 'bg-emerald-500',
    distance: 6.8,
    trustScore: 4.2,
    reviews: 9,
    item: { name: 'Reclaimed Denim Shorts', category: 'Bottoms', condition: 'Good', ecoValue: 40, image: '🩲', tags: ['Reclaimed', 'Denim'] },
    online: false,
  },
  {
    id: 8,
    name: 'Yasmine Ali',
    avatar: 'YA',
    avatarColor: 'bg-indigo-500',
    distance: 8.3,
    trustScore: 4.9,
    reviews: 88,
    item: { name: 'Vintage Leather Crossbody Bag', category: 'Accessories', condition: 'Good', ecoValue: 85, image: '👜', tags: ['Vintage', 'Leather'] },
    online: true,
  },
];

const DISTANCE_RANGES = [
  { label: 'Any', max: Infinity },
  { label: '< 1 km', max: 1 },
  { label: '< 3 km', max: 3 },
  { label: '< 5 km', max: 5 },
  { label: '< 10 km', max: 10 },
];

const CONDITION_DOT = {
  'New': 'bg-emerald-500',
  'Like New': 'bg-emerald-400',
  'Excellent': 'bg-blue-500',
  'Good': 'bg-amber-500',
  'Fair': 'bg-orange-500',
};

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

const UserCard = ({ user, onRequest, requested }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col gap-4">

    {/* User Header */}
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className={`w-11 h-11 rounded-full ${user.avatarColor} flex items-center justify-center text-white text-sm font-bold`}>
          {user.avatar}
        </div>
        {user.online && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-gray-900 dark:text-white truncate">{user.name}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <span className="text-amber-500 font-semibold">★ {user.trustScore}</span>
          <span>· {user.reviews} swaps</span>
          <span>·</span>
          <span className={user.online ? 'text-emerald-500 font-medium' : ''}>
            {user.online ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="flex items-center gap-1 justify-end mb-0.5">
          <DistanceDots distance={user.distance} />
        </div>
        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{user.distance} km</span>
      </div>
    </div>

    {/* Item */}
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex items-center gap-3 border border-gray-100 dark:border-gray-700">
      <span className="text-3xl flex-shrink-0">{user.item.image}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{user.item.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${CONDITION_DOT[user.item.condition] ?? 'bg-gray-400'}`} />
          <span className="text-xs text-gray-400 dark:text-gray-500">{user.item.condition}</span>
          <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{user.item.ecoValue} 🌿</span>
        </div>
      </div>
    </div>

    {/* Tags */}
    <div className="flex flex-wrap gap-1.5">
      {user.item.tags.map((tag) => (
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
      onClick={() => onRequest(user.id)}
      disabled={requested}
      className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
        requested
          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 cursor-not-allowed opacity-70 border border-emerald-200 dark:border-emerald-800'
          : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 shadow-sm cursor-pointer'
      }`}
    >
      {requested ? '✓ Request Sent' : '⇄ Request Swap'}
    </button>
  </div>
);

export default function SwapMeetFinder() {
  const [distanceFilter, setDistanceFilter] = useState(Infinity);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('distance');
  const [requestedIds, setRequestedIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const handleRequest = (id) => {
    setRequestedIds((prev) => new Set([...prev, id]));
  };

  const filtered = useMemo(() => {
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">📍</span>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Swap Meet Finder</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 ml-11">
            Discover nearby swappers and propose item-for-item trades
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Nearby Swappers', value: filtered.length, icon: '👥' },
            { label: 'Online Now', value: filtered.filter((u) => u.online).length, icon: '🟢' },
            { label: 'Avg. Distance', value: filtered.length ? `${(filtered.reduce((s, u) => s + u.distance, 0) / filtered.length).toFixed(1)} km` : '—', icon: '📏' },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-center shadow-sm"
            >
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-2xl font-black text-gray-900 dark:text-white">{value}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
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
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            <p className="text-5xl mb-3">🌍</p>
            <p className="font-semibold text-lg">No swappers found nearby</p>
            <p className="text-sm mt-1">Try expanding your distance or changing filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onRequest={handleRequest}
                requested={requestedIds.has(user.id)}
              />
            ))}
          </div>
        )}

        {/* Footer note */}
        {filtered.length > 0 && (
          <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-8">
            📡 Showing {filtered.length} swappers within{' '}
            {distanceFilter === Infinity ? 'any distance' : `${distanceFilter} km`}
          </p>
        )}
      </div>
    </div>
  );
}