import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Check, 
  Phone, 
  Award, 
  Activity, 
  Apple, 
  MapPin, 
  Calendar, 
  Users,
  Sparkles
} from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import servicePhysio from '../assets/service_physio.jpg';
import serviceNutrition from '../assets/service_nutrition.jpg';

const Reveal = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

const InternshipSection = ({ id = 'internships' }) => {
  const whatsappUrl =
    'https://wa.me/919113535733?text=Hi%2C%20I%20am%20interested%20in%20the%20Sports%20Science%20Internship%20Program%20(Physiotherapy%20%2F%20Nutrition)%20at%20Centre%20For%20Sports%20Science.%20Could%20you%20please%20share%20the%20details%20and%20application%20process%3F';

  return (
    <section id={id} className="internship-section">
      <div className="container">
        {/* Section Header */}
        <Reveal>
          <div className="about-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap size={18} />
            Careers & Education
          </div>
          <h2 className="section-title" style={{ fontSize: 'clamp(28px, 4vw, 44px)', maxWidth: '900px', marginBottom: '16px' }}>
            Sports Science Internship & Fellowship Program
          </h2>
          <p className="about-text" style={{ maxWidth: '820px', fontSize: '18px', color: 'var(--text-muted)' }}>
            Gain hands-on clinical and high-performance sports science experience at Bangalore’s premier center located inside Sree Kanteerava Stadium. Work alongside experienced practitioners treating state, national, and Olympic-bound athletes.
          </p>
        </Reveal>

        {/* 2 Main Internship Tracks */}
        <div className="internship-tracks-grid" style={{ marginTop: '48px' }}>
          {/* Track 1: Sports Physiotherapy */}
          <Reveal delay={0.1}>
            <div className="internship-track-card">
              <div 
                className="internship-track-image"
                style={{ backgroundImage: `url(${servicePhysio})` }}
              >
                <div className="internship-track-overlay">
                  <div className="internship-badge">
                    <Activity size={14} style={{ marginRight: '6px' }} />
                    Clinical Track
                  </div>
                  <h3 className="internship-track-title">Sports Physiotherapy & Rehabilitation</h3>
                </div>
              </div>

              <div className="internship-track-body">
                <p className="internship-track-desc">
                  An intensive clinical immersion focused on sports injury evaluation, on-field management, manual therapy, and return-to-sport reconditioning.
                </p>

                <div className="internship-highlights-box">
                  <h4>Key Learning Modules:</h4>
                  <ul className="package-features">
                    <li><Check size={16} color="var(--accent)" /> Detailed orthopedic & movement screen assessment</li>
                    <li><Check size={16} color="var(--accent)" /> Acute pitch-side injury triage & management</li>
                    <li><Check size={16} color="var(--accent)" /> Return-to-play criteria & functional load progression</li>
                    <li><Check size={16} color="var(--accent)" /> Objective biomechanical testing with force plates</li>
                    <li><Check size={16} color="var(--accent)" /> Evidence-based manual therapy & rehabilitation drills</li>
                  </ul>
                </div>

                <div className="internship-pricing-box">
                  <div className="internship-pricing-header">
                    <h4>Fee Structure</h4>
                    <span className="gst-badge">Incl. GST</span>
                  </div>
                  <div className="internship-fee-list">
                    <div className="internship-fee-row">
                      <div className="fee-info">
                        <span className="fee-title">BPT &ndash; Internship</span>
                        <span className="fee-duration">15 Days clinical posting</span>
                      </div>
                      <div className="fee-amount">₹1,770</div>
                    </div>
                    <div className="internship-fee-row">
                      <div className="fee-info">
                        <span className="fee-title">BPT &ndash; Internship</span>
                        <span className="fee-duration">1 Month clinical posting</span>
                      </div>
                      <div className="fee-amount">₹2,950</div>
                    </div>
                    <div className="internship-fee-row">
                      <div className="fee-info">
                        <span className="fee-title">MPT &ndash; Clinical Posting</span>
                        <span className="fee-duration">15 Days clinical posting</span>
                      </div>
                      <div className="fee-amount">₹2,950</div>
                    </div>
                    <div className="internship-fee-row">
                      <div className="fee-info">
                        <span className="fee-title">MPT &ndash; Internship</span>
                        <span className="fee-duration">1 Month advanced internship</span>
                      </div>
                      <div className="fee-amount">₹5,900</div>
                    </div>
                  </div>
                </div>

                <div className="internship-meta">
                  <span className="internship-meta-pill">
                    <Calendar size={14} /> 15 Days / 1 Month
                  </span>
                  <span className="internship-meta-pill">
                    <Users size={14} /> BPT & MPT Students / Interns
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Track 2: Sports Nutrition */}
          <Reveal delay={0.2}>
            <div className="internship-track-card">
              <div 
                className="internship-track-image"
                style={{ backgroundImage: `url(${serviceNutrition})` }}
              >
                <div className="internship-track-overlay">
                  <div className="internship-badge">
                    <Apple size={14} style={{ marginRight: '6px' }} />
                    Performance Track
                  </div>
                  <h3 className="internship-track-title">Sports Nutrition & Performance Dietetics</h3>
                </div>
              </div>

              <div className="internship-track-body">
                <p className="internship-track-desc">
                  Practical exposure to real athlete dietary profiling, periodized fueling for competitions, hydration science, and supplement scrutiny.
                </p>

                <div className="internship-highlights-box">
                  <h4>Key Learning Modules:</h4>
                  <ul className="package-features">
                    <li><Check size={16} color="var(--accent)" /> Body composition analysis & ISAK anthropometric protocols</li>
                    <li><Check size={16} color="var(--accent)" /> Sport-specific macronutrient & micronutrient periodization</li>
                    <li><Check size={16} color="var(--accent)" /> Hydration testing, sweat rate analysis & electrolyte plans</li>
                    <li><Check size={16} color="var(--accent)" /> Competition day fueling, travel nutrition & recovery diets</li>
                    <li><Check size={16} color="var(--accent)" /> Evidence-based ergogenic aids & anti-doping (WADA/NADA) safety</li>
                  </ul>
                </div>

                <div className="internship-pricing-box">
                  <div className="internship-pricing-header">
                    <h4>Fee Structure</h4>
                    <span className="gst-badge">Incl. GST</span>
                  </div>
                  <div className="internship-fee-list">
                    <div className="internship-fee-row">
                      <div className="fee-info">
                        <span className="fee-title">B.Sc &ndash; Internship</span>
                        <span className="fee-duration">1 Month sports nutrition immersion</span>
                      </div>
                      <div className="fee-amount">₹2,950</div>
                    </div>
                    <div className="internship-fee-row">
                      <div className="fee-info">
                        <span className="fee-title">M.Sc &ndash; Internship</span>
                        <span className="fee-duration">1 Month advanced performance nutrition</span>
                      </div>
                      <div className="fee-amount">₹4,720</div>
                    </div>
                  </div>
                </div>

                <div className="internship-meta">
                  <span className="internship-meta-pill">
                    <Calendar size={14} /> 1 Month
                  </span>
                  <span className="internship-meta-pill">
                    <Users size={14} /> B.Sc & M.Sc Nutrition Students / Graduates
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Benefits & Program Highlights */}
        <Reveal delay={0.2}>
          <div className="internship-perks-grid">
            <div className="internship-perk-item">
              <div className="internship-perk-icon">
                <MapPin size={22} color="var(--accent)" />
              </div>
              <div>
                <h4>Kanteerava Stadium Facility</h4>
                <p>Train inside India's premier multi-sport stadium with real track & field, football, and endurance athletes.</p>
              </div>
            </div>

            <div className="internship-perk-item">
              <div className="internship-perk-icon">
                <Sparkles size={22} color="var(--accent)" />
              </div>
              <div>
                <h4>Advanced Sports Tech</h4>
                <p>Get hands-on with force plates, kinematic motion sensors, HRV recovery monitors, and dynamometry systems.</p>
              </div>
            </div>

            <div className="internship-perk-item">
              <div className="internship-perk-icon">
                <Users size={22} color="var(--accent)" />
              </div>
              <div>
                <h4>Direct 1-on-1 Mentorship</h4>
                <p>Learn directly from senior sports scientists, physiotherapists, and elite coaches via case discussions.</p>
              </div>
            </div>

            <div className="internship-perk-item">
              <div className="internship-perk-icon">
                <Award size={22} color="var(--accent)" />
              </div>
              <div>
                <h4>Certificate of Completion</h4>
                <p>Receive an official, verified certificate from Centre For Sports Science and Sixs Sports upon successful completion.</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Apply / Coordinator Contact Card */}
        <Reveal delay={0.3}>
          <div className="internship-cta-card">
            <div className="internship-cta-content">
              <div className="internship-cta-badge">Admissions Open</div>
              <h3 className="internship-cta-title">
                Apply for the Upcoming Internship Cohort
              </h3>
              <p className="internship-cta-text">
                Seats are strictly limited to ensure individual attention and direct athlete exposure. All fees are inclusive of GST. Connect directly with our Internship Coordinator on WhatsApp or phone to check upcoming batch dates, eligibility, and the application process.
              </p>

              <div className="internship-cta-actions">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  <WhatsAppIcon size={20} color="#ffffff" />
                  <span>Enquire on WhatsApp</span>
                </a>

                <a
                  href="tel:+919113535733"
                  className="btn btn-call"
                >
                  <Phone size={18} />
                  <span>Call +91 91135 35733</span>
                </a>
              </div>
            </div>

            <div className="internship-cta-aside">
              <div className="internship-aside-pill">
                <span className="dot-pulse"></span>
                Rolling Cohorts Throughout the Year
              </div>
              <div className="internship-aside-detail">
                <strong>Location:</strong>
                <p>Centre For Sports Science, Gate 1, Sree Kanteerava Stadium, Bengaluru, Karnataka 560001</p>
              </div>
              <div className="internship-aside-detail">
                <strong>Coordinator Desk:</strong>
                <p>Mon &ndash; Sat: 9:00 AM &ndash; 6:00 PM</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default InternshipSection;
