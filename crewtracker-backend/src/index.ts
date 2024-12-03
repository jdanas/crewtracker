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

// Routes
app.get('/health-data', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('health_data')
      .select('*');

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching health data:', error);
    res.status(500).json({ error: 'Failed to fetch health data'});
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

