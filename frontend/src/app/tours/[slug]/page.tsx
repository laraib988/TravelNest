'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchFromAPI } from '@/lib/api-client';
import { Star, Clock, MapPin, CheckCircle2, AlertCircle, ShieldCheck, Lock, ArrowRight, Sparkles, MessageSquare, HelpCircle, ThumbsUp, Camera, Send, ChevronDown, Heart } from 'lucide-react';

export default function TourDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [tour, setTour] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(2);
  const [loading, setLoading] = useState(true);
  const [holding, setHolding] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // SRS 9.14: Contextual AI Q&A State
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [askingAi, setAskingAi] = useState(false);

  // SRS 3.7: Reviews & Ratings State
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    async function loadTour() {
      try {
        const res = await fetchFromAPI(`/listings/${slug}`);
        setTour(res);
        if (res.options && res.options.length > 0) {
          setSelectedOption(res.options[0]);
        }
        if (res.available_slots && res.available_slots.length > 0) {
          setSelectedSlot(res.available_slots[0]);
        }
        // SRS 3.7: Fetch reviews for this listing
        try {
          const reviewsRes = await fetchFromAPI(`/reviews?listing_id=${res.id}`);
          setReviews(Array.isArray(reviewsRes) ? reviewsRes : []);
        } catch { setReviews([]); }
      } catch (err: any) {
        console.error('Error loading listing:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTour();
  }, [slug]);

  // SRS 3.7: Submit Review Handler
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const newReview = await fetchFromAPI('/reviews', {
        method: 'POST',
        body: JSON.stringify({
          listing_id: tour.id,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
          photos: [],
        }),
      });
      setReviews((prev) => [newReview, ...prev]);
      setShowReviewForm(false);
      setReviewTitle('');
      setReviewComment('');
      setReviewRating(5);
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  // SRS 3.7: Helpful Vote Handler
  const handleHelpful = async (reviewId: string) => {
    try {
      await fetchFromAPI(`/reviews/${reviewId}/helpful`, { method: 'POST' });
      setReviews((prev) => prev.map((r) => r.id === reviewId ? { ...r, helpful_count: (r.helpful_count || 0) + 1 } : r));
    } catch {}
  };

  const handleAcquireHold = async () => {
    if (!selectedSlot || !selectedOption) return;
    setHolding(true);
    setErrorMsg('');
    try {
      const holdRes = await fetchFromAPI('/availability/hold', {
        method: 'POST',
        body: JSON.stringify({
          slot_id: selectedSlot.id,
          option_id: selectedOption.id,
          quantity: quantity,
        }),
      });

      router.push(`/checkout?hold_id=${holdRes.hold_id}&expires=${holdRes.expires_at}&option_id=${selectedOption.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Slot locked by another customer. Please choose another date.');
    } finally {
      setHolding(false);
    }
  };

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

  const remainingSeats = selectedSlot ? selectedSlot.total_capacity - (selectedSlot.booked_capacity + selectedSlot.held_capacity) : 0;
  const currentPrice = selectedOption ? selectedOption.price : tour.base_price;

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
      {/* TITLE & MERCHANDISING BADGES */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          <span className="badge-emerald">{tour.category_name}</span>
          <span className="badge-amber">⚡ {tour.confirmation_type === 'INSTANT' ? 'Instant Voucher Confirmation' : '24H Supplier SLA Confirmation'}</span>
          {tour.merchandising_badges?.map((badge: string, i: number) => (
            <span key={i} className="badge-rose">{badge}</span>
          ))}
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px', color: '#0f172a' }}>{tour.title}</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Star size={16} color="#d97706" fill="#d97706" /> <strong style={{ color: '#0f172a' }}>{tour.cached_rating_avg}</strong> ({tour.cached_review_count} reviews)</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} /> {tour.duration_minutes / 60} Hours</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} color="var(--brand-primary)" /> {tour.meeting_point?.address}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={16} color="#059669" /> Verified Supplier</span>
        </div>
      </div>

      {/* GALLERY */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '400px', marginBottom: '40px' }}>
        <img src={tour.images[0]?.url} alt={tour.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <img src={tour.images[1]?.url || tour.images[0]?.url} alt="Secondary View" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

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

          <h2 style={{ fontSize: '1.6rem', marginBottom: '16px', color: '#0f172a' }}>Experience Overview</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
            {tour.description}
          </p>

          <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: '#0f172a' }}>What's Included</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {tour.inclusions?.map((item: string, idx: number) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', color: '#334155' }}>
                <CheckCircle2 size={18} color="#059669" /> {item}
              </li>
            ))}
          </ul>

          <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: '#0f172a' }}>Know Before You Go</h3>
          <div className="card-panel" style={{ padding: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: '40px' }}>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-secondary)' }}>
              {tour.know_before_you_go?.map((item: string, idx: number) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <AlertCircle size={18} color="var(--brand-primary)" style={{ flexShrink: 0, marginTop: '2px' }} /> {item}
                </li>
              ))}
            </ul>
          </div>

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

          {/* ═══════════ SRS 3.7: REVIEWS & RATINGS SECTION ═══════════ */}
          <div style={{ marginTop: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.6rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Star size={22} color="#d97706" fill="#d97706" /> Traveler Reviews
                <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-muted)' }}>({reviews.length})</span>
              </h2>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.88rem' }}
              >
                <Send size={16} /> Write a Review
              </button>
            </div>

            {/* RATING DISTRIBUTION HISTOGRAM */}
            <div className="card-panel" style={{ padding: '24px', marginBottom: '24px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', gap: '40px', alignItems: 'center' }}>
              <div style={{ textAlign: 'center', minWidth: '120px' }}>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{tour.cached_rating_avg}</div>
                <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', margin: '8px 0' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} color="#d97706" fill={s <= Math.round(tour.cached_rating_avg) ? '#d97706' : 'none'} />)}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{tour.cached_review_count} reviews</div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[5,4,3,2,1].map(star => {
                  const count = reviews.filter(r => Math.round(r.rating) === star).length;
                  const pct = reviews.length > 0 ? (count / reviews.length) * 100 : (star === 5 ? 70 : star === 4 ? 20 : 5);
                  return (
                    <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', width: '30px' }}>{star} ★</span>
                      <div style={{ flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: star >= 4 ? '#059669' : star === 3 ? '#f59e0b' : '#ef4444', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: '35px', textAlign: 'right' }}>{Math.round(pct)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* REVIEW SUBMISSION FORM */}
            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="card-panel" style={{ padding: '24px', marginBottom: '24px', background: '#fefce8', border: '1px solid #fde68a' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '16px' }}>Share Your Experience</h3>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Your Rating</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[1,2,3,4,5].map(s => (
                      <Star
                        key={s}
                        size={28}
                        color="#d97706"
                        fill={s <= reviewRating ? '#d97706' : 'none'}
                        style={{ cursor: 'pointer', transition: 'transform 0.15s' }}
                        onClick={() => setReviewRating(s)}
                      />
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Review title (e.g. 'Amazing sunset cruise!')"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', color: '#0f172a', fontSize: '0.95rem', outline: 'none' }}
                />
                <textarea
                  placeholder="Tell travelers about your experience..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', color: '#0f172a', fontSize: '0.95rem', resize: 'vertical', outline: 'none' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                  <button type="button" onClick={() => setShowReviewForm(false)} className="btn-secondary" style={{ padding: '10px 20px' }}>Cancel</button>
                  <button type="submit" disabled={submittingReview} className="btn-primary" style={{ padding: '10px 20px' }}>
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}

            {/* INDIVIDUAL REVIEW CARDS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reviews.map((review: any) => (
                <div key={review.id} className="card-panel" style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', transition: 'box-shadow 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <img src={review.user_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user_name)}&background=0284c7&color=fff`} alt={review.user_name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{review.user_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '2px' }}>
                      {[1,2,3,4,5].map(s => <Star key={s} size={14} color="#d97706" fill={s <= review.rating ? '#d97706' : 'none'} />)}
                    </div>
                    <span className="badge-emerald" style={{ fontSize: '0.7rem' }}>✓ Verified Booking</span>
                  </div>
                  {review.title && <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', marginBottom: '6px' }}>{review.title}</div>}
                  <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '12px' }}>{review.comment}</p>
                  {review.photos && review.photos.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      {review.photos.map((p: string, i: number) => (
                        <img key={i} src={p} alt="Traveler photo" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                      ))}
                    </div>
                  )}
                  {/* Supplier Reply */}
                  {review.supplier_reply && (
                    <div style={{ marginTop: '10px', padding: '12px', background: '#f0f9ff', borderRadius: '10px', border: '1px solid #7dd3fc' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0369a1', marginBottom: '4px' }}>🛡️ Supplier Response</div>
                      <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0 }}>{review.supplier_reply.text}</p>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
                    <button onClick={() => handleHelpful(review.id)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '20px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: '0.8rem', color: '#64748b', transition: 'all 0.2s' }}>
                      <ThumbsUp size={13} /> Helpful ({review.helpful_count || 0})
                    </button>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  No reviews yet. Be the first to share your experience!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REAL-TIME OPTION SELECTOR & REDIS SLOT LOCK */}
        <div>
          <div className="card-panel" style={{ padding: '30px', position: 'sticky', top: '100px', background: '#ffffff', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Price per traveler</span>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                  ${currentPrice} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 400 }}>{tour.currency}</span>
                </div>
              </div>
              <div className="badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Lock size={12} /> Redis Atomic Lock
              </div>
            </div>

            {/* SRS 3.3 / 4.4: MULTI-OPTION SKU SELECTOR */}
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px', color: '#0f172a' }}>Select Ticket Option / Variant</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {tour.options?.map((opt: any) => {
                const isOptSelected = selectedOption?.id === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedOption(opt)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: isOptSelected ? '2px solid var(--brand-primary)' : '1px solid #cbd5e1',
                      background: isOptSelected ? '#f0f9ff' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{opt.name}</div>
                      {opt.inclusions_addon && <div style={{ fontSize: '0.75rem', color: '#059669' }}>Includes VIP transfers</div>}
                    </div>
                    <strong style={{ color: 'var(--brand-primary)', fontSize: '0.95rem' }}>${opt.price}</strong>
                  </div>
                );
              })}
            </div>

            {/* DATE & TIME SLOT SELECTOR */}
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px', color: '#0f172a' }}>Select Date & Time Slot</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {tour.available_slots?.map((slot: any) => {
                const avail = slot.total_capacity - (slot.booked_capacity + slot.held_capacity);
                const isSelected = selectedSlot?.id === slot.id;
                return (
                  <div
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-sm)',
                      border: isSelected ? '2px solid var(--brand-primary)' : '1px solid #cbd5e1',
                      background: isSelected ? '#f0f9ff' : '#f8fafc',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>{new Date(slot.start_time).toLocaleString()}</div>
                      <div style={{ fontSize: '0.8rem', color: avail > 3 ? '#059669' : '#d97706', fontWeight: 600 }}>
                        {avail > 0 ? `${avail} seats available` : 'Sold Out'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px', color: '#0f172a' }}>Number of Guests</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e2e8f0', border: 'none', color: '#0f172a', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 700 }}
              >
                -
              </button>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, width: '30px', textAlign: 'center', color: '#0f172a' }}>{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(remainingSeats || 10, quantity + 1))}
                style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e2e8f0', border: 'none', color: '#0f172a', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 700 }}
              >
                +
              </button>
            </div>

            {errorMsg && (
              <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: '#ffe4e6', color: '#e11d48', fontSize: '0.85rem', marginBottom: '16px' }}>
                {errorMsg}
              </div>
            )}

            <button
              onClick={handleAcquireHold}
              disabled={holding || remainingSeats <= 0}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1.05rem' }}
            >
              {holding ? 'Acquiring Redis Lock...' : remainingSeats > 0 ? 'Lock Inventory & Checkout' : 'Sold Out'}
              <ArrowRight size={18} />
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '14px' }}>
              🔒 Locks seat for 15 minutes. Zero risk of overbooking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
