# Supabase Setup Guide

Follow these steps to connect your API Keys Dashboard to Supabase:

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details and wait for the database to be created

## 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## 3. Create Environment Variables

1. Create a `.env.local` file in the root of your `my-app` directory
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with the values you copied from step 2.

## 4. Create the Database Table

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `supabase-setup.sql` file
4. Click "Run" to execute the SQL

This will create:
- The `api_keys` table with all necessary columns
- Indexes for better performance
- Row Level Security (RLS) policies
- A trigger to automatically update the `updated_at` timestamp

## 5. Test the Connection

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/dashboards`
3. Try creating a new API key to verify the connection works

## Security Notes

⚠️ **Important**: The current RLS policy allows public access to all operations. For production use, you should:

1. Implement user authentication (Supabase Auth)
2. Update the RLS policies to restrict access based on user ID
3. Consider using service role key for server-side operations only

Example of a more secure policy:
```sql
-- Only allow users to see their own API keys
CREATE POLICY "Users can only see their own API keys" ON api_keys
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only allow users to create their own API keys
CREATE POLICY "Users can only create their own API keys" ON api_keys
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## Troubleshooting

- **Error: Missing Supabase environment variables**
  - Make sure your `.env.local` file exists and contains the correct values
  - Restart your Next.js dev server after creating/updating `.env.local`

- **Error: relation "api_keys" does not exist**
  - Make sure you've run the SQL script in the Supabase SQL Editor

- **Error: new row violates row-level security policy**
  - Check your RLS policies in Supabase
  - The default policy should allow all operations, but verify it's enabled

