import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, X } from '../../utils/icons';
import { useAppContext } from '../../context/AppContext';
import { useRoles } from '../../hooks/useRoles';
import { availableRoles, roleMetadata, getRoleBadgeColor } from '../../config/rolesConfig';

const ROLE_DESC = {
  buyer:   'Purchase sustainable fashion',
  seller:  'Sell your preloved items',
  creator: 'Upcycle & create new designs',
  swapper: 'Exchange items with other users',
};

const RoleSwitcher = () => {
  const { user, switchActiveRole, addRole, removeRole } = useAppContext();
  const { roles: currentRoles, activeRole } = useRoles();

  const [showDropdown,   setShowDropdown]   = useState(false);
  const [showManage,     setShowManage]     = useState(false);
  const [dropdownPos,    setDropdownPos]    = useState({ top: 0, right: 0, left: 'auto', mobileCenter: false });

  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!showDropdown) return;
    const handler = (e) => {
      const clickedButton = buttonRef.current?.contains(e.target);
      const clickedDropdown = dropdownRef.current?.contains(e.target);

      if (!clickedButton && !clickedDropdown) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showDropdown]);

  if (!user) return null;

  const activeMeta   = roleMetadata[activeRole] || roleMetadata.buyer;
  const ActiveIcon   = activeMeta.icon;

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!showDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const isMobileViewport = window.innerWidth < 640;
      setDropdownPos(
        isMobileViewport
          ? { top: rect.bottom + 8, left: '50%', right: 'auto', mobileCenter: true }
          : { top: rect.bottom + 6, right: window.innerWidth - rect.right, left: 'auto', mobileCenter: false }
      );
    }
    setShowDropdown(p => !p);
  };

  const handleSwitch = (role) => {
    if (!currentRoles.includes(role)) return;
    switchActiveRole(role);
    setShowDropdown(false);
  };

  const handleToggleRole = (role) => {
    const assigned = currentRoles.includes(role);
    if (assigned) {
      if (currentRoles.length <= 1) return; // keep at least 1
      removeRole(role);
    } else {
      addRole(role);
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold
          transition-all duration-200 cursor-pointer whitespace-nowrap ${getRoleBadgeColor(activeRole)}`}
      >
        <ActiveIcon size={12} className="shrink-0" />
        <span>{activeMeta.name}</span>
        <ChevronDown size={11} className={`transition-transform duration-200 shrink-0 ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {/* ── Dropdown portal ── */}
      {showDropdown && createPortal(
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setShowDropdown(false)} />
          <div
            ref={dropdownRef}
            className="fixed z-[9999] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl
              border border-gray-200 dark:border-gray-700 overflow-hidden w-[min(92vw,340px)] sm:w-[300px]"
            style={{
              top: dropdownPos.top,
              right: dropdownPos.right,
              left: dropdownPos.left,
              transform: dropdownPos.mobileCenter ? 'translateX(-50%)' : 'none',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <p className="text-sm font-bold text-gray-900 dark:text-white">Active Role</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Switch between your assigned roles</p>
            </div>

            {/* Active roles badges */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Your roles</p>
              <div className="flex flex-wrap gap-1.5">
                {currentRoles.map(role => (
                  <span
                    key={role}
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold
                      ${getRoleBadgeColor(role)}`}
                  >
                    {roleMetadata[role]?.name || role}
                  </span>
                ))}
              </div>
            </div>

            {/* Switch role list */}
            <div className="p-3 space-y-1.5">
              {currentRoles.map(role => {
                const meta    = roleMetadata[role] || {};
                const Icon    = meta.icon;
                const isActive = role === activeRole;
                return (
                  <button
                    key={role}
                    onClick={() => handleSwitch(role)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border-2 text-left
                      transition-all duration-150 cursor-pointer
                      ${isActive
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-500'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'}`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0
                      ${isActive
                        ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                      {Icon && <Icon size={17} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${isActive ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                        {meta.name}
                      </p>
                      <p className={`text-xs mt-0.5 ${isActive ? 'text-green-600 dark:text-green-500' : 'text-gray-500 dark:text-gray-400'}`}>
                        {ROLE_DESC[role]}
                      </p>
                    </div>
                    {isActive && (
                      <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                        <Check size={11} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Manage roles button */}
            <div className="px-3 pb-3">
              <button
                onClick={() => { setShowDropdown(false); setShowManage(true); }}
                className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                  text-sm font-semibold text-gray-700 dark:text-gray-300
                  hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                ⚙ Manage Roles
              </button>
            </div>

            <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                Active role controls your dashboard actions
              </p>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* ── Manage Roles Modal ── */}
      {showManage && createPortal(
        <>
          <div
            className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
            onClick={() => setShowManage(false)}
          />
          <div className="fixed inset-x-4 top-1/2 z-[10000] mx-auto w-[min(420px,calc(100%-2rem))]
            -translate-y-1/2 overflow-hidden rounded-3xl border border-gray-200
            dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl">

            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Manage Roles</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Add or remove roles from your account</p>
              </div>
              <button
                onClick={() => setShowManage(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800
                  hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {/* All available roles */}
            <div className="p-4 space-y-2">
              {availableRoles.map(role => {
                const meta     = roleMetadata[role] || {};
                const Icon     = meta.icon;
                const assigned = currentRoles.includes(role);
                const cantRemove = assigned && currentRoles.length <= 1;

                return (
                  <button
                    key={role}
                    onClick={() => !cantRemove && handleToggleRole(role)}
                    disabled={cantRemove}
                    className={`w-full flex items-center gap-3 rounded-2xl border px-4 py-3 text-left
                      transition-all duration-150
                      ${assigned
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-500'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'}
                      ${cantRemove ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'}`}
                  >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0
                      ${assigned ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                      {assigned ? <Check size={18} /> : (Icon && <Icon size={18} />)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${assigned ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                        {meta.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ROLE_DESC[role]}</p>
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider
                      ${assigned ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                      {cantRemove ? 'Required' : assigned ? 'Assigned' : 'Add'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-3 flex justify-end">
              <button
                onClick={() => setShowManage(false)}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-green-600 hover:bg-green-700
                  text-white transition-colors cursor-pointer">
                Done
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
};

export default RoleSwitcher;