import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { authenticateRequest } from '@/lib/authMiddleware';
import { generateApiKey } from '@/utils/apiKeyUtils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * GET /api/api-keys
 * Get all API keys for the authenticated user
 */
export async function GET(request) {
  // Authenticate request and get user_id
  const { userId, error: authError } = await authenticateRequest(request);
  if (authError) {
    return authError;
  }

  try {
    const { data, error } = await supabaseClient
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching API keys:', error);
      return NextResponse.json(
        { error: 'Failed to fetch API keys', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: data || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/api-keys:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/api-keys
 * Create a new API key for the authenticated user
 */
export async function POST(request) {
  // Authenticate request and get user_id
  const { userId, error: authError } = await authenticateRequest(request);
  if (authError) {
    return authError;
  }

  try {
    const body = await request.json();
    const { name, key } = body;

    // Validate input
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Generate API key if not provided
    const apiKeyValue = key || generateApiKey();

    // Insert new API key with user_id and default rate_limit
    const { data, error: insertError } = await supabaseClient
      .from('api_keys')
      .insert([
        {
          name: name.trim(),
          key: apiKeyValue,
          user_id: userId,
          usage: 0,
          rate_limit: 100, // Default rate limit
        },
      ])
      .select()
      .maybeSingle();

    if (insertError) {
      console.error('Error creating API key:', insertError);
      return NextResponse.json(
        { error: 'Failed to create API key', details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/api-keys:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

