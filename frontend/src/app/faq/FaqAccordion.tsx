'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, List } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface FaqCategory {
  title: string;
  faqs: FAQ[];
}

const FAQ_DATA: FaqCategory[] = [
  {
    title: 'Booking & Reservations',
    faqs: [
      { 
        question: 'How exactly does the booking confirmation process work?', 
        answer: 'The moment you complete your checkout, our system instantly pings the local supplier’s inventory database. If you book an "Instant Confirmation" tour, your digital e-ticket is generated in milliseconds and immediately sent to your inbox. For specialized or highly customized tours marked "Manual Confirmation," the local host has a strict 24-hour window to manually review and approve your request based on their precise availability. During this pending state, a temporary hold is placed on your card, but no funds are captured until the host officially accepts the booking. Once confirmed, you will receive a comprehensive itinerary complete with exact GPS coordinates for the meeting point.' 
      },
      { 
        question: 'Can I modify the dates or guest count after booking?', 
        answer: 'Yes, TravelNest offers a highly flexible modification system. You can request to change your tour dates, switch departure times, or add additional travelers directly from your "My Bookings" dashboard without having to cancel the entire reservation. If the local supplier has availability for the newly requested date, the modification is approved instantly. If you are adding guests, you will simply be prompted to pay the fare difference. Please note that major modifications attempted within 24 hours of the scheduled departure are generally locked by the system to prevent logistical chaos for our hosts.' 
      },
      { 
        question: 'Do I need to print my tickets or vouchers?', 
        answer: 'Absolutely not. TravelNest is a deeply eco-conscious platform and operates on a 100% paperless ticketing ecosystem. Upon confirmation, you will receive a dynamic digital e-ticket containing a unique, cryptographically secure QR code. On the day of your experience, simply open the TravelNest mobile app or your email and present the bright screen to your local guide. They will scan the QR code using their host application to verify your identity and check you in instantly. However, for extremely remote tours (like deep jungle treks or oceanic sailing) where mobile data may be nonexistent, we highly recommend taking a screenshot of the QR code beforehand.' 
      },
      {
        question: 'Are there group discounts for large bookings?',
        answer: 'Yes, managing large-scale logistics is one of our specialties. For standard tours, the checkout system may automatically apply a slight bulk discount if you exceed a certain threshold of tickets. However, for massive groups (such as corporate retreats, school trips, or large family reunions exceeding 15 people), we highly recommend completely bypassing the automated checkout. Instead, contact our dedicated Group Concierge team. They will manually negotiate specialized bulk rates with local suppliers, charter private transport, and structure staggered deposit payment plans on your behalf.'
      }
    ]
  },
  {
    title: 'Payments, Billing & Pricing',
    faqs: [
      { 
        question: 'What specific payment methods are securely accepted?', 
        answer: 'TravelNest operates a global, PCI-DSS Level 1 certified payment infrastructure. We seamlessly accept all major international credit and debit cards, including Visa, Mastercard, American Express, and Discover. Furthermore, for a frictionless, one-tap checkout experience, we fully support modern digital wallets like Apple Pay, Google Pay, and PayPal. For certain high-ticket luxury bookings or long-term villa rentals, our platform may also offer direct Bank Transfer (Wire/ACH) options. All financial data is encrypted at the browser level via tokenization, meaning your raw credit card numbers never actually touch our internal servers.' 
      },
      { 
        question: 'Why was my international payment declined?', 
        answer: 'If you encounter a "Transaction Failed" error, the block is almost exclusively initiated by your personal bank’s automated fraud-prevention algorithms, not by TravelNest. Because we process transactions globally, banks frequently flag high-value international travel purchases as suspicious if you are currently sitting in your home country. To instantly resolve this, you must open your banking app or call the toll-free number on the back of your card to verbally authorize the foreign transaction. Once the bank lifts the temporary security freeze, you can safely re-attempt the checkout on our platform without issue.' 
      },
      { 
        question: 'Are there any hidden fees or surprise local taxes?', 
        answer: 'Never. TravelNest operates on a doctrine of radical pricing transparency. The final price you see on the checkout screen—before you hit confirm—is the absolute final price you will pay. It comprehensively includes all platform service fees, local municipal VAT, and standard operational costs. The only rare exceptions are hyper-local, physical fees mandated by regional governments that cannot legally be collected digitally (such as physical cash entry taxes to highly protected national parks, or localized "City Tourist Taxes" in places like Venice or Kyoto). If such a local cash fee exists, it will be loudly and explicitly warned in bold red text on the tour listing page prior to booking.' 
      }
    ]
  },
  {
    title: 'Cancellations & Refunds',
    faqs: [
      { 
        question: 'How do I cancel my booking and what is the policy?', 
        answer: 'To cancel, navigate to your "My Bookings" dashboard, select the specific trip, and click the red "Cancel Reservation" button. Our cancellation policies are clearly defined on every single listing before you book. The vast majority of our experiences feature a "Standard Flex" policy, meaning you can cancel up to 48 hours before the tour start time and receive a 100% full refund automatically. However, highly specialized luxury bookings (like chartered yachts or multi-day safaris) may feature "Strict" non-refundable policies due to the massive upfront costs the supplier must pay to prepare the tour. Always review the policy tier before confirming.' 
      },
      { 
        question: 'How long does it take to receive my money back?', 
        answer: 'The exact millisecond you trigger a valid cancellation, TravelNest releases the funds from our internal escrow. However, the legacy global banking network dictates how fast it appears in your account. If you paid via PayPal or Apple Pay, the funds usually reappear within a blazing fast 24 to 48 hours. If you paid via a standard Visa or Mastercard, the banking clearinghouses typically take 5 to 7 business days to route the money back to your ledger. We do not intentionally hold your funds to generate interest. If you have not seen the refund after 14 days, please contact our support team, and we will provide an Acquirer Reference Number (ARN) so your bank manager can trace the stalled funds.' 
      },
      {
        question: 'What happens if the local host cancels the tour due to weather?',
        answer: 'Your safety is absolute. If a local supplier cancels an experience due to dangerous conditions—such as an incoming typhoon, extreme localized flooding, or a mechanical failure on a vessel—you are 100% financially protected. The host will trigger a "Force Majeure" cancellation on their end, which automatically initiates a full, immediate refund to your original payment method. Alternatively, our support agents will immediately contact you to offer a completely free rescheduling to the next available safe date, or help you rapidly book an entirely different indoor experience in the same city.'
      }
    ]
  },
  {
    title: 'On The Day Of Your Tour',
    faqs: [
      { 
        question: 'What exactly happens if I am running late for a departure?', 
        answer: 'Punctuality is critical, especially for group tours where 20 other travelers are waiting. If you realize you are going to be late due to terrible traffic or a delayed train, your absolute first priority is to use the TravelNest in-app messaging system to instantly notify your local guide. Many hosts have a strict "15-Minute Grace Period" and may try to hold the bus or boat for you. However, if you fail to communicate and miss the departure entirely, it is officially classified as a "No-Show." Under standard policies, No-Shows are strictly non-refundable because the host held the physical seat for you and turned away other paying customers.' 
      },
      { 
        question: 'How do I easily locate the meeting point in a foreign city?', 
        answer: 'We have engineered away the stress of getting lost. Your digital e-ticket contains the exact GPS coordinates of the meeting point, seamlessly integrated with Google Maps and Apple Maps. Simply tap the "Navigate" button in the TravelNest app, and your phone will provide turn-by-turn walking or driving directions. Furthermore, hosts are required to provide highly specific visual clues in the ticket description (e.g., "I will be standing next to the bronze lion statue wearing a bright yellow TravelNest polo shirt"). If you are still lost, you can message the host directly or call their provided emergency day-of-tour phone number.' 
      }
    ]
  },
  {
    title: 'Trust, Safety & Insurance',
    faqs: [
      { 
        question: 'Are the local guides and suppliers thoroughly vetted?', 
        answer: 'Yes, with extreme prejudice. We do not allow random individuals to casually list tours on TravelNest. Our Trust & Safety division manually audits every single supplier before their listing goes live. They are required to submit official governmental business licenses, verifiable proof of operational history, and comprehensive public liability insurance certificates. Furthermore, we deploy active Machine Learning models that monitor their ongoing performance. If a supplier begins receiving concerning reviews regarding safety equipment or reckless driving, their account is instantly suspended pending a deep-dive internal forensic investigation.' 
      },
      { 
        question: 'Does TravelNest provide comprehensive travel insurance?', 
        answer: 'TravelNest is a technological booking intermediary, not a licensed insurance underwriter. Therefore, we do not provide blanket medical or trip cancellation insurance. We aggressively advocate that every single traveler purchases a robust, third-party travel insurance policy immediately after booking their flights and tours. A good policy will protect you from massive financial loss if you must cancel a non-refundable booking due to sudden illness, a death in the family, or if you require emergency medical evacuation while abroad. Our support team is fully equipped to provide official "Proof of Cancellation" invoices to help expedite your insurance claims.' 
      }
    ]
  }
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<string | null>('0-0');
  const [activeCat, setActiveCat] = useState(0);

  // Scroll-spy: highlight the ToC item matching the category currently in view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-faq-cat'));
            if (!isNaN(idx)) setActiveCat(idx);
          }
        });
      },
      { rootMargin: '-15% 0px -70% 0px' }
    );
    const sections = document.querySelectorAll('[data-faq-cat]');
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToCategory = (idx: number) => {
    const el = document.getElementById(`faq-cat-${idx}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleFaq = (index: string) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px', alignItems: 'start' }}>
      {/* STICKY TABLE OF CONTENTS */}
      <aside style={{ position: 'sticky', top: '100px', background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(15,23,42,0.06)' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <List size={15} color="#0284c7" /> On This Page
        </div>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {FAQ_DATA.map((category, catIndex) => (
              <li key={catIndex}>
                <button
                  type="button"
                  onClick={() => scrollToCategory(catIndex)}
                  aria-current={activeCat === catIndex ? 'true' : undefined}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: activeCat === catIndex ? '#eff6ff' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: activeCat === catIndex ? 700 : 500,
                    color: activeCat === catIndex ? '#0284c7' : '#475569',
                    borderLeft: activeCat === catIndex ? '3px solid #0284c7' : '3px solid transparent',
                    transition: 'all 0.2s ease',
                    lineHeight: 1.35
                  }}
                >
                  {category.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* ACCORDION COLUMN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {FAQ_DATA.map((category, catIndex) => (
          <div
            key={catIndex}
            id={`faq-cat-${catIndex}`}
            data-faq-cat={catIndex}
            style={{ scrollMarginTop: '110px', marginBottom: '10px' }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
              {category.title}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {category.faqs.map((faq, faqIndex) => {
                const uniqueId = `${catIndex}-${faqIndex}`;
                const isOpen = openIndex === uniqueId;
                
                return (
                  <div 
                    key={faqIndex} 
                    style={{ 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: isOpen ? '#f8fafc' : '#ffffff',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <button 
                      onClick={() => toggleFaq(uniqueId)}
                      style={{ 
                        width: '100%', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '20px', 
                        background: 'transparent', 
                        border: 'none', 
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ fontSize: '1.05rem', fontWeight: 700, color: isOpen ? '#0284c7' : '#334155', paddingRight: '20px', lineHeight: 1.4 }}>
                        {faq.question}
                      </span>
                      {isOpen ? 
                        <ChevronUp size={20} color="#0284c7" style={{ flexShrink: 0 }} /> : 
                        <ChevronDown size={20} color="#64748b" style={{ flexShrink: 0 }} />
                      }
                    </button>
                    
                    {isOpen && (
                      <div style={{ padding: '0 20px 20px 20px', color: '#475569', lineHeight: 1.7, fontSize: '0.95rem' }}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}