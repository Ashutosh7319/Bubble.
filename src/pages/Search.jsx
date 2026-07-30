import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { tmdb, searchMulti, getImageUrl } from '../utils/tmdb';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce the query to prevent too many API calls
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timerId);
  }, [query]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim() || !import.meta.env.VITE_TMDB_API_KEY) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const data = await searchMulti(debouncedQuery);
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
      }
      setLoading(false);
    };

    fetchResults();
  }, [debouncedQuery]);

  return (
    <div className="container fade-in" style={{ paddingTop: '8rem', paddingBottom: '4rem', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ 
          position: 'relative', 
          marginBottom: '3rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          <SearchIcon 
            size={24} 
            style={{ 
              position: 'absolute', 
              left: '1.5rem', 
              color: 'var(--text-secondary)' 
            }} 
          />
          <input 
            type="text" 
            placeholder="Search for movies or TV shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '1.5rem 1.5rem 1.5rem 4rem',
              fontSize: '1.25rem',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '24px',
              color: 'white',
              outline: 'none',
              backdropFilter: 'blur(20px)',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
            autoFocus
          />
        </div>

        {loading && <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Searching...</div>}

        {!loading && query && results.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            {!import.meta.env.VITE_TMDB_API_KEY ? "Please add your TMDB API key to .env file" : "No results found."}
          </div>
        )}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
          gap: '2rem' 
        }}>
          {results.map(item => (
            <Link 
              key={item.id} 
              to={`/title/${item.media_type}/${item.id}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
                transition: 'transform 0.3s ease',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ 
                width: '100%', 
                aspectRatio: '2/3', 
                borderRadius: '12px', 
                overflow: 'hidden',
                background: 'var(--glass-bg)'
              }}>
                {item.poster_path ? (
                  <img 
                    src={getImageUrl(item.poster_path, 'w300')} 
                    alt={item.title || item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                    No Poster
                  </div>
                )}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 500, lineHeight: 1.2 }}>
                {item.title || item.name}
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {item.media_type} • {item.release_date?.substring(0,4) || item.first_air_date?.substring(0,4) || 'N/A'}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
