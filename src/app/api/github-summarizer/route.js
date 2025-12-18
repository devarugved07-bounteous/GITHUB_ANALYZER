import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Validates API key against Supabase and checks rate limits
 * @param {string} apiKey - The API key to validate
 * @returns {Promise<{valid: boolean, data: object|null, error: string|null, rateLimited: boolean}>}
 */
async function validateApiKey(apiKey) {
  if (!apiKey) {
    return { valid: false, data: null, error: 'API key is required', rateLimited: false };
  }

  // Trim whitespace from API key
  const trimmedKey = apiKey.trim();

  try {
    // Fetch API key with usage and rate_limit columns
    const { data, error } = await supabaseClient
      .from('api_keys')
      .select('id, name, key, usage, rate_limit')
      .eq('key', trimmedKey)
      .maybeSingle();

    if (error) {
      console.error('Supabase query error:', error);
      // Check if it's a "not found" error (PGRST116) or other error
      if (error.code === 'PGRST116') {
        return { valid: false, data: null, error: 'API key not found in database', rateLimited: false };
      }
      return { valid: false, data: null, error: `Database error: ${error.message}`, rateLimited: false };
    }

    if (!data) {
      return { valid: false, data: null, error: 'API key not found in database', rateLimited: false };
    }

    // Check rate limit
    const currentUsage = data.usage || 0;
    const rateLimit = data.rate_limit || 100; // Default to 100 if not set

    if (currentUsage >= rateLimit) {
      return { 
        valid: false, 
        data: null, 
        error: 'Rate limit exceeded', 
        rateLimited: true,
        usage: currentUsage,
        rateLimit: rateLimit
      };
    }

    // Increment usage and update last_used timestamp atomically
    const newUsage = currentUsage + 1;
    const { error: updateError } = await supabaseClient
      .from('api_keys')
      .update({ 
        usage: newUsage,
        last_used: new Date().toISOString() 
      })
      .eq('id', data.id);

    if (updateError) {
      console.error('Error updating API key usage:', updateError);
      // Don't fail the request if usage update fails, but log it
      // Still allow the request to proceed
    }

    return { 
      valid: true, 
      data: {
        ...data,
        usage: newUsage
      }, 
      error: null,
      rateLimited: false
    };
  } catch (err) {
    console.error('Error validating API key:', err);
    return { valid: false, data: null, error: `Error validating API key: ${err.message}`, rateLimited: false };
  }
}

/**
 * Parses GitHub URL to extract owner and repo
 * @param {string} url - GitHub repository URL
 * @returns {Promise<{owner: string, repo: string, branch: string}|null>}
 */
