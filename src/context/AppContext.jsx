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
const SYSTEM_ROLES = ['buyer', 'seller', 'creator', 'swapper', 'admin'];
const normalizeUser = (user) => {
  if (!user) return null;

  const rolePool = Array.isArray(user.roles) ? user.roles : [];
  const normalizedRoles = [...new Set(
    rolePool
      .map((role) => (typeof role === 'string' ? role.toLowerCase() : ''))
      .filter((role) => SYSTEM_ROLES.includes(role))
  )];

  // Legacy fallback: old user shape may only have user.role.
  if (!normalizedRoles.length && typeof user.role === 'string') {
    const fallbackRole = user.role.toLowerCase();
    if (SYSTEM_ROLES.includes(fallbackRole)) normalizedRoles.push(fallbackRole);
  }

  if (!normalizedRoles.length) normalizedRoles.push('buyer');

  const activeRole =
    normalizedRoles.includes(user.activeRole)
      ? user.activeRole
      : normalizedRoles[0];
  return {
    ...user,
    roles: normalizedRoles,
    activeRole,
  };
};
// ─── Provider ────────────────────────────────────────────────────────────────
export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('eco_user');
    if (!saved) return null;
    try {
      return normalizeUser(JSON.parse(saved));
    } catch {
      return null;
    }
  });
  const [cartByRole, setCartByRole] = useState(() => {
    const saved = localStorage.getItem('eco_cartByRole');
    return saved ? JSON.parse(saved) : { buyer: [], seller: [], creator: [], swapper: [], admin: [] };
  });
  const [wishlistByRole, setWishlistByRole] = useState(() => {
    const saved = localStorage.getItem('eco_wishlistByRole');
    return saved ? JSON.parse(saved) : { buyer: [], seller: [], creator: [], swapper: [], admin: [] };
  });
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem('eco_products') || 'null') || DEFAULT_PRODUCTS);
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('eco_orders') || '[]'));
  const [ecoCredits, setEcoCredits] = useState(() => Number(localStorage.getItem('eco_credits') || 0));
  const [trustScore, setTrustScore] = useState(100);
  const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem('eco_notifications') || '[]'));
  
  // Wallet state
  const initializeWallet = () => ({
    balance: 1000, // Starting balance
    transactions: [
      {
        id: 1,
        type: 'credit',
        amount: 1000,
        title: 'Welcome Bonus',
        date: new Date().toISOString()
      }
    ]
  });
  
  const [walletByRole, setWalletByRole] = useState(() => {
    const saved = localStorage.getItem('eco_walletByRole');
    return saved ? JSON.parse(saved) : { 
      buyer: initializeWallet(),
      seller: initializeWallet(),
      creator: initializeWallet(),
      swapper: initializeWallet(),
      admin: initializeWallet()
    };
  });
  const [balanceAnimation, setBalanceAnimation] = useState(false);

  const isAuthenticated = !!currentUser;
  const activeRole = currentUser?.activeRole || 'buyer';
  const isAdminUser = currentUser?.roles?.includes('admin') || false;
  
  // For admin, combine all data or use admin-specific data
  const cart = isAdminUser 
    ? Object.values(cartByRole).flat() // Combine all carts for admin
    : cartByRole[activeRole] || [];
  const wishlist = isAdminUser
    ? Object.values(wishlistByRole).flat() // Combine all wishlists for admin
    : wishlistByRole[activeRole] || [];
  const wallet = isAdminUser
    ? walletByRole.admin || initializeWallet() // Admin has their own wallet
    : walletByRole[activeRole] || initializeWallet();
  const cartTotal = cart.reduce((acc, item) => acc + item.price, 0);

  // ── user ──────────────────────────────────────────────────────────────────
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

  const saveUser = useCallback((nextUser) => {
    if (!nextUser) {
      setCurrentUser(null);
      localStorage.removeItem('eco_user');
      return;
    }

    const normalizedUser = normalizeUser(nextUser);
    setCurrentUser(normalizedUser);
    localStorage.setItem('eco_user', JSON.stringify(normalizedUser));

    // Add welcome notification for new users
    if (notifications.length === 0) {
      addNotification({
        title: 'Welcome to EcoFashion! 🌿',
        message: 'Thanks for joining our sustainable fashion community. Start exploring eco-friendly products!',
        type: 'welcome',
      });
    }
  }, [addNotification, notifications.length]);

  // ── role management ───────────────────────────────────────────────────────
