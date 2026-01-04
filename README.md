# AquaMart (MERN eCommerce)

A modern, blue-themed eCommerce platform built with the MERN stack.

## Monorepo Structure
```
/client
  /src
    /components
    /pages
    /context
    /hooks
    /utils
    /assets
    App.jsx
    main.jsx
/server
  /controllers
  /models
  /routes
  /middleware
  /config
```

## Quick Start
1. Copy environment variables:
   - Server: copy `server/.env.example` to `server/.env` and fill values
   - Client: copy `client/.env.example` to `client/.env`
2. Install dependencies and run both apps:
```
npm install
npm run dev
```

## Environment Variables
Server `.env`:
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_URL=your_cloudinary_url
STRIPE_SECRET_KEY=your_stripe_key
```
Client `.env` (optional):
```
VITE_API_BASE=/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_replace
```
