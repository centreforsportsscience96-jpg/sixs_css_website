import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import InstagramIcon from './components/InstagramIcon';
import LinkedInIcon from './components/LinkedInIcon';
import WhatsAppIcon from './components/WhatsAppIcon';
import cssLogo from './assets/css_logo.png';

// Pages
import Home from './pages/Home';
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const TechnologyPage = lazy(() => import('./pages/TechnologyPage'));
const ContactPage = lazy(() => import('./pages/Contact.jsx'));

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Home and Contact have a dark hero directly under the nav, so the transparent
  // white-text navbar is legible there before scrolling. Other pages don't have that
  // dark backdrop, so the navbar must always use its solid, dark-text style.
  const hasDarkHero = location.pathname === '/' || location.pathname === '/contact';
  const navIsSolid = isScrolled || !hasDarkHero;

  return (
    <div className="app-wrapper">
      {/* Navigation */}
      <nav className={`navbar ${navIsSolid ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <Link to="/" className="nav-logo">
            <img src={cssLogo} alt="CSS Logo" className="nav-logo-img" />
            <span className="nav-logo-text-full">Centre For Sports Science</span>
            <span className="nav-logo-text-short">CSS</span>
          </Link>

          <input type="checkbox" id="nav-toggle" className="nav-toggle-checkbox" />
          <label htmlFor="nav-toggle" className="nav-toggle-label">
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </label>

          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/services" className="nav-link">Services</Link>
            <Link to="/technology" className="nav-link">Technology</Link>
            <a href="/#about-us" className="nav-link">About Us</a>
            <Link to="/contact" className="btn btn-primary" style={{ padding: '10px 20px' }}>Contact Us</Link>
          </div>
        </div>
      </nav>

      <Suspense fallback={null}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/technology" element={<TechnologyPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </AnimatePresence>
      </Suspense>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="brand-col">
              <h3 className="footer-brand">
                Centre For Sports
                <br />
                <span className="footer-brand-accent">Science</span>
              </h3>
              <p className="footer-desc">Innovation at the peak of human performance.</p>
              <div style={{ marginTop: '28px', display: 'flex', gap: '12px' }}>
                <a
                  className="social-icon-text"
                  href="https://www.linkedin.com/company/centre-for-sports-science-sree-kanteerava-stadium/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon size={18} />
                </a>
                <a
                  className="social-icon-text"
                  href="https://www.instagram.com/css_kanteerava?igsh=MTduZXl6ZXo2NmNkcg=="
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <InstagramIcon size={18} />
                </a>
                <a
                  className="social-icon-text"
                  href="https://wa.me/919113535733"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                >
                  <WhatsAppIcon size={18} />
                </a>
              </div>
            </div>

            <div className="links-col">
              <div className="links-grid">
                <div>
                  <h4 className="footer-section-title">HOME</h4>
                  <ul className="footer-links">
                    <li><Link to="/">Home</Link></li>
                    <li><a href="/#about-us">About Us</a></li>
                    <li><Link to="/services">Services</Link></li>
                    <li><a href="/contact">Login</a></li>
                    <li><a href="/contact">Sign Up</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="footer-section-title">TECHNOLOGY</h4>
                  <ul className="footer-links">
                    <li><Link to="/technology">Technology</Link></li>
                    <li><a href="/#our-director">Our Team</a></li>
                    <li><Link to="/technology">Facilities</Link></li>
                    <li><Link to="/contact">Contact Us</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="contact-col">
              <p className="footer-address">
                Centre for sports science, 48 West Gate,
                <br />
                Sree Kanteerava Stadium,
                <br />
                Bangalore.
              </p>
              <div className="contact-details" style={{ marginTop: '28px' }}>
                <a className="contact-link" href="tel:+919113535733">Phone: +91 9113535733</a>
                <a className="contact-link" href="mailto:admin@sixscss.com">admin@sixscss.com</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Centre For Sports Science. All rights reserved.</p>
            <p className="footer-tagline">Top Rated Sports Science Center</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
