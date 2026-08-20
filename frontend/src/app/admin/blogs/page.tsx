'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Newspaper, Plus, Edit, Trash2, Eye, EyeOff, RefreshCw, AlertCircle, Sparkles, CheckCircle2, XCircle, PenLine } from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  slug: string;
  status: string;
  hero_image: string;
  summary: string;
  focus_keywords: string[];
  author_name: string;
  created_at: string;
  published_at: string | null;
}

export default function AdminBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/blogs', { cache: 'no-store' });
      const data = await res.json();
      setBlogs(data.data || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      showToast('error', 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!window.confirm('Generate a new AI draft blog article? It will be saved as a draft for review.')) return;
    try {
      setGenerating(true);
      const res = await fetch('/api/cron/daily-blog', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.results?.[0]?.success) {
        showToast('success', 'AI draft generated successfully');
        await fetchBlogs();
      } else {
        showToast('error', data.results?.[0]?.error || data.error || 'Generation failed');
      }
    } catch (err) {
      showToast('error', 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async (blog: Blog, publish: boolean) => {
    try {
      const res = await fetch('/api/admin/blogs/' + blog.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: blog.title,
          slug: blog.slug,
          status: publish ? 'published' : 'draft',
          meta_title: (blog as any).meta_title || '',
          meta_description: (blog as any).meta_description || '',
          focus_keywords: blog.focus_keywords || [],
          summary: blog.summary || '',
          content_markdown: (blog as any).content_markdown || '',
          hero_image: blog.hero_image || '',
          hero_image_alt: (blog as any).hero_image_alt || '',
          images: (blog as any).images || [],
          author_name: blog.author_name || '',
          author_bio: (blog as any).author_bio || '',
          author_avatar: (blog as any).author_avatar || '',
          author_role: (blog as any).author_role || '',
          author_url: (blog as any).author_url || '',
          schema_json: (blog as any).schema_json || '',
          faq_schema_json: (blog as any).faq_schema_json || '',
          quick_takeaways: (blog as any).quick_takeaways || [],
          itinerary: (blog as any).itinerary || [],
          cost_breakdown: (blog as any).cost_breakdown || [],
          best_time_to_visit: (blog as any).best_time_to_visit || [],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast('success', publish ? 'Blog published' : 'Blog moved to drafts');
      await fetchBlogs();
    } catch (err: any) {
      showToast('error', err.message || 'Update failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await fetch('/api/admin/blogs/' + id, { method: 'DELETE' });
      setBlogs(blogs.filter(b => b.id !== id));
      showToast('success', 'Blog deleted');
    } catch (err) {
      showToast('error', 'Error deleting blog');
    }
  };

  const totalBlogs = blogs.length;
  const publishedCount = blogs.filter(b => b.status === 'published').length;
  const draftCount = totalBlogs - publishedCount;

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <RefreshCw size={48} color="#0284c7" className="animate-pulse-glow" />
        <p style={{ color: '#475569', marginTop: '16px', fontWeight: 600 }}>Loading blogs...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Toast */}
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

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Blog Management
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
            Review, approve, and manage AI-generated travel articles.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '9999px', fontWeight: 700, background: generating ? '#93c5fd' : 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)', border: 'none', color: '#fff', cursor: 'pointer' }}
          >
            {generating ? <RefreshCw size={18} className="spin" /> : <Sparkles size={18} />}
            {generating ? 'Generating...' : 'Generate with AI'}
          </button>
          <button
            onClick={() => router.push('/admin/blogs/new')}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '9999px', fontWeight: 700 }}
          >
            <PenLine size={18} /> Write Manually
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Total Blogs</div>
              <div className="admin-stat-value">{totalBlogs}</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' }}>
              <Newspaper size={24} />
            </div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Published</div>
              <div className="admin-stat-value" style={{ color: '#059669' }}>{publishedCount}</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}>
              <Eye size={24} />
            </div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Drafts</div>
              <div className="admin-stat-value" style={{ color: '#d97706' }}>{draftCount}</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' }}>
              <EyeOff size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Blogs Grid */}
      {blogs.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '24px', border: '1px dashed #cbd5e1', padding: '80px 40px', textAlign: 'center' }}>
          <Newspaper size={64} color="#94a3b8" style={{ margin: '0 auto 20px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>No Blogs Yet</h3>
          <p style={{ color: '#64748b', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
            Generate your first AI-powered travel article or create one manually.
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="btn-primary"
            style={{ padding: '12px 32px', borderRadius: '9999px', fontWeight: 700 }}
          >
            <Sparkles size={16} /> {generating ? 'Generating...' : 'Generate First Blog'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {blogs.map((blog) => (
            <div key={blog.id} style={{
              background: '#ffffff',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
            >
              {/* Image Header */}
              <div style={{ height: '190px', position: 'relative', overflow: 'hidden' }}>
                {blog.hero_image ? (
                  <img src={blog.hero_image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Newspaper size={40} color="rgba(255,255,255,0.2)" />
                  </div>
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 40%)' }}></div>

                {/* Status Badge */}
                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  <div style={{
                    background: blog.status === 'published' ? 'rgba(22, 101, 52, 0.9)' : 'rgba(71, 85, 105, 0.9)',
                    backdropFilter: 'blur(4px)',
                    color: '#ffffff',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {blog.status === 'published'
                      ? <><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }}></div> Published</>
                      : <><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#cbd5e1' }}></div> Draft</>}
                  </div>
                </div>

                <div style={{
                  position: 'absolute', top: '16px', right: '16px',
                  background: 'rgba(255,255,255,0.95)',
                  color: '#0f172a',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {blog.author_name}
                </div>
              </div>

              {/* Content Body */}
              <div style={{ padding: '22px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', fontFamily: "'Outfit', sans-serif", lineHeight: 1.3 }}>{blog.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {blog.summary || blog.slug}
                </p>

                {blog.focus_keywords && blog.focus_keywords.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {blog.focus_keywords.slice(0, 3).map((kw, i) => (
                      <span key={i} style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600 }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                  <button
                    onClick={() => router.push('/admin/blogs/' + blog.id + '/edit')}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0',
                      background: '#f8fafc', color: '#334155', cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handlePublish(blog, blog.status !== 'published')}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '12px', border: 'none',
                      background: blog.status === 'published' ? '#fff1f2' : '#f0fdf4',
                      color: blog.status === 'published' ? '#be123c' : '#15803d',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '6px', fontSize: '0.85rem', fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.opacity = '0.8'; }}
                    onMouseOut={(e) => { e.currentTarget.style.opacity = '1'; }}
                  >
                    {blog.status === 'published' ? <><EyeOff size={16} /> Unpublish</> : <><CheckCircle2 size={16} /> Approve & Publish</>}
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    style={{
                      padding: '10px 14px', borderRadius: '12px', border: '1px solid #fee2e2',
                      background: '#ffffff', color: '#ef4444', cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = '#ffffff'; }}
                    title="Delete Blog"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}