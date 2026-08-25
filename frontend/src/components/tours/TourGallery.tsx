'use client';
import { useState, useEffect } from 'react';

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

  if (!weather) return <span style={{ display: 'inline-flex', alignItems: 'center', width: '110px', height: '20px', background: '#e2e8f0', borderRadius: '4px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></span>;
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
    <div className="tour-gallery-container">
      <div className="tour-badges-row" style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', marginBottom: '12px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none', whiteSpace: 'nowrap' }}>
        <span className="badge-emerald" style={{ flexShrink: 0 }}>{tour.category_name}</span>
        <span className="badge-amber" style={{ flexShrink: 0 }}>⚡ {tour.confirmation_type || 'Instant Confirmation'}</span>
        {tour.payment_option?.toLowerCase().includes('later') || tour.payment_option?.toLowerCase().includes('after') ? <span className="badge-sky" style={{ flexShrink: 0, background: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>💸 Pay After Tour</span> : null}
        {tour.merchandising_badges?.filter((b: string) => b.toLowerCase() !== 'new').map((badge: string, i: number) => (
          <span key={i} className="badge-rose" style={{ flexShrink: 0 }}>{badge}</span>
        ))}
      </div>

      <div className="tour-title-section" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
          <h1 className="tour-main-title" style={{ fontSize: '2.5rem', marginBottom: '12px', color: '#0f172a', flex: 1 }}>{tour.title}</h1>
        </div>
        <div className="tour-meta-row" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Star size={16} color="#d97706" fill="#d97706" /> <strong style={{ color: '#0f172a' }}>{tour.cached_rating_avg}</strong> ({tour.cached_review_count} reviews)</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}><Clock size={16} /> {tour.duration_text || `${tour.duration_minutes / 60} Hours`}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={16} color="#059669" /> Verified Supplier</span>
          <WeatherWidget location={tour.pickup_location || tour.meeting_point?.address || tour.destination_id} />
        </div>
      </div>

      <div className="tour-image-slider" style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollSnapType: 'x mandatory', borderRadius: 'var(--radius-lg)', height: '400px', marginBottom: '40px', scrollbarWidth: 'none' }}>
        {tour.images?.map((img: any, i: number) => (
          <div key={i} style={{ position: 'relative', minWidth: '100%', height: '100%', scrollSnapAlign: 'center' }}>
            <Image 
              loader={cloudinaryLoader}
              src={img.url} 
              alt={`${tour.title} Gallery Image ${i+1}`} 
              fill
              priority={i === 0}
              sizes="100vw"
              style={{ objectFit: 'cover' }} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
