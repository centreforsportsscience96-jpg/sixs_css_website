import React from 'react';
import { Link, useParams, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowLeft } from 'lucide-react';
import Seo from '../components/Seo';
import servicesData from '../data/servicesData';

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

const ServiceDetailPage = () => {
  const { category } = useParams();
  const location = useLocation();
  const service = servicesData[category];

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  // If we arrived here via a "Learn More" card that recorded where it came
  // from, send the back link there instead of always to the general
  // Services page — so it works the same regardless of browser history.
  const backTo = location.state?.from === '/' ? '/' : '/services';
  const backLabel = backTo === '/' ? 'Back to Home' : 'All Services';

  return (
    <motion.main
      className="page-wrapper"
      style={{ paddingTop: '120px', minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <Seo
        title={`${service.title} in Bangalore | Centre For Sports Science`}
        description={service.description}
        path={`/services/${category}`}
      />

      {/* Header */}
      <section className="container" style={{ marginBottom: '64px' }}>
        <Reveal>
          <Link to={backTo} className="about-label" style={{ textDecoration: 'none', marginBottom: '24px', display: 'inline-flex' }}>
            <ArrowLeft size={18} style={{ marginRight: '8px' }} />
            {backLabel}
          </Link>
          <h1 className="hero-title" style={{ color: 'var(--primary-dark)', fontSize: 'clamp(32px, 6vw, 56px)', maxWidth: '900px', marginBottom: '24px' }}>
            {service.title}
          </h1>
          <p className="about-text" style={{ maxWidth: '800px', fontSize: '20px' }}>
            {service.description}
          </p>
        </Reveal>
      </section>

      {/* Pricing Table */}
      <section className="container" style={{ paddingBottom: '80px' }}>
        <Reveal>
          <h2 className="section-title" style={{ marginBottom: '32px' }}>Pricing</h2>
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
                {service.pricingRows.map((row) => (
                  <tr key={`${row.package}-${row.duration}`}>
                    <td>{row.package}</td>
                    <td>{row.duration}</td>
                    <td>{row.focus}</td>
                    <td>
                      {row.price.includes('OFF') ? (
                        <span className="discount">{row.price}</span>
                      ) : (
                        row.price
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* Package Details */}
      <section style={{ backgroundColor: 'white', padding: '100px 0' }}>
        <div className="container">
          <Reveal>
            <h2 className="category-title">{service.title} Packages</h2>
            <div className="package-grid">
              {service.packages.map((pkg) => (
                <div key={pkg.title} className={`package-card${pkg.premium ? ' premium-card' : ''}`}>
                  <h3>{pkg.title}</h3>
                  <div className="price">
                    {pkg.price}
                    {pkg.priceSuffix && <span> {pkg.priceSuffix}</span>}
                    {pkg.discountBadge && <span className="discount-badge">{pkg.discountBadge}</span>}
                  </div>
                  {pkg.subPrice && <div className="sub-price">{pkg.subPrice}</div>}
                  {pkg.subtitle && (
                    <p style={{ color: 'var(--accent)', fontWeight: 600, marginBottom: '24px' }}>{pkg.subtitle}</p>
                  )}

                  {pkg.features && (
                    <ul className="package-features">
                      {pkg.features.map((f) => (
                        <li key={f}><Check size={16} /> {f}</li>
                      ))}
                    </ul>
                  )}

                  {pkg.featureGroups && pkg.featureGroups.map((group) => (
                    <div key={group.heading}>
                      <h4 style={{ marginBottom: '12px' }}>{group.heading}</h4>
                      <ul className="package-features" style={{ marginBottom: '24px' }}>
                        {group.features.map((f) => (
                          <li key={f}><Check size={16} /> {f}</li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {pkg.note && (
                    <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>{pkg.note}</p>
                  )}

                  {pkg.ideal && <div className="package-ideal">{pkg.ideal}</div>}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{ textAlign: 'center', marginTop: '64px' }}>
              <Link to="/contact" className="btn btn-primary" style={{ padding: '16px 40px' }}>
                Book {service.title}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </motion.main>
  );
};

export default ServiceDetailPage;
