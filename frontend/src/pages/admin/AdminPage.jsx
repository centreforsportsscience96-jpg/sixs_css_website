import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import cssLogo from '../../assets/css_logo.png';
import adminRunner from '../../assets/admin_runner.png';
import adminRightWave from '../../assets/admin_right_wave.png';
import { groupNotices, formatEventDate, toIndianNumber, waLink } from '../../utils/noticeGroups';
import './admin.css';

const generatePosterPath = (file) => {
  const fileExt = file.name.split('.').pop();
  const safeName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
  return `${Date.now()}_${safeName}.${fileExt}`;
};

const CATEGORIES = [
  'Workshop',
  'Screening Camp',
  'Seminar',
  'Centre Update',
  'Milestone',
];

const AdminPage = () => {
  // ---------------- Page Protection (noindex, nofollow) ----------------
  useEffect(() => {
    document.title = 'Admin';
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';

    return () => {
      document.title = 'Centre For Sports Science';
      if (meta) meta.content = 'index, follow';
    };
  }, []);

  // ---------------- Auth State ----------------
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null); // null = checking, true = admin, false = denied
  const [authLoading, setAuthLoading] = useState(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Active dashboard tab ('post', 'manager', 'enquiries')
  const [activeTab, setActiveTab] = useState('manager');
  const [noticeSubtab, setNoticeSubtab] = useState('current'); // 'current', 'upcoming', 'history'

  // Data states
  const [notices, setNotices] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Notice form state
  const [editingNoticeId, setEditingNoticeId] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Workshop');
  const [formEventDate, setFormEventDate] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIsPinned, setFormIsPinned] = useState(false);
  const [formPosterFile, setFormPosterFile] = useState(null);
  const [formExistingImageUrl, setFormExistingImageUrl] = useState('');
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Search & confirmation modals
  const [enquirySearch, setEnquirySearch] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, type: '', id: null, title: '' });

  // ---------------- Session & Role Listener ----------------
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s) {
        setIsAdmin(null);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      const timer = setTimeout(() => setIsAdmin(null), 0);
      return () => clearTimeout(timer);
    }

    let isMounted = true;
    supabase.rpc('is_admin').then(({ data, error }) => {
      if (!isMounted) return;
      if (error || !data) {
        setIsAdmin(false);
        supabase.auth.signOut();
      } else {
        setIsAdmin(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [session]);

  // ---------------- Handle Admin Login ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      if (error || !data?.session) {
        setLoginError('Invalid credentials');
        setLoginSubmitting(false);
        return;
      }

      // Check admin status
      const { data: adminCheck, error: rpcErr } = await supabase.rpc('is_admin');
      if (rpcErr || !adminCheck) {
        await supabase.auth.signOut();
        setLoginError('Access denied: account is not authorized as an administrator.');
        setLoginSubmitting(false);
        return;
      }

      setIsAdmin(true);
      setLoginSubmitting(false);
    } catch {
      setLoginError('Invalid credentials');
      setLoginSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(null);
  };

  // ---------------- Fetch Data ----------------
  const fetchNotices = useCallback(async () => {
    const { data, error } = await supabase
      .from('center_notices')
      .select('*')
      .order('event_date', { ascending: false });

    if (!error && data) {
      setNotices(data);
    }
  }, []);

  const fetchEnquiries = useCallback(async () => {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setEnquiries(data);
    }
  }, []);

  useEffect(() => {
    if (isAdmin !== true) return;

    let isMounted = true;
    const loadDashboardData = async () => {
      setDataLoading(true);
      try {
        const [noticesRes, enquiriesRes] = await Promise.all([
          supabase.from('center_notices').select('*').order('event_date', { ascending: false }),
          supabase.from('enquiries').select('*').order('created_at', { ascending: false }),
        ]);
        if (isMounted) {
          if (!noticesRes.error && noticesRes.data) setNotices(noticesRes.data);
          if (!enquiriesRes.error && enquiriesRes.data) setEnquiries(enquiriesRes.data);
        }
      } finally {
        if (isMounted) setDataLoading(false);
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  // ---------------- Notice Form Submit (Create / Edit) ----------------
  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    setFormMessage({ type: '', text: '' });

    if (!formTitle.trim() || formTitle.length < 3 || formTitle.length > 200) {
      setFormMessage({ type: 'error', text: 'Title must be between 3 and 200 characters.' });
      return;
    }
    if (!formEventDate) {
      setFormMessage({ type: 'error', text: 'Please select an event date.' });
      return;
    }
    if (!formDescription.trim()) {
      setFormMessage({ type: 'error', text: 'Description is required.' });
      return;
    }

    setFormSubmitting(true);
    let imageUrl = formExistingImageUrl;

    try {
      // Handle poster file upload to Supabase Storage bucket 'notice-posters'
      if (formPosterFile) {
        const filePath = generatePosterPath(formPosterFile);

        const { error: uploadError } = await supabase.storage
          .from('notice-posters')
          .upload(filePath, formPosterFile, { cacheControl: '3600', upsert: true });

        if (uploadError) {
          throw new Error(`Poster upload failed: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from('notice-posters')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const payload = {
        title: formTitle.trim(),
        category: formCategory,
        event_date: formEventDate,
        description: formDescription.trim(),
        image_url: imageUrl || null,
        is_pinned: Boolean(formIsPinned),
      };

      if (editingNoticeId) {
        // Update existing notice
        const { error: updateError } = await supabase
          .from('center_notices')
          .update(payload)
          .eq('id', editingNoticeId);

        if (updateError) throw updateError;
        setFormMessage({ type: 'success', text: 'Notice updated successfully!' });
      } else {
        // Create new notice
        const { error: insertError } = await supabase
          .from('center_notices')
          .insert([payload]);

        if (insertError) throw insertError;
        setFormMessage({ type: 'success', text: 'Notice posted successfully!' });
      }

      // Reset form and refresh list
      resetNoticeForm();
      await fetchNotices();
      setActiveTab('manager');
    } catch (err) {
      setFormMessage({ type: 'error', text: err.message || 'Failed to save notice.' });
    } finally {
      setFormSubmitting(false);
    }
  };

  const resetNoticeForm = () => {
    setEditingNoticeId(null);
    setFormTitle('');
    setFormCategory('Workshop');
    setFormEventDate('');
    setFormDescription('');
    setFormIsPinned(false);
    setFormPosterFile(null);
    setFormExistingImageUrl('');
  };

  const handleEditClick = (notice) => {
    setEditingNoticeId(notice.id);
    setFormTitle(notice.title || '');
    setFormCategory(notice.category || 'Workshop');
    setFormEventDate(notice.event_date || '');
    setFormDescription(notice.description || '');
    setFormIsPinned(Boolean(notice.is_pinned));
    setFormExistingImageUrl(notice.image_url || '');
    setFormPosterFile(null);
    setFormMessage({ type: '', text: '' });
    setActiveTab('post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ---------------- Deletion Modal ----------------
  const confirmDelete = async () => {
    const { type, id } = deleteModal;
    setDeleteModal({ open: false, type: '', id: null, title: '' });

    if (type === 'notice') {
      const { error } = await supabase.from('center_notices').delete().eq('id', id);
      if (!error) {
        fetchNotices();
      }
    } else if (type === 'enquiry') {
      const { error } = await supabase.from('enquiries').delete().eq('id', id);
      if (!error) {
        fetchEnquiries();
      }
    }
  };

  // ---------------- Grouped Notices (IST safe) ----------------
  const groupedNotices = groupNotices(notices);
  const noticesToDisplay = groupedNotices[noticeSubtab] || [];

  // Filtered Enquiries
  const filteredEnquiries = enquiries.filter((e) => {
    if (!enquirySearch.trim()) return true;
    const term = enquirySearch.toLowerCase();
    return (
      (e.full_name || '').toLowerCase().includes(term) ||
      (e.email || '').toLowerCase().includes(term) ||
      (e.phone || '').toLowerCase().includes(term) ||
      (e.message || '').toLowerCase().includes(term) ||
      (e.location || '').toLowerCase().includes(term)
    );
  });

  // ---------------- Render Views ----------------

  // 1. Initial Auth Checking Screen
  if (authLoading || (session && isAdmin === null)) {
    return (
      <div className="admin-root admin-loading-screen">
        <div className="admin-spinner"></div>
        <p>Verifying admin authorization...</p>
      </div>
    );
  }

  // 2. Private Login Gate (Not signed in or not an admin)
  if (!session || isAdmin !== true) {
    return (
      <div className="admin-root admin-portal-screen">
        {/* Top Navigation Bar */}
        <header className="admin-portal-header">
          <Link to="/" className="admin-portal-brand" title="Back to Home">
            <img
              src={cssLogo}
              alt="Centre For Sports Science"
              className="admin-portal-logo"
            />
            <div className="admin-portal-brand-divider" />
            <div className="admin-portal-brand-titles">
              <span>CENTRE FOR</span>
              <span>SPORTS SCIENCE</span>
            </div>
          </Link>

          <div className="admin-portal-tagline">
            <span>ASSESS</span>
            <span className="admin-tagline-dot">•</span>
            <span>ANALYSE</span>
            <span className="admin-tagline-dot">•</span>
            <span>ACHIEVE</span>
          </div>
        </header>

        {/* Dynamic Athlete & Wave Art in Background */}
        <div className="admin-portal-bg">
          <div
            className="admin-portal-runner"
            style={{ backgroundImage: `url(${adminRunner})` }}
            aria-hidden="true"
          />
          <div
            className="admin-portal-wave"
            style={{ backgroundImage: `url(${adminRightWave})` }}
            aria-hidden="true"
          />
          <div className="admin-portal-ambient-light" />
        </div>

        {/* Central Card Container */}
        <div className="admin-portal-main">
          <div className="admin-portal-card">
            {/* Top Emblem with Official Logo */}
            <div className="admin-portal-emblem">
              <img
                src={cssLogo}
                alt="CSS Emblem"
                className="admin-emblem-logo"
              />
            </div>

            {/* Title & Subtitle */}
            <h1 className="admin-card-title">
              Centre For <span className="admin-accent-text">Sports Science</span>
            </h1>
            <p className="admin-card-subtitle">
              Advance Performance. Build Wellness.
            </p>
            <div className="admin-card-accent-bar" />

            {/* Error Message */}
            {loginError && (
              <div className="admin-alert-error admin-alert-animated">
                <AlertCircle size={16} className="admin-alert-icon" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="admin-card-form">
              <div className="admin-input-group">
                <label htmlFor="admin-email" className="admin-field-label">
                  ADMINISTRATIVE EMAIL
                </label>
                <div className="admin-field-wrapper">
                  <Mail size={16} className="admin-field-icon" />
                  <input
                    id="admin-email"
                    type="email"
                    required
                    className="admin-field-input"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter your email address"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="admin-input-group">
                <label htmlFor="admin-password" className="admin-field-label">
                  SECURITY PASSWORD
                </label>
                <div className="admin-field-wrapper">
                  <Lock size={16} className="admin-field-icon" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="admin-field-input with-toggle"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="admin-toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginSubmitting}
                className="admin-portal-submit-btn"
              >
                {loginSubmitting ? (
                  <>
                    <Loader2 size={16} className="admin-spin-icon" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Admin Portal</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Secure Access Divider */}
            <div className="admin-secure-divider">
              <span className="admin-divider-line" />
              <div className="admin-secure-badge">
                <Shield size={12} />
                <span>Secure Access</span>
              </div>
              <span className="admin-divider-line" />
            </div>

            {/* Bottom Footer Details */}
            <div className="admin-portal-card-footer">
              <span>© {new Date().getFullYear()} Centre for Sports Science</span>
              <span>Powered by SixS</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Full Admin Dashboard (Authorized)
  return (
    <div className="admin-root">
      {/* Topbar */}
      <header className="admin-topbar">
        <div className="admin-brand">
          <img src={cssLogo} alt="CSS Logo" />
          <h2>
            Centre For Sports Science
            <span>Admin</span>
          </h2>
        </div>

        <div className="admin-topbar-actions">
          <span className="admin-user-pill">{session?.user?.email}</span>
          <button onClick={handleLogout} className="admin-btn-logout">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="admin-container">
        {/* Navigation Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab-btn ${activeTab === 'manager' ? 'active' : ''}`}
            onClick={() => setActiveTab('manager')}
          >
            📋 Notice Manager
            <span className="admin-badge-count">{notices.length}</span>
          </button>

          <button
            className={`admin-tab-btn ${activeTab === 'post' ? 'active' : ''}`}
            onClick={() => {
              if (!editingNoticeId) resetNoticeForm();
              setActiveTab('post');
            }}
          >
            {editingNoticeId ? '✏️ Edit Notice' : '📢 Post Notice or Event'}
          </button>

          <button
            className={`admin-tab-btn ${activeTab === 'enquiries' ? 'active' : ''}`}
            onClick={() => setActiveTab('enquiries')}
          >
            📬 Enquiries Inbox
            <span className="admin-badge-count">{enquiries.length}</span>
          </button>
        </div>

        {/* ================= TAB 1: POST / EDIT NOTICE ================= */}
        {activeTab === 'post' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>{editingNoticeId ? 'Edit Event Notice' : 'Post New Event Notice'}</h3>
              {editingNoticeId && (
                <button
                  type="button"
                  onClick={resetNoticeForm}
                  className="admin-btn-action"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {formMessage.text && (
              <div
                className={
                  formMessage.type === 'error' ? 'admin-alert-error' : 'admin-alert-success'
                }
              >
                {formMessage.text}
              </div>
            )}

            <form onSubmit={handleNoticeSubmit}>
              <div className="admin-grid-3">
                <div className="admin-form-group">
                  <label htmlFor="notice-title">Notice Title *</label>
                  <input
                    id="notice-title"
                    type="text"
                    required
                    maxLength={200}
                    className="admin-form-input"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Advanced Biomechanics & Motion Analysis Workshop"
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="notice-category">Category *</label>
                  <select
                    id="notice-category"
                    className="admin-form-select"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label htmlFor="notice-date">Event Date *</label>
                  <input
                    id="notice-date"
                    type="date"
                    required
                    className="admin-form-input"
                    value={formEventDate}
                    onChange={(e) => setFormEventDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="notice-desc">Description / Details *</label>
                <textarea
                  id="notice-desc"
                  required
                  maxLength={5000}
                  className="admin-form-textarea"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Provide timing, target audience, venue at Sree Kanteerava Stadium, and participation details..."
                />
              </div>

              <div className="admin-grid-2" style={{ marginBottom: '24px' }}>
                <div className="admin-form-group">
                  <label>Poster Image (Optional)</label>
                  <div className="admin-file-upload-box">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setFormPosterFile(e.target.files[0]);
                        }
                      }}
                    />
                    <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1' }}>
                      {formPosterFile
                        ? `Selected: ${formPosterFile.name}`
                        : 'Click or drag image file to upload'}
                    </p>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      Stored securely in Supabase notice-posters bucket
                    </span>
                  </div>

                  {formExistingImageUrl && !formPosterFile && (
                    <div style={{ marginTop: '10px' }}>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>Current Poster:</span>
                      <br />
                      <img
                        src={formExistingImageUrl}
                        alt="Current notice poster"
                        className="admin-preview-poster"
                      />
                    </div>
                  )}
                </div>

                <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center' }}>
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={formIsPinned}
                      onChange={(e) => setFormIsPinned(e.target.checked)}
                    />
                    <span>Pin notice to top / feature on notice board</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={formSubmitting}
                className="admin-btn-primary"
                style={{ width: 'auto', padding: '12px 32px' }}
              >
                {formSubmitting
                  ? 'Saving Notice...'
                  : editingNoticeId
                  ? 'Update Notice'
                  : 'Publish Notice'}
              </button>
            </form>
          </div>
        )}

        {/* ================= TAB 2: NOTICE MANAGER ================= */}
        {activeTab === 'manager' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Center Event Notices</h3>
              <button
                onClick={() => {
                  resetNoticeForm();
                  setActiveTab('post');
                }}
                className="admin-btn-primary"
                style={{ width: 'auto', padding: '8px 16px', fontSize: '13px' }}
              >
                + Post Notice
              </button>
            </div>

            {/* Lifecycle Sub-tabs: Upcoming, This Month, History */}
            <div className="admin-subtabs">
              <button
                className={`admin-subtab-btn ${noticeSubtab === 'current' ? 'active' : ''}`}
                onClick={() => setNoticeSubtab('current')}
              >
                🟢 This Month ({groupedNotices.current.length})
              </button>
              <button
                className={`admin-subtab-btn ${noticeSubtab === 'upcoming' ? 'active' : ''}`}
                onClick={() => setNoticeSubtab('upcoming')}
              >
                🚀 Upcoming ({groupedNotices.upcoming.length})
              </button>
              <button
                className={`admin-subtab-btn ${noticeSubtab === 'history' ? 'active' : ''}`}
                onClick={() => setNoticeSubtab('history')}
              >
                📜 History & Archive ({groupedNotices.history.length})
              </button>
            </div>

            {dataLoading ? (
              <div className="admin-empty-state">Loading notices...</div>
            ) : noticesToDisplay.length === 0 ? (
              <div className="admin-empty-state">
                No notices found in {noticeSubtab === 'current' ? 'This Month' : noticeSubtab}.
              </div>
            ) : (
              <div className="admin-notices-grid">
                {noticesToDisplay.map((notice) => (
                  <article key={notice.id} className="admin-notice-card">
                    <div>
                      {notice.is_pinned && (
                        <div className="admin-pinned-indicator">📌 Pinned to Top</div>
                      )}
                      <div className="admin-notice-meta">
                        <span className="admin-category-pill">{notice.category}</span>
                        <span className="admin-date-pill">
                          {formatEventDate(notice.event_date)}
                        </span>
                      </div>
                      <h4>{notice.title}</h4>
                      <p>{notice.description}</p>

                      {notice.image_url && (
                        <a
                          href={notice.image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '12px',
                            color: '#38bdf8',
                            display: 'inline-block',
                            marginBottom: '12px',
                          }}
                        >
                          View Poster File &rarr;
                        </a>
                      )}
                    </div>

                    <div className="admin-card-actions">
                      <button
                        onClick={() => handleEditClick(notice)}
                        className="admin-btn-action"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          setDeleteModal({
                            open: true,
                            type: 'notice',
                            id: notice.id,
                            title: notice.title,
                          })
                        }
                        className="admin-btn-action delete"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: ENQUIRIES INBOX ================= */}
        {activeTab === 'enquiries' && (
          <div className="admin-card">
            <div className="admin-enquiries-header">
              <h3>Contact Enquiries Inbox</h3>
              <input
                type="text"
                placeholder="Search name, phone, message..."
                className="admin-form-input admin-search-input"
                value={enquirySearch}
                onChange={(e) => setEnquirySearch(e.target.value)}
              />
            </div>

            {dataLoading ? (
              <div className="admin-empty-state">Loading enquiries...</div>
            ) : filteredEnquiries.length === 0 ? (
              <div className="admin-empty-state">No enquiries found.</div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Lead Contact</th>
                      <th>Location / Source</th>
                      <th>Message</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEnquiries.map((enq) => (
                      <tr key={enq.id}>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          {new Date(enq.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td>
                          <div className="admin-lead-name">{enq.full_name}</div>
                          <div>{enq.email}</div>
                          <div style={{ color: '#38bdf8', fontWeight: 600 }}>{enq.phone}</div>
                        </td>
                        <td>
                          <div>{enq.location || 'Bangalore'}</div>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>
                            {enq.source || 'Website'}
                          </span>
                        </td>
                        <td className="admin-lead-msg">{enq.message}</td>
                        <td>
                          <div className="admin-table-actions">
                            {enq.phone && (
                              <>
                                <a
                                  href={`tel:${toIndianNumber(enq.phone)}`}
                                  className="admin-btn-icon call"
                                  title="Call Lead"
                                >
                                  📞
                                </a>
                                <a
                                  href={waLink(
                                    enq.phone,
                                    `Hi ${enq.full_name}, thank you for reaching out to Centre For Sports Science. How can we help you?`
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="admin-btn-icon wa"
                                  title="WhatsApp Chat"
                                >
                                  💬
                                </a>
                              </>
                            )}
                            <button
                              onClick={() =>
                                setDeleteModal({
                                  open: true,
                                  type: 'enquiry',
                                  id: enq.id,
                                  title: `Enquiry from ${enq.full_name}`,
                                })
                              }
                              className="admin-btn-action delete"
                              style={{ padding: '6px 8px' }}
                              title="Delete Enquiry"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      {deleteModal.open && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <h4>Confirm Deletion</h4>
            <p>
              Are you sure you want to delete <strong>{deleteModal.title}</strong>? This action
              cannot be undone.
            </p>
            <div className="admin-modal-actions">
              <button
                onClick={() =>
                  setDeleteModal({ open: false, type: '', id: null, title: '' })
                }
                className="admin-btn-secondary"
              >
                Cancel
              </button>
              <button onClick={confirmDelete} className="admin-btn-danger">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
