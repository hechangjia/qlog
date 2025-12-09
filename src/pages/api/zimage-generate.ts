import type { APIRoute } from 'astro';
import OpenAI from 'openai';

// This endpoint must be server-rendered (not prerendered)
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse request body
    const body = await request.json();
    const { apiKey, prompt, size, num_inference_steps } = body;

    // Validate API key
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
      return new Response(JSON.stringify({
        error: 'Invalid API key. z-image-turbo API key is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return new Response(JSON.stringify({
        error: 'Prompt is required and must not be empty'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Initialize OpenAI client with z-image-turbo configuration
    const client = new OpenAI({
      baseURL: 'https://ai.gitee.com/v1',
      apiKey: apiKey,
    });

    // Call z-image-turbo API using OpenAI SDK
    console.log('Calling z-image-turbo API via OpenAI SDK...');
    console.log('Prompt:', prompt.substring(0, 100) + '...');

    const response = await client.images.generate({
      model: 'z-image-turbo',
      prompt: prompt,
      size: size || '1024x1024',
      num_inference_steps: num_inference_steps || 9,
    });

    console.log('z-image-turbo API call successful');
    console.log('Response data:', response.data);

    // Return the response
    return new Response(JSON.stringify({
      success: true,
      data: response
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error calling z-image-turbo API:', error);

    // Parse error details
    let errorMessage = 'Failed to call z-image-turbo API';
    let statusCode = 500;

    if (error.status) {
      statusCode = error.status;

      if (error.status === 401) {
        errorMessage = 'z-image-turbo API Key无效或已过期';
      } else if (error.status === 429) {
        errorMessage = 'z-image-turbo API调用频率超限，请稍后再试';
      } else if (error.status === 500) {
        errorMessage = 'z-image-turbo服务器错误，请稍后再试';
      } else {
        errorMessage = error.message || errorMessage;
      }
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
