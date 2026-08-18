'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Star, Clock, ChevronRight, ChevronDown, ChevronUp, Camera, Route, Sparkles, HelpCircle, ArrowRight, Calendar, Users, Shield, PhoneCall, ShieldCheck, Car } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  country_code: string;
  hero_image: string;
  description: string;
  best_points: { title: string; description: string }[];
  trending_places: { name: string; image: string; description: string }[];
  faqs: { question: string; answer: string }[];
  gallery: { image_url: string; caption: string }[];
  itinerary: { title: string; description: string; image: string }[];
  best_time_to_visit?: { months: string[]; description: string };
  meta_data?: {
    safety?: {
      is_safe_for_women?: boolean;
      safety_score?: number;
      trusted_transport?: string;
      emergency_contacts?: { police?: string; ambulance?: string; women_helpline?: string };
    }
  };
  popular_activities_count: number;
}

export default function DestinationTemplatePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [destination, setDestination] = useState<Destination | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/public/destinations/${slug}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setDestination(data.destination);
        setRelatedProducts(data.relatedProducts || []);
      } catch (err) {
        console.error('Error loading destination:', err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) load();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <MapPin size={48} color="#0284c7" style={{ animation: 'pulse-glow 2s infinite' }} />
          <p style={{ marginTop: '16px', color: '#64748b', fontWeight: 600 }}>Loading destination...</p>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <MapPin size={64} color="#94a3b8" />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '16px 0 8px' }}>Destination Not Found</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>The destination you are looking for does not exist or is not published yet.</p>
          <Link href="/destinations" className="btn-primary" style={{ padding: '12px 32px' }}>Browse Destinations</Link>
        </div>
      </div>
    );
  }

  const bestPoints = destination.best_points || [];
  const trendingPlaces = destination.trending_places || [];
  const faqs = destination.faqs || [];
  const gallery = destination.gallery || [];
  const itinerary = destination.itinerary || [];

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SECTION 1: HERO SECTION */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', height: '520px', overflow: 'hidden' }}>
        <img
          src={destination.hero_image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80'}
          alt={destination.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.4) 40%, rgba(15,23,42,0.1) 100%)'
        }} />

        {/* Breadcrumb */}
        <div style={{ position: 'absolute', top: '24px', left: '0', right: '0', maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} color="rgba(255,255,255,0.5)" />
            <Link href="/destinations" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Destinations</Link>
            <ChevronRight size={14} color="rgba(255,255,255,0.5)" />
            <span style={{ color: '#ffffff', fontWeight: 700 }}>{destination.name}</span>
          </div>
        </div>

        {/* Hero Content */}
        <div style={{ position: 'absolute', bottom: '48px', left: '0', right: '0', maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
            padding: '6px 14px', borderRadius: '9999px', marginBottom: '16px',
            fontSize: '0.85rem', color: '#ffffff', fontWeight: 600
          }}>
            <MapPin size={14} /> {destination.country}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: '#ffffff',
              lineHeight: 1.1, marginBottom: '12px', letterSpacing: '-0.02em',
              fontFamily: 'var(--font-heading)'
            }}>
              {destination.name}
            </h1>
            {destination.meta_data?.safety?.is_safe_for_women && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(236, 72, 153, 0.25)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(236, 72, 153, 0.5)',
                padding: '8px 16px', borderRadius: '9999px', marginBottom: '12px',
                fontSize: '0.9rem', color: '#fbcfe8', fontWeight: 700,
                boxShadow: '0 4px 12px rgba(236, 72, 153, 0.15)'
              }}>
                <ShieldCheck size={16} /> Verified Safe for Solo Female Travelers
              </div>
            )}
          </div>
          <p style={{
            color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', maxWidth: '680px',
            lineHeight: 1.6
          }}>
            {destination.description}
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 2: RELATED PRODUCTS / TOURS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {relatedProducts.length > 0 && (
          <section style={{ padding: '64px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Sparkles size={22} color="#0284c7" />
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Top Experiences in {destination.name}
              </h2>
            </div>
            <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '32px', maxWidth: '600px' }}>
              Discover hand-picked tours, activities, and excursions curated for {destination.name}.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {relatedProducts.map((product: any) => (
                <Link key={product.id} href={`/tours/${product.basic_info?.slug || product.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card-interactive" style={{
                    background: '#ffffff', borderRadius: '20px', overflow: 'hidden',
                    border: '1px solid #e2e8f0', height: '360px', display: 'flex', flexDirection: 'column'
                  }}>
                    <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                      <img
                        src={product.basic_info?.images?.[0]?.url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80'}
                        alt={product.basic_info?.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      />
                      <div style={{
                        position: 'absolute', top: '12px', right: '12px',
                        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
                        padding: '4px 10px', borderRadius: '9999px', fontSize: '0.82rem',
                        fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px'
                      }}>
                        <Star size={13} color="#d97706" fill="#d97706" /> {product.basic_info?.rating || '4.8'}
                      </div>
                    </div>
                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px', lineHeight: 1.3 }}>
                          {product.basic_info?.title}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b', fontSize: '0.82rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={13} /> {product.basic_info?.duration || '3 hours'}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={13} /> {destination.name}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #f1f5f9', marginTop: '12px' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0284c7' }}>
                          ${product.transport_pricing?.[0]?.retail_price || product.basic_info?.price || '49'}
                        </span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Book Now <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 3: BEST POINTS / HIGHLIGHTS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {bestPoints.length > 0 && (
          <section style={{ padding: '64px 0', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Star size={22} color="#d97706" />
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Why Visit {destination.name}?
              </h2>
            </div>
            <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '32px' }}>
              Top reasons travelers love this destination.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {bestPoints.map((point, idx) => (
                <div key={idx} style={{
                  background: '#f8fafc', borderRadius: '20px', padding: '28px',
                  border: '1px solid #e2e8f0', transition: 'all 0.3s',
                  position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '16px', color: '#ffffff', fontWeight: 800, fontSize: '1.2rem'
                  }}>
                    {idx + 1}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                    {point.title}
                  </h3>
                  <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 3.5: BEST TIME TO VISIT */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {destination.best_time_to_visit && destination.best_time_to_visit.months.length > 0 && (
          <section style={{ padding: '64px 0', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Calendar size={22} color="#0284c7" />
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Best Time to Visit
              </h2>
            </div>
            <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '32px' }}>
              Plan your trip for the perfect experience.
            </p>

            <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', padding: '32px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => {
                  const isBest = destination.best_time_to_visit!.months.includes(m);
                  return (
                    <div key={m} style={{
                      padding: '8px 16px', borderRadius: '999px',
                      background: isBest ? '#0284c7' : '#f1f5f9',
                      color: isBest ? '#ffffff' : '#64748b',
                      fontWeight: 700, fontSize: '0.85rem'
                    }}>
                      {m}
                    </div>
                  )
                })}
              </div>
              {destination.best_time_to_visit.description && (
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7 }}>
                  {destination.best_time_to_visit.description}
                </p>
              )}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 4: TOP TRENDING PLACES */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {trendingPlaces.length > 0 && (
          <section style={{ padding: '64px 0', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <MapPin size={22} color="#059669" />
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Trending Places in {destination.name}
              </h2>
            </div>
            <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '32px' }}>
              The most popular spots and attractions visitors are exploring right now.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {trendingPlaces.map((place, idx) => (
                <div key={idx} style={{
                  borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0',
                  background: '#ffffff', transition: 'all 0.3s'
                }}>
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img
                      src={place.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80'}
                      alt={place.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                    />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                      {place.name}
                    </h3>
                    <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6 }}>
                      {place.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}


        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 6: GALLERY */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {gallery.length > 0 && (
          <section style={{ padding: '64px 0', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Camera size={22} color="#f43f5e" />
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Photo Gallery
              </h2>
            </div>
            <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '32px' }}>
              Stunning visuals from {destination.name} to inspire your next adventure.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '16px'
            }}>
              {gallery.map((item, idx) => (
                <div key={idx} style={{
                  borderRadius: '16px', overflow: 'hidden', position: 'relative',
                  height: '260px',
                  border: '1px solid #e2e8f0'
                }}>
                  <img
                    src={item.image_url}
                    alt={item.caption}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                  />
                  {item.caption && (
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(to top, rgba(15,23,42,0.8), transparent)',
                      padding: '24px 16px 12px', color: '#ffffff',
                      fontSize: '0.85rem', fontWeight: 600
                    }}>
                      {item.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 7: ITINERARY / MUST-VISIT SPOTS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {itinerary.length > 0 && (
          <section style={{ padding: '64px 0 80px', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Route size={22} color="#0284c7" />
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Suggested Itinerary
              </h2>
            </div>
            <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '40px' }}>
              Must-visit spots and landmarks when exploring {destination.name}.
            </p>

            <div style={{ position: 'relative', maxWidth: '900px' }}>
              {/* Timeline line */}
              <div style={{
                position: 'absolute', left: '24px', top: '0', bottom: '0', width: '3px',
                background: 'linear-gradient(to bottom, #0284c7, #7c3aed)',
                borderRadius: '2px'
              }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {itinerary.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '24px', position: 'relative' }}>
                    {/* Timeline dot */}
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                      background: '#ffffff', border: '3px solid #0284c7',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, color: '#0284c7', fontSize: '1rem', zIndex: 1,
                      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)'
                    }}>
                      {idx + 1}
                    </div>

                    {/* Content card */}
                    <div style={{
                      flex: 1, background: '#ffffff', borderRadius: '20px',
                      border: '1px solid #e2e8f0', overflow: 'hidden',
                      display: 'flex', flexDirection: item.image ? 'row' : 'column',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}>
                      {item.image && (
                        <div style={{ width: item.image ? '220px' : '0', flexShrink: 0, overflow: 'hidden' }}>
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '160px' }}
                          />
                        </div>
                      )}
                      <div style={{ padding: '24px', flex: 1 }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                          {item.title}
                        </h3>
                        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7 }}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 8: SAFETY & SECURITY */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {destination.meta_data?.safety && (
          <section style={{ padding: '64px 0', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <ShieldCheck size={24} color="#ec4899" />
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Traveler Safety & Security
              </h2>
            </div>
            <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '40px', maxWidth: '600px' }}>
              Essential safety information and trusted transport options for solo travelers in {destination.name}.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              
              {/* Safety Score Card */}
              {destination.meta_data.safety.safety_score > 0 && (
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: destination.meta_data.safety.safety_score >= 7 ? '#f0fdf4' : '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: destination.meta_data.safety.safety_score >= 7 ? '#16a34a' : '#ea580c', fontSize: '1.5rem', fontWeight: 800 }}>
                    {destination.meta_data.safety.safety_score}<span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>/10</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Overall Safety Score</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Based on recent traveler experiences.</p>
                  </div>
                </div>
              )}

              {/* Trusted Transport Card */}
              {destination.meta_data.safety.trusted_transport && (
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Car size={28} color="#0284c7" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Trusted Transport</h3>
                    <p style={{ fontSize: '0.95rem', color: '#334155', fontWeight: 600 }}>{destination.meta_data.safety.trusted_transport}</p>
                  </div>
                </div>
              )}

              {/* Emergency Contacts Card */}
              {(destination.meta_data.safety.emergency_contacts?.police || destination.meta_data.safety.emergency_contacts?.ambulance) && (
                <div style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'flex-start', gap: '20px', boxShadow: '0 4px 12px rgba(225, 29, 72, 0.05)' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#ffe4e6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <PhoneCall size={24} color="#e11d48" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#9f1239', marginBottom: '12px' }}>Emergency Contacts</h3>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {destination.meta_data.safety.emergency_contacts.police && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                          <span style={{ color: '#be185d' }}>Police:</span>
                          <span style={{ fontWeight: 700, color: '#9f1239' }}>{destination.meta_data.safety.emergency_contacts.police}</span>
                        </div>
                      )}
                      {destination.meta_data.safety.emergency_contacts.ambulance && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                          <span style={{ color: '#be185d' }}>Ambulance:</span>
                          <span style={{ fontWeight: 700, color: '#9f1239' }}>{destination.meta_data.safety.emergency_contacts.ambulance}</span>
                        </div>
                      )}
                      {destination.meta_data.safety.emergency_contacts.women_helpline && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginTop: '4px', paddingTop: '4px', borderTop: '1px solid #fecdd3' }}>
                          <span style={{ color: '#be185d', fontWeight: 600 }}>Women's Helpline:</span>
                          <span style={{ fontWeight: 800, color: '#e11d48' }}>{destination.meta_data.safety.emergency_contacts.women_helpline}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 8: FAQs (Moved to Bottom) */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {faqs.length > 0 && (
          <section style={{ padding: '64px 0', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <HelpCircle size={22} color="#7c3aed" />
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Frequently Asked Questions
              </h2>
            </div>
            <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '40px' }}>
              Everything you need to know about {destination.name}.
            </p>

            <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {faqs.map((faq, idx) => (
                <div key={idx} style={{
                  background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0',
                  overflow: 'hidden', transition: 'all 0.3s'
                }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '20px 24px', background: 'transparent', border: 'none',
                      fontSize: '1rem', fontWeight: 700, color: '#0f172a', textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{faq.question}</span>
                    {openFaq === idx ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                  </button>
                  {openFaq === idx && (
                    <div style={{
                      padding: '0 24px 20px', color: '#475569', fontSize: '0.92rem',
                      lineHeight: 1.7, borderTop: '1px solid #f1f5f9'
                    }}>
                      <p style={{ paddingTop: '16px' }}>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
