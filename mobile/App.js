import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Linking,
  AsyncStorage,
  Alert,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2;

export default function App() {
  const [screen, setScreen] = useState('home');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await AsyncStorage.getItem('kinorez_favorites');
      if (data) setFavorites(JSON.parse(data));
    } catch (e) {
      console.error('Load error:', e);
    }
  };

  const toggleFavorite = async (movie) => {
    const isFav = favorites.some(f => f.id === movie.id);
    let updated;

    if (isFav) {
      updated = favorites.filter(f => f.id !== movie.id);
    } else {
      updated = [...favorites, movie];
    }

    await AsyncStorage.setItem('kinorez_favorites', JSON.stringify(updated));
    setFavorites(updated);
    Alert.alert('', isFav ? 'Удалено из избранного' : 'Добавлено в избранное');
  };

  const handleSearch = async () => {
    if (!search.trim()) return;

    setLoading(true);
    try {
      const mockResults = [
        { id: '1', title: `${search}`, type: 'Фильм', year: '2024', rating: '8.5' },
        { id: '2', title: `${search} 2`, type: 'Фильм', year: '2023', rating: '8.2' },
        { id: '3', title: `${search} Сериал`, type: 'Сериал', year: '2023', rating: '8.8' },
      ];
      setResults(mockResults);
      setScreen('search');
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось выполнить поиск');
    }
    setLoading(false);
  };

  const openInBrowser = (title) => {
    Linking.openURL(`https://rezka.ag/search/?s=${encodeURIComponent(title)}`);
  };

  const trending = [
    { id: '1', title: 'Интерстеллар', type: 'Фильм', year: '2014', rating: '8.6' },
    { id: '2', title: 'Темный рыцарь', type: 'Фильм', year: '2008', rating: '9.0' },
    { id: '3', title: 'Начало', type: 'Фильм', year: '2010', rating: '8.8' },
    { id: '4', title: 'Матрица', type: 'Фильм', year: '1999', rating: '8.7' },
    { id: '5', title: 'Черное зеркало', type: 'Сериал', year: '2011', rating: '8.5' },
    { id: '6', title: 'Сломанные', type: 'Сериал', year: '2019', rating: '8.3' },
  ];

  const MovieCard = ({ item, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardImg}>
        <Text style={styles.emoji}>🎬</Text>
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.year}>{item.year}</Text>
        <Text style={styles.rating}>⭐ {item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  // HOME SCREEN
  if (screen === 'home') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🎬 КиноРез</Text>
          <TouchableOpacity onPress={() => setScreen('fav')}>
            <Text style={styles.favCount}>❤️ {favorites.length}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.input}
            placeholder="Поиск фильмов..."
            placeholderTextColor="#666"
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Text style={styles.searchBtnText}>🔍</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.banner}>
            <Text style={styles.bannerEmoji}>🎭</Text>
            <Text style={styles.bannerText}>Тренды недели</Text>
            <TouchableOpacity style={styles.bannerBtn}>
              <Text style={styles.bannerBtnText}>▶️ Смотреть</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔥 Популярное</Text>
            <FlatList
              scrollEnabled={false}
              data={trending}
              numColumns={2}
              columnWrapperStyle={styles.row}
              keyExtractor={i => i.id}
              renderItem={({ item }) => (
                <MovieCard
                  item={item}
                  onPress={() => {
                    setSelected(item);
                    setScreen('details');
                  }}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📺 Сериалы</Text>
            <FlatList
              scrollEnabled={false}
              data={trending.filter(t => t.type === 'Сериал')}
              numColumns={2}
              columnWrapperStyle={styles.row}
              keyExtractor={i => i.id}
              renderItem={({ item }) => (
                <MovieCard
                  item={item}
                  onPress={() => {
                    setSelected(item);
                    setScreen('details');
                  }}
                />
              )}
            />
          </View>
        </ScrollView>

        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#e50914" />
          </View>
        )}
      </View>
    );
  }

  // SEARCH SCREEN
  if (screen === 'search') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setScreen('home')}>
            <Text style={styles.back}>← Назад</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Результаты</Text>
        </View>

        <ScrollView style={styles.content}>
          {results.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Ничего не найдено</Text>
            </View>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={results}
              numColumns={2}
              columnWrapperStyle={styles.row}
              keyExtractor={i => i.id}
              renderItem={({ item }) => (
                <MovieCard
                  item={item}
                  onPress={() => {
                    setSelected(item);
                    setScreen('details');
                  }}
                />
              )}
            />
          )}
        </ScrollView>
      </View>
    );
  }

  // DETAILS SCREEN
  if (screen === 'details' && selected) {
    const isFav = favorites.some(f => f.id === selected.id);

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setScreen('home')}>
            <Text style={styles.back}>← Назад</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Подробно</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.detailBanner}>
            <Text style={styles.detailEmoji}>🎬</Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>{selected.title}</Text>

            <View style={styles.metaRow}>
              <View style={styles.metaBox}>
                <Text style={styles.metaLabel}>Тип</Text>
                <Text style={styles.metaVal}>{selected.type}</Text>
              </View>
              <View style={styles.metaBox}>
                <Text style={styles.metaLabel}>Год</Text>
                <Text style={styles.metaVal}>{selected.year}</Text>
              </View>
              <View style={styles.metaBox}>
                <Text style={styles.metaLabel}>Рейтинг</Text>
                <Text style={styles.metaVal}>⭐ {selected.rating}</Text>
              </View>
            </View>

            <Text style={styles.descLabel}>О контенте</Text>
            <Text style={styles.desc}>
              Отличное кино! Нажми ниже, чтобы открыть в браузере и смотреть с разными озвучками и качеством.
            </Text>

            <TouchableOpacity
              style={styles.playBtn}
              onPress={() => openInBrowser(selected.title)}
            >
              <Text style={styles.playBtnText}>▶️ Открыть в браузере</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.favBtn, isFav && styles.favBtnActive]}
              onPress={() => toggleFavorite(selected)}
            >
              <Text style={styles.favBtnText}>{isFav ? '❤️ В избранном' : '🤍 Добавить'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // FAVORITES SCREEN
  if (screen === 'fav') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setScreen('home')}>
            <Text style={styles.back}>← Назад</Text>
          </TouchableOpacity>
          <Text style={styles.title}>❤️ Избранное</Text>
        </View>

        <ScrollView style={styles.content}>
          {favorites.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🤍</Text>
              <Text style={styles.emptyTitle}>Пусто</Text>
              <Text style={styles.emptyText}>Добавляй фильмы в избранное</Text>
            </View>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={favorites}
              numColumns={2}
              columnWrapperStyle={styles.row}
              keyExtractor={i => i.id}
              renderItem={({ item }) => (
                <MovieCard
                  item={item}
                  onPress={() => {
                    setSelected(item);
                    setScreen('details');
                  }}
                />
              )}
            />
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  header: {
    backgroundColor: '#0a0e27',
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f3a',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#e50914',
  },
  back: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  favCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e50914',
  },
  searchBox: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0a0e27',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f3a',
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1f3a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 14,
    marginRight: 8,
  },
  searchBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#e50914',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  banner: {
    height: 220,
    backgroundColor: '#1a1f3a',
    borderRadius: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerEmoji: {
    fontSize: 60,
    marginBottom: 12,
  },
  bannerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  bannerBtn: {
    backgroundColor: '#e50914',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bannerBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#1a1f3a',
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardImg: {
    width: '100%',
    height: CARD_WIDTH * 1.4,
    backgroundColor: '#0f1423',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    padding: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  year: {
    fontSize: 10,
    color: '#6b7280',
  },
  rating: {
    fontSize: 10,
    color: '#fbbf24',
    fontWeight: '600',
  },
  detailBanner: {
    height: 280,
    backgroundColor: '#1a1f3a',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  detailEmoji: {
    fontSize: 100,
  },
  detailCard: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metaBox: {
    flex: 1,
    backgroundColor: '#1a1f3a',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  metaLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 4,
  },
  metaVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  descLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  desc: {
    fontSize: 13,
    color: '#d1d5db',
    lineHeight: 18,
    marginBottom: 16,
  },
  playBtn: {
    backgroundColor: '#e50914',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  playBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  favBtn: {
    backgroundColor: '#1a1f3a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  favBtnActive: {
    backgroundColor: '#e50914',
  },
  favBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: '#6b7280',
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
