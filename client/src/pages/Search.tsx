import { useState, useCallback } from 'react';
import axios from 'axios';

interface Movie {
  id: string;
  title: string;
  poster: string;
  year: string;
  rating: string;
  type: 'movie' | 'series';
}

interface SearchProps {
  onSelectContent: (content: { id: string; title: string; type: 'movie' | 'series'; poster: string }) => void;
}

export default function Search({ onSelectContent }: SearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const response = await axios.get('/api/search', {
        params: { q: query }
      });
      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="space-y-8">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск фильмов и сериалов..."
            className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-red-600 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Поиск...' : 'Найти'}
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin">
            <div className="w-8 h-8 border-4 border-gray-700 border-t-red-600 rounded-full"></div>
          </div>
          <p className="mt-4 text-gray-400">Загружаю результаты...</p>
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Ничего не найдено</p>
          <p className="text-gray-500 text-sm mt-2">Попробуйте другой поисковый запрос</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((movie) => (
            <div
              key={movie.id}
              onClick={() => onSelectContent({
                id: movie.id,
                title: movie.title,
                type: movie.type,
                poster: movie.poster
              })}
              className="cursor-pointer group"
            >
              <div className="relative overflow-hidden rounded-lg mb-3 bg-gray-800">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="poster-img group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Image';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                  <button className="btn-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    ▶ {movie.type === 'series' ? 'Смотреть сериал' : 'Смотреть фильм'}
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-white group-hover:text-red-500 transition-colors line-clamp-2">
                {movie.title}
              </h3>
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-gray-400">{movie.year}</span>
                {movie.rating && (
                  <span className="text-yellow-500">★ {movie.rating}</span>
                )}
              </div>
              <span className="inline-block mt-2 px-2 py-1 bg-red-600 text-white text-xs rounded">
                {movie.type === 'series' ? 'Сериал' : 'Фильм'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
