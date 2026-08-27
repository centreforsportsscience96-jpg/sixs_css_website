import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
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

const SERVICES = {
  physiotherapy: {
    title: 'Sports Physiotherapy',
    tagline: 'Comprehensive rehabilitation and manual therapy to treat injuries and restore optimal mobility and function.',
    description: "Evidence-based injury treatment and rehabilitation, from first assessment through to full return-to-play — every plan built around measurable progress, not guesswork.",
    seoTitle: 'Sports Physiotherapy in Bangalore | Centre For Sports Science',
    seoDescription: 'Sports physiotherapy and rehabilitation packages at Centre For Sports Science, Sree Kanteerava Stadium, Bangalore. Consultation, 1-week, 15-day and 1-month rehab programs.',
    packages: [
      {
        name: 'Package 1: Consultation & Treatment',
        price: '1xxx',
        priceNote: '+ GST',
        subPrice: 'Follow-up sessions: 8xx per session',
        features: [
          'Detailed injury & movement assessment',
          'Sports-specific orthopedic testing',
          'Pain relief & manual therapy',
          'Corrective and rehab exercises',
          'Injury education & recovery roadmap',
        ],
        ideal: 'Perfect for pain relief, injury diagnosis, and early rehab.',
      },
      {
        name: 'Package 2: 1-Week Rehabilitation',
        price: '5xxx',
        features: [
          'Initial assessment & rehab planning',
          'Multiple supervised physiotherapy sessions',
          'Pain reduction, mobility & activation drills',
          'Early strengthening protocols',
          'Continuous progress monitoring',
        ],
        ideal: 'Best for short-term injuries and quick recovery needs.',
      },
      {
        name: 'Package 3: 15-Day Rehabilitation',
        price: '1xxxx',
        features: [
          'Comprehensive biomechanical assessment',
          'Structured rehabilitation progression',
          'Strength, mobility & movement retraining',
          'Sports-specific functional exercises',
          'Return-to-activity guidance',
        ],
        ideal: 'Ideal for sub-acute injuries and performance-focused rehab.',
      },
      {
        name: 'Package 4: 1-Month Rehabilitation',
        price: '2xxxx',
        premium: true,
        features: [
          'Detailed assessment & goal setting',
          'Long-term rehab & performance plan',
          'Progressive strength & neuromuscular training',
          'Sports-specific conditioning',
          'Injury prevention strategies',
          'Regular reassessment & progression tracking',
        ],
        ideal: 'Best for chronic injuries, post-surgery rehab, and competitive athletes.',
      },
    ],
  },
  'strength-conditioning': {
    title: 'Strength & Conditioning',
    tagline: 'Elite physical preparation programs tailored to your specific sport to maximize power, speed, and endurance.',
    description: 'Structured strength and conditioning programming built around your sport, your goals, and your training phase — not a generic gym routine.',
    seoTitle: 'Strength & Conditioning in Bangalore | Centre For Sports Science',
    seoDescription: 'Sport-specific strength & conditioning packages at Centre For Sports Science, Sree Kanteerava Stadium, Bangalore. 1-day sessions, 1, 3 and 6 month programs.',
    packages: [
      {
        name: 'S&C – 1 Day Session',
        price: '1xxx',
        features: [
          'Performance assessment',
          'Strength / Power / Conditioning workout',
          'Technique correction & coaching',
          'Sport-specific training focus',
        ],
        ideal: 'Try before committing. Train with intent.',
      },
      {
        name: 'S&C – 1 Month Package',
        price: '1xxxx',
        features: [
          'Full physical performance assessment',
          'Customized strength & conditioning program',
          'Speed, agility, power & endurance training',
          'Mobility & recovery integration',
          'Weekly monitoring & load management',
        ],
        ideal: 'Build strength, speed, and durability.',
      },
      {
        name: 'S&C – 3 Month Package',
        price: '4xxxx',
        badge: '10% OFF',
        features: ['All features of the 1-month package with extended programming and greater long-term adaptation.'],
      },
      {
        name: 'S&C – 6 Month Package',
        price: '9xxxx',
        badge: '20% OFF',
        features: ['Comprehensive long-term athletic development with maximum discount applied.'],
      },
    ],
  },
  nutrition: {
    title: 'Sports Nutrition',
    tagline: 'Personalized sports nutrition and diet planning to fuel performance, speed up recovery, and support long-term athlete health.',
    description: 'Nutrition guidance built around your training load, competition schedule, and recovery needs — not a one-size-fits-all diet sheet.',
    seoTitle: 'Sports Nutrition in Bangalore | Centre For Sports Science',
    seoDescription: 'Sports nutrition consultation and personalized diet plans at Centre For Sports Science, Sree Kanteerava Stadium, Bangalore.',
    packages: [
      {
        name: 'Nutrition Consultation',
        price: '1xxx',
        features: [
          'Detailed dietary & lifestyle assessment',
          'Body composition & nutrient analysis',
          'Sport-specific fueling strategy',
          'Hydration & recovery nutrition guidance',
        ],
        ideal: 'Perfect for athletes wanting a personalized diet baseline.',
      },
      {
        name: 'Nutrition Plan – 1 Month',
        price: '8xxx',
        premium: true,
        features: [
          'Fully customized meal & macro plan',
          'Performance & recovery focused nutrition',
          'Weekly progress check-ins',
          'Supplement guidance where needed',
        ],
        ideal: 'Best for athletes training toward a specific competition or goal.',
      },
    ],
  },
  biomechanics: {
    title: 'Biomechanics',
    tagline: 'Advanced motion analysis and force plate testing to optimize technique and identify injury risks.',
    description: 'Fix the Movement. Protect the Body. Unlock Performance. Every assessment is measured with force plates and motion capture, not visual guesswork.',
    seoTitle: 'Biomechanics Assessment in Bangalore | Centre For Sports Science',
    seoDescription: 'Sport-specific biomechanical testing, force plate analysis and movement screening at Centre For Sports Science, Sree Kanteerava Stadium, Bangalore.',
    packages: [
      {
        name: 'Biomechanics Assessment',
        price: '5xxx',
        premium: true,
        features: [
          'Sport-specific biomechanical testing',
          'Technique & movement efficiency analysis',
          'Injury risk identification',
          'Performance optimization recommendations',
          'Actionable report integrated with rehab or S&C',
        ],
      },
    ],
  },
  psychology: {
    title: 'Sports Psychology',
    tagline: 'Mental conditioning, performance anxiety management, and cognitive strategies for peak competitive focus.',
    description: 'Train the Mind That Wins Matches. Because physical talent fails without mental readiness.',
    seoTitle: 'Sports Psychology Testing in Bangalore | Centre For Sports Science',
    seoDescription: 'Sports psychology testing and mental performance training at Centre For Sports Science, Sree Kanteerava Stadium, Bangalore.',
    packages: [
      {
        name: 'Sports Psychology Testing',
        price: '2xxx',
        features: [
          'Focus and attention control',
          'Competitive anxiety & stress response',
          'Confidence and self-belief',
          'Motivation and goal orientation',
          'Emotional regulation under pressure',
          'Mental fatigue & recovery readiness',
          'Standardized sports psychology testing tools',
          'Athlete profiling report (strengths & improvement areas)',
          'Practical mental training recommendations',
        ],
        ideal: 'Because physical talent fails without mental readiness.',
      },
    ],
  },
};

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const service = SERVICES[slug];

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  return (
    <motion.main
      className="page-wrapper"
      style={{ paddingTop: '120px', minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <Seo title={service.seoTitle} description={service.seoDescription} path={`/services/${slug}`} />

      {/* Header */}
      <section className="container" style={{ marginBottom: '60px' }}>
        <Reveal>
          <div className="about-label">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <Link to="/services" style={{ color: 'inherit', textDecoration: 'none' }}>Back to all services</Link>
          </div>
          <h1 className="hero-title" style={{ color: 'var(--primary-dark)', fontSize: 'clamp(32px, 6vw, 56px)', maxWidth: '900px', marginBottom: '24px' }}>
            {service.title}
          </h1>
          <p className="about-text" style={{ maxWidth: '800px', fontSize: '20px' }}>{service.tagline}</p>
          <p className="about-text" style={{ maxWidth: '800px' }}>{service.description}</p>
          <Link to="/contact" className="btn btn-primary">Book a Consultation</Link>
        </Reveal>
      </section>

      {/* Packages */}
      <section style={{ backgroundColor: 'white', padding: '60px 0 100px' }}>
        <div className="container">
          <Reveal>
            <h2 className="category-title">{service.title} Packages</h2>
            <div className="package-grid">
              {service.packages.map((pkg) => (
                <div key={pkg.name} className={`package-card${pkg.premium ? ' premium-card' : ''}`}>
                  <h3>{pkg.name}</h3>
                  <div className="price">
                    {pkg.price}
                    {pkg.priceNote && <span> {pkg.priceNote}</span>}
                    {pkg.badge && <span className="discount-badge">{pkg.badge}</span>}
                  </div>
                  {pkg.subPrice && <div className="sub-price">{pkg.subPrice}</div>}
                  <ul className="package-features">
                    {pkg.features.map((f) => (
                      <li key={f}><Check size={16} /> {f}</li>
                    ))}
                  </ul>
                  {pkg.ideal && <div className="package-ideal">{pkg.ideal}</div>}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </motion.main>
  );
};

export default ServiceDetailPage;
