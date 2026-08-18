'use client';

import React, { useRef, useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/lib/supabase';

interface ServiceAreaMapProps {
  productId: string;
  initialCenter?: [number, number];
  initialRadiusKm?: number;
  onSave?: (mapData: { lat: number; lng: number }, pickupLocations?: any[], searchedName?: string) => void;
}

export const ServiceAreaMap: React.FC<ServiceAreaMapProps> = ({
  productId,
  initialCenter = [31.5, 74.3],
  initialRadiusKm = 50,
  onSave,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  const [center, setCenter] = useState<[number, number]>(initialCenter);
  const [radiusKm, setRadiusKm] = useState<number>(initialRadiusKm);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  // Initialize Leaflet map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainer.current) return;

    (async () => {
      const L = (await import('leaflet')).default;
      
      // Fix Leaflet's default icon path issues
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!mapRef.current) {
        // Create map
        mapRef.current = L.map(mapContainer.current).setView(initialCenter, 8);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(mapRef.current);

        // Add Draggable Marker
        markerRef.current = L.marker(initialCenter, { draggable: true }).addTo(mapRef.current);
        
        // Add Circle
        circleRef.current = L.circle(initialCenter, {
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.2,
          radius: initialRadiusKm * 1000,
        }).addTo(mapRef.current);

        // Listen for marker drag
        markerRef.current.on('dragend', (e: any) => {
          const marker = e.target;
          const position = marker.getLatLng();
          setCenter([position.lat, position.lng]);
          circleRef.current?.setLatLng(position);
        });
        
        setTimeout(() => {
          mapRef.current?.invalidateSize();
        }, 200);
      }
    })();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update circle radius when changed from input
  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.setRadius(radiusKm * 1000);
    }
  }, [radiusKm]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const token = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN;
      if (!token) return;
      const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${token}`);
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        setCenter([lat, lng]);
        
        if (mapRef.current) {
          mapRef.current.setView([lat, lng], 10);
        }
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        }
        if (circleRef.current) {
          circleRef.current.setLatLng([lat, lng]);
        }
      } else {
        alert('Location not found');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const saveServiceArea = async () => {
    setLoading(true);
    setSaved(false);

    try {
      // Fetch POIs (places/hotels) using Mapbox Geocoding API
      // We look for 'poi' (points of interest) near the center
      const token = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN;
      let pickupLocations: any[] = [];
      
      if (token && !token.includes('blank')) {
        // center[1] is lng, center[0] is lat
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/hotel.json?proximity=${center[1]},${center[0]}&types=poi&limit=10&access_token=${token}`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.features && data.features.length > 0) {
          pickupLocations = data.features.map((f: any) => ({
            name: f.text,
            address: f.place_name,
            lat: f.center[1], // lat
            lng: f.center[0], // lng
            place_id: f.id,
          }));
        }
      }

      // Save to Supabase
      await supabase
        .from('products')
        .update({
          logistics: {
            service_area_type: 'custom',
            center: [center[0], center[1]],
            radius_km: radiusKm,
            pickup_locations: pickupLocations,
            updated_at: new Date().toISOString(),
          },
        })
        .eq('id', productId);
        
      setSaved(true);
      setLoading(false);
      onSave?.({ lat: center[0], lng: center[1] }, pickupLocations, searchQuery);
      setTimeout(() => setSaved(false), 3000);
      
    } catch (err) {
      console.error('Save error:', err);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: '700px',
        width: '100%',
        borderRadius: 8,
        overflow: 'hidden',
        border: '2px solid #e2e8f0',
        position: 'relative',
        zIndex: 1 // Important for Leaflet
      }}
    >
      {/* Search Bar at the Top */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        background: 'white',
        padding: '8px 12px',
        borderRadius: 8,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        gap: '8px',
        width: '80%',
        maxWidth: '400px'
      }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%', gap: '8px' }}>
          <input
            type="text"
            placeholder="Search city, region or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              outline: 'none',
              fontSize: '0.9rem'
            }}
          />
          <button
            type="submit"
            disabled={searching}
            style={{
              padding: '8px 16px',
              background: '#0f172a',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: searching ? 'not-allowed' : 'pointer',
              fontWeight: 500
            }}
          >
            {searching ? '...' : 'Search'}
          </button>
        </form>
      </div>

      <div ref={mapContainer} style={{ width: '100%', height: '100%', zIndex: 1 }} />

      <div
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          background: 'white',
          padding: '12px 16px',
          borderRadius: 8,
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ marginBottom: '10px', fontSize: '14px' }}>
          <strong>Center (lat,lng):</strong> {center[0].toFixed(4)}, {center[1].toFixed(4)}
        </div>
        <div style={{ fontSize: '14px' }}>
          <strong>Radius (km):</strong>
          <input
            type="number"
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            style={{ width: '60px', marginLeft: '8px', border: '1px solid #d1d5db', borderRadius: 4, padding: '4px' }}
          />
        </div>
        <button
          onClick={saveServiceArea}
          disabled={loading}
          style={{
            width: '100%',
            marginTop: '10px',
            padding: '10px',
            background: loading ? '#9ca3af' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: '0.88rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Saving & Fetching...' : 'Save Service Area'}
        </button>
      </div>
      {saved && (
        <div
          style={{
            position: 'absolute',
            bottom: 150,
            right: 20,
            padding: '12px 20px',
            background: '#4CAF50',
            color: 'white',
            borderRadius: 6,
            fontSize: '0.9rem',
            zIndex: 1000,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          ✅ Area & Places Saved!
        </div>
      )}
    </div>
  );
};