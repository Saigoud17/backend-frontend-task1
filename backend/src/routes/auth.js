const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication routes
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sai Kiran Goud
 *               email:
 *                 type: string
 *                 example: saikiran@example.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post(
    '/register', [
        body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
        body('email').isEmail().withMessage('Enter a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    validate,
    register
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: saikiran@example.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: Login successful (JWT token returned)
 *       401:
 *         description: Invalid credentials
 */
router.post(
    '/login', [
        body('email').isEmail().withMessage('Enter a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    validate,
    login
);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout the currently authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', authenticate, (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;