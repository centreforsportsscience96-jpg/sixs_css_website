import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Activity,
  Dna,
  Target,
  ShieldCheck,
  TrendingUp,
  Users,
  Database
} from 'lucide-react';
import heroImage from './assets/hero_image.png';
import servicePhysio from './assets/service_physio.png';
import serviceStrength from './assets/service_strength.png';
import serviceBiomechanics from './assets/service_biomechanics.png';
import servicePsychology from './assets/service_psychology.png';

// Reusable animation wrapper
const Reveal = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const App = () => {
  const [dbStatus, setDbStatus] = useState('checking');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/info')
      .then(() => setDbStatus('connected'))
      .catch(() => setDbStatus('offline'));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-wrapper">
      {/* Navigation */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <a href="#" className="nav-logo">Centre For Sports Science</a>
          <div className="nav-links">
            <a href="#" className="nav-link">Home</a>
            <a href="#" className="nav-link">Services</a>
            <a href="#" className="nav-link">Technology</a>
            <a href="#about-us" className="nav-link">About Us</a>
            <div className="db-status" style={{ display: 'flex', alignItems: 'center', gap: '5px', opacity: 0.7 }}>
              <Database size={14} color={dbStatus === 'connected' ? '#10b981' : 'currentColor'} />
              <span style={{ fontSize: '12px' }}>{dbStatus.toUpperCase()}</span>
            </div>
            <a href="#" className="btn btn-primary" style={{ padding: '8px 20px' }}>Contact Us</a>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="hero bg-dark">
          <div className="container hero-grid">
            <div>
              <Reveal>
                <h1 className="hero-title">Elevate Your Performance with Science</h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="hero-subtitle">
                  We merge cutting-edge data analytics, biomechanics, and sports physiology to unlock your true athletic potential. Professional sports science, now available to you.
                </p>
              </Reveal>
              <Reveal delay={0.4}>
                <div className="hero-cta">
                  <a href="#" className="btn btn-primary">Start Your Journey</a>
                  <a href="#" className="btn btn-outline">Our Services</a>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.3}>
              <div className="hero-image-wrapper">
                <img src={heroImage} alt="Sports Science Laboratory" className="hero-image" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about-us" className="about-section">
          <div className="container">
            <div className="about-grid">
              <Reveal>
                <div>
                  <div className="about-label">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    About us
                  </div>
                  <h2 className="about-title">
                    We're an experienced and elite sports science provider, with top-class athletic development at the very centre of our practice.
                  </h2>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div style={{ paddingTop: '12px' }}>
                  <p className="about-text">
                    With a comprehensive performance process, designed to incorporate advanced biomechanics whilst meeting the needs and expectations of athletes across the sporting spectrum, we have a full service range on offer to manage any of your requirements within the end-to-end process.
                  </p>
                  <a href="#" className="btn-black">ABOUT US</a>
                  
                  <div className="trust-badge-wrapper">
                    <div className="trust-badge">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="trust-badge-icon" />
                      <div className="trust-badge-content">
                        <div className="trust-badge-title">
                          Top Rated Service <span className="trust-badge-stars">★★★★★</span>
                        </div>
                        <div className="trust-badge-verify">
                          <ShieldCheck size={12} color="#10b981" /> Verified by <strong>Trustindex</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section">
          <div className="container">
            <Reveal>
              <div className="services-header">
                <div className="services-label">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Our services
                </div>
                <h2 className="services-title">
                  We offer a range of sports science services
                </h2>
              </div>
            </Reveal>

            <div className="services-image-grid">
              {/* Card 1 */}
              <Reveal delay={0.1}>
                <div className="service-img-card">
                  <div className="service-img-bg" style={{ backgroundImage: `url(${servicePhysio})` }}></div>
                  <div className="service-img-overlay"></div>
                  <div className="service-img-content">
                    <h3 className="service-img-title">Physiotherapy</h3>
                    <div className="service-img-bottom">
                      <p className="service-img-desc">Comprehensive rehabilitation and manual therapy to treat injuries and restore optimal mobility and function.</p>
                      <a href="#" className="btn-white">LEARN MORE</a>
                    </div>
                  </div>
                </div>
              </Reveal>
              
              {/* Card 2 */}
              <Reveal delay={0.2}>
                <div className="service-img-card">
                  <div className="service-img-bg" style={{ backgroundImage: `url(${serviceStrength})` }}></div>
                  <div className="service-img-overlay"></div>
                  <div className="service-img-content">
                    <h3 className="service-img-title">Strength &<br/>Conditioning</h3>
                    <div className="service-img-bottom">
                      <p className="service-img-desc">Elite physical preparation programs tailored to your specific sport to maximize power, speed, and endurance.</p>
                      <a href="#" className="btn-white">LEARN MORE</a>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Card 3 */}
              <Reveal delay={0.3}>
                <div className="service-img-card">
                  <div className="service-img-bg" style={{ backgroundImage: `url(${serviceBiomechanics})` }}></div>
                  <div className="service-img-overlay"></div>
                  <div className="service-img-content">
                    <h3 className="service-img-title">Biomechanics</h3>
                    <div className="service-img-bottom">
                      <p className="service-img-desc">Advanced 3D motion capture and force plate analysis to optimize technique and identify injury risks.</p>
                      <a href="#" className="btn-white">LEARN MORE</a>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Card 4 */}
              <Reveal delay={0.4}>
                <div className="service-img-card">
                  <div className="service-img-bg" style={{ backgroundImage: `url(${servicePsychology})` }}></div>
                  <div className="service-img-overlay"></div>
                  <div className="service-img-content">
                    <h3 className="service-img-title">Psychology</h3>
                    <div className="service-img-bottom">
                      <p className="service-img-desc">Mental conditioning, performance anxiety management, and cognitive strategies for peak competitive focus.</p>
                      <a href="#" className="btn-white">LEARN MORE</a>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section bg-dark">
          <div className="container hero-grid">
            <Reveal>
              <div>
                <img src={heroImage} alt="Performance Tracking" style={{ width: '100%', borderRadius: 'var(--radius-lg)', opacity: 0.8 }} />
              </div>
            </Reveal>
            <div>
              <Reveal>
                <h2 className="section-title">Why Choose CSS?</h2>
                <p className="section-subtitle">We don't guess. We measure, analyze, and execute with precision.</p>
              </Reveal>
              <div className="values-grid">
                <Reveal delay={0.1}>
                  <div className="value-item">
                    <div className="value-icon-wrapper"><TrendingUp size={24} /></div>
                    <div className="value-content">
                      <h3>Data-Driven</h3>
                      <p>Every decision is backed by comprehensive physiological data.</p>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.2}>
                  <div className="value-item">
                    <div className="value-icon-wrapper"><ShieldCheck size={24} /></div>
                    <div className="value-content">
                      <h3>Injury Prevention</h3>
                      <p>Proactive protocols to keep you in the game longer.</p>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="value-item">
                    <div className="value-icon-wrapper"><Activity size={24} /></div>
                    <div className="value-content">
                      <h3>Elite Facilities</h3>
                      <p>State-of-the-art labs and recovery equipment.</p>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.4}>
                  <div className="value-item">
                    <div className="value-icon-wrapper"><Users size={24} /></div>
                    <div className="value-content">
                      <h3>Expert Team</h3>
                      <p>World-class sports scientists and physiotherapists.</p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section">
          <div className="container">
            <div className="stats-grid">
              <Reveal delay={0.1}>
                <div className="stat-item">
                  <div className="stat-number">10k+</div>
                  <div className="stat-label">Athletes Analyzed</div>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="stat-item">
                  <div className="stat-number">5</div>
                  <div className="stat-label">Advanced Labs</div>
                </div>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="stat-item">
                  <div className="stat-number">98%</div>
                  <div className="stat-label">Recovery Rate</div>
                </div>
              </Reveal>
              <Reveal delay={0.4}>
                <div className="stat-item">
                  <div className="stat-number">20+</div>
                  <div className="stat-label">Olympic Medals</div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
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
                <li><a href="#">Amateur Training</a></li>
                <li><a href="#">Professional Recovery</a></li>
                <li><a href="#">Elite Biomechanics</a></li>
                <li><a href="#">Nutritional Planning</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul className="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Our Team</a></li>
                <li><a href="#">Facilities</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <ul className="footer-links">
                <li><a href="#">Get in Touch</a></li>
                <li><a href="#">Book a Consultation</a></li>
                <li><a href="#">Location Map</a></li>
                <li><a href="#">Support</a></li>
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
    </div>
  );
};

export default App;
