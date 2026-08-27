'use client';
import { useState, useEffect, useRef } from 'react';

import { Star, Clock, MapPin, ShieldCheck, MessageSquare, Car, Users, CheckCircle } from 'lucide-react';
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
  const [activeSlide, setActiveSlide] = useState(0);

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
      <div className="tour-title-section" style={{ marginBottom: '24px' }}>
        <h1 className="tour-main-title" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', color: '#0f172a', lineHeight: 1.25 }}>{tour.title}</h1>
        
        <div className="tour-badges-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          <span className="badge-emerald" style={{ padding: '2px 6px', fontSize: '0.7rem' }}>{tour.category_name}</span>
          <span className="badge-amber" style={{ padding: '2px 6px', fontSize: '0.7rem' }}>⚡ {tour.confirmation_type || 'Instant Confirmation'}</span>
          {tour.payment_option?.toLowerCase().includes('later') || tour.payment_option?.toLowerCase().includes('after') ? <span className="badge-sky" style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>💸 Pay After Tour</span> : null}
          {tour.merchandising_badges?.filter((b: string) => b.toLowerCase() !== 'new').map((badge: string, i: number) => (
            <span key={i} className="badge-rose" style={{ padding: '2px 6px', fontSize: '0.7rem' }}>{badge}</span>
          ))}
        </div>

        <div className="tour-meta-wrapper">
          <div className="tour-meta-row" style={{ color: '#0f172a', fontSize: '0.95rem', fontWeight: 500 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#64748b' }}>
              <span style={{ color: '#6366f1', fontWeight: 700 }}>{tour.cached_rating_avg}/5</span>
              <span style={{ textDecoration: 'underline' }}>{tour.cached_review_count} reviews</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="#64748b" /> 
              <span>Depart from {tour.pickup_location || tour.destination?.name || (tour.meeting_point?.address ? tour.meeting_point.address.split(',')[0] : 'Designated Location')}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#64748b" /> 
              <span>{tour.duration_text || `${tour.duration_minutes / 60} Hours`}</span>
            </div>
            
            {tour.languages && tour.languages.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} color="#64748b" /> 
                <span>Guide: {tour.languages.length > 1 ? `${tour.languages[0]} +${tour.languages.length - 1}` : tour.languages[0]}</span>
              </div>
            )}

            {(tour.meeting_point_type === 'pickup' || tour.inclusions?.some((i: string) => i.toLowerCase().includes('pickup'))) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Car size={18} color="#64748b" /> 
                <span>Hotel pick-up</span>
              </div>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="#64748b" /> 
              <span>{tour.tour_type || (tour.max_group_size ? `Small group (Max ${tour.max_group_size})` : 'Group tour')}</span>
            </div>
          </div>

          <div className="tour-cancellation-box mobile-only">
            <div className="cancel-inner" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <CheckCircle size={18} color="#0f172a" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>Free cancellation</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4 }}>
                  Full refund with 24h notice.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tour-gallery-mobile" style={{ position: 'relative', marginBottom: '40px' }}>
        <div onScroll={(e: any) => setActiveSlide(Math.round(e.target.scrollLeft / e.target.clientWidth))} className="tour-image-slider" style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollSnapType: 'x mandatory', borderRadius: 'var(--radius-lg)', height: '400px', scrollbarWidth: 'none' }}>
          {tour.images?.map((img: any, i: number) => (
            <div key={i} style={{ position: 'relative', minWidth: '100%', height: '100%', scrollSnapAlign: 'center' }}>
              <img 
                src={cloudinaryLoader({ src: img.url, width: 800, quality: 75 })} 
                alt={`${tour.title} Gallery Image ${i+1}`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
          ))}
        </div>
        {tour.images?.length > 1 && (
          <div style={{ position: 'absolute', bottom: '20px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px', zIndex: 10 }}>
            {tour.images.map((_: any, i: number) => (
              <div 
                key={i} 
                style={{ 
                  width: activeSlide === i ? '24px' : '6px', 
                  height: '6px', 
                  borderRadius: '3px', 
                  background: activeSlide === i ? '#ffffff' : 'rgba(255,255,255,0.5)', 
                  transition: 'all 0.3s' 
                }} 
              />
            ))}
          </div>
        )}
      </div>

      {tour.images && tour.images.length > 0 && (
        <div className="tour-gallery-desktop">
          <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 0 }}>
            <img 
              src={cloudinaryLoader({ src: tour.images[0].url, width: 1200, quality: 75 })} 
              alt={tour.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} 
            />
          </div>
          {tour.images.length > 1 && (() => {
            const remainingImages = tour.images.slice(1, 5);
              return (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: remainingImages.length <= 2 ? 'minmax(0, 1fr)' : 'repeat(2, minmax(0, 1fr))', 
                  gridTemplateRows: remainingImages.length === 1 ? 'minmax(0, 1fr)' : 'repeat(2, minmax(0, 1fr))', 
                  gap: '12px', 
                  height: '100%' 
                }}>
                  {remainingImages.map((img: any, i: number) => (
                    <div 
                      key={i} 
                      style={{ 
                        position: 'relative', 
                        width: '100%', 
                        height: '100%',
                        minHeight: 0,
                        gridColumn: remainingImages.length === 3 && i === 2 ? 'span 2' : 'auto'
                      }}>
                      <img 
                        src={cloudinaryLoader({ src: img.url, width: 600, quality: 75 })} 
                        alt={`${tour.title} ${i+2}`} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} 
                      />
                    </div>
                  ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
