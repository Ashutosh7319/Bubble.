import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
// We will use the VITE_TMDB_API_KEY from the environment
// User must create a .env file with VITE_TMDB_API_KEY=their_key
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
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

export const getImageUrl = (path, size = 'original') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
