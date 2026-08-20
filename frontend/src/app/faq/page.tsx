import { Metadata } from 'next';
import FaqAccordion from './FaqAccordion';

// Using Next.js automatic Static Site Generation (SSG)
// Since this page does not use cookies, headers, or searchParams dynamically,
// Next.js will naturally pre-render it as a highly optimized static HTML page at build time.

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | TravelNest',
  description: 'Find answers to common questions about booking tours, managing payments, and becoming a supplier on TravelNest.',
};

export default function FaqPage() {
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
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px' }}>How can we help you?</h1>
        <p style={{ fontSize: '1.2rem', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto' }}>
          Browse through our frequently asked questions below to find quick answers about your TravelNest experience.
        </p>
      </div>

      {/* ACCORDION CONTAINER */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
        <FaqAccordion />
      </div>

      {/* STILL NEED HELP? */}
      <div style={{ maxWidth: '800px', margin: '60px auto 0', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ background: '#e0f2fe', borderRadius: '16px', padding: '40px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0369a1', marginBottom: '12px' }}>Still have questions?</h3>
          <p style={{ color: '#0ea5e9', marginBottom: '24px' }}>Our dedicated support team is available 24/7 to assist you.</p>
          <a href="mailto:support@travelnest.com" className="btn-primary" style={{ display: 'inline-block', padding: '12px 28px' }}>
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
