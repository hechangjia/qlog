import OpenAI from 'openai';

export const handler = async (event) => {
  // Enable CORS
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Handle GET request (test endpoint)
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'DeepSeek API endpoint is working',
        methods: ['GET', 'POST']
      })
    };
  }

  // Handle POST request
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const { apiKey, messages, max_tokens, temperature } = body;

      // Validate inputs
      if (!apiKey || !apiKey.startsWith('sk-')) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Invalid API key format. DeepSeek API key must start with "sk-"'
          })
        };
      }

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Messages array is required and must not be empty'
          })
        };
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

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: completion
        })
      };

    } catch (error) {
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
  }

  // Method not allowed
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({
      success: false,
      error: 'Method not allowed'
    })
  };
};
