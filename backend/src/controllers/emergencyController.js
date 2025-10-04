/**
 * Emergency Controller
 * Handles emergency reporting, fetching, and management
 */

const { query, getClient } = require('../config/database');
const { setCache, getCache, deleteCache, deleteCachePattern } = require('../config/redis');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');
const { catchAsync } = require('../middleware/errorHandler');

/**
 * Create a new emergency report
 * @route POST /api/v1/emergencies
 * @access Private
 */
exports.createEmergency = catchAsync(async (req, res, next) => {
  const {
    type,
    title,
    description,
    latitude,
    longitude,
    address,
    severity,
    is_anonymous,
  } = req.body;

  const userId = is_anonymous ? null : req.user.id;

  // Create emergency
  const result = await query(
    `INSERT INTO emergencies 
     (user_id, type, title, description, location, address, severity, is_anonymous)
     VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326)::geography, $7, $8, $9)
     RETURNING id, type, title, description, address, severity, status, 
               is_anonymous, created_at,
               ST_Y(location::geometry) as latitude,
               ST_X(location::geometry) as longitude`,
    [userId, type, title, description, longitude, latitude, address, severity, is_anonymous]
  );

  const emergency = result.rows[0];

  // Invalidate nearby emergencies cache
  await deleteCachePattern('emergencies:nearby:*');

  // Log audit
  if (userId) {
    await query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, 'CREATE_EMERGENCY', 'emergency', emergency.id, req.ip]
    );
  }

  logger.info(`Emergency created: ${emergency.id} - ${emergency.type}`);

  // Emit socket event for real-time updates (will be handled in socket.io)
  if (req.io) {
    req.io.emit('new_emergency', {
      id: emergency.id,
      type: emergency.type,
      title: emergency.title,
      latitude: emergency.latitude,
      longitude: emergency.longitude,
      severity: emergency.severity,
      created_at: emergency.created_at,
    });
  }

  res.status(201).json({
    status: 'success',
    message: 'Emergency reported successfully',
    data: {
      emergency,
    },
  });
});

/**
 * Get nearby emergencies
 * @route GET /api/v1/emergencies/nearby
 * @access Public
 */
exports.getNearbyEmergencies = catchAsync(async (req, res, next) => {
  const {
    latitude,
    longitude,
    radius = 5000,
    type,
    status = 'active',
    limit = 50,
    offset = 0,
  } = req.query;

  // Check cache first
  const cacheKey = `emergencies:nearby:${latitude}:${longitude}:${radius}:${type || 'all'}:${status}`;
  const cached = await getCache(cacheKey);

  if (cached) {
    return res.status(200).json({
      status: 'success',
      cached: true,
      results: cached.length,
      data: {
        emergencies: cached,
      },
    });
  }

  // Build query
  let queryText = `
    SELECT 
      e.id, e.type, e.title, e.description, e.address, e.severity, e.status,
      e.is_anonymous, e.upvotes, e.downvotes, e.view_count, e.created_at,
      ST_Y(e.location::geometry) as latitude,
      ST_X(e.location::geometry) as longitude,
      ST_Distance(
        e.location,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
      ) as distance,
      u.username, u.profile_picture,
      (SELECT COUNT(*) FROM emergency_media WHERE emergency_id = e.id) as media_count
    FROM emergencies e
    LEFT JOIN users u ON e.user_id = u.id
    WHERE ST_DWithin(
      e.location,
      ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
      $3
    )
    AND e.status = $4
  `;

  const params = [longitude, latitude, radius, status];
  let paramCount = 5;

  if (type) {
    queryText += ` AND e.type = $${paramCount}`;
    params.push(type);
    paramCount++;
  }

  queryText += ` ORDER BY distance ASC, e.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  params.push(limit, offset);

  const result = await query(queryText, params);

  const emergencies = result.rows;

  // Cache results for 2 minutes
  await setCache(cacheKey, emergencies, 120);

  res.status(200).json({
    status: 'success',
    results: emergencies.length,
    data: {
      emergencies,
    },
  });
});

/**
 * Get emergency by ID
 * @route GET /api/v1/emergencies/:id
 * @access Public
 */
exports.getEmergency = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Increment view count
  await query(
    'UPDATE emergencies SET view_count = view_count + 1 WHERE id = $1',
    [id]
  );

  // Get emergency details
  const result = await query(
    `SELECT 
      e.id, e.type, e.title, e.description, e.address, e.severity, e.status,
      e.is_anonymous, e.upvotes, e.downvotes, e.view_count, 
      e.created_at, e.updated_at, e.resolved_at,
      ST_Y(e.location::geometry) as latitude,
      ST_X(e.location::geometry) as longitude,
      u.id as user_id, u.username, u.profile_picture, u.phone_number,
      r.id as responder_id, r.username as responder_username
    FROM emergencies e
    LEFT JOIN users u ON e.user_id = u.id
    LEFT JOIN users r ON e.responder_id = r.id
    WHERE e.id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return next(new AppError('Emergency not found', 404));
  }

  const emergency = result.rows[0];

  // Get media files
  const mediaResult = await query(
    `SELECT id, media_type, url, thumbnail_url, duration
     FROM emergency_media WHERE emergency_id = $1 ORDER BY created_at`,
    [id]
  );

  emergency.media = mediaResult.rows;

  res.status(200).json({
    status: 'success',
    data: {
      emergency,
    },
  });
});

