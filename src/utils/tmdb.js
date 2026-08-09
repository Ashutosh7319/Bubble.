import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';

/**
 * TMDB API is blocked by many Indian ISPs at the DNS/IP level.
 * We route API requests through corsproxy.io which:
 * 1. Bypasses ISP blocks (request originates from their servers)
 * 2. Adds CORS headers (no browser restrictions)
 * 
 * For better reliability, deploy your own Cloudflare Worker proxy
 * and set VITE_TMDB_PROXY_URL in your .env file.
 * 
 * Custom proxy format: requests will be sent as
 *   GET {VITE_TMDB_PROXY_URL}/3/trending/movie/week?api_key=xxx
 * So your proxy should forward the path+query to api.themoviedb.org
 */
const CUSTOM_PROXY = import.meta.env.VITE_TMDB_PROXY_URL;

export const tmdb = axios.create({
  timeout: 15000, // 15s timeout to prevent hanging requests
});

// Intercept requests to route through the proxy
tmdb.interceptors.request.use((config) => {
  // Build the full TMDB URL with all params
  const params = new URLSearchParams({ api_key: API_KEY, ...config.params });
  const tmdbUrl = `${TMDB_BASE}${config.url}?${params.toString()}`;

  if (CUSTOM_PROXY) {
    // Custom proxy: send path+query directly to the proxy base
    config.baseURL = CUSTOM_PROXY;
    // Add /3 prefix to the URL if it's not already there
    config.url = config.url.startsWith('/3') ? config.url : `/3${config.url}`;
    config.params = { api_key: API_KEY, ...config.params };
  } else {
    // corsproxy.io: encode the full TMDB URL as the ?url= parameter
    config.baseURL = '';
    config.url = `https://corsproxy.io/?url=${encodeURIComponent(tmdbUrl)}`;
    config.params = {}; // params are already encoded in the URL
  }

  return config;
});

export const getTrending = async (type = 'all', timeWindow = 'day') => {
  const { data } = await tmdb.get(`/trending/${type}/${timeWindow}`);
  return data.results;
};

export const getTopRated = async (type = 'movie') => {
  const { data } = await tmdb.get(`/${type}/top_rated`);
  return data.results;
};

export const getDetails = async (type, id) => {
  const { data } = await tmdb.get(`/${type}/${id}`, {
    params: {
      append_to_response: 'credits,videos'
    }
  });
  return data;
};

export const searchMulti = async (query) => {
  const { data } = await tmdb.get(`/search/multi`, {
    params: { query, include_adult: false }
  });
  // Filter out people, only return movies and tv
  return data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
};

/**
 * Get proxied TMDB image URL via wsrv.nl to bypass ISP blocks on image.tmdb.org.
 * Also converts to WebP for faster loading.
 */
export const getImageUrl = (path, size = 'original') => {
  if (!path) return null;
  const tmdbUrl = `https://image.tmdb.org/t/p/${size}${path}`;
  // Route through wsrv.nl image proxy to bypass ISP DNS blocks
  return `https://wsrv.nl/?url=${encodeURIComponent(tmdbUrl)}&output=webp&q=85`;
};
