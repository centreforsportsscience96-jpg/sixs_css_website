import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, Activity, Users } from 'lucide-react';
import heroImage from '../assets/hero_image.png';
import servicePhysio from '../assets/service_physio.png';
import serviceStrength from '../assets/service_strength.png';
import serviceBiomechanics from '../assets/service_biomechanics.png';
import servicePsychology from '../assets/service_psychology.png';

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

const Home = () => {
  return (
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
                <Link to="/contact" className="btn btn-primary">Start Your Journey</Link>
                <Link to="/services" className="btn btn-outline">Our Services</Link>
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
                    <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
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
                <Link to="/services" className="btn-black">ABOUT US</Link>
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
                  <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
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
                    <Link to="/services" className="btn-white">LEARN MORE</Link>
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
                  <h3 className="service-img-title">Strength &<br />Conditioning</h3>
                  <div className="service-img-bottom">
                    <p className="service-img-desc">Elite physical preparation programs tailored to your specific sport to maximize power, speed, and endurance.</p>
                    <Link to="/services" className="btn-white">LEARN MORE</Link>
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
                    <Link to="/services" className="btn-white">LEARN MORE</Link>
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
                    <Link to="/services" className="btn-white">LEARN MORE</Link>
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
  );
};

export default Home;
