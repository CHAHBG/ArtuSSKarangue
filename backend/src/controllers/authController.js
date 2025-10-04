/**
 * Authentication Controller
 * Handles user registration, login, and token management
 */

const { query, getClient } = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/password');
const {
  generateTokens,
  saveRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  setTokenCookie,
  clearTokenCookie,
} = require('../utils/jwt');
const { setCache, deleteCache } = require('../config/redis');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');
const { catchAsync } = require('../middleware/errorHandler');

/**
 * Register a new user
 * @route POST /api/v1/auth/register
 * @access Public
 */
exports.register = catchAsync(async (req, res, next) => {
  const { username, full_name, email, password, phone_number, phone, role } = req.body;
  
  // Use full_name if username not provided
  const finalUsername = username || full_name;
  const finalPhone = phone_number || phone;

  // Check if user already exists
  const existingUser = await query(
    'SELECT id FROM users WHERE email = $1 OR username = $2',
    [email, finalUsername]
  );

  if (existingUser.rows.length > 0) {
    return next(new AppError('User with this email or username already exists', 400));
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const result = await query(
    `INSERT INTO users (username, email, password_hash, phone_number, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, username, email, phone_number, role, created_at`,
    [finalUsername, email, passwordHash, finalPhone || null, role || 'citizen']
  );

  const user = result.rows[0];

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id);

  // Save refresh token
  await saveRefreshToken(user.id, refreshToken);

  // Set cookie
  setTokenCookie(res, accessToken);

  // Log audit
  await query(
    `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address)
     VALUES ($1, $2, $3, $4, $5)`,
    [user.id, 'REGISTER', 'user', user.id, req.ip]
  );

  logger.info(`User registered: ${user.email}`);

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        created_at: user.created_at,
      },
      accessToken,
      refreshToken,
    },
  });
});

/**
 * Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user
  const result = await query(
    `SELECT id, username, email, password_hash, phone_number, role, 
            profile_picture, is_verified, is_active
     FROM users WHERE email = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    return next(new AppError('Invalid email or password', 401));
  }

  const user = result.rows[0];

  // Check if account is active
  if (!user.is_active) {
    return next(new AppError('Your account has been deactivated. Please contact support.', 403));
  }

  // Compare password
  const isPasswordValid = await comparePassword(password, user.password_hash);

  if (!isPasswordValid) {
    // Log failed attempt
    await query(
      `INSERT INTO audit_logs (user_id, action, entity_type, ip_address, metadata)
       VALUES ($1, $2, $3, $4, $5)`,
      [user.id, 'LOGIN_FAILED', 'user', req.ip, JSON.stringify({ reason: 'Invalid password' })]
    );

    return next(new AppError('Invalid email or password', 401));
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id);

  // Save refresh token
  await saveRefreshToken(user.id, refreshToken);

  // Set cookie
  setTokenCookie(res, accessToken);

  // Cache user data
  await setCache(`user:${user.id}`, {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  }, 3600);

  // Log successful login
  await query(
    `INSERT INTO audit_logs (user_id, action, entity_type, ip_address)
     VALUES ($1, $2, $3, $4)`,
    [user.id, 'LOGIN_SUCCESS', 'user', req.ip]
  );

  logger.info(`User logged in: ${user.email}`);

  // Remove password_hash from response
  delete user.password_hash;

  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: {
      user,
      accessToken,
      refreshToken,
    },
  });
});

/**
 * Refresh access token
 * @route POST /api/v1/auth/refresh
 * @access Public
 */
exports.refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new AppError('Refresh token is required', 400));
  }

  // Verify refresh token
  const decoded = await verifyRefreshToken(refreshToken);

  // Generate new tokens
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

  // Save new refresh token and revoke old one
  await revokeRefreshToken(refreshToken);
  await saveRefreshToken(decoded.userId, newRefreshToken);

  // Set cookie
  setTokenCookie(res, accessToken);

  res.status(200).json({
    status: 'success',
    message: 'Token refreshed successfully',
    data: {
      accessToken,
      refreshToken: newRefreshToken,
    },
  });
});

/**
 * Logout user
 * @route POST /api/v1/auth/logout
 * @access Private
 */
exports.logout = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    // Revoke refresh token
    await revokeRefreshToken(refreshToken);
  }

  // Clear cookie
  clearTokenCookie(res);

  // Clear user cache
  if (req.user) {
    await deleteCache(`user:${req.user.id}`);

    // Log logout
    await query(
      `INSERT INTO audit_logs (user_id, action, entity_type, ip_address)
       VALUES ($1, $2, $3, $4)`,
      [req.user.id, 'LOGOUT', 'user', req.ip]
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Logout successful',
  });
});

/**
 * Get current user profile
 * @route GET /api/v1/auth/me
 * @access Private
 */