function parseGitHubUrl(url) {
  if (!url) return null;

  try {
    // Remove trailing slash and .git if present
    url = url.trim().replace(/\/$/, '').replace(/\.git$/, '');
    
    // Match patterns like:
    // https://github.com/owner/repo
    // https://github.com/owner/repo/tree/branch
    // git@github.com:owner/repo.git
    const patterns = [
      /github\.com[/:]([^/]+)\/([^/]+)(?:\/tree\/([^/]+))?/,
      /github\.com[/:]([^/]+)\/([^/]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2].replace(/\.git$/, ''),
          branch: match[3] || 'main'
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error parsing GitHub URL:', error);
    return null;
  }
}

/**
 * Creates a LangChain chain for summarizing GitHub repositories
 * @param {string} readmeContent - The README.md content to summarize
 * @returns {Promise<{summary: string, cool_facts: string[]}|null>}
 */
async function summarizeRepository(readmeContent) {
  try {
    // Define the structured output schema
    const schema = z.object({
      summary: z.string().describe('A comprehensive summary of the GitHub repository based on the README content'),
      cool_facts: z.array(z.string()).describe('A list of interesting or notable facts about the repository')
    });

    // Initialize LLM - try Anthropic first, fallback to OpenAI
    let llm;
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    // Add validation and better error messages
    if (anthropicApiKey && anthropicApiKey.trim()) {
      try {
        llm = new ChatAnthropic({
          model: 'claude-3-5-haiku-20241022',
          temperature: 0.0,
          apiKey: anthropicApiKey.trim(),
        });
        console.log('Using Anthropic Claude model');
      } catch (error) {
        console.error('Error initializing Anthropic LLM:', error);
        throw new Error(`Failed to initialize Anthropic LLM: ${error.message}`);
      }
    } else if (openaiApiKey && openaiApiKey.trim()) {
      try {
        llm = new ChatOpenAI({
          model: 'gpt-4o',
          temperature: 0.0,
          apiKey: openaiApiKey.trim(),
        });
        console.log('Using OpenAI GPT model');
      } catch (error) {
        console.error('Error initializing OpenAI LLM:', error);
        throw new Error(`Failed to initialize OpenAI LLM: ${error.message}`);
      }
    } else {
      throw new Error('No LLM API key found. Please set ANTHROPIC_API_KEY or OPENAI_API_KEY environment variable in your .env.local file');
    }

    // Create prompt template
    const prompt = PromptTemplate.fromTemplate(
      'Summarize this github repository from this readme file content:\n\n{readmeContent}'
    );

    // Create chain with structured output
    const chain = prompt.pipe(llm.withStructuredOutput(schema));

    // Invoke the chain
    const result = await chain.invoke({
      readmeContent: readmeContent
    });

    return result;
  } catch (error) {
    console.error('Error in summarizeRepository:', error);
    
    // Check for credit balance errors
    const errorMessage = error.message || '';
    const errorString = JSON.stringify(error);
    
    if (errorMessage.includes('credit balance') || 
        errorMessage.includes('too low') ||
        errorString.includes('credit balance') ||
        (error.error?.message && error.error.message.includes('credit balance'))) {
      throw new Error(
        'Insufficient API credits. Your Anthropic or OpenAI account has insufficient credits to process this request. ' +
        'Please add credits to your API account:\n' +
        '- Anthropic: https://console.anthropic.com/settings/billing\n' +
        '- OpenAI: https://platform.openai.com/account/billing'
      );
    }
    
    // Provide more specific error messages
    if (error.message?.includes('authentication_error') || error.message?.includes('invalid x-api-key')) {
      throw new Error(`LLM API authentication failed. Please check that your ANTHROPIC_API_KEY or OPENAI_API_KEY is valid and correctly set in .env.local`);
    }
    
    throw error;
  }
}

/**
 * Fetches README.md content from GitHub repository
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} branch - Branch name (default: main)
 * @returns {Promise<{content: string, error: string|null}>}
 */
async function fetchGitHubReadme(owner, repo, branch = 'main') {
  try {
    // Try GitHub API first (handles different README file names)
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Readme-Fetcher'
      }
    });

    if (response.ok) {
      const data = await response.json();
      // Decode base64 content
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      return { content, error: null };
    }

    // If API fails, try raw content URL
    const readmeVariants = ['README.md', 'readme.md', 'Readme.md'];
    for (const variant of readmeVariants) {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${variant}`;
      const rawResponse = await fetch(rawUrl);

      if (rawResponse.ok) {
        const content = await rawResponse.text();
        return { content, error: null };
      }
    }

    return { content: null, error: 'README.md not found in repository' };
  } catch (error) {
    console.error('Error fetching GitHub README:', error);
    return { content: null, error: `Failed to fetch README: ${error.message}` };
  }
}

/**
 * GET handler for /api/github-summarizer
 */
export async function GET(request) {
  try {
    // Extract API key from headers (check common header names)
    const apiKey = 
      request.headers.get('x-api-key') ||
      request.headers.get('authorization')?.replace('Bearer ', '') ||
      request.headers.get('api-key');

    const validation = await validateApiKey(apiKey);

    if (!validation.valid) {
      // Check if it's a rate limit error
      if (validation.rateLimited) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            message: `API key has reached its usage limit of ${validation.rateLimit} requests`,
            usage: validation.usage,
            rateLimit: validation.rateLimit
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { 
          error: validation.error || 'Invalid API key',
          message: 'API key validation failed'
        },
        { status: 401 }
      );
    }

    // API key is valid, return success response
    return NextResponse.json(
      { 
        message: 'API key validated successfully',
        valid: true,
        usage: validation.data.usage,
        rateLimit: validation.data.rate_limit
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/github-summarizer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for /api/github-summarizer
 */
export async function POST(request) {
  try {
    // Extract API key from headers (required in header)
    // Note: Headers in Next.js are case-insensitive, but we check common variations
    const apiKey = 
      request.headers.get('x-api-key') ||
      request.headers.get('X-API-Key') ||
      request.headers.get('authorization')?.replace('Bearer ', '') ||
      request.headers.get('Authorization')?.replace('Bearer ', '') ||
      request.headers.get('api-key') ||
      request.headers.get('API-Key');

    // Debug logging (remove in production)
    console.log('API Key received:', apiKey ? `${apiKey.substring(0, 8)}...` : 'NOT PROVIDED');
    console.log('All headers:', Object.fromEntries(request.headers.entries()));

    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'API key is required in header',
          message: 'Please provide API key in x-api-key, authorization, or api-key header',
          receivedHeaders: Array.from(request.headers.keys())
        },
        { status: 401 }
      );
    }

    // Validate API key and check rate limits
    const validation = await validateApiKey(apiKey);

    if (!validation.valid) {
      // Check if it's a rate limit error
      if (validation.rateLimited) {
        console.error('API key rate limit exceeded:', {
          usage: validation.usage,
          rateLimit: validation.rateLimit
        });
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            message: `API key has reached its usage limit of ${validation.rateLimit} requests. Please upgrade your plan or wait for the limit to reset.`,
            usage: validation.usage,
            rateLimit: validation.rateLimit
          },
          { status: 429 }
        );
      }

      console.error('API key validation failed:', validation.error);
      return NextResponse.json(
        { 
          error: validation.error || 'Invalid API key',
          message: 'API key validation failed',
          hint: 'Make sure the API key exists in your Supabase api_keys table'
        },
        { status: 401 }
      );
    }

    // Extract GitHub URL from request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { 
          error: 'Invalid request body',
          message: 'Request body must be valid JSON'
        },
        { status: 400 }
      );
    }

    const githubUrl = body.githubUrl || body.github_url || body.url;

    if (!githubUrl) {
      return NextResponse.json(
        { 
          error: 'GitHub URL is required',
          message: 'Please provide githubUrl in the request body'
        },
        { status: 400 }
      );
    }

    // Parse GitHub URL
    const parsedUrl = parseGitHubUrl(githubUrl);
    if (!parsedUrl) {
      return NextResponse.json(
        { 
          error: 'Invalid GitHub URL',
          message: 'Please provide a valid GitHub repository URL'
        },
        { status: 400 }
      );
    }

    // Fetch README content
    const { content, error: readmeError } = await fetchGitHubReadme(
      parsedUrl.owner,
      parsedUrl.repo,
      parsedUrl.branch
    );

    if (readmeError || !content) {
      return NextResponse.json(
        { 
          error: readmeError || 'Failed to fetch README',
          message: 'Could not retrieve README.md from the repository'
        },
        { status: 404 }
      );
    }

    // Generate summary using LangChain
    let summaryResult;
    try {
      summaryResult = await summarizeRepository(content);
    } catch (error) {
      console.error('Error generating summary:', error);
      
      // Check if it's a credit balance error
      const errorMessage = error.message || '';
      const isCreditError = errorMessage.includes('credit balance') || 
                           errorMessage.includes('Insufficient API credits');
      
      return NextResponse.json(
        { 
          error: isCreditError ? 'Insufficient API Credits' : 'Failed to generate summary',
          message: error.message || 'Error processing README content with LLM'
        },
        { status: isCreditError ? 402 : 500 }
      );
    }

    // Return summary result
    return NextResponse.json(
      { 
        success: true,
        repository: {
          owner: parsedUrl.owner,
          repo: parsedUrl.repo,
          branch: parsedUrl.branch,
          url: githubUrl
        },
        summary: summaryResult.summary,
        cool_facts: summaryResult.cool_facts
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /api/github-summarizer:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

