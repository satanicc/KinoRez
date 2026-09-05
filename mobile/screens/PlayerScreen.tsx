import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Video } from 'expo-av';
import axios from 'axios';

const API_URL = 'http://192.168.1.100:5000/api';

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
      const response = await axios.get(
        `${API_URL}/hdrezka/stream/${id}/${translationId}/${season}/${episode}`,
        {
          params: { quality },
        }
      );

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
        <>
          <Video
            ref={videoRef}
            source={{ uri: streamUrl }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="contain"
            useNativeControls
            style={styles.video}
            onError={(error) => {
              console.error('Video error:', error);
              setError('Ошибка воспроизведения видео');
            }}
          />

          <TouchableOpacity
            style={styles.backButtonOverlay}
            onPress={handleGoBack}
          >
            <Text style={styles.backButtonOverlayText}>← Назад</Text>
          </TouchableOpacity>

          <View style={styles.infoOverlay}>
            <Text style={styles.infoText}>
              Качество: {quality}p | Озвучка ID: {translationId}
            </Text>
            {season > 1 && (
              <Text style={styles.infoText}>
                Сезон {season}, Серия {episode}
              </Text>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
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
    backgroundColor: '#000',
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
  backButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButtonOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  backButtonOverlayText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 12,
    borderRadius: 6,
  },
  infoText: {
    color: '#d1d5db',
    fontSize: 12,
    marginBottom: 4,
  },
});