exports.getMe = catchAsync(async (req, res, next) => {
  const result = await query(
    `SELECT id, username, email, phone_number, role, profile_picture, 
            is_verified, is_active, created_at, updated_at,
            latitude, longitude
     FROM users WHERE id = $1`,
    [req.user.id]
  );

  if (result.rows.length === 0) {
    return next(new AppError('User not found', 404));
  }

  const user = result.rows[0];

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

/**
 * Update user profile
 * @route PATCH /api/v1/auth/me
 * @access Private
 */
exports.updateMe = catchAsync(async (req, res, next) => {
  const { username, phone_number, profile_picture } = req.body;

  // Check if password is in the request
  if (req.body.password) {
    return next(new AppError('This route is not for password updates. Use /change-password', 400));
  }

  // Build update query dynamically
  const updates = [];
  const values = [];
  let paramCount = 1;

  if (username) {
    updates.push(`username = $${paramCount}`);
    values.push(username);
    paramCount++;
  }

  if (phone_number) {
    updates.push(`phone_number = $${paramCount}`);
    values.push(phone_number);
    paramCount++;
  }

  if (profile_picture) {
    updates.push(`profile_picture = $${paramCount}`);
    values.push(profile_picture);
    paramCount++;
  }

  if (updates.length === 0) {
    return next(new AppError('No fields to update', 400));
  }

  values.push(req.user.id);

  const result = await query(
    `UPDATE users 
     SET ${updates.join(', ')}
     WHERE id = $${paramCount}
     RETURNING id, username, email, phone_number, role, profile_picture, updated_at`,
    values
  );

  const user = result.rows[0];

  // Update cache
  await deleteCache(`user:${user.id}`);

  // Log audit
  await query(
    `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address)
     VALUES ($1, $2, $3, $4, $5)`,
    [user.id, 'UPDATE_PROFILE', 'user', user.id, req.ip]
  );

  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully',
    data: {
      user,
    },
  });
});

/**
 * Change password
 * @route PATCH /api/v1/auth/change-password
 * @access Private
 */
exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError('Please provide current and new password', 400));
  }

  // Get user with password
  const result = await query(
    'SELECT id, password_hash FROM users WHERE id = $1',
    [req.user.id]
  );

  const user = result.rows[0];

  // Verify current password
  const isPasswordValid = await comparePassword(currentPassword, user.password_hash);

  if (!isPasswordValid) {
    return next(new AppError('Current password is incorrect', 401));
  }

  // Hash new password
  const newPasswordHash = await hashPassword(newPassword);

  // Update password
  await query(
    'UPDATE users SET password_hash = $1 WHERE id = $2',
    [newPasswordHash, user.id]
  );

  // Revoke all refresh tokens for security
  await revokeAllUserTokens(user.id);

  // Log audit
  await query(
    `INSERT INTO audit_logs (user_id, action, entity_type, ip_address)
     VALUES ($1, $2, $3, $4)`,
    [user.id, 'CHANGE_PASSWORD', 'user', req.ip]
  );

  logger.info(`Password changed for user: ${req.user.email}`);

  res.status(200).json({
    status: 'success',
    message: 'Password changed successfully. Please login again.',
  });
});

/**
 * Delete account
 * @route DELETE /api/v1/auth/me
 * @access Private
 */
exports.deleteAccount = catchAsync(async (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return next(new AppError('Please provide your password to confirm deletion', 400));
  }

  // Get user with password
  const result = await query(
    'SELECT id, password_hash FROM users WHERE id = $1',
    [req.user.id]
  );

  const user = result.rows[0];

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password_hash);

  if (!isPasswordValid) {
    return next(new AppError('Password is incorrect', 401));
  }

  // Soft delete: deactivate account
  await query(
    'UPDATE users SET is_active = FALSE WHERE id = $1',
    [user.id]
  );

  // Revoke all tokens
  await revokeAllUserTokens(user.id);

  // Clear cache
  await deleteCache(`user:${user.id}`);

  // Log audit
  await query(
    `INSERT INTO audit_logs (user_id, action, entity_type, ip_address)
     VALUES ($1, $2, $3, $4)`,
    [user.id, 'DELETE_ACCOUNT', 'user', req.ip]
  );

  logger.info(`Account deleted for user: ${req.user.email}`);

  // Clear cookie
  clearTokenCookie(res);

  res.status(200).json({
    status: 'success',
    message: 'Account deleted successfully',
  });
});

/**
 * Update user location
 * @route PATCH /api/v1/auth/location
 * @access Private
 */
exports.updateLocation = catchAsync(async (req, res, next) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return next(new AppError('Latitude and longitude are required', 400));
  }

  // Validate coordinates
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return next(new AppError('Invalid coordinates', 400));
  }

  await query(
    `UPDATE users 
     SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
         last_location_update = CURRENT_TIMESTAMP
     WHERE id = $3`,
    [longitude, latitude, req.user.id]
  );

  res.status(200).json({
    status: 'success',
    message: 'Location updated successfully',
    data: {
      latitude,
      longitude,
    },
  });
});
