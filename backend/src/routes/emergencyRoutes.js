/**
 * Emergency Routes
 */

const express = require('express');
const emergencyController = require('../controllers/emergencyController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { emergencyCreationLimiter, votingLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

/**
 * @route POST /api/v1/emergencies
 * @desc Create a new emergency report
 * @access Private
 */
router.post(
  '/',
  authenticate,
  emergencyCreationLimiter,
  validate(schemas.createEmergency),
  emergencyController.createEmergency
);

/**
 * @route GET /api/v1/emergencies/nearby
 * @desc Get nearby emergencies
 * @access Public
 */
router.get(
  '/nearby',
  validate(schemas.getNearbyEmergencies),
  emergencyController.getNearbyEmergencies
);

/**
 * @route GET /api/v1/emergencies/my-reports
 * @desc Get current user's emergency reports
 * @access Private
 */
router.get(
  '/my-reports',
  authenticate,
  validate(schemas.pagination),
  emergencyController.getMyEmergencies
);

/**
 * @route GET /api/v1/emergencies/stats
 * @desc Get emergency statistics
 * @access Public
 */
router.get('/stats', emergencyController.getEmergencyStats);

/**
 * @route GET /api/v1/emergencies/:id
 * @desc Get emergency by ID
 * @access Public
 */
router.get('/:id', emergencyController.getEmergency);

/**
 * @route PATCH /api/v1/emergencies/:id
 * @desc Update emergency status or description
 * @access Private
 */
router.patch(
  '/:id',
  authenticate,
  validate(schemas.updateEmergency),
  emergencyController.updateEmergency
);

/**
 * @route DELETE /api/v1/emergencies/:id
 * @desc Delete an emergency
 * @access Private
 */
router.delete('/:id', authenticate, emergencyController.deleteEmergency);

/**
 * @route POST /api/v1/emergencies/:id/vote
 * @desc Vote on an emergency (upvote/downvote)
 * @access Private
 */
router.post(
  '/:id/vote',
  authenticate,
  votingLimiter,
  validate(schemas.voteEmergency),
  emergencyController.voteEmergency
);

module.exports = router;
