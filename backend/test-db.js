/**
 * Test Database Connection
 * Quick script to verify database connectivity
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'ArtuDB',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  console.log('Configuration:');
  console.log(`  Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`  Port: ${process.env.DB_PORT || 5432}`);
  console.log(`  Database: ${process.env.DB_NAME || 'ArtuDB'}`);
  console.log(`  User: ${process.env.DB_USER || 'postgres'}`);
  console.log(`  Password: ${process.env.DB_PASSWORD ? '***' + process.env.DB_PASSWORD.slice(-3) : 'NOT SET'}\n`);

  try {
    // Test basic connection
    const timeResult = await pool.query('SELECT NOW() as time');
    console.log('✅ Database connected successfully!');
    console.log(`   Server time: ${timeResult.rows[0].time}\n`);

    // Test PostGIS
    const postgisResult = await pool.query('SELECT PostGIS_version() as version');
    console.log('✅ PostGIS is available!');
    console.log(`   Version: ${postgisResult.rows[0].version}\n`);

    // Check tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length > 0) {
      console.log('📊 Database tables:');
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
      console.log('');
    } else {
      console.log('⚠️  No tables found. Run database-setup.sql to create tables.\n');
    }

    // Check users count
    try {
      const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
      console.log(`👥 Total users: ${usersResult.rows[0].count}\n`);
    } catch (err) {
      console.log('⚠️  Users table not accessible. You may need to run database-setup.sql\n');
    }

    console.log('✨ All checks passed! Database is ready.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed!\n');
    console.error('Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Is PostgreSQL running?');
    console.error('2. Does the database exist? CREATE DATABASE ArtuDB;');
    console.error('3. Are credentials in .env correct?');
    console.error('4. Have you run database-setup.sql?');
    process.exit(1);
  }
}

testConnection();
