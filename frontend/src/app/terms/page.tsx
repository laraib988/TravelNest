import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ArrowRight, Info, CheckSquare, UserCheck, Key, Globe, 
  CheckCircle, Tag, CreditCard, AlertTriangle, ShoppingBag, 
  FileText, MessageSquare, Lock, Link as LinkIcon, AlertCircle, 
  Briefcase, XCircle, Map, RefreshCcw
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | TravelNest',
  description: 'Legally binding terms, conditions, and user responsibilities for utilizing the TravelNest platform.',
};

export default function TermsOfServicePage() {
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
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '-1px' }}>TravelNest Terms of Service Agreement</h1>
        <p style={{ fontSize: '1.15rem', color: '#cbd5e1', maxWidth: '750px', margin: '0 auto', lineHeight: 1.6 }}>
          By accessing and using TravelNest, you agree to comply with our global standards. Review these 18 foundational rules that govern our marketplace, protect your rights, and ensure a secure ecosystem for all travelers and hosts.
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 3fr', gap: '40px', alignItems: 'start' }}>
        
        {/* STICKY SIDEBAR (TABLE OF CONTENTS) */}
        <div style={{ position: 'sticky', top: '100px', background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Table of Contents
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><a href="#sec-1" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Acceptance of Terms</a></li>
            <li><a href="#sec-2" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>User Eligibility</a></li>
            <li><a href="#sec-3" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Account Responsibilities</a></li>
            <li><a href="#sec-4" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Platform Role</a></li>
            <li><a href="#sec-5" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Booking Confirmations</a></li>
            <li><a href="#sec-6" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Pricing & Taxes</a></li>
            <li><a href="#sec-7" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Payment Terms</a></li>
            <li><a href="#sec-8" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>User Conduct</a></li>
            <li><a href="#sec-9" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Supplier Obligations</a></li>
            <li><a href="#sec-10" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Intellectual Property</a></li>
            <li><a href="#sec-11" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Reviews & Content</a></li>
            <li><a href="#sec-12" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Privacy & Data</a></li>
            <li><a href="#sec-13" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Third-Party Links</a></li>
            <li><a href="#sec-14" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Limitation of Liability</a></li>
            <li><a href="#sec-15" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Indemnification</a></li>
            <li><a href="#sec-16" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Account Termination</a></li>
            <li><a href="#sec-17" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Governing Law</a></li>
            <li><a href="#sec-18" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Policy Updates</a></li>
          </ul>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="card-panel" style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#334155', lineHeight: 1.8 }}>
          
          <div style={{ marginBottom: '32px', padding: '16px 20px', background: '#e0f2fe', borderRadius: '8px', borderLeft: '4px solid #0284c7', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Info size={24} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ margin: 0, color: '#0c4a6e', fontSize: '0.95rem' }}>
              <strong>Effective Date: August 2026.</strong> These Terms of Service ("Terms") constitute a legally binding agreement between you and TravelNest. By accessing our platform, you agree to adhere to all stipulations listed below.
            </p>
          </div>

          <section id="sec-1" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckSquare size={28} color="#0284c7" /> Acceptance of Terms
            </h2>
            <p>By creating an account, browsing our catalog, or initiating a booking on TravelNest, you signify your absolute and irrevocable acceptance of these Terms. If you do not agree with any part of these conditions, you must immediately cease all usage of the TravelNest platform, application, and associated services.</p>
          </section>

          <section id="sec-2" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserCheck size={28} color="#16a34a" /> User Eligibility
            </h2>
            <p>To use our platform, you must be at least 18 years of age or the legal age of majority in your jurisdiction. By registering, you warrant that you possess the legal authority to enter into binding contracts. We reserve the right to suspend accounts that fail to provide legitimate proof of age upon request.</p>
          </section>

          <section id="sec-3" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Key size={28} color="#8b5cf6" /> Account Responsibilities
            </h2>
            <p>You are solely responsible for maintaining the confidentiality of your login credentials, including passwords and two-factor authentication tokens. You agree to accept full responsibility for all activities, bookings, and financial transactions that occur under your account, regardless of whether they were authorized by you directly.</p>
          </section>

          <section id="sec-4" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe size={28} color="#dc2626" /> Platform Role as Intermediary
            </h2>
            <p>TravelNest acts strictly as a technological intermediary connecting independent travelers with local tour operators, hotels, and experience providers. We do not own, operate, or directly manage any of the tours listed. Therefore, the actual contract of service is formed directly between you and the local supplier.</p>
          </section>

          <section id="sec-5" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={28} color="#d97706" /> Booking Confirmations
            </h2>
            <p>A booking is not legally binding until you receive a final "Booking Confirmed" email along with a verified digital ticket. In rare cases where a supplier's inventory suffers a simultaneous double-booking, we reserve the right to decline your reservation within 12 hours, issuing a full and immediate refund.</p>
          </section>

          <section id="sec-6" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Tag size={28} color="#06b6d4" /> Pricing & Taxes
            </h2>
            <p>All prices displayed on TravelNest are subject to real-time dynamic changes based on availability. While we strive to show the final inclusive price, certain local municipal taxes, environmental fees, or physical cash deposits may need to be paid directly to the supplier upon arrival, which will be clearly noted on your ticket.</p>
          </section>

          <section id="sec-7" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard size={28} color="#3b82f6" /> Payment Terms & Security
            </h2>
            <p>We process all payments through secure, PCI-DSS compliant third-party gateways. By submitting your payment details, you authorize us to charge your card for the total booking amount. You agree not to initiate fraudulent chargebacks and to resolve any financial disputes directly through our Customer Support center first.</p>
          </section>

          <section id="sec-8" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={28} color="#14b8a6" /> User Conduct
            </h2>
            <p>You agree to behave respectfully towards local guides, other guests, and our support staff. We operate a zero-tolerance policy against physical violence, hate speech, severe intoxication, or harassment during any TravelNest experience. Violation of this clause grants the supplier the right to terminate your tour instantly without a refund.</p>
          </section>

          <section id="sec-9" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingBag size={28} color="#be123c" /> Supplier Obligations
            </h2>
            <p>Suppliers using our platform are contractually bound to provide the exact experience described on their listing page. If a supplier fails to deliver critical components of the tour, substitutes locations without notice, or acts unprofessionally, they are subject to penalization, removal from the platform, and liability for your refund.</p>
          </section>

          <section id="sec-10" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={28} color="#6366f1" /> Intellectual Property
            </h2>
            <p>All content on this website, including logos, text, source code, UI designs, and proprietary booking algorithms, are the exclusive intellectual property of TravelNest. You may not scrape, copy, reverse-engineer, or reproduce any part of this platform for commercial purposes without our explicit written consent.</p>
          </section>

          <section id="sec-11" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MessageSquare size={28} color="#0ea5e9" /> Reviews & Content
            </h2>
            <p>By submitting a review or uploading photos of your trip, you grant TravelNest a perpetual, royalty-free, global license to display and utilize this content for marketing purposes. We reserve the right to delete reviews that contain profanity, personal information, or deliberate falsehoods intended to extort suppliers.</p>
          </section>

          <section id="sec-12" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock size={28} color="#15803d" /> Privacy & Data
            </h2>
            <p>Your personal data is managed strictly in accordance with global data protection laws (including GDPR and CCPA). We only share your name, phone number, and necessary physical requirements with the local supplier to facilitate the tour. We never sell your personal contact information to third-party marketing agencies.</p>
          </section>

          <section id="sec-13" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LinkIcon size={28} color="#3b82f6" /> Third-Party Links
            </h2>
            <p>Our platform may contain links to external websites, affiliate partners, or governmental visa portals. We do not endorse or take responsibility for the content, security, or privacy policies of these external sites. Clicking external links is done entirely at your own risk.</p>
          </section>

          <section id="sec-14" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={28} color="#ec4899" /> Limitation of Liability
            </h2>
            <p>To the maximum extent permitted by law, TravelNest shall not be liable for any direct, indirect, incidental, or consequential damages resulting from personal injuries, lost baggage, or emotional distress that occur during a booked experience. All inherent risks of travel are assumed entirely by the user.</p>
          </section>

          <section id="sec-15" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Briefcase size={28} color="#64748b" /> Indemnification
            </h2>
            <p>You agree to indemnify, defend, and hold harmless TravelNest, its directors, employees, and affiliates from any claims, lawsuits, liabilities, or expenses (including legal fees) arising out of your breach of these Terms, your violation of any laws, or any damages you cause to a local supplier's property.</p>
          </section>

          <section id="sec-16" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <XCircle size={28} color="#ef4444" /> Account Termination
            </h2>
            <p>We maintain the unilateral right to permanently terminate or suspend your access to the platform without prior notice if we detect suspicious activities, money laundering attempts, or repeated violations of our User Conduct policies. Terminated accounts forfeit any outstanding Wallet Credits instantly.</p>
          </section>

          <section id="sec-17" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Map size={28} color="#059669" /> Governing Law
            </h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which TravelNest is officially headquartered. Any legal disputes, class actions, or arbitration proceedings must be filed strictly within our designated local courts.</p>
          </section>

          <section id="sec-18" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <RefreshCcw size={28} color="#334155" /> Policy Updates
            </h2>
            <p>We reserve the right to revise, update, or completely rewrite these Terms of Service at our sole discretion. We will notify active users of significant material changes via email. Your continued use of the platform following any modifications constitutes your formal acceptance of the new Terms.</p>
          </section>

          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginTop: '40px' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', marginBottom: '4px' }}>Legal Inquiries?</h4>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748b' }}>If you have questions about these terms, reach out to our legal team.</p>
            </div>
            <Link href="mailto:support@travelnest.com" className="btn-primary" style={{ padding: '10px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Contact Legal <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
