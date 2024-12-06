// crewtracker-backend/src/index.ts
import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import { Session } from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { sessionMiddleware } from './middleware/session';

// Load env variables before other imports
dotenv.config();

// Types
interface AuthenticatedRequest extends Request {
  session: Session & {
    user?: {
      id: string;
      email: string;
    };
  };
}

const app = express();
const port = 3000;

// crewtracker-backend/src/index.ts
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(bodyParser.json());
app.use(sessionMiddleware);

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key is missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Auth Routes
app.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register' });
  }
});

app.post('/auth/login', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    if (req.session && data.user && data.user.email) {
      req.session.user = {
        id: data.user.id,
        email: data.user.email
      };
    }

    res.json({ user: data.user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.post('/auth/logout', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    if (req.session) {
      await new Promise<void>((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) reject(err);
          resolve();
        });
      });
    }
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
});

// Session check middleware
const checkSession = (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): void => {
  if (!req.session?.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  next();
};

// crewtracker-backend/src/index.ts
// Add this new endpoint
app.get('/check-session', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.session?.user) {
      res.json({ user: req.session.user });
    } else {
      res.status(401).json({ error: 'No active session' });
    }
  } catch (error) {
    console.error('Session check error:', error);
    res.status(500).json({ error: 'Failed to check session' });
  }
});

// Protected Routes
app.get('/health-data', checkSession, async (
  req: AuthenticatedRequest, 
  res: Response
): Promise<void> => {
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    console.log('Fetching health data for user:', userId);

    const { data, error } = await supabase
      .from('health_data')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching health data:', error);
    res.status(500).json({ error: 'Failed to fetch health data' });
  }
});

app.get('/shifts', checkSession, async (
  req: AuthenticatedRequest, 
  res: Response
): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('shifts')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching shifts:', error);
    res.status(500).json({ error: 'Failed to fetch shifts' });
  }
});

app.post('/feedback', checkSession, async (
  req: AuthenticatedRequest,
   res: Response
  ): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .insert([req.body]);

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});