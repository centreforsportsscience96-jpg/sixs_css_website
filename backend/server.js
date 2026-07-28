import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import enquiriesRouter from './routes/enquiries.js';
import infoRouter from './routes/info.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ success: true, message: 'CSS backend API. See /api/info' });
});

app.use('/api/enquiries', enquiriesRouter);
app.use('/api/info', infoRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
