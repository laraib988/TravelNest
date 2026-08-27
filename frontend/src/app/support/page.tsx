import { Metadata } from 'next';
import Link from 'next/link';

export const metadata = { alternates: { canonical: '/support' } };

import { 
  ArrowRight, Info, Headphones, Calendar, CreditCard, RefreshCcw, 
  User, Wrench, MessageSquare, Umbrella, AlertTriangle, Heart, 
  Users, Gift, Edit, Map, Briefcase, Clock, ArrowUpCircle
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Help & Support | Vaitour',
  description: 'Comprehensive help center and customer support resources for Vaitour users.',
};

export default function HelpSupportPage() {
  return (
    <div className="support-page-container" style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .support-hero-section { background: #0f172a; padding: 80px 24px; text-align: center; color: #fff; margin-bottom: 60px; }
        .support-hero-title { font-size: 3.5rem; font-weight: 900; margin-bottom: 20px; letter-spacing: -1px; color: #ffffff; }
        .support-hero-desc { font-size: 1.15rem; color: #cbd5e1; max-width: 750px; margin: 0 auto; line-height: 1.6; }
        
        .support-layout { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: minmax(280px, 1fr) 3fr; gap: 40px; align-items: start; }
        .support-sidebar { position: sticky; top: 100px; background: #fff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; max-height: calc(100vh - 120px); overflow-y: auto; }
        .support-main-content { background: #fff; padding: 40px; border-radius: 16px; border: 1px solid #e2e8f0; color: #334155; line-height: 1.8; }
        
        .contact-box { background: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-top: 40px; }
        .contact-box-content { flex: 1 1 200px; }
        
        @media (max-width: 768px) {
          .support-hero-section { padding: 50px 16px; margin-bottom: 40px; }
          .support-hero-title { font-size: 2.2rem; }
          .support-hero-desc { font-size: 1rem; }
          
          .support-layout { grid-template-columns: 1fr; padding: 0 16px; gap: 24px; }
          .support-sidebar { position: static; max-height: none; margin-bottom: 0px; }
          .support-main-content { padding: 24px 16px; }
          .support-main-content h2 { align-items: flex-start !important; line-height: 1.4; }
          .support-main-content h2 svg { flex-shrink: 0; margin-top: 4px; }
          
          .contact-box { flex-direction: column; text-align: center; }
          .contact-box a { width: 100%; justify-content: center; }
        }
      `}} />
      {/* HERO SECTION */}
      <div className="support-hero-section">
        <h1 className="support-hero-title">Global Support Center</h1>
        <p className="support-hero-desc">
          We are dedicated to ensuring your journeys are seamless and stress-free. Explore our massively detailed support directory below to find exhaustive answers, troubleshooting steps, and direct pathways to our customer success teams.
        </p>
      </div>

      <div className="support-layout">
        
        {/* STICKY SIDEBAR (TABLE OF CONTENTS) */}
        <div className="support-sidebar">
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Support Topics
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><a href="#sec-1" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Booking Assistance</a></li>
            <li><a href="#sec-2" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Payment & Billing</a></li>
            <li><a href="#sec-3" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Refund Status</a></li>
            <li><a href="#sec-4" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Account Management</a></li>
            <li><a href="#sec-5" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Technical Issues</a></li>
            <li><a href="#sec-6" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Host Communication</a></li>
            <li><a href="#sec-7" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Travel Insurance</a></li>
            <li><a href="#sec-8" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Emergency Response</a></li>
            <li><a href="#sec-9" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Accessibility</a></li>
            <li><a href="#sec-10" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Group Bookings</a></li>
            <li><a href="#sec-11" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Rewards & Credits</a></li>
            <li><a href="#sec-12" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Submitting Feedback</a></li>
            <li><a href="#sec-13" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Visa & Documents</a></li>
            <li><a href="#sec-14" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Supplier Partnerships</a></li>
            <li><a href="#sec-15" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Contacting Support</a></li>
            <li><a href="#sec-16" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Escalating Issues</a></li>
          </ul>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="support-main-content card-panel">
          
          <div style={{ marginBottom: '32px', padding: '16px 20px', background: '#e0f2fe', borderRadius: '8px', borderLeft: '4px solid #0284c7', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Info size={24} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ margin: 0, color: '#0c4a6e', fontSize: '0.95rem' }}>
              <strong>Support Directory:</strong> This exhaustive directory covers every conceivable aspect of using the Vaitour platform. Whether you are facing a minor technical glitch, an international payment failure, or a critical travel emergency, the protocols outlined here will guide you to immediate resolution.
            </p>
          </div>

          <section id="sec-1" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={28} color="#0284c7" /> Booking Assistance & Modifications
            </h2>
            <p>Our automated booking engine is designed to handle thousands of concurrent reservations with mathematical precision, but we understand that human plans are fluid and often subject to sudden, unforeseen changes. If you have successfully finalized a booking but later discover that you need to alter the dates, adjust the total number of participating guests, or change the designated meeting point, you do not necessarily have to cancel and rebook. Vaitour offers a deeply integrated "Modify Booking" feature located directly within your personal dashboard. This feature communicates in real-time with the local supplier’s inventory management system.</p>
            <p style={{ marginTop: '16px' }}>When you submit a modification request, the system instantly cross-references the supplier's available capacity for your newly requested date. If capacity exists, and the supplier’s specific rules permit alterations without penalty, the modification is approved instantaneously via an automated handshake. A freshly generated digital e-ticket will immediately populate in your inbox, reflecting the new itinerary. However, if your requested modification involves upgrading to a more expensive tier (e.g., upgrading from a standard walking tour to a private luxury vehicle tour), the system will seamlessly prompt you to pay the exact remaining fare difference through a secure popup. Conversely, if you are downgrading, the difference will be automatically credited back to your original payment method. Please be acutely aware that major modifications attempted within 24 hours of the tour's scheduled departure are generally blocked by the system to prevent logistical chaos for the local hosts.</p>
          </section>

          <section id="sec-2" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard size={28} color="#8b5cf6" /> Payment & Billing Inquiries
            </h2>
            <p>Navigating international payments across dozens of different currencies and banking jurisdictions can occasionally result in localized friction. At Vaitour, we process transactions globally using elite, PCI-DSS certified gateways like Stripe. If you encounter a frustrating "Payment Declined" or "Transaction Failed" error during the checkout process, the root cause is almost entirely dictated by your personal bank's automated fraud algorithms, rather than a failure of the Vaitour platform. Banks frequently flag sudden, high-value international transactions—especially travel-related purchases processed in a foreign currency—as suspicious, automatically placing a hard lock on the card to protect you from perceived theft.</p>
            <p style={{ marginTop: '16px' }}>To rapidly resolve this, your immediate first step should be to open your mobile banking application or call the toll-free number on the back of your credit card to verbally authorize the transaction. Once the bank clears the fraud flag, you can safely re-attempt the purchase on our checkout page. In the confusing event that you notice a "Double Charge" on your bank statement, please remain calm. In 99% of these scenarios, the second line item is simply a temporary "authorization hold" placed by the banking network to verify the funds exist, not a finalized capture of cash. This phantom hold will automatically dissolve and drop off your ledger within 3 to 5 business days without you needing to take any action. If you require a highly detailed, itemized commercial invoice for corporate accounting, tax write-offs, or employer reimbursement, you can generate a legally compliant PDF invoice directly from the "Billing History" tab in your account dashboard at any time.</p>
          </section>

          <section id="sec-3" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <RefreshCcw size={28} color="#16a34a" /> Refund Processing Status
            </h2>
            <p>When you initiate a voluntary cancellation within the allowable flex window, or if a local supplier is forced to cancel an experience due to extreme weather or logistical failure, our financial systems trigger an automated refund protocol within milliseconds. The exact amount of money owed back to you is immediately released from our holding escrow and transmitted directly back to your original payment processor. From our server's perspective, the refund is classified as "Completed" the moment the API call succeeds. We do not hold onto your funds to generate interest, and there is no human bottleneck intentionally delaying the release of your money.</p>
            <p style={{ marginTop: '16px' }}>However, the frustrating reality of the global banking architecture is that it takes significant time for legacy financial institutions to route that money back to your personal ledger. If you paid via a modern digital wallet like PayPal or Apple Pay, the funds typically reappear in your account within a blazing fast 24 to 48 hours. If you utilized a standard Visa or Mastercard credit card, the clearing house routing process typically takes anywhere from 5 to 7 business days. In extreme cases involving smaller regional banks or complex international currency conversions, this process can stretch up to an agonizing 14 to 21 days. If you have been waiting beyond this maximum threshold, please contact our support team. We will happily generate an official Acquirer Reference Number (ARN) cryptographic receipt for the transaction, which you can hand directly to your bank's manager to physically trace where the funds are stalled within their internal network.</p>
          </section>

          <section id="sec-4" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={28} color="#dc2626" /> Account & Profile Management
            </h2>
            <p>Your Vaitour account serves as the central command center for your entire global travel itinerary, housing your digital tickets, communication logs, and historical preferences. Keeping your profile meticulously updated is crucial to ensuring you never miss a vital tour update. If you have recently relocated to a new country, legally changed your surname due to marriage, or migrated to a new primary email address, you must update these details immediately within the "Profile Settings" dashboard. Failure to maintain an accurate phone number, for instance, could result in you missing a crucial SMS alert from a tour guide warning you that the meeting point has shifted due to localized street protests or road closures.</p>
            <p style={{ marginTop: '16px' }}>If you find yourself entirely locked out of your account—perhaps because you forgot a legacy password or lost access to the email inbox tied to the account—we have established highly rigorous account recovery protocols to prevent unauthorized hijacking. By navigating to the "Forgot Password" link on the login portal, you can trigger a multi-step verification process that utilizes SMS tokens or secondary backup emails to restore your access. In extreme cases where all digital access is lost, you must contact our specialized Account Security team. They will mandate that you provide government-issued photographic identification alongside a live facial verification scan to absolutely prove your identity before manually resetting your credentials. This strict, unyielding process ensures that malicious actors cannot steal your account to harvest your saved wallet credits or manipulate your upcoming, high-value luxury bookings.</p>
          </section>

          <section id="sec-5" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Wrench size={28} color="#d97706" /> Technical Troubleshooting
            </h2>
            <p>While our engineering teams work around the clock to maintain a flawless, bug-free platform, the massive complexity of interacting with thousands of different mobile devices, heavily customized browsers, and unstable international internet connections means that localized technical glitches are an inevitable reality. If you are experiencing a frustrating technical roadblock—such as a calendar widget refusing to load dates, an endless spinning wheel on the checkout page, or an inability to upload a required profile photo—the solution is usually found in basic client-side troubleshooting. In 90% of cases, these UI anomalies are caused by corrupted browser cache data, aggressive ad-blocking extensions improperly blocking our JavaScript bundles, or outdated browser versions that fail to support modern rendering protocols.</p>
            <p style={{ marginTop: '16px' }}>Before escalating the issue to our technical support team, we strongly advise performing a sequence of standard diagnostics. First, force a "Hard Refresh" of your browser (Ctrl + Shift + R on Windows, Cmd + Shift + R on Mac) to completely bypass the local cache and pull the freshest code from our servers. If the issue persists, attempt to replicate the action in a completely private "Incognito" or "InPrivate" browsing window, which temporarily disables all third-party extensions that might be interfering with our code. If you are using our mobile application and it repeatedly crashes upon opening, delete the app entirely, restart your device's operating system to clear the RAM, and download the latest, patched version directly from the iOS App Store or Google Play Store. If you have exhausted all of these local troubleshooting steps and the system remains unresponsive, please submit a detailed bug report to our engineering queue, including screenshots, the exact error code displayed, and your device model, so our developers can replicate and patch the flaw.</p>
          </section>

          <section id="sec-6" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MessageSquare size={28} color="#06b6d4" /> Communicating with Local Hosts
            </h2>
            <p>One of the core pillars of the Vaitour philosophy is fostering authentic, direct human connections between global travelers and deeply knowledgeable local hosts. To facilitate this safely, we have engineered a sophisticated, deeply encrypted in-app messaging platform that activates the precise moment your booking is confirmed. We strongly, unconditionally mandate that all pre-tour and post-tour communication between you and the supplier remains strictly confined within this official chat interface. Taking communication off-platform (e.g., switching to private WhatsApp numbers or personal email chains) before the tour begins completely strips you of Vaitour's protective oversight, rendering our mediation teams powerless to help you if the host breaks promises, acts unprofessionally, or attempts to extort extra cash outside of our regulated payment gateways.</p>
            <p style={{ marginTop: '16px' }}>The in-app messaging system is your direct lifeline for hyper-specific logistical questions that our centralized support team cannot answer. If you need to know exactly how far the marina is from the central train station, if a restaurant can accommodate a severe, life-threatening peanut allergy, or if the hiking trail requires specialized boots, you should message the host directly. Because our suppliers operate in various global time zones and are often physically out leading tours during the day, we ask that you allow a standard 24-hour window for them to formulate a response. If a host completely ignores your critical messages for more than 48 hours leading up to a tour, our automated systems will flag the silence, and a Vaitour support agent will proactively intervene, utilizing our emergency vendor hotlines to force a response or offer you an immediate cancellation and rebooking with a more responsive, professional operator.</p>
          </section>

          <section id="sec-7" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Umbrella size={28} color="#3b82f6" /> Travel Insurance & Claims
            </h2>
            <p>While we meticulously vet every single supplier on our platform for rigorous safety standards and proper licensing, the inherent nature of international travel involves unavoidable chaos. Flights get delayed by severe winter storms, sudden illnesses strike the night before a non-refundable luxury cruise, and valuable cameras get dropped into the ocean during kayaking excursions. Vaitour is fundamentally a booking intermediary, not a licensed insurance underwriter. Therefore, we do not provide default, blanket insurance coverage that protects your personal health, your physical belongings, or the financial loss resulting from missing a strict, non-refundable tour due to circumstances entirely outside of your control.</p>
            <p style={{ marginTop: '16px' }}>Because of these unpredictable realities, we aggressively advocate that every traveler independently purchases a comprehensive, third-party travel insurance policy immediately after confirming their itinerary. A robust policy should cover emergency medical evacuations, trip cancellations due to bereavement, and lost baggage. If you are forced to miss a booked Vaitour experience due to a covered tragedy, you will likely need to file a formal financial claim with your chosen insurance provider to recoup the lost funds. To assist you in this bureaucratic process, our support team is fully equipped to provide you with officially stamped "Letters of Cancellation," finalized non-refundable invoices, or verified "Proof of No-Show" documents. These official digital certificates serve as the irrefutable evidence required by insurance adjusters to quickly process and approve your payout, minimizing the financial sting of an already stressful situation.</p>
          </section>

          <section id="sec-8" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={28} color="#14b8a6" /> Emergency Response & Safety
            </h2>
            <p>Your physical safety and psychological well-being are the absolute, non-negotiable bedrock of our operational ethos. We recognize that exploring unfamiliar environments in foreign countries carries inherent risks. If you ever find yourself in a situation during a Vaitour experience where you feel genuinely unsafe, threatened, harassed by a guide, or if you sustain a severe physical injury requiring medical intervention, your absolute first and immediate priority must be to contact the local emergency services (e.g., dialing 911, 112, or 999) to secure your immediate physical environment. Do not wait for a response from our app before seeking critical help from local authorities or paramedics.</p>
            <p style={{ marginTop: '16px' }}>Once the immediate physical danger has been neutralized and you are safe, you must immediately escalate the incident to the Vaitour Critical Response Team. We operate a specialized, 24/7 emergency hotline exclusively dedicated to handling severe safety breaches. When you report a critical safety incident, we instantly deploy a rapid response protocol: the associated supplier's account is immediately frozen to prevent them from taking on new guests, and an exhaustive, uncompromising internal investigation is launched in collaboration with local law enforcement if necessary. We maintain a zero-tolerance policy for violence, sexual harassment, extreme negligence, or systemic safety failures. If an operator is found to have violated our strict safety charters, they are permanently banned from the platform without appeal, and we will fully cooperate with legal authorities to ensure justice is served and future travelers are protected from harm.</p>
          </section>

          <section id="sec-9" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Heart size={28} color="#be123c" /> Accessibility Accommodations
            </h2>
            <p>Travel is a profoundly enriching human experience that must be universally accessible, regardless of physical mobility limitations, neurodivergence, or specialized medical requirements. Vaitour is deeply committed to breaking down the historical barriers that have made travel daunting for the disabled community. We have mandated that all suppliers on our platform must clearly and honestly categorize the accessibility levels of their tours—explicitly noting if a boat has a wheelchair ramp, if a museum tour involves navigating steep, uneven cobblestone staircases, or if a vehicle can safely stow heavy medical equipment like oxygen tanks or motorized scooters.</p>
            <p style={{ marginTop: '16px' }}>However, because the physical infrastructure in ancient cities (like Rome or Kyoto) or rugged natural landscapes often presents insurmountable physical barriers, we strongly urge travelers with specific mobility or medical needs to proactively contact the local host via the in-app messaging system long before confirming a non-refundable booking. By establishing this direct dialogue, you can ask hyper-specific questions (e.g., "Exactly how wide is the doorway to the restroom on the yacht?") to ensure the experience is not just technically possible, but genuinely comfortable and safe for you. If you require further assistance in verifying the accessibility claims of a specific tour, our specialized support agents can act as intermediaries, directly calling the local operators to rigorously interrogate their logistical setups on your behalf, ensuring you are never surprised by hidden barriers upon arrival.</p>
          </section>

          <section id="sec-10" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={28} color="#6366f1" /> Group Bookings & Corporate Retreats
            </h2>
            <p>Managing the logistics for a sprawling family reunion, a large university student group, or a highly structured corporate team-building retreat involves a level of complexity that far exceeds a standard booking. When coordinating experiences for groups exceeding 15 individuals, the standard rules of inventory, dynamic pricing, and immediate confirmation often break down, as local suppliers must charter larger private buses, hire additional specialized guides, or book out entire restaurants to accommodate your numbers safely. Therefore, massive group bookings cannot always be processed instantly through our standard automated checkout flow.</p>
            <p style={{ marginTop: '16px' }}>To facilitate these monumental logistical undertakings, Vaitour provides a dedicated "Group & Corporate Concierge" service. By submitting a detailed group request form outlining your headcount, exact dates, and specific experiential goals, you will be assigned a human concierge expert. This expert will act as your singular point of contact, negotiating bulk discount rates directly with local suppliers, orchestrating complex, multi-day itineraries, and structuring custom, staggered payment plans (such as a 30% upfront non-refundable deposit followed by a final balance payment 30 days before departure). This bespoke service ensures that large-scale corporate or educational events are executed flawlessly, shielding the organizer from the paralyzing stress of managing dozens of moving parts in a foreign country.</p>
          </section>

          <section id="sec-11" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Gift size={28} color="#0ea5e9" /> Rewards, Credits & Coupons
            </h2>
            <p>As a token of our immense gratitude for your ongoing loyalty to the Vaitour platform, we actively maintain a robust digital ecosystem of promotional coupons, seasonal discount codes, and permanent Wallet Credits. Wallet Credits act as a hyper-flexible digital currency bound directly to your user account. They are typically awarded when you voluntarily opt to receive a refund in the form of credits (often incentivized with a bonus percentage) or as goodwill compensation for minor experiential inconveniences. Unlike standard promotional codes, Wallet Credits behave exactly like liquid cash on our platform; they never expire, they carry no blackout dates, and they can be seamlessly combined with other sales to drastically reduce the final checkout price of your next grand adventure.</p>
            <p style={{ marginTop: '16px' }}>Conversely, promotional discount codes and marketing coupons operate under a much stricter set of temporal and logistical rules. These codes are frequently tied to specific seasonal marketing campaigns (e.g., "SUMMER2026") and inevitably feature hard expiration dates, minimum spend thresholds, and explicit restrictions excluding high-demand, luxury, or previously discounted inventory. It is critical to understand that the system architecture only allows for a single promotional code to be applied per transaction; aggressive "coupon stacking" is mechanically prevented by the checkout logic. Furthermore, if you decide to cancel a tour that was booked utilizing a promotional code, only the actual, out-of-pocket fiat currency you spent will be refunded to your bank. The value of the coupon itself instantly evaporates and will not be reinstated to your account, preventing systemic abuse of our marketing budgets.</p>
          </section>

          <section id="sec-12" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Edit size={28} color="#15803d" /> Submitting Feedback & Complaints
            </h2>
            <p>The entire qualitative foundation of the Vaitour marketplace is built upon the honest, unflinching, and detailed feedback provided by travelers like you. When an experience concludes, you will receive an automated prompt requesting a public review. We implore you to take this responsibility seriously. Your deeply detailed accounts of an exceptional, highly knowledgeable guide can instantly propel a small local business to massive global success. Conversely, your stark, honest warnings about a disorganized, unsafe, or disappointing tour serve as a critical defense mechanism, protecting thousands of future travelers from wasting their hard-earned money on a subpar experience.</p>
            <p style={{ marginTop: '16px' }}>However, if your experience was not merely mediocre but fundamentally disastrous—if a supplier completely failed to show up, provided broken equipment, or grossly misrepresented the tour itinerary—a public review is not sufficient. In these severe cases, you must immediately escalate the issue by submitting a formal Complaint Ticket to our Resolution Center within 72 hours of the tour's scheduled conclusion. To ensure a rapid and fair mediation, your complaint must be armed with irrefutable evidence. We require you to upload time-stamped photographs of the poor conditions, screenshots of any relevant text messages, and a chronological written account of the failure. Our specialized arbitration team will painstakingly review the evidence, cross-examine the supplier’s defense, and possesses the ultimate authority to unilaterally issue partial or full refunds directly from the supplier’s payouts, ensuring you are justly compensated for the failure.</p>
          </section>

          <section id="sec-13" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Map size={28} color="#64748b" /> Visa & International Documents
            </h2>
            <p>While Vaitour provides the definitive platform for booking unparalleled global experiences, navigating the complex, highly bureaucratic web of international border control remains the sole legal responsibility of the traveler. We do not provide personalized immigration consulting, nor can we intervene in governmental decisions. It is your absolute, unalienable duty to thoroughly research and obtain the correct tourist visas, electronic travel authorizations (e.g., ESTA or ETIAS), required vaccination certificates (such as Yellow Fever cards), and ensure that your passport possesses at least six months of validity beyond your scheduled return date, as mandated by the vast majority of sovereign nations.</p>
            <p style={{ marginTop: '16px' }}>If you arrive at an international airport or a border crossing and are denied boarding or entry by armed customs officials because you failed to secure the proper documentation, you will inevitably miss your booked Vaitour experiences. Under our strict, legally binding cancellation policies, failing to attend a tour due to a visa denial or passport issue is classified unequivocally as a "No-Show." Because the local supplier had reserved your spot and turned away other paying customers, they are entitled to full compensation, and no refunds will be issued under any circumstances. We strongly advise consulting official governmental embassy websites or utilizing specialized third-party visa agencies weeks before your departure to ensure your legal paperwork is flawless, preventing a bureaucratic oversight from destroying your vacation.</p>
          </section>

          <section id="sec-14" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Briefcase size={28} color="#4f46e5" /> Supplier Partnerships (For Hosts)
            </h2>
            <p>For the thousands of brilliant local guides, boutique hotel managers, and specialized expedition leaders who form the lifeblood of our platform, the "Host Support" ecosystem operates under an entirely different, highly specialized paradigm. If you are an active supplier seeking to optimize your business, you have access to a dedicated B2B (Business-to-Business) support infrastructure. This specialized team is trained to assist you with complex backend operations, such as integrating your proprietary inventory management software via our REST API, dynamically adjusting your seasonal pricing algorithms to maximize yield during off-peak months, or appealing an unfair, malicious review left by a hostile guest.</p>
            <p style={{ marginTop: '16px' }}>If you are a completely new operator hoping to list your exceptional experiences on Vaitour, you must first survive our notoriously rigorous vetting process. We do not accept every application. You must formally submit your company's official business registration licenses, comprehensive public liability insurance certificates, and verifiable proof of your operational history for intense scrutiny by our onboarding compliance officers. Once your documentation clears this high legal bar, you will be assigned a dedicated Account Manager. This expert will guide you through the intricacies of optimizing your digital storefront, mastering our booking algorithms, and scaling your local operations to meet the massive surge of global demand that comes from joining the world's premier travel marketplace.</p>
          </section>

          <section id="sec-15" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Headphones size={28} color="#059669" /> Contacting Support & Hours
            </h2>
            <p>We recognize that when you are stranded in a foreign country, navigating confusing transit systems across massive time zone differences, waiting 48 hours for a generic email response is utterly unacceptable. Therefore, Vaitour has heavily invested in a sprawling, multi-tiered global support infrastructure designed to provide immediate relief. Our frontline defenses consist of a highly sophisticated, AI-driven chatbot capable of instantly solving basic logistical issues—such as resending lost e-tickets, answering standard policy questions, or providing immediate translation services—in over 40 languages, available 24/7/365.</p>
            <p style={{ marginTop: '16px' }}>When your situation demands the nuanced empathy and complex problem-solving capabilities of a human being, our live support channels are ready. We operate massive, interconnected call centers in North America, Europe, and Asia, ensuring that no matter when disaster strikes, a highly trained agent is awake and ready to assist. Live Text Chat within our mobile application is available 24/7 for immediate, silent assistance, perfect for when you are on a noisy train. For highly complex, multi-faceted emergencies—such as coordinating a sudden medical evacuation or untangling a catastrophic, multi-city booking failure—our toll-free international phone lines are the preferred avenue. While phone support is generally available 24/7 in English, specialized language support (such as Spanish, Mandarin, or German) may be restricted to standard regional business hours.</p>
          </section>

          <section id="sec-16" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ArrowUpCircle size={28} color="#0284c7" /> Escalating Unresolved Issues
            </h2>
            <p>Despite our massive investments in training, technology, and quality control, we humbly acknowledge that our frontline support agents are human, and occasionally, a complex, highly nuanced case may be mishandled, misunderstood, or unfairly denied. If you have patiently navigated our standard support channels, submitted the required evidence, and still feel that the final resolution offered is fundamentally unjust, mathematically incorrect, or in direct violation of our published policies, you are not out of options. We have engineered a formal, highly structured escalation pathway designed to bypass the frontline tier and put your case directly in front of our senior leadership.</p>
            <p style={{ marginTop: '16px' }}>To trigger this protocol, you must reply to your existing support ticket explicitly requesting a "Tier 3 Managerial Escalation." When this specific phrase is used, the ticket is immediately yanked from the standard queue and assigned to a Senior Resolution Specialist—veterans of the company who possess the highest level of unilateral authority to override standard algorithms, issue immediate manual refunds out of our corporate budget, or ban problematic suppliers. These specialists will conduct a fresh, entirely unbiased forensic review of the communication logs, the supplier's history, and your submitted evidence. While this deep-dive investigation may take an additional 3 to 5 business days, it ensures that your grievance is heard by the highest echelons of the company, guaranteeing that ultimate fairness and logical justice dictate the final outcome of your dispute.</p>
          </section>

          <div className="contact-box">
            <div className="contact-box-content">
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', marginBottom: '4px' }}>Still need immediate help?</h4>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748b' }}>Our global support team is available 24/7 to assist you.</p>
            </div>
            <Link href="/contact" className="btn-primary" style={{ padding: '10px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Contact Support <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

