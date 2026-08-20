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
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px', color: '#ffffff' }}>How can we help you?</h1>
        <p style={{ fontSize: '1.2rem', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto' }}>
          Browse through our frequently asked questions below to find quick answers about your TravelNest experience.
        </p>
      </div>

      {/* ACCORDION CONTAINER WITH STICKY TABLE OF CONTENTS */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <FaqAccordion />
      </div>
    </div>
  );
}
