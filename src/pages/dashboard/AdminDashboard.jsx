import { Link } from "react-router-dom";
import {
  Users,
  Package,
  Repeat2,
  Shield,
  BarChart2,
  Leaf,
  ArrowUpRight,
  Settings,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";

// ─── Shared card style ────────────────────────────────────────────────────────
const cardBase =
  "rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-shadow duration-200 hover:shadow-md dark:hover:shadow-lg";

// ─── Static platform stats ────────────────────────────────────────────────────
const PLATFORM_STATS = [
  { label: "Total Users",     value: "12,847", icon: Users },
  { label: "Active Listings", value: "3,291",  icon: Package },
  { label: "Swaps Today",     value: "47",     icon: Repeat2 },
  { label: "CO₂ Saved",       value: "847 t",  icon: Leaf },
];

// ─── Admin navigation sections ───────────────────────────────────────────────
const ADMIN_SECTIONS = [
  {
    label: "Manage Users",
    to: "/admin/users",
    icon: Users,
    description: "View, edit, ban, or promote user accounts",
  },
  {
    label: "Manage Items",
    to: "/marketplace",
    icon: Package,
    description: "Review, approve, or remove items",
  },
  {
    label: "Manage Swaps",
    to: "/admin/swaps",
    icon: Repeat2,
    description: "Track and oversee swap transactions",
  },
  {
    label: "Dispute Hub",
    to: "/admin/disputes",
    icon: Shield,
    description: "Resolve user disputes and filed claims",
  },
  {
    label: "Analytics",
    to: "/admin/analytics",
    icon: BarChart2,
    description: "Platform metrics and sustainability impact",
  },
  {
    label: "Settings",
    to: "/admin/settings",
    icon: Settings,
    description: "System configuration and permissions",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { user } = useAppContext();

  return (
    <div className="space-y-6">

      {/* ── Header banner ── */}
      <div className={`${cardBase} overflow-hidden`}>
        <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-900 dark:bg-gray-800 px-6 py-6 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-lg font-bold select-none">
                AD
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-white">
                  Admin Control Panel
                </h1>
                <p className="mt-0.5 text-sm text-gray-400">{user?.email}</p>
              </div>
            </div>
            <span className="inline-flex w-fit items-center rounded-full bg-red-500/90 dark:bg-red-800 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Superuser
            </span>
          </div>
        </div>
      </div>

      {/* ── Platform stats ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {PLATFORM_STATS.map(({ label, value, icon: Icon }) => (
          <div key={label} className={`${cardBase} p-4`}>
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 text-red-500 dark:text-red-400">
              <Icon size={18} strokeWidth={2} />
            </div>
            <p className="text-2xl font-semibold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">
              {value}
            </p>
            <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Admin navigation sections ── */}
      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Administration
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ADMIN_SECTIONS.map(({ label, to, icon: Icon, description }) => (
            <Link
              key={label}
              to={to}
              className={`${cardBase} group flex items-center justify-between gap-4 p-5
                hover:border-red-200 dark:hover:border-red-800 cursor-pointer`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl
                  bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400">
                  <Icon size={20} strokeWidth={2} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{label}</p>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{description}</p>
                </div>
              </div>
              <ArrowUpRight
                size={18}
                className="shrink-0 text-gray-300 dark:text-gray-600 transition-transform duration-200
                  group-hover:-translate-y-0.5 group-hover:translate-x-0.5
                  group-hover:text-red-500 dark:group-hover:text-red-400"
              />
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;