import axios from 'axios';

const HDREZKA_BASE_URL = 'https://rezka.ag';

export interface Movie {
  id: string;
  title: string;
  poster: string;
  year: string;
  rating: string;
  type: 'movie' | 'series';
}

export interface Translation {
  id: string;
  name: string;
}

export interface Season {
  number: number;
  episodes: Episode[];
}

export interface Episode {
  number: number;
  title: string;
  translation: string;
}

export interface StreamData {
  quality: string;
  url: string;
  translation: string;
}

export class HdrezkaService {
  async searchMovies(query: string): Promise<Movie[]> {
    try {
      const response = await axios.get(`${HDREZKA_BASE_URL}/engine/ajax/search.php`, {
        params: {
          q: query,
          ajax: 1
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const results: Movie[] = [];
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.data, 'text/html');

      const items = doc.querySelectorAll('.search-item');
      items.forEach((item) => {
        const link = item.querySelector('a');
        const posterImg = item.querySelector('img');
        const info = item.querySelector('.info');

        if (link && posterImg) {
          results.push({
            id: this.extractIdFromUrl(link.getAttribute('href') || ''),
            title: link.textContent || '',
            poster: posterImg.getAttribute('src') || '',
            year: info?.textContent?.match(/\d{4}/)?.[0] || '',
            rating: info?.textContent?.match(/\d\.\d/)?.[0] || '',
            type: info?.textContent?.includes('сериал') ? 'series' : 'movie'
          });
        }
      });

      return results;
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  }

  async getMovieDetails(id: string) {
    try {
      const response = await axios.get(`${HDREZKA_BASE_URL}/series/${id}.html`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  }

  async getTranslations(id: string): Promise<Translation[]> {
    try {
      const response = await axios.post(
        `${HDREZKA_BASE_URL}/ajax/get_cdn_series/`,
        { id, action: 'get_episodes' },
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );

      const translations: Translation[] = [];
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.data, 'text/html');

      const translationElements = doc.querySelectorAll('[data-translation-id]');
      translationElements.forEach((el, index) => {
        translations.push({
          id: el.getAttribute('data-translation-id') || String(index),
          name: el.textContent || `Translation ${index + 1}`
        });
      });

      return translations;
    } catch (error) {
      console.error('Error fetching translations:', error);
      return [];
    }
  }

  async getSeasons(id: string, translationId: string): Promise<Season[]> {
    try {
      const response = await axios.post(
        `${HDREZKA_BASE_URL}/ajax/get_cdn_series/`,
        { id, translator_id: translationId, action: 'get_episodes' },
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );

      const seasons: Season[] = [];
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.data, 'text/html');

      const seasonElements = doc.querySelectorAll('.season');
      seasonElements.forEach((seasonEl) => {
        const seasonNum = parseInt(seasonEl.textContent || '0');
        const episodes: Episode[] = [];

        const episodeElements = seasonEl.parentElement?.querySelectorAll('[data-episode]') || [];
        episodeElements.forEach((episodeEl) => {
          episodes.push({
            number: parseInt(episodeEl.getAttribute('data-episode') || '0'),
            title: episodeEl.textContent || '',
            translation: translationId
          });
        });

        if (episodes.length > 0) {
          seasons.push({ number: seasonNum, episodes });
        }
      });

      return seasons;
    } catch (error) {
      console.error('Error fetching seasons:', error);
      return [];
    }
  }

  async getStreamUrl(
    id: string,
    season: number,
    episode: number,
    translationId: string,
    quality: string
  ): Promise<string> {
    try {
      const response = await axios.post(
        `${HDREZKA_BASE_URL}/ajax/get_cdn_series/`,
        {
          id,
          translator_id: translationId,
          season,
          episode,
          action: 'get_stream',
          quality
        },
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );

      return response.data.url || '';
    } catch (error) {
      console.error('Error fetching stream URL:', error);
      return '';
    }
  }

  private extractIdFromUrl(url: string): string {
    const match = url.match(/\/(\d+)-/);
    return match ? match[1] : '';
  }
}

export const hdrezkaService = new HdrezkaService();
