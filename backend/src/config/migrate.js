/**
 * Database Migration Script
 * Creates all necessary tables with PostGIS support
 */

require('dotenv').config();
const { pool, initPostGIS } = require('./database');
const logger = require('../utils/logger');

/**
 * Create database tables
 */
const createTables = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Enable PostGIS extension
    await initPostGIS();

    // Create ENUM types
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('citizen', 'responder', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await client.query(`
      DO $$ BEGIN
        CREATE TYPE emergency_type AS ENUM (
          'accident', 'fire', 'medical', 'flood', 
          'security', 'earthquake', 'other'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await client.query(`
      DO $$ BEGIN
        CREATE TYPE emergency_status AS ENUM (
          'active', 'in_progress', 'resolved', 'false_alarm'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await client.query(`
      DO $$ BEGIN
        CREATE TYPE facility_type AS ENUM (
          'hospital', 'police_station', 'fire_station', 
          'shelter', 'pharmacy', 'other'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20),
        role user_role DEFAULT 'citizen',
        profile_picture VARCHAR(500),
        is_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        location GEOGRAPHY(POINT, 4326),
        last_location_update TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create index on users location
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_location 
      ON users USING GIST(location);
    `);

    // Emergencies table
    await client.query(`
      CREATE TABLE IF NOT EXISTS emergencies (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        type emergency_type NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        location GEOGRAPHY(POINT, 4326) NOT NULL,
        address VARCHAR(500),
        status emergency_status DEFAULT 'active',
        severity INTEGER CHECK (severity >= 1 AND severity <= 5) DEFAULT 3,
        is_anonymous BOOLEAN DEFAULT FALSE,
        upvotes INTEGER DEFAULT 0,
        downvotes INTEGER DEFAULT 0,
        view_count INTEGER DEFAULT 0,
        responder_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        resolved_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create spatial index on emergencies location
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_emergencies_location 
      ON emergencies USING GIST(location);
    `);

    // Create index on emergency status and created_at
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_emergencies_status_created 
      ON emergencies(status, created_at DESC);
    `);

    // Emergency media table (photos, videos, audio)
    await client.query(`
      CREATE TABLE IF NOT EXISTS emergency_media (
        id SERIAL PRIMARY KEY,
        emergency_id INTEGER REFERENCES emergencies(id) ON DELETE CASCADE,
        media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('photo', 'video', 'audio')),
        url VARCHAR(500) NOT NULL,
        cloudinary_public_id VARCHAR(255),
        thumbnail_url VARCHAR(500),
        file_size INTEGER,
        duration INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create index on emergency_media
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_emergency_media_emergency_id 
      ON emergency_media(emergency_id);
    `);

    // Emergency votes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS emergency_votes (
        id SERIAL PRIMARY KEY,
        emergency_id INTEGER REFERENCES emergencies(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        vote_type VARCHAR(10) CHECK (vote_type IN ('upvote', 'downvote')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(emergency_id, user_id)
      );
    `);

    // Facilities table
    await client.query(`
      CREATE TABLE IF NOT EXISTS facilities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type facility_type NOT NULL,
        location GEOGRAPHY(POINT, 4326) NOT NULL,
        address VARCHAR(500),
        phone_number VARCHAR(20),
        email VARCHAR(255),
        operating_hours TEXT,
        capacity INTEGER,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create spatial index on facilities location
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_facilities_location 
      ON facilities USING GIST(location);
    `);

    // Community posts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS community_posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        location GEOGRAPHY(POINT, 4326),
        address VARCHAR(500),
        media_url VARCHAR(500),
        post_type VARCHAR(50) DEFAULT 'general',
        likes_count INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create index on community_posts
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_community_posts_location 
      ON community_posts USING GIST(location);
    `);

    // Notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        emergency_id INTEGER REFERENCES emergencies(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'emergency',
        is_read BOOLEAN DEFAULT FALSE,
        data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create index on notifications
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_user_id 
      ON notifications(user_id, created_at DESC);
    `);

    // SOS alerts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sos_alerts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        location GEOGRAPHY(POINT, 4326) NOT NULL,
        address VARCHAR(500),
        emergency_contact VARCHAR(20),
        radius INTEGER DEFAULT 10000,
        message TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        resolved_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create spatial index on sos_alerts location
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_sos_alerts_location 
      ON sos_alerts USING GIST(location);
    `);

    // Refresh tokens table
    await client.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(500) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create index on refresh_tokens
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id 
      ON refresh_tokens(user_id);
    `);

    // Audit logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50),
        entity_id INTEGER,
        ip_address VARCHAR(45),
        user_agent TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create trigger to update updated_at timestamp
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Apply trigger to tables
    const tablesWithUpdatedAt = ['users', 'emergencies', 'facilities', 'community_posts'];
    for (const table of tablesWithUpdatedAt) {
      await client.query(`
        DROP TRIGGER IF EXISTS update_${table}_updated_at ON ${table};
        CREATE TRIGGER update_${table}_updated_at
        BEFORE UPDATE ON ${table}
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      `);
    }

    await client.query('COMMIT');
    logger.info('✅ Database tables created successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Seed initial data
 */
const seedData = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check if we already have data
    const result = await client.query('SELECT COUNT(*) FROM facilities');
    if (parseInt(result.rows[0].count) > 0) {
      logger.info('Database already has data, skipping seed');
      await client.query('COMMIT');
      return;
    }

    // Seed facilities in Dakar, Senegal
    const facilities = [
      {
        name: 'Hôpital Principal de Dakar',
        type: 'hospital',
        lat: 14.6937,
        lng: -17.4441,
        address: 'Avenue Nelson Mandela, Dakar',
        phone: '+221 33 839 50 50',
      },
      {
        name: 'Hôpital Aristide Le Dantec',
        type: 'hospital',
        lat: 14.6767,
        lng: -17.4576,
        address: 'Avenue Pasteur, Dakar',
        phone: '+221 33 821 21 81',
      },
      {
        name: 'Commissariat Central de Dakar',
        type: 'police_station',
        lat: 14.6928,
        lng: -17.4467,
        address: 'Place de l\'Indépendance, Dakar',
        phone: '17',
      },
      {
        name: 'Caserne Sapeurs-Pompiers Dakar',
        type: 'fire_station',
        lat: 14.6842,
        lng: -17.4536,
        address: 'Rue Gallandou Diouf, Dakar',
        phone: '18',
      },
    ];

    for (const facility of facilities) {
      await client.query(
        `INSERT INTO facilities (name, type, location, address, phone_number, is_active)
         VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography, $5, $6, TRUE)`,
        [facility.name, facility.type, facility.lng, facility.lat, facility.address, facility.phone]
      );
    }

    await client.query('COMMIT');
    logger.info('✅ Initial data seeded successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('❌ Error seeding data:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Run migrations
 */
const runMigrations = async () => {
  try {
    logger.info('🚀 Starting database migrations...');
    await createTables();
    await seedData();
    logger.info('✅ Database migrations completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migrations if called directly
if (require.main === module) {
  runMigrations();
}

module.exports = { createTables, seedData };
