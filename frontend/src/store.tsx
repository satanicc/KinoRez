import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { storage } from "@/src/utils/storage";
import { Poster } from "@/src/api";

const BM_KEY = "kinorez.bookmarks";
const RECENT_KEY = "kinorez.recent";
const AUTH_KEY = "kinorez.auth";

export type AuthState = { authed: boolean; name: string; email: string };

type Ctx = {
  bookmarks: Poster[];
  recent: Poster[];
  auth: AuthState;
  isBookmarked: (id: number) => boolean;
  toggleBookmark: (item: Poster) => boolean;
  pushRecent: (item: Poster) => void;
  login: (email: string, name: string) => void;
  logout: () => void;
};

const StoreContext = createContext<Ctx | null>(null);

const uid = (i: Poster) => `${i.media_type}:${i.id}`;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Poster[]>([]);
  const [recent, setRecent] = useState<Poster[]>([]);
  const [auth, setAuth] = useState<AuthState>({
    authed: false,
    name: "",
    email: "",
  });

  useEffect(() => {
    (async () => {
      const bm = await storage.getItem<string>(BM_KEY, "[]");
      const rc = await storage.getItem<string>(RECENT_KEY, "[]");
      const au = await storage.getItem<string>(AUTH_KEY, "");
      try {
        if (bm) setBookmarks(JSON.parse(bm));
      } catch {}
      try {
        if (rc) setRecent(JSON.parse(rc));
      } catch {}
      try {
        if (au) setAuth(JSON.parse(au));
      } catch {}
    })();
  }, []);

  const persistBm = useCallback((list: Poster[]) => {
    setBookmarks(list);
    storage.setItem(BM_KEY, JSON.stringify(list));
  }, []);

  const persistRecent = useCallback((list: Poster[]) => {
    setRecent(list);
    storage.setItem(RECENT_KEY, JSON.stringify(list));
  }, []);

  const isBookmarked = useCallback(
    (id: number) => bookmarks.some((b) => b.id === id),
    [bookmarks],
  );

  const toggleBookmark = useCallback(
    (item: Poster) => {
      const exists = bookmarks.some((b) => uid(b) === uid(item));
      if (exists) {
        persistBm(bookmarks.filter((b) => uid(b) !== uid(item)));
        return false;
      }
      persistBm([item, ...bookmarks]);
      return true;
    },
    [bookmarks, persistBm],
  );

  const pushRecent = useCallback(
    (item: Poster) => {
      const filtered = recent.filter((r) => uid(r) !== uid(item));
      persistRecent([item, ...filtered].slice(0, 20));
    },
    [recent, persistRecent],
  );

  const login = useCallback((email: string, name: string) => {
    const next = { authed: true, email, name: name || email.split("@")[0] };
    setAuth(next);
    storage.setItem(AUTH_KEY, JSON.stringify(next));
  }, []);

  const logout = useCallback(() => {
    const next = { authed: false, name: "", email: "" };
    setAuth(next);
    storage.setItem(AUTH_KEY, JSON.stringify(next));
  }, []);

  return (
    <StoreContext.Provider
      value={{
        bookmarks,
        recent,
        auth,
        isBookmarked,
        toggleBookmark,
        pushRecent,
        login,
        logout,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
