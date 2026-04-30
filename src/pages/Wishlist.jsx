import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { ShoppingCart, Heart, ArrowRight, Trash2, Store, PackageOpen, ExternalLink } from "../utils/icons";
import SectionTitle from "../components/common/SectionTitle";

// ─── WishlistItem ──────────────────────────────────────────────────────────────

const WishlistItem = ({ item, onUnsave, onMoveToCart, isInCart, index }) => {
  const navigate = useNavigate();

  return (
    <div
      className="group relative flex items-center gap-4 rounded-2xl border border-gray-100 dark:border-gray-800
        bg-white dark:bg-gray-900 p-4 shadow-sm
        hover:border-green-200 dark:hover:border-green-800
        hover:shadow-md transition-all duration-200"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image */}
      <div
        className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden cursor-pointer
          bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl
          group-hover:scale-105 transition-transform duration-200"
        onClick={() => navigate(`/product/${item.id}`)}
      >
        {item.image ?? "👗"}
        {isInCart && (
          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
            <ShoppingCart size={14} className="text-green-600" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div
          className="cursor-pointer group/name"
          onClick={() => navigate(`/product/${item.id}`)}
        >
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900 dark:text-gray-100 truncate
              group-hover/name:text-green-600 dark:group-hover/name:text-green-400 transition-colors">
              {item.name}
            </p>
            <ExternalLink size={12} className="text-gray-400 opacity-0 group-hover/name:opacity-100 transition-opacity shrink-0" />
          </div>
          <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-0.5">
            EGP {item.price?.toLocaleString()}
          </p>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {isInCart && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full
              bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400
              border border-green-200 dark:border-green-800">
              <ShoppingCart size={10} />
              In cart
            </span>
          )}
          {item.condition && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
              {item.condition}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 shrink-0">
        {isInCart ? (
          <Link to="/cart"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold
              bg-green-600 hover:bg-green-700 text-white
              shadow-sm hover:shadow-md hover:-translate-y-0.5
              transition-all duration-200 cursor-pointer whitespace-nowrap">
            <ShoppingCart size={13} />
            View Cart
          </Link>
        ) : (
          <button
            onClick={() => onMoveToCart(item)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold
              bg-gradient-to-r from-green-600 to-emerald-600
              hover:from-green-700 hover:to-emerald-700
              text-white shadow-sm hover:shadow-md hover:-translate-y-0.5
              transition-all duration-200 cursor-pointer whitespace-nowrap">
            <ShoppingCart size={13} />
            Add to Cart
          </button>
        )}

        <button
          onClick={() => onUnsave(item)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold
            border border-red-200 dark:border-red-900/50
            text-red-500 dark:text-red-400
            hover:bg-red-50 dark:hover:bg-red-900/20
            transition-all duration-200 cursor-pointer whitespace-nowrap">
          <Trash2 size={13} />
          Remove
        </button>
      </div>
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyWishlist = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="relative mb-6">
      <div className="h-20 w-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <Heart size={32} className="text-gray-300 dark:text-gray-600" />
      </div>
      <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-xl bg-green-100 dark:bg-green-900/30
        flex items-center justify-center">
        <PackageOpen size={14} className="text-green-600 dark:text-green-400" />
      </div>
    </div>

    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Nothing saved yet</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6 leading-relaxed">
      Browse the marketplace and tap the heart on any item to save it here.
    </p>

    <Link to="/marketplace"
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
        bg-gradient-to-r from-green-600 to-emerald-600
        hover:from-green-700 hover:to-emerald-700
        text-white shadow-md hover:shadow-lg hover:-translate-y-0.5
        transition-all duration-200 cursor-pointer">
      <Store size={16} />
      Browse Marketplace
      <ArrowRight size={16} />
    </Link>
  </div>
);

// ─── Buyer Only ──────────────────────────────────────────────────────────────

const BuyerOnly = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="h-20 w-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-5">
      <Heart size={32} className="text-gray-300 dark:text-gray-600" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Wishlist is for Buyers Only</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6 leading-relaxed">
      Switch to Buyer role to save items to your wishlist.
    </p>
    <Link to="/marketplace"
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
        bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
        text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
      <Store size={16} /> Browse Marketplace
    </Link>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const Wishlist = () => {
  const { wishlist, toggleWishlist, moveToCart, isInCart, user } = useAppContext();
  const count = wishlist.length;

  if (user?.activeRole !== 'buyer') return <BuyerOnly />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="mx-auto max-w-2xl space-y-6">

        {/* Section Title */}
        <SectionTitle
          badge="♡ Your Collection"
          title="Saved"
          highlight="Items"
          subtitle={count > 0
            ? `${count} item${count !== 1 ? 's' : ''} waiting in your wishlist`
            : 'Items you love, all in one place'}
          size="md"
        />

        {/* Card */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800
          bg-white dark:bg-gray-900 shadow-sm overflow-hidden">

          {/* Header bar */}
          {count > 0 && (
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800
              flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart size={16} className="text-red-500 fill-red-500" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {count} saved item{count !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link to="/marketplace"
                  className="text-xs font-semibold text-green-600 dark:text-green-400
                    hover:text-green-700 dark:hover:text-green-300 transition-colors cursor-pointer">
                  Browse more
                </Link>
                <span className="text-gray-300 dark:text-gray-700">·</span>
                <Link to="/cart"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold
                    px-3 py-1.5 rounded-lg
                    border border-gray-200 dark:border-gray-700
                    text-gray-700 dark:text-gray-300
                    hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <ShoppingCart size={13} />
                  Cart
                </Link>
              </div>
            </div>
          )}

          {/* Content */}
          <div className={count > 0 ? 'p-4 space-y-3' : ''}>
            {count === 0 ? (
              <EmptyWishlist />
            ) : (
              wishlist.map((item, i) => (
                <WishlistItem
                  key={item.id}
                  item={item}
                  index={i}
                  onUnsave={toggleWishlist}
                  onMoveToCart={moveToCart}
                  isInCart={isInCart(item.id)}
                />
              ))
            )}
          </div>

          {/* Footer CTA */}
          {count > 0 && (
            <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <Link to="/marketplace"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold
                  text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20
                  transition-colors cursor-pointer border border-green-200 dark:border-green-900">
                <Store size={15} />
                Find more items to save
                <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;