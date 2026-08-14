import jwt from 'jsonwebtoken';
import {
      findAdminByAuthClaims,
      resolveDepartmentForAdmin,
      toReqAdmin,
      isAdminJwt,
} from '../utils/adminAuth.js';

/**
 * protectAdmin — Verifies JWT and ensures the user is an admin.
 * Sets req.admin with admin context for backward compatibility with admin controllers.
 * Also sets req.user for consistency with the consolidated auth system.
 */
export const protectAdmin = async (req, res, next) => {
      let token;

      if (req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
      } else if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.slice(6).trim();
      } else if (req.cookies?.token) {
            token = req.cookies.token;
      }

      if (!token) {
            return res.status(401).json({
                  success: false,
                  message: 'Authentication required',
                  code: 'NO_TOKEN',
            });
      }

      try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // SECURITY: Verify role from JWT claims — must be admin
            if (!isAdminJwt(decoded)) {
                  return res.status(403).json({
                        success: false,
                        message: 'Access denied. Admin role required.',
                        code: 'INVALID_ROLE',
                  });
            }

            // DB lookup to confirm admin still exists and is active
            const found = await findAdminByAuthClaims(decoded);
            const department = resolveDepartmentForAdmin(found?.doc, decoded, req);

            if (!department) {
                  return res.status(403).json({
                        success: false,
                        message: 'Department missing. Log out and sign in again with your department.',
                        code: 'ADMIN_DEPARTMENT_MISSING',
                  });
            }

            req.admin = toReqAdmin(found?.doc, decoded, department);

            if (!req.admin.id) {
                  return res.status(401).json({
                        success: false,
                        message: 'Invalid admin session. Please log in again.',
                        code: 'INVALID_ADMIN_ID',
                  });
            }

            // Stale JWT id but valid email — use current DB id so MongoDB refs work
            if (found?.doc?._id && String(found.doc._id) !== String(decoded.id || '')) {
                  req.admin.id = found.doc._id.toString();
                  req.admin._id = req.admin.id;
            }

            // Also set req.user for consistency with consolidated auth system
            req.user = {
                  _id: req.admin.id,
                  id: req.admin.id,
                  name: req.admin.name,
                  email: req.admin.email,
                  role: 'admin',
                  department: req.admin.department,
                  managedDepartment: req.admin.department,
                  adminLevel: req.admin.adminLevel || 'department_admin',
                  isActive: true,
            };

            return next();
      } catch (error) {
            const msg = error.name === 'TokenExpiredError'
                  ? 'Session expired. Please log in again.'
                  : 'Invalid token. Please log in again.';
            return res.status(401).json({ success: false, message: msg, code: 'INVALID_TOKEN' });
      }
};
