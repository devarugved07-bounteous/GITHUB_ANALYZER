# Authentication Setup Guide

This guide will help you set up the user authentication system for the application.

## 1. Create the Users Table in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click "New Query"
4. Copy and paste the contents of `users-table-setup.sql` file
5. Click "Run" to execute the SQL

This will create:
- The `users` table with columns: id, email, password, name, created_at, updated_at
- Indexes for better performance
- Row Level Security (RLS) policies
- A trigger to automatically update the `updated_at` timestamp

## 2. Verify Environment Variables

Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Install Dependencies

The authentication system requires `bcryptjs` for password hashing. It should already be installed, but if not, run:

```bash
npm install bcryptjs
```

## 4. Test the Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/signup` to create a new account
3. After signing up, you'll be redirected to the dashboard
4. Try logging out and logging back in at `http://localhost:3000/login`
5. Try accessing `/dashboards` without logging in - you should be redirected to the login page with a "Login required" toast

## Features

- **User Signup**: Users can create accounts with email and password
- **User Login**: Users can log in with their credentials
- **Protected Routes**: The dashboard is protected and requires authentication
- **Session Management**: User sessions are stored in localStorage
- **Auto-redirect**: Unauthenticated users are redirected to login with a toast notification
- **Logout**: Users can log out from the sidebar

## Security Notes

⚠️ **Important**: For production use, consider:

1. Using HTTP-only cookies instead of localStorage for session management
2. Implementing password strength requirements
3. Adding email verification
4. Implementing rate limiting on login/signup endpoints
5. Using more secure password hashing (bcryptjs is good, but consider bcrypt with higher rounds)
6. Adding CSRF protection
7. Implementing proper session expiration

## API Endpoints

- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Authenticate a user
- `POST /api/auth/verify` - Verify a user session

## Pages

- `/login` - Login page
- `/signup` - Sign up page
- `/dashboards` - Protected dashboard (requires authentication)

