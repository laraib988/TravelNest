import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useCityAutocomplete = () => {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const citySet = new Set<string>();
        
        // 1. Fetch cities from destinations table
        const { data: destData } = await supabase.from('destinations').select('name').eq('is_published', true);
        if (destData) destData.forEach(d => d.name && citySet.add(d.name));

        // 2. Fetch cities from published products
        const { data: prodData } = await supabase.from('products').select('basic_info, title').eq('status', 'PUBLISHED');
        if (prodData) {
          prodData.forEach((prod: any) => {
            const basic = prod.basic_info || {};
            if (basic.shortDescription) {
              const matches1 = basic.shortDescription.match(/froms+([A-Za-zÀ-ɏs]+?)(?:s+by|s+with|s+$)/i);
              const matches2 = basic.shortDescription.match(/ins+([A-Za-zÀ-ɏs]+?)(?:s+tour|s+package|s+$)/i);
              if (matches1?.[1]) citySet.add(matches1[1].trim());
              if (matches2?.[1]) citySet.add(matches2[1].trim());
            }
            if (basic.city) citySet.add(basic.city);
          });
        }
        
        setCities(Array.from(citySet).sort().filter((c) => c.length > 1));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cities:', err);
        setLoading(false);
      }
    };
    loadCities();
  }, [supabase]);

  // Client-side search state
  const [inputValue, setInputValue] = useState<string>('');
  const [matches, setMatches] = useState<string[]>([]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setInputValue(value);

    if (value.length < 2) {
      setMatches([]);
      return;
    }

    const lower = value.toLowerCase();
    const filtered = cities
      .filter((city) => city.toLowerCase().includes(lower))
      .slice(0, 8) // Limit for performance
      .sort();

    setMatches(filtered);
  };

  const selectCity = (city: string) => {
    setInputValue(city);
    // Could trigger a filter on products here
    console.log('City selected:', city);
  };

  return {
    inputValue,
    setInputValue: handleInput,
    matches,
    loading,
    selectCity,
  };
};