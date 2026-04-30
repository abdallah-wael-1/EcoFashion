import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from '../../utils/icons';
import { useAppContext } from '../../context/AppContext';
import { useRoles } from '../../hooks/useRoles';
import { availableRoles, roleMetadata, getRoleBadgeColor } from '../../config/rolesConfig';

const roleDescriptions = {
  buyer:   'Purchase sustainable fashion',
  seller:  'Sell your preloved items',
  creator: 'Upcycle & create new designs',
  swapper: 'Exchange items with other users',
};

const RoleManager = () => {
  const { switchActiveRole, addRole, removeRole } = useAppContext();
  const { user, roles: userRoles, activeRole } = useRoles();
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!showDropdown) return;
    const handleOutside = (e) => {
      const clickedButton = buttonRef.current?.contains(e.target);
      const clickedDropdown = dropdownRef.current?.contains(e.target);
      if (!clickedButton && !clickedDropdown) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [showDropdown]);

  if (!user) return null;

  const currentRole = activeRole || 'buyer';
  const currentRoleMeta = roleMetadata[currentRole] || roleMetadata.buyer;
  const CurrentRoleIcon = currentRoleMeta.icon;

  const handleToggle = () => {
    if (!showDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
      });
    }
    setShowDropdown((prev) => !prev);
  };

  const handleRoleSwitch = (role) => {
    if (!userRoles.includes(role)) return;
    if (role !== currentRole) {
      switchActiveRole(role);
      setShowDropdown(false);
      return;
    }

    setShowDropdown(false);
  };

  const handleRoleToggle = (role) => {
    const isAssigned = userRoles.includes(role);
    if (isAssigned) {
      if (userRoles.length <= 1) return;
      removeRole(role);
      return;
    }
    addRole(role);
  };

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {/* Active role badge */}
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap ${getRoleBadgeColor(currentRole)}`}>
        <CurrentRoleIcon size={12} />
        {currentRoleMeta.name}
      </span>


      {showDropdown && createPortal(
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-[9998]" onClick={() => setShowDropdown(false)} />

          {/* Dropdown */}
          <div
            ref={dropdownRef}
            className="fixed z-[9999] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden w-[300px]"
            style={{ top: dropdownPos.top, right: dropdownPos.right }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Switch Role</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">What would you like to do?</p>
            </div>

            {/* Roles — show only user's assigned roles */}
            <div className="p-3 space-y-2">
              {userRoles.map((role) => {
                const meta = roleMetadata[role];
                const IconComponent = meta.icon;
                const isActive = role === currentRole;

                return (
                  <button
                    key={role}
                    onClick={() => handleRoleSwitch(role)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border-2 text-left transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-500'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      isActive
                        ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      <IconComponent size={17} />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isActive ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                        {meta.name}
                      </p>
                      <p className={`text-xs mt-0.5 ${isActive ? 'text-green-600 dark:text-green-500' : 'text-gray-500 dark:text-gray-400'}`}>
                        {roleDescriptions[role]}
                      </p>
                    </div>

                    {/* State indicators */}
                    {isActive ? (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 flex-shrink-0">
                        <Check size={11} className="text-white" strokeWidth={3} />
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* Manage roles */}
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Manage Roles</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Toggle the roles attached to your account.</p>
            </div>
            <div className="p-3 space-y-2">
              {availableRoles.map((role) => {
                const meta = roleMetadata[role];
                const assigned = userRoles.includes(role);
                const disableRemove = assigned && userRoles.length <= 1;

                return (
                  <button
                    key={role}
                    onClick={() => handleRoleToggle(role)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border-2 text-left transition-all duration-150 ${
                      assigned
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-500'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'
                    } ${disableRemove ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                    disabled={disableRemove}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      assigned
                        ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      <Check size={16} className={assigned ? 'text-white' : 'opacity-0'} strokeWidth={3} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${assigned ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                        {meta.name}
                      </p>
                      <p className="text-xs mt-0.5 text-gray-500 dark:text-gray-400">{roleDescriptions[role]}</p>
                    </div>

                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
                      {assigned ? 'Assigned' : 'Add'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                Your active role controls available dashboard actions
              </p>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

// Refresh export
export default RoleManager;
















