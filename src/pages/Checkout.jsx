﻿import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { ShoppingCart, Store, ArrowLeft, ShieldCheck, Truck, Leaf, ChevronRight, Wallet, AlertTriangle } from "../utils/icons";
import SectionTitle from "../components/common/SectionTitle";
import ConfirmModal from "../components/common/ConfirmModal";

// ─── Success ──────────────────────────────────────────────────────────────────

const OrderSuccess = ({ order, onContinue }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="h-20 w-20 rounded-2xl bg-green-100 dark:bg-green-900/30
      flex items-center justify-center mb-5">
      <span className="text-4xl">✅</span>
    </div>
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Order Placed!</h2>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">
      Order <span className="font-mono font-bold text-gray-700 dark:text-gray-300">{order.id}</span>
    </p>
    <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
      {order.items.length} item{order.items.length !== 1 ? 's' : ''} · EGP {order.total?.toLocaleString()}
    </p>
    <div className="flex gap-3">
      <button onClick={onContinue}
        className="px-6 py-2.5 rounded-xl text-sm font-bold text-white
          bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
          shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
        Go to Dashboard →
      </button>
      <Link to="/marketplace"
        className="px-6 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700
          text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800
          text-sm font-semibold transition-colors cursor-pointer">
        Continue Shopping
      </Link>
    </div>
  </div>
);

// ─── Empty ────────────────────────────────────────────────────────────────────

