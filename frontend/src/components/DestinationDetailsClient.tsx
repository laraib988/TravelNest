'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import DestinationNews from '@/components/DestinationNews';
import DestinationWeather from '@/components/DestinationWeather';
import { useCurrency } from '@/context/CurrencyContext';
import { MapPin, Star, Clock, ChevronRight, ChevronDown, ChevronUp, Camera, Route, Sparkles, HelpCircle, ArrowRight, Calendar, Users, Shield, PhoneCall, ShieldCheck, Car, ChevronLeft, Heart } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  country_code: string;
  hero_image: string;
  description: string;
  meta_title?: string;
  meta_description?: string;
  highlights?: string[];
  best_points: { title: string; description: string }[];
  trending_places: { name: string; image: string; description: string }[];
  faqs: { question: string; answer: string }[];
  gallery: { image_url: string; caption: string }[];
  itinerary: { title: string; description: string; image: string }[];
  best_time_to_visit?: { months: string[]; descriptions?: Record<string, string>; description?: string };
  meta_data?: {
    safety?: {
      is_safe_for_women?: boolean;
      safety_score?: number;
      trusted_transport?: string;
      emergency_contacts?: { police?: string; ambulance?: string; women_helpline?: string };
    },
    geo?: { latitude?: number; longitude?: number };
  };
  popular_activities_count: number;
}

interface Props {
  destination: Destination;
  relatedProducts: any[];
  locale: string;
}

