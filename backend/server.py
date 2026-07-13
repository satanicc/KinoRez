from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from typing import Optional
import requests
from datetime import date

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

TMDB_API_KEY = os.environ['TMDB_API_KEY']
TMDB_BASE = "https://api.themoviedb.org/3"
IMG_POSTER = "https://image.tmdb.org/t/p/w500"
IMG_BACKDROP = "https://image.tmdb.org/t/p/w1280"
IMG_PROFILE = "https://image.tmdb.org/t/p/w185"

COUNTRY_RU = {
    "US": "США", "GB": "Великобритания", "RU": "Россия", "JP": "Япония",
    "KR": "Южная Корея", "FR": "Франция", "DE": "Германия", "IT": "Италия",
    "ES": "Испания", "CN": "Китай", "HK": "Гонконг", "CA": "Канада",
    "IN": "Индия", "BR": "Бразилия", "MX": "Мексика", "AU": "Австралия",
    "SE": "Швеция", "NO": "Норвегия", "DK": "Дания", "FI": "Финляндия",
    "PL": "Польша", "TR": "Турция", "UA": "Украина", "NL": "Нидерланды",
    "BE": "Бельгия", "AR": "Аргентина", "IE": "Ирландия", "NZ": "Новая Зеландия",
    "TH": "Таиланд", "CZ": "Чехия", "AT": "Австрия", "CH": "Швейцария",
}


def country_names(d: dict) -> str:
    codes = []
    for c in d.get("production_countries", []) or []:
        code = c.get("iso_3166_1")
        if code:
            codes.append(code)
    if not codes:
        codes = d.get("origin_country", []) or []
    names = [COUNTRY_RU.get(c, c) for c in codes]
    # dedupe preserving order
    seen = []
    for n in names:
        if n not in seen:
            seen.append(n)
    return ", ".join(seen) if seen else "—"

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def tmdb_get(path: str, params: Optional[dict] = None) -> dict:
    """Call TMDB with the v3 api key. Raises HTTPException on failure."""
    p = {"api_key": TMDB_API_KEY, "language": "ru-RU"}
    if params:
        p.update(params)
    try:
        r = requests.get(f"{TMDB_BASE}{path}", params=p, timeout=15)
        r.raise_for_status()
        return r.json()
    except requests.HTTPError as e:
        status = e.response.status_code if e.response is not None else 502
        if status == 404:
            raise HTTPException(status_code=404, detail="Тайтл не найден")
        logger.error(f"TMDB HTTP error {path}: {e}")
        raise HTTPException(status_code=502, detail="Ошибка источника данных TMDB")
    except requests.RequestException as e:
        logger.error(f"TMDB request error {path}: {e}")
        raise HTTPException(status_code=502, detail="Не удалось связаться с TMDB")


def img(base: str, path: Optional[str]) -> Optional[str]:
    return f"{base}{path}" if path else None


def year_of(item: dict) -> str:
    d = item.get("release_date") or item.get("first_air_date") or ""
    return d.split("-")[0] if d else ""


def normalize_item(item: dict, forced_media: Optional[str] = None) -> Optional[dict]:
    media = forced_media or item.get("media_type")
    if media not in ("movie", "tv"):
        return None
    title = item.get("title") or item.get("name") or ""
    kind = "Фильм" if media == "movie" else "Сериал"
    vote = item.get("vote_average") or 0
    rel = item.get("release_date") or item.get("first_air_date") or ""
    unreleased = bool(rel) and rel > date.today().isoformat()
    return {
        "id": item.get("id"),
        "media_type": media,
        "title": title,
        "year": year_of(item),
        "poster": img(IMG_POSTER, item.get("poster_path")),
        "backdrop": img(IMG_BACKDROP, item.get("backdrop_path")),
        "rating": round(float(vote), 1) if vote else 0,
        "kind": kind,
        "unreleased": unreleased,
    }


def normalize_list(results: list, forced_media: Optional[str] = None) -> list:
    out = []
    for it in results:
        n = normalize_item(it, forced_media)
        if n and n["title"]:
            out.append(n)
    return out


