import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const dynamic = 'force-dynamic';

const WEATHER_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: 'Clear sky', icon: '☀️' },
  1: { label: 'Mainly clear', icon: '🌤️' },
  2: { label: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Fog', icon: '🌫️' },
  48: { label: 'Depositing rime fog', icon: '🌫️' },
  51: { label: 'Light drizzle', icon: '🌦️' },
  53: { label: 'Moderate drizzle', icon: '🌦️' },
  55: { label: 'Dense drizzle', icon: '🌧️' },
  56: { label: 'Freezing drizzle', icon: '🌧️' },
  57: { label: 'Freezing drizzle', icon: '🌧️' },
  61: { label: 'Slight rain', icon: '🌦️' },
  63: { label: 'Moderate rain', icon: '🌧️' },
  65: { label: 'Heavy rain', icon: '🌧️' },
  66: { label: 'Freezing rain', icon: '🌧️' },
  67: { label: 'Freezing rain', icon: '🌧️' },
  71: { label: 'Slight snow', icon: '🌨️' },
  73: { label: 'Moderate snow', icon: '🌨️' },
  75: { label: 'Heavy snow', icon: '❄️' },
  77: { label: 'Snow grains', icon: '❄️' },
  80: { label: 'Slight rain showers', icon: '🌦️' },
  81: { label: 'Moderate rain showers', icon: '🌧️' },
  82: { label: 'Violent rain showers', icon: '⛈️' },
  85: { label: 'Slight snow showers', icon: '🌨️' },
  86: { label: 'Heavy snow showers', icon: '❄️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Thunderstorm with hail', icon: '⛈️' },
  99: { label: 'Thunderstorm with hail', icon: '⛈️' },
};

function resolveWeatherCode(code: number) {
  return WEATHER_CODES[code] || { label: 'Unknown', icon: '🌡️' };
}

async function fetchWithTimeout(url: string, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    if (!res.ok) throw new Error(`Weather upstream error ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

// Geocode a destination name to coordinates via Open-Meteo's free geocoding API.
async function geocode(name: string): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const data = await fetchWithTimeout(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`
    );
    if (data.results && data.results.length > 0) {
      return {
        latitude: data.results[0].latitude,
        longitude: data.results[0].longitude,
      };
    }
  } catch (e) {
    console.error('[weather] geocode failed:', e);
  }
  return null;
}

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;

    // Resolve destination + geo coordinates.
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: destination, error } = await supabase
      .from('destinations')
      .select('name, country, faqs')
      .ilike('slug', slug)
      .maybeSingle();

    if (error || !destination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    // Extract hidden meta_data from faqs (the table stores it as a hidden FAQ).
    let geo = null;
    if (destination.faqs && Array.isArray(destination.faqs)) {
      const metaFaq = destination.faqs.find((f: any) => f.question === '__META_DATA__');
      if (metaFaq) {
        try {
          geo = JSON.parse(metaFaq.answer)?.geo;
        } catch (e) {}
      }
    }

    // Fallback: geocode by destination name + country.
    let coords = geo && geo.latitude != null && geo.longitude != null
      ? { latitude: geo.latitude, longitude: geo.longitude }
      : null;
    if (!coords) {
      const searchName = destination.country ? `${destination.name}, ${destination.country}` : destination.name;
      coords = await geocode(searchName);
    }

    if (!coords) {
      return NextResponse.json(
        { error: 'Could not determine coordinates for this destination' },
        { status: 200 }
      );
    }

    // Fetch current weather from Open-Meteo.
    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day` +
      `&timezone=auto`;

    const weather = await fetchWithTimeout(weatherUrl);
    const current = weather.current || {};
    const code = Number(current.weather_code ?? 0);
    const condition = resolveWeatherCode(code);

    return NextResponse.json({
      destination: {
        name: destination.name,
        country: destination.country,
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
      timezone: weather.timezone || 'UTC',
      timezoneAbbreviation: weather.timezone_abbreviation || '',
      current: {
        time: current.time || null,
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        weatherCode: code,
        condition: condition.label,
        icon: condition.icon,
        isDay: current.is_day === 1,
        units: weather.current_units || {},
      },
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error fetching destination weather:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch weather' },
      { status: 200 }
    );
  }
}