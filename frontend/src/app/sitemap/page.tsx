import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ArrowRight, Map, User, FileText, Headphones, Building, 
  Gift, ChevronRight, Compass, Shield, Heart, Zap
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sitemap | Vaitour',
  description: 'Navigate the entire Vaitour ecosystem with our comprehensive sitemap.',
};

export default function SitemapPage() {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* HERO SECTION */}
      <div 
        style={{ 
          background: '#0f172a', 
          padding: '80px 24px', 
          textAlign: 'center', 
          color: '#fff',
          marginBottom: '60px'
        }}
      >
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '-1px', color: '#ffffff' }}>Platform Sitemap</h1>
        <p style={{ fontSize: '1.15rem', color: '#cbd5e1', maxWidth: '750px', margin: '0 auto', lineHeight: 1.6 }}>
          Explore the complete architectural layout of the Vaitour ecosystem. From hidden destinations to our exhaustive legal directories, find exactly what you are looking for in seconds.
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 3fr', gap: '40px', alignItems: 'start' }}>
        
        {/* STICKY SIDEBAR (TABLE OF CONTENTS) */}
        <div style={{ position: 'sticky', top: '100px', background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Site Directory
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><a href="#main-nav" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Map size={16} /> Main Exploration</a></li>
            <li><a href="#user-account" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}><User size={16} /> User Portals</a></li>
            <li><a href="#legal-policies" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={16} /> Legal & Policies</a></li>
            <li><a href="#support" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Headphones size={16} /> Help & Support</a></li>
            <li><a href="#company" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Building size={16} /> Company & Brand</a></li>
            <li><a href="#programs" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Gift size={16} /> Programs & Offers</a></li>
          </ul>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="card-panel" style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#334155' }}>
          
          <section id="main-nav" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>
              <Compass size={28} color="#0284c7" /> Main Exploration
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}><ChevronRight size={18} /> Home Page</Link>
              <Link href="/tours" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> All Tours & Experiences</Link>
              <Link href="/destinations" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Global Destinations</Link>
              <Link href="/blog" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Travel Blog & Guides</Link>
              <Link href="/destinations" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Advanced Search</Link>
            </div>
          </section>

          <section id="user-account" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>
              <User size={28} color="#16a34a" /> User Portals
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Link href="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Member Login</Link>
              <Link href="/signup" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Create Account</Link>
              <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> User Dashboard</Link>
              <Link href="/bookings" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> My Bookings</Link>
              <Link href="/saved" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Saved Wishlists</Link>
              <Link href="/profile/settings" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Account Settings</Link>
            </div>
          </section>

          <section id="legal-policies" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>
              <Shield size={28} color="#8b5cf6" /> Legal & Policies
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Link href="/privacy" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Comprehensive Privacy Policy</Link>
              <Link href="/terms" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Terms of Service</Link>
              <Link href="/refund-policy" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Global Refund Policy</Link>
              <Link href="/cancellation-policy" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Cancellation Guidelines</Link>
              <Link href="/cookies" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Cookie Management</Link>
            </div>
          </section>

          <section id="support" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>
              <Headphones size={28} color="#dc2626" /> Help & Support
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Link href="/support" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Global Support Center</Link>
              <Link href="/faq" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Frequently Asked Questions (FAQ)</Link>
              {/* <Link href="mailto:support@vaitour.com" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Contact Us</Link> */}
              <Link href="/safety" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Trust & Safety Hub</Link>
              <Link href="/accessibility" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Accessibility Features</Link>
            </div>
          </section>

          <section id="company" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>
              <Building size={28} color="#d97706" /> Company & Brand
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Link href="/about" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> About Vaitour</Link>
              <Link href="/careers" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Careers & Jobs</Link>
              <Link href="/press" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Press & Media Kit</Link>
              <Link href="/investors" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Investor Relations</Link>
              <Link href="/impact" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Environmental Impact</Link>
            </div>
          </section>

          <section id="programs" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>
              <Zap size={28} color="#0ea5e9" /> Programs & Offers
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Link href="/loyalty" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Vaitour Rewards</Link>
              <Link href="/affiliates" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Affiliate Network</Link>
              <Link href="/become-a-host" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Become a Host/Supplier</Link>
              <Link href="/gift-cards" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Digital Gift Cards</Link>
              <Link href="/corporate" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none' }}><ChevronRight size={18} /> Corporate Travel</Link>
            </div>
          </section>

          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginTop: '40px' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', marginBottom: '4px' }}>Can't find what you're looking for?</h4>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748b' }}>Our search engine is incredibly powerful. Try searching directly.</p>
            </div>
            <Link href="/destinations" className="btn-primary" style={{ padding: '10px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Go to Search <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
