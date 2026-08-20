import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ArrowRight, Info, List, Clock, Calendar, XCircle, 
  ShoppingBag, MousePointer, Activity, RefreshCcw, Heart, 
  Users, MapPin, Phone, CreditCard, Briefcase, 
  Shield, Globe, UserCheck, FileText
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cancellation Policy | TravelNest',
  description: 'Detailed, real-world cancellation guidelines, grace periods, and tier-based rules for all TravelNest bookings.',
};

export default function CancellationPolicyPage() {
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
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '-1px' }}>Complete Cancellation Guidelines</h1>
        <p style={{ fontSize: '1.15rem', color: '#cbd5e1', maxWidth: '750px', margin: '0 auto', lineHeight: 1.6 }}>
          Life happens, and plans change. Review our comprehensive 18-point cancellation guidelines designed to offer you maximum flexibility while protecting the livelihoods of our local partners.
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 3fr', gap: '40px', alignItems: 'start' }}>
        
        {/* STICKY SIDEBAR (TABLE OF CONTENTS) */}
        <div style={{ position: 'sticky', top: '100px', background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Policy Highlights
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><a href="#sec-1" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Cancellation Tiers</a></li>
            <li><a href="#sec-2" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>24-Hour Grace Period</a></li>
            <li><a href="#sec-3" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Standard Flex Policy</a></li>
            <li><a href="#sec-4" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Strict Non-Refundable</a></li>
            <li><a href="#sec-5" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Host Cancellations</a></li>
            <li><a href="#sec-6" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>How to Cancel</a></li>
            <li><a href="#sec-7" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Timezone Logic</a></li>
            <li><a href="#sec-8" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Alterations & Rescheduling</a></li>
            <li><a href="#sec-9" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Extenuating Circumstances</a></li>
            <li><a href="#sec-10" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Minimum Participants</a></li>
            <li><a href="#sec-11" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Flight & Transit Issues</a></li>
            <li><a href="#sec-12" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Account Credits & Vouchers</a></li>
            <li><a href="#sec-13" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Group & Corporate Events</a></li>
            <li><a href="#sec-14" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Safety & Security Threats</a></li>
            <li><a href="#sec-15" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Health & Travel Restrictions</a></li>
            <li><a href="#sec-16" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Third-Party Agent Bookings</a></li>
            <li><a href="#sec-17" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Dispute Resolution Center</a></li>
            <li><a href="#sec-18" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Contacting Support</a></li>
          </ul>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="card-panel" style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#334155', lineHeight: 1.8 }}>
          
          <div style={{ marginBottom: '32px', padding: '16px 20px', background: '#e0f2fe', borderRadius: '8px', borderLeft: '4px solid #0284c7', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Info size={24} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ margin: 0, color: '#0c4a6e', fontSize: '0.95rem' }}>
              <strong>Notice:</strong> This page outlines the physical act and rules of cancellation. For information regarding financial reimbursements and timelines, please refer to our <Link href="/refund-policy" style={{ color: '#0369a1', fontWeight: 700 }}>Refund Policy</Link>.
            </p>
          </div>

          <section id="sec-1" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <List size={28} color="#0284c7" /> Cancellation Tiers
            </h2>
            <p>Every tour, hotel, and experience on TravelNest is assigned a specific "Cancellation Tier" by the local supplier. You will always see this tier clearly badged on the booking page before you pay. The rules of your specific tier are legally binding the moment your booking is confirmed. If you cancel, the system applies the rules of your designated tier automatically.</p>
          </section>

          <section id="sec-2" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={28} color="#16a34a" /> 24-Hour Grace Period
            </h2>
            <p>Mistakes happen. If you accidentally book the wrong date or the wrong tour, you are protected by our 24-Hour Grace Period. Any booking can be canceled penalty-free within exactly 24 hours of the initial purchase, <strong>provided</strong> that the actual tour start time is still at least 72 hours away. Last-minute bookings do not qualify for this grace period.</p>
          </section>

          <section id="sec-3" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={28} color="#8b5cf6" /> Standard Flex Policy
            </h2>
            <p>This is our most common tier, applying to over 80% of experiences. Under the Standard Flex policy, you can cancel your booking up to 48 hours before the start of the experience without facing any penalties. If you cancel within 24 to 48 hours, a late cancellation fee is applied. Cancellations inside of 24 hours are finalized with a 100% penalty.</p>
          </section>

          <section id="sec-4" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <XCircle size={28} color="#dc2626" /> Strict Non-Refundable
            </h2>
            <p>Experiences marked "Strict" or "Non-Refundable" involve high-cost logistics, such as private helicopter charters or hard-to-get concert tickets. When you cancel a Strict booking, the supplier retains 100% of the funds immediately, regardless of how far in advance you cancel. We heavily advise purchasing comprehensive travel insurance for these bookings.</p>
          </section>

          <section id="sec-5" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingBag size={28} color="#d97706" /> Host & Supplier Cancellations
            </h2>
            <p>If a supplier cancels your booking due to staff illness, mechanical failure, or overbooking, you will immediately receive a notification via email and SMS. You will be fully refunded instantly, and our support team will offer you a priority discount code to help you seamlessly book an alternative experience for that same day.</p>
          </section>

          <section id="sec-6" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MousePointer size={28} color="#06b6d4" /> How to Cancel Your Booking
            </h2>
            <p>Cancellations must be executed through the TravelNest platform to be considered valid. Sending an email to the supplier or calling them does not officially cancel your trip in our system. You must log in, visit the "My Bookings" tab, select your itinerary, and click the red "Cancel" button. The timestamp of that click defines your cancellation window.</p>
          </section>

          <section id="sec-7" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={28} color="#3b82f6" /> Automated Timezone Logic
            </h2>
            <p>All cancellation deadlines are calculated based on the <strong>local timezone of the destination</strong>. For example, if you are booking a tour in Tokyo while sitting in New York, a "48-hour deadline" means 48 hours before the tour starts in Japan Standard Time (JST). Our system calculates this automatically for you.</p>
          </section>

          <section id="sec-8" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <RefreshCcw size={28} color="#14b8a6" /> Alterations & Rescheduling
            </h2>
            <p>If you do not want to cancel but simply need to change the date, time, or guest count, you can submit an "Alteration Request". Alterations are subject to the supplierâ€™s approval and real-time availability. If the supplier declines the alteration, your original booking remains active unless you choose to officially cancel it.</p>
          </section>

          <section id="sec-9" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Heart size={28} color="#be123c" /> Extenuating Circumstances
            </h2>
            <p>We override standard cancellation tiers only in severe, unforeseen circumstances (e.g., critical medical emergencies requiring official hospital documentation). It does not include normal illnesses, changes of mind, or standard flight delays. All extenuating circumstance claims must be reviewed manually by our legal team.</p>
          </section>

          <section id="sec-10" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={28} color="#6366f1" /> Minimum Participant Rules
            </h2>
            <p>Some group tours require a minimum number of travelers to operate (e.g., a boat charter). If this threshold is not met, the supplier reserves the right to cancel the tour up to 24 hours before departure. You will be offered a free upgrade to a private tour (if available), an alternative date, or a full refund.</p>
          </section>

          <section id="sec-11" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={28} color="#0ea5e9" /> Flight & Transit Issues
            </h2>
            <p>TravelNest is not responsible for delayed flights, canceled trains, or heavy traffic. Local guides are paid for their reserved time. If a transit delay causes you to miss a tour, it is treated as a late arrival/no-show. We strongly recommend booking experiences with a safe buffer after your flight lands.</p>
          </section>

          <section id="sec-12" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard size={28} color="#15803d" /> Account Credits & Vouchers
            </h2>
            <p>If you opt to cancel a non-refundable booking, a host may occasionally offer you TravelNest Account Credits as a gesture of goodwill instead of a cash refund. Once you accept account credits or a voucher for a future date, your original booking is considered officially canceled and cannot be reinstated or disputed for cash later.</p>
          </section>

          <section id="sec-13" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Briefcase size={28} color="#64748b" /> Group & Corporate Events
            </h2>
            <p>Bookings involving 10 or more guests, or officially designated corporate retreats, are bound by a separate set of commercial cancellation rules. Because large groups require hosts to block out significant calendar inventory, group cancellations typically require a minimum of 14 to 30 days' notice to avoid severe penalties.</p>
          </section>

          <section id="sec-14" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={28} color="#4f46e5" /> Safety & Security Threats
            </h2>
            <p>If a verified security threat, act of terrorism, severe political unrest, or a sudden Level 4 "Do Not Travel" advisory is issued by the government for your specific destination, TravelNest will immediately activate our emergency cancellation protocol, allowing all guests in the affected region to cancel without penalty.</p>
          </section>

          <section id="sec-15" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe size={28} color="#059669" /> Health & Travel Restrictions
            </h2>
            <p>In the event of sudden border closures, localized lockdowns, or newly implemented quarantine mandates (such as those seen during a pandemic), our Extenuating Circumstances policy will cover your cancellation. However, failure to obtain a basic tourist visa or forgetting to renew a passport is your personal responsibility and does not waive standard penalties.</p>
          </section>

          <section id="sec-16" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserCheck size={28} color="#0284c7" /> Third-Party Agent Bookings
            </h2>
            <p>If your reservation was made through a third-party affiliate, concierge service, or external travel agent using the TravelNest platform, you must initiate the cancellation through that specific agent. TravelNest support cannot manually override or cancel bookings that are professionally managed by an external B2B partner account.</p>
          </section>

          <section id="sec-17" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={28} color="#d946ef" /> Dispute Resolution Center
            </h2>
            <p>If you believe a host has unfairly denied your alteration request or wrongfully marked you as a no-show, you have 14 days to open a formal case in our Dispute Resolution Center. Our mediation team will review GPS check-ins, message histories, and timestamps to determine a fair and binding outcome regarding your cancellation.</p>
          </section>

          <section id="sec-18" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={28} color="#334155" /> Contacting Support
            </h2>
            <p>If you are experiencing technical difficulties that prevent you from clicking the "Cancel" button, you must contact our 24/7 support team immediately before your deadline passes. The precise timestamp of your initial email or chat message to our support team will be honored as your official cancellation time.</p>
          </section>

          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginTop: '40px' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', marginBottom: '4px' }}>Ready to manage a booking?</h4>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748b' }}>Log in to view your upcoming trips and cancellation options.</p>
            </div>
            <Link href="/login" className="btn-primary" style={{ padding: '10px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Manage Bookings <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
