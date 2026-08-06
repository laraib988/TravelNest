'use client';

import Link from 'next/link';
import { Compass, ShieldCheck, Globe, Users, Award, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px 80px' }}>
      
      {/* HEADER HERO */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div className="badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <Sparkles size={14} /> About TravelNest Tours
        </div>
        <h1 style={{ fontSize: '2.8rem', color: '#0f172a', fontWeight: 800, marginBottom: '16px' }}>
          Redefining Global Travel & Unforgettable Experiences
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '760px', margin: '0 auto', lineHeight: 1.6 }}>
          TravelNest is a global Online Travel Agency (OTA) marketplace combining top-rated tours, activities, sunset cruises, food walks, and AI trip planning powered by Ebadah Group Co. Ltd Japan.
        </p>
      </div>

      {/* STATS STRIP */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '60px' }}>
        <div className="card-panel" style={{ textAlign: 'center', padding: '30px' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '4px' }}>50,000+</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>Happy Travelers</p>
        </div>
        <div className="card-panel" style={{ textAlign: 'center', padding: '30px' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#059669', marginBottom: '4px' }}>100%</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>KYC Verified Local Guides</p>
        </div>
        <div className="card-panel" style={{ textAlign: 'center', padding: '30px' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#7c3aed', marginBottom: '4px' }}>120+</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>Global Destinations</p>
        </div>
        <div className="card-panel" style={{ textAlign: 'center', padding: '30px' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#d97706', marginBottom: '4px' }}>4.9 ★</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>Average Review Score</p>
        </div>
      </div>

      {/* CORE MISSION */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '2rem', color: '#0f172a', fontWeight: 800, marginBottom: '16px' }}>
            Our Mission & Vision
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '20px' }}>
            We believe travel should be seamless, transparent, and authentic. By leveraging cutting-edge real-time inventory locks, OCR document verification, and AI trip planning, TravelNest empowers local tour suppliers while delivering peace of mind to travelers.
          </p>
          <div style={{ display: 'flex', gap: '14px' }}>
            <Link href="/" className="btn-primary" style={{ padding: '12px 24px' }}>
              Explore All Tours
            </Link>
            <Link href="/contact" className="btn-secondary" style={{ padding: '12px 24px' }}>
              Contact Our Team
            </Link>
          </div>
        </div>

        <div className="card-panel" style={{ padding: '32px', background: '#f8fafc', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '14px', fontWeight: 700 }}>
            Corporate Headquarters
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '12px' }}>
            <strong>Ebadah Group Co. Ltd Japan</strong><br />
            2nd Floor, Sotoike Shukugo Building,<br />
            Utsunomiya City, Tochigi, Japan.
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            <strong>Customer Support:</strong> +81 80-8357-2662<br />
            <strong>Email:</strong> support@travelnest.com
          </p>
        </div>
      </div>

    </div>
  );
}
