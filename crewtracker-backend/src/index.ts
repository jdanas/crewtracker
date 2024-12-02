import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Mock data
const healthData = {
  heartRate: 72,
  steps: 8432,
  sleepHours: 7.5,
  lastUpdated: new Date(),
};

const shifts = [
  {
    id: '1',
    startTime: new Date('2024-03-10T08:00:00'),
    endTime: new Date('2024-03-10T20:00:00'),
    crewMemberId: '123',
    role: 'Bridge Officer',
  },
  {
    id: '2',
    startTime: new Date('2024-03-10T20:00:00'),
    endTime: new Date('2024-03-11T08:00:00'),
    crewMemberId: '124',
    role: 'Engineer',
  },
];

// Routes
app.get('/health-data', (req, res) => {
  res.json(healthData);
});

app.get('/shifts', (req, res) => {
  res.json(shifts);
});

app.post('/feedback', (req, res) => {
  console.log('Feedback received:', req.body);
  res.status(201).send('Feedback submitted');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});