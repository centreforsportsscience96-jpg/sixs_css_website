import { useState, useEffect, useCallback, useRef } from 'react';
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
  ClipboardList,
  Megaphone,
  Users,
  Inbox,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Phone,
  MessageSquare,
  Trash2,
  Pin,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import cssLogo from '../../assets/css_logo.png';
import adminRunner from '../../assets/admin_runner.png';
import adminRightWave from '../../assets/admin_right_wave.png';
import { groupNotices, formatEventDate, toIndianNumber, waLink } from '../../utils/noticeGroups';
import './admin.css';

const generateStorageFilePath = (file, prefix = '') => {
  const parts = (file.name || 'image.png').split('.');
  const fileExt = parts.length > 1 ? parts.pop().toLowerCase() : 'png';
  const safeBase = parts.join('.').replace(/[^a-zA-Z0-9]/g, '_') || 'upload';
  const safePrefix = prefix ? `${prefix.replace(/\/+$/, '')}/` : '';
  return `${safePrefix}${Date.now()}_${safeBase}.${fileExt}`;
};

const extractStoragePath = (publicUrl, bucket) => {
  if (!publicUrl || typeof publicUrl !== 'string') return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const markerIndex = publicUrl.indexOf(marker);
  if (markerIndex === -1) return null;
  return decodeURIComponent(publicUrl.slice(markerIndex + marker.length).split('?')[0]);
};

const getStaffInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'CS';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const CATEGORIES = [
  'Workshop',
  'Screening Camp',
  'Seminar',
  'Centre Update',
  'Milestone',
];

