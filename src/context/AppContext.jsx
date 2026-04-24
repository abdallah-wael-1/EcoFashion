import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { DEFAULT_PRODUCTS } from '../data/mockProducts';
/* eslint-disable react-refresh/only-export-components */

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};

// ─── tiny helpers ────────────────────────────────────────────────────────────
const hasItem  = (list, id) => list.some((i) => i.id === id);
const dropItem = (list, id) => list.filter((i) => i.id !== id);
const persist  = (key, value) => localStorage.setItem(key, JSON.stringify(value));

// ─── Provider ────────────────────────────────────────────────────────────────
export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('eco_user') || 'null'));
  const [cart,        setCart]        = useState(() => JSON.parse(localStorage.getItem('eco_cart')     || '[]'));
  const [wishlist,    setWishlist]    = useState(() => JSON.parse(localStorage.getItem('eco_wishlist') || '[]'));
  const [products,    setProducts]    = useState(() => JSON.parse(localStorage.getItem('eco_products') || 'null') || DEFAULT_PRODUCTS);
  const [orders,      setOrders]      = useState(() => JSON.parse(localStorage.getItem('eco_orders')   || '[]'));
  const [ecoCredits,  setEcoCredits]  = useState(() => Number(localStorage.getItem('eco_credits') || 0));
  const [trustScore,  setTrustScore]  = useState(100);
  const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem('eco_notifications') || '[]'));

  const isAuthenticated = !!currentUser;

  // ── user ──────────────────────────────────────────────────────────────────
  const saveUser = (nextUser) => {
    setCurrentUser(nextUser);
    persist('eco_user', nextUser);

    // Add welcome notification for new users
    if (nextUser && notifications.length === 0) {
      addNotification({
        title: 'Welcome to EcoFashion! 🌿',
        message: 'Thanks for joining our sustainable fashion community. Start exploring eco-friendly products!',
        type: 'welcome',
      });
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
    persist('eco_cart', []);
    localStorage.removeItem('eco_user');
  };

  // ── notifications ──────────────────────────────────────────────────────────
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => {
      const next = [newNotification, ...prev];
      persist('eco_notifications', next);
      return next;
    });
    return newNotification;
  }, []);

  const markNotificationAsRead = useCallback((id) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      persist('eco_notifications', next);
      return next;
    });
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem('eco_notifications');
  }, []);

  // ── derived checks ────────────────────────────────────────────────────────
  const isInCart     = useCallback((id) => hasItem(cart,     id), [cart]);
  const isInWishlist = useCallback((id) => hasItem(wishlist,  id), [wishlist]);

  // ── cart ──────────────────────────────────────────────────────────────────
  const addToCart = useCallback((product) => {
    setCart((prev) => {
      if (hasItem(prev, product.id)) return prev;   // enforce uniqueness
      const next = [...prev, product];
      persist('eco_cart', next);

      // Add notification for adding to cart
      if (currentUser) {
        addNotification({
          title: 'Item added to cart!',
          message: `${product.name} has been added to your cart.`,
          type: 'cart',
        });
      }

      return next;
    });
  }, [currentUser, addNotification]);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => {
      const next = dropItem(prev, id);
      persist('eco_cart', next);
      return next;
    });
  }, []);

  /** Atomic: cart → wishlist */
  const moveToWishlist = useCallback((product) => {
    setCart((prev) => {
      const next = dropItem(prev, product.id);
      persist('eco_cart', next);
      return next;
    });
    setWishlist((prev) => {
      if (hasItem(prev, product.id)) return prev;
      const next = [...prev, product];
      persist('eco_wishlist', next);
      return next;
    });
  }, []);

  // ── wishlist ──────────────────────────────────────────────────────────────
  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const next = hasItem(prev, product.id)
        ? dropItem(prev, product.id)
        : [...prev, product];
      persist('eco_wishlist', next);
      return next;
    });
  }, []);

  /** Atomic: wishlist → cart */
  const moveToCart = useCallback((product) => {
    setWishlist((prev) => {
      const next = dropItem(prev, product.id);
      persist('eco_wishlist', next);
      return next;
    });
    setCart((prev) => {
      if (hasItem(prev, product.id)) return prev;
      const next = [...prev, product];
      persist('eco_cart', next);
      return next;
    });
  }, []);

  // ── checkout ──────────────────────────────────────────────────────────────
  const checkout = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 700));
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    const order = {
      id: `ORD-${Date.now()}`,
      items: cart,
      total,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => {
      const next = [order, ...prev];
      persist('eco_orders', next);
      return next;
    });
    setCart([]);
    persist('eco_cart', []);
    setEcoCredits((prev) => {
      const next = prev + Math.floor(total / 10);   // 1 credit per 10 EGP
      localStorage.setItem('eco_credits', String(next));

      // Add notification for EcoCredits earned
      if (currentUser) {
        addNotification({
          title: 'EcoCredits earned!',
          message: `You earned ${Math.floor(total / 10)} EcoCredits from your recent purchase.`,
          type: 'credits',
        });
      }

      return next;
    });

    // Add notification for successful order
    if (currentUser) {
      addNotification({
        title: 'Order completed!',
        message: `Your order #${order.id} has been placed successfully.`,
        type: 'order',
      });
    }

    return order;
  }, [cart, currentUser, addNotification]);

  // ── products ──────────────────────────────────────────────────────────────
  const addProduct = async (payload) => {
    await new Promise((r) => setTimeout(r, 500));
    const item = {
      ...payload,
      id: Date.now(),
      seller: payload.seller || {
        name: currentUser?.name || 'Member',
        avatar: '',
        trustScore: 92,
      },
    };
    setProducts((prev) => {
      const next = [item, ...prev];
      persist('eco_products', next);
      return next;
    });

    // Add notification for new product listing
    if (currentUser) {
      addNotification({
        title: 'Product listed!',
        message: `${item.name} has been successfully listed on the marketplace.`,
        type: 'product',
      });
    }

    return item;
  };

  const updateProduct = async (id, payload) => {
    await new Promise((r) => setTimeout(r, 500));
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...payload } : p));
      persist('eco_products', next);
      return next;
    });
  };

  // ── derived values ────────────────────────────────────────────────────────
  const cartTotal     = cart.reduce((s, i) => s + i.price, 0);
  const cartCount     = cart.length;
  const wishlistCount = wishlist.length;

  const myListings = useMemo(
    () => products.filter((p) => p.seller?.name === (currentUser?.name || '')),
    [products, currentUser]
  );

  return (
    <AppContext.Provider
      value={{
        // user
        user: currentUser,
        setUser: saveUser,
        isAuthenticated,
        logout,

        // cart
        cart,
        setCart,
        cartTotal,
        cartCount,
        addToCart,
        removeFromCart,
        moveToWishlist,
        isInCart,

        // wishlist
        wishlist,
        wishlistCount,
        toggleWishlist,
        moveToCart,
        isInWishlist,

        // products
        products,
        addProduct,
        updateProduct,
        myListings,

        // orders & credits
        orders,
        checkout,
        ecoCredits,
        setEcoCredits,
        trustScore,
        setTrustScore,

        // notifications
        notifications,
        addNotification,
        markNotificationAsRead,
        clearNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};