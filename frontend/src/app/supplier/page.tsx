'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Globe,
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart3,
  Users,
  CreditCard,
  Headphones,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  Sparkles,
  Clock,
  QrCode,
  FileText,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SupplierPage() {
  // removed openAuthModal

  const platformStats = [
    { value: '2M+', label: 'Monthly Visitors', icon: Globe },
    { value: '150+', label: 'Destinations', icon: MapPin },
    { value: '4.8★', label: 'Avg. Rating', icon: Star },
    { value: '98%', label: 'Payout Rate', icon: CreditCard },
  ];

  const benefits = [
    {
      icon: Globe,
      title: 'Global Marketplace Reach',
      description: 'List your experiences on a platform visited by millions of travelers worldwide. Expand beyond local markets effortlessly.'
    },
    {
      icon: Zap,
      title: 'Instant Booking Engine',
      description: 'Receive real-time bookings with automatic confirmation, slot management, and zero manual intervention required.'
    },
    {
      icon: BarChart3,
      title: 'Smart Analytics Dashboard',
      description: 'Track revenue, booking trends, customer demographics, and conversion rates with our AI-powered analytics suite.'
    },
    {
      icon: CreditCard,
      title: 'Secure Weekly Payouts',
      description: 'Get paid reliably every week via Stripe Connect. Transparent commission structure with no hidden fees.'
    },
    {
      icon: ShieldCheck,
      title: 'Verified Partner Badge',
      description: 'Complete KYC verification to earn a Verified Partner badge that builds instant trust with travelers.'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Optimization',
      description: 'Our AI suggests pricing strategies, generates compelling descriptions, and optimizes your listing for maximum visibility.'
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Register Your Business',
      description: 'Fill out the application form with your business details. Our team reviews applications within 24 hours.'
    },
    {
      step: '02',
      title: 'Complete KYC Verification',
      description: 'Submit your business license, ID, and bank details for secure verification and payout setup.'
    },
    {
      step: '03',
      title: 'Create Your Listings',
      description: 'Build beautiful experience listings with photos, pricing tiers, availability calendar, and detailed itineraries.'
    },
    {
      step: '04',
      title: 'Start Earning',
      description: 'Go live and start receiving bookings. Manage everything from your dedicated supplier dashboard.'
    },
  ];

  const testimonials = [
    {
      name: 'Ahmed Raza',
      role: 'Founder, Lahore Food Trails',
      location: 'Lahore, Pakistan',
      quote: 'TravelNest transformed our small food tour business. We went from 5 bookings a month to over 60. The dashboard makes everything seamless.',
      rating: 5
    },
    {
      name: 'Yuki Tanaka',
      role: 'CEO, Tokyo Night Walks',
      location: 'Tokyo, Japan',
      quote: 'The AI pricing suggestions alone increased our revenue by 35%. The international exposure is unmatched by any other platform.',
      rating: 5
    },
    {
      name: 'Maria Costa',
      role: 'Director, Roma Heritage Tours',
      location: 'Rome, Italy',
      quote: 'Weekly payouts and the QR voucher system made our operations incredibly smooth. We can focus on creating great experiences.',
      rating: 5
    },
  ];

  const faqs = [
    {
      q: 'What types of businesses can join TravelNest?',
      a: 'Tour operators, activity providers, food experience hosts, adventure companies, cultural guides, and any business offering travel experiences can apply.'
    },
    {
      q: 'What is the commission structure?',
      a: 'TravelNest charges a transparent 15% commission on each booking. There are no listing fees, no monthly subscriptions, and no hidden charges.'
    },
    {
      q: 'How quickly will I receive payouts?',
      a: 'Payouts are processed weekly via Stripe Connect. After your first booking, funds typically arrive in your bank within 3-5 business days.'
    },
    {
      q: 'Do I need to manage my own availability?',
      a: 'You have full control via our calendar management tool. Set availability, block dates, create seasonal pricing — all from your dashboard.'
    },
    {
      q: 'Is there a minimum booking requirement?',
      a: 'No minimum requirements. Whether you run 1 tour per week or 50 per day, TravelNest scales with your business.'
    },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'var(--font-body)' }}>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SECTION 1: HERO BANNER */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #0ea5e9 100%)',
          padding: '80px 24px 60px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '48px' }}>

            {/* Left content */}
            <div style={{ flex: '1 1 520px', maxWidth: '600px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '100px',
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(8px)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '20px',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <ShieldCheck size={14} /> Trusted by 500+ Tour Operators Worldwide
              </div>

              <h1 style={{
                fontSize: '3rem',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.15,
                margin: '0 0 16px',
                letterSpacing: '-0.02em'
              }}>
                Grow Your Travel Business with TravelNest
              </h1>

              <p style={{
                fontSize: '1.12rem',
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.65,
                margin: '0 0 32px',
                maxWidth: '520px'
              }}>
                Join the fastest-growing travel marketplace. List your tours, activities, and experiences — reach millions of travelers and get paid securely every week.
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link
                  href="/supplier/signup"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 28px',
                    borderRadius: '14px',
                    background: '#ffffff',
                    color: '#0284c7',
                    fontWeight: 700,
                    fontSize: '1rem',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s'
                  }}
                >
                  Apply Now <ArrowRight size={18} />
                </Link>
                <a
                  href="#how-it-works"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 28px',
                    borderRadius: '14px',
                    background: 'rgba(255,255,255,0.12)',
                    border: '1.5px solid rgba(255,255,255,0.3)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    textDecoration: 'none',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.2s'
                  }}
                >
                  How It Works
                </a>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div style={{ flex: '1 1 380px', maxWidth: '440px', display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  width: '100%',
                  maxWidth: '380px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                  border: '4px solid rgba(255,255,255,0.2)'
                }}
              >
                <img
                  src="/supplier-hero.jpg"
                  alt="Travel tour operator using TravelNest platform"
                  style={{
                    width: '100%',
                    height: '420px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SECTION 2: WHY PARTNER WITH US — BENEFITS GRID */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '72px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{
            display: 'inline-block',
            padding: '4px 14px',
            borderRadius: '100px',
            background: '#e0f2fe',
            color: '#0284c7',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '12px'
          }}>
            PARTNER BENEFITS
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>
            Why Operators Choose TravelNest
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#64748b', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
            Everything you need to list, manage, and scale your travel experiences — all in one platform.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="card-panel"
              style={{
                padding: '28px',
                borderRadius: '20px',
                transition: 'all 0.25s',
                cursor: 'default'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: '#e0f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <benefit.icon size={22} color="#0284c7" />
              </div>
              <h3 style={{ fontSize: '1.12rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
                {benefit.title}
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SECTION 3: HOW IT WORKS — 4-STEP PROCESS */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding: '72px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 14px',
              borderRadius: '100px',
              background: '#f0fdf4',
              color: '#059669',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '12px'
            }}>
              GET STARTED
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>
              How It Works
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748b', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
              From registration to your first booking — we make onboarding effortless.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            {howItWorks.map((item, index) => (
              <div
                key={item.step}
                style={{
                  position: 'relative',
                  padding: '32px 24px',
                  borderRadius: '20px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'var(--brand-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
                }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>{item.step}</span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  {item.description}
                </p>

                {/* Connector arrow (except last) */}
                {index < howItWorks.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: '-14px',
                    transform: 'translateY(-50%)',
                    display: 'none' // hidden on mobile, visible on desktop via media query alternative
                  }}>
                    <ChevronRight size={20} color="#cbd5e1" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SECTION 4: SUPPLIER DASHBOARD PREVIEW */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '72px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 14px',
              borderRadius: '100px',
              background: '#ede9fe',
              color: '#7c3aed',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '12px'
            }}>
              POWERFUL TOOLS
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>
              Your All-In-One Supplier Dashboard
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748b', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
              Manage bookings, track earnings, scan QR vouchers, and optimize pricing — all from one place.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[
              { icon: PlusCircle, title: 'Listing Builder', desc: 'Create tours with photos, pricing tiers, time slots, and rich descriptions in minutes.', color: '#0284c7' },
              { icon: Calendar, title: 'Availability Calendar', desc: 'Manage daily slots, block dates, set seasonal pricing, and control inventory in real-time.', color: '#7c3aed' },
              { icon: QrCode, title: 'QR Voucher Scanner', desc: 'Scan customer e-vouchers at the venue. Instant check-in with live booking validation.', color: '#059669' },
              { icon: BarChart3, title: 'Revenue Analytics', desc: 'Track gross sales, net earnings, platform fees, and payout history with visual insights.', color: '#d97706' },
              { icon: Sparkles, title: 'AI Description Writer', desc: 'Auto-generate SEO-optimized descriptions and pricing suggestions using AI.', color: '#e11d48' },
              { icon: Headphones, title: 'Priority Support', desc: 'Verified partners get dedicated account managers and priority customer support.', color: '#0f172a' },
            ].map((tool) => (
              <div
                key={tool.title}
                className="card-panel"
                style={{
                  padding: '24px',
                  borderRadius: '18px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: `${tool.color}12`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <tool.icon size={20} color={tool.color} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>
                    {tool.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.55, margin: 0 }}>
                    {tool.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SECTION 5: PARTNER TESTIMONIALS */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '72px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 14px',
              borderRadius: '100px',
              background: '#fef3c7',
              color: '#d97706',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '12px'
            }}>
              PARTNER STORIES
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>
              Trusted by Operators Worldwide
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="card-panel"
                style={{ padding: '28px', borderRadius: '20px' }}
              >
                <div style={{ display: 'flex', gap: '2px', marginBottom: '14px' }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} color="#f59e0b" fill="#f59e0b" />
                  ))}
                </div>
                <p style={{
                  fontSize: '0.95rem',
                  color: '#334155',
                  lineHeight: 1.65,
                  margin: '0 0 20px',
                  fontStyle: 'italic'
                }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>{t.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.role}</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <MapPin size={12} /> {t.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SECTION 6: FAQs */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '72px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 14px',
              borderRadius: '100px',
              background: '#e0f2fe',
              color: '#0284c7',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '12px'
            }}>
              FREQUENTLY ASKED
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Common Questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: openFaq === index ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                  overflow: 'hidden',
                  transition: 'all 0.2s'
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '18px 20px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: openFaq === index ? '#0284c7' : '#0f172a',
                    transition: 'color 0.2s'
                  }}
                >
                  {faq.q}
                  <ChevronRight
                    size={18}
                    color={openFaq === index ? '#0284c7' : '#94a3b8'}
                    style={{
                      transform: openFaq === index ? 'rotate(90deg)' : 'none',
                      transition: 'transform 0.2s',
                      flexShrink: 0
                    }}
                  />
                </button>
                {openFaq === index && (
                  <div style={{ padding: '0 20px 18px', fontSize: '0.9rem', color: '#475569', lineHeight: 1.65 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SECTION 7: FINAL CTA BANNER */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #0ea5e9 100%)',
          padding: '60px 24px',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', margin: '0 0 12px' }}>
            Ready to Grow Your Business?
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: '0 0 28px' }}>
            Join 500+ tour operators already earning more with TravelNest. Zero listing fees — pay only when you earn.
          </p>
          <Link
            href="/supplier/signup"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              borderRadius: '14px',
              background: '#ffffff',
              color: '#0284c7',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              transition: 'all 0.2s'
            }}
          >
            Get Started Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
}
