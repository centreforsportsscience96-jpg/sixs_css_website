import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Users, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'CS';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const StaffSection = ({ id = 'our-team' }) => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brokenImages, setBrokenImages] = useState({});
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeDepartment, setActiveDepartment] = useState('All');

  const fetchStaffMembers = useCallback(async () => {
    const { data, error } = await supabase
      .from('staff_members')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (!error && Array.isArray(data)) {
      setStaffMembers(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadInitial = async () => {
      const { data, error } = await supabase
        .from('staff_members')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (!isMounted) return;
      if (!error && Array.isArray(data)) {
        setStaffMembers(data);
      }
      setLoading(false);
    };

    loadInitial();

    const handleVisibilityRefresh = () => {
      if (document.visibilityState === 'visible') {
        fetchStaffMembers();
      }
    };

    const handleFocusRefresh = () => {
      fetchStaffMembers();
    };

    document.addEventListener('visibilitychange', handleVisibilityRefresh);
    window.addEventListener('focus', handleFocusRefresh);

    let channel = null;
    if (typeof supabase.channel === 'function') {
      channel = supabase
        .channel('public:staff_members')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'staff_members' },
          () => {
            fetchStaffMembers();
          }
        )
        .subscribe();
    }

    return () => {
      isMounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityRefresh);
      window.removeEventListener('focus', handleFocusRefresh);
      if (channel && typeof supabase.removeChannel === 'function') {
        supabase.removeChannel(channel);
      }
    };
  }, [fetchStaffMembers]);

  useEffect(() => {
    if (!selectedMember) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedMember(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMember]);

  const teamMembers = staffMembers.filter(
    (m) => (m.department || '').trim().toLowerCase() !== 'leadership'
  );
  const departments = Array.from(
    new Set(teamMembers.map((m) => (m.department || '').trim()).filter(Boolean))
  );
  const effectiveDepartment =
    activeDepartment === 'All' || departments.includes(activeDepartment)
      ? activeDepartment
      : 'All';
  const visibleMembers =
    effectiveDepartment === 'All'
      ? teamMembers
      : teamMembers.filter((m) => (m.department || '').trim() === effectiveDepartment);

  const gridVariantClass =
    visibleMembers.length === 1
      ? ' staff-grid-single'
      : visibleMembers.length === 2
      ? ' staff-grid-two'
      : '';

  return (
    <section id={id} className="staff-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="staff-header"
        >
          <div>
            <div className="about-label" style={{ marginBottom: '20px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Our Staff &amp; Specialists
            </div>
            <h2 className="staff-heading">
              Multidisciplinary sports science experts dedicated to your peak performance
            </h2>
          </div>
          <p className="staff-subheading">
            Work directly with our team of sports physiotherapists, strength &amp; conditioning coaches, sports biomechanists, and centre support specialists at Sree Kanteerava Stadium.
          </p>
        </motion.div>

        {loading ? (
          <div className="staff-grid" aria-busy="true" aria-label="Loading staff profiles">
            {[1, 2, 3].map((item) => (
              <div key={item} className="staff-skeleton-card">
                <div className="staff-skeleton-photo" />
                <div className="staff-skeleton-body">
                  <div className="staff-skeleton-line short" />
                  <div className="staff-skeleton-line title" />
                  <div className="staff-skeleton-line" />
                  <div className="staff-skeleton-line medium" />
                </div>
              </div>
            ))}
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="staff-empty-card">
            <div className="staff-empty-icon">
              <Users size={26} />
            </div>
            <h3>Team Roster Coming Soon</h3>
            <p>
              Our specialists’ profiles are currently being updated. Reach out to schedule an assessment with our multidisciplinary team in Bangalore.
            </p>
            <Link to="/contact" className="btn-black">
              Book a Consultation
            </Link>
          </div>
        ) : (
          <>
            {departments.length > 1 && (
              <div className="staff-filter-bar" role="tablist" aria-label="Filter staff by unit">
                <button
                  type="button"
                  role="tab"
                  aria-selected={effectiveDepartment === 'All'}
                  className={`staff-filter-pill${effectiveDepartment === 'All' ? ' active' : ''}`}
                  onClick={() => setActiveDepartment('All')}
                >
                  All Specialists ({teamMembers.length})
                </button>
                {departments.map((dept) => {
                  const count = teamMembers.filter(
                    (m) => (m.department || '').trim() === dept
                  ).length;
                  const isActive = effectiveDepartment === dept;
                  return (
                    <button
                      key={dept}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`staff-filter-pill${isActive ? ' active' : ''}`}
                      onClick={() => setActiveDepartment(dept)}
                    >
                      {dept} ({count})
                    </button>
                  );
                })}
              </div>
            )}

            <div className={`staff-grid${gridVariantClass}`}>
              {visibleMembers.map((member, index) => {
                const showPhoto = Boolean(member.photo_url) && !brokenImages[member.id];
                const bioText = (member.bio || '').trim();
                const hasLongBio = bioText.length > 150 || bioText.includes('\n');

                return (
                  <motion.article
                    key={member.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
                    className="staff-card"
                  >
                    <div className="staff-photo-wrap">
                      {showPhoto ? (
                        <img
                          src={member.photo_url}
                          alt={`${member.name} — ${member.designation}`}
                          className="staff-photo"
                          loading="lazy"
                          onError={() =>
                            setBrokenImages((prev) => ({ ...prev, [member.id]: true }))
                          }
                        />
                      ) : (
                        <div className="staff-photo-fallback" aria-hidden="true">
                          <span>{getInitials(member.name)}</span>
                        </div>
                      )}
                      {member.department && (
                        <span className="staff-photo-dept-badge">{member.department}</span>
                      )}
                    </div>

                    <div className="staff-card-body">
                      <h3 className="staff-name">{member.name}</h3>
                      <p className="staff-designation-line">{member.designation}</p>
                      <p className="staff-bio-excerpt">{bioText}</p>

                      <div className="staff-card-footer">
                        {hasLongBio ? (
                          <button
                            type="button"
                            className="staff-read-bio-btn"
                            onClick={() => setSelectedMember(member)}
                          >
                            Read Full Bio <ArrowUpRight size={15} />
                          </button>
                        ) : (
                          <span aria-hidden="true" />
                        )}
                        <Link to="/contact" className="staff-book-link">
                          Consult <ArrowUpRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </>
        )}
      </div>

      {selectedMember && (
        <div
          className="staff-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="staff-modal-title"
          onClick={() => setSelectedMember(null)}
        >
          <div className="staff-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="staff-modal-close"
              aria-label="Close biography modal"
              onClick={() => setSelectedMember(null)}
            >
              <X size={20} />
            </button>

            <div className="staff-modal-header">
              <div className="staff-modal-avatar">
                {selectedMember.photo_url && !brokenImages[selectedMember.id] ? (
                  <img
                    src={selectedMember.photo_url}
                    alt={`${selectedMember.name} — ${selectedMember.designation}`}
                  />
                ) : (
                  <div className="staff-photo-fallback" aria-hidden="true">
                    <span>{getInitials(selectedMember.name)}</span>
                  </div>
                )}
              </div>
              <div>
                {selectedMember.department && (
                  <span className="staff-modal-dept-pill">{selectedMember.department}</span>
                )}
                <h3 id="staff-modal-title" className="staff-modal-name">
                  {selectedMember.name}
                </h3>
                <p className="staff-designation-line" style={{ marginBottom: 0 }}>
                  {selectedMember.designation}
                </p>
              </div>
            </div>

            <div className="staff-modal-bio">{selectedMember.bio}</div>

            <div className="staff-modal-footer">
              <Link
                to="/contact"
                className="btn-black"
                onClick={() => setSelectedMember(null)}
              >
                Book an Assessment
              </Link>
              <button
                type="button"
                className="staff-modal-secondary-btn"
                onClick={() => setSelectedMember(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StaffSection;

