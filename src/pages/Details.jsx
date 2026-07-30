import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { tmdb, getImageUrl } from '../utils/tmdb';
import Player from '../components/Player';
import { Play, Star, Calendar, Clock } from 'lucide-react';

const Details = () => {
  const { type, id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [selectedServer, setSelectedServer] = useState('vidsrc');

  useEffect(() => {
    const fetchData = async () => {
      if (!import.meta.env.VITE_TMDB_API_KEY) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const { data } = await tmdb.get(`/${type}/${id}`, {
          params: { append_to_response: 'credits' }
        });
        setData(data);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
      setLoading(false);
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [type, id]);

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  if (!data) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {!import.meta.env.VITE_TMDB_API_KEY ? "Please add your TMDB API key to .env file" : "Not Found"}
      </div>
    );
  }

  const title = data.title || data.name || data.original_name;
  const releaseDate = data.release_date || data.first_air_date;
  const runtime = data.runtime || (data.episode_run_time && data.episode_run_time[0]);

  return (
    <div className="fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Background Image */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '70vh',
        zIndex: -1,
      }}>
        <img 
          src={getImageUrl(data.backdrop_path)} 
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.2) 100%)'
        }}></div>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%',
          background: 'linear-gradient(to top, var(--bg-color) 0%, transparent 100%)'
        }}></div>
      </div>

      <div className="container" style={{ paddingTop: '15vh' }}>
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
          {/* Left Column: Poster */}
          <div style={{ flex: '0 0 300px', display: 'none' }}>
             {/* Hide poster on mobile if needed, but flex will handle wrapping */}
          </div>
          <div style={{ flex: '1', minWidth: '300px', maxWidth: '800px' }}>
            <h1 className="h1" style={{ marginBottom: '1rem' }}>{title}</h1>
            
            <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem', alignItems: 'center' }}>
              {data.vote_average && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#ffd700' }}>
                  <Star size={18} fill="currentColor" />
                  {data.vote_average.toFixed(1)}
                </span>
              )}
              {releaseDate && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={18} />
                  {new Date(releaseDate).getFullYear()}
                </span>
              )}
              {runtime && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={18} />
                  {runtime} min
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              {data.genres?.map(genre => (
                <span key={genre.id} style={{ 
                  padding: '0.4rem 1rem', 
                  borderRadius: '2rem', 
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  fontSize: '0.9rem'
                }}>
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="p-large" style={{ marginBottom: '2.5rem', lineHeight: 1.6, color: '#eee' }}>
              {data.overview}
            </p>

            {!showPlayer ? (
              <button className="btn-primary" onClick={() => setShowPlayer(true)} style={{ marginBottom: '3rem' }}>
                <Play fill="currentColor" size={20} />
                Watch Now
              </button>
            ) : (
              <div style={{ marginBottom: '3rem' }}>
                <button 
                  onClick={() => setShowPlayer(false)}
                  style={{ 
                    marginBottom: '1rem', 
                    color: 'var(--text-secondary)', 
                    textDecoration: 'underline' 
                  }}
                >
                  Close Player
                </button>
                <div className="fade-in">
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Server</label>
                      <select 
                        value={selectedServer} 
                        onChange={(e) => setSelectedServer(e.target.value)}
                        style={{ 
                          padding: '0.5rem 1rem', 
                          background: 'var(--glass-bg)', 
                          color: 'white', 
                          border: '1px solid var(--glass-border)', 
                          borderRadius: '8px' 
                        }}
                      >
                        <option value="vidsrc" style={{ color: 'black' }}>VidSrc</option>
                        <option value="streamsrc" style={{ color: 'black' }}>StreamSrc</option>
                        <option value="moviesrc" style={{ color: 'black' }}>MovieSrc</option>
                        <option value="cinesrc" style={{ color: 'black' }}>CineSrc</option>
                      </select>
                    </div>

                    {type === 'tv' && (
                      <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Season</label>
                          <select 
                            value={selectedSeason} 
                            onChange={(e) => setSelectedSeason(e.target.value)}
                            style={{ 
                              padding: '0.5rem 1rem', 
                              background: 'var(--glass-bg)', 
                              color: 'white', 
                              border: '1px solid var(--glass-border)', 
                              borderRadius: '8px' 
                            }}
                          >
                            {data.seasons?.filter(s => s.season_number > 0).map(s => (
                              <option key={s.id} value={s.season_number} style={{ color: 'black' }}>
                                Season {s.season_number}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Episode</label>
                          <input 
                            type="number" 
                            min="1"
                            value={selectedEpisode}
                            onChange={(e) => setSelectedEpisode(e.target.value)}
                            style={{ 
                              padding: '0.5rem 1rem', 
                              background: 'var(--glass-bg)', 
                              color: 'white', 
                              border: '1px solid var(--glass-border)', 
                              borderRadius: '8px',
                              width: '80px'
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  
                  <Player 
                    tmdbId={id} 
                    mediaType={type} 
                    season={type === 'tv' ? selectedSeason : null}
                    episode={type === 'tv' ? selectedEpisode : null}
                    server={selectedServer}
                  />
                </div>
              </div>
            )}

            {/* Cast Section */}
            {data.credits?.cast?.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h2 className="h2">Top Cast</h2>
                <div style={{ 
                  display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem',
                  scrollbarWidth: 'none'
                }} className="no-scrollbar">
                  {data.credits.cast.slice(0, 8).map(person => (
                    <div key={person.id} style={{ flex: '0 0 120px', textAlign: 'center' }}>
                      <div style={{ 
                        width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', 
                        marginBottom: '0.8rem', background: 'var(--glass-bg)'
                      }}>
                        {person.profile_path ? (
                          <img 
                            src={getImageUrl(person.profile_path, 'w200')} 
                            alt={person.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            NA
                          </div>
                        )}
                      </div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{person.name}</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
