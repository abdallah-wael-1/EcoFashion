import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionTitle from '../../components/common/SectionTitle'; 


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

const STATUS_CONFIG = {
  pending:  { label: 'Pending',  bg: 'bg-amber-100 dark:bg-amber-900/30',  text: 'text-amber-700 dark:text-amber-400',  dot: 'bg-amber-500' },
  accepted: { label: 'Accepted', bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
  declined: { label: 'Declined', bg: 'bg-red-100 dark:bg-red-900/30',    text: 'text-red-700 dark:text-red-400',    dot: 'bg-red-500' },
};

const StarRating = ({ score }) => (
  <span className="flex items-center gap-0.5 text-xs text-amber-500 font-semibold">
    ★ {score}
  </span>
);

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

export default function SwapRequests({ onViewDetails }) {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate?.() ?? null;

  const update = (id, status) =>
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

  const handleViewDetails = (req) => {
    if (onViewDetails) onViewDetails(req);
    else if (navigate) navigate(`/swap/${req.id}`, { state: req });
  };

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <SectionTitle
            title="Swap Requests"
            subtitle="Manage incoming and outgoing item exchange proposals"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-1 w-fit shadow-sm">
          {['all', 'pending', 'accepted', 'declined'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 capitalize cursor-pointer ${
                filter === tab
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
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400 dark:text-gray-600">
              <p className="text-5xl mb-3">🌿</p>
              <p className="font-medium">No {filter} requests</p>
            </div>
          )}

          {filtered.map((req) => (
            <div
              key={req.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              {/* Top Row: User + Status + Time */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${req.avatarColor} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {req.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white">{req.from}</span>
                      <StarRating score={req.trustScore} />
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{req.timeAgo}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <EcoDiffBadge diff={req.ecoCreditsDiff} />
                  <StatusBadge status={req.status} />
                </div>
              </div>

              {/* Items Exchange Visual */}
              <div className="flex items-center gap-3 mb-4">
                {/* Offered Item */}
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

                {/* Swap Arrow */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  ⇄
                </div>

                {/* Requested Item */}
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

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => handleViewDetails(req)}
                  className="flex-1 py-2 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  View Details
                </button>

                {req.status === 'pending' && (
                  <>
                    <button
                      onClick={() => update(req.id, 'accepted')}
                      className="flex-1 py-2 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm cursor-pointer"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => update(req.id, 'declined')}
                      className="flex-1 py-2 text-sm font-semibold rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800 transition-colors cursor-pointer"
                    >
                      Decline
                    </button>
                  </>
                )}

                {req.status === 'accepted' && (
                  <div className="flex-1 py-2 text-sm font-semibold rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-center">
                    ✓ Swap Accepted
                  </div>
                )}

                {req.status === 'declined' && (
                  <div className="flex-1 py-2 text-sm font-semibold rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-center">
                    ✕ Declined
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}