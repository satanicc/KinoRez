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
      const stored = await AsyncStorage.getItem('kinorez_fav');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.log('Error loading favorites');
    }
  };

  const toggleFav = async (movie) => {
    const isFav = favorites.some(f => f.id === movie.id);
    let updated = isFav
      ? favorites.filter(f => f.id !== movie.id)
      : [...favorites, movie];

    await AsyncStorage.setItem('kinorez_fav', JSON.stringify(updated));
    setFavorites(updated);
  };

  const handleSearch = () => {
    if (!search.trim()) {
      Alert.alert('Ошибка', 'Введи название');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setResults([
        { id: '1', title: search, type: 'Фильм', year: '2024', rating: '8.5' },
        { id: '2', title: search + ' 2', type: 'Фильм', year: '2023', rating: '8.2' },
        { id: '3', title: search + ' Сериал', type: 'Сериал', year: '2023', rating: '8.8' },
      ]);
      setScreen('search');
      setLoading(false);
    }, 500);
  };

  const openHdrezka = (title) => {
    const url = `https://rezka.ag/search/?s=${encodeURIComponent(title)}`;
    Linking.openURL(url).catch(err => Alert.alert('Ошибка', 'Не удалось открыть'));
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
    <TouchableOpacity style={s.card} onPress={onPress}>
      <View style={s.cardImg}>
        <Text style={s.emoji}>🎬</Text>
      </View>
      <Text style={s.title} numberOfLines={2}>{item.title}</Text>
      <View style={s.footer}>
        <Text style={s.year}>{item.year}</Text>
        <Text style={s.rating}>⭐{item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  if (screen === 'home') {
    return (
      <View style={s.bg}>
        <View style={s.header}>
          <Text style={s.logo}>🎬 КиноРез</Text>
          <TouchableOpacity onPress={() => setScreen('fav')}>
            <Text style={s.favBtn}>❤️{favorites.length}</Text>
          </TouchableOpacity>
        </View>

        <View style={s.search}>
          <TextInput
            style={s.input}
            placeholder="Поиск..."
            placeholderTextColor="#666"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={s.btn} onPress={handleSearch}>
            <Text>🔍</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={s.banner}>
            <Text style={s.bannerEmoji}>🎭</Text>
            <Text style={s.bannerTitle}>Тренды</Text>
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>🔥 Популярное</Text>
            <FlatList
              scrollEnabled={false}
              data={trending}
              numColumns={2}
              columnWrapperStyle={s.row}
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

          <View style={s.section}>
            <Text style={s.sectionTitle}>📺 Сериалы</Text>
            <FlatList
              scrollEnabled={false}
              data={trending.filter(t => t.type === 'Сериал')}
              numColumns={2}
              columnWrapperStyle={s.row}
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
      </View>
    );
  }

  if (screen === 'search') {
    return (
      <View style={s.bg}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => setScreen('home')}>
            <Text style={s.back}>← Назад</Text>
          </TouchableOpacity>
          <Text style={s.logo}>Поиск</Text>
        </View>

        <ScrollView>
          <FlatList
            scrollEnabled={false}
            data={results}
            numColumns={2}
            columnWrapperStyle={s.row}
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
        </ScrollView>
      </View>
    );
  }

  if (screen === 'details' && selected) {
    const isFav = favorites.some(f => f.id === selected.id);

    return (
      <View style={s.bg}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => setScreen('home')}>
            <Text style={s.back}>← Назад</Text>
          </TouchableOpacity>
          <Text style={s.logo}>Подробно</Text>
        </View>

        <ScrollView>
          <View style={s.detailBanner}>
            <Text style={{ fontSize: 100 }}>🎬</Text>
          </View>

          <View style={s.detailContent}>
            <Text style={s.detailTitle}>{selected.title}</Text>

            <View style={s.metaRow}>
              <View style={s.meta}>
                <Text style={s.metaLabel}>Тип</Text>
                <Text style={s.metaVal}>{selected.type}</Text>
              </View>
              <View style={s.meta}>
                <Text style={s.metaLabel}>Год</Text>
                <Text style={s.metaVal}>{selected.year}</Text>
              </View>
              <View style={s.meta}>
                <Text style={s.metaLabel}>Рейтинг</Text>
                <Text style={s.metaVal}>⭐{selected.rating}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={s.playBtn}
              onPress={() => openHdrezka(selected.title)}
            >
              <Text style={s.playBtnText}>▶️ Открыть в браузере</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.favBtnDetail, isFav && s.favBtnActive]}
              onPress={() => toggleFav(selected)}
            >
              <Text style={s.favBtnTextDetail}>
                {isFav ? '❤️ В избранном' : '🤍 Добавить'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (screen === 'fav') {
    return (
      <View style={s.bg}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => setScreen('home')}>
            <Text style={s.back}>← Назад</Text>
          </TouchableOpacity>
          <Text style={s.logo}>❤️ Избранное</Text>
        </View>

        <ScrollView>
          {favorites.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyText}>Пусто</Text>
            </View>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={favorites}
              numColumns={2}
              columnWrapperStyle={s.row}
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

const s = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  header: {
    backgroundColor: '#0a0e27',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f3a',
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e50914',
  },
  back: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  favBtn: {
    color: '#e50914',
    fontSize: 12,
    fontWeight: '600',
  },
  search: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#0a0e27',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f3a',
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1f3a',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 13,
    marginRight: 8,
  },
  btn: {
    width: 38,
    height: 38,
    backgroundColor: '#e50914',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    height: 180,
    backgroundColor: '#1a1f3a',
    borderRadius: 8,
    margin: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerEmoji: {
    fontSize: 50,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#1a1f3a',
    borderRadius: 6,
    overflow: 'hidden',
  },
  cardImg: {
    width: '100%',
    height: CARD_WIDTH * 1.3,
    backgroundColor: '#0f1423',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
    padding: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  year: {
    fontSize: 9,
    color: '#6b7280',
  },
  rating: {
    fontSize: 9,
    color: '#fbbf24',
    fontWeight: '600',
  },
  detailBanner: {
    height: 240,
    backgroundColor: '#1a1f3a',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 6,
  },
  detailContent: {
    padding: 16,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  meta: {
    flex: 1,
    backgroundColor: '#1a1f3a',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  metaLabel: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 3,
  },
  metaVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  playBtn: {
    backgroundColor: '#e50914',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  playBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  favBtnDetail: {
    backgroundColor: '#1a1f3a',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  favBtnActive: {
    backgroundColor: '#e50914',
  },
  favBtnTextDetail: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  empty: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
  },
});
