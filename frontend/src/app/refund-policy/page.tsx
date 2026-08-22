import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ArrowRight, Info, Clock, Shield, AlertCircle, 
  Cloud, ShoppingBag, MousePointer, PieChart, 
  UserX, Hourglass, Heart, CreditCard, Wallet, 
  Ticket, AlertTriangle, FileText, Users, Lock, Umbrella
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Refund Policy | Vaitour',
  description: 'Comprehensive information regarding our refund rules, cancellation windows, and processing timelines.',
};

export default function RefundPolicyPage() {
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
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '-1px', color: '#ffffff' }}>Complete Refund Policy Guidelines</h1>
        <p style={{ fontSize: '1.15rem', color: '#cbd5e1', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
          Your peace of mind is our priority. Explore our clear, detailed guidelines on refunds, cancellations, and coverage so you can book your next adventure with absolute confidence.
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 3fr', gap: '40px', alignItems: 'start' }}>
        
        {/* STICKY SIDEBAR (TABLE OF CONTENTS) */}
        <div style={{ position: 'sticky', top: '100px', background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Table of Contents
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><a href="#standard-cancellations" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Standard Cancellations</a></li>
            <li><a href="#non-refundable" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Non-Refundable Items</a></li>
            <li><a href="#weather-events" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Weather & Force Majeure</a></li>
            <li><a href="#supplier-rules" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Supplier-Specific Rules</a></li>
            <li><a href="#process-timelines" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Process & Timelines</a></li>
            <li><a href="#how-to-request" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>How to Request a Refund</a></li>
            <li><a href="#partial-refunds" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Partial Refunds</a></li>
            <li><a href="#no-show" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>No-Show Policy</a></li>
            <li><a href="#late-arrivals" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Late Arrivals</a></li>
            <li><a href="#medical-emergencies" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Medical Emergencies</a></li>
            <li><a href="#currency-exchange" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Currency & Exchange Rates</a></li>
            <li><a href="#wallet-credits" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Wallet Credits vs Cash</a></li>
            <li><a href="#promotions" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Promotions & Coupons</a></li>
            <li><a href="#group-bookings" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Group Bookings & Corporate</a></li>
            <li><a href="#third-party-insurance" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Third-Party Insurance Claims</a></li>
            <li><a href="#fraud-suspension" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Fraud & Account Suspension</a></li>
            <li><a href="#disputes" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Disputes & Chargebacks</a></li>
            <li><a href="#policy-changes" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Changes to the Policy</a></li>
          </ul>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="card-panel" style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#334155', lineHeight: 1.8 }}>
          
          <div style={{ marginBottom: '32px', padding: '16px 20px', background: '#e0f2fe', borderRadius: '8px', borderLeft: '4px solid #0284c7', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Info size={24} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ margin: 0, color: '#0c4a6e', fontSize: '0.95rem' }}>
              <strong>Last Updated: August 2026.</strong> This document constitutes our legally binding refund terms. Please read carefully before finalizing any booking on the Vaitour platform. Local suppliers may have overriding conditions displayed at checkout.
            </p>
          </div>

          <section id="standard-cancellations" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={28} color="#0284c7" /> Standard Cancellations
            </h2>
            <p>Our standard cancellation policy is specifically designed to provide you with maximum flexibility while simultaneously respecting the operational schedules and upfront costs of our local suppliers. For the vast majority of tours and activities marked with "Standard Flex" on the booking page:</p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li><strong>100% Refund:</strong> Cancellations made at least 48 hours prior to the scheduled start time of the experience.</li>
              <li><strong>50% Refund:</strong> Cancellations made between 24 and 48 hours prior to the scheduled start time.</li>
              <li><strong>0% Refund:</strong> Cancellations made less than 24 hours before the experience, as suppliers have already incurred irretrievable costs.</li>
            </ul>
          </section>

          <section id="non-refundable" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={28} color="#dc2626" /> Non-Refundable Items
            </h2>
            <p>Certain types of bookings are strictly non-refundable from the exact moment of purchase due to their dynamic pricing, scarcity, or strict third-party ticketing policies. These items include, but are not limited to:</p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li>Tickets for special events, concerts, seasonal festivals, and high-demand sporting events.</li>
              <li>Private charter bookings (e.g., luxury yachts, private jets, or exclusive helicopter tours).</li>
              <li>Skip-the-line museum or theme park tickets that are dynamically bound to a specific guest name and non-transferable time slot.</li>
              <li>Any experience explicitly badged and marked as "Strictly Non-Refundable" during your checkout process.</li>
            </ul>
          </section>

          <section id="weather-events" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cloud size={28} color="#eab308" /> Weather Events & Force Majeure
            </h2>
            <p>Your physical safety is our absolute, non-negotiable priority. If a tour or activity is canceled by the local supplier, harbor master, or governmental authorities due to genuinely unsafe weather conditions, natural disasters, or other Force Majeure events, you will be automatically granted two choices: Reschedule to a new date free of charge, or receive a full 100% refund. Please be aware that light rain or overcast conditions do not qualify as dangerous weather unless the supplier officially halts operations.</p>
          </section>

          <section id="supplier-rules" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingBag size={28} color="#8b5cf6" /> Supplier-Specific Rules
            </h2>
            <p>Vaitour operates as a global marketplace connecting you directly with thousands of independent local operators. While we enforce the baseline rules mentioned above, some highly exclusive suppliers (such as multi-day luxury safari operators or expedition cruise lines) enforce much stricter cancellation periods (e.g., requiring 14 or 30 days notice). If a supplier's specific refund policy differs from the Vaitour standard policy, the supplier's policy will always take legal precedence.</p>
          </section>

          <section id="process-timelines" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={28} color="#16a34a" /> Process & Timelines
            </h2>
            <p>Once your refund is approved by our automated system or manually by the supplier, the funds are released from our escrow immediately. However, the exact time it takes to reflect in your personal bank account depends entirely on your financial institution's processing speeds:</p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li><strong>Credit / Debit Cards:</strong> Typically 3 to 7 business days, though some international banks take up to 14 days.</li>
              <li><strong>PayPal / Digital Wallets:</strong> Extremely fast, usually processed within 1 to 2 business days.</li>
              <li><strong>Vaitour Wallet Credits:</strong> Instantaneous and available for immediate rebooking.</li>
            </ul>
          </section>

          <section id="how-to-request" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MousePointer size={28} color="#f97316" /> How to Request a Refund
            </h2>
            <p>You do not need to call our support hotline or send emails for standard cancellations within the allowable window. Simply log in to your Vaitour account, navigate to the "Manage Bookings" dashboard, select the upcoming booking you wish to cancel, and click the "Cancel Booking" button. The system will calculate your exact refund amount automatically based on the hour you initiate the cancellation.</p>
          </section>

          <section id="partial-refunds" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <PieChart size={28} color="#06b6d4" /> Partial Refunds
            </h2>
            <p>If you encounter a significant disruption or drop in quality during a tour (for example, if a promised included meal was not provided, a major tourist site was unexpectedly closed, or the duration was cut short), you may be eligible for a partial refund. All claims for partial compensation must be formally submitted through our resolution center within 72 hours of the tour's completion, accompanied by valid photographic or written proof.</p>
          </section>

          <section id="no-show" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserX size={28} color="#ef4444" /> No-Show Policy
            </h2>
            <p>Failing to arrive at the designated meeting point or pick-up location without any prior notice to the supplier is officially classified as a "No-Show". Because the local operator has already reserved your seat and turned away other potential customers, no-shows result in an automatic and strict 100% penalty. No refunds, partial credits, or complimentary rescheduling options will be offered under any circumstances.</p>
          </section>

          <section id="late-arrivals" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Hourglass size={28} color="#d97706" /> Late Arrivals
            </h2>
            <p>Group tours and shared activities run on very strict logistical schedules to respect the time of all participating guests. If you arrive late to the meeting point and the tour group has already departed, it will be treated exactly the same as a no-show. Local guides are contractually prohibited from delaying the experience for late arrivals, and missed departures will not be refunded.</p>
          </section>

          <section id="medical-emergencies" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Heart size={28} color="#be123c" /> Medical Emergencies
            </h2>
            <p>We understand that life is unpredictable. If you must suddenly cancel a booking within the 24-hour non-refundable penalty window due to a severe, unforeseen medical emergency or hospitalization, please contact our specialized support team immediately. Exceptions to our standard rules are made on a strict case-by-case basis and absolutely require verified official medical documentation or a stamped hospital admittance certificate.</p>
          </section>

          <section id="currency-exchange" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard size={28} color="#15803d" /> Currency & Exchange Rates
            </h2>
            <p>All refunds are processed by our payment gateways in the exact base currency that was used during your original checkout. Vaitour is not liable for any financial loss or fluctuations caused by changing exchange rates, nor are we responsible for any foreign transaction fees or conversion charges levied by your credit card provider between the time of purchase and the issuance of the refund.</p>
          </section>

          <section id="wallet-credits" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Wallet size={28} color="#3b82f6" /> Wallet Credits vs Cash
            </h2>
            <p>During a voluntary cancellation, the platform may occasionally offer you an additional financial incentive (bonus percentage) if you actively choose to receive your refund in the form of Vaitour Wallet Credits rather than cash back to your bank account. Please note that Wallet Credits do not expire, but once they are accepted, they are permanently locked to your account and cannot be retroactively withdrawn to a bank account.</p>
          </section>

          <section id="promotions" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Ticket size={28} color="#ec4899" /> Promotions & Coupons
            </h2>
            <p>If you utilized a promotional discount code, seasonal sale coupon, or loyalty points to book your experience, your final refund will only cover the actual, out-of-pocket amount charged to your credit card. Discount codes, promotional values, and applied points possess absolutely no cash equivalent value and will not be refunded, reimbursed, or reinstated to your account after cancellation.</p>
          </section>

          <section id="group-bookings" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={28} color="#0d9488" /> Group Bookings & Corporate
            </h2>
            <p>Large group reservations (typically defined as bookings involving 10 or more individuals) and specialized corporate retreats are subject to entirely different logistical constraints. These bookings usually require a non-refundable upfront deposit of 30% to secure blocks of inventory. The standard 48-hour cancellation flex policy does not apply to corporate or bulk group bookings unless explicitly negotiated in writing.</p>
          </section>

          <section id="third-party-insurance" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Umbrella size={28} color="#6366f1" /> Third-Party Insurance Claims
            </h2>
            <p>Vaitour strongly advises all guests to purchase comprehensive third-party travel insurance prior to departure. If your cancellation reason is not covered by our standard policy (e.g., missing a flight connection, lost passports, or minor illness), we will happily provide you with a formal "Cancellation Invoice" or "Proof of No-Show" document to assist you in claiming the lost amount from your travel insurance provider.</p>
          </section>

          <section id="fraud-suspension" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock size={28} color="#475569" /> Fraud & Account Suspension
            </h2>
            <p>If our automated security systems detect fraudulent behavior, stolen credit card usage, or systemic abuse of the cancellation system (such as repeatedly booking and canceling tours to manipulate inventory), Vaitour reserves the immediate right to cancel all active bookings associated with the account without issuing any refunds. The account will be permanently suspended pending legal review.</p>
          </section>

          <section id="disputes" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={28} color="#64748b" /> Disputes & Chargebacks
            </h2>
            <p>If you bypass our support team and unfairly initiate a credit card chargeback with your bank for a booking that was clearly marked non-refundable, your Vaitour account will be immediately frozen. We vigorously dispute fraudulent chargebacks using system logs, GPS check-in data from suppliers, and digital communication records. We always encourage resolving disputes directly with our customer support first.</p>
          </section>

          <section id="policy-changes" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={28} color="#334155" /> Changes to the Policy
            </h2>
            <p>Vaitour firmly reserves the right to amend, modify, or update this refund policy at any time to reflect changing global travel regulations. However, you are always protected: the specific policy version that was active and displayed at the exact time of your booking confirmation will always govern your trip, ensuring absolute fairness and protection against retroactive changes.</p>
          </section>

          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginTop: '40px' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', marginBottom: '4px' }}>Need manual assistance?</h4>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748b' }}>If you missed your trip due to an emergency, contact us directly.</p>
            </div>
            <Link href="mailto:support@vaitour.com" className="btn-primary" style={{ padding: '10px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Contact Support <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
