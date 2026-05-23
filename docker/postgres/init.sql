-- ============================================
-- Mobilismart - PostgreSQL Initialization
-- ============================================

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS pg_trgm;       -- Trigram for fuzzy text search
CREATE EXTENSION IF NOT EXISTS unaccent;       -- Accent-insensitive search

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE mobilismart TO mobilismart;
