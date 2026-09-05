import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Linking,
} from 'react-native';
import { Video } from 'expo-av';
import axios from 'axios';

// Используем публичный API
const HDREZKA_API = 'https://rezka.ag';

interface PlayerScreenProps {
  navigation: any;
  route: any;
}

export default function PlayerScreen({ navigation, route }: PlayerScreenProps) {
  const { id, translationId, season = 1, episode = 1, quality } = route.params;
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const videoRef = React.useRef(null);

  useEffect(() => {
    StatusBar.setHidden(true);
    fetchStream();

    return () => {
      StatusBar.setHidden(false);
    };
  }, []);

  const fetchStream = async () => {
    try {
      // Получаем видео напрямую с hdrezka
      const streamUrl = `${HDREZKA_API}/series/${id}-${translationId}-${season}-${episode}.html`;

      // Проверяем доступность
      const response = await axios.head(streamUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 11)',
        },
        timeout: 5000,
      });

      if (response.status === 200) {
        // Используем прямую ссылку
        setStreamUrl(`${HDREZKA_API}/series/${id}.html`);
      } else {
        // Если не работает, показываем ошибку
        setError('Видео недоступно');
      }
    } catch (err) {
      console.error('Stream fetch error:', err);
      // Показываем предложение открыть в браузере
      setError('Откройте в браузере');
      setStreamUrl(`${HDREZKA_API}/series/${id}.html`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#dc2626" />
          <Text style={styles.loadingText}>Загружаю видео...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠ {error}</Text>
          <Text style={styles.errorHint}>
            Попробуйте другую озвучку или качество
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <Text style={styles.backButtonText}>Назад</Text>
          </TouchableOpacity>
        </View>
      )}

      {streamUrl && !loading && (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.openBrowserButton}
            onPress={() => Linking.openURL(streamUrl)}
          >
            <Text style={styles.openBrowserButtonText}>
              Открыть в браузере 🌐
            </Text>
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Видео готово к просмотру!</Text>
            <Text style={styles.infoText}>
              Нажми кнопку выше чтобы открыть видео в браузере
            </Text>
            <Text style={styles.infoText}>
              Выбранное качество: {quality}p
            </Text>
            {season > 1 && (
              <Text style={styles.infoText}>
                Сезон {season}, Серия {episode}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <Text style={styles.backButtonText}>← Назад</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
  },
  loadingText: {
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorHint: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 20,
  },
  openBrowserButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 24,
    width: '100%',
    alignItems: 'center',
  },
  openBrowserButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  infoContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  infoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoText: {
    color: '#d1d5db',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: '#2a2a2a',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
