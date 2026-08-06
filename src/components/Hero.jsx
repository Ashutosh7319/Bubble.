import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Star } from 'lucide-react';
import { tmdb, getImageUrl } from '../utils/tmdb';

const Hero = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await tmdb.get('/trending/all/day');
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

  useEffect(() => {
    if (movies.length <= 1) return;

    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
        setIsFading(false);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, [movies.length]);

  if (movies.length === 0) {
    return (
      <div style={{ height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          {!import.meta.env.VITE_TMDB_API_KEY ? "Please add your TMDB API key to .env file" : "Loading..."}
        </p>
      </div>
    );
  }

  const movie = movies[currentIndex];
  const title = movie.title || movie.name || movie.original_name;
  const description = movie.overview?.length > 200 ? movie.overview.slice(0, 200) + '...' : movie.overview;
  const rating = movie.vote_average?.toFixed(1);

  return (
    <div style={{
      position: 'relative',
      height: '90vh',
      minHeight: '600px',
      width: '100%',
      display: 'flex',
      alignItems: 'flex-end',
      overflow: 'hidden'
    }}>
      {/* Background Image */}
      <div 
        style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          zIndex: 0,
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
            transition: 'transform 10s ease-out',
            filter: 'brightness(0.6)'
          }}
        />
        {/* Multi-layer gradients for cinematic depth */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.1) 100%)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, width: '100%', height: '60%',
          background: 'linear-gradient(to top, #000000 0%, rgba(0,0,0,0.8) 30%, transparent 100%)'
        }}></div>
        {/* Subtle red accent glow at bottom */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: '5%', width: '40%', height: '30%',
          background: 'radial-gradient(ellipse at bottom left, rgba(220,38,38,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}></div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%', paddingBottom: '5rem' }}>
        <div 
          style={{ 
            maxWidth: '680px',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            opacity: isFading ? 0 : 1,
            transform: isFading ? 'translateY(15px)' : 'translateY(0)'
          }}
        >
          {/* Type Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
            <span style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '5px 14px', 
              borderRadius: '6px', 
              background: 'var(--accent)',
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: '#fff',
            }}>
              {movie.media_type === 'tv' ? 'Series' : 'Movie'}
            </span>
            {rating && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '5px 12px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.08)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#fbbf24'
              }}>
                <Star size={12} fill="#fbbf24" color="#fbbf24" />
                {rating}
              </span>
            )}
          </div>
          
          <h1 className="h1" style={{ 
            marginBottom: '1rem', 
            textShadow: '0 4px 30px rgba(0,0,0,0.8)'
          }}>
            {title}
          </h1>
          <p className="p-large" style={{ 
            marginBottom: '2.5rem', 
            color: 'rgba(255,255,255,0.7)', 
            lineHeight: 1.7,
            maxWidth: '580px'
          }}>
            {description}
          </p>
          
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            <Link to={`/title/${movie.media_type || 'movie'}/${movie.id}`} className="btn-primary">
              <Play fill="currentColor" size={18} />
              Play Now
            </Link>
            <Link to={`/title/${movie.media_type || 'movie'}/${movie.id}`} className="btn-secondary">
              <Info size={18} />
              More Info
            </Link>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div style={{ 
          position: 'absolute', 
          bottom: '2rem', 
          right: '4%', 
          display: 'flex', 
          gap: '6px',
          alignItems: 'center'
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
                width: index === currentIndex ? '28px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: index === currentIndex ? 'var(--accent)' : 'rgba(255,255,255,0.25)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: 0,
                boxShadow: index === currentIndex ? '0 0 8px rgba(220,38,38,0.5)' : 'none'
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
