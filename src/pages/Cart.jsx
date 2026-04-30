﻿import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import {
  ShoppingCart, Heart, ArrowRight, Trash2, Store,
  PackageOpen, Tag, ShieldCheck, Truck, ChevronRight
} from "lucide-react";
import SectionTitle from "../components/common/SectionTitle";
import ConfirmModal from "../components/common/ConfirmModal";

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyCart = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="relative mb-6">
      <div className="h-20 w-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <ShoppingCart size={32} className="text-gray-300 dark:text-gray-600" />
      </div>
      <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
        <PackageOpen size={14} className="text-green-600 dark:text-green-400" />
      </div>
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6 leading-relaxed">
      Browse the marketplace and add sustainable items to your cart.
    </p>
    <Link to="/marketplace"
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
        bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
        text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
      <Store size={16} /> Browse Marketplace <ArrowRight size={16} />
    </Link>
  </div>
);

// ─── CartItem ─────────────────────────────────────────────────────────────────

const CartItem = ({ item, onRemove, onMoveToWishlist, isWishlisted, index }) => {
  const [removeModal, setRemoveModal] = useState(false);

  return (
    <>
      <div
        className="group flex items-center gap-4 rounded-2xl border border-gray-100 dark:border-gray-800
          bg-white dark:bg-gray-900 p-4 shadow-sm
          hover:border-green-200 dark:hover:border-green-800 hover:shadow-md transition-all duration-200"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <div className="h-16 w-16 shrink-0 rounded-xl bg-gray-100 dark:bg-gray-800
          flex items-center justify-center text-2xl select-none
          group-hover:scale-105 transition-transform duration-200">
          {item.image ?? "👗"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{item.name}</p>
              <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-0.5">
                EGP {item.price?.toLocaleString()}
              </p>
            </div>
            {isWishlisted && (
              <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full
                bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                <Heart size={9} className="fill-current" /> Saved
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            <button
              onClick={() => onMoveToWishlist(item)}
              disabled={isWishlisted}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg
                transition-all duration-200 cursor-pointer
                ${isWishlisted
                  ? 'text-rose-400 dark:text-rose-500 bg-rose-50 dark:bg-rose-900/20 cursor-default'
                  : 'text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20'}`}>
              <Heart size={11} className={isWishlisted ? 'fill-current' : ''} />
              {isWishlisted ? 'Saved' : 'Save for later'}
            </button>

            <button
              onClick={() => setRemoveModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg
                text-red-500 dark:text-red-400 border border-red-200 dark:border-red-900/50
                hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 cursor-pointer">
              <Trash2 size={11} /> Remove
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={removeModal}
        onClose={() => setRemoveModal(false)}
        onConfirm={() => onRemove(item.id)}
        variant="danger"
        title="Remove item?"
        message={`Remove "${item.name}" from your cart? You can save it to your wishlist instead.`}
        confirmText="Yes, Remove"
        cancelText="Keep it"
      />
    </>
  );
};

// ─── Buyer Only ──────────────────────────────────────────────────────────────

const BuyerOnly = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="h-20 w-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-5">
      <ShoppingCart size={32} className="text-gray-300 dark:text-gray-600" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Cart is for Buyers Only</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6 leading-relaxed">
      Switch to Buyer role to access your shopping cart and make purchases.
    </p>
    <Link to="/marketplace"
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
        bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
        text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
      <Store size={16} /> Browse Marketplace
    </Link>
  </div>
);

// ─── Main Cart ────────────────────────────────────────────────────────────────

const Cart = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, removeFromCart, moveToWishlist, isInWishlist, user } = useAppContext();
  const [checkoutModal, setCheckoutModal] = useState(false);
  const count = cart.length;

  if (user?.activeRole !== 'buyer') return <BuyerOnly />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="mx-auto max-w-2xl space-y-6">

        <SectionTitle
          badge="🛒 Your Order"
          title="Shopping"
          highlight="Cart"
          subtitle={count > 0
            ? `${count} item${count !== 1 ? 's' : ''} · EGP ${cartTotal?.toLocaleString()}`
            : 'Add items from the marketplace'}
          size="md"
        />

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">

          {count > 0 && (
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} className="text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {count} item{count !== 1 ? 's' : ''}
                </span>
              </div>
              <Link to="/marketplace"
                className="text-xs font-semibold text-green-600 dark:text-green-400 hover:text-green-700 transition-colors cursor-pointer">
                + Add more
              </Link>
            </div>
          )}

          <div className={count > 0 ? 'p-4 space-y-3' : ''}>
            {count === 0 ? <EmptyCart /> : cart.map((item, i) => (
              <CartItem
                key={item.id} item={item} index={i}
                onRemove={removeFromCart}
                onMoveToWishlist={moveToWishlist}
                isWishlisted={isInWishlist(item.id)}
              />
            ))}
          </div>

          {count > 0 && (
            <div className="px-4 pb-4">
              <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 p-5 mb-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Tag size={14} className="text-green-600" /> Order Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Subtotal ({count} items)</span>
                    <span>EGP {cartTotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-600 dark:text-green-400 font-semibold">Free</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base
                  border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <span>Total</span>
                  <span>EGP {cartTotal?.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mb-4 text-xs text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-green-500" /> Secure</span>
                <span className="flex items-center gap-1"><Truck size={12} className="text-green-500" /> Free shipping</span>
                <span className="flex items-center gap-1"><Heart size={12} className="text-green-500" /> Eco-friendly</span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setCheckoutModal(true)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold
                    bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
                    text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                  Proceed to Checkout <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => navigate("/marketplace")}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold
                    border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300
                    hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <Store size={15} /> Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout confirm modal */}
      <ConfirmModal
        open={checkoutModal}
        onClose={() => setCheckoutModal(false)}
        onConfirm={() => navigate("/checkout")}
        variant="success"
        title="Ready to checkout?"
        message={`You're about to place an order for ${count} item${count !== 1 ? 's' : ''} totalling EGP ${cartTotal?.toLocaleString()}. Shall we proceed?`}
        confirmText="Yes, Checkout"
        cancelText="Review cart"
      />
    </div>
  );
};

export default Cart;