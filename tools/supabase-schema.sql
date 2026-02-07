-- =========================================
-- WEEK 7: SITE REGISTRY & MONITORING
-- Supabase PostgreSQL Schema
-- =========================================
--
-- This script creates the complete database schema for the
-- Local Business Platform site registry and monitoring system.
--
-- Execute this in Supabase SQL Editor:
-- 1. Log into your Supabase project
-- 2. Go to SQL Editor
-- 3. Paste and run this entire script
--
-- Tables:
-- 1. sites - Master site registry
-- 2. deployments - Vercel deployment history
-- 3. builds - GitHub Actions build results
-- 4. metrics - Daily performance metrics from NewRelic
-- 5. alerts - Alert tracking and notifications
-- 6. content_generations - AI content generation logs
-- 7. rate_limits - Rate limiting (replaces Redis)
-- =========================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================
-- TABLE 1: SITES
-- Master site registry - single source of truth
-- =========================================

CREATE TABLE IF NOT EXISTS sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  domain TEXT,
  industry TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  vercel_project_id TEXT,
  newrelic_app_id TEXT,
  business_info JSONB,
  theme_config JSONB,
  stats JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE sites IS 'Master site registry - tracks all deployed sites';
COMMENT ON COLUMN sites.slug IS 'Site slug (directory name in sites/)';
COMMENT ON COLUMN sites.business_info IS 'Business details from site.config.ts';
COMMENT ON COLUMN sites.theme_config IS 'Theme colors, fonts from site.config.ts';
COMMENT ON COLUMN sites.stats IS 'Content counts: { service_count, location_count, blog_count, project_count }';

-- =========================================
-- TABLE 2: DEPLOYMENTS
-- Vercel deployment history
-- =========================================

CREATE TABLE IF NOT EXISTS deployments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  deployment_id TEXT UNIQUE NOT NULL,
  url TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ready', 'error', 'building', 'queued', 'canceled')),
  build_time_ms INTEGER,
  git_branch TEXT,
  git_commit_sha TEXT,
  git_commit_message TEXT,
  environment TEXT CHECK (environment IN ('production', 'preview', 'development')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE deployments IS 'Vercel deployment history synced from Vercel API';
COMMENT ON COLUMN deployments.deployment_id IS 'Vercel deployment UID';
COMMENT ON COLUMN deployments.build_time_ms IS 'Build duration in milliseconds';

-- =========================================
-- TABLE 3: BUILDS
-- GitHub Actions build results
-- =========================================

CREATE TABLE IF NOT EXISTS builds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  run_id TEXT UNIQUE NOT NULL,
  workflow TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failure', 'in_progress', 'cancelled')),
  git_branch TEXT,
  git_commit_sha TEXT,
  checks_passed JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

COMMENT ON TABLE builds IS 'GitHub Actions build results reported by CI workflow';
COMMENT ON COLUMN builds.run_id IS 'GitHub Actions run ID';
COMMENT ON COLUMN builds.checks_passed IS 'Quality checks: { eslint: true, typescript: true, tests: true, build: true }';

-- =========================================
-- TABLE 4: METRICS
-- Daily performance metrics from NewRelic
-- =========================================

CREATE TABLE IF NOT EXISTS metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  response_time_avg_ms DECIMAL,
  response_time_p95_ms DECIMAL,
  error_rate_percent DECIMAL,
  throughput_rpm DECIMAL,
  apdex_score DECIMAL CHECK (apdex_score >= 0 AND apdex_score <= 1),
  page_views INTEGER,
  unique_visitors INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(site_id, date)
);

COMMENT ON TABLE metrics IS 'Daily aggregated performance metrics from NewRelic APM';
COMMENT ON COLUMN metrics.throughput_rpm IS 'Requests per minute';
COMMENT ON COLUMN metrics.apdex_score IS 'Application Performance Index (0.0 to 1.0)';

-- =========================================
-- TABLE 5: ALERTS
-- Alert tracking and notification history
-- =========================================

CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('build_failure', 'deploy_failure', 'high_error_rate', 'performance_degradation')),
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB,
  notified_at TIMESTAMPTZ,
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE alerts IS 'Alert tracking with notification history';
COMMENT ON COLUMN alerts.metadata IS 'Alert-specific data: error rates, thresholds, URLs, etc.';
COMMENT ON COLUMN alerts.notified_at IS 'When email notification was sent';

-- =========================================
-- TABLE 6: CONTENT_GENERATIONS
-- AI content generation logs (Week 5 integration)
-- =========================================

CREATE TABLE IF NOT EXISTS content_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('service', 'location', 'blog', 'project')),
  provider TEXT NOT NULL CHECK (provider IN ('claude', 'gemini')),
  model TEXT,
  tokens_used INTEGER,
  cost_usd DECIMAL,
  quality_scores JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE content_generations IS 'AI content generation logs with cost tracking';
COMMENT ON COLUMN content_generations.quality_scores IS 'Content quality metrics: { readability: 75, seo: 88, uniqueness: 92 }';

-- =========================================
-- TABLE 7: RATE_LIMITS ⭐ NEW
-- Rate limiting (replaces Upstash Redis)
-- =========================================

CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  site_slug TEXT,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL,
  window_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(identifier, endpoint, window_start)
);

COMMENT ON TABLE rate_limits IS 'Rate limiting for contact forms and API endpoints (replaces Redis)';
COMMENT ON COLUMN rate_limits.identifier IS 'IP address or user identifier';
COMMENT ON COLUMN rate_limits.endpoint IS 'API endpoint: /api/contact, /api/analytics/track';
COMMENT ON COLUMN rate_limits.window_end IS 'End of rate limit window (for auto-cleanup)';

