import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { authenticateRequest } from '@/lib/authMiddleware';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * GET /api/api-keys/[id]
 * Get a specific API key by ID for the authenticated user
 */
export async function GET(request, { params }) {
  // Authenticate request and get user_id
  const { userId, error: authError } = await authenticateRequest(request);
  if (authError) {
    return authError;
  }

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      );
    }

    // Fetch API key and verify it belongs to the user
    const { data, error } = await supabaseClient
      .from('api_keys')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'API key not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching API key:', error);
      return NextResponse.json(
        { error: 'Failed to fetch API key', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/api-keys/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/api-keys/[id]
 * Update a specific API key by ID for the authenticated user
 */
export async function PUT(request, { params }) {
  // Authenticate request and get user_id
  const { userId, error: authError } = await authenticateRequest(request);
  if (authError) {
    return authError;
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, key } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      );
    }

    // Validate input
    if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
      return NextResponse.json(
        { error: 'Name must be a non-empty string' },
        { status: 400 }
      );
    }

    if (key !== undefined && (typeof key !== 'string' || key.trim().length === 0)) {
      return NextResponse.json(
        { error: 'Key must be a non-empty string' },
        { status: 400 }
      );
    }

    // Build update object
    const updateData = {};
    if (name !== undefined) {
      updateData.name = name.trim();
    }
    if (key !== undefined) {
      updateData.key = key.trim();
    }
    updateData.updated_at = new Date().toISOString();

    if (Object.keys(updateData).length === 1) {
      // Only updated_at was set, no actual fields to update
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Update API key and verify it belongs to the user
    const { data, error } = await supabaseClient
      .from('api_keys')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'API key not found' },
          { status: 404 }
        );
      }
      console.error('Error updating API key:', error);
      return NextResponse.json(
        { error: 'Failed to update API key', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PUT /api/api-keys/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/api-keys/[id]
 * Delete a specific API key by ID for the authenticated user
 */
export async function DELETE(request, { params }) {
  // Authenticate request and get user_id
  const { userId, error: authError } = await authenticateRequest(request);
  if (authError) {
    return authError;
  }

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      );
    }

    // First verify the API key exists and belongs to the user
    const { data: existingKey, error: fetchError } = await supabaseClient
      .from('api_keys')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError || !existingKey) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    // Delete the API key
    const { error: deleteError } = await supabaseClient
      .from('api_keys')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting API key:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete API key', details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'API key deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/api-keys/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