const EmptyCheckout = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="h-20 w-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-5">
      <ShoppingCart size={32} className="text-gray-300 dark:text-gray-600" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Nothing to check out</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Your cart is empty.</p>
    <Link to="/cart"
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
        bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
        text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
      <ArrowLeft size={15} /> Return to Cart
    </Link>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, checkout, wallet, checkWalletBalance, topUpWallet, addNotification } = useAppContext();

  const [status,       setStatus]       = useState('idle');
  const [order,        setOrder]        = useState(null);
  const [placeModal,   setPlaceModal]   = useState(false);
  const [insufficientBalanceModal, setInsufficientBalanceModal] = useState(false);

  const hasEnoughBalance = checkWalletBalance(cartTotal);
  const balanceShortage = cartTotal - (wallet?.balance || 0);

  const handleCheckout = async () => {
    if (!hasEnoughBalance) {
      setInsufficientBalanceModal(true);
      return;
    }
    
    setStatus('loading');
    try {
      const completedOrder = await checkout();
      setOrder(completedOrder);
      setStatus('success');
    } catch (error) {
      setStatus('idle');
      addNotification({
        title: 'Checkout failed',
        message: error.message || 'Something went wrong. Please try again.',
        type: 'error',
      });
    }
  };

  const handleTopUp = (amount) => {
    topUpWallet(amount);
    setInsufficientBalanceModal(false);
    addNotification({
      title: 'Wallet topped up!',
      message: `EGP ${amount} has been added to your wallet.`,
      type: 'success',
    });
  };

  if (status === 'success' && order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
            <OrderSuccess order={order} onContinue={() => navigate('/dashboard')} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="mx-auto max-w-2xl space-y-6">

        <SectionTitle
          badge="💳 Final Step"
          title="Confirm"
          highlight="Order"
          subtitle={cart.length > 0
            ? `${cart.length} item${cart.length !== 1 ? 's' : ''} · EGP ${cartTotal?.toLocaleString()}`
            : 'Review your items before placing'}
          size="md"
        />

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">

          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Order Review</span>
            <Link to="/cart"
              className="inline-flex items-center gap-1 text-xs font-semibold
                text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer">
              <ArrowLeft size={13} /> Edit Cart
            </Link>
          </div>

          {!cart.length ? <EmptyCheckout /> : (
            <>
              {/* Items list */}
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg shrink-0">
                        {item.image ?? '👗'}
                      </div>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-[180px]">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400 shrink-0 ml-2">
                      EGP {item.price?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mx-4 mb-4 mt-2 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 p-5">
                <div className="space-y-2 text-sm mb-3">
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>EGP {cartTotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-600 dark:text-green-400 font-semibold">Free</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base
                  border-t border-gray-200 dark:border-gray-700 pt-3">
                  <span>Total</span>
                  <span>EGP {cartTotal?.toLocaleString()}</span>
                </div>
              </div>

              {/* Wallet Payment Info */}
              <div className={`mx-4 mb-4 rounded-xl border px-4 py-3 flex items-center gap-3 ${
                hasEnoughBalance 
                  ? 'bg-green-50 dark:bg-green-900/15 border-green-100 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/15 border-red-100 dark:border-red-800'
              }`}>
                <Wallet size={20} className={`shrink-0 ${hasEnoughBalance ? 'text-green-600' : 'text-red-600'}`} />
                <div className="flex-1">
                  <p className={`text-sm font-medium leading-relaxed ${
                    hasEnoughBalance ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                  }`}>
                    {hasEnoughBalance ? (
                      <>Payment via Wallet • Available: EGP {wallet?.balance || 0}</>
                    ) : (
                      <>Insufficient balance • Available: EGP {wallet?.balance || 0} • Need: EGP {balanceShortage}</>
                    )}
                  </p>
                </div>
              </div>

              {!hasEnoughBalance && (
                <div className="mx-4 mb-4 rounded-xl bg-blue-50 dark:bg-blue-900/15 border border-blue-100 dark:border-blue-800 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <AlertTriangle size={20} className="text-blue-600 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">
                        Need to top up your wallet?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTopUp(balanceShortage)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Top Up EGP {balanceShortage}
                        </button>
                        <button
                          onClick={() => navigate('/wallet')}
                          className="px-3 py-1 border border-blue-600 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                        >
                          Manage Wallet
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Trust row */}
              <div className="flex items-center justify-center gap-4 mb-4 text-xs text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-green-500" /> Secure</span>
                <span className="flex items-center gap-1"><Truck size={12} className="text-green-500" /> Free shipping</span>
                <span className="flex items-center gap-1"><Leaf size={12} className="text-green-500" /> Eco-verified</span>
              </div>

              {/* CTA */}
              <div className="px-4 pb-5 space-y-2">
                <button
                  onClick={() => setPlaceModal(true)}
                  disabled={status === 'loading' || !hasEnoughBalance}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold
                    ${hasEnoughBalance 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                      : 'bg-gray-400 cursor-not-allowed'
                    }
                    text-white shadow-md hover:shadow-lg hover:-translate-y-0.5
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
                    transition-all duration-200 cursor-pointer`}>
                  {status === 'loading' ? (
                    <><span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing…</>
                  ) : hasEnoughBalance ? (
                    <>Pay with Wallet · EGP {cartTotal?.toLocaleString()} <ChevronRight size={16} /></>
                  ) : (
                    <>Insufficient Balance <AlertTriangle size={16} /></>
                  )}
                </button>

                <button onClick={() => navigate('/cart')}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold
                    border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300
                    hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <Store size={15} /> Edit Cart
                </button>
              </div>

              <p className="text-center text-xs text-gray-400 dark:text-gray-600 pb-4">
                By placing your order you agree to our Terms of Service.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Place order confirmation modal */}
      <ConfirmModal
        open={placeModal}
        onClose={() => setPlaceModal(false)}
        onConfirm={handleCheckout}
        variant="success"
        title="Place your order?"
        message={`Confirm your order of ${cart.length} item${cart.length !== 1 ? 's' : ''} for EGP ${cartTotal?.toLocaleString()}. This action will clear your cart.`}
        confirmText="Place Order"
        cancelText="Not yet"
      />

      {/* Insufficient balance modal */}
      <ConfirmModal
        open={insufficientBalanceModal}
        onClose={() => setInsufficientBalanceModal(false)}
        onConfirm={() => handleTopUp(balanceShortage)}
        variant="warning"
        title="Insufficient Wallet Balance"
        message={`You need EGP ${balanceShortage} more to complete this purchase. Would you like to top up your wallet now?`}
        confirmText={`Top Up EGP ${balanceShortage}`}
        cancelText="Cancel"
      />
    </div>
  );
};

export default Checkout;