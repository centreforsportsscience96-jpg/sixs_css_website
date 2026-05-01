import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

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

const ServicesPage = () => {
  return (
    <main className="page-wrapper" style={{ paddingTop: '120px', minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}>
      
      {/* Header Section */}
      <section className="container" style={{ marginBottom: '80px' }}>
        <Reveal>
          <div className="about-label">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            About the Center
          </div>
          <h1 className="hero-title" style={{ color: 'var(--primary-dark)', fontSize: '56px', maxWidth: '900px', marginBottom: '24px' }}>
            Fully integrated, data-driven performance model
          </h1>
          <p className="about-text" style={{ maxWidth: '800px', fontSize: '20px' }}>
            The Center for Sports Science delivers a fully integrated, data-driven performance model combining sports physiotherapy, biomechanics, strength & conditioning, and sports psychology. We don't just treat injuries — we build resilient, confident, high-performing athletes using measurable scientific parameters.
          </p>
        </Reveal>
      </section>

      {/* Core Services Overview */}
      <section className="bg-dark" style={{ padding: '80px 0' }}>
        <div className="container">
          <Reveal>
            <h2 className="section-title" style={{ color: 'white', marginBottom: '40px' }}>Our Services</h2>
          </Reveal>
          <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
            <Reveal delay={0.1}>
              <div className="core-service-box">
                <h3 style={{ color: 'var(--accent)', marginBottom: '12px', fontSize: '20px' }}>Sports Physiotherapy</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>Evidence-based injury treatment and rehabilitation.</p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="core-service-box">
                <h3 style={{ color: 'var(--accent)', marginBottom: '12px', fontSize: '20px' }}>Biomechanics</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>Movement analysis and performance optimization.</p>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="core-service-box">
                <h3 style={{ color: 'var(--accent)', marginBottom: '12px', fontSize: '20px' }}>Strength & Conditioning</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>Physical development and athletic performance.</p>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="core-service-box">
                <h3 style={{ color: 'var(--accent)', marginBottom: '12px', fontSize: '20px' }}>Sports Psychology</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>Mental training and competitive readiness.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Pricing Table Section */}
      <section className="container" style={{ padding: '100px 24px' }}>
        <Reveal>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '48px' }}>Price Comparison Table</h2>
          <div className="table-responsive">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Duration</th>
                  <th>Key Focus</th>
                  <th>Price (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Physio Consultation</td><td>Single session</td><td>Assessment & treatment</td><td>₹1,000 + GST</td></tr>
                <tr><td>Follow-up Physio</td><td>Per session</td><td>Continued care</td><td>₹800</td></tr>
                <tr><td>Rehab Package</td><td>1 Week</td><td>Pain & activation</td><td>₹5,500</td></tr>
                <tr><td>Rehab Package</td><td>15 Days</td><td>Strength & movement control</td><td>₹11,500</td></tr>
                <tr><td>Rehab Package</td><td>1 Month</td><td>Full rehab & prevention</td><td>₹21,000</td></tr>
                <tr><td>Biomechanics Assessment</td><td>Sport-specific testing</td><td>Movement & injury risk</td><td>₹5,000</td></tr>
                <tr><td>Sports Psychology Testing</td><td>Psychological profiling</td><td>Mental performance</td><td>₹2,000</td></tr>
                <tr><td>S&C Session</td><td>1 Day</td><td>Strength & power</td><td>₹1,000</td></tr>
                <tr><td>S&C Package</td><td>1 Month</td><td>Speed, strength & conditioning</td><td>₹15,000</td></tr>
                <tr><td>S&C Package</td><td>3 Month</td><td>Speed, strength & conditioning</td><td><span className="discount">₹45,000 (10% OFF)</span></td></tr>
                <tr><td>S&C Package</td><td>6 Month</td><td>Speed, strength & conditioning</td><td><span className="discount">₹90,000 (20% OFF)</span></td></tr>
                <tr className="highlight-row"><td>Integrated Performance Package</td><td>Multidisciplinary</td><td>Physio + S&C + Psychology</td><td>₹20,000</td></tr>
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* Detailed Packages */}
      <section style={{ backgroundColor: 'white', padding: '100px 0' }}>
        <div className="container">
          
          <Reveal>
            <div className="package-category">
              <h2 className="category-title">Physiotherapy & Rehabilitation Packages</h2>
              
              <div className="package-grid">
                <div className="package-card">
                  <h3>Package 1: Consultation & Treatment</h3>
                  <div className="price">₹1,000 <span>+ GST</span></div>
                  <div className="sub-price">Follow-up sessions: ₹800 per session</div>
                  <ul className="package-features">
                    <li><Check size={16}/> Detailed injury & movement assessment</li>
                    <li><Check size={16}/> Sports-specific orthopedic testing</li>
                    <li><Check size={16}/> Pain relief & manual therapy</li>
                    <li><Check size={16}/> Corrective and rehab exercises</li>
                    <li><Check size={16}/> Injury education & recovery roadmap</li>
                  </ul>
                  <div className="package-ideal">Perfect for pain relief, injury diagnosis, and early rehab.</div>
                </div>

                <div className="package-card">
                  <h3>Package 2: 1-Week Rehabilitation</h3>
                  <div className="price">₹5,500</div>
                  <ul className="package-features">
                    <li><Check size={16}/> Initial assessment & rehab planning</li>
                    <li><Check size={16}/> Multiple supervised physiotherapy sessions</li>
                    <li><Check size={16}/> Pain reduction, mobility & activation drills</li>
                    <li><Check size={16}/> Early strengthening protocols</li>
                    <li><Check size={16}/> Continuous progress monitoring</li>
                  </ul>
                  <div className="package-ideal">Best for short-term injuries and quick recovery needs.</div>
                </div>
              </div>

              <h3 style={{ marginTop: '64px', marginBottom: '32px', fontSize: '28px' }}>Advanced Rehabilitation Programs</h3>
              <div className="package-grid">
                <div className="package-card">
                  <h3>Package 3: 15-Day Rehabilitation</h3>
                  <div className="price">₹11,500</div>
                  <ul className="package-features">
                    <li><Check size={16}/> Comprehensive biomechanical assessment</li>
                    <li><Check size={16}/> Structured rehabilitation progression</li>
                    <li><Check size={16}/> Strength, mobility & movement retraining</li>
                    <li><Check size={16}/> Sports-specific functional exercises</li>
                    <li><Check size={16}/> Return-to-activity guidance</li>
                  </ul>
                  <div className="package-ideal">Ideal for sub-acute injuries and performance-focused rehab.</div>
                </div>

                <div className="package-card premium-card">
                  <h3>Package 4: 1-Month Rehabilitation</h3>
                  <div className="price">₹21,000</div>
                  <ul className="package-features">
                    <li><Check size={16}/> Detailed assessment & goal setting</li>
                    <li><Check size={16}/> Long-term rehab & performance plan</li>
                    <li><Check size={16}/> Progressive strength & neuromuscular training</li>
                    <li><Check size={16}/> Sports-specific conditioning</li>
                    <li><Check size={16}/> Injury prevention strategies</li>
                    <li><Check size={16}/> Regular reassessment & progression tracking</li>
                  </ul>
                  <div className="package-ideal">Best for chronic injuries, post-surgery rehab, and competitive athletes.</div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="package-category" style={{ marginTop: '100px' }}>
              <div className="premium-banner">
                <h2 style={{ color: 'white' }}>Integrated Performance Training Package</h2>
                <div className="price" style={{ color: 'var(--accent)' }}>₹20,000</div>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>Strength & Conditioning + Physiotherapy + Sports Psychology</p>
                <div className="integrated-features">
                  <div className="int-feature"><strong>Physical Assessment:</strong> Injury risk & movement assessment.</div>
                  <div className="int-feature"><strong>Physiotherapy:</strong> Sports physiotherapy for pain-free performance.</div>
                  <div className="int-feature"><strong>Strength Training:</strong> Structured S&C for physical dominance.</div>
                  <div className="int-feature"><strong>Mental Training:</strong> Sports psychology for focus & mental toughness.</div>
                  <div className="int-feature"><strong>Monitoring:</strong> Integrated athlete monitoring & progression.</div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="package-category" style={{ marginTop: '100px' }}>
              <h2 className="category-title">Strength & Conditioning (S&C) Packages</h2>
              <div className="package-grid">
                <div className="package-card">
                  <h3>S&C – 1 Day Session</h3>
                  <div className="price">₹1,000</div>
                  <ul className="package-features">
                    <li><Check size={16}/> Performance assessment</li>
                    <li><Check size={16}/> Strength / Power / Conditioning workout</li>
                    <li><Check size={16}/> Technique correction & coaching</li>
                    <li><Check size={16}/> Sport-specific training focus</li>
                  </ul>
                  <div className="package-ideal">Try before committing. Train with intent.</div>
                </div>

                <div className="package-card">
                  <h3>S&C – 1 Month Package</h3>
                  <div className="price">₹15,000</div>
                  <ul className="package-features">
                    <li><Check size={16}/> Full physical performance assessment</li>
                    <li><Check size={16}/> Customized strength & conditioning program</li>
                    <li><Check size={16}/> Speed, agility, power & endurance training</li>
                    <li><Check size={16}/> Mobility & recovery integration</li>
                    <li><Check size={16}/> Weekly monitoring & load management</li>
                  </ul>
                  <div className="package-ideal">Build strength, speed, and durability.</div>
                </div>
              </div>
              <div className="package-grid" style={{ marginTop: '32px' }}>
                <div className="package-card">
                  <h3>S&C – 3 Month Package</h3>
                  <div className="price">₹45,000 <span className="discount-badge">10% OFF</span></div>
                  <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>All features of the 1-month package with extended programming and greater long-term adaptation.</p>
                </div>
                <div className="package-card">
                  <h3>S&C – 6 Month Package</h3>
                  <div className="price">₹90,000 <span className="discount-badge">20% OFF</span></div>
                  <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Comprehensive long-term athletic development with maximum discount applied.</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="package-category" style={{ marginTop: '100px' }}>
              <div className="package-grid">
                <div className="package-card premium-card">
                  <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Biomechanics Assessment</h2>
                  <div className="price">₹5,000</div>
                  <p style={{ color: 'var(--accent)', fontWeight: '600', marginBottom: '24px' }}>Fix the Movement. Protect the Body. Unlock Performance.</p>
                  <ul className="package-features">
                    <li><Check size={16}/> Sport-specific biomechanical testing</li>
                    <li><Check size={16}/> Technique & movement efficiency analysis</li>
                    <li><Check size={16}/> Injury risk identification</li>
                    <li><Check size={16}/> Performance optimization recommendations</li>
                    <li><Check size={16}/> Actionable report integrated with rehab or S&C</li>
                  </ul>
                </div>

                <div className="package-card">
                  <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Sports Psychology Testing</h2>
                  <div className="price">₹2,000</div>
                  <p style={{ color: 'var(--accent)', fontWeight: '600', marginBottom: '24px' }}>Train the Mind That Wins Matches.</p>
                  
                  <h4 style={{ marginBottom: '12px' }}>Parameters Analysed:</h4>
                  <ul className="package-features" style={{ marginBottom: '24px' }}>
                    <li><Check size={16}/> Focus and attention control</li>
                    <li><Check size={16}/> Competitive anxiety & stress response</li>
                    <li><Check size={16}/> Confidence and self-belief</li>
                    <li><Check size={16}/> Motivation and goal orientation</li>
                    <li><Check size={16}/> Emotional regulation under pressure</li>
                    <li><Check size={16}/> Mental fatigue & recovery readiness</li>
                  </ul>
                  
                  <h4 style={{ marginBottom: '12px' }}>Includes:</h4>
                  <ul className="package-features">
                    <li><Check size={16}/> Standardized sports psychology testing tools</li>
                    <li><Check size={16}/> Athlete profiling report (Strengths & improvement areas)</li>
                    <li><Check size={16}/> Practical mental training recommendations</li>
                  </ul>
                  
                  <div className="package-ideal" style={{ marginTop: '24px' }}>Because physical talent fails without mental readiness.</div>
                </div>
              </div>
            </div>
          </Reveal>

        </div>
      </section>

    </main>
  );
};

export default ServicesPage;
