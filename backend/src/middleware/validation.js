/**
 * Request Validation Middleware using Joi
 */

const Joi = require('joi');
const AppError = require('../utils/appError');

/**
 * Validate request data against a Joi schema
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
const validate = (schema) => {
  return (req, res, next) => {
    const validationOptions = {
      abortEarly: false, // Return all errors
      allowUnknown: true, // Allow unknown keys
      stripUnknown: true, // Remove unknown keys
    };

    const { error, value } = schema.validate(
      {
        body: req.body,
        query: req.query,
        params: req.params,
      },
      validationOptions
    );

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      return next(new AppError(errorMessage, 400));
    }

    // Replace request data with validated data
    req.body = value.body || req.body;
    req.query = value.query || req.query;
    req.params = value.params || req.params;

    next();
  };
};

/**
 * Common validation schemas
 */
const schemas = {
  // User registration
  register: Joi.object({
    body: Joi.object({
      username: Joi.string().min(3).max(50).optional(),
      full_name: Joi.string().min(3).max(100).optional(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      phone_number: Joi.string().optional(),
      phone: Joi.string().optional(),
      role: Joi.string().valid('citizen', 'responder').default('citizen'),
    }).or('username', 'full_name'),
  }),

  // User login
  login: Joi.object({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),

  // Update profile
  updateProfile: Joi.object({
    body: Joi.object({
      username: Joi.string().alphanum().min(3).max(50).optional(),
      phone_number: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
      profile_picture: Joi.string().uri().optional(),
    }),
  }),

  // Emergency creation
  createEmergency: Joi.object({
    body: Joi.object({
      type: Joi.string()
        .valid('accident', 'fire', 'medical', 'flood', 'security', 'earthquake', 'other')
        .required(),
      title: Joi.string().min(5).max(255).required(),
      description: Joi.string().min(10).max(2000).optional(),
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
      address: Joi.string().max(500).optional(),
      severity: Joi.number().integer().min(1).max(5).default(3),
      is_anonymous: Joi.boolean().default(false),
    }),
  }),

  // Update emergency
  updateEmergency: Joi.object({
    params: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
    body: Joi.object({
      status: Joi.string().valid('active', 'in_progress', 'resolved', 'false_alarm').optional(),
      description: Joi.string().min(10).max(2000).optional(),
    }),
  }),

  // Get nearby emergencies
  getNearbyEmergencies: Joi.object({
    query: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
      radius: Joi.number().integer().min(100).max(50000).default(5000),
      type: Joi.string()
        .valid('accident', 'fire', 'medical', 'flood', 'security', 'earthquake', 'other')
        .optional(),
      status: Joi.string()
        .valid('active', 'in_progress', 'resolved', 'false_alarm')
        .default('active'),
      limit: Joi.number().integer().min(1).max(100).default(50),
      offset: Joi.number().integer().min(0).default(0),
    }),
  }),

  // Vote on emergency
  voteEmergency: Joi.object({
    params: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
    body: Joi.object({
      vote_type: Joi.string().valid('upvote', 'downvote').required(),
    }),
  }),

  // Create SOS alert
  createSOS: Joi.object({
    body: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
      address: Joi.string().max(500).optional(),
      emergency_contact: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
      radius: Joi.number().integer().min(1000).max(50000).default(10000),
      message: Joi.string().max(500).optional(),
    }),
  }),

  // Get nearest facility
  getNearestFacility: Joi.object({
    query: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
      type: Joi.string()
        .valid('hospital', 'police_station', 'fire_station', 'shelter', 'pharmacy', 'other')
        .required(),
      limit: Joi.number().integer().min(1).max(20).default(5),
    }),
  }),

  // Create community post
  createCommunityPost: Joi.object({
    body: Joi.object({
      title: Joi.string().min(5).max(255).required(),
      description: Joi.string().min(10).max(2000).required(),
      latitude: Joi.number().min(-90).max(90).optional(),
      longitude: Joi.number().min(-180).max(180).optional(),
      address: Joi.string().max(500).optional(),
      post_type: Joi.string().max(50).default('general'),
    }),
  }),

  // Pagination
  pagination: Joi.object({
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
      sort_by: Joi.string().default('created_at'),
      order: Joi.string().valid('asc', 'desc').default('desc'),
    }),
  }),
};

module.exports = {
  validate,
  schemas,
};
