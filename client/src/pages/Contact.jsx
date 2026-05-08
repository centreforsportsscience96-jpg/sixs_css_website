import React, { useState } from 'react';
import axios from 'axios';
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    source: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await axios.post('/api/enquiries', formData);
      setStatus('success');
      setFormData({
        fullName: '',
        email: '',
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
    <div className="contact-page">
      <section className="bg-dark hero" style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', paddingTop: '100px' }}>
        <div className="container">
          <h1 className="hero-title" style={{ fontSize: '56px', marginBottom: '16px' }}>Get in Touch</h1>
          <p className="hero-subtitle">Have a question or want to start your performance journey? We're here to help.</p>
        </div>
      </section>

      <section className="section bg-light">
        <div className="container">
          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '64px' }}>
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
            <div className="form-wrapper" style={{ background: 'white', padding: '48px', borderRadius: '24px', boxShadow: 'var(--shadow-md)' }}>
              {status === 'success' ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <CheckCircle size={64} color="#10b981" style={{ marginBottom: '24px' }} />
                  <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>Enquiry Sent!</h2>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Thank you for reaching out. Our team will get back to you shortly.</p>
                  <button className="btn btn-primary" onClick={() => setStatus('idle')}>Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '32px' }}>Send an Enquiry</h3>

                  <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                    <div className="input-group">
                      <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
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
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+91 00000 00000"
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px' }}
                      />
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
                  {status === 'error' && (
                    <p style={{ color: '#ef4444', marginTop: '16px', fontSize: '14px', textAlign: 'center' }}>
                      Oops! Something went wrong. Please try again.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
