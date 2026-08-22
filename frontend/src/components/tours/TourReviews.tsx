'use client';

import { useState, useEffect } from 'react';
import { Star, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { fetchFromAPI } from '@/lib/api-client';

export default function TourReviews({ tour }: { tour: any }) {
  const { t } = useCurrency();
  const { user, openAuthModal } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewTourTypes, setReviewTourTypes] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);
  const [reviewsSliderIndex, setReviewsSliderIndex] = useState(0);

  useEffect(() => {
    if (!tour?.id) return;
    async function fetchReviews() {
      try {
        const nextRes = await fetch(`/api/public/reviews?listing_id=${tour.id}`, { cache: 'no-store' });
        if (nextRes.ok) {
          const res = await nextRes.json();
          setReviews(Array.isArray(res) ? res : []);
        } else {
          setReviews([]);
        }
      } catch {
        setReviews([]);
      }
    }
    fetchReviews();
  }, [tour?.id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    setUploadError(null);
    setReviewSuccessMsg(null);
    
    let uploadedPhotoUrl = null;
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      try {
        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedPhotoUrl = uploadData.url;
        } else {
          throw new Error('Image upload failed');
        }
      } catch (err) {
        setUploadError('Failed to upload image. Please try again.');
        setSubmittingReview(false);
        return;
      }
    }

    try {
      const nextReviewRes = await fetch('/api/public/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: tour.id,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
          photos: uploadedPhotoUrl ? [uploadedPhotoUrl] : [],
          tour_types: reviewTourTypes,
          user_id: user?.id,
          user_name: user?.name || (user?.email?.split('@')[0] || 'Anonymous'),
          user_avatar: user?.avatar || null
        }),
      });
      if (!nextReviewRes.ok) {
        const errBody = await nextReviewRes.json().catch(() => ({}));
        throw new Error(errBody.message || 'Failed to submit review via proxy');
      }
      setReviewSuccessMsg('Your review has been submitted for moderation! It will appear once approved by the administrator.');
      setReviewTitle('');
      setReviewComment('');
      setReviewRating(5);
      setReviewTourTypes([]);
      setTimeout(() => {
        setShowReviewForm(false);
        setReviewSuccessMsg(null);
      }, 5000);
    } catch (err) {
      console.error('Error submitting review:', err);
      setUploadError('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Star size={22} color="#d97706" fill="#d97706" /> {t('traveler_reviews')}
          <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-muted)' }}>({reviews.length})</span>
        </h2>
        <button
          onClick={() => { if (!user) { router.push(`/login?redirect=${encodeURIComponent(pathname)}`); return; } setShowReviewForm(!showReviewForm); }}
          className="btn-primary"
          style={{ padding: '10px 20px', fontSize: '0.88rem' }}
        >
          <Send size={16} /> Write a Review
        </button>
      </div>

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

      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="card-panel" style={{ padding: '24px', marginBottom: '24px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Share Your Experience</h3>
          
          {reviewSuccessMsg && (
            <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', color: '#166534', padding: '12px 16px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600, marginBottom: '16px' }}>
              {reviewSuccessMsg}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Your Rating</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1,2,3,4,5].map(s => (
                <Star
                  key={s}
                  size={32}
                  color="#d97706"
                  fill={s <= (hoverRating || reviewRating) ? '#d97706' : 'none'}
                  style={{ cursor: 'pointer', transition: 'transform 0.15s, fill 0.15s' }}
                  onClick={() => setReviewRating(s)}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  onMouseDown={(e: any) => e.currentTarget.style.transform = 'scale(0.9)'}
                  onMouseUp={(e: any) => e.currentTarget.style.transform = 'scale(1.1)'}
                />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Who did you travel with? (Multi-select)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Family', 'Friends', 'Solo', 'Couple', 'Business'].map(type => {
                const isSelected = reviewTourTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setReviewTourTypes(prev =>
                        prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
                      );
                    }}
                    style={{
                      padding: '6px 16px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      borderRadius: '20px',
                      cursor: 'pointer',
                      border: isSelected ? 'none' : '1px solid #cbd5e1',
                      background: isSelected ? 'var(--brand-primary)' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#475569',
                      transition: 'all 0.15s'
                    }}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* File Upload UI */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Attach Photo (Max 2MB)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 2 * 1024 * 1024) {
                    setUploadError('Image size must be less than 2MB');
                    e.target.value = '';
                    setImageFile(null);
                    return;
                  }
                  setImageFile(file);
                  setUploadError(null);
                }
              }}
              style={{ fontSize: '0.85rem' }}
            />
            {imageFile && <span style={{ marginLeft: '10px', fontSize: '0.8rem', color: '#16a34a' }}>Selected: {imageFile.name}</span>}
            {uploadError && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>{uploadError}</div>}
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

      <div style={{ position: 'relative', overflow: 'hidden', padding: '0 4px' }}>
        {reviews.length > 0 ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Showing {Math.min(reviews.length, reviewsSliderIndex + 1)} - {Math.min(reviews.length, reviewsSliderIndex + 3)} of {reviews.length} reviews</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setReviewsSliderIndex(prev => Math.max(0, prev - 3))}
                  disabled={reviewsSliderIndex === 0}
                  style={{ border: '1px solid #cbd5e1', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#ffffff', cursor: reviewsSliderIndex === 0 ? 'not-allowed' : 'pointer', opacity: reviewsSliderIndex === 0 ? 0.4 : 1, transition: 'all 0.2s' }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setReviewsSliderIndex(prev => Math.min(reviews.length - (reviews.length % 3 || 3), prev + 3))}
                  disabled={reviewsSliderIndex + 3 >= reviews.length}
                  style={{ border: '1px solid #cbd5e1', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#ffffff', cursor: reviewsSliderIndex + 3 >= reviews.length ? 'not-allowed' : 'pointer', opacity: reviewsSliderIndex + 3 >= reviews.length ? 0.4 : 1, transition: 'all 0.2s' }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {reviews.slice(reviewsSliderIndex, reviewsSliderIndex + 3).map((review: any) => (
                <div key={review.id} style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', minHeight: '320px', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <img src={review.user_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user_name)}&background=0ea5e9&color=fff`} alt={review.user_name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{review.user_name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(review.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>
                      {[1,2,3,4,5].map(s => <Star key={s} size={14} color="#d97706" fill={s <= review.rating ? '#d97706' : 'none'} />)}
                    </div>

                    {review.tour_types && review.tour_types.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                        {review.tour_types.map((type: string) => (
                          <span key={type} style={{ background: '#f1f5f9', color: '#334155', fontSize: '0.7rem', fontWeight: 700, padding: '4px 8px', borderRadius: '12px' }}>
                            {type}
                          </span>
                        ))}
                      </div>
                    )}

                    {review.title && <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: '8px' }}>{review.title}</div>}
                    
                    <p style={{ color: '#334155', fontSize: '0.9rem', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                      {review.comment}
                    </p>
                    
                    {review.photos && review.photos.length > 0 && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        {review.photos.map((p: string, i: number) => (
                          <img key={i} src={p} alt="Traveler photo" style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                        ))}
                      </div>
                    )}
                  </div>

                  {review.supplier_reply && (
                    <div style={{ marginTop: '16px', padding: '12px', background: '#f0f9ff', borderRadius: '8px', borderLeft: '4px solid #0284c7' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0369a1', marginBottom: '4px' }}>💬 Supplier Replied</div>
                      <div style={{ fontSize: '0.85rem', color: '#0f172a', fontStyle: 'italic' }}>"{review.supplier_reply.text}"</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            No reviews yet. Be the first to share your experience!
          </div>
        )}
      </div>
    </div>
  );
}
