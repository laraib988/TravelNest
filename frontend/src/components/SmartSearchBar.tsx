"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Compass, Clock, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface SmartSearchBarProps {
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  autoFocus?: boolean;
}

export default function SmartSearchBar({ 
  placeholder = "Search destinations or activities...", 
  className, 
  style, 
  inputStyle,
  autoFocus = false
}: SmartSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [results, setResults] = useState<{ destinations: any[], tours: any[] }>({ destinations: [], tours: [] });
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('vaitour_recent_searches_v1');
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch (e) {}

    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ destinations: [], tours: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const q = `%${query}%`;
        
        const [destRes, toursRes] = await Promise.all([
          supabase
            .from('destinations')
            .select('id, name, slug, country')
            .eq('is_published', true)
            .ilike('name', q)
            .limit(3),
          supabase
            .from('products')
            .select('id, basic_info, slug')
            .eq('status', 'PUBLISHED')
            .ilike('basic_info->>title', q)
            .limit(5)
        ]);

        setResults({
          destinations: destRes.data || [],
          tours: toursRes.data || []
        });
      } catch (error) {
        console.error("Search error", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    try { localStorage.setItem('vaitour_recent_searches_v1', JSON.stringify(updated)); } catch(e) {}
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    saveRecentSearch(query);
    setIsFocused(false);
    router.push(`/tours?search=${encodeURIComponent(query)}`);
  };

  const navigateTo = (url: string, term: string) => {
    saveRecentSearch(term);
    setIsFocused(false);
    router.push(url);
  };

  return (
    <div ref={wrapperRef} className={className} style={{ position: 'relative', width: '100%', ...style }}>
      <form 
        onSubmit={handleSearch} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: '#f1f5f9', 
          borderRadius: '100px', 
          padding: '8px 16px', 
          width: '100%', 
          border: isFocused ? '1px solid var(--brand-primary)' : '1px solid #e2e8f0',
          boxShadow: isFocused ? '0 0 0 3px rgba(37,99,235,0.1)' : 'inset 0 1px 3px rgba(0,0,0,0.02)',
          transition: 'all 0.2s'
        }}
      >
        <Search size={18} color="#64748b" style={{ flexShrink: 0, marginRight: '10px' }} />
        <input 
          autoFocus={autoFocus}
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder} 
          style={{ 
            flex: 1, 
            background: 'transparent', 
            border: 'none', 
            outline: 'none', 
            fontSize: '0.95rem', 
            color: '#0f172a',
            width: '100%',
            ...inputStyle
          }} 
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex' }}>
            <X size={16} color="#94a3b8" />
          </button>
        )}
      </form>

      {/* Autocomplete Dropdown */}
      {isFocused && (query.trim() || recentSearches.length > 0) && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          right: 0,
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
          border: '1px solid #e2e8f0',
          zIndex: 50,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {!query.trim() ? (
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Searches</span>
                {recentSearches.length > 0 && (
                  <button onClick={() => { setRecentSearches([]); localStorage.removeItem('vaitour_recent_searches_v1'); }} style={{ fontSize: '0.8rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
                )}
              </div>
              {recentSearches.length === 0 ? (
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0 }}>No recent searches</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {recentSearches.map((s, i) => (
                    <li key={i}>
                      <button 
                        onClick={() => { setQuery(s); handleSearch(); }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px', textAlign: 'left' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <Clock size={16} color="#94a3b8" />
                        <span style={{ fontSize: '0.95rem', color: '#334155' }}>{s}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div style={{ padding: '12px 0', maxHeight: '400px', overflowY: 'auto' }}>
              {isLoading ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>Searching...</div>
              ) : results.destinations.length === 0 && results.tours.length === 0 ? (
                <button 
                  onClick={() => handleSearch()}
                  style={{ width: '100%', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                >
                  <Search size={18} color="#2563eb" />
                  <span style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>Search for "{query}"</span>
                </button>
              ) : (
                <>
                  {results.destinations.length > 0 && (
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ padding: '4px 20px', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Destinations</div>
                      {results.destinations.map(d => (
                        <button 
                          key={d.id}
                          onClick={() => navigateTo(`/destinations/${d.slug}`, d.name)}
                          style={{ width: '100%', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                        >
                          <div style={{ background: '#f1f5f9', padding: '6px', borderRadius: '8px' }}>
                            <MapPin size={16} color="#3b82f6" />
                          </div>
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>{d.name}</span>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{d.country || 'Destination'}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {results.tours.length > 0 && (
                    <div>
                      <div style={{ padding: '8px 20px 4px', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderTop: results.destinations.length > 0 ? '1px solid #f1f5f9' : 'none' }}>Experiences</div>
                      {results.tours.map(t => {
                        let title = t.basic_info?.title;
                        if (typeof t.basic_info === 'string') {
                          try { title = JSON.parse(t.basic_info).title; } catch(e) {}
                        }
                        return (
                          <button 
                            key={t.id}
                            onClick={() => navigateTo(`/tours/${t.slug}`, title)}
                            style={{ width: '100%', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                          >
                            <div style={{ background: '#fff7ed', padding: '6px', borderRadius: '8px' }}>
                              <Compass size={16} color="#f97316" />
                            </div>
                            <span style={{ fontSize: '0.9rem', color: '#334155', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{title}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <button 
                    onClick={() => handleSearch()}
                    style={{ width: '100%', padding: '12px 20px', marginTop: '4px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', borderBottom: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer', textAlign: 'center', color: '#2563eb', fontSize: '0.9rem', fontWeight: 600 }}
                  >
                    See all results for "{query}"
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
