import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, Star } from 'lucide-react';
import { tmdb, searchMulti, getImageUrl } from '../utils/tmdb';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

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
    <div className="container fade-in" style={{ paddingTop: '7rem', paddingBottom: '4rem', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto 3rem' }}>
        <h1 className="h2" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Search</h1>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <SearchIcon 
            size={20} 
            style={{ position: 'absolute', left: '1.2rem', color: 'var(--text-muted)' }} 
          />
          <input 
            type="text" 
            placeholder="Search movies, TV shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '1.1rem 1.2rem 1.1rem 3.5rem',
              fontSize: '1.05rem',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 'var(--radius-xl)',
              color: 'white',
              outline: 'none',
              transition: 'border-color 0.3s ease, background 0.3s ease',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(220,38,38,0.4)'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.06)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
            autoFocus
          />
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
          <div style={{ width: '24px', height: '24px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 0' }}>
          {!import.meta.env.VITE_TMDB_API_KEY ? "Please add your TMDB API key to .env file" : "No results found."}
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
        gap: '1.2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {results.map(item => {
          const rating = item.vote_average?.toFixed(1);
          return (
            <Link 
              key={item.id} 
              to={`/title/${item.media_type}/${item.id}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                background: 'var(--bg-card)',
              }}
              onMouseOver={(e) => { 
                e.currentTarget.style.transform = 'scale(1.04) translateY(-4px)'; 
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.6), 0 0 15px rgba(220,38,38,0.12)';
              }}
              onMouseOut={(e) => { 
                e.currentTarget.style.transform = 'scale(1) translateY(0)'; 
                e.currentTarget.style.boxShadow = 'none'; 
              }}
            >
              <div style={{ width: '100%', aspectRatio: '2/3', position: 'relative', background: 'var(--bg-elevated)' }}>
                {item.poster_path ? (
                  <img 
                    src={getImageUrl(item.poster_path, 'w300')} 
                    alt={item.title || item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    No Poster
                  </div>
                )}
                {rating && rating > 0 && (
                  <div style={{
                    position: 'absolute', top: '8px', right: '8px',
                    display: 'flex', alignItems: 'center', gap: '3px',
                    padding: '3px 7px', borderRadius: '6px',
                    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                    fontSize: '0.7rem', fontWeight: 700, color: '#fbbf24'
                  }}>
                    <Star size={10} fill="#fbbf24" color="#fbbf24" />
                    {rating}
                  </div>
                )}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, width: '100%', height: '40%',
                  background: 'linear-gradient(to top, var(--bg-card) 0%, transparent 100%)',
                  pointerEvents: 'none'
                }}></div>
              </div>
              <div style={{ padding: '0.5rem 0.6rem 0.7rem' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.9)' }}>
                  {item.title || item.name}
                </h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {item.media_type} · {item.release_date?.substring(0,4) || item.first_air_date?.substring(0,4) || 'N/A'}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Search;
