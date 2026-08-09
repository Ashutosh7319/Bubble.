import { useState, useEffect, useRef, useCallback } from 'react';
import { AlertTriangle, RefreshCw, SkipForward } from 'lucide-react';

/**
 * All available embed sources, ordered by reliability.
 * VidKing is first (user's preferred default) — auto-fallback goes through the rest.
 */
export const EMBED_SERVERS = [
  { id: 'vidking',      name: 'VidKing',       icon: '👑' },
  { id: 'vidsrc',       name: 'VidSrc',        icon: '📡' },
  { id: 'embed',        name: 'Embed.su',      icon: '🎬' },
  { id: 'autoembed',    name: 'AutoEmbed',     icon: '⚡' },
  { id: 'multiembed',   name: 'MultiEmbed',    icon: '🌐' },
  { id: 'superembed',   name: 'SuperEmbed',    icon: '🔥' },
  { id: 'vidlink',      name: 'VidLink',       icon: '🔗' },
  { id: 'smashy',       name: 'SmashyStream',  icon: '💥' },
  { id: 'vidsrcto',     name: 'VidSrc.to',     icon: '📺' },
  { id: 'moviesapi',    name: 'MoviesAPI',     icon: '🎥' },
  { id: 'streamsrc',    name: 'StreamSrc',     icon: '🌊' },
  { id: '2embed',       name: '2Embed',        icon: '🔁' },
  { id: 'nontongo',     name: 'NontonGo',      icon: '🎞️' },
];

/**
 * Build the embed iframe src URL for a given server.
 */
function buildSrc(server, tmdbId, mediaType, season, episode, startTime) {
  const s = season || 1;
  const e = episode || 1;
  const isMovie = mediaType === 'movie';

  switch (server) {
    case 'vidking': {
      let params = [];
      if (startTime) params.push(`time=${startTime}`);
      params.push('color=dc2626');
      const qs = params.length ? `?${params.join('&')}` : '';
      return isMovie
        ? `https://www.vidking.net/embed/movie/${tmdbId}${qs}`
        : `https://www.vidking.net/embed/tv/${tmdbId}/${s}/${e}${qs}`;
    }

    case 'vidsrc':
      return isMovie
        ? `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`
        : `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${s}&episode=${e}`;

    case 'embed':
      return isMovie
        ? `https://embed.su/embed/movie/${tmdbId}`
        : `https://embed.su/embed/tv/${tmdbId}/${s}/${e}`;

    case 'autoembed':
      return isMovie
        ? `https://autoembed.to/movie/tmdb/${tmdbId}`
        : `https://autoembed.to/tv/tmdb/${tmdbId}-${s}-${e}`;

    case 'multiembed':
      return isMovie
        ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`
        : `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${s}&e=${e}`;

    case 'superembed':
      return isMovie
        ? `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1`
        : `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1&s=${s}&e=${e}`;

    case 'vidlink':
      return isMovie
        ? `https://vidlink.pro/movie/${tmdbId}`
        : `https://vidlink.pro/tv/${tmdbId}/${s}/${e}`;

    case 'smashy':
      return isMovie
        ? `https://player.smashy.stream/movie/${tmdbId}`
        : `https://player.smashy.stream/tv/${tmdbId}?s=${s}&e=${e}`;

    case 'vidsrcto':
      return isMovie
        ? `https://vidsrc.to/embed/movie/${tmdbId}`
        : `https://vidsrc.to/embed/tv/${tmdbId}/${s}/${e}`;

    case 'moviesapi':
      return isMovie
        ? `https://moviesapi.club/movie/${tmdbId}`
        : `https://moviesapi.club/tv/${tmdbId}-${s}-${e}`;

    case 'streamsrc':
      return isMovie
        ? `https://streamsrc.cc/watch/movie/${tmdbId}`
        : `https://streamsrc.cc/watch/series/${tmdbId}?season=${s}&episode=${e}`;

    case '2embed':
      return isMovie
        ? `https://www.2embed.cc/embed/${tmdbId}`
        : `https://www.2embed.cc/embedtv/${tmdbId}&s=${s}&e=${e}`;

    case 'nontongo':
      return isMovie
        ? `https://nontongo.win/embed/movie/${tmdbId}`
        : `https://nontongo.win/embed/tv/${tmdbId}/${s}/${e}`;

    default:
      return isMovie
        ? `https://www.vidking.net/embed/movie/${tmdbId}?color=dc2626`
        : `https://www.vidking.net/embed/tv/${tmdbId}/${s}/${e}?color=dc2626`;
  }
}

