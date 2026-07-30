const Player = ({ tmdbId, mediaType, season, episode, server }) => {
  let src = '';
  
  if (server === 'vidsrc') {
    if (mediaType === 'movie') src = `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`;
    else src = `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season || 1}&episode=${episode || 1}`;
  } 
  else if (server === 'streamsrc') {
    if (mediaType === 'movie') src = `https://streamsrc.cc/watch/movie/${tmdbId}`;
    else src = `https://streamsrc.cc/watch/series/${tmdbId}?season=${season || 1}&episode=${episode || 1}`;
  }
  else if (server === 'moviesrc') {
    if (mediaType === 'movie') src = `https://embed.su/embed/movie/${tmdbId}`; // Using a stable alternative for MovieSrc
    else src = `https://embed.su/embed/tv/${tmdbId}/${season || 1}/${episode || 1}`;
  }
  else if (server === 'cinesrc') {
    if (mediaType === 'movie') src = `https://autoembed.to/movie/tmdb/${tmdbId}`; // Using autoembed as a CineSrc alternative
    else src = `https://autoembed.to/tv/tmdb/${tmdbId}-${season || 1}-${episode || 1}`;
  }
  else {
    // Default fallback
    if (mediaType === 'movie') src = `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`;
    else src = `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season || 1}&episode=${episode || 1}`;
  }

  if (!src) return null;

  return (
    <div style={{
      width: '100%',
      aspectRatio: '16/9',
      background: '#000',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      position: 'relative'
    }}>
      <iframe 
        src={src}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0
        }}
        allowFullScreen
        title="Video Player"
      ></iframe>
    </div>
  );
};

export default Player;
