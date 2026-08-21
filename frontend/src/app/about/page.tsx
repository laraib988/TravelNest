'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Globe2, 
  Users, 
  Map, 
  ShieldCheck, 
  HeartHandshake, 
  TrendingUp, 
  Leaf,
  ArrowRight
} from 'lucide-react';



export default function AboutUsPage() {
  // Real-time animation states for statistics
  const [stats, setStats] = useState({
    travelers: 0,
    experiences: 0,
    countries: 0,
    rating: 0
  });

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Easing function for smooth counting
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setStats({
        travelers: Math.floor(easeOutQuart * 500000),
        experiences: Math.floor(easeOutQuart * 15400),
        countries: Math.floor(easeOutQuart * 124),
        rating: Number((easeOutQuart * 4.9).toFixed(1))
      });

      if (currentStep >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'var(--font-body)' }}>
        
        {/* MODERN HERO SECTION */}
        <div style={{ 
          position: 'relative',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
          padding: '120px 24px',
          textAlign: 'center', 
          color: '#fff',
          overflow: 'hidden'
        }}>
          {/* Abstract globe/map pattern background overlay could go here */}
          <div style={{ position: 'relative', zIndex: 10, maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '8px 16px', borderRadius: '30px', color: '#38bdf8', fontWeight: 700, fontSize: '0.9rem', marginBottom: '24px' }}>
              <Globe2 size={16} /> Welcome to TravelNest
            </div>
            <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '24px', lineHeight: 1.1, letterSpacing: '-1px' }}>
              Redefining the way the world <span style={{ color: '#38bdf8' }}>explores.</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto' }}>
              We are a global marketplace connecting curious travelers with passionate local hosts. Our mission is to make authentic, real-world exploration accessible, safe, and deeply rewarding.
            </p>
          </div>
        </div>

        {/* REAL-TIME LIVE STATS ROW */}
        <div style={{ maxWidth: '1200px', margin: '-40px auto 60px', padding: '0 24px', position: 'relative', zIndex: 20 }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#0ea5e9', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}><Users size={32} /></div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{stats.travelers.toLocaleString()}+</div>
              <div style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 600, marginTop: '8px' }}>Active Travelers</div>
            </div>

            <div style={{ textAlign: 'center', borderLeft: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9' }}>
              <div style={{ color: '#8b5cf6', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}><Map size={32} /></div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{stats.experiences.toLocaleString()}+</div>
              <div style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 600, marginTop: '8px' }}>Real-Time Experiences</div>
            </div>

            <div style={{ textAlign: 'center', borderRight: '1px solid #f1f5f9' }}>
              <div style={{ color: '#10b981', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}><Globe2 size={32} /></div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{stats.countries}+</div>
              <div style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 600, marginTop: '8px' }}>Countries Covered</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#f59e0b', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}><TrendingUp size={32} /></div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{stats.rating.toFixed(1)}/5</div>
              <div style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 600, marginTop: '8px' }}>Average User Rating</div>
            </div>

          </div>
        </div>

        {/* MISSION & VISION */}
        <div style={{ maxWidth: '1200px', margin: '0 auto 80px', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px', lineHeight: 1.2 }}>
                Empowering locals.<br />Inspiring travelers.
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.8, marginBottom: '20px' }}>
                TravelNest was founded on a simple premise: the best travel experiences aren't found in mass-market brochures. They are found in the stories, skills, and passions of local residents. 
              </p>
              <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.8 }}>
                By providing a powerful, real-time technological platform, we empower local guides, artisans, and small businesses to instantly share their world. In turn, travelers gain unprecedented access to authentic, deeply immersive adventures that leave a positive economic footprint on the communities they visit.
              </p>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '-10px', background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)', borderRadius: '24px', opacity: 0.2, filter: 'blur(20px)' }}></div>
              <img 
                src="https://images.unsplash.com/photo-1528543606781-2f6e6857f318?auto=format&fit=crop&w=800&q=80" 
                alt="Travelers exploring" 
                style={{ width: '100%', borderRadius: '24px', position: 'relative', zIndex: 10, border: '4px solid #fff', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
              />
            </div>
          </div>
        </div>

        {/* THE TRAVELNEST DIFFERENCE */}
        <div style={{ maxWidth: '1200px', margin: '0 auto 100px', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>The TravelNest Difference</h2>
            <p style={{ fontSize: '1.15rem', color: '#64748b', maxWidth: '700px', margin: '0 auto' }}>What separates us from legacy travel agencies and outdated booking engines.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flexShrink: 0, width: '56px', height: '56px', borderRadius: '50%', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={28} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>Real-Time Availability</h4>
                <p style={{ color: '#475569', lineHeight: 1.6 }}>No more waiting 48 hours for an email confirmation. Our deep API integrations ensure that if you see an open slot, it is instantly yours.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flexShrink: 0, width: '56px', height: '56px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={28} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>Zero Hidden Fees</h4>
                <p style={{ color: '#475569', lineHeight: 1.6 }}>We fundamentally reject deceptive pricing models. The price you see on the listing is the exact price you pay at checkout. Total transparency.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flexShrink: 0, width: '56px', height: '56px', borderRadius: '50%', background: '#fdf4ff', color: '#d946ef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={28} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>Direct Local Impact</h4>
                <p style={{ color: '#475569', lineHeight: 1.6 }}>By drastically cutting out corporate middlemen, 85% of your booking fee goes directly into the pockets of the local guides and regional economy.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CORE VALUES */}
        <div style={{ background: '#fff', padding: '100px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Our Core Values</h2>
              <p style={{ fontSize: '1.15rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>The principles that drive every engineering decision and business partnership at TravelNest.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              
              <div style={{ padding: '32px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                <div style={{ width: '48px', height: '48px', background: '#e0f2fe', color: '#0284c7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <ShieldCheck size={24} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>Uncompromising Safety</h3>
                <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem' }}>Every host and supplier undergoes a rigorous real-time KYC verification and background check. Your security is our architectural priority.</p>
              </div>

              <div style={{ padding: '32px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                <div style={{ width: '48px', height: '48px', background: '#f5f3ff', color: '#7c3aed', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <HeartHandshake size={24} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>Authentic Connection</h3>
                <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem' }}>We reject manufactured tourist traps. Our platform strictly prioritizes highly localized, culturally respectful, and immersive human experiences.</p>
              </div>

              <div style={{ padding: '32px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                <div style={{ width: '48px', height: '48px', background: '#ecfdf5', color: '#059669', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Leaf size={24} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>Sustainable Travel</h3>
                <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem' }}>A portion of every transaction is diverted into local eco-funds. We heavily promote carbon-neutral activities and paperless, digital ticketing.</p>
              </div>

              <div style={{ padding: '32px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                <div style={{ width: '48px', height: '48px', background: '#fffbeb', color: '#d97706', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Globe2 size={24} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>Radical Inclusion</h3>
                <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem' }}>Travel is a universal human right. We architect our platforms to be fully accessible, supporting multiple languages and adaptive accessibility tools natively.</p>
              </div>

              <div style={{ padding: '32px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                <div style={{ width: '48px', height: '48px', background: '#fef2f2', color: '#e11d48', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Map size={24} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>Border-less Ecosystem</h3>
                <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem' }}>Our engineering team spans 15 time zones, enabling us to deeply understand global pain points and build a truly international infrastructure.</p>
              </div>

              <div style={{ padding: '32px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                <div style={{ width: '48px', height: '48px', background: '#f0fdfa', color: '#0d9488', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <TrendingUp size={24} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>Relentless Innovation</h3>
                <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem' }}>From AI-driven itinerary planners to blockchain-verified loyalty points, we continuously push the boundaries of travel technology.</p>
              </div>

            </div>
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div style={{ padding: '100px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Ready to explore the world?</h2>
            <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '40px' }}>Join the millions of travelers discovering the globe with TravelNest.</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link href="/tours" className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                Find an Experience <ArrowRight size={20} />
              </Link>
              <Link href="/supplier/signup" className="btn-secondary" style={{ padding: '14px 32px', fontSize: '1.1rem', background: '#fff', border: '1px solid #cbd5e1', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                Become a Host
              </Link>
            </div>
          </div>
        </div>

      </div>
      
    </>
  );
}