-- =========================================
-- INDEXES
-- Optimize common query patterns
-- =========================================

-- Sites indexes
CREATE INDEX IF NOT EXISTS idx_sites_status ON sites(status);
CREATE INDEX IF NOT EXISTS idx_sites_industry ON sites(industry);
CREATE INDEX IF NOT EXISTS idx_sites_slug ON sites(slug);

-- Deployments indexes
CREATE INDEX IF NOT EXISTS idx_deployments_site_id ON deployments(site_id);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON deployments(status);
CREATE INDEX IF NOT EXISTS idx_deployments_created_at ON deployments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deployments_environment ON deployments(environment);

-- Builds indexes
CREATE INDEX IF NOT EXISTS idx_builds_site_id ON builds(site_id);
CREATE INDEX IF NOT EXISTS idx_builds_status ON builds(status);
CREATE INDEX IF NOT EXISTS idx_builds_created_at ON builds(created_at DESC);

-- Metrics indexes
CREATE INDEX IF NOT EXISTS idx_metrics_site_id ON metrics(site_id);
CREATE INDEX IF NOT EXISTS idx_metrics_date ON metrics(date DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_site_date ON metrics(site_id, date DESC);

-- Alerts indexes
CREATE INDEX IF NOT EXISTS idx_alerts_site_id ON alerts(site_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(type);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);

-- Content generations indexes
CREATE INDEX IF NOT EXISTS idx_content_gen_site_id ON content_generations(site_id);
CREATE INDEX IF NOT EXISTS idx_content_gen_type ON content_generations(content_type);
CREATE INDEX IF NOT EXISTS idx_content_gen_created_at ON content_generations(created_at DESC);

-- Rate limits indexes
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_endpoint ON rate_limits(identifier, endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_end ON rate_limits(window_end);
CREATE INDEX IF NOT EXISTS idx_rate_limits_site_slug ON rate_limits(site_slug);

-- =========================================
-- ROW LEVEL SECURITY (RLS)
-- Service role bypass for backend operations
-- =========================================

-- Enable RLS on all tables
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites FORCE ROW LEVEL SECURITY;

ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployments FORCE ROW LEVEL SECURITY;

ALTER TABLE builds ENABLE ROW LEVEL SECURITY;
ALTER TABLE builds FORCE ROW LEVEL SECURITY;

ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics FORCE ROW LEVEL SECURITY;

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts FORCE ROW LEVEL SECURITY;

ALTER TABLE content_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_generations FORCE ROW LEVEL SECURITY;

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits FORCE ROW LEVEL SECURITY;

-- Create bypass policies for service role (used by backend scripts)
CREATE POLICY "Service role has full access to sites" ON sites
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to deployments" ON deployments
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to builds" ON builds
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to metrics" ON metrics
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to alerts" ON alerts
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to content_generations" ON content_generations
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to rate_limits" ON rate_limits
  FOR ALL USING (auth.role() = 'service_role');

-- =========================================
-- TRIGGERS
-- Auto-update timestamps
-- =========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to sites table
CREATE TRIGGER update_sites_updated_at
  BEFORE UPDATE ON sites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to rate_limits table
CREATE TRIGGER update_rate_limits_updated_at
  BEFORE UPDATE ON rate_limits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- CLEANUP FUNCTION FOR RATE LIMITS
-- Auto-delete expired rate limit records
-- =========================================

-- Function to clean up expired rate limits
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM rate_limits
  WHERE window_end < NOW() - INTERVAL '1 hour';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_expired_rate_limits IS 'Delete rate limit records older than 1 hour. Call via Edge Function cron.';

-- =========================================
-- RATE LIMIT INCREMENT FUNCTION
-- Atomic upsert + check for rate limiting
-- =========================================

CREATE OR REPLACE FUNCTION increment_rate_limit(
  p_identifier TEXT,
  p_endpoint TEXT,
  p_site_slug TEXT,
  p_window_start TIMESTAMPTZ,
  p_window_end TIMESTAMPTZ,
  p_max_requests INTEGER
) RETURNS JSON AS $$
DECLARE
  v_count INTEGER;
BEGIN
  INSERT INTO rate_limits (identifier, endpoint, site_slug, request_count, window_start, window_end)
  VALUES (p_identifier, p_endpoint, p_site_slug, 1, p_window_start, p_window_end)
  ON CONFLICT (identifier, endpoint, window_start)
  DO UPDATE SET request_count = rate_limits.request_count + 1, updated_at = NOW()
  RETURNING request_count INTO v_count;

  RETURN json_build_object('request_count', v_count, 'allowed', v_count <= p_max_requests);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION increment_rate_limit IS 'Atomic rate limit check: upsert counter and return whether request is allowed.';

-- =========================================
-- VERIFICATION QUERIES
-- Run these to verify setup
-- =========================================

-- Verify all tables exist
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('sites', 'deployments', 'builds', 'metrics', 'alerts', 'content_generations', 'rate_limits')
ORDER BY table_name;

-- Verify all indexes exist
SELECT
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('sites', 'deployments', 'builds', 'metrics', 'alerts', 'content_generations', 'rate_limits')
ORDER BY tablename, indexname;

-- Verify RLS is enabled
SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('sites', 'deployments', 'builds', 'metrics', 'alerts', 'content_generations', 'rate_limits')
ORDER BY tablename;

-- =========================================
-- SETUP COMPLETE ✅
-- =========================================
--
-- Next steps:
-- 1. Verify tables created: SELECT * FROM sites;
-- 2. Create Supabase service role key (Project Settings → API → service_role)
-- 3. Add credentials to .env.local
-- 4. Test connection with tools/test-registry.ts
--
-- =========================================
