import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.1.100:5000/api';
const QUALITIES = ['480', '720', '1080', '2k', '4k'];

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

interface DetailsScreenProps {
  navigation: any;
  route: any;
}

export default function DetailsScreen({ navigation, route }: DetailsScreenProps) {
  const { id, title, poster, type } = route.params;
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [selectedTranslation, setSelectedTranslation] = useState<string>('');
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [selectedQuality, setSelectedQuality] = useState('720');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTranslations();
  }, []);

  const fetchTranslations = async () => {
    try {
      const response = await axios.get(`${API_URL}/hdrezka/translations/${id}`);
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

  useEffect(() => {
    if (!selectedTranslation || type !== 'series') return;

    const fetchSeasons = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/hdrezka/seasons/${id}/${selectedTranslation}`
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

    fetchSeasons();
  }, [selectedTranslation, type, id]);

  const currentSeason = seasons.find((s) => s.number === selectedSeason);
  const episodes = currentSeason?.episodes || [];

  const handlePlay = () => {
    const config: any = {
      id,
      quality: selectedQuality,
      translationId: selectedTranslation,
    };

    if (type === 'series') {
      config.season = selectedSeason;
      config.episode = selectedEpisode;
    }

    navigation.navigate('Player', config);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#dc2626" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: poster }} style={styles.poster} />

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>
            {type === 'series' ? 'Сериал' : 'Фильм'}
          </Text>
        </View>

        {/* Translations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Озвучка / Дубляж:</Text>
          <View style={styles.optionsGrid}>
            {translations.map((translation) => (
              <TouchableOpacity
                key={translation.id}
                style={[
                  styles.option,
                  selectedTranslation === translation.id &&
                    styles.optionSelected,
                ]}
                onPress={() => setSelectedTranslation(translation.id)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedTranslation === translation.id &&
                      styles.optionTextSelected,
                  ]}
                >
                  {translation.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Seasons */}
        {type === 'series' && seasons.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Сезон:</Text>
            <View style={styles.optionsGrid}>
              {seasons.map((season) => (
                <TouchableOpacity
                  key={season.number}
                  style={[
                    styles.option,
                    selectedSeason === season.number &&
                      styles.optionSelected,
                  ]}
                  onPress={() => {
                    setSelectedSeason(season.number);
                    setSelectedEpisode(season.episodes[0]?.number || 1);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedSeason === season.number &&
                        styles.optionTextSelected,
                    ]}
                  >
                    S{season.number}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Episodes */}
        {type === 'series' && episodes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Серия:</Text>
            <View style={styles.episodesGrid}>
              {episodes.map((episode) => (
                <TouchableOpacity
                  key={episode.number}
                  style={[
                    styles.episodeOption,
                    selectedEpisode === episode.number &&
                      styles.episodeOptionSelected,
                  ]}
                  onPress={() => setSelectedEpisode(episode.number)}
                >
                  <Text
                    style={[
                      styles.episodeText,
                      selectedEpisode === episode.number &&
                        styles.episodeTextSelected,
                    ]}
                  >
                    {episode.number}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Quality */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Качество:</Text>
          <View style={styles.optionsGrid}>
            {QUALITIES.map((quality) => (
              <TouchableOpacity
                key={quality}
                style={[
                  styles.option,
                  selectedQuality === quality && styles.optionSelected,
                ]}
                onPress={() => setSelectedQuality(quality)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedQuality === quality && styles.optionTextSelected,
                  ]}
                >
                  {quality}p
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Play Button */}
        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePlay}
        >
          <Text style={styles.playButtonText}>▶ Смотреть ({selectedQuality}p)</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
  },
  poster: {
    width: '100%',
    height: 300,
    backgroundColor: '#2a2a2a',
  },
  content: {
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  typeBadge: {
    backgroundColor: '#dc2626',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  typeBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  optionSelected: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
  optionText: {
    color: '#d1d5db',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#fff',
  },
  episodesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  episodeOption: {
    width: '22%',
    backgroundColor: '#2a2a2a',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  episodeOptionSelected: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
  episodeText: {
    color: '#d1d5db',
    fontSize: 12,
    fontWeight: '500',
  },
  episodeTextSelected: {
    color: '#fff',
  },
  playButton: {
    backgroundColor: '#dc2626',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
