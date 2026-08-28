'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, CheckCircle2, XCircle, ArrowLeft, Image as ImageIcon } from 'lucide-react';

export default function ContentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [form, setForm] = useState({
    title: '',
    hero_section: {
      heading: '',
      subheading: '',
      background_image: '',
      show_search_bar: true,
    },
    destinations_section: {
      title: 'Top Destinations',
      subtitle: '',
      show: true
    },
    tours_section: {
      title: 'Featured Tours & Experiences',
      subtitle: '',
      items_per_row: 4,
      show: true
    },
    extra_sections: [
      { id: '1', title: 'Why Choose Us?', content: '' },
      { id: '2', title: 'How it Works', content: '' }
    ]
  });

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/admin/dynamic-pages?slug=${slug}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setForm(prev => ({
            ...prev,
            ...data,
            hero_section: data.hero_section || prev.hero_section,
            destinations_section: data.destinations_section || prev.destinations_section,
            tours_section: data.tours_section || prev.tours_section,
            extra_sections: (data.extra_sections && data.extra_sections.length) ? data.extra_sections : prev.extra_sections
          }));
        }
        setLoading(false);
      });
  }, [slug]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/dynamic-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, ...form })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast('success', 'Page content updated successfully!');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1',
    fontSize: '0.9rem', color: '#0f172a', background: '#fff', outline: 'none', boxSizing: 'border-box' as const,
    marginBottom: '16px'
  };
  const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' };
  const sectionStyle = { background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading Editor...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto', paddingBottom: '100px' }}>
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 1000,
          display: 'flex', alignItems: 'center', gap: '10px',
          background: toast.type === 'success' ? '#ecfdf5' : '#fef2f2',
          border: `1px solid ${toast.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
          color: toast.type === 'success' ? '#047857' : '#b91c1c',
          padding: '14px 20px', borderRadius: '14px', fontWeight: 600
        }}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          {toast.message}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>Edit Page: {form.title || slug}</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Customize the frontend layout and content for this vertical.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#2563eb', color: '#fff', border: 'none',
            padding: '10px 20px', borderRadius: '10px', fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1
          }}
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#0f172a' }}>1. Hero Section</h2>
        <label style={labelStyle}>Hero Heading</label>
        <input style={inputStyle} value={form.hero_section.heading} onChange={e => setForm({...form, hero_section: {...form.hero_section, heading: e.target.value}})} placeholder="e.g. Find the Best Tours & Experiences" />
        
        <label style={labelStyle}>Hero Subheading</label>
        <input style={inputStyle} value={form.hero_section.subheading} onChange={e => setForm({...form, hero_section: {...form.hero_section, subheading: e.target.value}})} placeholder="e.g. Book unique activities around the world" />
        
        <label style={labelStyle}>Background Image URL</label>
        <input style={inputStyle} value={form.hero_section.background_image} onChange={e => setForm({...form, hero_section: {...form.hero_section, background_image: e.target.value}})} placeholder="https://..." />
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
          <input type="checkbox" checked={form.hero_section.show_search_bar} onChange={e => setForm({...form, hero_section: {...form.hero_section, show_search_bar: e.target.checked}})} />
          Show Search Bar in Hero?
        </label>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#0f172a' }}>2. Destinations Strip (One Row)</h2>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#334155', fontWeight: 600, marginBottom: '16px' }}>
          <input type="checkbox" checked={form.destinations_section.show} onChange={e => setForm({...form, destinations_section: {...form.destinations_section, show: e.target.checked}})} />
          Enable Destinations Row
        </label>
        <label style={labelStyle}>Section Title</label>
        <input style={inputStyle} value={form.destinations_section.title} onChange={e => setForm({...form, destinations_section: {...form.destinations_section, title: e.target.value}})} placeholder="Top Destinations" />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#0f172a' }}>3. Tours / Products Display</h2>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#334155', fontWeight: 600, marginBottom: '16px' }}>
          <input type="checkbox" checked={form.tours_section.show} onChange={e => setForm({...form, tours_section: {...form.tours_section, show: e.target.checked}})} />
          Enable Products Section
        </label>
        <label style={labelStyle}>Section Title</label>
        <input style={inputStyle} value={form.tours_section.title} onChange={e => setForm({...form, tours_section: {...form.tours_section, title: e.target.value}})} />
        <label style={labelStyle}>Subtitle</label>
        <input style={inputStyle} value={form.tours_section.subtitle} onChange={e => setForm({...form, tours_section: {...form.tours_section, subtitle: e.target.value}})} />
        
        {/* Custom Items Preview */}
        {form.tours_section.items && form.tours_section.items.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <label style={labelStyle}>Custom Items ({form.tours_section.items.length} Attractions Loaded)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px', marginTop: '12px' }}>
              {form.tours_section.items.map((item: any, i: number) => (
                <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={item.image} alt={item.title} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                  <div style={{ padding: '8px' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#0f172a' }}>4. Extra Content (Professional Design)</h2>
        {form.extra_sections.map((section, idx) => (
          <div key={section.id} style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: idx === 0 ? '1px solid #e2e8f0' : 'none' }}>
            <label style={labelStyle}>Extra Section {idx + 1} Title</label>
            <input style={inputStyle} value={section.title} onChange={e => {
              const newExtras = [...form.extra_sections];
              newExtras[idx].title = e.target.value;
              setForm({...form, extra_sections: newExtras});
            }} />
            <label style={labelStyle}>Extra Section {idx + 1} Content (Supports HTML)</label>
            <textarea 
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} 
              value={section.content} 
              onChange={e => {
                const newExtras = [...form.extra_sections];
                newExtras[idx].content = e.target.value;
                setForm({...form, extra_sections: newExtras});
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
