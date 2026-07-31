import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, Activity, Users } from 'lucide-react';
import Seo from '../components/Seo';
import Counter from '../components/Counter';
import heroImage from '../assets/hero_image.jpg';
import servicePhysio from '../assets/service_physio.jpg';
import serviceStrength from '../assets/service_strength.jpeg';
import servicePsychology from '../assets/service_psychology.jpg';
import serviceBiomechanics from '../assets/service_biomechanics.jpeg';
import serviceNutrition from '../assets/service_nutrition.jpg';

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

const HERO_SLIDES = [
  { src: heroImage, alt: 'Sports physiotherapy and performance science laboratory in Bangalore' },
  { src: servicePhysio, alt: 'Physiotherapist treating an athlete at Centre For Sports Science, Bangalore' },
  { src: serviceStrength, alt: 'Strength and conditioning training session in Bangalore' },
  { src: serviceBiomechanics, alt: 'Biomechanics motion analysis and injury risk assessment' },
  { src: serviceNutrition, alt: 'Sports nutrition consultation at Centre For Sports Science' },
];

const HeroBackground = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hero-bg-wrapper">
      {HERO_SLIDES.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className={`hero-bg-image${i === index ? ' active' : ''}`}
        />
      ))}
      <div className="hero-bg-overlay" />
    </div>
  );
};

const Home = () => {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <Seo
        title="Physiotherapy, Strength & Conditioning & Nutrition in Bangalore | Centre For Sports Science"
        description="Centre For Sports Science is Bangalore's integrated sports physiotherapy, strength & conditioning, nutrition, biomechanics and sports psychology clinic at Sree Kanteerava Stadium. Book your consultation today."
        path="/"
      />
      {/* Hero Section */}
      <section className="hero bg-dark hero-fullbleed">
        <HeroBackground />
        <div className="container">
          <div className="hero-content">
            <Reveal>
              <h1 className="hero-title">Bangalore's Trusted Sports Physiotherapy, Strength & Conditioning and Nutrition Experts</h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="hero-subtitle">
                Based at Sree Kanteerava Stadium, Bangalore, we merge cutting-edge data analytics, biomechanics, sports physiology and nutrition science to unlock your true athletic potential. Professional sports science, now available near you.
              </p>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="hero-cta">
                <Link to="/contact" className="btn btn-primary">Start Your Journey</Link>
                <Link to="/services" className="btn btn-outline">Our Services</Link>
              </div>
            </Reveal>
          </div>
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
                  Bangalore's experienced and elite sports science provider, with top-class athletic development at the very centre of our practice.
                </h2>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div style={{ paddingTop: '12px' }}>
                <p className="about-text">
                  Located at Sree Kanteerava Stadium in Bangalore, we bring together sports physiotherapy, strength & conditioning, sports nutrition, biomechanics and sports psychology under one roof. If you're searching for physiotherapy near me, strength & conditioning near me, or a nutritionist near me in Bangalore, our multidisciplinary team manages your requirements end-to-end using measurable, data-driven methods.
                </p>
                <p className="about-text">
                  Our mission is to empower athletes and institutions with data-driven tools that help identify, train, and support every athlete through scientific, sustainable, and intelligent systems.
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
                Physiotherapy, Strength & Conditioning, Nutrition and more &mdash; all in Bangalore
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
                    <p className="service-img-desc">Advanced motion analysis and force plate testing to optimize technique and identify injury risks.</p>
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

            {/* Card 5 */}
            <Reveal delay={0.5}>
              <div className="service-img-card">
                <div className="service-img-bg" style={{ backgroundImage: `url(${serviceNutrition})` }}></div>
                <div className="service-img-overlay"></div>
                <div className="service-img-content">
                  <h3 className="service-img-title">Nutrition</h3>
                  <div className="service-img-bottom">
                    <p className="service-img-desc">Personalized sports nutrition and diet planning to fuel performance, speed up recovery, and support long-term athlete health.</p>
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
              <img src={heroImage} alt="Athlete performance tracking and sports science monitoring" style={{ width: '100%', borderRadius: 'var(--radius-lg)', opacity: 0.8 }} />
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

      {/* Leadership Section */}
      <section id="our-director" className="section bg-light">
        <div className="container">
          <Reveal>
            <div className="about-label">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Our Leadership
            </div>
            <p style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 600, marginTop: '12px' }}>
              "Realizing Talent through Scientific Methodology"
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: '24px' }}>
              <div
                style={{
                  flexShrink: 0,
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--accent) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '32px',
                  fontWeight: 700,
                }}
              >
                AC
              </div>
              <div style={{ flex: 1, minWidth: '260px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>Antony Chacko</h3>
                <p style={{ color: 'var(--accent)', fontWeight: 600, marginBottom: '16px' }}>Director, Centre For Sports Science</p>
                <p className="about-text">
                  Antony Chacko brings a rare blend of sports and technology expertise to Centre For Sports Science. A former Karnataka cricket team player, he went on to build a career in software engineering and as a Technical Lead at Microsoft (EMEA), developing deep expertise in data analytics. For the past four years, he has directed the Sports Science Centre, leading national talent identification initiatives with the Department of Youth Empowerment and Sports, training over 7,500 PE teachers through Train-the-Trainer workshops, and driving CSR programs that have reached 100+ schools and over 1 lakh students across Karnataka.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Partnerships Section */}
      <section className="section">
        <div className="container">
          <Reveal>
            <h2 className="section-title" style={{ textAlign: 'center', fontSize: '28px', marginBottom: '8px' }}>Trusted By</h2>
            <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto 40px' }}>Recognised as a Sports Science Knowledge Partner by leading institutions</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
              {[
                'Government of Karnataka',
                'Delhi Sports University',
                'Government of Meghalaya',
                'Bhaichung Bhutia Football Academy',
                'Basavanagudi Aquatic Centre',
              ].map((partner) => (
                <div
                  key={partner}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '9999px',
                    border: '1px solid #e2e8f0',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    backgroundColor: 'var(--bg-light)',
                  }}
                >
                  {partner}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="about-text" style={{ textAlign: 'center', maxWidth: '700px', margin: '32px auto 0' }}>
              As Sports Science Partner for the Government of Meghalaya, our team has helped train high-performance athletes across the North East region, contributing to 10+ medal wins at the North East Olympics — part of what has grown into India's largest talent identification and athlete performance database.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section">
        <div className="container">
          <div className="stats-grid">
            <Reveal delay={0.1}>
              <div className="stat-item">
                <div className="stat-number"><Counter to={35} suffix="k+" /></div>
                <div className="stat-label">Athletes Assessed</div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="stat-item">
                <div className="stat-number"><Counter to={60} suffix="%" /></div>
                <div className="stat-label">Performance Improvement</div>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="stat-item">
                <div className="stat-number"><Counter to={40} suffix="%" /></div>
                <div className="stat-label">Injury Reduction</div>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="stat-item">
                <div className="stat-number"><Counter to={7500} suffix="+" /></div>
                <div className="stat-label">Coaches & PE Teachers Trained</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </motion.main>
  );
};

export default Home;
