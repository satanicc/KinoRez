import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  AsyncStorage,
  useFocusEffect,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Favorite {
  id: string;
  title: string;
  poster: string;
  type: 'movie' | 'series';
}

interface FavoritesScreenProps {
  navigation: any;
}

export default function FavoritesScreen({ navigation }: FavoritesScreenProps) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      const data = await AsyncStorage.getItem('favorites');
      if (data) {
        setFavorites(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const removeFavorite = async (id: string) => {
    try {
      const updated = favorites.filter((f) => f.id !== id);
      setFavorites(updated);
      await AsyncStorage.setItem('favorites', JSON.stringify(updated));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const renderFavorite = ({ item }: { item: Favorite }) => (
    <TouchableOpacity
      style={styles.favoriteCard}
      onPress={() =>
        navigation.navigate('SearchTab', {
          screen: 'Details',
          params: {
            id: item.id,
            title: item.title,
            poster: item.poster,
            type: item.type,
          },
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
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {item.type === 'series' ? 'Сериал' : 'Фильм'}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => removeFavorite(item.id)}
      >
        <Ionicons name="close" size={24} color="#ef4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#6b7280" />
          <Text style={styles.emptyText}>Нет избранного</Text>
          <Text style={styles.emptyHint}>
            Добавляйте фильмы и сериалы в избранное
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavorite}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#d1d5db',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyHint: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  listContent: {
    padding: 12,
  },
  favoriteCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  poster: {
    width: 100,
    height: 140,
    backgroundColor: '#2a2a2a',
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#dc2626',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  removeBtn: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