# ---- curated collections (real TMDB queries) ----
COLLECTIONS = [
    {"key": "trending_tv", "title": "Популярные сериалы", "pg": ["#d97a2a", "#5a2a0a"],
     "path": "/tv/popular", "media": "tv", "params": {}},
    {"key": "top_movies", "title": "Топ фильмов всех времён", "pg": ["#3a2a1a", "#0a0a0a"],
     "path": "/movie/top_rated", "media": "movie", "params": {}},
    {"key": "action", "title": "Боевики", "pg": ["#3a0a0a", "#0a0a0a"],
     "path": "/discover/movie", "media": "movie", "params": {"with_genres": "28", "sort_by": "popularity.desc"}},
    {"key": "anime", "title": "Аниме", "pg": ["#5a1a4a", "#1a0a2a"],
     "path": "/discover/tv", "media": "tv", "params": {"with_genres": "16", "with_origin_country": "JP", "sort_by": "popularity.desc"}},
    {"key": "fantasy", "title": "Фэнтези", "pg": ["#26364a", "#0a0a0a"],
     "path": "/discover/movie", "media": "movie", "params": {"with_genres": "14", "sort_by": "popularity.desc"}},
    {"key": "comedy", "title": "Комедии", "pg": ["#0e3d2e", "#071a14"],
     "path": "/discover/movie", "media": "movie", "params": {"with_genres": "35", "sort_by": "popularity.desc"}},
    {"key": "horror", "title": "Ужасы", "pg": ["#1a1a1a", "#3a0a0a"],
     "path": "/discover/movie", "media": "movie", "params": {"with_genres": "27", "sort_by": "popularity.desc"}},
    {"key": "crime", "title": "Криминальные драмы", "pg": ["#3a1414", "#0a0a0a"],
     "path": "/discover/movie", "media": "movie", "params": {"with_genres": "80", "sort_by": "popularity.desc"}},
    {"key": "cartoons", "title": "Мультфильмы", "pg": ["#4a90d9", "#1a3a6a"],
     "path": "/discover/movie", "media": "movie", "params": {"with_genres": "16", "sort_by": "popularity.desc"}},
    {"key": "sci_fi", "title": "Фантастика", "pg": ["#101430", "#0a0a0a"],
     "path": "/discover/movie", "media": "movie", "params": {"with_genres": "878", "sort_by": "popularity.desc"}},
    {"key": "upcoming", "title": "Скоро в кино", "pg": ["#e8b64c", "#7a5c00"],
     "path": "/movie/upcoming", "media": "movie", "params": {}},
]
COLLECTION_MAP = {c["key"]: c for c in COLLECTIONS}


@api_router.get("/")
async def root():
    return {"message": "KinoRez API"}


@api_router.get("/home")
def home(kind: str = Query("all"), page: int = 1):
    if kind == "all":
        data = tmdb_get("/trending/all/week", {"page": page})
        return {"results": normalize_list(data.get("results", []))}
    if kind == "tv":
        data = tmdb_get("/tv/popular", {"page": page})
        return {"results": normalize_list(data.get("results", []), "tv")}
    if kind == "movie":
        data = tmdb_get("/movie/popular", {"page": page})
        return {"results": normalize_list(data.get("results", []), "movie")}
    if kind == "anime":
        data = tmdb_get("/discover/tv", {"page": page, "with_genres": "16",
                                         "with_origin_country": "JP", "sort_by": "popularity.desc"})
        return {"results": normalize_list(data.get("results", []), "tv")}
    if kind == "cartoon":
        data = tmdb_get("/discover/movie", {"page": page, "with_genres": "16", "sort_by": "popularity.desc"})
        return {"results": normalize_list(data.get("results", []), "movie")}
    raise HTTPException(status_code=400, detail="Неизвестный фильтр")


@api_router.get("/search")
def search(q: str = Query(...), page: int = 1):
    if not q.strip():
        return {"results": []}
    data = tmdb_get("/search/multi", {"query": q, "page": page, "include_adult": "false"})
    return {"results": normalize_list(data.get("results", []))}


@api_router.get("/collections")
def collections():
    return {"results": [{"key": c["key"], "title": c["title"], "pg": c["pg"]} for c in COLLECTIONS]}


