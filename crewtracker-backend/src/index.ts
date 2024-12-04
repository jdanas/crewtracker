// crewtracker-backend/src/index.ts
import * as dotenv from 'dotenv';
// Load env variables before other imports
dotenv.config();
// crewtracker-backend/src/index.ts
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey);
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key is missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

app.post('/auth/register', async (req, res) => {
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

app.post('/auth/logout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
});

// Modify login endpoint to include session expiry
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Add session expiry (5 minutes from now)
    const session = {
      ...data.session,
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    };

    res.json({ user: data.user, session });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Update health data route to include user_id
app.get('/health-data', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
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

app.get('/shifts', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('shifts')
      .select('*');

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching shifts:', error);
    res.status(500).json({ error: 'Failed to fetch shifts'});
  }
});

app.post('/feedback', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .insert([req.body]);

    if (error) {
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error inserting feedback:', error);
    res.status(500).json({ error: 'Failed to insert feedback'});
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

