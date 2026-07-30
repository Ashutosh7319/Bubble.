import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { tmdb, getImageUrl } from '../utils/tmdb';

const Hero = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await tmdb.get('/trending/all/day');
        // Get top 5 trending movies with backdrops
        const results = data.results.filter(item => item.backdrop_path).slice(0, 5);
        setMovies(results);
      } catch (error) {
        console.error("Error fetching hero movie:", error);
      }
    };
    
    if (import.meta.env.VITE_TMDB_API_KEY) {
      fetchTrending();
    }
  }, []);

  // Set up the carousel interval
  useEffect(() => {
    if (movies.length <= 1) return;

    const interval = setInterval(() => {
      // Trigger fade out
      setIsFading(true);
      
      // Wait for fade out, then change movie and fade in
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
        setIsFading(false);
      }, 500); // 500ms should match the transition duration
      
    }, 8000); // Change movie every 8 seconds

    return () => clearInterval(interval);
  }, [movies.length]);

  if (movies.length === 0) {
    return (
      <div style={{ height: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          {!import.meta.env.VITE_TMDB_API_KEY ? "Please add your TMDB API key to .env file" : "Loading..."}
        </p>
      </div>
    );
  }

  const movie = movies[currentIndex];
  const title = movie.title || movie.name || movie.original_name;
  const description = movie.overview?.length > 180 ? movie.overview.slice(0, 180) + '...' : movie.overview;

  return (
    <div style={{
      position: 'relative',
      height: '85vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      {/* Background Image Carousel Container */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          transition: 'opacity 0.8s ease-in-out',
          opacity: isFading ? 0.3 : 1
        }}
      >
        <img 
          src={getImageUrl(movie.backdrop_path)} 
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            transform: isFading ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 8s ease-out'
          }}
        />
        {/* Gradient Overlays for Apple TV aesthetic */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, width: '100%', height: '40%',
          background: 'linear-gradient(to top, var(--bg-color) 0%, transparent 100%)'
        }}></div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        <div 
          style={{ 
            maxWidth: '650px',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            opacity: isFading ? 0 : 1,
            transform: isFading ? 'translateY(10px)' : 'translateY(0)'
          }}
        >
          {/* Subtle label above title */}
          <span style={{ 
            display: 'inline-block',
            padding: '4px 12px', 
            borderRadius: '12px', 
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '1rem',
            color: 'rgba(255,255,255,0.8)'
          }}>
            {movie.media_type === 'tv' ? 'Series' : 'Movie'}
          </span>
          
          <h1 className="h1" style={{ marginBottom: '1.25rem', textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}>
            {title}
          </h1>
          <p className="p-large" style={{ marginBottom: '2.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.8)', color: '#f5f5f7', lineHeight: 1.6 }}>
            {description}
          </p>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to={`/title/${movie.media_type || 'movie'}/${movie.id}`} className="btn-primary">
              <Play fill="currentColor" size={20} />
              Play Now
            </Link>
            <Link to={`/title/${movie.media_type || 'movie'}/${movie.id}`} className="btn-secondary">
              <Info size={20} />
              More Info
            </Link>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div style={{ 
          position: 'absolute', 
          bottom: '-3rem', 
          left: '4%', 
          display: 'flex', 
          gap: '8px' 
        }}>
          {movies.map((_, index) => (
            <button 
              key={index}
              onClick={() => {
                setIsFading(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsFading(false);
                }, 500);
              }}
              style={{
                width: index === currentIndex ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: index === currentIndex ? 'white' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease',
                padding: 0
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
