import { Router } from 'express';
import { hdrezkaService } from '../services/hdrezka.js';

export const searchRouter = Router();

searchRouter.get('/', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Query parameter required' });
    }

    const results = await hdrezkaService.searchMovies(q);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});
