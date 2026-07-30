import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Seo from '../components/Seo';
import InstagramIcon from '../components/InstagramIcon';

const COUNTRY_CODES = [
  { code: '+91', label: 'India (+91)', length: 10 },
  { code: '+1', label: 'US / Canada (+1)', length: 10 },
  { code: '+44', label: 'United Kingdom (+44)', length: 10 },
  { code: '+61', label: 'Australia (+61)', length: 9 },
  { code: '+971', label: 'UAE (+971)', length: 9 },
  { code: '+65', label: 'Singapore (+65)', length: 8 },
  { code: '+966', label: 'Saudi Arabia (+966)', length: 9 },
  { code: '+974', label: 'Qatar (+974)', length: 8 },
  { code: '+94', label: 'Sri Lanka (+94)', length: 9 },
  { code: '+977', label: 'Nepal (+977)', length: 10 },
  { code: '+880', label: 'Bangladesh (+880)', length: 10 },
];

const getPhoneLength = (countryCode) =>
  COUNTRY_CODES.find((c) => c.code === countryCode)?.length ?? 15;

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '+91',
    phone: '',
    location: '',
    source: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNameChange = (e) => {
    const lettersOnly = e.target.value.replace(/[^A-Za-z\s'-]/g, '');
    setFormData({ ...formData, fullName: lettersOnly });
  };

  const handlePhoneChange = (e) => {
    const maxLength = getPhoneLength(formData.countryCode);
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, maxLength);
    setFormData({ ...formData, phone: digitsOnly });
  };

  const handleCountryCodeChange = (e) => {
    const newCode = e.target.value;
    const maxLength = getPhoneLength(newCode);
    setFormData({ ...formData, countryCode: newCode, phone: formData.phone.slice(0, maxLength) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const { error } = await supabase.from('enquiries').insert({
        full_name: formData.fullName,
        email: formData.email,
        phone: `${formData.countryCode} ${formData.phone}`,
        location: formData.location,
        source: formData.source,
        message: formData.message,
      });
      if (error) throw error;
      setStatus('success');
      setFormData({
        fullName: '',
        email: '',
        countryCode: '+91',
        phone: '',
        location: '',
        source: '',
        message: ''
      });
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
    }
  };

  return (
    <motion.div
      className="contact-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <Seo
        title="Contact Us - Physiotherapy, Strength & Conditioning & Nutrition in Bangalore | Centre For Sports Science"
        description="Book a physiotherapy, strength & conditioning, or nutrition consultation at Centre For Sports Science, Sree Kanteerava Stadium, Bangalore. Call +91 9113535733 or send an enquiry."
        path="/contact"
      />
      <section className="bg-dark hero" style={{ minHeight: '40dvh', display: 'flex', alignItems: 'center', paddingTop: 'calc(100px + env(safe-area-inset-top, 0px))' }}>
        <div className="container">
          <h1 className="hero-title" style={{ fontSize: 'clamp(32px, 6vw, 56px)', marginBottom: '16px' }}>Contact Us for Physiotherapy, S&C & Nutrition in Bangalore</h1>
          <p className="hero-subtitle">Have a question or want to start your performance journey? We're here to help.</p>
        </div>
      </section>

      <section className="section bg-light">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Info & Map */}
            <div className="contact-info">
              <div className="info-card" style={{ marginBottom: '40px' }}>
                <h2 className="section-title" style={{ fontSize: '32px', marginBottom: '32px' }}>Contact Information</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(13, 137, 191, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Phone size={24} color="var(--accent)" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Phone</h4>
                      <p style={{ color: 'var(--text-muted)' }}>+91 9113535733</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(13, 137, 191, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MapPin size={24} color="var(--accent)" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Address</h4>
                      <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>
                        Centre for sports science, Gate No 8,<br />
                        Sree Kanteerava Stadium, Bangalore.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(13, 137, 191, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Mail size={24} color="var(--accent)" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Email</h4>
                      <p style={{ color: 'var(--text-muted)' }}>admin@sixscss.com</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(13, 137, 191, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <InstagramIcon size={24} gradient={false} color="var(--accent)" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Instagram</h4>
                      <a
                        href="https://www.instagram.com/css_kanteerava?igsh=MTduZXl6ZXo2NmNkcg=="
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
                      >
                        @css_kanteerava
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="map-wrapper" style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', height: '400px' }}>
                <iframe
                  title="CSS Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.973322045508!2d77.59207767425404!3d12.971239615538743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15db35db7771%3A0xd9d55c9dde33b27d!2sCENTER%20FOR%20SPORTS%20SCIENCE!5e0!3m2!1sen!2sin!4v1714561465451!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            {/* Form */}
            <div className="form-wrapper">
              <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  style={{ textAlign: 'center', padding: '40px 0' }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: 'backOut' }}
                  >
                    <CheckCircle size={64} color="#10b981" style={{ marginBottom: '24px' }} />
                  </motion.div>
                  <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>Enquiry Sent!</h2>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Thank you for reaching out. Our team will get back to you shortly.</p>
                  <button className="btn btn-primary" onClick={() => setStatus('idle')}>Send Another Message</button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                >
                  <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '32px' }}>Send an Enquiry</h3>

                  <div className="form-grid">
                    <div className="input-group">
                      <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleNameChange}
                        pattern="[A-Za-z\s'-]+"
                        title="Only letters are allowed"
                        required
                        placeholder="John Doe"
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px' }}
                      />
                    </div>
                    <div className="input-group">
                      <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px' }}
                      />
                    </div>
                    <div className="input-group">
                      <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>Phone Number</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <select
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={handleCountryCodeChange}
                          aria-label="Country code"
                          style={{ flex: '0 0 auto', padding: '12px 8px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px', backgroundColor: 'white' }}
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.code} value={c.code}>{c.code}</option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          inputMode="numeric"
                          pattern={`[0-9]{${getPhoneLength(formData.countryCode)}}`}
                          maxLength={getPhoneLength(formData.countryCode)}
                          title={`Enter exactly ${getPhoneLength(formData.countryCode)} digits`}
                          required
                          placeholder="9113535733"
                          style={{ flex: 1, minWidth: 0, padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px' }}
                        />
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                        {formData.phone.length}/{getPhoneLength(formData.countryCode)} digits
                      </p>
                    </div>
                    <div className="input-group">
                      <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>Location/City</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Bangalore"
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px' }}
                      />
                    </div>
                  </div>

                  <div className="input-group" style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>How do you know about CSS?</label>
                    <select
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px', appearance: 'none', backgroundColor: 'white' }}
                    >
                      <option value="">Select an option</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Friend/Family">Friend/Family</option>
                      <option value="Search Engine">Search Engine</option>
                      <option value="Advertisement">Advertisement</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  <div className="input-group" style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>What do you want from us?</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us about your requirements..."
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px', minHeight: '120px', resize: 'vertical' }}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={status === 'loading'}
                    style={{ width: '100%', gap: '12px' }}
                  >
                    {status === 'loading' ? 'Sending...' : (
                      <>
                        Submit Enquiry <Send size={18} />
                      </>
                    )}
                  </button>
                  <AnimatePresence>
                    {status === 'error' && (
                      <motion.p
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        style={{ color: '#ef4444', marginTop: '16px', fontSize: '14px', textAlign: 'center' }}
                      >
                        Oops! Something went wrong. Please try again.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.form>
              )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Contact;
