import { Metadata } from 'next';
import FaqAccordion from './FaqAccordion';

// Using Next.js automatic Static Site Generation (SSG)
// Since this page does not use cookies, headers, or searchParams dynamically,
// Next.js will naturally pre-render it as a highly optimized static HTML page at build time.

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Vaitour',
  description: 'Find answers to common questions about booking tours, managing payments, and becoming a supplier on Vaitour.',
};

export default function FaqPage() {
  return (
    <div className="faq-page-container" style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .faq-hero-section { background: #0f172a; padding: 80px 24px; text-align: center; color: #fff; margin-bottom: 60px; }
        .faq-hero-title { font-size: 3rem; font-weight: 800; margin-bottom: 16px; color: #ffffff; }
        .faq-hero-desc { font-size: 1.2rem; color: #cbd5e1; max-width: 600px; margin: 0 auto; line-height: 1.6; }
        
        .faq-accordion-layout { display: grid; grid-template-columns: 280px 1fr; gap: 32px; align-items: start; }
        .faq-sidebar { position: sticky; top: 100px; background: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(15,23,42,0.06); }
        .faq-wrapper { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        
        @media (max-width: 768px) {
          .faq-hero-section { padding: 50px 16px; margin-bottom: 40px; }
          .faq-hero-title { font-size: 2.2rem; }
          .faq-hero-desc { font-size: 1rem; }
          
          .faq-wrapper { padding: 0 16px; }
          .faq-accordion-layout { grid-template-columns: 1fr; gap: 24px; }
          .faq-sidebar { position: static; max-height: none; margin-bottom: 0px; }
        }
      `}} />
      {/* HERO SECTION */}
      <div className="faq-hero-section">
        <h1 className="faq-hero-title">How can we help you?</h1>
        <p className="faq-hero-desc">
          Browse through our frequently asked questions below to find quick answers about your Vaitour experience.
        </p>
      </div>

      {/* ACCORDION CONTAINER WITH STICKY TABLE OF CONTENTS */}
      <div className="faq-wrapper">
        <FaqAccordion />
      </div>
    </div>
  );
}
