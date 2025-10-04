/**
 * Authentication Routes
 */

const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

/**
 * @route POST /api/v1/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post(
  '/register',
  authLimiter,
  validate(schemas.register),
  authController.register
);

/**
 * @route POST /api/v1/auth/login
 * @desc Login user
 * @access Public
 */
router.post(
  '/login',
  authLimiter,
  validate(schemas.login),
  authController.login
);

/**
 * @route POST /api/v1/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post('/refresh', authController.refreshToken);

/**
 * @route POST /api/v1/auth/logout
 * @desc Logout user
 * @access Private
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @route GET /api/v1/auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', authenticate, authController.getMe);

/**
 * @route PATCH /api/v1/auth/me
 * @desc Update user profile
 * @access Private
 */
router.patch(
  '/me',
  authenticate,
  validate(schemas.updateProfile),
  authController.updateMe
);

/**
 * @route PATCH /api/v1/auth/change-password
 * @desc Change user password
 * @access Private
 */
router.patch(
  '/change-password',
  authenticate,
  authController.changePassword
);

/**
 * @route DELETE /api/v1/auth/me
 * @desc Delete user account
 * @access Private
 */
router.delete('/me', authenticate, authController.deleteAccount);

/**
 * @route PATCH /api/v1/auth/location
 * @desc Update user location
 * @access Private
 */
router.patch('/location', authenticate, authController.updateLocation);

module.exports = router;
