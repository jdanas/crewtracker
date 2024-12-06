// crewtracker-backend/src/middleware/session.ts
import session from 'express-session';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Connect to Redis
redisClient.connect().catch(console.error);

// Add error handling
redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

// Initialize Redis store
const store = new RedisStore({
  client: redisClient as unknown, // Type assertion needed due to Redis client version differences
  prefix: 'crewtracker:'
});

export const sessionMiddleware = session({
  store,
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 5 * 60 * 1000 // 5 minutes
  }
});