/**
 * Update emergency status
 * @route PATCH /api/v1/emergencies/:id
 * @access Private (Responders and Admins)
 */
exports.updateEmergency = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status, description } = req.body;

  // Check if emergency exists
  const checkResult = await query(
    'SELECT user_id, responder_id FROM emergencies WHERE id = $1',
    [id]
  );

  if (checkResult.rows.length === 0) {
    return next(new AppError('Emergency not found', 404));
  }

  const emergency = checkResult.rows[0];

  // Check permissions
  const isOwner = emergency.user_id === req.user.id;
  const isResponder = req.user.role === 'responder' || req.user.role === 'admin';

  if (!isOwner && !isResponder) {
    return next(new AppError('You do not have permission to update this emergency', 403));
  }

  // Build update query
  const updates = [];
  const values = [];
  let paramCount = 1;

  if (status) {
    updates.push(`status = $${paramCount}`);
    values.push(status);
    paramCount++;

    if (status === 'in_progress' && !emergency.responder_id) {
      updates.push(`responder_id = $${paramCount}`);
      values.push(req.user.id);
      paramCount++;
    }

    if (status === 'resolved') {
      updates.push(`resolved_at = CURRENT_TIMESTAMP`);
    }
  }

  if (description && isOwner) {
    updates.push(`description = $${paramCount}`);
    values.push(description);
    paramCount++;
  }

  if (updates.length === 0) {
    return next(new AppError('No fields to update', 400));
  }

  values.push(id);

  const result = await query(
    `UPDATE emergencies 
     SET ${updates.join(', ')}
     WHERE id = $${paramCount}
     RETURNING id, type, title, status, updated_at`,
    values
  );

  const updatedEmergency = result.rows[0];

  // Invalidate cache
  await deleteCachePattern('emergencies:*');

  // Log audit
  await query(
    `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, metadata)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [req.user.id, 'UPDATE_EMERGENCY', 'emergency', id, req.ip, JSON.stringify({ status })]
  );

  // Emit socket event
  if (req.io) {
    req.io.emit('emergency_updated', {
      id: updatedEmergency.id,
      status: updatedEmergency.status,
      updated_at: updatedEmergency.updated_at,
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Emergency updated successfully',
    data: {
      emergency: updatedEmergency,
    },
  });
});

/**
 * Delete emergency
 * @route DELETE /api/v1/emergencies/:id
 * @access Private (Owner or Admin)
 */
exports.deleteEmergency = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Check if emergency exists and user has permission
  const result = await query(
    'SELECT user_id FROM emergencies WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    return next(new AppError('Emergency not found', 404));
  }

  const emergency = result.rows[0];

  if (emergency.user_id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to delete this emergency', 403));
  }

  // Delete emergency (cascades to media and votes)
  await query('DELETE FROM emergencies WHERE id = $1', [id]);

  // Invalidate cache
  await deleteCachePattern('emergencies:*');

  // Log audit
  await query(
    `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address)
     VALUES ($1, $2, $3, $4, $5)`,
    [req.user.id, 'DELETE_EMERGENCY', 'emergency', id, req.ip]
  );

  res.status(204).json({
    status: 'success',
    message: 'Emergency deleted successfully',
  });
});

/**
 * Vote on emergency (upvote/downvote)
 * @route POST /api/v1/emergencies/:id/vote
 * @access Private
 */
exports.voteEmergency = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { vote_type } = req.body;

  const client = await getClient();

  try {
    await client.query('BEGIN');

    // Check if emergency exists
    const emergencyResult = await client.query(
      'SELECT id FROM emergencies WHERE id = $1',
      [id]
    );

    if (emergencyResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return next(new AppError('Emergency not found', 404));
    }

    // Check if user already voted
    const voteResult = await client.query(
      'SELECT id, vote_type FROM emergency_votes WHERE emergency_id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (voteResult.rows.length > 0) {
      const existingVote = voteResult.rows[0];

      if (existingVote.vote_type === vote_type) {
        // Remove vote
        await client.query(
          'DELETE FROM emergency_votes WHERE id = $1',
          [existingVote.id]
        );

        // Update emergency count
        const column = vote_type === 'upvote' ? 'upvotes' : 'downvotes';
        await client.query(
          `UPDATE emergencies SET ${column} = ${column} - 1 WHERE id = $1`,
          [id]
        );

        await client.query('COMMIT');

        return res.status(200).json({
          status: 'success',
          message: 'Vote removed',
        });
      } else {
        // Change vote
        await client.query(
          'UPDATE emergency_votes SET vote_type = $1 WHERE id = $2',
          [vote_type, existingVote.id]
        );

        // Update emergency counts
        const oldColumn = existingVote.vote_type === 'upvote' ? 'upvotes' : 'downvotes';
        const newColumn = vote_type === 'upvote' ? 'upvotes' : 'downvotes';

        await client.query(
          `UPDATE emergencies 
           SET ${oldColumn} = ${oldColumn} - 1, ${newColumn} = ${newColumn} + 1 
           WHERE id = $1`,
          [id]
        );

        await client.query('COMMIT');

        return res.status(200).json({
          status: 'success',
          message: 'Vote updated',
        });
      }
    }

    // Add new vote
    await client.query(
      'INSERT INTO emergency_votes (emergency_id, user_id, vote_type) VALUES ($1, $2, $3)',
      [id, req.user.id, vote_type]
    );

    // Update emergency count
    const column = vote_type === 'upvote' ? 'upvotes' : 'downvotes';
    await client.query(
      `UPDATE emergencies SET ${column} = ${column} + 1 WHERE id = $1`,
      [id]
    );

    await client.query('COMMIT');

    // Invalidate cache
    await deleteCachePattern('emergencies:*');

    res.status(200).json({
      status: 'success',
      message: 'Vote recorded',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

/**
 * Get user's emergencies
 * @route GET /api/v1/emergencies/my-reports
 * @access Private
 */
exports.getMyEmergencies = catchAsync(async (req, res, next) => {
  const { status, limit = 20, offset = 0 } = req.query;

  let queryText = `
    SELECT 
      e.id, e.type, e.title, e.description, e.address, e.severity, e.status,
      e.upvotes, e.downvotes, e.view_count, e.created_at,
      ST_Y(e.location::geometry) as latitude,
      ST_X(e.location::geometry) as longitude,
      (SELECT COUNT(*) FROM emergency_media WHERE emergency_id = e.id) as media_count
    FROM emergencies e
    WHERE e.user_id = $1
  `;

  const params = [req.user.id];
  let paramCount = 2;

  if (status) {
    queryText += ` AND e.status = $${paramCount}`;
    params.push(status);
    paramCount++;
  }

  queryText += ` ORDER BY e.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  params.push(limit, offset);

  const result = await query(queryText, params);

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: {
      emergencies: result.rows,
    },
  });
});

/**
 * Get emergency statistics
 * @route GET /api/v1/emergencies/stats
 * @access Public
 */
exports.getEmergencyStats = catchAsync(async (req, res, next) => {
  const { latitude, longitude, radius = 10000 } = req.query;

  let statsQuery = `
    SELECT 
      type,
      COUNT(*) as count,
      AVG(severity) as avg_severity
    FROM emergencies
  `;

  const params = [];

  if (latitude && longitude) {
    statsQuery += `
      WHERE ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        $3
      )
    `;
    params.push(longitude, latitude, radius);
  }

  statsQuery += ' GROUP BY type ORDER BY count DESC';

  const result = await query(statsQuery, params);

  // Get total counts by status
  const statusQuery = `
    SELECT status, COUNT(*) as count
    FROM emergencies
    ${params.length > 0 ? `WHERE ST_DWithin(
      location,
      ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
      $3
    )` : ''}
    GROUP BY status
  `;

  const statusResult = await query(statusQuery, params);

  res.status(200).json({
    status: 'success',
    data: {
      by_type: result.rows,
      by_status: statusResult.rows,
    },
  });
});
