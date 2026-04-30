/**
 * useRoles.js
 * ─────────────────────────────────────────────────────────
 * Hook for USER role state only.
 * Admin is a system flag — it is NOT included in the user
 * roles array and does NOT affect RoleSwitcher or activeRole.
 *
 * Use isAdmin() separately wherever admin-only gates are needed.
 * ─────────────────────────────────────────────────────────
 */
import { useAppContext } from '../context/AppContext';
import {
  getUserRoles,
  getActiveRole,
  isBuyer,
  isSeller,
  isCreator,
  isSwapper,
  isAdmin,
} from '../utils/rolePermissions';

export const useRoles = () => {
  const { user } = useAppContext();

  // getUserRoles already excludes 'admin' from the user role list
  const roles      = getUserRoles(user);
  const activeRole = getActiveRole(user);

  return {
    user,
    roles,       // never contains 'admin'
    activeRole,  // never 'admin'

    isBuyer:   isBuyer(user),
    isSeller:  isSeller(user),
    isCreator: isCreator(user),
    isSwapper: isSwapper(user),
    isAdmin:   isAdmin(user),   // separate flag — does not affect roles[]

    hasRole: (role) => roles.includes(role),
  };
};