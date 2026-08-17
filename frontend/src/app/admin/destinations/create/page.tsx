'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, Save, Send, Plus, Trash2, 
  MapPin, Image as ImageIcon, HelpCircle, Map, Camera, Route 
} from 'lucide-react';

function DestinationFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [saveMessage, setSaveMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    country: '',
    country_code: '',
    description: '',
    hero_image: '',
    best_points: [{ title: '', description: '' }],
    trending_places: [{ name: '', image: '', description: '' }],
    faqs: [{ question: '', answer: '' }],
    gallery: [{ image: '', caption: '' }],
    itinerary: [{ title: '', description: '', image: '' }],
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
              best_points: dest.best_points?.length ? dest.best_points : [{ title: '', description: '' }],
              trending_places: dest.trending_places?.length ? dest.trending_places : [{ name: '', image: '', description: '' }],
              faqs: dest.faqs?.length ? dest.faqs : [{ question: '', answer: '' }],
              gallery: dest.gallery?.length ? dest.gallery : [{ image: '', caption: '' }],
              itinerary: dest.itinerary?.length ? dest.itinerary : [{ title: '', description: '', image: '' }],
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string, index?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (index !== undefined) {
          handleArrayChange(field as any, index, 'image', base64String);
        } else {
          setFormData(prev => ({ ...prev, [field]: base64String }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addArrayItem = (field: string, emptyItem: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev as any)[field], emptyItem]
    }));
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
      const dataToSubmit = { ...formData, is_published: isPublished };
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
              <img src={formData.hero_image} alt="Hero Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                {item.image ? (
                  <img src={item.image} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                      value={item.image} 
                      onChange={(e) => handleArrayChange('gallery', index, 'image', e.target.value)} 
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
        <button style={addBtnStyle} onClick={() => addArrayItem('gallery', { image: '', caption: '' })}>
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
            disabled={loading}
          >
            <Save size={18} />
            Save as Draft
          </button>
          <button 
            type="button"
            style={btnPrimaryStyle}
            onClick={() => handleSubmit(true)}
            disabled={loading}
          >
            <Send size={18} />
            {loading ? 'Saving...' : 'Save & Publish'}
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
