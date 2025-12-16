-- Migration: Add rate limiting columns to api_keys table
-- Run this SQL in your Supabase SQL Editor: https://app.supabase.com/project/_/sql

-- Add usage column to track API key usage count
ALTER TABLE api_keys
ADD COLUMN IF NOT EXISTS usage INTEGER DEFAULT 0 NOT NULL;

-- Add rate_limit column to set the maximum allowed usage
ALTER TABLE api_keys
ADD COLUMN IF NOT EXISTS rate_limit INTEGER DEFAULT 100 NOT NULL;

-- Create an index on usage for faster lookups (optional, but can be useful for analytics)
CREATE INDEX IF NOT EXISTS idx_api_keys_usage ON api_keys(usage);

-- Optional: Set a default rate limit for existing API keys if needed
-- UPDATE api_keys SET rate_limit = 100 WHERE rate_limit IS NULL;

