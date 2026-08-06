const Player = ({ tmdbId, mediaType, season, episode, server, startTime }) => {
  let src = '';
  
  if (server === 'vidking') {
    // VidKing accepts ?color param for theming and ?time for start position
    let params = [];
    if (startTime) params.push(`time=${startTime}`);
    params.push('color=dc2626'); // Match our red accent
    const queryString = params.length ? `?${params.join('&')}` : '';
    
    if (mediaType === 'movie') src = `https://www.vidking.net/embed/movie/${tmdbId}${queryString}`;
    else src = `https://www.vidking.net/embed/tv/${tmdbId}/${season || 1}/${episode || 1}${queryString}`;
  }
  else if (server === 'vidsrc') {
    if (mediaType === 'movie') src = `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`;
    else src = `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season || 1}&episode=${episode || 1}`;
  } 
  else if (server === 'streamsrc') {
    if (mediaType === 'movie') src = `https://streamsrc.cc/watch/movie/${tmdbId}`;
    else src = `https://streamsrc.cc/watch/series/${tmdbId}?season=${season || 1}&episode=${episode || 1}`;
  }
  else if (server === 'moviesrc') {
    if (mediaType === 'movie') src = `https://embed.su/embed/movie/${tmdbId}`;
    else src = `https://embed.su/embed/tv/${tmdbId}/${season || 1}/${episode || 1}`;
  }
  else if (server === 'cinesrc') {
    if (mediaType === 'movie') src = `https://autoembed.to/movie/tmdb/${tmdbId}`;
    else src = `https://autoembed.to/tv/tmdb/${tmdbId}-${season || 1}-${episode || 1}`;
  }
  else {
    // Default fallback to VidKing
    if (mediaType === 'movie') src = `https://www.vidking.net/embed/movie/${tmdbId}?color=dc2626`;
    else src = `https://www.vidking.net/embed/tv/${tmdbId}/${season || 1}/${episode || 1}?color=dc2626`;
  }

  if (!src) return null;

  return (
    <div style={{
      width: '100%',
      aspectRatio: '16/9',
      background: '#0a0a0a',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
      position: 'relative',
      border: '1px solid rgba(255,255,255,0.04)'
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
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        referrerPolicy="origin"
        title="Video Player"
      ></iframe>
    </div>
  );
};

export default Player;
