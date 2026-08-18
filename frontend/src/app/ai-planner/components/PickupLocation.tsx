'use client';

import React, { useState } from 'react';
import { useCityAutocomplete } from '@/lib/use-city-autocomplete';

export const PickupLocationSearch: React.FC = () => {
  const {
    inputValue,
    setInputValue,
    matches,
    loading,
    selectCity,
  } = useCityAutocomplete();

  const handleSelect = (city: string) => {
    selectCity(city);
    // Here you could trigger product filtering by city
    // e.g., setSelectedCity(city) and then filter the itinerary products
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', color: '#64748b' }}>
          Loading locations from catalog…
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '420px' }}>
      <div style={{ border: '2px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
        <div
          style={{
            background: '#f8fafc',
            padding: '10px 12px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '1.2rem', color: '#0284c7', marginRight: '8px' }}>
            📍
          </span>
          <span style={{ fontWeight: 600, color: '#334155' }}>Pickup City</span>
        </div>

        <div
          style={{
            padding: '0 12px',
          }}
        >
          <input
            type="text"
            placeholder="Start typing city name (e.g., Tokyo, Lahore, Paris)…"
            value={inputValue}
            onChange={setInputValue}
            style={{
              width: '100%',
              padding: '10px 14px',
              fontSize: '0.95rem',
              border: 'none',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {matches.length > 0 && (
          <div
            style={{
              maxHeight: '220px',
              overflowY: 'auto',
              borderTop: '1px solid #e2e8f0',
              background: 'white',
            }}
          >
            {matches.map((city) => (
              <div
                key={city}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  color: '#475569',
                  borderBottom: '1px solid #f1f1f1',
                  transition: 'background 0.15s',
                }}
                onClick={() => handleSelect(city)}
              >
                {city}
              </div>
            ))}
          </div>
        )}

        {!loading && matches.length === 0 && inputValue.length >= 2 && (
          <div
            style={{
              padding: '10px 12px',
              color: '#64748b',
              fontSize: '0.85rem',
              textAlign: 'center',
            }}
          >
            No matching cities found. Try a different name.
          </div>
        )}
      </div>
    </div>
  );
};