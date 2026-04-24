import { Link } from "react-router-dom";
import { Users, Package, Repeat2, Leaf, Shield, ArrowUpRight } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

const cardBase =
  "rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-shadow duration-200 hover:shadow-md dark:hover:shadow-lg";

const AdminDashboard = () => {
  const { user } = useAppContext();

  return (
    <div className="space-y-6">
      <div className={`${cardBase} overflow-hidden`}>
        <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-900 dark:bg-gray-800 px-6 py-6 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-lg font-semibold">
                AD
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-white">Admin</h1>
                <p className="mt-0.5 text-sm text-gray-400">{user?.email}</p>
              </div>
            </div>
            <span className="inline-flex w-fit items-center rounded-full bg-red-500/90 dark:bg-red-900/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Admin
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total users", value: "12,847", icon: Users },
          { label: "Active listings", value: "3,291", icon: Package },
          { label: "Swaps today", value: "47", icon: Repeat2 },
          { label: "CO saved", value: "847 t", icon: Leaf },
        ].map((stat) => (
          <div key={stat.label} className={`${cardBase} p-4`}>
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 text-green-600 dark:text-green-400">
              <stat.icon size={18} strokeWidth={2} />
            </div>
            <p className="text-2xl font-semibold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">{stat.value}</p>
            <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          { label: "Manage users", to: "/marketplace", icon: Users, hint: "Directory & roles" },
          { label: "Manage listings", to: "/marketplace", icon: Package, hint: "Moderation" },
          { label: "Dispute hub", to: "/swap-requests", icon: Shield, hint: "Swaps & claims" },
          { label: "Sustainability", to: "/", icon: Leaf, hint: "Impact overview" },
        ].map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className={`${cardBase} group flex items-center justify-between gap-4 p-5 hover:border-green-200 dark:hover:border-green-700 cursor-pointer`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <item.icon size={20} strokeWidth={2} />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.hint}</p>
              </div>
            </div>
            <ArrowUpRight
              size={18}
              className="shrink-0 text-gray-400 dark:text-gray-500 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-green-600 dark:group-hover:text-green-400"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
