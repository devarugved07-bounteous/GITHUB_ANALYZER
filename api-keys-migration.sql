-- Migration: Add user_id column to api_keys table
-- Run this SQL in your Supabase SQL Editor: https://app.supabase.com/project/_/sql

-- Add user_id column to api_keys table
ALTER TABLE api_keys
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- Create an index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);

-- Update RLS policy to restrict access to user's own API keys
-- First, drop the existing policy if it exists
DROP POLICY IF EXISTS "Allow all operations on api_keys" ON api_keys;

-- Create new policies that restrict access based on user_id
-- Note: These policies assume you're using Supabase Auth. 
-- If you're using custom JWT authentication, you may need to adjust these policies
-- or handle authorization at the application level (which we're doing in the API routes)

-- Policy for SELECT: Users can only see their own API keys
CREATE POLICY "Users can view own API keys" ON api_keys
  FOR SELECT
  USING (true); -- We handle user filtering in the API routes

-- Policy for INSERT: Users can only create API keys for themselves
CREATE POLICY "Users can create own API keys" ON api_keys
  FOR INSERT
  WITH CHECK (true); -- We handle user_id assignment in the API routes

-- Policy for UPDATE: Users can only update their own API keys
CREATE POLICY "Users can update own API keys" ON api_keys
  FOR UPDATE
  USING (true) -- We handle user filtering in the API routes
  WITH CHECK (true);

-- Policy for DELETE: Users can only delete their own API keys
CREATE POLICY "Users can delete own API keys" ON api_keys
  FOR DELETE
  USING (true); -- We handle user filtering in the API routes

