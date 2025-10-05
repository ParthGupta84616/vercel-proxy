export default async function handler(req, res) {
    console.log(req.method, req.url);
  // Handle CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(200).end();
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  try {
    // Your ngrok URL - you'll update this environment variable
    const NGROK_URL = process.env.NGROK_URL || 'https://your-ngrok-url.ngrok.io';
    
    if (!NGROK_URL || NGROK_URL === 'https://your-ngrok-url.ngrok.io') {
      return res.status(500).json({ 
        error: 'NGROK_URL not configured',
        message: 'Please set the NGROK_URL environment variable'
      });
    }

    // Extract path from the actual URL
    const urlPath = req.url.split('?')[0]; // Remove query string
    const apiPath = urlPath.replace(/^\/api\/proxy\/?/, ''); // Remove /api/proxy prefix
    
    // Construct target URL (apiPath already starts with / if it exists)
    const targetUrl = apiPath ? `${NGROK_URL}${apiPath}` : NGROK_URL;
    
    // Forward query parameters
    const queryString = req.url.split('?')[1] || '';
    const finalUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl;

    console.log(`🔄 Proxying ${req.method} request to: ${finalUrl}`);

    // Prepare headers for forwarding (exclude host and other Vercel-specific headers)
    const forwardHeaders = { ...req.headers };
    delete forwardHeaders.host;
    delete forwardHeaders['x-forwarded-for'];
    delete forwardHeaders['x-forwarded-proto'];
    delete forwardHeaders['x-vercel-id'];
    delete forwardHeaders['x-vercel-cache'];
    delete forwardHeaders['content-length'];
    
    // Make the request to your ngrok server
    const fetchOptions = {
      method: req.method,
      headers: {
        ...forwardHeaders,
        'User-Agent': 'Vercel-Proxy/1.0',
      },
    };

    // Add body for non-GET/HEAD requests
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      if (!forwardHeaders['content-type']) {
        fetchOptions.headers['content-type'] = 'application/json';
      }
    }

    const response = await fetch(finalUrl, fetchOptions);

    // Get response data
    const contentType = response.headers.get('content-type');
    
    // Forward response headers
    response.headers.forEach((value, key) => {
      if (!key.startsWith('x-') && key !== 'content-encoding' && key !== 'transfer-encoding') {
        res.setHeader(key, value);
      }
    });

    console.log(`✅ Response: ${response.status} ${response.statusText}`);

    // Send the response based on content type
    if (contentType && contentType.includes('application/json')) {
      const responseData = await response.json();
      return res.status(response.status).json(responseData);
    } else {
      const responseData = await response.text();
      return res.status(response.status).send(responseData);
    }

  } catch (error) {
    console.error('❌ Proxy Error:', error);
    
    return res.status(500).json({
      error: 'Proxy Error',
      message: error.message,
      details: 'Failed to connect to local server. Is ngrok running?'
    });
  }
}

