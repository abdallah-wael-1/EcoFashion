import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import SectionTitle from '../components/common/SectionTitle';
import {
  Wallet, Banknote, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, PlusCircle, Receipt,
  Coins, ArrowLeft, X,
} from '../utils/icons';

// ── helpers ──────────────────────────────────────────────────────────────────

const fmt = (n) =>
  new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', minimumFractionDigits: 0 }).format(n);

const fmtDate = (s) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(s));

// ── WalletPage ────────────────────────────────────────────────────────────────

const WalletPage = () => {
  const navigate = useNavigate();
  const { user, wallet, topUpWallet, addNotification, balanceAnimation } = useAppContext();
  const [showTopUp,   setShowTopUp]   = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(100);

  if (!user) { navigate('/login'); return null; }

  const handleTopUp = () => {
    topUpWallet(topUpAmount);
    addNotification({ title: 'Wallet topped up!', message: `EGP ${topUpAmount} added.`, type: 'success' });
    setShowTopUp(false);
    setTopUpAmount(100);
  };

  const credits = wallet?.transactions?.filter(t => t.type === 'credit').length || 0;
  const debits  = wallet?.transactions?.filter(t => t.type === 'debit').length  || 0;
  const total   = wallet?.transactions?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="mx-auto max-w-3xl space-y-6">

        {/* Back + Title */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="h-9 w-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400
              hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200
              transition-colors cursor-pointer shadow-sm">
            <ArrowLeft size={17} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Wallet</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Manage funds & transaction history</p>
          </div>
        </div>

        {/* ── Balance Card ── */}
        <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">

          {/* Top stripe */}
          <div className="h-1.5 w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />

          <div className="px-6 py-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
                  Available Balance
                </p>
                <p className={`text-4xl font-bold tabular-nums tracking-tight transition-all duration-300
                  ${balanceAnimation ? 'text-green-600 dark:text-green-400 scale-105' : 'text-gray-900 dark:text-white'}`}>
                  {fmt(wallet?.balance || 0)}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                  Welcome bonus included · {total} transactions
                </p>
              </div>

              <button onClick={() => setShowTopUp(true)}
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                  bg-green-600 hover:bg-green-700 text-white
                  shadow-md hover:shadow-lg hover:-translate-y-0.5
                  transition-all duration-200 cursor-pointer">
                <PlusCircle size={16} />
                Top Up
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: TrendingUp,   label: 'Credits',       value: credits, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
                { icon: TrendingDown, label: 'Debits',        value: debits,  color: 'text-red-500 dark:text-red-400',     bg: 'bg-red-50 dark:bg-red-900/20' },
                { icon: Receipt,      label: 'Transactions',  value: total,   color: 'text-blue-600 dark:text-blue-400',   bg: 'bg-blue-50 dark:bg-blue-900/20' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-xl p-3.5 text-center`}>
                  <s.icon size={16} className={`mx-auto mb-1.5 ${s.color}`} />
                  <p className={`text-xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
                  <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Shop with Wallet', hint: 'Browse marketplace', icon: Banknote, to: '/cart',       color: 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' },
            { label: 'View Earnings',    hint: 'Seller dashboard',   icon: Coins,    to: '/my-listings', color: 'from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700' },
          ].map(a => (
            <button key={a.to} onClick={() => navigate(a.to)}
              className={`group flex items-center gap-3 p-4 rounded-2xl text-white font-semibold
                bg-gradient-to-r ${a.color}
                shadow-sm hover:shadow-md hover:-translate-y-0.5
                transition-all duration-200 cursor-pointer`}>
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <a.icon size={20} />
              </div>
              <div className="text-left min-w-0">
                <p className="text-sm font-bold">{a.label}</p>
                <p className="text-xs opacity-70 font-normal">{a.hint}</p>
              </div>
              <ArrowUpRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        {/* ── Transaction History ── */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">

          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt size={15} className="text-green-600 dark:text-green-400" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Transaction History</h2>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">{total} records</span>
          </div>

          {total === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-14 w-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <Receipt size={24} className="text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">No transactions yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">Top up your wallet to get started</p>
              <button onClick={() => setShowTopUp(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white
                  bg-green-600 hover:bg-green-700 transition-colors cursor-pointer">
                <PlusCircle size={15} /> Top Up Now
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {wallet.transactions.map(tx => {
                const isCredit = tx.type === 'credit';
                return (
                  <div key={tx.id}
                    className="flex items-center gap-4 px-6 py-4
                      hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                    onClick={() => {
                      if (tx.title?.includes('Purchase') || tx.title?.includes('purchase')) navigate('/cart');
                      else if (tx.title?.includes('Sold') || tx.title?.includes('Sale')) navigate('/my-listings');
                    }}>

                    {/* Icon */}
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0
                      ${isCredit
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400'}`}>
                      {isCredit ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{tx.title}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{fmtDate(tx.date)}</p>
                    </div>

                    {/* Amount */}
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-bold tabular-nums
                        ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                        {isCredit ? '+' : '−'}{fmt(tx.amount)}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 uppercase tracking-wide">
                        {isCredit ? 'Received' : 'Spent'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Top Up Modal ── */}
      {showTopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setShowTopUp(false); }}>
          <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl
            border border-gray-200 dark:border-gray-800 overflow-hidden">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Top Up Wallet</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Add funds to your balance</p>
              </div>
              <button onClick={() => setShowTopUp(false)}
                className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-400
                  hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 transition-colors cursor-pointer">
                <X size={15} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Amount input */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Amount (EGP)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">EGP</span>
                  <input
                    type="number" min="10" max="10000" step="10"
                    value={topUpAmount}
                    onChange={e => setTopUpAmount(Number(e.target.value))}
                    className="w-full pl-14 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm
                      focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
                  />
                </div>
              </div>

              {/* Quick amounts */}
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2">Quick select</p>
                <div className="grid grid-cols-4 gap-2">
                  {[50, 100, 500, 1000].map(amt => (
                    <button key={amt} onClick={() => setTopUpAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer
                        ${topUpAmount === amt
                          ? 'bg-green-600 text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                      {amt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 px-6 pb-5">
              <button onClick={() => setShowTopUp(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700
                  text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={handleTopUp}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white
                  bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
                  shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                Add {fmt(topUpAmount)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;