/**
 * Centralized Role Configuration
 * Defines all role-based UI components, permissions, and layouts
 * Makes the dashboard system scalable and maintainable
 */

import { 
  ShoppingBag, 
  Store, 
  Package, 
  TrendingUp, 
  Heart, 
  Users,
  Plus,
  List,
  DollarSign,
  Star,
  Settings,
  Palette,
  Scissors,
  Sparkles,
  Repeat2,
  ArrowRight,
  Eye,
  Clock,
  MessageSquare
} from '../utils/icons';

// Base dashboard statistics for each role
export const roleStats = {
  buyer: [
    { label: "Items purchased", value: "0", icon: ShoppingBag },
    { label: "Wishlist items", value: "0", icon: Heart },
    { label: "CO₂ saved", value: "0 kg", icon: TrendingUp },
    { label: "Total spent", value: "EGP 0", icon: DollarSign }
  ],
  seller: [
    { label: "Active listings", value: "0", icon: Package },
    { label: "Items sold", value: "0", icon: Store },
    { label: "Total revenue", value: "EGP 0", icon: DollarSign },
    { label: "Seller rating", value: "0.0", icon: Star }
  ],
  creator: [
    { label: "Upcycled items", value: "0", icon: Scissors },
    { label: "Projects", value: "0", icon: Palette },
    { label: "EcoCredits earned", value: "0", icon: Sparkles },
    { label: "CO₂ saved", value: "0 kg", icon: TrendingUp }
  ],
  swapper: [
    { label: "Swap offers", value: "0", icon: Repeat2 },
    { label: "Completed swaps", value: "0", icon: ArrowRight },
    { label: "Items in closet", value: "0", icon: Package },
    { label: "Swap rating", value: "0.0", icon: Star }
  ]
};

// Role-specific navigation sections
export const roleSections = {
  buyer: [
    {
      title: "Shopping",
      items: [
        { label: "Browse Marketplace", to: "/marketplace", desc: "Discover sustainable fashion", icon: ShoppingBag },
        { label: "My Orders", to: "/orders", desc: "Track your purchases", icon: Package },
        { label: "Wishlist", to: "/saved", desc: "Save items you love", icon: Heart }
      ]
    },
    {
      title: "Account",
      items: [
        { label: "Profile Settings", to: "/profile", desc: "Manage your account", icon: Settings },
        { label: "Style Feed", to: "/style-feed", desc: "Personalized recommendations", icon: Sparkles }
      ]
    }
  ],
  seller: [
    {
      title: "Selling",
      items: [
        { label: "Add Product", to: "/add-product", desc: "List new items", icon: Plus },
        { label: "My Listings", to: "/listings", desc: "Manage active items", icon: List },
        { label: "Sales Analytics", to: "/analytics", desc: "Track performance", icon: TrendingUp }
      ]
    },
    {
      title: "Management",
      items: [
        { label: "Orders", to: "/seller-orders", desc: "Manage customer orders", icon: Package },
        { label: "Reviews", to: "/reviews", desc: "Customer feedback", icon: Star },
        { label: "Settings", to: "/seller-settings", desc: "Seller preferences", icon: Settings }
      ]
    }
  ],
  creator: [
    {
      title: "Creation",
      items: [
        { label: "Upcycle Item", to: "/upcycle-product", desc: "Transform fashion", icon: Scissors },
        { label: "My Projects", to: "/projects", desc: "Showcase your work", icon: Palette },
        { label: "Materials", to: "/materials", desc: "Manage resources", icon: Package }
      ]
    },
    {
      title: "Community",
      items: [
        { label: "Portfolio", to: "/portfolio", desc: "Your creative journey", icon: Eye },
        { label: "Collaborations", to: "/collaborations", desc: "Work with others", icon: Users },
        { label: "Inspiration", to: "/inspiration", desc: "Get creative ideas", icon: Sparkles }
      ]
    }
  ],
  swapper: [
    {
      title: "Swapping",
      items: [
        { label: "Swap Requests", to: "/swap-requests", desc: "Manage swap offers", icon: Repeat2 },
        { label: "Digital Closet", to: "/digital-closet", desc: "Your wardrobe", icon: Package },
        { label: "Browse Swaps", to: "/swap-marketplace", desc: "Find items to trade", icon: ShoppingBag }
      ]
    },
    {
      title: "Community",
      items: [
        { label: "Swap History", to: "/swap-history", desc: "Past exchanges", icon: Clock },
        { label: "Messages", to: "/messages", desc: "Chat with swappers", icon: MessageSquare },
        { label: "Swap Rating", to: "/swap-rating", desc: "Your swap reputation", icon: Star }
      ]
    }
  ]
};

// Role metadata and permissions
export const roleMetadata = {
  buyer: {
    name: "Buyer",
    description: "Discover and purchase sustainable fashion",
    color: "blue",
    icon: ShoppingBag,
    permissions: ["browse", "purchase", "wishlist", "review"]
  },
  seller: {
    name: "Seller", 
    description: "List items and manage your shop",
    color: "green",
    icon: Store,
    permissions: ["list", "sell", "analytics", "manage_orders"]
  },
  creator: {
    name: "Creator",
    description: "Transform and upcycle fashion items", 
    color: "purple",
    icon: Palette,
    permissions: ["create", "upcycle", "showcase", "collaborate"]
  },
  swapper: {
    name: "Swapper",
    description: "Trade and exchange fashion items",
    color: "amber", 
    icon: Repeat2,
    permissions: ["swap", "trade", "closet", "communicate"]
  }
};

// Available roles for switching (business logic)
export const availableRoles = ["buyer", "seller", "creator", "swapper"];

// Helper functions
export const getRoleConfig = (role) => {
  return {
    stats: roleStats[role] || [],
    sections: roleSections[role] || [],
    metadata: roleMetadata[role] || roleMetadata.buyer
  };
};

export const getRoleColor = (role) => {
  const colors = {
    buyer: "blue",
    seller: "green", 
    creator: "purple",
    swapper: "amber"
  };
  return colors[role] || "gray";
};

export const getRoleBadgeColor = (role) => {
  const colors = {
    buyer: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700",
    seller: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700",
    creator: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700", 
    swapper: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700"
  };
  return colors[role] || "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700";
};
