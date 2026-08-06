import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { tmdb, getImageUrl } from '../utils/tmdb';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const MediaRow = ({ title, fetchUrl, mediaType = 'movie' }) => {
  const [movies, setMovies] = useState([]);
  const rowRef = useRef(null);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!import.meta.env.VITE_TMDB_API_KEY) return;
      try {
        const { data } = await tmdb.get(fetchUrl);
        setMovies(data.results.filter(item => item.poster_path));
      } catch (error) {
        console.error(`Error fetching ${title}:`, error);
      }
    };
    fetchData();
  }, [fetchUrl, title]);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75;
      rowRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (movies.length === 0) return null;

  return (
    <div 
      style={{ padding: '1.5rem 0 0.5rem', position: 'relative' }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="container">
        <h2 className="h2">{title}</h2>
      </div>
      
      <div style={{ position: 'relative' }}>
        {/* Left scroll button */}
        <div style={{
          position: 'absolute',
          top: 0, bottom: 0, left: 0,
          width: '5%',
          background: 'linear-gradient(to right, rgba(0,0,0,0.9), transparent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10,
          opacity: showControls ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: showControls ? 'auto' : 'none'
        }}>
          <button 
            onClick={() => handleScroll('left')} 
            style={{ 
              color: 'white', 
              background: 'rgba(255,255,255,0.08)', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%', 
              padding: '10px',
              transition: 'all 0.25s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            <ChevronLeft size={22} />
          </button>
        </div>

        {/* Scroll Container */}
        <div 
          ref={rowRef}
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: '0.9rem',
            overflowX: 'auto',
            padding: '1rem 4% 1.5rem',
            scrollBehavior: 'smooth',
          }}
        >
          {movies.map(movie => {
            const itemMediaType = movie.media_type || mediaType;
            const rating = movie.vote_average?.toFixed(1);
            
            return (
              <Link 
                to={`/title/${itemMediaType}/${movie.id}`} 
                key={movie.id}
                style={{
                  flex: '0 0 auto',
                  width: '180px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  background: 'var(--bg-card)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.06) translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.7), 0 0 20px rgba(220,38,38,0.15)';
                  e.currentTarget.style.zIndex = '5';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.zIndex = '1';
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img 
                    src={getImageUrl(movie.poster_path, 'w500')} 
                    alt={movie.title || movie.name}
                    style={{
                      width: '100%',
                      height: '270px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    loading="lazy"
                  />
                  {/* Rating badge */}
                  {rating && rating > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      padding: '3px 7px',
                      borderRadius: '6px',
                      background: 'rgba(0,0,0,0.7)',
                      backdropFilter: 'blur(8px)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#fbbf24'
                    }}>
                      <Star size={10} fill="#fbbf24" color="#fbbf24" />
                      {rating}
                    </div>
                  )}
                  {/* Bottom gradient overlay on poster */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0, left: 0, width: '100%', height: '50%',
                    background: 'linear-gradient(to top, var(--bg-card) 0%, transparent 100%)',
                    pointerEvents: 'none'
                  }}></div>
                </div>
                {/* Title */}
                <div style={{ padding: '0.5rem 0.6rem 0.7rem' }}>
                  <p style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: 600, 
                    lineHeight: 1.3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: 'rgba(255,255,255,0.9)'
                  }}>
                    {movie.title || movie.name}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {movie.release_date?.substring(0,4) || movie.first_air_date?.substring(0,4) || ''}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Right scroll button */}
        <div style={{
          position: 'absolute',
          top: 0, bottom: 0, right: 0,
          width: '5%',
          background: 'linear-gradient(to left, rgba(0,0,0,0.9), transparent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10,
          opacity: showControls ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: showControls ? 'auto' : 'none'
        }}>
          <button 
            onClick={() => handleScroll('right')} 
            style={{ 
              color: 'white', 
              background: 'rgba(255,255,255,0.08)', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%', 
              padding: '10px',
              transition: 'all 0.25s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaRow;
