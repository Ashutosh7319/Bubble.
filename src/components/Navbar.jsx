import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Download } from 'lucide-react';
import logo from '../assets/NewLogo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Listen for PWA beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 100,
      transition: 'all 0.35s ease',
      padding: isScrolled ? '0.8rem 0' : '1.2rem 0',
      background: isScrolled ? 'rgba(0, 0, 0, 0.85)' : 'transparent',
      backdropFilter: isScrolled ? 'saturate(200%) blur(30px)' : 'none',
      WebkitBackdropFilter: isScrolled ? 'saturate(200%) blur(30px)' : 'none',
      borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.04)' : '1px solid transparent'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.6rem',
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 800,
          fontSize: '1.4rem',
          letterSpacing: '-0.04em',
          color: '#fff'
        }}>
          <img src={logo} alt="Bubble. Logo" style={{ height: '38px', objectFit: 'contain' }} />
          <span>Bubble<span style={{ color: 'var(--accent)' }}>.</span></span>
        </Link>
        
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          {/* PWA Install Button */}
          {deferredPrompt && !isInstalled && (
            <button 
              onClick={handleInstallClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.9rem',
                borderRadius: '2rem',
                background: 'var(--accent-gradient)',
                color: 'white',
                fontSize: '0.8rem',
                fontWeight: 600,
                boxShadow: '0 0 15px rgba(220, 38, 38, 0.4)',
                transition: 'all 0.25s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Download size={14} />
              Install App
            </button>
          )}

          <Link to="/search" style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255,255,255,0.06)',
            transition: 'all 0.25s ease'
          }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
            aria-label="Search"
          >
            <Search size={16} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