const FALLBACK_TIMEOUT_MS = 12000; // 12 seconds before showing fallback suggestion

const Player = ({ tmdbId, mediaType, season, episode, server, startTime, onServerChange }) => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded' | 'error' | 'timeout'
  const [autoRetryCount, setAutoRetryCount] = useState(0);
  const iframeRef = useRef(null);
  const timeoutRef = useRef(null);

  const src = buildSrc(server, tmdbId, mediaType, season, episode, startTime);

  // Get the next server in the list after the current one
  const getNextServer = useCallback(() => {
    const currentIndex = EMBED_SERVERS.findIndex(s => s.id === server);
    const nextIndex = (currentIndex + 1) % EMBED_SERVERS.length;
    return EMBED_SERVERS[nextIndex];
  }, [server]);

  // Auto-switch to next server
  const switchToNext = useCallback(() => {
    const next = getNextServer();
    if (onServerChange && next) {
      setAutoRetryCount(prev => prev + 1);
      setStatus('loading');
      onServerChange(next.id);
    }
  }, [getNextServer, onServerChange]);

  // Reset status when server/content changes
  useEffect(() => {
    setStatus('loading');

    // Clear any existing timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Set a timeout — if still "loading" after FALLBACK_TIMEOUT_MS, show suggestion
    timeoutRef.current = setTimeout(() => {
      setStatus(prev => {
        if (prev === 'loading') {
          // Auto-switch on first 2 failures, then show manual option
          if (autoRetryCount < 2) {
            switchToNext();
            return 'loading';
          }
          return 'timeout';
        }
        return prev;
      });
    }, FALLBACK_TIMEOUT_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [server, tmdbId, season, episode, autoRetryCount, switchToNext]);

  const handleIframeLoad = () => {
    // The iframe loaded something — could be an error page, but at least it responded
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setStatus('loaded');
  };

  const handleIframeError = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // Auto-switch on error if under retry limit
    if (autoRetryCount < 2) {
      switchToNext();
    } else {
      setStatus('error');
    }
  };

  const currentServerInfo = EMBED_SERVERS.find(s => s.id === server) || EMBED_SERVERS[0];
  const nextServerInfo = getNextServer();

  if (!src) return null;

  return (
    <div style={{ position: 'relative' }}>
      {/* Player Container */}
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
        {/* Loading indicator */}
        {status === 'loading' && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            zIndex: 5, background: 'rgba(0,0,0,0.85)',
            gap: '1rem', pointerEvents: 'none'
          }}>
            <div style={{
              width: '36px', height: '36px',
              border: '3px solid rgba(255,255,255,0.08)',
              borderTopColor: 'var(--accent)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }}></div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Loading {currentServerInfo.icon} {currentServerInfo.name}...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={src}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            position: 'absolute',
            top: 0,
            left: 0
          }}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          allowFullScreen
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          referrerPolicy="origin"
          title="Video Player"
        ></iframe>
      </div>

      {/* Error / Timeout Overlay */}
      {(status === 'error' || status === 'timeout') && (
        <div style={{
          marginTop: '0.8rem',
          padding: '0.9rem 1.2rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(220, 38, 38, 0.08)',
          border: '1px solid rgba(220, 38, 38, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          flexWrap: 'wrap',
          animation: 'fadeIn 0.3s ease'
        }}>
          <AlertTriangle size={18} color="#f87171" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', flex: 1, minWidth: '180px' }}>
            {status === 'error'
              ? `${currentServerInfo.name} failed to load.`
              : `${currentServerInfo.name} is taking too long to respond.`
            }
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setStatus('loading');
                setAutoRetryCount(0);
                // Force iframe reload by briefly clearing src
                if (iframeRef.current) {
                  iframeRef.current.src = '';
                  setTimeout(() => { iframeRef.current.src = src; }, 100);
                }
              }}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
            >
              <RefreshCw size={13} />
              Retry
            </button>
            <button
              onClick={() => {
                setAutoRetryCount(0);
                switchToNext();
              }}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '6px',
                background: 'var(--accent)',
                border: '1px solid var(--accent)',
                color: 'white',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 0 12px rgba(220,38,38,0.25)'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'var(--accent-light)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'var(--accent)'; }}
            >
              <SkipForward size={13} />
              Try {nextServerInfo.icon} {nextServerInfo.name}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
