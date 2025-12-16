import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { extractTokenFromHeader, verifyToken } from './jwt';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Middleware to authenticate requests and get user_id from JWT
 * @param {Request} request - Next.js request object
 * @returns {Promise<{userId: string, error: null}|{userId: null, error: NextResponse}>}
 */
export async function authenticateRequest(request) {
  // Extract token from Authorization header
  const token = extractTokenFromHeader(request);

  if (!token) {
    return {
      userId: null,
      error: NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      ),
    };
  }

  // Verify token
  const decoded = verifyToken(token);
  if (!decoded || !decoded.email) {
    return {
      userId: null,
      error: NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      ),
    };
  }

  // Get user_id from email using Supabase
  try {
    const { data: user, error } = await supabaseClient
      .from('users')
      .select('id')
      .eq('email', decoded.email)
      .maybeSingle();

    if (error || !user) {
      return {
        userId: null,
        error: NextResponse.json(
          { error: 'User not found' },
          { status: 401 }
        ),
      };
    }

    return {
      userId: user.id,
      error: null,
    };
  } catch (err) {
    console.error('Error fetching user:', err);
    return {
      userId: null,
      error: NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      ),
    };
  }
}

