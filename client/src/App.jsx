import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import cssLogo from './assets/css_logo.png';

// Pages
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import Contact from './pages/Contact';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

const App = () => {
  const [dbStatus, setDbStatus] = useState('checking');
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  useEffect(() => {
    axios.get('/api/info')
      .then((res) => setDbStatus(res.data.dbStatus))
      .catch(() => setDbStatus('offline'));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-wrapper">
      {/* Navigation - Hidden on Auth Pages */}
      {!isAuthPage && (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
          <div className="container nav-container">
            <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={cssLogo} alt="CSS Logo" style={{ height: '40px', width: 'auto' }} />
              Centre For Sports Science
            </Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/services" className="nav-link">Services</Link>
              <a href="#" className="nav-link">Technology</a>
              <a href="/#about-us" className="nav-link">About Us</a>
              <div className="db-status" style={{ display: 'flex', alignItems: 'center', gap: '5px', opacity: 0.8 }}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={dbStatus === 'connected' ? '#10b981' : 'currentColor'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                </svg>
                <span style={{ fontSize: '12px', fontWeight: 500 }}>{(dbStatus || 'OFFLINE').toUpperCase()}</span>
              </div>
              <Link to="/login" className="nav-signin" aria-label="Sign In">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </Link>
              <Link to="/contact" className="btn btn-primary" style={{ padding: '8px 20px' }}>Contact Us</Link>
            </div>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>

      {/* Footer - Hidden on Auth Pages */}
      {!isAuthPage && (
        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              
              {/* Column 1: Branding & Social */}
              <div className="footer-col brand-col">
                <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '32px', textDecoration: 'none' }}>
                  <img src={cssLogo} alt="CSS Logo" style={{ height: '28px', width: 'auto' }} />
                  <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary-dark)', letterSpacing: '-0.5px' }}>
                    Centre For <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Sports Science</span>
                  </span>
                </Link>
                <p style={{ color: '#888888', marginBottom: '40px', fontSize: '14px', fontWeight: 300, letterSpacing: '0.2px' }}>
                  Innovation at the peak of human performance.
                </p>
                <div className="social-links">
                  <a href="#" aria-label="LinkedIn" className="social-icon-text">
                    in
                  </a>
                </div>
              </div>

              {/* Column 2: Navigation Links Grid */}
              <div className="footer-col links-col">
                <div className="links-grid">
                  <ul className="footer-links">
                    <li><Link to="/">HOME</Link></li>
                    <li><a href="/#about-us">ABOUT US</a></li>
                    <li><Link to="/services">SERVICES</Link></li>
                    <li><Link to="/login">LOGIN</Link></li>
                    <li><Link to="/signup">SIGN UP</Link></li>
                  </ul>
                  <ul className="footer-links">
                    <li><a href="#">TECHNOLOGY</a></li>
                    <li><a href="#">OUR TEAM</a></li>
                    <li><a href="#">FACILITIES</a></li>
                    <li><Link to="/contact">CONTACT US</Link></li>
                  </ul>
                </div>
              </div>

              {/* Column 3: Contact Info */}
              <div className="footer-col contact-col">
                <p style={{ fontSize: '20px', color: '#4a4a4a', fontWeight: 300, lineHeight: '1.4', marginBottom: '40px', letterSpacing: '-0.3px' }}>
                  Centre for sports science, 48 West Gate,<br />
                  Sree Kanteerava Stadium,<br />
                  Bangalore.
                </p>
                <div className="contact-details">
                  <a href="tel:+919113535733" className="contact-link">Phone: +91 9113535733</a>
                  <a href="mailto:admin@sixscss.com" className="contact-link">admin@sixscss.com</a>
                </div>
              </div>

            </div>
            
            <div className="footer-bottom">
              <p>&copy; 2026 Centre For Sports Science. All rights reserved.</p>
              <div className="trust-badge-small">
                {/* Placeholder for Trust Badge/Designed By as in image */}
                <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-main)' }}>Top Rated Sports Science Center</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
