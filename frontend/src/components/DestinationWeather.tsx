'use client';

import { useState, useEffect, useCallback } from 'react';
import { CloudSun, Droplets, Wind, Clock, MapPin, RefreshCw, Thermometer } from 'lucide-react';

interface WeatherData {
  destination: { name: string; country: string; latitude: number; longitude: number };
  timezone: string;
  timezoneAbbreviation: string;
  current: {
    time: string | null;
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    weatherCode: number;
    condition: string;
    icon: string;
    isDay: boolean;
    units: Record<string, string>;
  };
  updatedAt: string;
}

interface DestinationWeatherProps {
  slug: string;
  name: string;
}

const REFRESH_MS = 5 * 60 * 1000; // refresh weather every 5 minutes
const CLOCK_MS = 1000; // tick the live clock every second

export default function DestinationWeather({ slug, name }: DestinationWeatherProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => new Date());

  const loadWeather = useCallback(async () => {
    try {
      const res = await fetch(`/api/public/destinations/${slug}/weather`, { cache: 'no-store' });
      const data = await res.json();
      if (data.current && data.current.temperature != null) {
        setWeather(data);
        setError(null);
      } else if (data.error) {
        setError(data.error);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to load weather');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadWeather();
    const interval = setInterval(loadWeather, REFRESH_MS);
    return () => clearInterval(interval);
  }, [loadWeather]);

  // Live local time in the destination's timezone, ticking every second.
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), CLOCK_MS);
    return () => clearInterval(t);
  }, []);

  const formatTime = (d: Date, timeZone?: string): string => {
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone,
    });
  };

  const formatDate = (d: Date, timeZone?: string): string => {
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone,
    });
  };

  const renderTime = () => {
    if (!weather?.timezone) {
      return <span>{formatTime(now)}</span>;
    }
    try {
      return (
        <span>{formatTime(now, weather.timezone)}</span>
      );
    } catch {
      return <span>{formatTime(now)}</span>;
    }
  };

  return (
    <section style={{ padding: '64px 0', borderTop: '1px solid #f1f5f9' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <CloudSun size={22} color="#0284c7" />
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Weather in {name}
          </h2>
        </div>
        <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '28px' }}>
          Live current conditions — updated automatically every 5 minutes.
        </p>

        {loading && !weather && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b' }}>
            <RefreshCw size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
            Fetching live weather...
          </div>
        )}

        {error && !weather && (
          <div style={{
            padding: '20px 24px', borderRadius: '14px', background: '#fffbeb',
            border: '1px solid #fde68a', color: '#92400e', fontSize: '0.95rem'
          }}>
            {error}
          </div>
        )}

        {weather && weather.current && (
          <div style={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
            borderRadius: '20px', padding: '24px', color: '#ffffff',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            display: 'flex', flexDirection: 'column', gap: '24px'
          }}>
            <div style={{ position: 'absolute', top: -20, right: -20, fontSize: '10rem', opacity: 0.1, transform: 'rotate(15deg)', pointerEvents: 'none' }}>
              {weather.current.icon}
            </div>

            {/* Top Row: Location & Date */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 600, opacity: 0.9 }}>
                <MapPin size={16} /> {weather.destination.name}, {weather.destination.country}
                <span style={{ marginLeft: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '999px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700 }}>
                  {weather.timezoneAbbreviation || weather.timezone}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', opacity: 0.8 }}>
                 <RefreshCw size={12} /> Live Updates
              </div>
            </div>

            {/* Middle Row: Temperature & Clock */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', zIndex: 1 }}>
              
              {/* Temperature Side */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em' }}>
                  {Math.round(weather.current.temperature)}°
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '2px' }}>
                    {weather.current.icon} {weather.current.condition}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                    Feels like {Math.round(weather.current.feelsLike)}°
                  </div>
                </div>
              </div>

              {/* Clock Side */}
              <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px 20px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', opacity: 0.9 }}>
                  <Clock size={14} /> <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Local Time in {weather.destination.name}</span>
                </div>
                <div style={{ fontSize: 'clamp(1.75rem, 6vw, 2.4rem)', fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', lineHeight: 1, whiteSpace: 'nowrap' }}>
                  {renderTime()}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '6px' }}>
                  {formatDate(now, weather.timezone)}
                </div>
              </div>
            </div>

            {/* Bottom Row: Details */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '16px', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                <Droplets size={14} opacity={0.9} /> Humidity: {weather.current.humidity}%
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                <Wind size={14} opacity={0.9} /> Wind: {weather.current.windSpeed} {weather.current.units?.wind_speed_10m || 'km/h'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                <Thermometer size={14} opacity={0.9} /> {weather.current.isDay ? 'Daytime' : 'Night'}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}