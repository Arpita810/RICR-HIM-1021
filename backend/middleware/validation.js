import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.mapped(),
        });
    }
    return next();
};

export const registerValidators = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/)
        .withMessage('Password must contain uppercase, lowercase, and a number'),
    body('phone')
        .optional({ values: 'falsy' })
        .matches(/^[6-9]\d{9}$/)
        .withMessage('Phone must be a valid 10-digit Indian mobile number'),
];

export const loginValidators = [
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

export const forgotPasswordValidators = [
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
];

export const resetPasswordValidators = [
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/)
        .withMessage('Password must contain uppercase, lowercase, and a number'),
];

export const createComplaintValidators = [
    body('title')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Title must be between 5 and 200 characters'),
    body('description')
        .trim()
        .isLength({ min: 20, max: 2000 })
        .withMessage('Description must be between 20 and 2000 characters'),
    body('category')
        .trim()
        .isIn(['electricity', 'water_supply', 'roads_transport', 'sanitation', 'police', 'healthcare', 'municipal', 'education', 'other'])
        .withMessage('Invalid complaint category'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'emergency'])
        .withMessage('Invalid priority value'),
];
