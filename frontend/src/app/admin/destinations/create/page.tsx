"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, Save, Send, Plus, Trash2, MapPin, Image as ImageIcon, 
  HelpCircle, Route, Star, Shield, Calendar, Globe, FileText,
  Camera
} from 'lucide-react';

interface DestinationState {
  name: string;
  slug: string;
  country: string;
  country_code: string;
  hero_image: string;
  description: string;
  meta_title: string;
  meta_description: string;
  highlights: string[];
  best_points: { title: string; description: string }[];
  trending_places: { name: string; image: string; description: string }[];
  faqs: { question: string; answer: string }[];
  gallery: { image_url: string; caption: string }[];
  itinerary: { title: string; description: string; image: string }[];
  best_time_to_visit: {
    months: string[];
    descriptions: Record<string, string>;
  };
  meta_data: {
    safety: {
      is_safe_for_women: boolean;
      safety_score: number;
      trusted_transport: string;
      emergency_contacts: { police: string; ambulance: string; women_helpline: string };
    };
    geo: { latitude: number; longitude: number };
  };
  popular_activities_count: number;
  is_published: boolean;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const defaultState: DestinationState = {
  name: '',
  slug: '',
  country: '',
  country_code: '',
  hero_image: '',
  description: '',
  meta_title: '',
  meta_description: '',
  highlights: [''],
  best_points: [],
  trending_places: [],
  faqs: [],
  gallery: [],
  itinerary: [],
  best_time_to_visit: {
    months: [],
    descriptions: {}
  },
  meta_data: {
    safety: {
      is_safe_for_women: false,
      safety_score: 0,
      trusted_transport: '',
      emergency_contacts: { police: '', ambulance: '', women_helpline: '' }
    },
    geo: { latitude: 0, longitude: 0 }
  },
  popular_activities_count: 0,
  is_published: false
};

export default function CreateEditDestination() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const isEditMode = !!editId;

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<DestinationState>(defaultState);

  useEffect(() => {
    if (isEditMode) {
      fetchDestinations();
    }
  }, [editId]);

