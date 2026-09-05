import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { hdrezkaRouter } from './routes/hdrezka.js';
import { searchRouter } from './routes/search.js';

const app = express();

app.use(cors(config.cors as any));
app.use(express.json());

app.use('/api/hdrezka', hdrezkaRouter);
app.use('/api/search', searchRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: config.nodeEnv });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
});
