'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, Save, Send, Plus, Trash2, 
  MapPin, Image as ImageIcon, HelpCircle, Map, Camera, Route, Calendar, ShieldCheck, Sparkles
} from 'lucide-react';

function DestinationFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    country: '',
    country_code: '',
    description: '',
    hero_image: '',
    meta_title: '',
    meta_description: '',
    highlights: [''],
    best_points: [{ title: '', description: '' }],
    trending_places: [{ name: '', image: '', description: '' }],
    faqs: [{ question: '', answer: '' }],
    gallery: [{ image_url: '', caption: '' }],
    itinerary: [{ title: '', description: '', image: '' }],
    best_time_to_visit: { months: [] as string[], descriptions: {} as Record<string, string> },
    meta_data: {
      safety: {
        is_safe_for_women: false,
        safety_score: 0,
        trusted_transport: '',
        emergency_contacts: { police: '', ambulance: '', women_helpline: '' }
      },
      geo: { latitude: '', longitude: '' }
    },
    is_published: false
  });

  useEffect(() => {
    if (id) {
      const fetchDestination = async () => {
        try {
          const response = await fetch('/api/admin/destinations', { cache: 'no-store' });
          const result = await response.json();
          let dest = null;
          
          if (Array.isArray(result.data)) {
            dest = result.data.find((d: any) => d._id === id || d.id === id);
          } else if (result.data && (result.data._id === id || result.data.id === id)) {
            dest = result.data;
          }
          
          if (dest) {
            setFormData({
              name: dest.name || '',
              slug: dest.slug || '',
              country: dest.country || '',
              country_code: dest.country_code || '',
              description: dest.description || '',
              hero_image: dest.hero_image || '',
              meta_title: dest.meta_title || '',
              meta_description: dest.meta_description || '',
              highlights: dest.highlights?.length ? dest.highlights : [''],
              best_points: dest.best_points?.length ? dest.best_points : [{ title: '', description: '' }],
              trending_places: dest.trending_places?.length ? dest.trending_places : [{ name: '', image: '', description: '' }],
              faqs: dest.faqs?.length ? dest.faqs : [{ question: '', answer: '' }],
              gallery: dest.gallery?.length ? dest.gallery : [{ image_url: '', caption: '' }],
              itinerary: dest.itinerary?.length ? dest.itinerary : [{ title: '', description: '', image: '' }],
              best_time_to_visit: {
                months: dest.best_time_to_visit?.months || [],
                descriptions: dest.best_time_to_visit?.descriptions || {},
              },
              meta_data: dest.meta_data || {
                safety: {
                  is_safe_for_women: false,
                  safety_score: 0,
                  trusted_transport: '',
                  emergency_contacts: { police: '', ambulance: '', women_helpline: '' }
                },
                geo: { latitude: '', longitude: '' }
              },
              is_published: dest.is_published || false
            });
          }
        } catch (error) {
          console.error("Failed to fetch destination", error);
        } finally {
          setFetching(false);
        }
      };
      fetchDestination();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'name' && !id) { 
      // Auto generate slug for new destination
      const generatedSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, [name]: value, slug: generatedSlug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (field: keyof typeof formData, index: number, key: string, value: string) => {
    setFormData(prev => {
      const newArray = [...(prev[field] as any[])];
      newArray[index] = { ...newArray[index], [key]: value };
      return { ...prev, [field]: newArray };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, index?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingImage(true);
      try {
        const uploadData = new FormData();
        uploadData.append('file', file);
        
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadData
        });
        
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to upload');
        }
        
        const { url } = await res.json();
        
        if (index !== undefined) {
          const fieldKey = field === 'gallery' ? 'image_url' : 'image';
          handleArrayChange(field as any, index, fieldKey, url);
        } else {
          setFormData(prev => ({ ...prev, [field]: url }));
        }
      } catch (err: any) {
        alert('Image upload failed: ' + err.message);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const addArrayItem = (field: string, emptyItem: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev as any)[field], emptyItem]
    }));
  };

  const handleHighlightChange = (index: number, value: string) => {
    setFormData(prev => {
      const newArr = [...prev.highlights];
      newArr[index] = value;
      return { ...prev, highlights: newArr };
    });
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => {
      const array = [...(prev as any)[field]];
      array.splice(index, 1);
      return { ...prev, [field]: array };
    });
  };

  const handleSubmit = async (isPublished: boolean) => {
    setSaveMessage(null);
    if (!formData.name || !formData.country) {
      setSaveMessage({ type: 'error', text: "Name and Country are required fields." });
      return;
    }
    
    setLoading(true);
    try {
      const geoLat = formData.meta_data.geo?.latitude;
      const geoLng = formData.meta_data.geo?.longitude;
      const geo = {
        ...(formData.meta_data.geo || {}),
        latitude: geoLat === '' || geoLat == null ? null : Number(geoLat),
        longitude: geoLng === '' || geoLng == null ? null : Number(geoLng),
      };
      const dataToSubmit = {
        ...formData,
        meta_data: { ...formData.meta_data, geo },
        is_published: isPublished,
      };
      const url = id ? `/api/admin/destinations/${id}` : '/api/admin/destinations';
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSubmit)
      });

      if (response.ok) {
        setSaveMessage({ type: 'success', text: "Destination saved successfully! Redirecting..." });
        setTimeout(() => router.push('/admin/destinations'), 800);
      } else {
        const errData = await response.json().catch(() => ({}));
        const errorMsg = errData.error || "Failed to save destination.";
        console.error("Failed to save destination:", errorMsg);
        setSaveMessage({ type: 'error', text: `Error: ${errorMsg}` });
      }
    } catch (error) {
      console.error("Error saving destination", error);
      setSaveMessage({ type: 'error', text: "An error occurred while saving." });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Loading destination data...</div>;
  }

  // Styles
  const pageStyle: React.CSSProperties = {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
    color: '#0f172a'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px'
  };

  const sectionStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '24px',
    fontFamily: "'Outfit', sans-serif"
  };

  const formGroupStyle: React.CSSProperties = {
    marginBottom: '20px'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.92rem',
    fontWeight: 600,
    color: '#475569'
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

  const repeatableCardStyle: React.CSSProperties = {
    backgroundColor: '#f8fafc',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    marginBottom: '16px',
    position: 'relative'
  };

  const removeBtnStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'transparent',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px'
  };

  const addBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '14px',
    border: '2px dashed #cbd5e1',
    borderRadius: '10px',
    backgroundColor: 'transparent',
    color: '#475569',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  const bottomBarStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 32px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    marginTop: '32px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
  };

  const btnSecondaryStyle: React.CSSProperties = {
    padding: '12px 20px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'inherit'
  };

  const btnDraftStyle: React.CSSProperties = {
    ...btnSecondaryStyle,
    color: '#475569'
  };

  const btnPrimaryStyle: React.CSSProperties = {
    padding: '12px 24px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #7c3aed 100%)',
    color: '#ffffff',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'inherit'
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <button 
          onClick={() => router.push('/admin/destinations')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: '8px', display: 'flex', alignItems: 'center' }}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", margin: 0 }}>
          {id ? 'Edit Destination' : 'Create Destination'}
        </h1>
      </div>

      {/* A) BASIC INFO */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>
          <MapPin size={22} color="#0284c7" />
          Basic Information
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Name *</label>
            <input 
              style={inputStyle} 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required
              placeholder="e.g. Paris"
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Slug *</label>
            <input 
              style={inputStyle} 
              name="slug" 
              value={formData.slug} 
              onChange={handleChange} 
              required
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Country *</label>
            <input 
              style={inputStyle} 
              name="country" 
              value={formData.country} 
              onChange={handleChange} 
              required
              placeholder="e.g. France"
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Country Code</label>
            <input 
              style={inputStyle} 
              name="country_code" 
              value={formData.country_code} 
              onChange={handleChange} 
              maxLength={2}
              placeholder="e.g. FR"
            />
          </div>
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Description</label>
          <textarea 
            style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Hero Image</label>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
            <input 
              style={{ ...inputStyle, flex: 1 }} 
              name="hero_image" 
              value={formData.hero_image} 
              onChange={handleChange} 
              placeholder="Paste image URL here..."
            />
            <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>OR</span>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
              backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '10px',
              cursor: 'pointer', color: '#334155', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s'
            }}>
              <ImageIcon size={18} color="#0284c7" /> Browse File
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleImageUpload(e, 'hero_image')} 
                style={{ display: 'none' }} 
              />
            </label>
          </div>
          {formData.hero_image && (
            <div style={{ borderRadius: '12px', overflow: 'hidden', height: '220px', border: '1px solid #e2e8f0', position: 'relative' }}>
              <Image src={formData.hero_image} alt="Hero Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}  width={100} height={100} />
            </div>
          )}
        </div>
      </div>

      {/* A2) SEO META */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>
          <Sparkles size={22} color="#7c3aed" />
          SEO Meta (for Google Search)
        </h2>
        <div style={formGroupStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label style={labelStyle}>Meta Title</label>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: formData.meta_title.length >= 50 && formData.meta_title.length <= 60 ? '#059669' : formData.meta_title.length > 0 ? '#d97706' : '#94a3b8' }}>
              {formData.meta_title.length}/60 {formData.meta_title.length >= 50 ? '(good)' : '(aim 50-60)'}
            </span>
          </div>
          <input 
            style={inputStyle} 
            name="meta_title" 
            value={formData.meta_title} 
            onChange={handleChange} 
            maxLength={60}
            placeholder="e.g. 10 Best Things to Do in Tokyo | Vaitour"
          />
          {formData.meta_title.length < 50 && (
            <div style={{ fontSize: '0.8rem', color: '#d97706', marginTop: '4px' }}>
              {50 - formData.meta_title.length} more characters recommended (ideal 50-60).
            </div>
          )}
        </div>
        <div style={formGroupStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label style={labelStyle}>Meta Description</label>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: formData.meta_description.length >= 150 && formData.meta_description.length <= 160 ? '#059669' : formData.meta_description.length > 0 ? '#d97706' : '#94a3b8' }}>
              {formData.meta_description.length}/160 {formData.meta_description.length >= 150 ? '(good)' : '(aim 150-160)'}
            </span>
          </div>
          <textarea 
            style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }} 
            name="meta_description" 
            value={formData.meta_description} 
            onChange={handleChange} 
            maxLength={160}
            placeholder="e.g. Discover Tokyo's best attractions, food, culture and day trips with our expert travel guides and curated tour packages."
          />
          {formData.meta_description.length < 150 && (
            <div style={{ fontSize: '0.8rem', color: '#d97706', marginTop: '4px' }}>
              {150 - formData.meta_description.length} more characters recommended (ideal 150-160).
            </div>
          )}
        </div>
      </div>

      {/* B) BEST POINTS */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>
          <HelpCircle size={22} color="#0284c7" />
          Best Points
        </h2>
        {formData.best_points.map((item, index) => (
          <div key={index} style={repeatableCardStyle}>
            {formData.best_points.length > 1 && (
              <button style={removeBtnStyle} onClick={() => removeArrayItem('best_points', index)} title="Remove item">
                <Trash2 size={18} />
              </button>
            )}
            <div style={formGroupStyle}>
              <label style={labelStyle}>Title</label>
              <input 
                style={inputStyle} 
                value={item.title} 
                onChange={(e) => handleArrayChange('best_points', index, 'title', e.target.value)} 
                placeholder="e.g. Best Time to Visit"
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Description</label>
              <textarea 
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} 
                value={item.description} 
                onChange={(e) => handleArrayChange('best_points', index, 'description', e.target.value)} 
              />
            </div>
          </div>
        ))}
        <button style={addBtnStyle} onClick={() => addArrayItem('best_points', { title: '', description: '' })}>
          <Plus size={20} /> Add Item
        </button>
      </div>

      {/* B2) HIGHLIGHTS */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>
          <Sparkles size={22} color="#f43f5e" />
          Highlights
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '16px' }}>
          Each line becomes one bullet point. Add a new line to create the next bullet.
        </p>
        {formData.highlights.map((item, index) => (
          <div key={index} style={repeatableCardStyle}>
            {formData.highlights.length > 1 && (
              <button style={removeBtnStyle} onClick={() => removeArrayItem('highlights', index)} title="Remove item">
                <Trash2 size={18} />
              </button>
            )}
            <div style={formGroupStyle}>
              <label style={labelStyle}>Highlight Point {index + 1}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e', flexShrink: 0 }} />
                <input 
                  style={inputStyle} 
                  value={item} 
                  onChange={(e) => handleHighlightChange(index, e.target.value)} 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addArrayItem('highlights', '');
                    }
                  }}
                  placeholder="e.g. 4K HD photos & videos included"
                />
              </div>
            </div>
          </div>
        ))}
        <button style={addBtnStyle} onClick={() => addArrayItem('highlights', '')}>
          <Plus size={20} /> Add Highlight
        </button>
      </div>

      {/* C) TRENDING PLACES */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>
          <Map size={22} color="#0284c7" />
          Trending Places
        </h2>
        {formData.trending_places.map((item, index) => (
          <div key={index} style={repeatableCardStyle}>
            {formData.trending_places.length > 1 && (
              <button style={removeBtnStyle} onClick={() => removeArrayItem('trending_places', index)} title="Remove item">
                <Trash2 size={18} />
              </button>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Name</label>
                <input 
                  style={inputStyle} 
                  value={item.name} 
                  onChange={(e) => handleArrayChange('trending_places', index, 'name', e.target.value)} 
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Image URL</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    style={{ ...inputStyle, flex: 1 }} 
                    value={item.image} 
                    onChange={(e) => handleArrayChange('trending_places', index, 'image', e.target.value)} 
                  />
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: '4px', padding: '10px 14px',
                    backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '10px',
                    cursor: 'pointer', color: '#334155', fontWeight: 600, fontSize: '0.85rem'
                  }}>
                    <ImageIcon size={16} color="#0284c7" /> Browse
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(e, 'trending_places', index)} 
                      style={{ display: 'none' }} 
                    />
                  </label>
                </div>
              </div>
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Description</label>
              <textarea 
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} 
                value={item.description} 
                onChange={(e) => handleArrayChange('trending_places', index, 'description', e.target.value)} 
              />
            </div>
          </div>
        ))}
        <button style={addBtnStyle} onClick={() => addArrayItem('trending_places', { name: '', image: '', description: '' })}>
          <Plus size={20} /> Add Item
        </button>
      </div>

      {/* E) GALLERY */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>
          <Camera size={22} color="#0284c7" />
          Gallery
        </h2>
        {formData.gallery.map((item, index) => (
          <div key={index} style={repeatableCardStyle}>
            {formData.gallery.length > 1 && (
              <button style={removeBtnStyle} onClick={() => removeArrayItem('gallery', index)} title="Remove item">
                <Trash2 size={18} />
              </button>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '20px', alignItems: 'start' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '8px', border: '1px solid #cbd5e1', overflow: 'hidden', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {(item as any).image_url ? (
                  <Image src={(item as any).image_url} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }}  width={100} height={100} />
                ) : (
                  <ImageIcon size={24} color="#94a3b8" />
                )}
              </div>
              <div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Image URL</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input 
                      style={{ ...inputStyle, flex: 1 }} 
                      value={(item as any).image_url} 
                      onChange={(e) => handleArrayChange('gallery', index, 'image_url', e.target.value)} 
                    />
                    <label style={{
                      display: 'flex', alignItems: 'center', gap: '4px', padding: '10px 14px',
                      backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '10px',
                      cursor: 'pointer', color: '#334155', fontWeight: 600, fontSize: '0.85rem'
                    }}>
                      <ImageIcon size={16} color="#0284c7" /> Browse
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleImageUpload(e, 'gallery', index)} 
                        style={{ display: 'none' }} 
                      />
                    </label>
                  </div>
                </div>
                <div style={{ ...formGroupStyle, marginBottom: 0 }}>
                  <label style={labelStyle}>Caption</label>
                  <input 
                    style={inputStyle} 
                    value={item.caption} 
                    onChange={(e) => handleArrayChange('gallery', index, 'caption', e.target.value)} 
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        <button style={addBtnStyle} onClick={() => addArrayItem('gallery', { image_url: '', caption: '' })}>
          <Plus size={20} /> Add Item
        </button>
      </div>

      {/* F) ITINERARY */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>
          <Route size={22} color="#0284c7" />
          Itinerary / Places to Visit
        </h2>
        {formData.itinerary.map((item, index) => (
          <div key={index} style={repeatableCardStyle}>
            {formData.itinerary.length > 1 && (
              <button style={removeBtnStyle} onClick={() => removeArrayItem('itinerary', index)} title="Remove item">
                <Trash2 size={18} />
              </button>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Title</label>
                <input 
                  style={inputStyle} 
                  value={item.title} 
                  onChange={(e) => handleArrayChange('itinerary', index, 'title', e.target.value)} 
                  placeholder="e.g. Badshahi Mosque"
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Image URL</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    style={{ ...inputStyle, flex: 1 }} 
                    value={item.image} 
                    onChange={(e) => handleArrayChange('itinerary', index, 'image', e.target.value)} 
                  />
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: '4px', padding: '10px 14px',
                    backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '10px',
                    cursor: 'pointer', color: '#334155', fontWeight: 600, fontSize: '0.85rem'
                  }}>
                    <ImageIcon size={16} color="#0284c7" /> Browse
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(e, 'itinerary', index)} 
                      style={{ display: 'none' }} 
                    />
                  </label>
                </div>
              </div>
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Description</label>
              <textarea 
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} 
                value={item.description} 
                onChange={(e) => handleArrayChange('itinerary', index, 'description', e.target.value)} 
              />
            </div>
          </div>
        ))}
        <button style={addBtnStyle} onClick={() => addArrayItem('itinerary', { title: '', description: '', image: '' })}>
          <Plus size={20} /> Add Item
        </button>
      </div>

      {/* G) BEST TIME TO VISIT */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>
          <Calendar size={22} color="#0284c7" />
          Best Time to Visit
        </h2>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Select Best Months (click a month to add/remove it)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => {
              const isSelected = formData.best_time_to_visit.months.includes(m);
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      best_time_to_visit: {
                        ...prev.best_time_to_visit,
                        months: isSelected 
                          ? prev.best_time_to_visit.months.filter(x => x !== m)
                          : [...prev.best_time_to_visit.months, m]
                      }
                    }));
                  }}
                  style={{
                    padding: '8px 16px', borderRadius: '999px', border: `1px solid ${isSelected ? '#0284c7' : '#cbd5e1'}`,
                    background: isSelected ? '#e0f2fe' : '#ffffff', color: isSelected ? '#0369a1' : '#475569',
                    fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>

        {/* Per-month descriptions: one editable box for each selected month */}
        {formData.best_time_to_visit.months.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '4px' }}>
            <label style={labelStyle}>Month Descriptions (custom text for each selected month)</label>
            {formData.best_time_to_visit.months.map((m) => (
              <div key={m} style={{
                border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px',
                background: '#f8fafc'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{
                    padding: '6px 14px', borderRadius: '999px', background: '#0284c7',
                    color: '#ffffff', fontWeight: 700, fontSize: '0.85rem'
                  }}>
                    {m}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Description shown to customers when they click {m}
                  </span>
                </div>
                <textarea
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', background: '#ffffff' }}
                  value={formData.best_time_to_visit.descriptions[m] || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    best_time_to_visit: {
                      ...prev.best_time_to_visit,
                      descriptions: { ...prev.best_time_to_visit.descriptions, [m]: e.target.value }
                    }
                  }))}
                  placeholder={`e.g. In ${m}, the weather is mild and perfect for sightseeing...`}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* D) FAQs (Moved to Bottom) */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>
          <HelpCircle size={22} color="#0284c7" />
          FAQs
        </h2>
        {formData.faqs.map((item, index) => (
          <div key={index} style={repeatableCardStyle}>
            {formData.faqs.length > 1 && (
              <button style={removeBtnStyle} onClick={() => removeArrayItem('faqs', index)} title="Remove item">
                <Trash2 size={18} />
              </button>
            )}
            <div style={formGroupStyle}>
              <label style={labelStyle}>Question</label>
              <input 
                style={inputStyle} 
                value={item.question} 
                onChange={(e) => handleArrayChange('faqs', index, 'question', e.target.value)} 
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Answer</label>
              <textarea 
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} 
                value={item.answer} 
                onChange={(e) => handleArrayChange('faqs', index, 'answer', e.target.value)} 
              />
            </div>
          </div>
        ))}
        <button style={addBtnStyle} onClick={() => addArrayItem('faqs', { question: '', answer: '' })}>
          <Plus size={20} /> Add Item
        </button>
      </div>

      {/* I) WOMEN SAFETY & SOLO TRAVEL */}
      <div style={sectionStyle}>
        <h2 style={{ ...sectionTitleStyle, color: '#9d174d' }}>
          <ShieldCheck size={22} color="#ec4899" />
          Women Safety & Solo Travel
        </h2>
        <div style={{ ...formGroupStyle, flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
          <input 
            type="checkbox" 
            id="is_safe"
            checked={formData.meta_data.safety.is_safe_for_women}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              meta_data: {
                ...prev.meta_data,
                safety: { ...prev.meta_data.safety, is_safe_for_women: e.target.checked }
              }
            }))}
            style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#ec4899' }}
          />
          <label htmlFor="is_safe" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer', color: '#9d174d' }}>
            Verified Safe for Solo Female Travelers (Shows a special badge)
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Safety Score (1-10)</label>
            <input 
              type="number" 
              min="1" max="10"
              style={inputStyle} 
              value={formData.meta_data.safety.safety_score || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                meta_data: {
                  ...prev.meta_data,
                  safety: { ...prev.meta_data.safety, safety_score: parseInt(e.target.value) || 0 }
                }
              }))}
              placeholder="e.g. 9"
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Trusted Transport Options</label>
            <input 
              type="text"
              style={inputStyle} 
              value={formData.meta_data.safety.trusted_transport}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                meta_data: {
                  ...prev.meta_data,
                  safety: { ...prev.meta_data.safety, trusted_transport: e.target.value }
                }
              }))}
              placeholder="e.g. Uber, Careem, Metro"
            />
          </div>
        </div>

        <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#fdf2f8', borderRadius: '10px', border: '1px solid #fbcfe8' }}>
          <h4 style={{ fontSize: '0.9rem', color: '#be185d', marginBottom: '12px', fontWeight: 700 }}>Emergency Contacts</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div style={formGroupStyle}>
              <label style={{ ...labelStyle, fontSize: '0.8rem' }}>Police</label>
              <input 
                type="text" style={inputStyle} placeholder="e.g. 15"
                value={formData.meta_data.safety.emergency_contacts.police}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_data: { ...prev.meta_data, safety: { ...prev.meta_data.safety, emergency_contacts: { ...prev.meta_data.safety.emergency_contacts, police: e.target.value } } } }))}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={{ ...labelStyle, fontSize: '0.8rem' }}>Ambulance</label>
              <input 
                type="text" style={inputStyle} placeholder="e.g. 115"
                value={formData.meta_data.safety.emergency_contacts.ambulance}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_data: { ...prev.meta_data, safety: { ...prev.meta_data.safety, emergency_contacts: { ...prev.meta_data.safety.emergency_contacts, ambulance: e.target.value } } } }))}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={{ ...labelStyle, fontSize: '0.8rem' }}>Women's Helpline</label>
              <input 
                type="text" style={inputStyle} placeholder="e.g. 1099"
                value={formData.meta_data.safety.emergency_contacts.women_helpline}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_data: { ...prev.meta_data, safety: { ...prev.meta_data.safety, emergency_contacts: { ...prev.meta_data.safety.emergency_contacts, women_helpline: e.target.value } } } }))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* I.5) WEATHER LOCATION COORDINATES */}
      <div style={sectionStyle}>
        <h2 style={{ ...sectionTitleStyle, color: '#0e7490' }}>
          <Map size={22} color="#06b6d4" />
          Weather Location (Coordinates)
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '20px', lineHeight: 1.6 }}>
          Add the latitude and longitude of this destination so the live weather widget shows accurate conditions.
          If left empty, we automatically geocode the destination name.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Latitude</label>
            <input
              type="number"
              step="any"
              style={inputStyle}
              value={formData.meta_data.geo?.latitude ?? ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                meta_data: { ...prev.meta_data, geo: { ...prev.meta_data.geo, latitude: e.target.value } }
              }))}
              placeholder="e.g. 35.3606"
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Longitude</label>
            <input
              type="number"
              step="any"
              style={inputStyle}
              value={formData.meta_data.geo?.longitude ?? ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                meta_data: { ...prev.meta_data, geo: { ...prev.meta_data.geo, longitude: e.target.value } }
              }))}
              placeholder="e.g. 138.7274"
            />
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div style={{ ...bottomBarStyle, alignItems: 'center' }}>
        <button 
          type="button"
          style={btnSecondaryStyle}
          onClick={() => router.push('/admin/destinations')}
          disabled={loading}
        >
          Cancel
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {saveMessage && (
            <div style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: saveMessage.type === 'error' ? '#fef2f2' : '#f0fdf4',
              color: saveMessage.type === 'error' ? '#dc2626' : '#16a34a',
              border: `1px solid ${saveMessage.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
              display: 'flex',
              alignItems: 'center',
              animation: 'fadeIn 0.3s ease-in-out'
            }}>
              {saveMessage.text}
            </div>
          )}
          <button 
            type="button"
            style={btnDraftStyle}
            onClick={() => handleSubmit(false)}
            disabled={loading || uploadingImage}
          >
            <Save size={18} />
            Save as Draft
          </button>
          <button 
            type="button"
            style={btnPrimaryStyle}
            onClick={() => handleSubmit(true)}
            disabled={loading || uploadingImage}
          >
            <Send size={18} />
            {uploadingImage ? 'Uploading Image...' : (loading ? 'Saving...' : 'Save & Publish')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DestinationFormPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Loading form...</div>}>
      <DestinationFormContent />
    </Suspense>
  );
}