const STAFF_DEPARTMENTS = [
  'Sports Physiotherapy',
  'Strength & Conditioning',
  'Sports Biomechanics',
  'Administration',
  'IT Support',
  'Leadership',
];
const CUSTOM_DEPARTMENT_VALUE = '__custom__';

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

  // Active dashboard tab ('post', 'manager', 'staff', 'enquiries')
  const [activeTab, setActiveTab] = useState('manager');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [noticeSubtab, setNoticeSubtab] = useState('current'); // 'current', 'upcoming', 'history'

  // Data states
  const [notices, setNotices] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
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

  // Staff form state
  const [isStaffFormOpen, setIsStaffFormOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [staffName, setStaffName] = useState('');
  const [staffDesignation, setStaffDesignation] = useState('');
  const [staffDepartment, setStaffDepartment] = useState(STAFF_DEPARTMENTS[0]);
  const [customDepartment, setCustomDepartment] = useState('');
  const [staffBio, setStaffBio] = useState('');
  const [staffOrder, setStaffOrder] = useState(0);
  const [staffPhotoFile, setStaffPhotoFile] = useState(null);
  const [staffExistingPhotoUrl, setStaffExistingPhotoUrl] = useState('');
  const [staffPhotoPreview, setStaffPhotoPreview] = useState('');
  const [removeExistingStaffPhoto, setRemoveExistingStaffPhoto] = useState(false);
  const [staffPhotoDragActive, setStaffPhotoDragActive] = useState(false);
  const [staffMessage, setStaffMessage] = useState({ type: '', text: '' });
  const [staffSubmitting, setStaffSubmitting] = useState(false);
  const staffPhotoInputRef = useRef(null);

  const availableDepartments = Array.from(
    new Set([
      ...STAFF_DEPARTMENTS,
      ...staffMembers.map((m) => (m.department || '').trim()).filter(Boolean),
    ])
  );

  // Search & confirmation modals
  const [enquirySearch, setEnquirySearch] = useState('');
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    type: '',
    id: null,
    title: '',
    photoUrl: '',
  });

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

  const sessionUserId = session?.user?.id || null;

  useEffect(() => {
    if (!sessionUserId) {
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
  }, [sessionUserId]);

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

  const fetchStaff = useCallback(async () => {
    const { data, error } = await supabase
      .from('staff_members')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (!error && data) {
      setStaffMembers(data);
    }
  }, []);

  useEffect(() => {
    if (isAdmin !== true) return;

    let isMounted = true;
    const loadDashboardData = async () => {
      setDataLoading(true);
      try {
        const [noticesRes, enquiriesRes, staffRes] = await Promise.all([
          supabase.from('center_notices').select('*').order('event_date', { ascending: false }),
          supabase.from('enquiries').select('*').order('created_at', { ascending: false }),
          supabase
            .from('staff_members')
            .select('*')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: true }),
        ]);
        if (isMounted) {
          if (!noticesRes.error && noticesRes.data) setNotices(noticesRes.data);
          if (!enquiriesRes.error && enquiriesRes.data) setEnquiries(enquiriesRes.data);
          if (!staffRes.error && staffRes.data) setStaffMembers(staffRes.data);
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
        const filePath = generateStorageFilePath(formPosterFile);

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

  // ---------------- Staff CRUD Handlers ----------------
  const removeStorageFileIfManaged = async (publicUrl, bucket) => {
    const storagePath = extractStoragePath(publicUrl, bucket);
    if (!storagePath) return;
    await supabase.storage.from(bucket).remove([storagePath]);
  };

  const resetStaffForm = () => {
    setEditingStaffId(null);
    setStaffName('');
    setStaffDesignation('');
    setStaffDepartment(STAFF_DEPARTMENTS[0]);
    setCustomDepartment('');
    setStaffBio('');
    setStaffOrder(0);
    setStaffPhotoFile(null);
    setStaffExistingPhotoUrl('');
    setStaffPhotoPreview('');
    setRemoveExistingStaffPhoto(false);
    if (staffPhotoInputRef.current) {
      staffPhotoInputRef.current.value = '';
    }
  };

  const openAddStaffForm = () => {
    resetStaffForm();
    const maxOrder = staffMembers.reduce(
      (max, item) => Math.max(max, Number(item.display_order) || 0),
      0
    );
    setStaffOrder(maxOrder + 1);
    setStaffMessage({ type: '', text: '' });
    setIsStaffFormOpen(true);
  };

  const processStaffPhotoFile = (file) => {
    if (!file) return false;

    const isImageMime = file.type?.startsWith('image/');
    const isImageExt = /\.(jpe?g|png|webp|gif|bmp|avif)$/i.test(file.name || '');

    if (!isImageMime && !isImageExt) {
      setStaffMessage({
        type: 'error',
        text: 'Please choose a valid image file (JPG, PNG, or WebP).',
      });
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStaffMessage({
        type: 'error',
        text: 'Staff photo file size must be 5 MB or smaller.',
      });
      return false;
    }

    setStaffMessage({ type: '', text: '' });
    setStaffPhotoFile(file);
    setRemoveExistingStaffPhoto(false);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setStaffPhotoPreview(reader.result);
      }
    };
    reader.onerror = () => {
      setStaffPhotoPreview('');
    };
    reader.readAsDataURL(file);
    return true;
  };

  const handleStaffPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!processStaffPhotoFile(file)) {
      e.target.value = '';
    }
  };

  const handleStaffPhotoDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setStaffPhotoDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      processStaffPhotoFile(file);
    }
  };

  const handleDiscardNewStaffPhoto = () => {
    setStaffPhotoFile(null);
    setStaffPhotoPreview('');
    if (staffPhotoInputRef.current) {
      staffPhotoInputRef.current.value = '';
    }
  };

  const handleToggleRemoveExistingPhoto = () => {
    setRemoveExistingStaffPhoto((prev) => !prev);
  };

  const handleEditStaffClick = (member) => {
    setEditingStaffId(member.id);
    setStaffName(member.name || '');
    setStaffDesignation(member.designation || '');
    setStaffDepartment(member.department || STAFF_DEPARTMENTS[0]);
    setCustomDepartment('');
    setStaffBio(member.bio || '');
    setStaffOrder(Number(member.display_order) || 0);
    setStaffExistingPhotoUrl(member.photo_url || '');
    setStaffPhotoFile(null);
    setStaffPhotoPreview('');
    setRemoveExistingStaffPhoto(false);
    if (staffPhotoInputRef.current) {
      staffPhotoInputRef.current.value = '';
    }
    setStaffMessage({ type: '', text: '' });
    setIsStaffFormOpen(true);
    setActiveTab('staff');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    setStaffMessage({ type: '', text: '' });

    const cleanName = staffName.trim();
    const cleanDesignation = staffDesignation.trim();
    const cleanDepartment = (
      staffDepartment === CUSTOM_DEPARTMENT_VALUE ? customDepartment : staffDepartment
    ).trim();
    const cleanBio = staffBio.trim();

    if (cleanName.length < 2 || cleanName.length > 120) {
      setStaffMessage({ type: 'error', text: 'Name must be between 2 and 120 characters.' });
      return;
    }
    if (cleanDesignation.length < 2 || cleanDesignation.length > 150) {
      setStaffMessage({
        type: 'error',
        text: 'Designation must be between 2 and 150 characters.',
      });
      return;
    }
    if (cleanDepartment.length < 2 || cleanDepartment.length > 100) {
      setStaffMessage({
        type: 'error',
        text: 'Department / Unit must be between 2 and 100 characters.',
      });
      return;
    }
    if (!cleanBio || cleanBio.length > 5000) {
      setStaffMessage({
        type: 'error',
        text: 'Biography is required (up to 5,000 characters).',
      });
      return;
    }

    setStaffSubmitting(true);
    const previousPhotoUrl = staffExistingPhotoUrl;
    let nextPhotoUrl = removeExistingStaffPhoto ? null : previousPhotoUrl || null;
    let uploadedNewPath = null;

    try {
      if (staffPhotoFile) {
        uploadedNewPath = generateStorageFilePath(staffPhotoFile, 'profiles');

        const { error: uploadError } = await supabase.storage
          .from('staff-photos')
          .upload(uploadedNewPath, staffPhotoFile, { cacheControl: '3600', upsert: false });

        if (uploadError) {
          throw new Error(`Photo upload failed: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from('staff-photos')
          .getPublicUrl(uploadedNewPath);

        nextPhotoUrl = publicUrlData.publicUrl;
      }

      const payload = {
        name: cleanName,
        designation: cleanDesignation,
        department: cleanDepartment,
        bio: cleanBio,
        photo_url: nextPhotoUrl,
        display_order: Math.max(0, Math.trunc(Number(staffOrder) || 0)),
      };

      if (editingStaffId) {
        const { error: updateError } = await supabase
          .from('staff_members')
          .update(payload)
          .eq('id', editingStaffId);

        if (updateError) throw updateError;

        if (
          previousPhotoUrl &&
          previousPhotoUrl !== nextPhotoUrl &&
          (staffPhotoFile || removeExistingStaffPhoto)
        ) {
          await removeStorageFileIfManaged(previousPhotoUrl, 'staff-photos');
        }

        setStaffMessage({ type: 'success', text: 'Staff profile updated successfully!' });
      } else {
        const { error: insertError } = await supabase
          .from('staff_members')
          .insert([{ ...payload, created_by: session?.user?.id || null }]);

        if (insertError) throw insertError;
        setStaffMessage({ type: 'success', text: 'Staff member added successfully!' });
      }

      resetStaffForm();
      setIsStaffFormOpen(false);
      await fetchStaff();
    } catch (err) {
      if (uploadedNewPath) {
        await supabase.storage.from('staff-photos').remove([uploadedNewPath]);
      }
      setStaffMessage({ type: 'error', text: err.message || 'Failed to save staff profile.' });
    } finally {
      setStaffSubmitting(false);
    }
  };

  // ---------------- Deletion Modal ----------------
  const confirmDelete = async () => {
    const { type, id, photoUrl } = deleteModal;
    setDeleteModal({ open: false, type: '', id: null, title: '', photoUrl: '' });

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
    } else if (type === 'staff') {
      const { error } = await supabase.from('staff_members').delete().eq('id', id);
      if (error) {
        setStaffMessage({ type: 'error', text: error.message || 'Failed to remove staff member.' });
        return;
      }

      if (photoUrl) {
        await removeStorageFileIfManaged(photoUrl, 'staff-photos');
      }

      if (editingStaffId === id) {
        resetStaffForm();
        setIsStaffFormOpen(false);
      }

      setStaffMessage({ type: 'success', text: 'Staff profile deleted successfully.' });
      fetchStaff();
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
  const activeTabMeta = {
    manager: { kicker: 'Notices & Events', title: 'Notice Manager' },
    post: {
      kicker: 'Notices & Events',
      title: editingNoticeId ? 'Edit Event Notice' : 'Post Notice or Event',
    },
    staff: { kicker: 'About Us · Directory', title: 'Staff & Specialists' },
    enquiries: { kicker: 'Lead Management', title: 'Contact Enquiries Inbox' },
  }[activeTab] || { kicker: 'Management', title: 'Admin Dashboard' };

  const adminEmail = session?.user?.email || 'admin@sixscss.com';
  const adminInitial = adminEmail.slice(0, 1).toUpperCase();

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div
      className="admin-root admin-dashboard-shell"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
    >
      {/* Mobile Sidebar Backdrop */}
      <div
        className={`admin-sidebar-backdrop ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Dark Vertical Sidebar (Matched to Login Portal Theme) */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`} aria-label="Admin sidebar">
        <div>
          <div className="admin-sidebar-header">
            <Link to="/" className="admin-sidebar-brand" title="Centre For Sports Science">
              <div className="admin-sidebar-emblem">
                <img src={cssLogo} alt="CSS Logo" />
              </div>
              <div className="admin-sidebar-brand-text">
                <strong>Centre For Sports Science</strong>
                <span>Admin Portal</span>
              </div>
            </Link>
            <button
              type="button"
              className="admin-sidebar-close-btn"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation menu"
            >
              <X size={17} />
            </button>
          </div>

          <div className="admin-sidebar-section-label">Workspace</div>
          <nav className="admin-sidebar-nav">
            <button
              type="button"
              className={`admin-sidebar-item ${activeTab === 'manager' ? 'active' : ''}`}
              onClick={() => handleSelectTab('manager')}
            >
              <span className="admin-sidebar-item-left">
                <ClipboardList size={18} />
                <span>Notice Manager</span>
              </span>
              <span className="admin-sidebar-badge">{notices.length}</span>
            </button>

            <button
              type="button"
              className={`admin-sidebar-item ${activeTab === 'post' ? 'active' : ''}`}
              onClick={() => {
                if (!editingNoticeId) resetNoticeForm();
                handleSelectTab('post');
              }}
            >
              <span className="admin-sidebar-item-left">
                <Megaphone size={18} />
                <span>{editingNoticeId ? 'Edit Notice' : 'Post Notice or Event'}</span>
              </span>
            </button>

            <button
              type="button"
              className={`admin-sidebar-item ${activeTab === 'staff' ? 'active' : ''}`}
              onClick={() => handleSelectTab('staff')}
            >
              <span className="admin-sidebar-item-left">
                <Users size={18} />
                <span>Staff Team</span>
              </span>
              <span className="admin-sidebar-badge">{staffMembers.length}</span>
            </button>

            <button
              type="button"
              className={`admin-sidebar-item ${activeTab === 'enquiries' ? 'active' : ''}`}
              onClick={() => handleSelectTab('enquiries')}
            >
              <span className="admin-sidebar-item-left">
                <Inbox size={18} />
                <span>Enquiries Inbox</span>
              </span>
              <span className="admin-sidebar-badge">{enquiries.length}</span>
            </button>
          </nav>

          <div className="admin-sidebar-section-label" style={{ marginTop: '28px' }}>
            Public Site
          </div>
          <div className="admin-sidebar-nav">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-sidebar-item"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-sidebar-item-left">
                <ExternalLink size={17} />
                <span>View Live Website</span>
              </span>
            </Link>
          </div>
        </div>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-profile">
            <div className="admin-sidebar-avatar" aria-hidden="true">
              {adminInitial}
            </div>
            <div className="admin-sidebar-profile-meta">
              <span>Signed In</span>
              <strong title={adminEmail}>{adminEmail}</strong>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Column */}
      <div className="admin-main-column">
        {/* Top Navigation Bar */}
        <header className="admin-navbar">
          <div className="admin-navbar-left">
            <button
              type="button"
              className="admin-menu-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation sidebar"
            >
              <Menu size={20} />
            </button>
            <div className="admin-navbar-heading">
              <span className="admin-navbar-kicker">Admin Portal / {activeTabMeta.kicker}</span>
              <h1>{activeTabMeta.title}</h1>
            </div>
          </div>

          <div className="admin-navbar-actions">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-nav-site-link"
            >
              <ExternalLink size={15} />
              <span>View Site</span>
            </Link>
            <span className="admin-user-pill">
              <span className="admin-user-dot" aria-hidden="true" />
              {adminEmail}
            </span>
            <button type="button" onClick={handleLogout} className="admin-btn-logout">
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Light Workspace Content */}
        <main className="admin-workspace">
          {/* Summary KPI Cards */}
          <div className="admin-stats-grid">
            <button
              type="button"
              className={`admin-stat-card ${activeTab === 'manager' ? 'active' : ''}`}
              onClick={() => handleSelectTab('manager')}
            >
              <div className="admin-stat-meta">
                <span>Published Notices</span>
                <strong>{notices.length}</strong>
              </div>
              <div className="admin-stat-icon blue" aria-hidden="true">
                <ClipboardList size={20} />
              </div>
            </button>

            <button
              type="button"
              className={`admin-stat-card ${activeTab === 'staff' ? 'active' : ''}`}
              onClick={() => handleSelectTab('staff')}
            >
              <div className="admin-stat-meta">
                <span>Staff Specialists</span>
                <strong>{staffMembers.length}</strong>
              </div>
              <div className="admin-stat-icon navy" aria-hidden="true">
                <Users size={20} />
              </div>
            </button>

            <button
              type="button"
              className={`admin-stat-card ${activeTab === 'enquiries' ? 'active' : ''}`}
              onClick={() => handleSelectTab('enquiries')}
            >
              <div className="admin-stat-meta">
                <span>Enquiries Received</span>
                <strong>{enquiries.length}</strong>
              </div>
              <div className="admin-stat-icon emerald" aria-hidden="true">
                <Inbox size={20} />
              </div>
            </button>
          </div>

          {/* ================= TAB 1: POST / EDIT NOTICE ================= */}
          {activeTab === 'post' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3>{editingNoticeId ? 'Edit Event Notice' : 'Post New Event Notice'}</h3>
                  <p className="admin-card-subtitle-muted">
                    Publish centre workshops, athlete screening camps, and important updates.
                  </p>
                </div>
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
                      <p className="admin-upload-text">
                        {formPosterFile
                          ? `Selected: ${formPosterFile.name}`
                          : 'Click or drag image file to upload'}
                      </p>
                      <span className="admin-upload-hint">
                        Stored securely in Supabase notice-posters bucket
                      </span>
                    </div>

                    {formExistingImageUrl && !formPosterFile && (
                      <div style={{ marginTop: '12px' }}>
                        <div className="admin-preview-label">Current Poster:</div>
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
                <div>
                  <h3>Center Event Notices</h3>
                  <p className="admin-card-subtitle-muted">
                    Review active announcements, scheduled events, and past notice archives.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    resetNoticeForm();
                    handleSelectTab('post');
                  }}
                  className="admin-btn-primary"
                  style={{ width: 'auto', padding: '9px 18px', fontSize: '13.5px' }}
                >
                  + Post Notice
                </button>
              </div>

              {/* Lifecycle Sub-tabs: Upcoming, This Month, History */}
              <div className="admin-subtabs">
                <button
                  type="button"
                  className={`admin-subtab-btn ${noticeSubtab === 'current' ? 'active' : ''}`}
                  onClick={() => setNoticeSubtab('current')}
                >
                  <span className="admin-subtab-dot current" aria-hidden="true" />
                  This Month ({groupedNotices.current.length})
                </button>
                <button
                  type="button"
                  className={`admin-subtab-btn ${noticeSubtab === 'upcoming' ? 'active' : ''}`}
                  onClick={() => setNoticeSubtab('upcoming')}
                >
                  <span className="admin-subtab-dot upcoming" aria-hidden="true" />
                  Upcoming ({groupedNotices.upcoming.length})
                </button>
                <button
                  type="button"
                  className={`admin-subtab-btn ${noticeSubtab === 'history' ? 'active' : ''}`}
                  onClick={() => setNoticeSubtab('history')}
                >
                  <span className="admin-subtab-dot history" aria-hidden="true" />
                  History &amp; Archive ({groupedNotices.history.length})
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
                          <div className="admin-pinned-indicator">
                            <Pin size={12} />
                            Pinned to Top
                          </div>
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
                            className="admin-poster-link"
                          >
                            View Poster File &rarr;
                          </a>
                        )}
                      </div>

                      <div className="admin-card-actions">
                        <button
                          type="button"
                          onClick={() => handleEditClick(notice)}
                          className="admin-btn-action"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteModal({
                              open: true,
                              type: 'notice',
                              id: notice.id,
                              title: notice.title,
                              photoUrl: '',
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

        {/* ================= TAB 3: STAFF MANAGEMENT ================= */}
        {activeTab === 'staff' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3>Staff &amp; Specialists Directory</h3>
                <p className="admin-card-subtitle-muted">
                  Changes sync automatically with the About Us &rarr; Our Staff &amp; Specialists section.
                </p>
              </div>
              {!isStaffFormOpen && (
                <button
                  type="button"
                  onClick={openAddStaffForm}
                  className="admin-btn-primary"
                  style={{ width: 'auto', padding: '9px 18px', fontSize: '13.5px' }}
                >
                  + Add Staff Member
                </button>
              )}
            </div>

            {staffMessage.text && (
              <div
                className={
                  staffMessage.type === 'error' ? 'admin-alert-error' : 'admin-alert-success'
                }
              >
                {staffMessage.text}
              </div>
            )}

            {isStaffFormOpen && (
              <div className="admin-staff-form-panel">
                <div className="admin-staff-form-header">
                  <h4>{editingStaffId ? 'Edit Staff Profile' : 'Add New Staff Member'}</h4>
                  <button
                    type="button"
                    onClick={() => {
                      resetStaffForm();
                      setIsStaffFormOpen(false);
                      setStaffMessage({ type: '', text: '' });
                    }}
                    className="admin-btn-action"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleStaffSubmit}>
                  <div className="admin-grid-2">
                    <div className="admin-form-group">
                      <label htmlFor="staff-name">Full Name *</label>
                      <input
                        id="staff-name"
                        type="text"
                        required
                        minLength={2}
                        maxLength={120}
                        className="admin-form-input"
                        value={staffName}
                        onChange={(e) => setStaffName(e.target.value)}
                        placeholder="e.g. Dr. Arjun Nair"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label htmlFor="staff-designation">Designation *</label>
                      <input
                        id="staff-designation"
                        type="text"
                        required
                        minLength={2}
                        maxLength={150}
                        className="admin-form-input"
                        value={staffDesignation}
                        onChange={(e) => setStaffDesignation(e.target.value)}
                        placeholder="e.g. Lead Sports Physiotherapist"
                      />
                    </div>
                  </div>

                  <div className="admin-grid-2">
                    <div className="admin-form-group">
                      <label htmlFor="staff-department">Department / Unit *</label>
                      <select
                        id="staff-department"
                        className="admin-form-select"
                        value={staffDepartment}
                        onChange={(e) => {
                          const nextValue = e.target.value;
                          setStaffDepartment(nextValue);
                          if (nextValue !== CUSTOM_DEPARTMENT_VALUE) {
                            setCustomDepartment('');
                          }
                        }}
                      >
                        {!availableDepartments.includes(staffDepartment) &&
                          staffDepartment &&
                          staffDepartment !== CUSTOM_DEPARTMENT_VALUE && (
                            <option value={staffDepartment}>{staffDepartment}</option>
                          )}
                        {availableDepartments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                        <option value={CUSTOM_DEPARTMENT_VALUE}>+ Add New Role / Department...</option>
                      </select>
                      {staffDepartment === CUSTOM_DEPARTMENT_VALUE && (
                        <input
                          id="staff-department-custom"
                          type="text"
                          required
                          minLength={2}
                          maxLength={100}
                          className="admin-form-input"
                          style={{ marginTop: '10px' }}
                          value={customDepartment}
                          onChange={(e) => setCustomDepartment(e.target.value)}
                          placeholder="Enter new role or department (e.g. Sports Nutrition)"
                          aria-label="New Role or Department"
                        />
                      )}
                      {staffDepartment === 'Leadership' && (
                        <p className="admin-card-subtitle-muted" style={{ marginTop: '8px' }}>
                          Profiles assigned to <strong>Leadership</strong> populate the Our Leadership (Director) section on the home page.
                        </p>
                      )}
                    </div>

                    <div className="admin-form-group">
                      <label htmlFor="staff-order">Display Order</label>
                      <input
                        id="staff-order"
                        type="number"
                        min={0}
                        max={999}
                        className="admin-form-input"
                        value={staffOrder}
                        onChange={(e) => setStaffOrder(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="staff-bio">Biographical Information *</label>
                    <textarea
                      id="staff-bio"
                      required
                      maxLength={5000}
                      className="admin-form-textarea"
                      value={staffBio}
                      onChange={(e) => setStaffBio(e.target.value)}
                      placeholder="Share qualifications, clinical specializations, certifications, and sporting background..."
                    />
                  </div>

                  <div className="admin-form-group" style={{ marginBottom: '24px' }}>
                    <label htmlFor="staff-photo-input">
                      {editingStaffId ? 'Replace or Update Photo' : 'Staff Photo'}
                    </label>
                    <div
                      className={`admin-file-upload-box${staffPhotoDragActive ? ' drag-active' : ''}`}
                      onDragEnter={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setStaffPhotoDragActive(true);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setStaffPhotoDragActive(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setStaffPhotoDragActive(false);
                      }}
                      onDrop={handleStaffPhotoDrop}
                    >
                      <input
                        ref={staffPhotoInputRef}
                        id="staff-photo-input"
                        type="file"
                        accept="image/*"
                        onChange={handleStaffPhotoChange}
                      />
                      <p className="admin-upload-text">
                        {staffPhotoFile
                          ? `Selected: ${staffPhotoFile.name}`
                          : editingStaffId
                          ? 'Click or drag image file to replace current photo'
                          : 'Click or drag portrait photo to upload'}
                      </p>
                      <span className="admin-upload-hint">
                        JPG, PNG or WebP up to 5 MB · Stored in Supabase staff-photos bucket
                      </span>
                    </div>

                    {staffPhotoPreview ? (
                      <div className="admin-staff-photo-preview-row">
                        <img
                          src={staffPhotoPreview}
                          alt="Selected staff preview"
                          className="admin-staff-preview-img"
                        />
                        <div>
                          <div className="admin-preview-label">New Photo Preview</div>
                          <button
                            type="button"
                            onClick={handleDiscardNewStaffPhoto}
                            className="admin-btn-action delete"
                          >
                            Discard Selected Photo
                          </button>
                        </div>
                      </div>
                    ) : staffExistingPhotoUrl && !removeExistingStaffPhoto ? (
                      <div className="admin-staff-photo-preview-row">
                        <img
                          src={staffExistingPhotoUrl}
                          alt={staffName || 'Current staff photo'}
                          className="admin-staff-preview-img"
                        />
                        <div>
                          <div className="admin-preview-label">Current Profile Photo</div>
                          <button
                            type="button"
                            onClick={handleToggleRemoveExistingPhoto}
                            className="admin-btn-action delete"
                          >
                            Remove Existing Photo
                          </button>
                        </div>
                      </div>
                    ) : removeExistingStaffPhoto ? (
                      <div className="admin-staff-photo-preview-row">
                        <span className="admin-photo-remove-note">
                          Existing photo will be removed when saved.
                        </span>
                        <button
                          type="button"
                          onClick={handleToggleRemoveExistingPhoto}
                          className="admin-btn-action"
                        >
                          Keep Existing Photo
                        </button>
                      </div>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    disabled={staffSubmitting}
                    className="admin-btn-primary"
                    style={{ width: 'auto', padding: '12px 32px' }}
                  >
                    {staffSubmitting
                      ? 'Saving Staff Profile...'
                      : editingStaffId
                      ? 'Update Staff Member'
                      : 'Add Staff Member'}
                  </button>
                </form>
              </div>
            )}

            {dataLoading ? (
              <div className="admin-empty-state">Loading staff directory...</div>
            ) : staffMembers.length === 0 ? (
              <div className="admin-empty-state">
                No staff profiles added yet. Click &ldquo;+ Add Staff Member&rdquo; to publish your
                first specialist on the website.
              </div>
            ) : (
              <div className="admin-staff-grid">
                {staffMembers.map((member) => (
                  <article key={member.id} className="admin-staff-card">
                    <div>
                      <div className="admin-staff-card-top">
                        {member.photo_url ? (
                          <img
                            src={member.photo_url}
                            alt={member.name}
                            className="admin-staff-thumb"
                          />
                        ) : (
                          <div className="admin-staff-thumb-fallback" aria-hidden="true">
                            {getStaffInitials(member.name)}
                          </div>
                        )}

                        <div className="admin-staff-identity">
                          <span className="admin-category-pill">{member.designation}</span>
                          <h4>{member.name}</h4>
                          <span className="admin-staff-order">
                            {member.department ? `${member.department} · ` : ''}Order #
                            {Number(member.display_order) || 0}
                          </span>
                        </div>
                      </div>

                      <p className="admin-staff-bio" style={{ marginTop: '14px' }}>
                        {member.bio}
                      </p>
                    </div>

                    <div className="admin-card-actions">
                      <button
                        type="button"
                        onClick={() => handleEditStaffClick(member)}
                        className="admin-btn-action"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteModal({
                            open: true,
                            type: 'staff',
                            id: member.id,
                            title: member.name,
                            photoUrl: member.photo_url || '',
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

        {/* ================= TAB 4: ENQUIRIES INBOX ================= */}
        {activeTab === 'enquiries' && (
          <div className="admin-card">
            <div className="admin-enquiries-header">
              <div>
                <h3>Contact Enquiries Inbox</h3>
                <p className="admin-card-subtitle-muted">
                  Search incoming leads and follow up via direct call or WhatsApp.
                </p>
              </div>
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
                          <div className="admin-lead-phone">{enq.phone}</div>
                        </td>
                        <td>
                          <div>{enq.location || 'Bangalore'}</div>
                          <span className="admin-lead-source">{enq.source || 'Website'}</span>
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
                                  aria-label={`Call ${enq.full_name}`}
                                >
                                  <Phone size={14} />
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
                                  aria-label={`WhatsApp ${enq.full_name}`}
                                >
                                  <MessageSquare size={14} />
                                </a>
                              </>
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteModal({
                                  open: true,
                                  type: 'enquiry',
                                  id: enq.id,
                                  title: `Enquiry from ${enq.full_name}`,
                                  photoUrl: '',
                                })
                              }
                              className="admin-btn-action delete"
                              style={{ padding: '7px 9px' }}
                              title="Delete Enquiry"
                              aria-label={`Delete enquiry from ${enq.full_name}`}
                            >
                              <Trash2 size={14} />
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
      </div>

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
                  setDeleteModal({ open: false, type: '', id: null, title: '', photoUrl: '' })
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
