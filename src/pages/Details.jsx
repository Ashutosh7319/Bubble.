import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { tmdb, getImageUrl } from '../utils/tmdb';
import Player from '../components/Player';
import SubtitleSearch from '../components/SubtitleSearch';
import { Play, Star, Calendar, Clock, ChevronDown } from 'lucide-react';

const Details = () => {
  const { type, id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [selectedServer, setSelectedServer] = useState('vidking');
  const [startTime, setStartTime] = useState('');

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
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        {!import.meta.env.VITE_TMDB_API_KEY ? "Please add your TMDB API key to .env file" : "Not Found"}
      </div>
    );
  }

  const title = data.title || data.name || data.original_name;
  const releaseDate = data.release_date || data.first_air_date;
  const runtime = data.runtime || (data.episode_run_time && data.episode_run_time[0]);
  const currentSeasonData = data.seasons?.find(s => s.season_number === parseInt(selectedSeason));
  const episodeCount = currentSeasonData?.episode_count || 1;

  // Premium select styling
  const selectStyle = {
    padding: '0.55rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.85rem',
    fontWeight: 500,
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'10\' height=\'6\' viewBox=\'0 0 10 6\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1L5 5L9 1\' stroke=\'%23888\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    paddingRight: '2rem'
  };

  const inputStyle = {
    ...selectStyle,
    width: '100px',
    appearance: 'textfield',
    MozAppearance: 'textfield',
    backgroundImage: 'none',
    paddingRight: '1rem'
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Background Image */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '75vh',
        zIndex: -1,
      }}>
        <img 
          src={getImageUrl(data.backdrop_path)} 
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5)' }}
        />
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3) 100%)'
        }}></div>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60%',
          background: 'linear-gradient(to top, #000000 0%, rgba(0,0,0,0.7) 40%, transparent 100%)'
        }}></div>
      </div>

      <div className="container" style={{ paddingTop: '15vh' }}>
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '300px', maxWidth: '850px' }}>
            {/* Title */}
            <h1 className="h1" style={{ marginBottom: '1rem' }}>{title}</h1>
            
            {/* Meta info */}
            <div style={{ 
              display: 'flex', gap: '1.2rem', marginBottom: '1.5rem', 
              fontSize: '0.95rem', alignItems: 'center', flexWrap: 'wrap' 
            }}>
              {data.vote_average && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#fbbf24', fontWeight: 600 }}>
                  <Star size={16} fill="#fbbf24" color="#fbbf24" />
                  {data.vote_average.toFixed(1)}
                </span>
              )}
              {releaseDate && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)' }}>
                  <Calendar size={15} />
                  {new Date(releaseDate).getFullYear()}
                </span>
              )}
              {runtime && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)' }}>
                  <Clock size={15} />
                  {runtime} min
                </span>
              )}
            </div>

            {/* Genres */}
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.8rem', flexWrap: 'wrap' }}>
              {data.genres?.map(genre => (
                <span key={genre.id} style={{ 
                  padding: '0.3rem 0.9rem', 
                  borderRadius: '2rem', 
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)'
                }}>
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <p style={{ 
              marginBottom: '2.5rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', 
              fontSize: '1rem', maxWidth: '700px' 
            }}>
              {data.overview}
            </p>

            {/* Player Section */}
            {!showPlayer ? (
              <button className="btn-primary" onClick={() => setShowPlayer(true)} style={{ marginBottom: '3rem' }}>
                <Play fill="currentColor" size={18} />
                Watch Now
              </button>
            ) : (
              <div style={{ marginBottom: '3rem' }}>
                <button 
                  onClick={() => setShowPlayer(false)}
                  style={{ 
                    marginBottom: '1.2rem', 
                    color: 'var(--text-muted)', 
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  ← Close Player
                </button>

                <div className="fade-in">
                  {/* Controls Row */}
                  <div style={{ 
                    display: 'flex', gap: '0.8rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' 
                  }}>
                    {/* Server */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Server</label>
                      <select value={selectedServer} onChange={(e) => setSelectedServer(e.target.value)} style={selectStyle}>
                        <option value="vidking" style={{ color: 'black' }}>VidKing</option>
                        <option value="vidsrc" style={{ color: 'black' }}>VidSrc</option>
                        <option value="streamsrc" style={{ color: 'black' }}>StreamSrc</option>
                        <option value="moviesrc" style={{ color: 'black' }}>MovieSrc</option>
                        <option value="cinesrc" style={{ color: 'black' }}>CineSrc</option>
                      </select>
                    </div>

                    {/* Season Dropdown (TV only) */}
                    {type === 'tv' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Season</label>
                        <select 
                          value={selectedSeason} 
                          onChange={(e) => { setSelectedSeason(e.target.value); setSelectedEpisode(1); }}
                          style={selectStyle}
                        >
                          {data.seasons?.filter(s => s.season_number > 0).map(s => (
                            <option key={s.id} value={s.season_number} style={{ color: 'black' }}>
                              Season {s.season_number}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Start Time */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Start (s)</label>
                      <input 
                        type="number" min="0" placeholder="0"
                        value={startTime} onChange={(e) => setStartTime(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  
                  {/* Episode Selection Pills (TV only) */}
                  {type === 'tv' && data.seasons && (
                    <div style={{ marginBottom: '1.2rem' }}>
                      <label style={{ 
                        fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, 
                        textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.6rem' 
                      }}>
                        Episode
                      </label>
                      <div className="no-scrollbar" style={{ 
                        display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem'
                      }}>
                        {Array.from({ length: episodeCount }).map((_, i) => {
                          const epNum = i + 1;
                          const isActive = parseInt(selectedEpisode) === epNum;
                          return (
                            <button
                              key={epNum}
                              onClick={() => setSelectedEpisode(epNum)}
                              style={{
                                padding: '0.4rem 0.9rem',
                                borderRadius: '6px',
                                background: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.04)',
                                color: isActive ? 'white' : 'var(--text-secondary)',
                                border: isActive ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.06)',
                                fontWeight: isActive ? 700 : 500,
                                fontSize: '0.8rem',
                                boxShadow: isActive ? '0 0 12px rgba(220,38,38,0.3)' : 'none',
                                transition: 'all 0.2s ease',
                                flexShrink: 0,
                                cursor: 'pointer'
                              }}
                              onMouseOver={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                              onMouseOut={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                            >
                              Ep {epNum}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Player */}
                  <Player 
                    tmdbId={id} 
                    mediaType={type} 
                    season={type === 'tv' ? selectedSeason : null}
                    episode={type === 'tv' ? selectedEpisode : null}
                    server={selectedServer}
                    startTime={startTime}
                  />

                  {/* Subtitle Tool */}
                  <div style={{ marginTop: '1.5rem' }}>
                    <SubtitleSearch title={title} />
                  </div>
                </div>
              </div>
            )}

            {/* Cast Section */}
            {data.credits?.cast?.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h2 className="h2">Top Cast</h2>
                <div className="no-scrollbar" style={{ 
                  display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem'
                }}>
                  {data.credits.cast.slice(0, 8).map(person => (
                    <div key={person.id} style={{ flex: '0 0 100px', textAlign: 'center' }}>
                      <div style={{ 
                        width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', 
                        marginBottom: '0.6rem', background: 'var(--bg-elevated)',
                        border: '2px solid rgba(255,255,255,0.04)'
                      }}>
                        {person.profile_path ? (
                          <img 
                            src={getImageUrl(person.profile_path, 'w200')} 
                            alt={person.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            loading="lazy"
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                            N/A
                          </div>
                        )}
                      </div>
                      <p style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.15rem', color: 'rgba(255,255,255,0.9)' }}>{person.name}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{person.character}</p>
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
