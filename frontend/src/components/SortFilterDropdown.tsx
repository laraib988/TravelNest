'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUpDown } from 'lucide-react';

export type SortOption =
  | 'MOST_CLICKED'
  | 'PRICE_HIGH'
  | 'PRICE_LOW'
  | 'DATE_NEW'
  | 'DATE_OLD';

interface Props {
  currentSort: SortOption;
  onSortChange: (option: SortOption) => void;
}

export default function SortFilterDropdown({ currentSort, onSortChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: { id: SortOption; label: string }[] = [
    { id: 'MOST_CLICKED', label: 'Most Clicked (Realtime)' },
    { id: 'PRICE_HIGH', label: 'Price ( High to Low )' },
    { id: 'PRICE_LOW', label: 'Price ( Low to High )' },
    { id: 'DATE_NEW', label: 'Date Updated ( new )' },
    { id: 'DATE_OLD', label: 'Date Updated ( old )' },
  ];

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      
      {/* SORT ICON BUTTON MATCHING SCREENSHOT */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          border: 'none',
          background: 'var(--brand-primary)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
        }}
        aria-label="Sort options"
      >
        <ArrowUpDown size={18} />
      </button>

      {/* FLOATING RADIO DROPDOWN MATCHING SCREENSHOT */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '230px',
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.16)',
            border: '1px solid #f1f5f9',
            padding: '10px 0',
            zIndex: 9999,
          }}
        >
          {options.map((opt) => {
            const isSelected = currentSort === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  onSortChange(opt.id);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '10px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? '#0f172a' : '#475569',
                  textAlign: 'left',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                <span>{opt.label}</span>
                <span
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    border: isSelected ? '4px solid #2563eb' : '1.5px solid #cbd5e1',
                    background: '#ffffff',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
}
