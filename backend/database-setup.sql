# Database Setup Script for ARTU SI SEN KARANGUE
# Run this in PostgreSQL (psql or pgAdmin)

# Step 1: Connect to PostgreSQL
# psql -U postgres

# Step 2: Create database
CREATE DATABASE "ArtuDB";

# Step 3: Connect to the database
\c "ArtuDB"

# Step 4: Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

# Step 5: Verify PostGIS installation
SELECT PostGIS_version();

# You should see PostGIS version (e.g., "3.3 USE_GEOS=1 USE_PROJ=1...")

# Step 6: Exit psql
\q

# Now you can run: npm run migrate
