# Fullstack E-commerce (React + Node.js + MongoDB)

This is a minimal functional scaffold for the practical task you provided.
Features (basic):
- Node.js + Express backend with MongoDB (Mongoose)
- Joi validation for request payloads
- User & Seller auth (simple, no JWT persistence for demo)
- Product CRUD (seller)
- Product listing, cart, checkout flow (user)
- Coupons & wallet handling (basic)
- React frontend (CRA-style) with pages: Landing, Signup, Login, Products, Create Product, Cart

**Note**: This is a scaffold for learning and practical test usage. For production use: secure passwords, add auth tokens, improve error handling, add tests, sanitize inputs, configure CORS properly, and deploy.

## Run backend
1. Copy `backend/.env.example` to `backend/.env` and set `MONGO_URI`.
2. `cd backend`
3. `npm install`
4. `npm run dev`

## Run frontend
1. `cd frontend`
2. `npm install`
3. `npm start`

