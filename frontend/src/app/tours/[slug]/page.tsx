'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchFromAPI } from '@/lib/api-client';
import { useCurrency } from '@/context/CurrencyContext';
import { Sparkles, MapPin, CheckCircle2, HelpCircle, Star, XCircle } from 'lucide-react';

import TourGallery from '@/components/tours/TourGallery';
import TourReviews from '@/components/tours/TourReviews';
import TourBookingWidget from '@/components/tours/TourBookingWidget';

export default function TourDetailPage() {
  const { formatPrice, t } = useCurrency();
  const params = useParams();
  const slug = params.slug as string;

  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // SRS 9.14: Contextual AI Q&A State
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [askingAi, setAskingAi] = useState(false);
  const [relevantProducts, setRelevantProducts] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function loadTour() {
      try {
        let res;
        try {
          res = await fetchFromAPI(`/listings/${slug}`);
        } catch (backendErr) {
          // Fallback to Next.js API for Supabase products
          const nextRes = await fetch(`/api/public/listings/${slug}`);
          if (!nextRes.ok) throw new Error('Not found in Supabase');
          res = await nextRes.json();
        }
        setTour(res);
        
        // Fetch relevant products
        try {
          const allListings = await fetch('/api/public/listings').then(r => r.json());
          if (Array.isArray(allListings)) {
            const others = allListings.filter(item => item.id !== res.id).slice(0, 4);
            setRelevantProducts(others);
          }
        } catch { setRelevantProducts([]); }
      } catch (err: any) {
        console.error('Error loading listing:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTour();
  }, [slug]);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    setAskingAi(true);
    try {
      const res = await fetchFromAPI('/ai/contextual-qa', {
        method: 'POST',
        body: JSON.stringify({ listing_id: tour.id, question: aiQuestion }),
      });
      setAiAnswer(res.answer);
    } catch (err) {
      console.error(err);
    } finally {
      setAskingAi(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '100px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading experience details...</div>;
  }

  if (!tour) {
    return <div style={{ padding: '100px', textAlign: 'center', color: 'var(--brand-accent)' }}>Experience not found.</div>;
  }

  // SRS 8.3: JSON-LD Structured Data (Product + AggregateRating + FAQ Schema)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: tour.title,
    description: tour.description,
    image: tour.images?.map((img: any) => img.url),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tour.cached_rating_avg,
      reviewCount: tour.cached_review_count,
    },
    offers: {
      '@type': 'Offer',
      price: tour.base_price,
      priceCurrency: tour.currency,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '40px auto', padding: '0 24px', background: '#ffffff' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <TourGallery tour={tour} />

      {/* TWO COLUMN CONTENT & BOOKING PANEL */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr', gap: '40px' }}>
        {/* LEFT COLUMN: DETAILS & SRS AI REVIEW INTELLIGENCE */}
        <div>
          {/* SRS 9.3: AI REVIEW INTELLIGENCE CARD */}
          {tour.ai_review_summary && (
            <div className="card-panel" style={{ padding: '24px', marginBottom: '32px', background: '#f0f9ff', border: '1px solid #7dd3fc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Sparkles size={20} color="var(--brand-primary)" />
                <h3 style={{ fontSize: '1.15rem', color: '#0f172a' }}>AI Review Intelligence Summary</h3>
                <span className="badge-emerald" style={{ marginLeft: 'auto' }}>
                  {Math.round(tour.ai_review_summary.sentiment_score * 100)}% Positive Sentiment
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
                <div>
                  <strong style={{ color: '#059669', display: 'block', marginBottom: '6px' }}>Top Pros:</strong>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px', color: '#334155' }}>
                    {tour.ai_review_summary.pros.map((p: string, i: number) => <li key={i}>✓ {p}</li>)}
                  </ul>
                </div>
                <div>
                  <strong style={{ color: '#b45309', display: 'block', marginBottom: '6px' }}>Traveler Tips:</strong>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px', color: '#334155' }}>
                    {tour.ai_review_summary.cons.map((c: string, i: number) => <li key={i}>• {c}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tour.description && tour.description !== 'No description provided.' && (
            <>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '16px', color: '#0f172a' }}>Experience Overview</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
                {tour.description}
              </p>
            </>
          )}

          {tour.highlights?.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '16px', color: '#0f172a' }}>{t('highlights')}</h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {tour.highlights.filter((h: string) => h.trim().length > 0).map((item: string, idx: number) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '1.05rem', color: '#334155' }}>
                    <Sparkles size={18} color="var(--brand-primary)" style={{ flexShrink: 0, marginTop: '4px' }} /> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(tour.inclusions?.length > 0 || tour.know_before_you_go?.length > 0) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
              {tour.inclusions?.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: '#0f172a' }}>{t('whats_included')}</h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {tour.inclusions.map((item: string, idx: number) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '1rem', color: '#334155' }}>
                        <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tour.know_before_you_go?.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: '#0f172a' }}>{t('whats_excluded')}</h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-secondary)' }}>
                    {tour.know_before_you_go.map((item: string, idx: number) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <XCircle size={18} color="#e11d48" style={{ flexShrink: 0, marginTop: '2px' }} /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* SRS 9.14: "ASK AI ABOUT THIS PLACE" CONTEXTUAL Q&A WIDGET */}
          <div className="card-panel" style={{ padding: '24px', background: '#ffffff', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <HelpCircle size={20} color="var(--brand-primary)" />
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a' }}>Ask AI About This Experience</h3>
            </div>
            <form onSubmit={handleAskAI} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Ask anything (e.g. 'Is this suitable for kids?', 'What is the refund policy?')"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-sm)', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', outline: 'none' }}
              />
              <button type="submit" disabled={askingAi} className="btn-primary" style={{ padding: '12px 20px' }}>
                {askingAi ? 'Asking...' : 'Ask AI'}
              </button>
            </form>

            {aiAnswer && (
              <div style={{ padding: '14px', borderRadius: 'var(--radius-sm)', background: '#f0f9ff', border: '1px solid #7dd3fc', fontSize: '0.95rem', color: '#0369a1' }}>
                <strong>🤖 AI Concierge Answer:</strong> {aiAnswer}
              </div>
            )}
          </div>

          {/* ITINERARY SECTION */}
          {tour.itinerary && tour.itinerary.length > 0 && (
            <div style={{ marginTop: '40px', padding: '24px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <h2 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={24} color="var(--brand-primary)" /> Tour Itinerary
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', marginLeft: '12px' }}>
                <div style={{ position: 'absolute', left: '0', top: '10px', bottom: '10px', width: '2px', background: '#e2e8f0', zIndex: 0 }}></div>
                
                {(() => {
                  const fullItinerary = [
                    {
                      locationName: 'Pickup: ' + (tour.meeting_point?.address || 'Designated Location'),
                      description: 'Meet your guide and group to begin your journey.',
                      isLogistics: true
                    },
                    ...tour.itinerary,
                    {
                      locationName: 'Drop-off: ' + (tour.dropoff_point?.address || 'Designated Location'),
                      description: 'Your tour concludes here. We hope you had a great time!',
                      isLogistics: true
                    }
                  ];
                  
                  return fullItinerary.map((item: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', gap: '20px', marginBottom: idx === fullItinerary.length - 1 ? 0 : '30px', position: 'relative', zIndex: 1 }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ffffff', border: '3px solid var(--brand-primary)', flexShrink: 0, transform: 'translateX(-11px)' }}></div>
                      <div style={{ flex: 1, paddingBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '8px' }}>
                          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', margin: 0, fontWeight: 700 }}>{item.locationName}</h3>
                          {item.timeToSpend && (
                            <span style={{ fontSize: '0.85rem', color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '100px', fontWeight: 600 }}>{item.timeToSpend}</span>
                          )}
                        </div>
                        
                        {item.attractionType && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {item.attractionType}
                          </div>
                        )}
                        
                        {item.description && (
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, margin: '0 0 12px 0' }}>{item.description}</p>
                        )}
                        
                        {!item.isLogistics && item.hasEntryFee && (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef2f2', color: '#b91c1c', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                            <span>{t('entry_fee')}: ${item.entryFeeAmount}</span>
                          </div>
                        )}
                        {!item.isLogistics && item.hasEntryFee === false && (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', color: '#047857', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                            <span>{t('free_entry')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* FAQs SECTION */}
          {tour.faqs && tour.faqs.length > 0 && (
            <div style={{ marginTop: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={22} color="var(--brand-primary)" /> {t('faq_title')}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {tour.faqs.map((faq: any, idx: number) => (
                  <div key={idx} style={{ padding: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px', fontSize: '1.05rem' }}>{faq.question}</div>
                    <div style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>{faq.answer}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <TourReviews tour={tour} />
        </div>
        
        <div>
          <TourBookingWidget tour={tour} />
        </div>
      </div>
      
      {/* RELEVANT PRODUCTS ROW */}
      {relevantProducts.length > 0 && (
        <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #e2e8f0', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px' }}>{t('relevant_products')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {relevantProducts.map(p => (
              <a key={p.id} href={`/tours/${p.slug || p.id}`} style={{ textDecoration: 'none', display: 'block', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', background: '#fff', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
                <div style={{ height: '160px', width: '100%', overflow: 'hidden' }}>
                  <img src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80'} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '8px', lineHeight: 1.4, height: '44px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    <Star size={14} color="#d97706" fill="#d97706" /> {p.cached_rating_avg || 5.0} ({p.cached_review_count || 0})
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                    From {formatPrice(p.price || p.base_price || 150)}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
