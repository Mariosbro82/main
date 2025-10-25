-- Database Performance Indexes
-- Generated: 2025-10-25

-- Scenarios table indexes
CREATE INDEX IF NOT EXISTS idx_scenarios_created_at ON scenarios(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scenarios_updated_at ON scenarios(updated_at DESC);

-- Private Pension Plans table indexes
CREATE INDEX IF NOT EXISTS idx_pension_plans_scenario_id ON private_pension_plans(scenario_id);
CREATE INDEX IF NOT EXISTS idx_pension_plans_created_at ON private_pension_plans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pension_plans_updated_at ON private_pension_plans(updated_at DESC);

-- Composite index for common queries (scenario_id + dates)
CREATE INDEX IF NOT EXISTS idx_pension_plans_scenario_created ON private_pension_plans(scenario_id, created_at DESC);

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Full-text search index for scenario names (if needed)
CREATE INDEX IF NOT EXISTS idx_scenarios_name_trgm ON scenarios USING gin(name gin_trgm_ops);

-- Analyze tables to update statistics
ANALYZE scenarios;
ANALYZE private_pension_plans;
ANALYZE users;
