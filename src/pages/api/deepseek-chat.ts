import type { APIRoute } from 'astro';
import OpenAI from 'openai';

export const prerender = false;

// Test GET endpoint
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    success: true,
    message: 'DeepSeek API endpoint is working',
    methods: ['GET', 'POST']
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { apiKey, messages, max_tokens, temperature } = body;

    // Validate inputs
    if (!apiKey || !apiKey.startsWith('sk-')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid API key format. DeepSeek API key must start with "sk-"'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Messages array is required and must not be empty'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Calling DeepSeek API via OpenAI SDK...');

    // Initialize OpenAI client with DeepSeek base URL
    const client = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://api.deepseek.com',
    });

    // Call DeepSeek API
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: messages,
      max_tokens: max_tokens || 1000,
      temperature: temperature || 0.7,
      stream: false,
    });

    console.log('DeepSeek API call successful');

    return new Response(JSON.stringify({
      success: true,
      data: completion
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('DeepSeek API error:', error);

    let errorMessage = 'Failed to call DeepSeek API';
    let statusCode = 500;

    if (error.status === 401) {
      errorMessage = 'API Key无效或已过期，请检查您的DeepSeek API Key';
      statusCode = 401;
    } else if (error.status === 429) {
      errorMessage = 'API调用频率超限，请稍后再试';
      statusCode = 429;
    } else if (error.status === 500) {
      errorMessage = 'DeepSeek服务器错误，请稍后再试';
      statusCode = 500;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
      details: error.message
    }), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
