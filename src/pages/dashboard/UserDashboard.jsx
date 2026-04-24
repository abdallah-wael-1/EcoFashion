import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Store, Repeat2, Leaf, ArrowUpRight, LayoutDashboard, Palette } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

const card = "rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-shadow duration-200 hover:shadow-md";

// الـ tabs بتظهر حسب roles اليوزر
const buildTabs = (user) => {
  const tabs = [{ id: "overview", label: " Overview" }];
  if (!user) return tabs;
  if (user.canBuy    || user.roles?.includes("buyer"))   tabs.push({ id: "buying",    label: " Buying" });
  if (user.canSell   || user.roles?.includes("seller"))  tabs.push({ id: "selling",   label: " Selling" });
  if (user.canCreate || user.roles?.includes("creator")) tabs.push({ id: "upcycling", label: " Upcycling" });
  // swaps متاح للكل
  tabs.push({ id: "swaps", label: " Swaps" });
  return tabs;
};

const UserDashboard = () => {
  const { user, ecoCredits, trustScore } = useAppContext();
  const tabs = buildTabs(user);
  const [activeTab, setActiveTab] = useState("overview");

  const roleLabels = user?.roles?.map(r =>
    r === "buyer" ? " Buyer" : r === "seller" ? " Seller" : " Creator"
  ).join("  ") || " Buyer";

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className={`${card} p-6`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl
              bg-gradient-to-br from-green-500 to-emerald-600 text-lg font-bold text-white shadow-sm">
              {user?.name?.slice(0, 2).toUpperCase() ?? ""}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{user?.name ?? "Member"}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
              <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-0.5">{roleLabels}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
               {ecoCredits ?? 0} EcoCredits
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-400">
               {trustScore ?? 0} Trust
            </span>
          </div>
        </div>
      </div>

      {/* Tabs  only show tabs relevant to user''s roles */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-1">
        {tabs.map(tab => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
            className={`min-w-0 shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer
              ${activeTab === tab.id
                ? "bg-white dark:bg-gray-900 text-green-700 dark:text-green-400 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: "Items bought", value: "0", icon: ShoppingBag, show: user?.canBuy    || user?.roles?.includes("buyer") },
              { label: "Items sold",   value: "0", icon: Store,       show: user?.canSell   || user?.roles?.includes("seller") },
              { label: "Swaps done",  value: "0", icon: Repeat2,     show: true },
              { label: "CO saved",   value: "0 kg", icon: Leaf,     show: true },
            ].filter(s => s.show).map(stat => (
              <div key={stat.label} className={`${card} p-4`}>
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 text-green-600 dark:text-green-400">
                  <stat.icon size={18} strokeWidth={2} />
                </div>
                <p className="text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className={`${card} p-6`}>
            <div className="mb-4 flex items-center gap-2">
              <LayoutDashboard size={16} className="text-gray-400 dark:text-gray-500" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Quick actions</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Browse marketplace", to: "/marketplace", desc: "Find items",     show: true },
                { label: "List an item",        to: "/add-product", desc: "Earn credits",   show: user?.canSell   || user?.roles?.includes("seller") },
                { label: "Upcycle item",        to: "/upcycle-product", desc: "Create & transform",  show: user?.canCreate || user?.roles?.includes("creator") },
                { label: "Swap requests",       to: "/swap-requests", desc: "Trade items",  show: true },
                { label: "Digital closet",      to: "/digital-closet", desc: "Your wardrobe", show: true },
                { label: "Style feed",          to: "/style-feed",  desc: "For you",        show: true },
              ].filter(a => a.show).map(action => (
                <Link key={action.label + action.to} to={action.to}
                  className="group flex flex-col rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-4
                    transition-all duration-200 hover:border-green-200 dark:hover:border-green-700 hover:bg-white dark:hover:bg-gray-900 hover:shadow-sm cursor-pointer">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{action.label}</span>
                    <ArrowUpRight size={16} className="text-gray-400 dark:text-gray-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-green-600 dark:group-hover:text-green-400" />
                  </span>
                  <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">{action.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "buying" && (
        <EmptyState icon="" title="No purchases yet"
          desc="Browse the marketplace to find sustainable pieces."
          action={{ label: "Browse marketplace", to: "/marketplace" }} />
      )}

      {activeTab === "selling" && (
        <EmptyState icon="" title="No listings yet"
          desc="List your first item and start earning EcoCredits."
          action={{ label: "Create listing", to: "/add-product" }} />
      )}

      {activeTab === "upcycling" && (
        <EmptyState icon="" title="No upcycled items yet"
          desc="Document your upcycling journey and earn more EcoCredits."
          action={{ label: "Add upcycled item", to: "/add-product" }} />
      )}

      {activeTab === "swaps" && (
        <EmptyState icon="" title="No swaps yet"
          desc="Find items to swap from the marketplace."
          action={{ label: "View swap requests", to: "/swap-requests" }} />
      )}
    </div>
  );
};

function EmptyState({ icon, title, desc, action }) {
  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-10 text-center shadow-sm">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">{desc}</p>
      <Link to={action.to}
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-green-600
          px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition-colors cursor-pointer">
        {action.label}
      </Link>
    </div>
  );
}

export default UserDashboard;
