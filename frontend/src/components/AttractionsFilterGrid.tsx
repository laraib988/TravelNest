"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';

interface ExtraSection {
  title: string;
  image?: string;
  content: string;
}

export default function AttractionsFilterGrid({ items }: { items: ExtraSection[] }) {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  // Extract metadata dynamically from content HTML
  const parsedItems = useMemo(() => {
    return items.map((sec) => {
      let city = 'Other';
      let season = 'Any';
      let priceStr = 'Free';
      let priceVal = 0;

      // Extract location
      const locMatch = sec.content.match(/<strong>Location:<\/strong>\s*(.*?)(<\/p>|<br\/>)/);
      if (locMatch) {
        const loc = locMatch[1].toLowerCase();
        if (loc.includes('tokyo')) city = 'Tokyo';
        else if (loc.includes('osaka')) city = 'Osaka';
        else if (loc.includes('kyoto')) city = 'Kyoto';
        else if (loc.includes('nagoya') || loc.includes('aichi')) city = 'Nagoya';
        else if (loc.includes('hiroshima')) city = 'Hiroshima';
      }

      // Extract season
      const timeMatch = sec.content.match(/<strong>Best Time to Visit:<\/strong>\s*(.*?)(<\/p>|<br\/>)/);
      if (timeMatch) {
        const time = timeMatch[1].toLowerCase();
        if (time.includes('spring')) season = 'Spring';
        else if (time.includes('autumn') || time.includes('fall')) season = 'Autumn';
        else if (time.includes('winter')) season = 'Winter';
        else if (time.includes('summer')) season = 'Summer';
        else season = 'Year-round';
      }

      // Extract price
      const priceMatch = sec.content.match(/<strong>Entrance Fee:<\/strong>\s*(.*?)(<\/p>|<br\/>)/);
      if (priceMatch) {
        priceStr = priceMatch[1];
        const nums = priceStr.match(/\d+(?:,\d+)?/g);
        if (nums && nums.length > 0) {
          priceVal = parseInt(nums[nums.length - 1].replace(/,/g, ''), 10);
        } else if (priceStr.toLowerCase().includes('free')) {
          priceVal = 0;
        } else {
          priceVal = 99999; // unknown
        }
      }

      const isCard = sec.title.match(/^\d+\./) || sec.title.includes('Passes');

      return {
        ...sec,
        city,
        season,
        priceStr,
        priceVal,
        isCard
      };
    });
  }, [items]);

  const introSection = parsedItems.find(item => !item.isCard);
  const cardItems = parsedItems.filter(item => item.isCard);

  const filteredCards = cardItems.filter(item => {
    if (search && !item.title.toLowerCase().includes(search.toLowerCase()) && !item.content.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedCity && item.city !== selectedCity) return false;
    if (selectedSeason && item.season !== selectedSeason) return false;
    
    if (priceFilter === 'free') return item.priceVal === 0;
    if (priceFilter === 'under_3000') return item.priceVal > 0 && item.priceVal <= 3000;
    if (priceFilter === '3000_6000') return item.priceVal > 3000 && item.priceVal <= 6000;
    if (priceFilter === 'over_6000') return item.priceVal > 6000 && item.priceVal !== 99999;
    
    return true;
  });

  return (
    <section style={{ padding: '40px 20px', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '30px', alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap' }}>
        
        {/* LEFT SIDEBAR (STICKY FILTER) */}
        <div style={{
          flex: '0 0 300px',
          background: '#fff',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          position: 'sticky',
          top: '20px'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Filter Attractions</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>Search</label>
            <input 
              type="text" 
              placeholder="Search by name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>City / Region</label>
            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', background: '#fff' }}>
              <option value="">All Cities</option>
              <option value="Tokyo">Tokyo</option>
              <option value="Osaka">Osaka</option>
              <option value="Kyoto">Kyoto</option>
              <option value="Nagoya">Nagoya</option>
              <option value="Hiroshima">Hiroshima</option>
              <option value="Other">Other Regions</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>Best Season</label>
            <select value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', background: '#fff' }}>
              <option value="">Any Season</option>
              <option value="Spring">Spring</option>
              <option value="Autumn">Autumn (Fall)</option>
              <option value="Winter">Winter</option>
              <option value="Summer">Summer</option>
              <option value="Year-round">Year-round</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>Price Range</label>
            <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', background: '#fff' }}>
              <option value="">Any Price</option>
              <option value="free">Free Entry</option>
              <option value="under_3000">Under ¥3,000</option>
              <option value="3000_6000">¥3,000 - ¥6,000</option>
              <option value="over_6000">Over ¥6,000</option>
            </select>
          </div>
          
          <button 
            onClick={() => { setSearch(''); setSelectedCity(''); setSelectedSeason(''); setPriceFilter(''); }}
            style={{ width: '100%', padding: '10px', background: '#f1f5f9', color: '#475569', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            Clear Filters
          </button>
        </div>

        {/* RIGHT CONTENT GRID */}
        <div style={{ flex: '1 1 700px' }}>
          {introSection && (
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '40px',
              marginBottom: '30px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
              textAlign: 'center'
            }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px', letterSpacing: '-0.02em' }}>
                {introSection.title}
              </h2>
              <div 
                className="prose max-w-none"
                style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#475569' }} 
                dangerouslySetInnerHTML={{ __html: introSection.content }} 
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
            {filteredCards.length > 0 ? filteredCards.map((sec, idx) => (
              <div key={idx} style={{
                background: '#ffffff',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease',
              }}>
                <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                  <Image 
                    src={sec.image || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800'} 
                    alt={sec.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  {sec.priceVal === 0 && (
                     <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#10b981', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                        Free Entry
                     </div>
                  )}
                </div>
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', lineHeight: 1.3 }}>
                    {sec.title}
                  </h2>
                  <div 
                    className="prose max-w-none"
                    style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#475569' }} 
                    dangerouslySetInnerHTML={{ __html: sec.content }} 
                  />
                </div>
              </div>
            )) : (
              <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '1.1rem' }}>
                No attractions found matching your filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