  const fetchDestinations = async () => {
    try {
      const res = await fetch('/api/admin/destinations');
      if (!res.ok) throw new Error('Failed to fetch destinations');
      const data = await res.json();
      
      const items = Array.isArray(data) ? data : data.data || [];
      const destination = items.find((item: any) => item.id === editId);
      
      if (destination) {
        setFormData({
          name: destination.name || '',
          slug: destination.slug || '',
          country: destination.country || '',
          country_code: destination.country_code || '',
          hero_image: destination.hero_image || '',
          description: destination.description || '',
          meta_title: destination.meta_title || '',
          meta_description: destination.meta_description || '',
          highlights: (destination.highlights && destination.highlights.length > 0) ? destination.highlights : [''],
          best_points: destination.best_points || [],
          trending_places: destination.trending_places || [],
          faqs: destination.faqs || [],
          gallery: destination.gallery || [],
          itinerary: destination.itinerary || [],
          best_time_to_visit: {
            months: destination.best_time_to_visit?.months || [],
            descriptions: destination.best_time_to_visit?.descriptions || {}
          },
          meta_data: {
            safety: {
              is_safe_for_women: destination.meta_data?.safety?.is_safe_for_women || false,
              safety_score: destination.meta_data?.safety?.safety_score || 0,
              trusted_transport: destination.meta_data?.safety?.trusted_transport || '',
              emergency_contacts: {
                police: destination.meta_data?.safety?.emergency_contacts?.police || '',
                ambulance: destination.meta_data?.safety?.emergency_contacts?.ambulance || '',
                women_helpline: destination.meta_data?.safety?.emergency_contacts?.women_helpline || ''
              }
            },
            geo: {
              latitude: destination.meta_data?.geo?.latitude || 0,
              longitude: destination.meta_data?.geo?.longitude || 0
            }
          },
          popular_activities_count: destination.popular_activities_count || 0,
          is_published: destination.is_published || false
        });
      }
    } catch (error) {
      console.error('Error fetching destination:', error);
      alert('Failed to fetch destination data for editing.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof DestinationState, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parentField: keyof DestinationState, subField: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] as any),
        [subField]: value
      }
    }));
  };

  const handleDeepNestedChange = (parentField: 'meta_data', subParent: 'safety' | 'geo', field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      meta_data: {
        ...prev.meta_data,
        [subParent]: {
          ...prev.meta_data[subParent],
          [field]: value
        }
      }
    }));
  };
  
  const handleEmergencyContactChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      meta_data: {
        ...prev.meta_data,
        safety: {
          ...prev.meta_data.safety,
          emergency_contacts: {
            ...prev.meta_data.safety.emergency_contacts,
            [field]: value
          }
        }
      }
    }));
  };

  const handleArrayChange = (field: keyof DestinationState, index: number, subField: string, value: any) => {
    const newArray = [...(formData[field] as any[])];
    if (typeof newArray[index] === 'object') {
      newArray[index] = { ...newArray[index], [subField]: value };
    } else {
      newArray[index] = value;
    }
    handleChange(field, newArray);
  };

  const addArrayItem = (field: keyof DestinationState, defaultItem: any) => {
    handleChange(field, [...(formData[field] as any[]), defaultItem]);
  };

  const removeArrayItem = (field: keyof DestinationState, index: number) => {
    const newArray = [...(formData[field] as any[])];
    newArray.splice(index, 1);
    handleChange(field, newArray);
  };

  const handleMonthToggle = (month: string) => {
    const { months, descriptions } = formData.best_time_to_visit;
    const newMonths = months.includes(month) 
      ? months.filter(m => m !== month) 
      : [...months, month];
    
    // Sort months correctly
    newMonths.sort((a, b) => MONTHS.indexOf(a) - MONTHS.indexOf(b));
    
    setFormData(prev => ({
      ...prev,
      best_time_to_visit: {
        months: newMonths,
        descriptions: { ...descriptions, [month]: descriptions[month] || '' }
      }
    }));
  };

  const handleMonthDescChange = (month: string, desc: string) => {
    setFormData(prev => ({
      ...prev,
      best_time_to_visit: {
        ...prev.best_time_to_visit,
        descriptions: {
          ...prev.best_time_to_visit.descriptions,
          [month]: desc
        }
      }
    }));
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData(prev => ({
      ...prev,
      name: newName,
      slug: prev.slug === generateSlug(prev.name) || prev.slug === '' ? generateSlug(newName) : prev.slug
    }));
  };

  const handleSave = async (is_published: boolean) => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        is_published
      };

      const url = isEditMode 
        ? `/api/admin/destinations/${editId}` 
        : '/api/admin/destinations';
        
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to save destination');
      }

      router.push('/admin/destinations');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving destination');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', paddingBottom: '100px' }}>
      <div style={{ padding: '24px 32px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', marginBottom: '32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => router.push('/admin/destinations')}
            style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}
          >
            <ArrowLeft size={20} color="#475569" />
          </button>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            {isEditMode ? 'Edit Destination' : 'Create Destination'}
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* 1. BASIC INFO */}
        <section style={cardStyle}>
          <h2 style={headerStyle}><Globe size={20} color="#3b82f6" /> Basic Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Destination Name *</label>
              <input type="text" style={inputStyle} value={formData.name} onChange={handleNameChange} placeholder="e.g. Bali" required />
            </div>
            <div>
              <label style={labelStyle}>URL Slug *</label>
              <input type="text" style={inputStyle} value={formData.slug} onChange={e => handleChange('slug', e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>Country *</label>
              <input type="text" style={inputStyle} value={formData.country} onChange={e => handleChange('country', e.target.value)} placeholder="e.g. Indonesia" required />
            </div>
            <div>
              <label style={labelStyle}>Country Code (2 chars) *</label>
              <input type="text" style={inputStyle} value={formData.country_code} onChange={e => handleChange('country_code', e.target.value)} placeholder="e.g. ID" maxLength={2} required />
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <label style={labelStyle}>Description</label>
            <textarea style={{...inputStyle, resize: 'vertical'}} rows={4} value={formData.description} onChange={e => handleChange('description', e.target.value)} placeholder="Main overview description..."></textarea>
          </div>
          <div style={{ marginTop: '20px' }}>
            <label style={labelStyle}>Hero Image URL</label>
            <div style={{ display: 'flex', gap: '16px' }}>
              <input type="text" style={{...inputStyle, flex: 1}} value={formData.hero_image} onChange={e => handleChange('hero_image', e.target.value)} placeholder="https://..." />
              {formData.hero_image && (
                <img src={formData.hero_image} alt="Hero preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              )}
            </div>
          </div>
        </section>

        {/* 2. SEO / META */}
        <section style={cardStyle}>
          <h2 style={headerStyle}><FileText size={20} color="#8b5cf6" /> SEO & Meta Data</h2>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={labelStyle}>Meta Title</label>
              <span style={{ fontSize: '0.75rem', color: formData.meta_title.length > 60 ? '#ef4444' : '#64748b' }}>{formData.meta_title.length}/60 chars</span>
            </div>
            <input type="text" style={inputStyle} value={formData.meta_title} onChange={e => handleChange('meta_title', e.target.value)} placeholder="SEO Title" />
          </div>
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={labelStyle}>Meta Description</label>
              <span style={{ fontSize: '0.75rem', color: formData.meta_description.length > 160 ? '#ef4444' : '#64748b' }}>{formData.meta_description.length}/160 chars</span>
            </div>
            <textarea style={{...inputStyle, resize: 'vertical'}} rows={3} value={formData.meta_description} onChange={e => handleChange('meta_description', e.target.value)} placeholder="SEO Description"></textarea>
          </div>
        </section>

        {/* 3. HIGHLIGHTS */}
        <section style={cardStyle}>
          <h2 style={headerStyle}><Star size={20} color="#f59e0b" /> Highlights</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {formData.highlights.map((highlight, index) => (
              <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input type="text" style={{...inputStyle, flex: 1}} value={highlight} onChange={e => {
                  const newHighlights = [...formData.highlights];
                  newHighlights[index] = e.target.value;
                  handleChange('highlights', newHighlights);
                }} placeholder={`Highlight ${index + 1}`} />
                <button type="button" onClick={() => removeArrayItem('highlights', index)} style={removeBtnStyle}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addArrayItem('highlights', '')} style={addBtnStyle}><Plus size={16} /> Add Highlight</button>
        </section>

        {/* 4. BEST POINTS */}
        <section style={cardStyle}>
          <h2 style={headerStyle}><Star size={20} color="#ec4899" /> Best Points</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {formData.best_points.map((point, index) => (
              <div key={index} style={repeatableItemStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <label style={{...labelStyle, margin: 0}}>Point #{index + 1}</label>
                  <button type="button" onClick={() => removeArrayItem('best_points', index)} style={removeBtnStyle}><Trash2 size={16} /></button>
                </div>
                <input type="text" style={{...inputStyle, marginBottom: '12px'}} value={point.title} onChange={e => handleArrayChange('best_points', index, 'title', e.target.value)} placeholder="Title" />
                <textarea style={{...inputStyle, resize: 'vertical'}} rows={2} value={point.description} onChange={e => handleArrayChange('best_points', index, 'description', e.target.value)} placeholder="Description"></textarea>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addArrayItem('best_points', { title: '', description: '' })} style={addBtnStyle}><Plus size={16} /> Add Best Point</button>
        </section>

        {/* 5. TRENDING PLACES */}
        <section style={cardStyle}>
          <h2 style={headerStyle}><MapPin size={20} color="#10b981" /> Trending Places</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {formData.trending_places.map((place, index) => (
              <div key={index} style={repeatableItemStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <label style={{...labelStyle, margin: 0}}>Place #{index + 1}</label>
                  <button type="button" onClick={() => removeArrayItem('trending_places', index)} style={removeBtnStyle}><Trash2 size={16} /></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                  <input type="text" style={inputStyle} value={place.name} onChange={e => handleArrayChange('trending_places', index, 'name', e.target.value)} placeholder="Place Name" />
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input type="text" style={{...inputStyle, flex: 1}} value={place.image} onChange={e => handleArrayChange('trending_places', index, 'image', e.target.value)} placeholder="Image URL" />
                    {place.image && <img src={place.image} alt="preview" style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} />}
                  </div>
                  <textarea style={{...inputStyle, resize: 'vertical'}} rows={2} value={place.description} onChange={e => handleArrayChange('trending_places', index, 'description', e.target.value)} placeholder="Description"></textarea>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addArrayItem('trending_places', { name: '', image: '', description: '' })} style={addBtnStyle}><Plus size={16} /> Add Trending Place</button>
        </section>

        {/* 6. GALLERY */}
        <section style={cardStyle}>
          <h2 style={headerStyle}><Camera size={20} color="#f43f5e" /> Gallery</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {formData.gallery.map((img, index) => (
              <div key={index} style={{...repeatableItemStyle, display: 'flex', flexDirection: 'column', gap: '12px'}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <label style={{...labelStyle, margin: 0}}>Image #{index + 1}</label>
                  <button type="button" onClick={() => removeArrayItem('gallery', index)} style={removeBtnStyle}><Trash2 size={16} /></button>
                </div>
                {img.image_url ? (
                  <div style={{ width: '100%', height: '120px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={img.image_url} alt="Gallery item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '120px', borderRadius: '8px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ImageIcon size={32} color="#94a3b8" />
                  </div>
                )}
                <input type="text" style={inputStyle} value={img.image_url} onChange={e => handleArrayChange('gallery', index, 'image_url', e.target.value)} placeholder="Image URL" />
                <input type="text" style={inputStyle} value={img.caption} onChange={e => handleArrayChange('gallery', index, 'caption', e.target.value)} placeholder="Caption" />
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addArrayItem('gallery', { image_url: '', caption: '' })} style={addBtnStyle}><Plus size={16} /> Add Gallery Image</button>
        </section>

        {/* 7. ITINERARY */}
        <section style={cardStyle}>
          <h2 style={headerStyle}><Route size={20} color="#06b6d4" /> Itinerary / Places to Visit</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {formData.itinerary.map((item, index) => (
              <div key={index} style={repeatableItemStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <label style={{...labelStyle, margin: 0}}>Day/Place #{index + 1}</label>
                  <button type="button" onClick={() => removeArrayItem('itinerary', index)} style={removeBtnStyle}><Trash2 size={16} /></button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input type="text" style={inputStyle} value={item.title} onChange={e => handleArrayChange('itinerary', index, 'title', e.target.value)} placeholder="Title (e.g. Day 1: Arrival in Bali)" />
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input type="text" style={{...inputStyle, flex: 1}} value={item.image} onChange={e => handleArrayChange('itinerary', index, 'image', e.target.value)} placeholder="Image URL" />
                    {item.image && <img src={item.image} alt="preview" style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} />}
                  </div>
                  <textarea style={{...inputStyle, resize: 'vertical'}} rows={3} value={item.description} onChange={e => handleArrayChange('itinerary', index, 'description', e.target.value)} placeholder="Description"></textarea>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addArrayItem('itinerary', { title: '', description: '', image: '' })} style={addBtnStyle}><Plus size={16} /> Add Itinerary Item</button>
        </section>

        {/* 8. BEST TIME TO VISIT */}
        <section style={cardStyle}>
          <h2 style={headerStyle}><Calendar size={20} color="#84cc16" /> Best Time To Visit</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
            {MONTHS.map(month => (
              <button
                key={month}
                type="button"
                onClick={() => handleMonthToggle(month)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: `1px solid ${formData.best_time_to_visit.months.includes(month) ? '#3b82f6' : '#cbd5e1'}`,
                  backgroundColor: formData.best_time_to_visit.months.includes(month) ? '#eff6ff' : '#fff',
                  color: formData.best_time_to_visit.months.includes(month) ? '#2563eb' : '#475569',
                  fontWeight: formData.best_time_to_visit.months.includes(month) ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {month}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {formData.best_time_to_visit.months.map(month => (
              <div key={month} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>{month} Description</label>
                <textarea 
                  style={{...inputStyle, resize: 'vertical'}} 
                  rows={2} 
                  value={formData.best_time_to_visit.descriptions[month] || ''} 
                  onChange={e => handleMonthDescChange(month, e.target.value)} 
                  placeholder={`What to expect in ${month}...`}
                ></textarea>
              </div>
            ))}
          </div>
        </section>

        {/* 9. SAFETY & SECURITY */}
        <section style={cardStyle}>
          <h2 style={headerStyle}><Shield size={20} color="#ef4444" /> Safety, Security & Geo</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div>
              <label style={{...labelStyle, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '16px'}}>
                <input 
                  type="checkbox" 
                  checked={formData.meta_data.safety.is_safe_for_women} 
                  onChange={e => handleDeepNestedChange('meta_data', 'safety', 'is_safe_for_women', e.target.checked)} 
                  style={{ width: '18px', height: '18px' }}
                />
                Is Safe for Women
              </label>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Safety Score (0-10)</label>
                <input 
                  type="number" 
                  style={inputStyle} 
                  min="0" max="10" step="0.1" 
                  value={formData.meta_data.safety.safety_score} 
                  onChange={e => handleDeepNestedChange('meta_data', 'safety', 'safety_score', parseFloat(e.target.value))} 
                />
              </div>
              <div>
                <label style={labelStyle}>Trusted Transport</label>
                <input 
                  type="text" 
                  style={inputStyle} 
                  value={formData.meta_data.safety.trusted_transport} 
                  onChange={e => handleDeepNestedChange('meta_data', 'safety', 'trusted_transport', e.target.value)} 
                  placeholder="e.g. Bluebird Taxis, Grab" 
                />
              </div>
            </div>
            
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', marginBottom: '12px' }}>Emergency Contacts</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Police</label>
                  <input type="text" style={inputStyle} value={formData.meta_data.safety.emergency_contacts.police} onChange={e => handleEmergencyContactChange('police', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Ambulance</label>
                  <input type="text" style={inputStyle} value={formData.meta_data.safety.emergency_contacts.ambulance} onChange={e => handleEmergencyContactChange('ambulance', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Women Helpline</label>
                  <input type="text" style={inputStyle} value={formData.meta_data.safety.emergency_contacts.women_helpline} onChange={e => handleEmergencyContactChange('women_helpline', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <hr style={{ borderTop: '1px solid #e2e8f0', borderBottom: 'none', margin: '24px 0' }} />

          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', marginBottom: '12px' }}>Geolocation</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Latitude</label>
              <input type="number" style={inputStyle} value={formData.meta_data.geo.latitude} onChange={e => handleDeepNestedChange('meta_data', 'geo', 'latitude', parseFloat(e.target.value))} />
            </div>
            <div>
              <label style={labelStyle}>Longitude</label>
              <input type="number" style={inputStyle} value={formData.meta_data.geo.longitude} onChange={e => handleDeepNestedChange('meta_data', 'geo', 'longitude', parseFloat(e.target.value))} />
            </div>
          </div>
        </section>

        {/* 10. FAQs */}
        <section style={cardStyle}>
          <h2 style={headerStyle}><HelpCircle size={20} color="#6366f1" /> FAQs</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {formData.faqs.map((faq, index) => (
              <div key={index} style={repeatableItemStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <label style={{...labelStyle, margin: 0}}>Question #{index + 1}</label>
                  <button type="button" onClick={() => removeArrayItem('faqs', index)} style={removeBtnStyle}><Trash2 size={16} /></button>
                </div>
                <input type="text" style={{...inputStyle, marginBottom: '12px'}} value={faq.question} onChange={e => handleArrayChange('faqs', index, 'question', e.target.value)} placeholder="Question" />
                <textarea style={{...inputStyle, resize: 'vertical'}} rows={2} value={faq.answer} onChange={e => handleArrayChange('faqs', index, 'answer', e.target.value)} placeholder="Answer"></textarea>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addArrayItem('faqs', { question: '', answer: '' })} style={addBtnStyle}><Plus size={16} /> Add FAQ</button>
        </section>

      </div>

      {/* 11. BOTTOM ACTION BAR */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: '16px 32px',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        gap: '16px',
        justifyContent: 'flex-end',
        zIndex: 10,
        boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}>
        <button 
          onClick={() => router.push('/admin/destinations')}
          style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
          disabled={saving}
        >
          Cancel
        </button>
        <button 
          onClick={() => handleSave(false)}
          style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          disabled={saving}
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save as Draft'}
        </button>
        <button 
          onClick={() => handleSave(true)}
          style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          disabled={saving}
        >
          <Send size={18} /> {saving ? 'Saving...' : 'Save & Publish'}
        </button>
      </div>

    </div>
  );
}

// Inline Styles
const cardStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '32px',
  borderRadius: '16px',
  border: '1px solid #e2e8f0',
  fontFamily: 'sans-serif'
};

const headerStyle: React.CSSProperties = {
  fontSize: '1.1rem',
  fontWeight: 800,
  color: '#0f172a',
  margin: '0 0 24px 0',
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const inputStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: '10px',
  border: '1px solid #cbd5e1',
  width: '100%',
  fontSize: '0.92rem',
  fontFamily: 'inherit',
  boxSizing: 'border-box'
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  fontWeight: 600,
  color: '#334155',
  marginBottom: '6px',
  display: 'block'
};

const repeatableItemStyle: React.CSSProperties = {
  backgroundColor: '#f8fafc',
  borderRadius: '12px',
  padding: '20px',
  border: '1px solid #e2e8f0'
};

const addBtnStyle: React.CSSProperties = {
  border: '1px dashed #94a3b8',
  backgroundColor: 'transparent',
  color: '#64748b',
  borderRadius: '10px',
  padding: '12px',
  width: '100%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  marginTop: '16px',
  fontWeight: 600
};

const removeBtnStyle: React.CSSProperties = {
  background: '#fee2e2',
  color: '#ef4444',
  border: 'none',
  borderRadius: '6px',
  padding: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};
