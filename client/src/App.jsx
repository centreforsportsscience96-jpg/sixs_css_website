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
    axios.get('http://localhost:5000/api/info')
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
                <span style={{ fontSize: '12px', fontWeight: 500 }}>{dbStatus.toUpperCase()}</span>
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
              <div className="footer-col">
                <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.5px' }}>Centre For<br />Sports Science</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '250px' }}>Innovation at the peak of human performance.</p>
              </div>
              <div className="footer-col">
                <h4>Services</h4>
                <ul className="footer-links">
                  <li><Link to="/services">Amateur Training</Link></li>
                  <li><Link to="/services">Professional Recovery</Link></li>
                  <li><Link to="/services">Elite Biomechanics</Link></li>
                  <li><Link to="/services">Nutritional Planning</Link></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Company</h4>
                <ul className="footer-links">
                  <li><a href="/#about-us">About Us</a></li>
                  <li><a href="#">Our Team</a></li>
                  <li><a href="#">Facilities</a></li>
                  <li><a href="#">Careers</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Contact</h4>
                <ul className="footer-links">
                  <li><Link to="/contact">Get in Touch</Link></li>
                  <li><Link to="/contact">Book a Consultation</Link></li>
                  <li><Link to="/contact">Location Map</Link></li>
                  <li><Link to="/contact">Support</Link></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2026 Centre For Sports Science. All rights reserved.</p>
              <div style={{ display: 'flex', gap: '24px' }}>
                <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Privacy Policy</a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