@api_router.get("/collections/{key}")
def collection_detail(key: str, page: int = 1):
    c = COLLECTION_MAP.get(key)
    if not c:
        raise HTTPException(status_code=404, detail="Подборка не найдена")
    params = dict(c["params"])
    params["page"] = page
    data = tmdb_get(c["path"], params)
    return {
        "title": c["title"],
        "pg": c["pg"],
        "results": normalize_list(data.get("results", []), c["media"]),
    }


def format_runtime(detail: dict, media_type: str) -> str:
    if media_type == "movie":
        rt = detail.get("runtime")
        return f"{rt} мин" if rt else "—"
    ert = detail.get("episode_run_time") or []
    if ert:
        return f"~{ert[0]} мин / серия"
    return "—"


def get_age(detail: dict, media_type: str) -> str:
    try:
        if media_type == "movie":
            for r in detail.get("release_dates", {}).get("results", []):
                if r.get("iso_3166_1") in ("RU", "US"):
                    for d in r.get("release_dates", []):
                        cert = (d.get("certification") or "").strip()
                        if cert:
                            return cert
        else:
            for r in detail.get("content_ratings", {}).get("results", []):
                if r.get("iso_3166_1") in ("RU", "US"):
                    rating = (r.get("rating") or "").strip()
                    if rating:
                        return rating
    except Exception:
        pass
    return "18+" if detail.get("adult") else "16+"


def is_unreleased(d: dict, media_type: str) -> bool:
    today = date.today().isoformat()
    status = d.get("status", "") or ""
    if media_type == "movie":
        if status in ("Planned", "In Production", "Post Production", "Rumored"):
            return True
        rd = d.get("release_date")
        if not rd:
            return True
        return rd > today
    else:
        if status in ("Planned", "In Production", "Pilot"):
            return True
        fad = d.get("first_air_date")
        if not fad:
            return True
        return fad > today


@api_router.get("/detail/{media_type}/{tmdb_id}")
def detail(media_type: str, tmdb_id: int):
    if media_type not in ("movie", "tv"):
        raise HTTPException(status_code=400, detail="Неверный тип")
    appends = "credits,recommendations,videos"
    appends += ",release_dates" if media_type == "movie" else ",content_ratings"
    d = tmdb_get(f"/{media_type}/{tmdb_id}", {"append_to_response": appends})

    # trailer: prefer ru videos, else fetch en
    def pick_trailer(videos):
        vids = videos.get("results", []) if videos else []
        for v in vids:
            if v.get("site") == "YouTube" and v.get("type") == "Trailer":
                return v.get("key")
        for v in vids:
            if v.get("site") == "YouTube":
                return v.get("key")
        return None

    trailer = pick_trailer(d.get("videos"))
    if not trailer:
        en_vids = tmdb_get(f"/{media_type}/{tmdb_id}/videos", {"language": "en-US"})
        trailer = pick_trailer(en_vids)

    title = d.get("title") or d.get("name") or ""
    genres = ", ".join([g["name"] for g in d.get("genres", [])]) or "—"
    country = country_names(d)

    cast = []
    for c in (d.get("credits", {}).get("cast", []) or [])[:12]:
        cast.append({
            "name": c.get("name"),
            "character": c.get("character") or "",
            "profile": img(IMG_PROFILE, c.get("profile_path")),
        })

    similar = normalize_list(d.get("recommendations", {}).get("results", []))[:12]

    vote = d.get("vote_average") or 0
    return {
        "id": d.get("id"),
        "media_type": media_type,
        "title": title,
        "original_title": d.get("original_title") or d.get("original_name") or "",
        "year": year_of(d),
        "poster": img(IMG_POSTER, d.get("poster_path")),
        "backdrop": img(IMG_BACKDROP, d.get("backdrop_path")),
        "rating": round(float(vote), 1) if vote else 0,
        "vote_count": d.get("vote_count") or 0,
        "overview": d.get("overview") or "Описание пока недоступно.",
        "genres": genres,
        "country": country,
        "runtime": format_runtime(d, media_type),
        "age": get_age(d, media_type),
        "seasons": d.get("number_of_seasons", 0) if media_type == "tv" else 0,
        "episodes": d.get("number_of_episodes", 0) if media_type == "tv" else 0,
        "unreleased": is_unreleased(d, media_type),
        "trailer": trailer,
        "cast": cast,
        "similar": similar,
    }


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
