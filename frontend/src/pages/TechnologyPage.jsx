import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Seo from '../components/Seo';

const Reveal = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const SENAPTEC_MODULES = [
  'Visual Clarity — static visual acuity',
  'Contrast Sensitivity — distinguishing fine light/dark increments',
  'Depth Perception — distance judgment between objects',
  'Near-Far Quickness — eye focusing from near to far targets',
  'Multiple Object Tracking — tracking several moving targets at once',
  'Perception Span — spatial memory and recall',
  'Go/No-Go — decision-making under time pressure',
  'Reaction Time — simple and choice reaction time',
  'Eye-Hand Coordination — visual/motor response synchronisation',
  'Target Capture — speed and precision engaging multiple stimuli',
];

const TechnologyPage = () => {
  return (
    <motion.main
      className="page-wrapper"
      style={{ paddingTop: '120px', minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <Seo
        title="Sports Science Technology - Force Plates, Mendi Neurofeedback & Senaptec | Centre For Sports Science"
        description="Explore the technology behind Centre For Sports Science: force plate biomechanics, Mendi neurofeedback, Senaptec sensory testing, and wearable-based athlete monitoring in Bangalore."
        path="/technology"
      />

      {/* Header Section */}
      <section className="container" style={{ marginBottom: '80px' }}>
        <Reveal>
          <div className="about-label">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Our Technology
          </div>
          <h1 className="hero-title" style={{ color: 'var(--primary-dark)', fontSize: 'clamp(32px, 6vw, 56px)', maxWidth: '900px', marginBottom: '24px' }}>
            The Sports Science Technology Behind Every Assessment
          </h1>
          <p className="about-text" style={{ maxWidth: '800px', fontSize: '20px' }}>
            From force plates to neurofeedback, every recommendation we make is backed by measurable data, not guesswork. Here's the technology stack we use to assess, train, and monitor athletes at Centre For Sports Science.
          </p>
        </Reveal>
      </section>

      {/* Core Technology Overview */}
      <section className="bg-dark" style={{ padding: '80px 0' }}>
        <div className="container">
          <Reveal>
            <h2 className="section-title" style={{ color: 'white', marginBottom: '40px' }}>Our Technology Stack</h2>
          </Reveal>
          <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' }}>
            <Reveal delay={0.1}>
              <div className="core-service-box">
                <h3 style={{ color: 'var(--accent)', marginBottom: '12px', fontSize: '20px' }}>Force Plate & Biomechanics</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>Ground reaction force, rate of force development, and jump profiling to catch injury risk before it happens.</p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="core-service-box">
                <h3 style={{ color: 'var(--accent)', marginBottom: '12px', fontSize: '20px' }}>Mendi Neurofeedback</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>Real-time brain-training technology for focus, stress regulation, and mental endurance.</p>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="core-service-box">
                <h3 style={{ color: 'var(--accent)', marginBottom: '12px', fontSize: '20px' }}>Senaptec Sensory Station</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>10 modules testing visual, cognitive, and sensorimotor performance.</p>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="core-service-box">
                <h3 style={{ color: 'var(--accent)', marginBottom: '12px', fontSize: '20px' }}>Wearable Readiness Tracking</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>Daily HRV and recovery monitoring compatible with WHOOP, Oura, and Polar.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Detailed Sections */}
      <section style={{ backgroundColor: 'white', padding: '100px 0' }}>
        <div className="container">
          <Reveal>
            <div className="package-category">
              <h2 className="category-title">Force Plate & Motion Capture Analysis</h2>
              <p className="about-text" style={{ maxWidth: '800px' }}>
                Every jump, sprint, and landing is measured, not estimated. Our force plate and motion capture systems quantify exactly how an athlete moves and produces force.
              </p>
              <ul className="package-features" style={{ maxWidth: '600px' }}>
                <li><Check size={16} /> Ground Reaction Force (GRF) and Rate of Force Development (RFD)</li>
                <li><Check size={16} /> Limb asymmetry and left/right power balance</li>
                <li><Check size={16} /> Jump profiling — Countermovement Jump, Squat Jump, Drop Jump</li>
                <li><Check size={16} /> Landing mechanics analysis for injury prediction</li>
              </ul>
            </div>
          </Reveal>

          <Reveal>
            <div className="package-category" style={{ marginTop: '100px' }}>
              <h2 className="category-title">Mendi Neurofeedback Training</h2>
              <p className="about-text" style={{ maxWidth: '800px' }}>
                Mendi tracks and trains brain function through real-time neurofeedback, helping athletes build the mental skills that matter under pressure.
              </p>
              <ul className="package-features" style={{ maxWidth: '600px' }}>
                <li><Check size={16} /> Focus and attention stability (frontal cortex blood flow)</li>
                <li><Check size={16} /> Stress regulation patterns (hemodynamic response)</li>
                <li><Check size={16} /> Brain endurance under sustained cognitive load</li>
                <li><Check size={16} /> Real-time neurofeedback with session-by-session improvement tracking</li>
              </ul>
            </div>
          </Reveal>

          <Reveal>
            <div className="package-category" style={{ marginTop: '100px' }}>
              <h2 className="category-title">Senaptec Sensory Station</h2>
              <p className="about-text" style={{ maxWidth: '800px' }}>
                A 10-module battery assessing the visual, cognitive, and sensorimotor skills that separate good athletes from great ones.
              </p>
              <div className="package-grid">
                <div className="package-card">
                  <ul className="package-features">
                    {SENAPTEC_MODULES.slice(0, 5).map((m) => (
                      <li key={m}><Check size={16} /> {m}</li>
                    ))}
                  </ul>
                </div>
                <div className="package-card">
                  <ul className="package-features">
                    {SENAPTEC_MODULES.slice(5).map((m) => (
                      <li key={m}><Check size={16} /> {m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="package-category" style={{ marginTop: '100px' }}>
              <h2 className="category-title">Wearable Readiness & Recovery Tracking</h2>
              <p className="about-text" style={{ maxWidth: '800px' }}>
                Training doesn't stop at the door. We track daily readiness so training load can be adjusted before overtraining or injury becomes a problem.
              </p>
              <ul className="package-features" style={{ maxWidth: '600px' }}>
                <li><Check size={16} /> Morning HRV and resting heart rate tracking — compatible with WHOOP, Oura, and Polar</li>
                <li><Check size={16} /> Sleep quality input from wearables</li>
                <li><Check size={16} /> Box breathing and 4-7-8 technique for parasympathetic recovery</li>
                <li><Check size={16} /> Post-exertion breathing protocols for faster recovery</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </motion.main>
  );
};

export default TechnologyPage;
