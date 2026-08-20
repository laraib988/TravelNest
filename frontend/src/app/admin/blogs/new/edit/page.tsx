'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function AdminBlogNewPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [form, setForm] = useState<any>({
    title: '',
    meta_title: '',
    meta_description: '',
    focus_keywords: [] as string[],
    summary: '',
    content_markdown: '',
    hero_image: '',
    hero_image_alt: '',
    images: [] as { url: string; alt: string }[],
    author_name: 'TravelNest Editorial Team',
    author_bio: '',
    author_avatar: '',
    author_role: 'Contributor',
    author_url: '',
    quick_takeaways: [] as string[],
    itinerary: [] as any[],
    cost_breakdown: [] as any[],
    best_time_to_visit: [] as any[],
    status: 'draft',
  });

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleCreate = async (status: string) => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast('success', status === 'published' ? 'Blog published' : 'Blog created as draft');
      router.push('/admin/blogs');
    } catch (err: any) {
      showToast('error', err.message || 'Create failed');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1',
    fontSize: '0.9rem', color: '#0f172a', background: '#fff', outline: 'none', boxSizing: 'border-box' as const,
  };
  const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 1000,
          display: 'flex', alignItems: 'center', gap: '10px',
          background: toast.type === 'success' ? '#ecfdf5' : '#fef2f2',
          border: `1px solid ${toast.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
          color: toast.type === 'success' ? '#047857' : '#b91c1c',
          padding: '14px 20px', borderRadius: '14px', fontWeight: 600,
          fontSize: '0.9rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          {toast.message}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.push('/admin/blogs')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>New Blog Post</h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>Create a new travel article manually.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => handleCreate('draft')}
            disabled={saving}
            style={{ padding: '12px 20px', borderRadius: '9999px', border: '1px solid #e2e8f0', background: '#fff', color: '#334155', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Save size={16} /> Save Draft
          </button>
          <button
            onClick={() => handleCreate('published')}
            disabled={saving}
            style={{ padding: '12px 24px', borderRadius: '9999px', border: 'none', background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {saving ? <RefreshCw size={16} className="spin" /> : <CheckCircle2 size={16} />}
            {saving ? 'Creating...' : 'Publish'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="admin-stat-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Article Content</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Title *</label>
                <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Summary (card excerpt)</label>
                <textarea style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Focus Keywords (comma separated)</label>
                <input
                  style={inputStyle}
                  value={(form.focus_keywords || []).join(', ')}
                  onChange={(e) => setForm({ ...form, focus_keywords: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })}
                />
              </div>
              <div>
                <label style={labelStyle}>Hero Image URL</label>
                <input style={inputStyle} value={form.hero_image} onChange={(e) => setForm({ ...form, hero_image: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Content (Rich Text) *</label>
                <RichTextEditor
                  value={form.content_markdown || ''}
                  onChange={(md) => setForm({ ...form, content_markdown: md })}
                  placeholder="Start writing your travel guide… Use the toolbar for bold, italic, headings, lists, links, images and more."
                  minHeight="500px"
                />
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
                  Rich text is stored as Markdown and rendered on the public blog page.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="admin-stat-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>SEO</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Meta Title (55-60 chars)</label>
                <input style={inputStyle} value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} />
                <span style={{ fontSize: '0.75rem', color: (form.meta_title || '').length <= 60 ? '#059669' : '#dc2626' }}>
                  {(form.meta_title || '').length}/60 characters
                </span>
              </div>
              <div>
                <label style={labelStyle}>Meta Description (150-155 chars)</label>
                <textarea style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} />
                <span style={{ fontSize: '0.75rem', color: (form.meta_description || '').length <= 160 ? '#059669' : '#dc2626' }}>
                  {(form.meta_description || '').length}/160 characters
                </span>
              </div>
            </div>
          </div>

          <div className="admin-stat-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Author Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Author Name</label>
                <input style={inputStyle} value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Author Role</label>
                <input style={inputStyle} value={form.author_role} onChange={(e) => setForm({ ...form, author_role: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Author Avatar URL</label>
                <input style={inputStyle} value={form.author_avatar} onChange={(e) => setForm({ ...form, author_avatar: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Author Bio</label>
                <textarea style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} value={form.author_bio} onChange={(e) => setForm({ ...form, author_bio: e.target.value })} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}