import { ROLES } from './constants';

/**
 * Check if user has required role
 * @param {string} userRole - Current user's role
 * @param {string|string[]} requiredRoles - Required role(s)
 * @returns {boolean}
 */
export function hasRole(userRole, requiredRoles) {
  if (!userRole) return false;
  if (!requiredRoles) return true;

  const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return rolesArray.includes(userRole);
}

/**
 * Check if user is admin
 * @param {string} userRole - Current user's role
 * @returns {boolean}
 */
export function isAdmin(userRole) {
  return userRole === ROLES.ADMIN;
}

/**
 * Check if user is staff or admin
 * @param {string} userRole - Current user's role
 * @returns {boolean}
 */
export function isStaffOrAdmin(userRole) {
  return userRole === ROLES.ADMIN || userRole === ROLES.STAFF;
}

/**
 * Get accessible routes based on user role
 * @param {string} userRole - Current user's role
 * @returns {object[]}
 */
export function getAccessibleRoutes(userRole) {
  const routes = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: 'LayoutDashboard',
      roles: [ROLES.ADMIN, ROLES.STAFF, ROLES.CUSTOMER],
    },
    {
      path: '/inventory',
      name: 'Inventory',
      icon: 'Package',
      roles: [ROLES.ADMIN, ROLES.STAFF],
    },
    {
      path: '/orders',
      name: 'Orders',
      icon: 'ShoppingCart',
      roles: [ROLES.ADMIN, ROLES.STAFF, ROLES.CUSTOMER],
    },
    {
      path: '/suppliers',
      name: 'Suppliers',
      icon: 'Truck',
      roles: [ROLES.ADMIN],
    },
    {
      path: '/purchases',
      name: 'Purchases',
      icon: 'ShoppingBag',
      roles: [ROLES.ADMIN, ROLES.STAFF],
    },
    {
      path: '/reports',
      name: 'Reports',
      icon: 'BarChart3',
      roles: [ROLES.ADMIN],
    },
  ];

  return routes.filter((route) => route.roles.includes(userRole));
}

/**
 * Check if user can perform action on resource
 * @param {string} userRole - Current user's role
 * @param {string} action - Action to perform (create, read, update, delete)
 * @param {string} resource - Resource type
 * @returns {boolean}
 */
export function canPerformAction(userRole, action, resource) {
  const permissions = {
    [ROLES.ADMIN]: {
      products: ['create', 'read', 'update', 'delete'],
      orders: ['create', 'read', 'update', 'delete'],
      suppliers: ['create', 'read', 'update', 'delete'],
      purchases: ['create', 'read', 'update', 'delete'],
      reports: ['read'],
      users: ['create', 'read', 'update', 'delete'],
    },
    [ROLES.STAFF]: {
      products: ['create', 'read', 'update'],
      orders: ['create', 'read', 'update'],
      suppliers: ['read'],
      purchases: ['create', 'read', 'update'],
      reports: ['read'],
    },
    [ROLES.CUSTOMER]: {
      products: ['read'],
      orders: ['create', 'read'],
    },
  };

  const userPermissions = permissions[userRole];
  if (!userPermissions || !userPermissions[resource]) return false;

  return userPermissions[resource].includes(action);
}

/**
 * Filter menu items based on user role
 * @param {object[]} menuItems - Array of menu items
 * @param {string} userRole - Current user's role
 * @returns {object[]}
 */
export function filterMenuByRole(menuItems, userRole) {
  return menuItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  });
}
