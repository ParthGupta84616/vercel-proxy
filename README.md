# EV Route Planner - Vercel Proxy

This server acts as a bridge between your mobile app and your local ngrok development server.

## Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Deploy to Vercel: `vercel --prod`
4. Set environment variable: `vercel env add NGROK_URL`

## Environment Variables

- `NGROK_URL`: Your ngrok tunnel URL (e.g., `https://abc123.ngrok.io`)

## Usage

Your mobile app should make requests to:
