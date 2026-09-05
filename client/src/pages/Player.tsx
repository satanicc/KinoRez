import { useEffect, useState } from 'react';
import axios from 'axios';

interface PlayerConfig {
  id: string;
  translationId?: string;
  season?: number;
  episode?: number;
  quality?: string;
}

interface PlayerProps {
  config: PlayerConfig;
  onBack: () => void;
}

export default function Player({ config, onBack }: PlayerProps) {
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStream = async () => {
      try {
        let url = `/api/hdrezka/stream/${config.id}/${config.translationId}`;

        if (config.season !== undefined && config.episode !== undefined) {
          url += `/${config.season}/${config.episode}`;
        } else {
          url += '/1/1';
        }

        const response = await axios.get(url, {
          params: { quality: config.quality || '720' }
        });

        if (response.data.url) {
          setStreamUrl(response.data.url);
        } else {
          setError('Не удалось получить ссылку на видео');
        }
      } catch (err) {
        console.error('Stream fetch error:', err);
        setError('Ошибка при загрузке видео');
      } finally {
        setLoading(false);
      }
    };

    fetchStream();
  }, [config]);

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        ← Назад
      </button>

      <div className="bg-black rounded-lg overflow-hidden">
        {loading && (
          <div className="aspect-video flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="inline-block animate-spin mb-4">
                <div className="w-12 h-12 border-4 border-gray-700 border-t-red-600 rounded-full"></div>
              </div>
              <p className="text-gray-400">Загружаю видео...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="aspect-video flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <p className="text-red-500 text-lg mb-4">⚠ {error}</p>
              <p className="text-gray-400 text-sm">Попробуйте другую озвучку или качество</p>
            </div>
          </div>
        )}

        {streamUrl && !loading && (
          <video
            key={streamUrl}
            className="w-full aspect-video"
            controls
            autoPlay
            controlsList="nodownload"
          >
            <source src={streamUrl} type="video/mp4" />
            Ваш браузер не поддерживает воспроизведение видео
          </video>
        )}
      </div>

      <div className="bg-gray-900 rounded-lg p-6 space-y-3">
        <h2 className="text-xl font-bold text-white">Информация о воспроизведении</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Качество</p>
            <p className="text-white font-semibold">{config.quality}p</p>
          </div>
          <div>
            <p className="text-gray-400">Озвучка ID</p>
            <p className="text-white font-semibold">{config.translationId}</p>
          </div>
          {config.season !== undefined && (
            <div>
              <p className="text-gray-400">Сезон</p>
              <p className="text-white font-semibold">{config.season}</p>
            </div>
          )}
          {config.episode !== undefined && (
            <div>
              <p className="text-gray-400">Серия</p>
              <p className="text-white font-semibold">{config.episode}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4">
        <p className="text-blue-300 text-sm">
          💡 <strong>Совет:</strong> Если видео не воспроизводится, попробуйте изменить озвучку или качество на странице описания.
        </p>
      </div>
    </div>
  );
}
