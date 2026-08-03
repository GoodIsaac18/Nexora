-- Fix RLS policies for error_reports and tools_analytics tables
-- Run this in your Supabase SQL Editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "error_reports_insert_policy" ON error_reports;
DROP POLICY IF EXISTS "error_reports_select_policy" ON error_reports;
DROP POLICY IF EXISTS "tools_analytics_insert_policy" ON tools_analytics;
DROP POLICY IF EXISTS "tools_analytics_select_policy" ON tools_analytics;
DROP POLICY IF EXISTS "tools_analytics_update_policy" ON tools_analytics;

-- Create error_reports table if it doesn't exist
CREATE TABLE IF NOT EXISTS error_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_slug TEXT NOT NULL,
  error_type TEXT NOT NULL,
  description TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on error_reports
ALTER TABLE error_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for error_reports (allow anon/public access)
CREATE POLICY "error_reports_insert_policy" ON error_reports
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "error_reports_select_policy" ON error_reports
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create tools_analytics table if it doesn't exist
CREATE TABLE IF NOT EXISTS tools_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  last_viewed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on tools_analytics
ALTER TABLE tools_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for tools_analytics (allow anon/public access)
CREATE POLICY "tools_analytics_insert_policy" ON tools_analytics
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "tools_analytics_select_policy" ON tools_analytics
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "tools_analytics_update_policy" ON tools_analytics
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_error_reports_tool_slug ON error_reports(tool_slug);
CREATE INDEX IF NOT EXISTS idx_error_reports_created_at ON error_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tools_analytics_slug ON tools_analytics(slug);
CREATE INDEX IF NOT EXISTS idx_tools_analytics_views ON tools_analytics(views DESC);