export default function DestinationDetailsClient({ destination, relatedProducts, locale }: Props) {
  const { t, formatPrice, wishlist, toggleWishlist } = useCurrency();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const months = destination.best_time_to_visit?.months || [];
    return months[0] || '';
  });
  const [galleryIndex, setGalleryIndex] = useState(0);
  const galleryAutoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [productIndex, setProductIndex] = useState(0);
  const [trendingIndex, setTrendingIndex] = useState(0);

  // Auto-advance slider every 4 seconds when more than 4 images
  useEffect(() => {
    const g = destination.gallery || [];
    if (g.length <= 4) return;
    const pageCount = Math.ceil(g.length / 4);
    galleryAutoRef.current = setInterval(() => {
      setGalleryIndex((prev) => (prev + 1) % pageCount);
    }, 4000);
    return () => {
      if (galleryAutoRef.current) clearInterval(galleryAutoRef.current);
    };
  }, [destination]);

  const GALLERY_PAGE_SIZE = 4;
  const gallery = destination.gallery || [];
  const showGallerySlider = gallery.length > GALLERY_PAGE_SIZE;
  const galleryPageCount = Math.ceil(gallery.length / GALLERY_PAGE_SIZE);
  const visibleGallery = showGallerySlider
    ? gallery.slice(galleryIndex * GALLERY_PAGE_SIZE, galleryIndex * GALLERY_PAGE_SIZE + GALLERY_PAGE_SIZE)
    : gallery;

  const bestPoints = destination.best_points || [];
  const trendingPlaces = destination.trending_places || [];
  const faqs = (destination.faqs || []).filter(f => f.question !== '__META_DATA__');
  const itinerary = destination.itinerary || [];
  const highlights = destination.highlights || [];

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      {/* SECTION 1: HERO SECTION */}
      <section style={{ position: 'relative', height: '75vh', minHeight: '480px', overflow: 'hidden' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
              padding: '6px 14px', borderRadius: '9999px',
              fontSize: '0.85rem', color: '#ffffff', fontWeight: 600
            }}>
              <MapPin size={14} /> {destination.country}
            </div>
            {destination.meta_data?.safety?.is_safe_for_women && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(236, 72, 153, 0.25)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(236, 72, 153, 0.5)',
                padding: '6px 14px', borderRadius: '9999px',
                fontSize: '0.85rem', color: '#fbcfe8', fontWeight: 700,
                boxShadow: '0 4px 12px rgba(236, 72, 153, 0.15)'
              }}>
                <ShieldCheck size={16} /> Verified Safe for Solo Female Travelers
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: '#ffffff',
              lineHeight: 1.1, marginBottom: '12px', letterSpacing: '-0.02em',
              fontFamily: 'var(--font-heading)'
            }}>
              {destination.name}
            </h1>
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
        {/* SECTION 2: LIVE WEATHER */}
        <DestinationWeather slug={destination.slug} name={destination.name} />

        {/* SECTION 2.5: HIGHLIGHTS */}
        {highlights.length > 0 && (
          <section style={{ padding: '64px 0 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Sparkles size={22} color="#0284c7" />
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                {t('highlights')} {destination.name}
              </h2>
            </div>
            <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '28px' }}>
              What makes this destination special.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {highlights.map((point, idx) => (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '14px',
                  background: '#ffffff', borderRadius: '16px', padding: '18px 22px',
                  border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#ffffff', fontWeight: 800, fontSize: '0.95rem'
                  }}>
                    {idx + 1}
                  </div>
                  <p style={{ color: '#334155', fontSize: '0.98rem', lineHeight: 1.6, margin: '6px 0 0' }}>
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: BEST POINTS / HIGHLIGHTS */}
        {bestPoints.length > 0 && (
          <section style={{ padding: '64px 0', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Star size={22} color="#d97706" />
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                {t('why_visit')} {destination.name}?
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

        {/* SECTION 3.5: BEST TIME TO VISIT */}
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
                  const isActive = selectedMonth === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        if (isBest) {
                          setSelectedMonth(isActive ? '' : m);
                        }
                      }}
                      style={{
                        padding: '8px 16px', borderRadius: '999px',
                        background: isActive ? '#0284c7' : (isBest ? '#e0f2fe' : '#f1f5f9'),
                        color: isActive ? '#ffffff' : (isBest ? '#0369a1' : '#94a3b8'),
                        fontWeight: 700, fontSize: '0.85rem', border: 'none',
                        cursor: isBest ? 'pointer' : 'default', transition: 'all 0.2s'
                      }}
                    >
                      {m}
                    </button>
                  )
                })}
              </div>
              {selectedMonth && (
                <div style={{
                  padding: '20px 24px', borderRadius: '14px', background: '#f0f9ff',
                  border: '1px solid #bae6fd', marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Calendar size={16} color="#0284c7" />
                    <span style={{ fontWeight: 800, color: '#0369a1' }}>{selectedMonth}</span>
                  </div>
                  <p style={{ color: '#0c4a6e', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                    {destination.best_time_to_visit!.descriptions?.[selectedMonth] ||
                      (destination.best_time_to_visit!.description
                        ? `${selectedMonth}: ${destination.best_time_to_visit!.description}`
                        : `Best time to visit in ${selectedMonth}.`)}
                  </p>
                </div>
              )}
              {!selectedMonth && destination.best_time_to_visit!.description && (
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7 }}>
                  Click any highlighted month above to see its details.
                </p>
              )}
            </div>
          </section>
        )}

        {/* SECTION 4: TOP TRENDING PLACES */}
        {trendingPlaces.length > 0 && (
          <section style={{ padding: '64px 0', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <MapPin size={22} color="#059669" />
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                {t('trending_places')} {destination.name}
              </h2>
            </div>
            <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '32px' }}>
              The most popular spots and attractions visitors are exploring right now.
            </p>

            {(() => {
              const TRENDING_PAGE_SIZE = 3;
              const showSlider = trendingPlaces.length > TRENDING_PAGE_SIZE;
              const pageCount = Math.ceil(trendingPlaces.length / TRENDING_PAGE_SIZE);
              const safeIndex = Math.min(trendingIndex, Math.max(pageCount - 1, 0));
              const visiblePlaces = showSlider
                ? trendingPlaces.slice(safeIndex * TRENDING_PAGE_SIZE, safeIndex * TRENDING_PAGE_SIZE + TRENDING_PAGE_SIZE)
                : trendingPlaces;

              return (
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                    {visiblePlaces.map((place, idx) => (
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

                  {showSlider && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '28px' }}>
                      <button
                        onClick={() => setTrendingIndex((prev) => (prev - 1 + pageCount) % pageCount)}
                        aria-label="Previous places"
                        style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {Array.from({ length: pageCount }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setTrendingIndex(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            style={{ width: i === safeIndex ? '26px' : '9px', height: '9px', borderRadius: '100px', border: 'none', cursor: 'pointer', background: i === safeIndex ? '#0284c7' : '#cbd5e1', transition: 'all 0.3s' }}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => setTrendingIndex((prev) => (prev + 1) % pageCount)}
                        aria-label="Next places"
                        style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          </section>
        )}

        {/* SECTION 6: GALLERY */}
        {gallery.length > 0 && (
          <section style={{ padding: '64px 0', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Camera size={22} color="#f43f5e" />
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                {t('photo_gallery')}
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
              {visibleGallery.map((item, idx) => (
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

            {showGallerySlider && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '24px' }}>
                <button
                  onClick={() => setGalleryIndex((prev) => (prev - 1 + galleryPageCount) % galleryPageCount)}
                  aria-label="Previous images"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
                >
                  <ChevronLeft size={20} />
                </button>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {Array.from({ length: galleryPageCount }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setGalleryIndex(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      style={{ width: i === galleryIndex ? '26px' : '9px', height: '9px', borderRadius: '100px', border: 'none', cursor: 'pointer', background: i === galleryIndex ? '#0284c7' : '#cbd5e1', transition: 'all 0.3s' }}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setGalleryIndex((prev) => (prev + 1) % galleryPageCount)}
                  aria-label="Next images"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </section>
        )}

        {/* SECTION 7: ITINERARY / MUST-VISIT SPOTS */}
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
              <div style={{
                position: 'absolute', left: '24px', top: '0', bottom: '0', width: '3px',
                background: 'linear-gradient(to bottom, #0284c7, #7c3aed)',
                borderRadius: '2px'
              }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {itinerary.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '24px', position: 'relative' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                      background: '#ffffff', border: '3px solid #0284c7',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, color: '#0284c7', fontSize: '1rem', zIndex: 1,
                      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)'
                    }}>
                      {idx + 1}
                    </div>

                    <div style={{
                      flex: 1, background: '#ffffff', borderRadius: '20px',
                      border: '1px solid #e2e8f0', overflow: 'hidden',
                      display: 'flex', flexDirection: item.image ? 'row' : 'column',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}>
                      {item.image && (
                        <div style={{ width: '220px', flexShrink: 0, overflow: 'hidden' }}>
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

        {/* SECTION 8: SAFETY & SECURITY */}
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

        {/* SECTION 8: RELEVANT PRODUCTS (Slider, shown above FAQs) */}
        {relatedProducts.length > 0 && (
          <section style={{ padding: '64px 0', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Sparkles size={22} color="#0284c7" />
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Top Experiences in {destination.name}
              </h2>
            </div>
            <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '32px', maxWidth: '600px' }}>
              Hand-picked tours matching {destination.name}.
            </p>

            {(() => {
              const PRODUCT_PAGE_SIZE = 3;
              const pageCount = Math.ceil(relatedProducts.length / PRODUCT_PAGE_SIZE);
              const safeIndex = Math.min(productIndex, Math.max(pageCount - 1, 0));
              const visible = relatedProducts.slice(safeIndex * PRODUCT_PAGE_SIZE, safeIndex * PRODUCT_PAGE_SIZE + PRODUCT_PAGE_SIZE);

              return (
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                    {visible.map((product: any) => (
                      <Link key={product.id} href={`/tours/${product.slug || product.id}`} style={{ textDecoration: 'none', display: 'flex' }}>
                        <div className="card-panel" style={{ borderRadius: '16px', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                          <div style={{ height: '200px', position: 'relative' }}>
                            <img
                              src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80'}
                              alt={product.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleWishlist(product.id);
                              }} 
                              style={{ 
                                position: 'absolute', 
                                top: '12px', 
                                right: '12px', 
                                background: 'rgba(255,255,255,0.9)', 
                                backdropFilter: 'blur(4px)', 
                                border: 'none', 
                                borderRadius: '50%', 
                                width: '32px', 
                                height: '32px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                cursor: 'pointer', 
                                zIndex: 10, 
                                boxShadow: 'var(--shadow-sm)'
                              }}
                            >
                              <Heart size={15} color={wishlist.includes(product.id) ? '#e11d48' : '#64748b'} fill={wishlist.includes(product.id) ? '#e11d48' : 'none'} />
                            </button>
                            {product.selling_point && (
                              <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--brand-accent)', color: '#ffffff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                                {product.selling_point}
                              </div>
                            )}
                          </div>
                          <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>
                                  <MapPin size={12} color="#64748b" /> {product.pickup_location || 'Hotel Pickup'}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                                  <Clock size={12} color="#64748b" /> {product.duration || '2 hours'}
                                </span>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                                <Star size={14} color="#d97706" fill="#d97706" />
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>{product.cached_rating_avg}</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(Booked 450+ times)</span>
                              </div>

                              <h3 style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 700, marginBottom: '8px', lineHeight: 1.4 }}>
                                {product.title}
                              </h3>

                              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>{product.confirmation_type || 'Instant Confirmation'}</span>
                                <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>{product.payment_option || 'Pay Now'}</span>
                              </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '14px', marginTop: '14px' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>From <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{formatPrice(product.base_price)}</strong> <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>/ {String(product.pricing_type || 'Per Person').replace(/^per\s+/i, '') || 'Person'}</span></span>
                              <div className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                                Book Slots
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {pageCount > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '28px' }}>
                      <button
                        onClick={() => setProductIndex((prev) => (prev - 1 + pageCount) % pageCount)}
                        aria-label="Previous products"
                        style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {Array.from({ length: pageCount }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setProductIndex(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            style={{ width: i === safeIndex ? '26px' : '9px', height: '9px', borderRadius: '100px', border: 'none', cursor: 'pointer', background: i === safeIndex ? '#0284c7' : '#cbd5e1', transition: 'all 0.3s' }}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => setProductIndex((prev) => (prev + 1) % pageCount)}
                        aria-label="Next products"
                        style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          </section>
        )}

        {/* SECTION 8.5: DESTINATION NEWS */}
        <DestinationNews slug={destination.slug} name={destination.name} />

        {/* SECTION 9: FAQs */}
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
