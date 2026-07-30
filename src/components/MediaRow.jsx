import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { tmdb, getImageUrl } from '../utils/tmdb';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MediaRow = ({ title, fetchUrl, mediaType = 'movie' }) => {
  const [movies, setMovies] = useState([]);
  const rowRef = useRef(null);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!import.meta.env.VITE_TMDB_API_KEY) return;
      try {
        const { data } = await tmdb.get(fetchUrl);
        // Filter items that have posters
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
      
      rowRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (movies.length === 0) return null;

  return (
    <div 
      style={{ padding: '2rem 0 1rem', position: 'relative' }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="container">
        <h2 className="h2">{title}</h2>
      </div>
      
      <div style={{ position: 'relative' }}>
        {/* Scroll Controls */}
        <div style={{
          position: 'absolute',
          top: 0, bottom: 0, left: 0,
          width: '4%',
          background: 'linear-gradient(to right, rgba(0,0,0,0.8), transparent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10,
          opacity: showControls ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: showControls ? 'auto' : 'none'
        }}>
          <button onClick={() => handleScroll('left')} style={{ color: 'white', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '8px' }}>
            <ChevronLeft size={32} />
          </button>
        </div>

        {/* Scroll Container */}
        <div 
          ref={rowRef}
          style={{
            display: 'flex',
            gap: '1.25rem',
            overflowX: 'auto',
            padding: '1rem 4%',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE/Edge
          }}
          className="no-scrollbar"
        >
          <style>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
          `}</style>

          {movies.map(movie => {
            // Determine actual media type. Some endpoints return mixed.
            const itemMediaType = movie.media_type || mediaType;
            
            return (
              <Link 
                to={`/title/${itemMediaType}/${movie.id}`} 
                key={movie.id}
                style={{
                  flex: '0 0 auto',
                  width: '200px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
                  e.currentTarget.style.zIndex = '5';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.zIndex = '1';
                }}
              >
                <img 
                  src={getImageUrl(movie.poster_path, 'w500')} 
                  alt={movie.title || movie.name}
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  loading="lazy"
                />
              </Link>
            )
          })}
        </div>

        <div style={{
          position: 'absolute',
          top: 0, bottom: 0, right: 0,
          width: '4%',
          background: 'linear-gradient(to left, rgba(0,0,0,0.8), transparent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10,
          opacity: showControls ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: showControls ? 'auto' : 'none'
        }}>
          <button onClick={() => handleScroll('right')} style={{ color: 'white', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '8px' }}>
            <ChevronRight size={32} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaRow;
