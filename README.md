# 🌉 Vercel Proxy Server

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ParthGupta84616/vercel-proxy)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vercel Status](https://img.shields.io/badge/vercel-deployed-success)](https://parth-vercel-proxy.vercel.app/)

> 🚀 A lightweight, serverless proxy that bridges mobile/web applications with local ngrok development servers.

**Live URL:** [parth-vercel-proxy.vercel.app](https://parth-vercel-proxy.vercel.app/)

---

## 📖 Table of Contents

- [Why This Exists](#-why-this-exists)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Usage](#-usage)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Examples](#-examples)
- [Troubleshooting](#-troubleshooting)
- [Monitoring](#-monitoring)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🤔 Why This Exists

### The Problem

When developing mobile apps that communicate with local backend servers:

❌ **Ngrok URLs change every restart**  
❌ **Must rebuild app every time URL changes**  
❌ **CORS issues with mobile apps**  
❌ **Production builds can't access localhost**  

### The Solution

✅ **One permanent URL** → `parth-vercel-proxy.vercel.app`  
✅ **No rebuilds needed** → Just update environment variable  
✅ **CORS handled** → All cross-origin headers configured  
✅ **Free & serverless** → Hosted on Vercel's free tier  

---

## ✨ Features

- 🔄 **Universal Proxying** - Supports all HTTP methods (GET, POST, PUT, DELETE, PATCH)
- 🔐 **CORS Ready** - Pre-configured for mobile apps
- 📝 **Query Preservation** - All URL parameters forwarded
- 🎯 **Smart Headers** - Automatic header management
- 📊 **Request Logging** - Console logging for debugging
- 🚨 **Error Handling** - Graceful error messages
- ⚡ **Serverless** - Zero maintenance, auto-scaling
- 💰 **Free** - No hosting costs

---

## 🚀 Quick Start

### For Users (Using the Proxy)

**1. Get the Proxy URL:**
```javascript
const API_URL = 'https://parth-vercel-proxy.vercel.app';
```

**2. Use in Your App:**
```javascript
// Instead of connecting directly to ngrok:
// ❌ const API = 'https://abc123.ngrok.io';

// Use the permanent proxy URL:
// ✅ const API = 'https://parth-vercel-proxy.vercel.app';

fetch(`${API}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

**That's it!** The proxy will forward your requests to the configured ngrok server.

---

### For Maintainers (Setting Up)

**1. Clone Repository:**
```bash
git clone https://github.com/ParthGupta84616/vercel-proxy.git
cd vercel-proxy
npm install
```

**2. Deploy to Vercel:**
```bash
vercel --prod
```

**3. Configure Ngrok URL:**
```bash
vercel env add NGROK_URL production
# Enter: https://your-ngrok-url.ngrok.io
vercel --prod
```

---

## 💻 Usage

### React Native

```javascript
// api/config.js
export const API_BASE_URL = 'https://parth-vercel-proxy.vercel.app';

// api/auth.js
import { API_BASE_URL } from './config';

export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  register: async (email, password, name) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    return response.json();
  }
};
```

### Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://parth-vercel-proxy.vercel.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Flutter

```dart
class ApiService {
  static const String baseUrl = 'https://parth-vercel-proxy.vercel.app';

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to login');
    }
  }
}
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NGROK_URL` | Your ngrok tunnel URL | `https://abc123.ngrok.io` | ✅ Yes |

### Updating Ngrok URL

When your ngrok URL changes (it will!), update it:

**Method 1: Via Vercel CLI**
```bash
vercel env rm NGROK_URL production -y
vercel env add NGROK_URL production
# Enter new URL when prompted
vercel --prod
```

**Method 2: Via Vercel Dashboard**
1. Go to [vercel.com/parth-guptas-projects-e15c6136](https://vercel.com/parth-guptas-projects-e15c6136)
2. Select your project
3. Settings → Environment Variables
4. Edit `NGROK_URL`
5. Redeploy

---

## 📡 API Reference

### Base URL
```
https://parth-vercel-proxy.vercel.app
```

### Endpoint Pattern

All requests follow this pattern:

```
https://parth-vercel-proxy.vercel.app/[your-path]
  ↓
https://your-ngrok.ngrok.io/[your-path]
```

### Examples

| Your Request | Proxied To |
|--------------|------------|
| `GET /api/users` | `GET https://your-ngrok.ngrok.io/api/users` |
| `POST /api/auth/login` | `POST https://your-ngrok.ngrok.io/api/auth/login` |
| `GET /api/vehicles?page=1` | `GET https://your-ngrok.ngrok.io/api/vehicles?page=1` |
| `DELETE /api/users/123` | `DELETE https://your-ngrok.ngrok.io/api/users/123` |

### Supported Methods

✅ GET  
✅ POST  
✅ PUT  
✅ PATCH  
✅ DELETE  
✅ OPTIONS  

### Headers Forwarded

✅ `Content-Type`  
✅ `Authorization`  
✅ `Accept`  
✅ Custom headers  

❌ `x-vercel-*` (removed)  
❌ `x-forwarded-*` (removed)  
❌ `content-length` (recalculated)  

---

## 🔍 Examples

### Complete React Native Integration

```javascript
// services/api.js
const BASE_URL = 'https://parth-vercel-proxy.vercel.app';

class ApiService {
  constructor() {
    this.baseURL = BASE_URL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  login(email, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  register(email, password, name) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  // Vehicle endpoints
  getVehicles() {
    return this.request('/api/vehicles');
  }

  createVehicle(vehicleData) {
    return this.request('/api/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  }

  // Route planning
  planRoute(routeData) {
    return this.request('/api/routes/plan', {
      method: 'POST',
      body: JSON.stringify(routeData),
    });
  }
}

export default new ApiService();
```

### Usage in Components

```javascript
// screens/LoginScreen.js
import api from '../services/api';

const LoginScreen = () => {
  const handleLogin = async () => {
    try {
      const response = await api.login(email, password);
      api.setToken(response.token);
      // Navigate to home
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      <TextInput value={email} onChangeText={setEmail} />
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};
```

---

## 🐛 Troubleshooting

### "NGROK_URL not configured" Error

**Cause:** Environment variable not set

**Fix:**
```bash
vercel env add NGROK_URL production
vercel --prod
```

### "Failed to connect to local server"

**Cause:** Ngrok tunnel is down or URL changed

**Fix:**
1. Start ngrok: `ngrok http 3000`
2. Copy the new URL (e.g., `https://new123.ngrok.io`)
3. Update environment variable (see [Configuration](#-configuration))

### CORS Errors

**Cause:** Usually already handled, but if you see them:

**Fix:**
- Clear app cache and rebuild
- Ensure local server also has CORS enabled
- Check that proxy is actually being used

### Request Timeout

**Cause:** Response takes longer than 30 seconds

**Fix:**
- Optimize backend response time
- Break large requests into smaller chunks
- Consider upgrading Vercel plan for longer timeouts

### Getting Empty/Wrong Responses

**Cause:** Cached response

**Fix:**
```bash
vercel --prod --force
```

---

## 📊 Monitoring

### View Logs

**Via CLI:**
```bash
vercel logs vercel-proxy --follow
```

**Via Dashboard:**
1. Go to [Vercel Dashboard](https://vercel.com/parth-guptas-projects-e15c6136)
2. Select project
3. Functions → Logs

### Request Format in Logs

```
🔄 Proxying GET request to: https://abc123.ngrok.io/api/users
✅ Response: 200 OK
```

### Check Deployment Status

```bash
vercel ls
```

---

## 🛡️ Security Considerations

### Production Use

This proxy currently allows open access. For production:

**1. Add API Key:**
```javascript
// In api/proxy.js
const API_KEY = process.env.API_KEY;
if (req.headers['x-api-key'] !== API_KEY) {
  return res.status(401).json({ error: 'Unauthorized' });
}
```

**2. Restrict Origins:**
```javascript
// Change from '*' to specific domain
res.setHeader('Access-Control-Allow-Origin', 'https://yourdomain.com');
```

**3. Rate Limiting:**
Consider adding rate limiting for production use.

---

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

### Development Setup

```bash
# Clone the repo
git clone https://github.com/ParthGupta84616/vercel-proxy.git
cd vercel-proxy

# Install dependencies
npm install

# Test locally
vercel dev
```

### Submitting Changes

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Vercel](https://vercel.com) for serverless hosting
- [Ngrok](https://ngrok.com) for secure tunneling
- The open-source community

---

## 📞 Support

- 🐛 **Issues:** [GitHub Issues](https://github.com/ParthGupta84616/vercel-proxy/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/ParthGupta84616/vercel-proxy/discussions)

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Made with ❤️ for developers tired of changing ngrok URLs**
