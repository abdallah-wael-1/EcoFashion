import { useAppContext } from "../../context/AppContext";
import { ShoppingBag, Heart, Wallet, Star } from "../../utils/icons";
import RoleSwitcher from "../../components/dashboard/RoleSwitcher";
import { useRoles } from "../../hooks/useRoles";
import { roleMetadata, roleStats } from "../../config/rolesConfig";

// ─── Shared card style ────────────────────────────────────────────────────────
const cardBase =
  "rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-shadow duration-200 hover:shadow-md dark:hover:shadow-lg";

// ─── Component ────────────────────────────────────────────────────────────────
const UserDashboard = () => {
  const {
    ecoCredits = 0,
    trustScore = 0,
    cartCount = 0,
    wishlistCount = 0,
    wallet,
    notifications = [],
  } = useAppContext();

  const { user, activeRole, roles } = useRoles();

  const activeRoleMeta  = roleMetadata[activeRole] || roleMetadata.buyer;
  const ActiveRoleIcon  = activeRoleMeta.icon;
  const walletBalance   = wallet?.balance ?? 0;
  const latestNotifications = notifications.slice(0, 4);

  // Merge live data into role stats
  const activeRoleStats = (roleStats[activeRole] || []).map((item) => {
    if (item.label === "Wishlist items")  return { ...item, value: String(wishlistCount) };
    if (item.label === "Total spent")     return { ...item, value: `EGP ${Math.max(0, 1000 - walletBalance)}` };
    if (item.label === "EcoCredits earned") return { ...item, value: String(ecoCredits) };
    return item;
  });

  return (
    <div className="space-y-6">

      {/* ── Welcome header ── */}
      <div className={`${cardBase} overflow-hidden`}>
        <div className="border-b border-gray-200 dark:border-gray-800 bg-gradient-to-br from-green-50 to-emerald-50
          dark:from-gray-800 dark:to-gray-800 px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            {/* Avatar + role badges */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600
                flex items-center justify-center text-white font-bold text-lg select-none">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user?.name || "User"}!
                </h1>

                {/* Assigned roles */}
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Roles:</span>
                  {roles.map((role) => {
                    const meta = roleMetadata[role] || {};
                    const RoleIcon = meta.icon;
                    return (
                      <span
                        key={role}
                        className="inline-flex items-center gap-1.5 rounded-full border border-green-200
                          bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700
                          dark:border-green-800 dark:bg-green-900/30 dark:text-green-400"
                      >
                        {RoleIcon && <RoleIcon size={12} />}
                        {meta.name || role}
                      </span>
                    );
                  })}
                </div>

                {/* Active role context */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Current Context:</span>
                  {roles.map((role) => (
                    <span
                      key={role}
                      className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                        role === activeRole
                          ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {roleMetadata[role]?.name || role}
                      {role === activeRole ? " (Now)" : ""}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Role switcher */}
            <div className="flex w-full items-center justify-center gap-3 sm:w-auto sm:justify-end">
              <RoleSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* ── Account snapshot ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Cart Items",      value: String(cartCount),          icon: ShoppingBag },
          { label: "Wishlist",        value: String(wishlistCount),       icon: Heart },
          { label: "EcoCredits",      value: String(ecoCredits),          icon: Star },
          { label: "Wallet Balance",  value: `EGP ${walletBalance}`,      icon: Wallet },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className={`${cardBase} p-4`}>
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 text-green-600 dark:text-green-400">
              <Icon size={18} strokeWidth={2} />
            </div>
            <p className="text-2xl font-semibold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">{value}</p>
            <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Role context ── */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Role stats */}
        <div className={`${cardBase} p-6 lg:col-span-2`}>
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Current Role Overview</h3>

          <div className="mb-4 flex items-start gap-3 rounded-xl border border-gray-200 dark:border-gray-700
            bg-gray-50/70 dark:bg-gray-800/40 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg
              bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <ActiveRoleIcon size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{activeRoleMeta.name}</p>
              <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{activeRoleMeta.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {activeRoleStats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl border border-gray-100 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-green-600 dark:bg-gray-800 dark:text-green-400">
                  <Icon size={16} />
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Role identity sidebar */}
        <div className={`${cardBase} p-6`}>
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Role Identity</h3>

          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50
            p-4 dark:border-gray-700 dark:from-green-900/20 dark:to-emerald-900/20">
            <p className="text-xs text-gray-500 dark:text-gray-400">Current Context Role</p>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{activeRoleMeta.name}</p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{activeRoleMeta.description}</p>
          </div>

          <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
              Multi-role Access
            </p>
            <p className="mt-1 text-xs text-blue-700/90 dark:text-blue-300/90">
              You can hold multiple roles simultaneously. Switching context only changes your dashboard view.
            </p>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Assigned Roles</p>
            <div className="flex flex-wrap gap-1.5">
              {roles.map((role) => (
                <span
                  key={role}
                  className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold
                    text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {roleMetadata[role]?.name || role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Activity + health ── */}
      <div className="grid gap-4 lg:grid-cols-3">

        <div className={`${cardBase} p-6 lg:col-span-2`}>
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          {latestNotifications.length ? (
            <div className="space-y-3">
              {latestNotifications.map((n) => (
                <div
                  key={n.id}
                  className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/40"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{n.title}</p>
                  <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{n.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No activity yet. Use the sidebar to explore features — updates will appear here.
            </p>
          )}
        </div>

        <div className={`${cardBase} p-6`}>
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Account Health</h3>
          <div className="space-y-3">
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/40">
              <p className="text-xs text-gray-500 dark:text-gray-400">Trust Score</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{trustScore.toFixed(1)} / 5.0</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/40">
              <p className="text-xs text-gray-500 dark:text-gray-400">Role Coverage</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{roles.length} roles active</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;