import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronRight, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from './assets/logo.png';

const App = () => {
  const [dbStatus, setDbStatus] = useState('checking');

  useEffect(() => {
    axios.get('http://localhost:5000/api/info')
      .then(() => setDbStatus('connected'))
      .catch(() => setDbStatus('offline'));
  }, []);

  return (
    <div className="app-wrapper">
      {/* Global Navigation */}
      <nav className="nav-container">
        <div className="nav-content">
          <a href="#" className="nav-link" style={{ fontWeight: 600 }}>CSS</a>
          <div className="nav-links">
            <a href="#" className="nav-link">Home</a>
            <a href="#" className="nav-link">Performance</a>
            <a href="#" className="nav-link">Science</a>
            <a href="#" className="nav-link">Facilities</a>
            <a href="#" className="nav-link">About</a>
          </div>
          <div className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Database size={14} className={dbStatus === 'connected' ? 'text-blue-500' : 'text-gray-400'} />
            <span style={{ fontSize: '10px' }}>{dbStatus.toUpperCase()}</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {/* Hero Section - Main Banner */}
        <section className="hero">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="hero-title">Centre for Sports Science</h1>
            <p className="hero-subtitle">Innovation at the peak of performance.</p>
            <div className="hero-cta">
              <a href="#" className="cta-link">Learn more <ChevronRight size={18} /></a>
              <a href="#" className="cta-link">Get started <ChevronRight size={18} /></a>
            </div>
          </motion.div>

          <motion.div
            className="hero-logo-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <img src={logo} alt="CSS Performance" className="hero-logo" />
          </motion.div>
        </section>

        {/* Secondary Grid Sections */}
        <div className="section-grid">
          {/* Section 1 */}
          <section className="grid-item dark-section">
            <div className="grid-content">
              <h2 className="grid-title">Elite Training</h2>
              <p className="grid-subtitle">Where science meets the sweat.</p>
              <div className="hero-cta">
                <a href="#" className="cta-link">Explore <ChevronRight size={16} /></a>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="grid-item">
            <div className="grid-content">
              <h2 className="grid-title">Recovery Lab</h2>
              <p className="grid-subtitle">Data-driven restoration for athletes.</p>
              <div className="hero-cta">
                <a href="#" className="cta-link">View tech <ChevronRight size={16} /></a>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="grid-item">
            <div className="grid-content">
              <h2 className="grid-title">Bio-Analytics</h2>
              <p className="grid-subtitle">Every millisecond counts.</p>
              <div className="hero-cta">
                <a href="#" className="cta-link">See reports <ChevronRight size={16} /></a>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="grid-item dark-section" style={{ backgroundColor: '#1d1d1f' }}>
            <div className="grid-content">
              <h2 className="grid-title">Performance Lab</h2>
              <p className="grid-subtitle">Your biology, optimized.</p>
              <div className="hero-cta">
                <button className="btn-buy">Start Consultation</button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Simplified Footer */}
      <footer style={{ padding: '60px 0', backgroundColor: '#f5f5f7', textAlign: 'center', fontSize: '12px', color: '#86868b' }}>
        <div className="container">
          <p>© 2026 Centre for Sports Science. All rights reserved.</p>
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Use</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Site Map</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
