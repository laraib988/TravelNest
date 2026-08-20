import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ArrowRight, Info, Gift, Activity, Award, Shield, Star, 
  Zap, CreditCard, Clock, TrendingUp, Briefcase, Users, 
  FastForward, Share2, AlertTriangle, Lock, FileText
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Loyalty & Rewards | TravelNest',
  description: 'Explore the TravelNest Rewards program. Learn how to earn points, unlock elite tiers, and travel the world for less.',
};

export default function LoyaltyRewardsPage() {
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
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '-1px', color: '#ffffff' }}>TravelNest Rewards Program</h1>
        <p style={{ fontSize: '1.15rem', color: '#cbd5e1', maxWidth: '750px', margin: '0 auto', lineHeight: 1.6 }}>
          Your loyalty deserves to be aggressively rewarded. Dive into our incredibly detailed, multi-tiered rewards ecosystem designed to give you unprecedented value, exclusive VIP upgrades, and free global travel.
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 3fr', gap: '40px', alignItems: 'start' }}>
        
        {/* STICKY SIDEBAR (TABLE OF CONTENTS) */}
        <div style={{ position: 'sticky', top: '100px', background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Rewards Directory
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><a href="#sec-1" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Welcome to Rewards</a></li>
            <li><a href="#sec-2" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Earning Base Points</a></li>
            <li><a href="#sec-3" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Membership Tiers</a></li>
            <li><a href="#sec-4" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Silver Tier Benefits</a></li>
            <li><a href="#sec-5" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Gold Tier Privileges</a></li>
            <li><a href="#sec-6" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Platinum Elite Status</a></li>
            <li><a href="#sec-7" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Redeeming Points</a></li>
            <li><a href="#sec-8" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Points Expiration</a></li>
            <li><a href="#sec-9" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Multiplier Events</a></li>
            <li><a href="#sec-10" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Partner Earning</a></li>
            <li><a href="#sec-11" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Referral Program</a></li>
            <li><a href="#sec-12" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Status Matching</a></li>
            <li><a href="#sec-13" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Transferring Points</a></li>
            <li><a href="#sec-14" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Blackout Dates</a></li>
            <li><a href="#sec-15" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Account Audits</a></li>
            <li><a href="#sec-16" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Program Modifications</a></li>
          </ul>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="card-panel" style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#334155', lineHeight: 1.8 }}>
          
          <div style={{ marginBottom: '32px', padding: '16px 20px', background: '#e0f2fe', borderRadius: '8px', borderLeft: '4px solid #0284c7', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Info size={24} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ margin: 0, color: '#0c4a6e', fontSize: '0.95rem' }}>
              <strong>Program Effective Date: August 2026.</strong> These comprehensive guidelines outline the structural mechanics, earning potentials, and legal boundaries of the TravelNest Rewards Program. By enrolling, you accept the parameters detailed in this massive document.
            </p>
          </div>

          <section id="sec-1" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Gift size={28} color="#0284c7" /> Welcome to TravelNest Rewards
            </h2>
            <p>We believe that travel is not a one-time transaction; it is a lifelong, cumulative journey of discovery, empathy, and personal growth. The TravelNest Rewards Program was aggressively engineered from the ground up to recognize and tangibly reward our most passionate explorers. Unlike legacy airline frequent flyer programs that rely on confusing, heavily obscured conversion charts and notoriously impossible redemption thresholds, our ecosystem is built purely on extreme mathematical transparency and instant gratification. From the very second you create a TravelNest account, you are automatically enrolled into our Base Tier at absolutely zero cost, immediately empowering you to start accumulating value on every single transaction you process through our global marketplace.</p>
            <p style={{ marginTop: '16px' }}>Our fundamental philosophy is that your loyalty should dramatically lower your financial barriers to global exploration. Whether you are a casual vacationer booking a single summer getaway to the Mediterranean, or a hardcore digital nomad booking weekly co-working retreats across Southeast Asia, every single dollar you spend is tracked, quantified, and meticulously converted into TravelNest Points (TNP). These points serve as a universal, highly liquid digital currency within our platform. They possess real-world fiat value and can be seamlessly deployed at the checkout page to instantly slash the total price of your next booking, allowing you to essentially travel for free if you strategize your accumulation correctly.</p>
          </section>

          <section id="sec-2" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={28} color="#16a34a" /> Earning Base Points
            </h2>
            <p>The mechanics of earning Base Points have been stripped of all confusing algorithmic complexity to ensure you know exactly what you are getting before you ever click "Confirm Booking." For every single $1 USD (or its exact real-time equivalent in your localized currency) that you spend on eligible tours, experiences, and boutique hotel stays through the TravelNest platform, you are guaranteed to earn 10 Base Points. This means a standard $500 weekend excursion instantly yields 5,000 Base Points deposited directly into your digital vault. There are absolutely no hidden caps, no restrictive earning limits per calendar year, and no arbitrary blocks on high-value luxury bookings. The more you explore, the faster your digital wealth compounds.</p>
            <ul style={{ paddingLeft: '24px', marginTop: '16px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><strong>Completion Requirement:</strong> To prevent systemic abuse and fraudulent point generation, Base Points are held in a "Pending" state in your dashboard and only fully vest (become usable) exactly 48 hours after your tour has been marked as successfully completed by the local host.</li>
              <li><strong>Exclusions:</strong> Base points are calculated purely on the subtotal of the experience. They are never awarded for mandatory governmental taxes, municipal tourist fees, or physical cash deposits paid locally upon arrival, as we do not retain those funds.</li>
              <li><strong>Currency Conversion:</strong> If you book in Euros, Yen, or Pounds, our backend servers will automatically reference the mid-market exchange rate at the exact millisecond of checkout to calculate your equivalent USD point yield, ensuring you are never penalized for global currency fluctuations.</li>
            </ul>
          </section>

          <section id="sec-3" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award size={28} color="#8b5cf6" /> Membership Tiers Overview
            </h2>
            <p>While the Base Tier is immediately accessible to all users, the true, game-changing power of the TravelNest Rewards Program is unlocked as you ascend through our elite, deeply gamified Membership Tiers. We operate a highly structured, calendar-year qualification system designed to massively reward our most frequent travelers with exponentially increasing benefits. The tiers are divided into Silver, Gold, and the highly coveted Platinum Elite status. Your tier is determined purely by the total volume of Base Points you successfully accumulate between January 1st and December 31st of any given calendar year. We do not use arbitrary "Segments Flown" or "Nights Stayed" metrics; pure financial commitment is the only variable that matters.</p>
            <p style={{ marginTop: '16px' }}>Once you cross a specific point threshold, your account is instantaneously, automatically upgraded by our backend servers. You do not need to wait until the end of the year to start enjoying your newly unlocked privileges. Furthermore, we employ a generous "Soft Landing" protocol. When you unlock a higher tier (e.g., Gold), you are guaranteed to retain that elite status for the remainder of the current calendar year, plus the entire duration of the following calendar year, providing you with a massive window to fully exploit your elevated earning multipliers and VIP concierge access without the stressful pressure of immediate requalification.</p>
          </section>

          <section id="sec-4" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={28} color="#dc2626" /> Silver Tier Benefits
            </h2>
            <p>The Silver Tier is your first significant milestone in the TravelNest ecosystem, achieved the moment you accumulate 25,000 Base Points within a calendar year (equivalent to roughly $2,500 in total bookings). Reaching Silver status officially separates you from the casual tourist class and formally signals to our algorithms that you are a dedicated, high-value explorer. The most immediate and financially impactful benefit of the Silver Tier is a permanent 25% point multiplier. From the moment you upgrade, every $1 USD you spend will yield 12.5 Points instead of the standard 10, dramatically accelerating your trajectory toward future free travel.</p>
            <p style={{ marginTop: '16px' }}>Beyond raw point generation, Silver members are granted access to "Priority Customer Support Routing." When you initiate a live chat or dial our international support hotline, our telephony system recognizes your phone number and automatically bypasses the standard queue, placing you ahead of all Base members to ensure your wait time is slashed by at least 60%. Additionally, Silver members receive complimentary, early-access invitations to our highly exclusive "Flash Sales"â€”often gaining a critical 24-hour head start to secure massively discounted luxury inventory before it is released to the general public and instantly sells out.</p>
          </section>

          <section id="sec-5" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Star size={28} color="#d97706" /> Gold Tier Privileges
            </h2>
            <p>Gold Tier status is achieved by accumulating 75,000 Base Points in a calendar year, representing a profound financial and emotional commitment to the TravelNest platform. At this elite level, the digital benefits begin to manifest as highly tangible, real-world physical luxuries. Gold members are granted a staggering 50% point multiplier, earning a massive 15 Points for every single dollar spent, transforming routine bookings into highly lucrative point-generation events. But the true power of Gold lies in our "Guaranteed Late Cancellation" benefit. Gold members are permitted to cancel any standard booking up to 12 hours before departure (bypassing the standard 48-hour rule) and still receive a 100% refund in Wallet Credits, providing unparalleled, stress-free flexibility when traveling in unpredictable regions.</p>
            <ul style={{ paddingLeft: '24px', marginTop: '16px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><strong>Complimentary Upgrades:</strong> Our algorithms automatically notify local hosts when a Gold member books. If higher-tier inventory is available (such as a premium room with a balcony or a private car instead of a shared bus), hosts are heavily subsidized by TravelNest to provide you with a complimentary, surprise upgrade upon arrival.</li>
              <li><strong>Dedicated Account Manager:</strong> Gold members are assigned a dedicated human travel concierge to assist with complex group bookings, complicated multi-city itineraries, and aggressive dietary accommodations, completely bypassing standard AI chatbots.</li>
            </ul>
          </section>

          <section id="sec-6" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={28} color="#06b6d4" /> Platinum Elite Status
            </h2>
            <p>Platinum Elite is the absolute pinnacle of the TravelNest Rewards hierarchy, reserved strictly for the top 1% of global explorers who accumulate 200,000 Base Points in a calendar year. This tier is not merely a status symbol; it is an aggressively overpowered suite of VIP privileges designed to make every single aspect of your global travel frictionless. Platinum members enjoy a permanent 100% point multiplier (earning 20 Points per dollar), effectively doubling the speed at which they earn free travel. Furthermore, Platinum members are entirely exempt from any and all platform booking fees, currency conversion surcharges, and last-minute modification penalties, potentially saving them thousands of dollars annually on administrative overhead.</p>
            <p style={{ marginTop: '16px' }}>The Platinum experience extends deeply into the physical world. Upon reaching this tier, members are mailed an encrypted, heavily secured physical Platinum RFID Card that grants them complimentary, unlimited access to over 1,200 partnered airport lounges worldwide, regardless of what airline or class they are flying. Additionally, if a Platinum member experiences a catastrophic travel failureâ€”such as a sudden airline strike or a severe medical emergencyâ€”they are immediately routed to our "Red Cell" crisis team. This team possesses an unlimited corporate budget to charter private transit, book emergency 5-star hotel rooms, and physically extract the member from dangerous logistical bottlenecks without ever waiting for insurance pre-approvals.</p>
          </section>

          <section id="sec-7" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard size={28} color="#3b82f6" /> Redeeming Points for Travel
            </h2>
            <p>We absolutely despise the industry standard of forcing users to navigate complex, heavily devalued "award charts" to use their points. TravelNest utilizes a radically transparent, fixed-value redemption model. Every 1,000 TravelNest Points (TNP) you accumulate is mathematically locked to a permanent, unalterable value of $10.00 USD. When you reach the checkout screen for any experience on our platform, you will see a highly visible slider tool. This slider allows you to dynamically apply exactly how many points you wish to burn to reduce the final fiat price of the transaction.</p>
            <p style={{ marginTop: '16px' }}>You can choose to burn 5,000 points to shave $50 off a cooking class, or you can hoard your points for years and burn 500,000 points to completely cover the entire $5,000 cost of a week-long luxury yacht charter in the Maldives. There are absolutely no minimum redemption thresholds; if you want to apply 100 points to save $1, the system will execute it flawlessly. Most importantly, when you redeem points, the local supplier is never penalized. TravelNest corporate absorbs the exact financial loss of the point redemption, ensuring the local artisan or guide still receives their full, expected fiat payout, keeping our local economies robust and healthy.</p>
          </section>

          <section id="sec-8" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={28} color="#14b8a6" /> Points Expiration Policy
            </h2>
            <p>The concept of points arbitrarily expiring while you are saving for a massive dream vacation is fundamentally hostile to the user. We have engineered our expiration policy to be as generous and lenient as legally and financially possible. TravelNest Points (TNP) do not possess a hard, calendar-based expiration date. Instead, they operate on a rolling "Account Activity" ledger. Your entire point balance remains completely safe and valid as long as you maintain a single qualifying "activity event" within a rolling 24-month (2-year) window.</p>
            <p style={{ marginTop: '16px' }}>A qualifying activity event is incredibly easy to trigger. It includes earning even a single point from a new booking, redeeming points for a discount, transferring points to a family member, or earning points through one of our co-branded credit card partners. As long as the system registers one of these actions, the 24-month expiration clock instantly resets to zero for your entire massive balance. In the highly unlikely event that you are approaching the 24-month deadline of total inactivity, our automated systems will aggressively warn you via email and SMS at the 90-day, 30-day, and 7-day marks, providing you with ample, undeniable opportunity to book a cheap local walking tour just to keep your massive points vault secure and active.</p>
          </section>

          <section id="sec-9" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TrendingUp size={28} color="#be123c" /> Multiplier Events & Bonuses
            </h2>
            <p>To keep the ecosystem highly dynamic, deeply engaging, and financially lucrative, TravelNest marketing teams regularly execute aggressive, highly publicized "Multiplier Events." During these strictly time-gated promotional windows (such as Black Friday, regional summer solstices, or our annual corporate anniversary), the standard earning algorithms are temporarily overridden. For example, during a "Triple Point Weekend," the standard 10 Points per dollar is massively inflated to 30 Points per dollar across the entire platform.</p>
            <p style={{ marginTop: '16px' }}>What makes these events truly spectacular is that these promotional multipliers stack mathematically with your existing Elite Tier multipliers. If a Gold Member (who already earns a 50% bonus) books a $1,000 luxury villa during a Triple Point Event, the backend algorithm calculates the base (30,000 points) and then applies the Gold multiplier, resulting in a staggering 45,000 point yield (worth $450 in future travel) from a single transaction. Furthermore, we deploy "Geo-Targeted Bonuses." If our data scientists identify that a specific region (e.g., Kyoto in the winter) is suffering from an unnatural tourism slump, we will artificially inject a permanent 2x multiplier for all bookings in that city to actively stimulate the local economy and incentivize our explorers to travel off-peak.</p>
          </section>

          <section id="sec-10" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Briefcase size={28} color="#6366f1" /> Partner Earning Opportunities
            </h2>
            <p>We recognize that you spend heavily outside of the TravelNest platform on flights, rental cars, and daily expenses, and we believe that capital should also contribute to your travel goals. Through aggressive corporate negotiations, TravelNest has heavily integrated our API with a sprawling network of premium global partners. You can seamlessly link your TravelNest account to your profiles with major international airlines, global car rental conglomerates (like Hertz and Enterprise), and premium luggage brands (like Away or Tumi).</p>
            <p style={{ marginTop: '16px' }}>Once linked, the tracking is completely passive and automated. Every time you rent a car from a partner or purchase a first-class ticket, those external databases silently ping our servers, instantly depositing massive blocks of partner points directly into your TravelNest vault. The crown jewel of this partner ecosystem is the upcoming TravelNest Visa Infinite Credit Card. Cardholders will earn highly accelerated point yields on everyday mundane purchasesâ€”like 3x points on global dining and 2x points on domestic groceriesâ€”effectively allowing you to fund your next exotic international vacation simply by buying your weekly household necessities.</p>
          </section>

          <section id="sec-11" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={28} color="#0ea5e9" /> Referral Rewards Program
            </h2>
            <p>The most powerful, authentic marketing engine on the planet is the passionate word-of-mouth recommendation from a trusted friend. We have heavily gamified this reality into a highly lucrative Referral Rewards Program. Deep within your user dashboard, you possess a unique, cryptographically secure referral link. When you share this link on your social media, travel blogs, or private group chats, and a new user clicks it to create an account, they are instantly injected into our tracking matrix.</p>
            <p style={{ marginTop: '16px' }}>To welcome the new user, they instantly receive a $50 Wallet Credit to deploy on their very first booking. However, the true reward belongs to you. The exact moment that referred user successfully completes their first non-refundable tour (minimum spend of $100), our system automatically deposits a massive 10,000 Point bounty (worth $100) directly into your account. There is absolutely no cap on this program. We have active digital nomads, popular travel vloggers, and highly connected socialites who fund their entire annual global travel purely by aggressively evangelizing the platform and harvesting hundreds of thousands of referral points every month.</p>
          </section>

          <section id="sec-12" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FastForward size={28} color="#15803d" /> Status Matching & Fast Track
            </h2>
            <p>We understand that highly experienced, premium travelers have already invested years of loyalty into legacy airline frequent flyer programs or massive hotel chains, and the thought of starting at the bottom "Base Tier" of a new platform is deeply unappealing. To eliminate this friction, TravelNest operates a highly aggressive, permanent "Status Match" protocol designed to poach high-value travelers from our competitors. If you currently hold top-tier elite status with a major airline (e.g., Delta Diamond, Emirates Gold) or a global hotel chain (e.g., Marriott Titanium), you do not have to start from zero.</p>
            <p style={{ marginTop: '16px' }}>By submitting a screenshot of your current elite credentials to our specialized compliance team, we will manually verify the authenticity of your status within 48 hours. Upon verification, we will instantly, unilaterally upgrade your TravelNest account to the equivalent Gold or Platinum Elite tier for a strict probationary period of 90 days. During this 90-day "Fast Track" window, you must complete a significantly reduced point challenge (e.g., earning only 20,000 points instead of the standard 75,000) to permanently lock in that elite status for the following calendar year. This mechanism ensures that premium travelers are immediately respected and rewarded, while still requiring them to prove their ongoing loyalty to our specific ecosystem.</p>
          </section>

          <section id="sec-13" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Share2 size={28} color="#64748b" /> Transferring & Pooling Points
            </h2>
            <p>Travel is rarely a solitary endeavor; it is overwhelmingly a communal, shared experience among families, partners, and close friends. Recognizing this, we have engineered the ability to seamlessly transfer or pool your hard-earned points with other active TravelNest accounts, completely free of the punitive administrative fees that legacy airlines charge. Through the "Family Vault" feature in your dashboard, you can cryptographically link up to five distinct accounts into a single, unified financial pool.</p>
            <p style={{ marginTop: '16px' }}>This allows a family of four to combine their scattered, fragmented point balances into one massive, highly weaponized fund capable of booking a sprawling luxury villa that none of them could afford individually. If you simply want to execute a one-off transferâ€”perhaps gifting a honeymooning couple 50,000 points as a wedding presentâ€”you can execute an instant, blockchain-verified transfer using their email address. To prevent black-market selling and fraudulent point brokering, we strictly cap external (non-family) transfers to a maximum of 100,000 points per calendar year, and our fraud algorithms heavily monitor these transactions for signs of commercial exploitation.</p>
          </section>

          <section id="sec-14" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={28} color="#4f46e5" /> Zero Blackout Dates
            </h2>
            <p>One of the most universally despised, deeply anti-consumer practices in the modern travel industry is the implementation of "Blackout Dates"â€”the infuriating phenomenon where an airline or hotel refuses to let you use your hard-earned points during peak holiday seasons, like Christmas or peak European summer, precisely when you actually want to travel. We consider this practice to be fundamentally deceptive. TravelNest operates on a strict, mathematically guaranteed policy of Zero Blackout Dates, permanently hardcoded into our booking architecture.</p>
            <p style={{ marginTop: '16px' }}>If a tour, a private jet charter, or a boutique hotel room is available to be purchased with standard fiat cash on our platform, it is 100% available to be purchased using your TravelNest Points, regardless of the season, the holiday, or the local demand. The math scales perfectly: if a hotel doubles its cash price during New Year's Eve, the required point redemption value will mathematically double to match it, but you will never, ever be blocked from executing the transaction. Your points represent your stored financial energy, and we refuse to dictate when or where you are allowed to deploy them.</p>
          </section>

          <section id="sec-15" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock size={28} color="#059669" /> Account Audits & Fraud Prevention
            </h2>
            <p>Because TravelNest Points carry a highly liquid, highly fungible real-world fiat value, they are a massive, glittering target for organized cybercriminal syndicates, hacker botnets, and malicious point brokers. To protect the vast financial reserves of the ecosystem, our cybersecurity teams deploy incredibly aggressive, AI-driven fraud prevention algorithms that monitor every single point accumulation and redemption event in real-time. If our heuristics detect impossible behaviorsâ€”such as a single account booking and canceling 50 tours in one hour to trigger a programmatic loophole, or an account attempting to transfer massive sums of points to a known dark-web IP addressâ€”the system strikes instantly.</p>
            <p style={{ marginTop: '16px' }}>The flagged account is immediately thrown into a hard "Security Freeze," locking all point balances and disabling checkout capabilities. A specialized human forensic auditor will then manually tear down the account's transaction history. If we definitively prove that the user was engaging in malicious exploitation, automated point farming, or selling points for cash on third-party forums (which violently violates our terms), the penalty is absolute. The account is permanently terminated, all accumulated points and elite statuses are instantly voided without compensation, and the userâ€™s device fingerprint is permanently banned from ever accessing the TravelNest platform again. We fiercely protect the integrity of the ecosystem so that legitimate explorers can continue to reap its massive benefits.</p>
          </section>

          <section id="sec-16" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={28} color="#0284c7" /> Program Modifications & Legal
            </h2>
            <p>The global macroeconomic landscape is inherently volatile, and as such, the operational costs of maintaining a highly lucrative rewards ecosystem are subject to massive fluctuations. While it is our profound corporate intention to keep the TravelNest Rewards program operating perpetually, we must legally reserve the absolute, unilateral right to modify, amend, devalue, or entirely terminate the program, its rules, its multipliers, or its tier thresholds at our sole discretion, at any time, for any operational or legal reason. This is a standard legal necessity to protect the company from sudden, catastrophic economic collapse.</p>
            <p style={{ marginTop: '16px' }}>However, we are not a legacy bank looking to quietly steal your value in the dead of night. If we ever face the stark economic reality of having to drastically devalue the conversion rate of points (e.g., changing 1,000 points from $10 to $8), we pledge a solemn, public commitment to extreme transparency. We will provide all active members with a minimum, non-negotiable 90-day advance notice via direct email and a highly visible in-app dashboard alert. This 90-day grace period is specifically designed to allow you ample, unhurried time to aggressively burn your existing point balances at their higher, original legacy value before the new, devalued rules take effect, ensuring you are never blindsided or robbed of the loyalty you rightfully earned.</p>
          </section>

          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginTop: '40px' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', marginBottom: '4px' }}>Ready to start earning?</h4>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748b' }}>Create a free account today and start accumulating your points.</p>
            </div>
            <Link href="/signup" className="btn-primary" style={{ padding: '10px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Join TravelNest Rewards <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
