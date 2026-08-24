'use client';
import { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface MapboxAutocompleteProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  proximityStr?: string;
}

export default function MapboxAutocomplete({ value, onChange, placeholder, disabled, required, proximityStr }: MapboxAutocompleteProps) {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (value !== query && !showDropdown) {
      setQuery(value);
    }
  }, [value, showDropdown]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query || query.length < 2 || !showDropdown) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const token = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN;
        let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?types=poi,address&access_token=${token}`;
        
        if (proximityStr) {
           try {
               const geoRes = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(proximityStr)}.json?types=place,region&access_token=${token}`);
               const geoData = await geoRes.json();
               if (geoData.features?.[0]) {
                   const [lng, lat] = geoData.features[0].center;
                   url += `&proximity=${lng},${lat}`;
               }
           } catch(e) {}
        }
        
        const res = await fetch(url);
        const data = await res.json();
        setResults(data.features || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, showDropdown, proximityStr]);

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => {
           if (query.length >= 2) setShowDropdown(true);
        }}
        style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: disabled ? '#f1f5f9' : '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', outline: 'none' }}
      />
      
      {showDropdown && (results.length > 0 || loading) && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #cbd5e1', borderRadius: 'var(--radius-sm)', marginTop: '4px', zIndex: 100, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          {loading && results.length === 0 ? (
            <div style={{ padding: '10px 12px', color: '#64748b', fontSize: '0.85rem' }}>Searching...</div>
          ) : (
            results.map((f: any) => (
              <div 
                key={f.id} 
                onClick={() => {
                  setQuery(f.place_name);
                  onChange(f.place_name);
                  setShowDropdown(false);
                }}
                style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'flex-start', gap: '8px' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
              >
                <MapPin size={16} color="#64748b" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 500 }}>{f.text}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{f.place_name}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
