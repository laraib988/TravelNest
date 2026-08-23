import { useState, useEffect } from 'react';
'use client';

import { Star, Clock, MapPin, ShieldCheck } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import Image from 'next/image';


function WeatherWidget({ location }: { location: string }) {
  const [weather, setWeather] = useState<{ temp: number; icon: string; condition: string } | null>(null);

  useEffect(() => {
    if (!location) return;
    const locName = location.replace(/^dest-/i, '');
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locName)}&count=1&language=en&format=json`)
      .then(res => res.json())
      .then(geo => {
        if (geo.results?.[0]) {
          const { latitude, longitude } = geo.results[0];
          return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`);
        }
      })
      .then(res => res?.json())
      .then(data => {
        if (data?.current) {
           const code = data.current.weather_code;
           let icon = '☀️'; let cond = 'Clear';
           if (code >= 1 && code <= 3) { icon = '⛅'; cond = 'Partly Cloudy'; }
           if (code >= 45 && code <= 48) { icon = '🌫️'; cond = 'Fog'; }
           if (code >= 51 && code <= 67) { icon = '🌧️'; cond = 'Rain'; }
           if (code >= 71 && code <= 77) { icon = '❄️'; cond = 'Snow'; }
           if (code >= 95) { icon = '⛈️'; cond = 'Thunderstorm'; }
           setWeather({ temp: Math.round(data.current.temperature_2m), icon, condition: cond });
        }
      }).catch(() => {});
  }, [location]);

  if (!weather) return null;
  return <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>{weather.icon} {weather.temp}°C {weather.condition}</span>;
}

export default function TourGallery({ tour }: { tour: any }) {
  const { t } = useCurrency();

  const cloudinaryLoader = ({ src, width, quality }: any) => {
    if (src.startsWith('http')) {
      if (src.includes('cloudinary.com')) {
        return src.replace('/upload/', `/upload/f_auto,q_${quality || 'auto'},w_${width}/`);
      }
      return src;
    }
    return `https://res.cloudinary.com/vaitour/image/upload/f_auto,q_${quality || 'auto'},w_${width}/${src}`;
  };

  if (!tour) return null;

  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          <span className="badge-emerald">{tour.category_name}</span>
          <span className="badge-amber">⚡ {tour.confirmation_type || 'Instant Confirmation'}</span>
          {tour.payment_option?.toLowerCase().includes('later') || tour.payment_option?.toLowerCase().includes('after') ? <span className="badge-sky" style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>💸 Pay After Tour</span> : null}
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
          <WeatherWidget location={tour.pickup_location || tour.meeting_point?.address || tour.destination_id} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '450px', marginBottom: '40px' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Image 
            loader={cloudinaryLoader}
            src={tour.images?.[0]?.url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5'} 
            alt={`${tour.title} – ${tour.pickup_location || 'Global'} | Top Rated Tour`} 
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
                  loader={cloudinaryLoader}
                  src={img.url} 
                  alt={`${tour.title} Gallery Image ${i+1} – ${tour.pickup_location || 'Global'} | Vaitour`} 
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
              loader={cloudinaryLoader}
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
