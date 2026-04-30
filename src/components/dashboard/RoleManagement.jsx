import { useState } from 'react';
import { ChevronDown, Settings, Check, Shield } from '../../utils/icons';
import { useAppContext } from '../../context/AppContext';
import { useRoles } from '../../hooks/useRoles';
import { availableRoles, roleMetadata, getRoleBadgeColor } from '../../config/rolesConfig';

const RoleManagement = () => {
  const { switchActiveRole } = useAppContext();
  const { user, activeRole, roles: userRoles, isAdmin } = useRoles();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  // Admin has all roles active simultaneously
  if (isAdmin) {
    return (
      <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-shadow duration-200 hover:shadow-md dark:hover:shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Access</h3>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
              <Shield size={14} />
              Administrator
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            As an administrator, you have access to all features and can manage the platform.
          </p>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Check size={16} className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-800 dark:text-green-300">All Roles Active</span>
            </div>
            <p className="text-xs text-green-700 dark:text-green-400">
              You can access buyer, seller, creator, and swapper features simultaneously.
            </p>
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Admin privileges: Full platform access and management capabilities
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentRole = activeRole;
  const currentRoleMeta = roleMetadata[currentRole];
  const CurrentRoleIcon = currentRoleMeta.icon;

  const handleRoleSwitch = (newRole) => {
    if (newRole !== currentRole && userRoles.includes(newRole)) {
      switchActiveRole(newRole);
      setShowDropdown(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-shadow duration-200 hover:shadow-md dark:hover:shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Roles</h3>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getRoleBadgeColor(currentRole)}`}>
            <CurrentRoleIcon size={14} />
            {currentRoleMeta.name}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Switch between your available roles to access different features
        </p>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-xl border ${getRoleBadgeColor(currentRole)} transition-all duration-200 hover:shadow-md cursor-pointer`}
          >
            <div className="flex items-center gap-2">
              <CurrentRoleIcon size={16} />
              <span className="font-medium">{currentRoleMeta.name}</span>
            </div>
            <ChevronDown size={14} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
              <div className="p-2">
                {userRoles.map(role => {
                  const meta = roleMetadata[role];
                  const IconComponent = meta.icon;
                  return (
                    <button
                      key={role}
                      onClick={() => handleRoleSwitch(role)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                        role === currentRole
                          ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <IconComponent size={16} />
                      <span className="text-sm font-medium">{meta.name}</span>
                      {role === currentRole && (
                        <Check size={14} className="ml-auto text-green-600 dark:text-green-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Available roles: {userRoles.map(role => roleMetadata[role].name).join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
