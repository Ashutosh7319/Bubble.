import { useState, useEffect } from 'react';
import logo from '../assets/NewLogo.png';

const LoadingScreen = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Smooth progress bar simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsFadingOut(true), 200);
          setTimeout(() => {
            if (onFinished) onFinished();
          }, 700);
          return 100;
        }
        const diff = Math.floor(Math.random() * 15) + 10;
        return Math.min(prev + diff, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onFinished]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000000',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s ease',
      opacity: isFadingOut ? 0 : 1,
      transform: isFadingOut ? 'scale(1.04)' : 'scale(1)',
      pointerEvents: isFadingOut ? 'none' : 'auto'
    }}>
      {/* Background Ambient Glow */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(220, 38, 38, 0.25) 0%, transparent 70%)',
        filter: 'blur(40px)',
        borderRadius: '50%',
        animation: 'pulseGlow 2s ease-in-out infinite'
      }}></div>

      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        {/* Logo with pulsing glow */}
        <div style={{
          position: 'relative',
          width: '100px',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src={logo} 
            alt="Bubble. Logo" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 20px rgba(220, 38, 38, 0.6))',
              animation: 'logoPulse 1.5s ease-in-out infinite alternate'
            }} 
          />
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 800,
          fontSize: '2rem',
          letterSpacing: '-0.04em',
          color: '#ffffff'
        }}>
          Bubble<span style={{ color: 'var(--accent)' }}>.</span>
        </h1>

        {/* Progress Bar Container */}
        <div style={{
          width: '180px',
          height: '3px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '3px',
          overflow: 'hidden',
          position: 'relative',
          marginTop: '0.5rem'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'var(--accent-gradient)',
            borderRadius: '3px',
            boxShadow: '0 0 10px rgba(220, 38, 38, 0.8)',
            transition: 'width 0.15s ease-out'
          }}></div>
        </div>
      </div>

      <style>{`
        @keyframes logoPulse {
          0% { transform: scale(0.96); filter: drop-shadow(0 0 15px rgba(220, 38, 38, 0.4)); }
          100% { transform: scale(1.04); filter: drop-shadow(0 0 30px rgba(220, 38, 38, 0.8)); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
