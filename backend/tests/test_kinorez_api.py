"""Backend tests for KinoRez TMDB proxy API."""
import os
import pytest
import requests

BASE_URL = os.environ.get("EXPO_PUBLIC_BACKEND_URL") or "https://cinema-catalog-21.preview.emergentagent.com"
BASE_URL = BASE_URL.rstrip("/")


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---- Root ----
class TestRoot:
    def test_root(self, api):
        r = api.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        assert "message" in r.json()


# ---- Home (filter kinds) ----
class TestHome:
    @pytest.mark.parametrize("kind", ["all", "tv", "movie", "anime", "cartoon"])
    def test_home_kinds(self, api, kind):
        r = api.get(f"{BASE_URL}/api/home", params={"kind": kind}, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "results" in data
        assert isinstance(data["results"], list)
        assert len(data["results"]) > 0, f"empty results for kind={kind}"
        first = data["results"][0]
        # required fields
        for f in ("id", "media_type", "title", "year", "poster", "rating", "kind"):
            assert f in first, f"missing {f} for {kind}"
        # posters should be real TMDB image URLs
        assert first["poster"] and first["poster"].startswith("https://image.tmdb.org/"), first["poster"]
        # media_type consistency
        if kind == "tv":
            assert first["media_type"] == "tv"
        elif kind == "movie":
            assert first["media_type"] == "movie"
        elif kind == "anime":
            assert first["media_type"] == "tv"
        elif kind == "cartoon":
            assert first["media_type"] == "movie"

    def test_home_invalid_kind(self, api):
        r = api.get(f"{BASE_URL}/api/home", params={"kind": "bogus"})
        assert r.status_code == 400


# ---- Search ----
class TestSearch:
    def test_search_valid(self, api):
        r = api.get(f"{BASE_URL}/api/search", params={"q": "Аватар"}, timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data["results"], list)
        assert len(data["results"]) > 0
        # image should be a TMDB URL if not None
        for item in data["results"][:3]:
            if item.get("poster"):
                assert item["poster"].startswith("https://image.tmdb.org/")

    def test_search_empty_query(self, api):
        r = api.get(f"{BASE_URL}/api/search", params={"q": "   "})
        assert r.status_code == 200
        assert r.json()["results"] == []

    def test_search_missing_q(self, api):
        r = api.get(f"{BASE_URL}/api/search")
        assert r.status_code == 422


# ---- Collections ----
class TestCollections:
    def test_collections_list(self, api):
        r = api.get(f"{BASE_URL}/api/collections", timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data["results"], list)
        assert len(data["results"]) == 10, "expected 10 curated collections"
        first = data["results"][0]
        assert "key" in first and "title" in first and "pg" in first
        assert isinstance(first["pg"], list) and len(first["pg"]) == 2

    @pytest.mark.parametrize("key", ["trending_tv", "action", "anime", "top_movies", "sci_fi"])
    def test_collection_detail(self, api, key):
        r = api.get(f"{BASE_URL}/api/collections/{key}", timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("title")
        assert isinstance(data["results"], list)
        assert len(data["results"]) > 0
        first = data["results"][0]
        assert first["poster"] and first["poster"].startswith("https://image.tmdb.org/")

    def test_collection_not_found(self, api):
        r = api.get(f"{BASE_URL}/api/collections/does_not_exist")
        assert r.status_code == 404


# ---- Detail ----
class TestDetail:
    def _get_first_of(self, api, kind):
        r = api.get(f"{BASE_URL}/api/home", params={"kind": kind}, timeout=30)
        assert r.status_code == 200
        return r.json()["results"][0]

    def test_detail_movie(self, api):
        item = self._get_first_of(api, "movie")
        r = api.get(f"{BASE_URL}/api/detail/movie/{item['id']}", timeout=30)
        assert r.status_code == 200, r.text
        d = r.json()
        for f in ("id", "media_type", "title", "year", "poster", "backdrop",
                  "rating", "vote_count", "overview", "genres", "country",
                  "runtime", "age", "trailer", "cast", "similar", "seasons", "episodes"):
            assert f in d, f"missing field {f}"
        assert d["media_type"] == "movie"
        # tv-only fields must be 0 for movie
        assert d["seasons"] == 0 and d["episodes"] == 0
        assert isinstance(d["cast"], list)
        assert isinstance(d["similar"], list)
        # genres/country should be Russian localized (non-empty string or —)
        assert isinstance(d["genres"], str) and d["genres"] != ""
        assert isinstance(d["country"], str) and d["country"] != ""

    def test_detail_tv(self, api):
        item = self._get_first_of(api, "tv")
        r = api.get(f"{BASE_URL}/api/detail/tv/{item['id']}", timeout=30)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["media_type"] == "tv"
        # tv should have seasons/episodes counts
        assert isinstance(d["seasons"], int) and isinstance(d["episodes"], int)
        # trailer key optional but if present must be string
        if d.get("trailer"):
            assert isinstance(d["trailer"], str) and len(d["trailer"]) >= 5

    def test_detail_bad_type(self, api):
        r = api.get(f"{BASE_URL}/api/detail/book/1")
        assert r.status_code == 400

    def test_detail_not_found(self, api):
        r = api.get(f"{BASE_URL}/api/detail/movie/999999999")
        # TMDB returns 404 -> we surface 502 (raise_for_status)
        assert r.status_code in (404, 502)
