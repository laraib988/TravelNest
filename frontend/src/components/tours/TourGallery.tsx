'use client';

import { Star, Clock, MapPin, ShieldCheck } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import Image from 'next/image';

export default function TourGallery({ tour }: { tour: any }) {
  const { t } = useCurrency();

  if (!tour) return null;

  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          <span className="badge-emerald">{tour.category_name}</span>
          <span className="badge-amber">⚡ {tour.confirmation_type || 'Instant Confirmation'}</span>
          {tour.merchandising_badges?.map((badge: string, i: number) => (
            <span key={i} className="badge-rose">{badge}</span>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '12px', color: '#0f172a', flex: 1 }}>{tour.title}</h1>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Star size={16} color="#d97706" fill="#d97706" /> <strong style={{ color: '#0f172a' }}>{tour.cached_rating_avg}</strong> ({tour.cached_review_count} reviews)</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} /> {tour.duration_text || `${tour.duration_minutes / 60} Hours`}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} color="var(--brand-primary)" /> {tour.meeting_point?.address}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={16} color="#059669" /> Verified Supplier</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '450px', marginBottom: '40px' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Image 
            src={tour.images?.[0]?.url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5'} 
            alt={tour.title} 
            fill
            priority
            sizes="(max-width: 768px) 100vw, 66vw"
            style={{ objectFit: 'cover', borderRadius: 'var(--radius-md)' }} 
          />
        </div>
        {tour.images?.length > 1 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '16px' }}>
            {tour.images.slice(1, 5).map((img: any, i: number) => (
              <div key={i} style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image 
                  src={img.url} 
                  alt={`Gallery ${i+1}`} 
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  style={{ objectFit: 'cover', borderRadius: 'var(--radius-md)' }} 
                />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image 
              src={tour.images?.[0]?.url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5'} 
              alt="Secondary View" 
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: 'cover', borderRadius: 'var(--radius-md)' }} 
            />
          </div>
        )}
      </div>
    </>
  );
}
