import { useState, useEffect } from 'react';
import axios from 'axios';

interface Translation {
  id: string;
  name: string;
}

interface Episode {
  number: number;
  title: string;
}

interface Season {
  number: number;
  episodes: Episode[];
}

interface Content {
  id: string;
  title: string;
  type: 'movie' | 'series';
  poster: string;
}

interface DetailsProps {
  content: Content;
  onPlay: (config: {
    id: string;
    translationId?: string;
    season?: number;
    episode?: number;
    quality?: string;
  }) => void;
  onBack: () => void;
}

const QUALITIES = ['480', '720', '1080', '2k', '4k'];

export default function Details({ content, onPlay, onBack }: DetailsProps) {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [selectedTranslation, setSelectedTranslation] = useState<string>('');
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [selectedQuality, setSelectedQuality] = useState('720');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await axios.get(`/api/hdrezka/translations/${content.id}`);
        setTranslations(response.data);
        if (response.data.length > 0) {
          setSelectedTranslation(response.data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch translations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTranslations();
  }, [content.id]);

  useEffect(() => {
    if (!selectedTranslation) return;

    const fetchSeasons = async () => {
      try {
        const response = await axios.get(
          `/api/hdrezka/seasons/${content.id}/${selectedTranslation}`
        );
        setSeasons(response.data);
        if (response.data.length > 0) {
          setSelectedSeason(response.data[0].number);
          setSelectedEpisode(response.data[0].episodes[0]?.number || 1);
        }
      } catch (error) {
        console.error('Failed to fetch seasons:', error);
      }
    };

    if (content.type === 'series') {
      fetchSeasons();
    }
  }, [content.id, selectedTranslation, content.type]);

  const currentSeason = seasons.find((s) => s.number === selectedSeason);
  const episodes = currentSeason?.episodes || [];

  const handlePlay = () => {
    const config: any = {
      id: content.id,
      quality: selectedQuality,
      translationId: selectedTranslation
    };

    if (content.type === 'series') {
      config.season = selectedSeason;
      config.episode = selectedEpisode;
    }

    onPlay(config);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Загружаю контент...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
      >
        ← Назад к поиску
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <img
            src={content.poster}
            alt={content.title}
            className="poster-img w-full"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Image';
            }}
          />
        </div>

        <div className="md:w-2/3 space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{content.title}</h1>
            <span className="inline-block px-3 py-1 bg-red-600 text-white rounded">
              {content.type === 'series' ? 'Сериал' : 'Фильм'}
            </span>
          </div>

          {/* Translations */}
          <div className="space-y-2">
            <label className="block text-white font-semibold">Озвучка / Дубляж:</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {translations.map((translation) => (
                <button
                  key={translation.id}
                  onClick={() => setSelectedTranslation(translation.id)}
                  className={`p-3 rounded-lg font-semibold transition-all ${
                    selectedTranslation === translation.id
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {translation.name}
                </button>
              ))}
            </div>
          </div>

          {/* Seasons (for series only) */}
          {content.type === 'series' && seasons.length > 0 && (
            <div className="space-y-2">
              <label className="block text-white font-semibold">Сезон:</label>
              <div className="flex flex-wrap gap-2">
                {seasons.map((season) => (
                  <button
                    key={season.number}
                    onClick={() => {
                      setSelectedSeason(season.number);
                      setSelectedEpisode(season.episodes[0]?.number || 1);
                    }}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedSeason === season.number
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    S{season.number}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Episodes (for series only) */}
          {content.type === 'series' && episodes.length > 0 && (
            <div className="space-y-2">
              <label className="block text-white font-semibold">Серия:</label>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-40 overflow-y-auto bg-gray-900 p-3 rounded-lg">
                {episodes.map((episode) => (
                  <button
                    key={episode.number}
                    onClick={() => setSelectedEpisode(episode.number)}
                    className={`p-2 rounded font-semibold text-sm transition-all ${
                      selectedEpisode === episode.number
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                    title={episode.title}
                  >
                    {episode.number}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quality */}
          <div className="space-y-2">
            <label className="block text-white font-semibold">Качество:</label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {QUALITIES.map((quality) => (
                <button
                  key={quality}
                  onClick={() => setSelectedQuality(quality)}
                  className={`p-3 rounded-lg font-semibold transition-all ${
                    selectedQuality === quality
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {quality}p
                </button>
              ))}
            </div>
          </div>

          {/* Play Button */}
          <button
            onClick={handlePlay}
            className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
          >
            ▶ Смотреть
            <span className="text-sm">({selectedQuality}p)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
