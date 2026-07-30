import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 100,
      transition: 'all 0.3s ease',
      padding: '1.5rem 0',
      ...(isScrolled ? {
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1rem 0'
      } : {
        background: 'transparent',
        borderBottom: '1px solid transparent'
      })
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          fontWeight: 700,
          fontSize: '1.5rem',
          letterSpacing: '-0.05em'
        }}>
          <img src={logo} alt="Bubble. Logo" style={{ height: '48px', objectFit: 'contain' }} />
          Bubble.
        </Link>
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/search" style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--glass-bg)',
            transition: 'background 0.2s'
          }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'var(--glass-bg)'}
          >
            <Search size={18} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
