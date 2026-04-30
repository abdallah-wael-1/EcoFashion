/**
 * rolePermissions.js
 * ─────────────────────────────────────────────────────────
 * Pure utility functions for role resolution.
 *
 * KEY DESIGN DECISION:
 *   'admin' is a superuser flag, NOT a user role.
 *   getUserRoles() deliberately excludes 'admin' so that:
 *     - RoleSwitcher never shows an Admin option
 *     - activeRole is never 'admin'
 *     - UserDashboard role logic is never polluted
 *   Admin access is checked separately via isAdmin().
 * ─────────────────────────────────────────────────────────
 */

// Roles available to regular users (admin intentionally omitted)
const USER_ROLES = ['buyer', 'seller', 'creator', 'swapper'];

/**
 * Returns the normalized list of USER roles for a given user object.
 * Admin is excluded — use isAdmin() separately.
 */
export const getUserRoles = (user) => {
  if (!user) return [];

  const roleList = Array.isArray(user.roles) ? user.roles : [];

  const normalized = [...new Set(
    roleList
      .map((r) => (typeof r === 'string' ? r.toLowerCase() : ''))
      .filter((r) => USER_ROLES.includes(r))  // admin filtered here
  )];

  // Fallback to user.role (singular)
  if (!normalized.length && typeof user.role === 'string') {
    const fb = user.role.toLowerCase();
    if (USER_ROLES.includes(fb)) normalized.push(fb);
  }

  // Fallback to user.activeRole
  if (!normalized.length && typeof user.activeRole === 'string') {
    const fb = user.activeRole.toLowerCase();
    if (USER_ROLES.includes(fb)) normalized.push(fb);
  }

  return normalized.length ? normalized : ['buyer'];
};

/**
 * Returns the currently active USER role.
 * Never returns 'admin'.
 */
export const getActiveRole = (user) => {
  const roles = getUserRoles(user);

  if (user?.activeRole && roles.includes(user.activeRole)) {
    return user.activeRole;
  }

  return roles[0] || 'buyer';
};

// ─── Role presence checks ─────────────────────────────────────────────────────

export const isBuyer   = (user) => getUserRoles(user).includes('buyer');
export const isSeller  = (user) => getUserRoles(user).includes('seller');
export const isCreator = (user) => getUserRoles(user).includes('creator');
export const isSwapper = (user) => getUserRoles(user).includes('swapper');

/**
 * Admin check uses the raw roles array (not getUserRoles) so that
 * a user with roles: ['admin'] is still correctly identified.
 */
export const isAdmin = (user) => {
  if (!user) return false;
  const raw = Array.isArray(user.roles) ? user.roles : [];
  if (raw.map((r) => r?.toLowerCase()).includes('admin')) return true;
  if (typeof user.role === 'string' && user.role.toLowerCase() === 'admin') return true;
  return false;
};

/**
 * Helper to identify regular (non-admin) users.
 * Used for UI elements that should be hidden from admins.
 */
export const isRegularUser = (user) => !isAdmin(user);

// ─── Active-role checks (UI context only) ────────────────────────────────────

export const isActiveBuyer   = (user) => getActiveRole(user) === 'buyer';
export const isActiveSeller  = (user) => getActiveRole(user) === 'seller';
export const isActiveCreator = (user) => getActiveRole(user) === 'creator';
export const isActiveSwapper = (user) => getActiveRole(user) === 'swapper';

// ─── Feature-access gates ─────────────────────────────────────────────────────

export const canAccessSwapFeatures   = (user) => isSwapper(user);
export const canAccessSellerFeatures = (user) => isSeller(user)   || isAdmin(user);
export const canAccessCreatorFeatures= (user) => isCreator(user)  || isAdmin(user);
export const canAccessBuyerFeatures  = (user) => isBuyer(user)    || isAdmin(user);
export const canAccessAdminFeatures  = (user) => isAdmin(user);
export const hasAllPermissions       = (user) => isAdmin(user);