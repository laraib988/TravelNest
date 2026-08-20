import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const dynamic = 'force-dynamic';

const WEATHER_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: 'Clear', icon: '☀️' },
  1: { label: 'Mainly clear', icon: '🌤️' },
  2: { label: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Fog', icon: '🌫️' },
  48: { label: 'Fog', icon: '🌫️' },
  51: { label: 'Light drizzle', icon: '🌦️' },
  53: { label: 'Drizzle', icon: '🌦️' },
  55: { label: 'Dense drizzle', icon: '🌧️' },
  61: { label: 'Slight rain', icon: '🌦️' },
  63: { label: 'Rain', icon: '🌧️' },
  65: { label: 'Heavy rain', icon: '🌧️' },
  71: { label: 'Slight snow', icon: '🌨️' },
  73: { label: 'Snow', icon: '🌨️' },
  75: { label: 'Heavy snow', icon: '❄️' },
  80: { label: 'Rain showers', icon: '🌦️' },
  81: { label: 'Moderate showers', icon: '🌧️' },
  82: { label: 'Violent showers', icon: '⛈️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Thunderstorm', icon: '⛈️' },
  99: { label: 'Thunderstorm', icon: '⛈️' },
};

function resolveWeatherCode(code: number) {
  return WEATHER_CODES[code] || { label: 'N/A', icon: '🌡️' };
}

async function fetchWithTimeout(url: string, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    if (!res.ok) throw new Error(`${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function geocode(name: string): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const data = await fetchWithTimeout(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`
    );
    if (data.results?.length > 0) {
      return { latitude: data.results[0].latitude, longitude: data.results[0].longitude };
    }
  } catch {}
  return null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slugs = searchParams.get('slugs')?.split(',').filter(Boolean) || [];

    if (slugs.length === 0) {
      return NextResponse.json({ destinations: {} });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: destinations } = await supabase
      .from('destinations')
      .select('slug, name, country, faqs')
      .in('slug', slugs);

    if (!destinations || destinations.length === 0) {
      return NextResponse.json({ destinations: {} });
    }

    const results: Record<string, any> = {};

    const fetches = destinations.map(async (dest) => {
      let geo = null;
      if (dest.faqs && Array.isArray(dest.faqs)) {
        const metaFaq = dest.faqs.find((f: any) => f.question === '__META_DATA__');
        if (metaFaq) {
          try { geo = JSON.parse(metaFaq.answer)?.geo; } catch {}
        }
      }

      let coords = geo?.latitude != null && geo?.longitude != null
        ? { latitude: geo.latitude, longitude: geo.longitude }
        : null;
      if (!coords) {
        coords = await geocode(dest.country ? `${dest.name}, ${dest.country}` : dest.name);
      }
      if (!coords) return;

      try {
        const weather = await fetchWithTimeout(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}` +
          `&current=temperature_2m,weather_code,is_day&timezone=auto`
        );
        const cur = weather.current || {};
        const code = Number(cur.weather_code ?? 0);
        const cond = resolveWeatherCode(code);

        results[dest.slug] = {
          temp: Math.round(cur.temperature_2m),
          icon: cond.icon,
          condition: cond.label,
          isDay: cur.is_day === 1,
          timezone: weather.timezone || 'UTC',
          timezoneAbbreviation: weather.timezone_abbreviation || '',
          time: cur.time || null,
        };
      } catch {}
    });

    await Promise.all(fetches);

    return NextResponse.json({ destinations: results });
  } catch (error: any) {
    return NextResponse.json({ destinations: {} });
  }
}
