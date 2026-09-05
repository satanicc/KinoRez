import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.1.100:5000/api';

interface Movie {
  id: string;
  title: string;
  poster: string;
  year: string;
  rating: string;
  type: 'movie' | 'series';
}

interface SearchScreenProps {
  navigation: any;
}

export default function SearchScreen({ navigation }: SearchScreenProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const response = await axios.get(`${API_URL}/search`, {
        params: { q: query },
      });
      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const renderMovie = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() =>
        navigation.navigate('Details', {
          id: item.id,
          title: item.title,
          poster: item.poster,
          type: item.type,
        })
      }
    >
      <Image
        source={{ uri: item.poster }}
        style={styles.poster}
        defaultSource={require('../assets/placeholder.png')}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.year}>{item.year}</Text>
          {item.rating && <Text style={styles.rating}>★ {item.rating}</Text>}
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {item.type === 'series' ? 'Сериал' : 'Фильм'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск фильмов и сериалов..."
          placeholderTextColor="#6b7280"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={handleSearch}
          disabled={loading}
        >
          <Text style={styles.searchBtnText}>
            {loading ? '...' : '🔍'}
          </Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#dc2626" />
          <Text style={styles.loadingText}>Загружаю...</Text>
        </View>
      )}

      {searched && !loading && results.length === 0 && (
        <View style={styles.centerContainer}>
          <Text style={styles.noResults}>Ничего не найдено</Text>
          <Text style={styles.noResultsHint}>
            Попробуйте другой поисковый запрос
          </Text>
        </View>
      )}

      {results.length > 0 && (
        <FlatList
          data={results}
          renderItem={renderMovie}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
        />
      )}

      {!searched && (
        <View style={styles.centerContainer}>
          <Text style={styles.placeholder}>🎬</Text>
          <Text style={styles.placeholderText}>Начните поиск</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  searchSection: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    padding: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  searchBtn: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  searchBtnText: {
    color: '#fff',
    fontSize: 18,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderText: {
    color: '#6b7280',
    fontSize: 16,
  },
  loadingText: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 12,
  },
  noResults: {
    color: '#6b7280',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  noResultsHint: {
    color: '#6b7280',
    fontSize: 14,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  listContent: {
    paddingVertical: 12,
  },
  movieCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: 200,
    backgroundColor: '#2a2a2a',
  },
  info: {
    padding: 12,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  year: {
    color: '#9ca3af',
    fontSize: 12,
  },
  rating: {
    color: '#eab308',
    fontSize: 12,
  },
  badge: {
    backgroundColor: '#dc2626',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});
