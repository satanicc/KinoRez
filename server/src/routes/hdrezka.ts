import { Router } from 'express';
import { hdrezkaService } from '../services/hdrezka.js';

export const hdrezkaRouter = Router();

hdrezkaRouter.get('/movie/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const details = await hdrezkaService.getMovieDetails(id);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

hdrezkaRouter.get('/translations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const translations = await hdrezkaService.getTranslations(id);
    res.json(translations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch translations' });
  }
});

hdrezkaRouter.get('/seasons/:id/:translationId', async (req, res) => {
  try {
    const { id, translationId } = req.params;
    const seasons = await hdrezkaService.getSeasons(id, translationId);
    res.json(seasons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch seasons' });
  }
});

hdrezkaRouter.get('/stream/:id/:translationId/:season/:episode', async (req, res) => {
  try {
    const { id, translationId, season, episode } = req.params;
    const { quality = '720' } = req.query;

    const url = await hdrezkaService.getStreamUrl(
      id,
      parseInt(season),
      parseInt(episode),
      translationId,
      quality as string
    );

    res.json({ url, quality });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stream URL' });
  }
});
