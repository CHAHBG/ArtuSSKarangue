/**
 * JWT Token Utilities
 * Handle token generation and verification
 */

const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const logger = require('./logger');

/**
 * Generate JWT access token
 * @param {number} userId - User ID
 * @returns {string} JWT token
 */
const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    }
  );
};

/**
 * Generate JWT refresh token
 * @param {number} userId - User ID
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    }
  );
};

/**
 * Generate both access and refresh tokens
 * @param {number} userId - User ID
 * @returns {Object} Object containing access and refresh tokens
 */
const generateTokens = (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  return {
    accessToken,
    refreshToken,
  };
};

/**
 * Save refresh token to database
 * @param {number} userId - User ID
 * @param {string} refreshToken - Refresh token
 */
const saveRefreshToken = async (userId, refreshToken) => {
  try {
    // Calculate expiration date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Delete old refresh tokens for this user
    await query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);

    // Save new refresh token
    await query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, refreshToken, expiresAt]
    );

    logger.debug(`Refresh token saved for user ${userId}`);
  } catch (error) {
    logger.error('Error saving refresh token:', error);
    throw error;
  }
};

/**
 * Verify refresh token
 * @param {string} refreshToken - Refresh token
 * @returns {Object} Decoded token payload
 */
const verifyRefreshToken = async (refreshToken) => {
  try {
    // Verify token signature
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Check if token exists in database and is not expired
    const result = await query(
      'SELECT user_id FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
      [refreshToken]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid or expired refresh token');
    }

    return decoded;
  } catch (error) {
    logger.error('Error verifying refresh token:', error);
    throw error;
  }
};

/**
 * Revoke refresh token
 * @param {string} refreshToken - Refresh token to revoke
 */
const revokeRefreshToken = async (refreshToken) => {
  try {
    await query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
    logger.debug('Refresh token revoked');
  } catch (error) {
    logger.error('Error revoking refresh token:', error);
    throw error;
  }
};

/**
 * Revoke all refresh tokens for a user
 * @param {number} userId - User ID
 */
const revokeAllUserTokens = async (userId) => {
  try {
    await query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
    logger.debug(`All refresh tokens revoked for user ${userId}`);
  } catch (error) {
    logger.error('Error revoking all user tokens:', error);
    throw error;
  }
};

/**
 * Set JWT cookie
 * @param {Object} res - Express response object
 * @param {string} token - JWT token
 */
const setTokenCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict',
  };

  res.cookie('jwt', token, cookieOptions);
};

/**
 * Clear JWT cookie
 * @param {Object} res - Express response object
 */
const clearTokenCookie = (res) => {
  res.cookie('jwt', '', {
    expires: new Date(0),
    httpOnly: true,
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  saveRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  setTokenCookie,
  clearTokenCookie,
};
