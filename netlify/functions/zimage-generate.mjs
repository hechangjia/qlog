import OpenAI from 'openai';

export const handler = async (event) => {
  // Enable CORS
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Method not allowed'
      })
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { apiKey, prompt, size, num_inference_steps } = body;

    // Validate API key
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid API key. z-image-turbo API key is required'
        })
      };
    }

    // Validate prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Prompt is required and must not be empty'
        })
      };
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
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: response
      })
    };

  } catch (error) {
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

    return {
      statusCode: statusCode,
      headers,
      body: JSON.stringify({
        success: false,
        error: errorMessage,
        details: error.message
      })
    };
  }
};
