import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import cssLogo from '../assets/css_logo.png';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign up attempt:', { name, email, password, confirmPassword });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="signup-container">
      {/* Left Side: Form */}
      <motion.div
        className="signup-left"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={cssLogo} alt="CSS Logo" style={{ height: '36px' }} />
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#003459', letterSpacing: '-0.5px' }}>
            Centre For <span style={{ color: '#0d89bf' }}>Sports Science</span>
          </h1>
        </motion.div>

        <motion.div variants={itemVariants} style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '42px', fontWeight: 400, color: '#0b0b0b', marginBottom: '16px', letterSpacing: '-1px' }}>Sign up</h2>
          <p style={{ color: '#64748b', fontSize: '17px', lineHeight: '1.5', maxWidth: '450px' }}>
            Create an account to explore our premium range of sports science services, monitoring tools & more.
          </p>
        </motion.div>

        <motion.form variants={itemVariants} onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#0b0b0b', fontSize: '15px', fontWeight: 500, marginBottom: '8px' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '18px 18px 18px 48px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  fontSize: '15px',
                  color: '#0b0b0b',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                className="login-input-light"
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#0b0b0b', fontSize: '15px', fontWeight: 500, marginBottom: '8px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '18px 18px 18px 48px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  fontSize: '15px',
                  color: '#0b0b0b',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                className="login-input-light"
              />
            </div>
          </div>

          <div className="signup-row">
            <div style={{ flex: '1' }}>
              <label style={{ display: 'block', color: '#0b0b0b', fontSize: '15px', fontWeight: 500, marginBottom: '8px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type="password"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '18px 18px 18px 48px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    fontSize: '15px',
                    color: '#0b0b0b',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  className="login-input-light"
                />
              </div>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px' }}>Min. 6 characters</p>
            </div>
            <div style={{ flex: '1' }}>
              <label style={{ display: 'block', color: '#0b0b0b', fontSize: '15px', fontWeight: 500, marginBottom: '8px' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '18px 18px 18px 48px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    fontSize: '15px',
                    color: '#0b0b0b',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  className="login-input-light"
                />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn btn-primary"
            style={{
              width: '240px',
              padding: '18px',
              borderRadius: '14px',
              fontSize: '16px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '32px'
            }}
          >
            Continue
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </motion.button>

          <p style={{ color: '#64748b', fontSize: '15px' }}>
            Already have an account? <Link to="/login" style={{ color: '#0d89bf', textDecoration: 'none', fontWeight: 700 }}>Sign in</Link>
          </p>
        </motion.form>
      </motion.div>

      {/* Right Side: Decorative Panel */}
      <div className="signup-right">
        {/* Animated Abstract Circles */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            top: '-10%',
            right: '-10%'
          }}
        ></motion.div>

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: '#ffffff', padding: '0 40px' }}>
          {/* Card removed at user request */}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
