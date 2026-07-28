import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import cssLogo from '../assets/css_logo.png';
import { supabase } from '../lib/supabase';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    navigate('/');
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
    <div className="login-container">
      {/* Left Side: Form */}
      <motion.div
        className="login-left"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} style={{ marginBottom: '48px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={cssLogo} alt="CSS Logo" style={{ height: '40px' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#003459', letterSpacing: '-0.5px' }}>
            Centre For <span style={{ color: '#0d89bf' }}>Sports Science</span>
          </h1>
        </motion.div>

        <motion.div variants={itemVariants} style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0b0b0b', marginBottom: '12px', letterSpacing: '-1px' }}>Sign in</h2>
          <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.5' }}>
            Welcome back! Sign in to access your performance data and manage your profile.
          </p>
        </motion.div>

        <motion.form variants={itemVariants} onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#0b0b0b', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  padding: '16px 16px 16px 48px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '15px',
                  color: '#0b0b0b',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                className="login-input-light"
              />
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ color: '#0b0b0b', fontSize: '14px', fontWeight: 600 }}>Password</label>
              <a href="#" style={{ color: '#0d89bf', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>Forgot?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '15px',
                  color: '#0b0b0b',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                className="login-input-light"
              />
            </div>
          </div>

          {error && (
            <p style={{ color: '#dc2626', fontSize: '14px', marginBottom: '20px' }}>{error}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '32px',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Signing in...' : 'Continue'}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </motion.button>

          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '15px' }}>
            Don't have an account? <Link to="/signup" style={{ color: '#0d89bf', textDecoration: 'none', fontWeight: 700 }}>Create one</Link>
          </p>

          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <Link to="/" style={{ color: '#94a3b8', fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back to Home
            </Link>
          </div>
        </motion.form>
      </motion.div>

      {/* Right Side: Decorative Panel */}
      <div className="login-right">
        {/* Animated Abstract Circles */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            top: '-10%',
            right: '-10%'
          }}
        ></motion.div>
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.03)',
            bottom: '10%',
            left: '5%'
          }}
        ></motion.div>

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: '#ffffff', padding: '0 40px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* Card removed at user request */}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
