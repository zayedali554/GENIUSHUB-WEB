// Netlify Function for Generate Key URL shortening
// This replaces the PHP backend with serverless function

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
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
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const { destinationUrl, alias } = JSON.parse(event.body);

    // Validate input
    if (!destinationUrl) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'destinationUrl is required' })
      };
    }

    // List of shortener URLs to redirect through (replace with real ones)
    const shortenerUrls = [
      'https://short.link/example1',
      'https://short.link/example2', 
      'https://short.link/example3',
      'https://bit.ly/example4',
      'https://tinyurl.com/example5'
    ];

    // Select random shortener URL
    const randomShortener = shortenerUrls[Math.floor(Math.random() * shortenerUrls.length)];

    // Generate unique access key
    const accessKey = 'KEY_' + Math.random().toString(36).substr(2, 12).toUpperCase() + '_' + Date.now().toString(36).toUpperCase();

    // In a real implementation, you might:
    // 1. Store the key in a database
    // 2. Create actual shortened URLs via API
    // 3. Set up redirect tracking

    // For now, return the shortener URL with access key
    const response = {
      success: true,
      shortenedUrl: randomShortener,
      accessKey: accessKey,
      destinationUrl: destinationUrl,
      expiresIn: '48 hours',
      message: 'Access key generated successfully'
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('Error in generate-url function:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};

// Alternative implementation using external URL shortener API
// Uncomment and configure if you want to use real URL shortening service

/*
const shortenUrlWithAPI = async (longUrl) => {
  try {
    // Example using TinyURL API (free)
    const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
    const shortUrl = await response.text();
    return shortUrl;
    
    // Example using Bit.ly API (requires API key)
    // const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer YOUR_BITLY_ACCESS_TOKEN`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ long_url: longUrl })
    // });
    // const data = await response.json();
    // return data.link;
    
  } catch (error) {
    console.error('URL shortening failed:', error);
    return longUrl; // Return original URL if shortening fails
  }
};
*/
