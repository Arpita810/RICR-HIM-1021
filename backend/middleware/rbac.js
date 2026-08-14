/**
 * RBAC (Role-Based Access Control) Middleware
 * Enforces role-based access to endpoints
 * All checks are performed on verified JWT, never trusting frontend claims
 */

/**
 * Citizen-only middleware
 * Verifies that req.user.role === 'citizen'
 */
export const citizenOnly = (req, res, next) => {
      if (!req.user) {
            return res.status(401).json({
                  success: false,
                  message: 'Authentication required',
            });
      }

      if (req.user.role !== 'citizen') {
            return res.status(403).json({
                  success: false,
                  message: 'Access denied. This resource requires Citizen role.',
                  userRole: req.user.role,
            });
      }

      next();
};

/**
 * Admin-only middleware
 * Verifies that req.user.role === 'admin'
 */
export const adminOnly = (req, res, next) => {
      if (!req.user) {
            return res.status(401).json({
                  success: false,
                  message: 'Authentication required',
            });
      }

      if (req.user.role !== 'admin') {
            return res.status(403).json({
                  success: false,
                  message: 'Access denied. This resource requires Admin role.',
                  userRole: req.user.role,
            });
      }

      next();
};

/**
 * Verify data ownership for citizens
 * Ensures a citizen can only access their own profile/complaints
 * Usage: verifyDataOwnership(req, req.user.id, userId)
 * Throws: 403 if IDs don't match
 */
export const verifyDataOwnership = (req, userIdFromToken, userIdFromRequest) => {
      // CRITICAL: Always use ID from verified JWT, never from request body/params
      if (userIdFromToken.toString() !== userIdFromRequest.toString()) {
            return {
                  allowed: false,
                  statusCode: 403,
                  message: 'Access denied. You can only access your own data.',
            };
      }

      return { allowed: true };
};

/**
 * Data ownership check middleware factory
 * Use this to automatically check data ownership in routes
 * Expects userId to be in req.params.id or req.params.userId
 */
export const checkDataOwnership = (idParamName = 'id') => {
      return (req, res, next) => {
            if (req.user.role !== 'citizen') {
                  // Only apply to citizens; admins can access all data
                  return next();
            }

            const requestedId = req.params[idParamName];
            const verification = verifyDataOwnership(req, req.user.id, requestedId);

            if (!verification.allowed) {
                  return res.status(verification.statusCode).json({
                        success: false,
                        message: verification.message,
                  });
            }

            next();
      };
};

/**
 * Verify admin can access department data
 * Department-scoped admins can only access their managed department
 * Super admins can access all departments
 */
export const verifyAdminDepartmentAccess = (adminDepartment, requestedDepartment, adminLevel = 'department_admin') => {
      if (adminLevel === 'super_admin') {
            return { allowed: true };
      }

      if (adminDepartment?.toLowerCase() === requestedDepartment?.toLowerCase()) {
            return { allowed: true };
      }

      return {
            allowed: false,
            statusCode: 403,
            message: 'Access denied. You can only manage your assigned department.',
      };
};

/**
 * Department access check middleware factory
 * Use this to enforce department-scoped access for admins
 * Expects department to be in req.params.department, req.query.department, or req.body.department
 */
export const checkAdminDepartmentAccess = (departmentParamName = 'department') => {
      return (req, res, next) => {
            if (req.user.role !== 'admin') {
                  // Only apply to admins
                  return next();
            }

            const requestedDepartment = 
                  req.params[departmentParamName] || 
                  req.query.department || 
                  req.body?.department;

            if (!requestedDepartment) {
                  // No department specified, skip check
                  return next();
            }

            const verification = verifyAdminDepartmentAccess(
                  req.user.managedDepartment,
                  requestedDepartment,
                  req.user.adminLevel
            );

            if (!verification.allowed) {
                  return res.status(verification.statusCode).json({
                        success: false,
                        message: verification.message,
                  });
            }

            next();
      };
};

/**
 * Ensure request is for authenticated user's own data
 * Extracts userId from JWT and checks it against request params/body
 * Middleware for citizen-only endpoints
 */
export const ensureOwnData = (req, res, next) => {
      if (req.user.role !== 'citizen') {
            return res.status(403).json({
                  success: false,
                  message: 'This operation requires Citizen role.',
            });
      }

      // Attach authenticated user ID for use in controller
      req.authenticatedUserId = req.user.id;

      // If URL contains userId/id parameter, verify it matches authenticated user
      if (req.params.userId || req.params.id) {
            const requestedId = req.params.userId || req.params.id;
            if (requestedId !== req.user.id.toString()) {
                  return res.status(403).json({
                        success: false,
                        message: 'Access denied. You can only access your own data.',
                  });
            }
      }

      next();
};

/**
 * Combined middleware: Citizen role + data ownership check
 * Use for endpoints that should only allow citizens to access their own data
 */
export const citizenOwnDataOnly = [citizenOnly, ensureOwnData];

/**
 * Combined middleware: Admin role + department access check
 * Use for endpoints that should only allow admins to access their department
 */
export const adminOwnDepartmentOnly = [adminOnly, checkAdminDepartmentAccess()];