const switchActiveRole = useCallback((newRole) => {
  setCurrentUser(prev => {
    if (!prev) return prev;
    const normalizedPrev = normalizeUser(prev);
    const roles = normalizedPrev.roles;

    if (!roles.includes(newRole)) return prev;

    const updatedUser = {
      ...normalizedPrev,
      activeRole: newRole,
    };

    // 🔥 IMPORTANT: persist
    localStorage.setItem('eco_user', JSON.stringify(updatedUser));

    return updatedUser;
  });
}, []);
const addRole = (newRole) => {
  setCurrentUser(prev => {
    if (!prev) return prev;
    const normalizedPrev = normalizeUser(prev);
    const roles = normalizedPrev.roles;

    if (roles.includes(newRole)) return prev;

    const updated = {
      ...normalizedPrev,
      roles: [...roles, newRole],
    };

    localStorage.setItem('eco_user', JSON.stringify(updated));
    return updated;
  });
};

const removeRole = (roleToRemove) => {
  setCurrentUser(prev => {
    if (!prev) return prev;
    const normalizedPrev = normalizeUser(prev);
    const roles = normalizedPrev.roles;
    if (!roles.includes(roleToRemove)) return prev;

    const updatedRoles = roles.filter(r => r !== roleToRemove);

    const updated = {
      ...normalizedPrev,
      roles: updatedRoles,
      activeRole:
        normalizedPrev.activeRole === roleToRemove
          ? updatedRoles[0]
          : normalizedPrev.activeRole,
    };

    localStorage.setItem('eco_user', JSON.stringify(updated));
    return updated;
  });
};

  const logout = () => {
    setCurrentUser(null);
    setCartByRole({ buyer: [], seller: [], creator: [], swapper: [], admin: [] });
    setWishlistByRole({ buyer: [], seller: [], creator: [], swapper: [], admin: [] });
    setWalletByRole({ 
      buyer: initializeWallet(),
      seller: initializeWallet(),
      creator: initializeWallet(),
      swapper: initializeWallet(),
      admin: initializeWallet()
    });
    localStorage.setItem('eco_cartByRole', JSON.stringify({ buyer: [], seller: [], creator: [], swapper: [], admin: [] }));
    localStorage.setItem('eco_wishlistByRole', JSON.stringify({ buyer: [], seller: [], creator: [], swapper: [], admin: [] }));
    localStorage.setItem('eco_walletByRole', JSON.stringify({ 
      buyer: initializeWallet(),
      seller: initializeWallet(),
      creator: initializeWallet(),
      swapper: initializeWallet(),
      admin: initializeWallet()
    }));
    localStorage.removeItem('eco_user');
  };

  // ── notifications ──────────────────────────────────────────────────────────
  const markNotificationAsRead = useCallback((id) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      persist('eco_notifications', next);
      return next;
    });
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      persist('eco_notifications', next);
      return next;
    });
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem('eco_notifications');
  }, []);

  // ── wallet functions ──────────────────────────────────────────────────────────
  const addTransaction = useCallback((transaction) => {
    const newTransaction = {
      id: Date.now(),
      ...transaction,
      date: new Date().toISOString(),
    };
    
    setWalletByRole(prev => {
      const roleWallet = prev[activeRole] || initializeWallet();
      const updated = {
        ...prev,
        [activeRole]: {
          ...roleWallet,
          transactions: [newTransaction, ...roleWallet.transactions]
        }
      };
      persist('eco_walletByRole', updated);
      return updated;
    });
    
    return newTransaction;
  }, [activeRole]);

  const updateWalletBalance = useCallback((amount, type) => {
    setWalletByRole(prev => {
      const roleWallet = prev[activeRole] || initializeWallet();
      const updated = {
        ...prev,
        [activeRole]: {
          ...roleWallet,
          balance: type === 'credit' ? roleWallet.balance + amount : roleWallet.balance - amount
        }
      };
      persist('eco_walletByRole', updated);
      return updated;
    });
    
    // Trigger animation
    setBalanceAnimation(true);
    setTimeout(() => setBalanceAnimation(false), 600);
  }, [activeRole]);

  const addToWallet = useCallback((amount, title) => {
    const transaction = addTransaction({
      type: 'credit',
      amount,
      title
    });
    updateWalletBalance(amount, 'credit');
    return transaction;
  }, [addTransaction, updateWalletBalance]);

  const deductFromWallet = useCallback((amount, title) => {
    const transaction = addTransaction({
      type: 'debit',
      amount,
      title
    });
    updateWalletBalance(amount, 'debit');
    return transaction;
  }, [addTransaction, updateWalletBalance]);

  const topUpWallet = useCallback((amount) => {
    return addToWallet(amount, `Wallet Top-up`);
  }, [addToWallet]);

  const checkWalletBalance = useCallback((amount) => {
    return wallet.balance >= amount;
  }, [wallet]);

  // ── derived checks ────────────────────────────────────────────────────────
  const isInCart     = useCallback((id) => hasItem(cart,     id), [cart]);
  const isInWishlist = useCallback((id) => hasItem(wishlist,  id), [wishlist]);

  // ── cart ──────────────────────────────────────────────────────────────────
  const addToCart = useCallback((product) => {
    if (activeRole !== 'buyer') return; // Only buyers can add to cart

    setCartByRole((prev) => {
      const roleCart = prev[activeRole] || [];
      if (hasItem(roleCart, product.id)) return prev;
      const nextRoleCart = [...roleCart, product];
      const next = { ...prev, [activeRole]: nextRoleCart };
      localStorage.setItem('eco_cartByRole', JSON.stringify(next));

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
  }, [activeRole, currentUser, addNotification]);

  const removeFromCart = useCallback((id) => {
    setCartByRole((prev) => {
      const roleCart = prev[activeRole] || [];
      const nextRoleCart = dropItem(roleCart, id);
      const next = { ...prev, [activeRole]: nextRoleCart };
      localStorage.setItem('eco_cartByRole', JSON.stringify(next));
      return next;
    });
  }, [activeRole]);

  /** Atomic: cart → wishlist */
  const moveToWishlist = useCallback((product) => {
    if (activeRole !== 'buyer') return;

    setCartByRole((prev) => {
      const roleCart = prev[activeRole] || [];
      const nextRoleCart = dropItem(roleCart, product.id);
      const nextCart = { ...prev, [activeRole]: nextRoleCart };
      localStorage.setItem('eco_cartByRole', JSON.stringify(nextCart));
      return nextCart;
    });
    setWishlistByRole((prev) => {
      const roleWishlist = prev[activeRole] || [];
      if (hasItem(roleWishlist, product.id)) return prev;
      const nextRoleWishlist = [...roleWishlist, product];
      const nextWishlist = { ...prev, [activeRole]: nextRoleWishlist };
      localStorage.setItem('eco_wishlistByRole', JSON.stringify(nextWishlist));
      return nextWishlist;
    });
  }, [activeRole]);

  // ── wishlist ──────────────────────────────────────────────────────────────
  const toggleWishlist = useCallback((product) => {
    if (activeRole !== 'buyer') return; // Only buyers can use wishlist

    setWishlistByRole((prev) => {
      const roleWishlist = prev[activeRole] || [];
      const nextRoleWishlist = hasItem(roleWishlist, product.id)
        ? dropItem(roleWishlist, product.id)
        : [...roleWishlist, product];
      const next = { ...prev, [activeRole]: nextRoleWishlist };
      localStorage.setItem('eco_wishlistByRole', JSON.stringify(next));
      return next;
    });
  }, [activeRole]);

  /** Atomic: wishlist → cart */
  const moveToCart = useCallback((product) => {
    if (activeRole !== 'buyer') return;

    setWishlistByRole((prev) => {
      const roleWishlist = prev[activeRole] || [];
      const nextRoleWishlist = dropItem(roleWishlist, product.id);
      const nextWishlist = { ...prev, [activeRole]: nextRoleWishlist };
      localStorage.setItem('eco_wishlistByRole', JSON.stringify(nextWishlist));
      return nextWishlist;
    });
    setCartByRole((prev) => {
      const roleCart = prev[activeRole] || [];
      if (hasItem(roleCart, product.id)) return prev;
      const nextRoleCart = [...roleCart, product];
      const nextCart = { ...prev, [activeRole]: nextRoleCart };
      localStorage.setItem('eco_cartByRole', JSON.stringify(nextCart));
      return nextCart;
    });
  }, [activeRole]);

  // ── checkout ──────────────────────────────────────────────────────────────
  const checkout = useCallback(async () => {
    if (currentUser?.activeRole !== 'buyer') {
      throw new Error('Only buyers can purchase items. Switch to Buyer role to proceed.');
    }

    await new Promise((r) => setTimeout(r, 700));
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    
    // Check wallet balance
    if (!checkWalletBalance(total)) {
      throw new Error('Insufficient wallet balance');
    }
    
    // Deduct from wallet
    deductFromWallet(total, `Purchase: ${cart.map(item => item.name).join(', ')}`);
    
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
      // localStorage.setItem('eco_credits', String(next));

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
        title: 'Payment successful!',
        message: `EGP ${total} deducted from your wallet. Order #${order.id} placed successfully.`,
        type: 'order',
      });
    }

    return order;
  }, [cart, currentUser, addNotification, checkWalletBalance, deductFromWallet]);

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

  // ── seller earnings ────────────────────────────────────────────────────────
  const addSellerEarnings = useCallback((productName, price, sellerName) => {
    // For demo purposes, add earnings to current user if they are the seller
    if (currentUser?.name === sellerName) {
      addToWallet(price, `Sold: ${productName}`);
      
      addNotification({
        title: 'Sale completed!',
        message: `You earned EGP ${price} from selling ${productName}`,
        type: 'sale',
      });
    }
  }, [currentUser, addToWallet, addNotification]);

  // ── avatar management ────────────────────────────────────────────────────────
  const updateUserAvatar = useCallback((avatarUrl) => {
    if (!currentUser) {
      console.error('No user logged in');
      return;
    }

    const updatedUser = {
      ...currentUser,
      avatar: avatarUrl
    };

    saveUser(updatedUser);
    
    addNotification({
      title: 'Profile updated successfully ✅',
      message: 'Your profile image has been updated',
      type: 'success',
    });

    return updatedUser;
  }, [currentUser, saveUser, addNotification]);

  const removeUserAvatar = useCallback(() => {
    if (!currentUser) {
      console.error('No user logged in');
      return;
    }

    const updatedUser = {
      ...currentUser,
      avatar: null
    };

    saveUser(updatedUser);
    
    addNotification({
      title: 'Profile image removed',
      message: 'Your profile image has been removed',
      type: 'info',
    });

    return updatedUser;
  }, [currentUser, saveUser, addNotification]);

  const updateProduct = async (id, payload) => {
    await new Promise((r) => setTimeout(r, 500));
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...payload } : p));
      persist('eco_products', next);
      return next;
    });
  };

  // ── derived values ────────────────────────────────────────────────────────
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

        // role management
        switchActiveRole,
        addRole,
        removeRole,

        // cart
        cart,
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
        setProducts,
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
        markAllNotificationsAsRead,
        clearNotifications,

        // wallet
        wallet,
        balanceAnimation,
        addTransaction,
        updateWalletBalance,
        addToWallet,
        deductFromWallet,
        topUpWallet,
        checkWalletBalance,
        addSellerEarnings,

        // avatar management
        updateUserAvatar,
        removeUserAvatar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};