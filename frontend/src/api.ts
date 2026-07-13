const BASE = process.env.EXPO_PUBLIC_BACKEND_URL;

export type Poster = {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  year: string;
  poster: string | null;
  backdrop: string | null;
  rating: number;
  kind: string;
  unreleased?: boolean;
};

export type CastMember = {
  name: string;
  character: string;
  profile: string | null;
};

export type Detail = {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  original_title: string;
  year: string;
  poster: string | null;
  backdrop: string | null;
  rating: number;
  vote_count: number;
  overview: string;
  genres: string;
  country: string;
  runtime: string;
  age: string;
  seasons: number;
  episodes: number;
  unreleased: boolean;
  trailer: string | null;
  cast: CastMember[];
  similar: Poster[];
};

export type Collection = {
  key: string;
  title: string;
  pg: [string, string];
};

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export const api = {
  home: (kind: string, page = 1) =>
    getJSON<{ results: Poster[] }>(
      `/home?kind=${encodeURIComponent(kind)}&page=${page}`,
    ),
  search: (q: string, page = 1) =>
    getJSON<{ results: Poster[] }>(
      `/search?q=${encodeURIComponent(q)}&page=${page}`,
    ),
  collections: () => getJSON<{ results: Collection[] }>(`/collections`),
  collection: (key: string, page = 1) =>
    getJSON<{ title: string; pg: [string, string]; results: Poster[] }>(
      `/collections/${encodeURIComponent(key)}?page=${page}`,
    ),
  detail: (type: string, id: string | number) =>
    getJSON<Detail>(`/detail/${type}/${id}`),
};
