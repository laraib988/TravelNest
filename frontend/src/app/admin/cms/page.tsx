'use client';

import React, { useState } from 'react';
import {
  FileText, Sparkles, Plus, Edit2, Trash2, Eye, Globe,
  CheckCircle2, Tag, Layers, HelpCircle, X, Search, RefreshCw, Check, AlertCircle, PowerOff
} from 'lucide-react';

interface CMSArticle {
  id: string;
  title: string;
  category: string;
  author: string;
  published_at: string;
  status: 'PUBLISHED' | 'DRAFT';
  views: number;
  summary: string;
}

interface Banner {
  id: string;
  title: string;
  headline: string;
  cta_text: string;
  link_url: string;
  status: 'ACTIVE' | 'INACTIVE';
  target_page: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState<'articles' | 'banners' | 'faqs'>('articles');
  const [search, setSearch] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Articles State
  const [articles, setArticles] = useState<CMSArticle[]>([
    { id: 'art-1', title: 'Top 10 Hidden Gems in Walled City Lahore', category: 'Culture & Heritage', author: 'Suneel Pirkash', published_at: '2026-08-05', status: 'PUBLISHED', views: 3420, summary: 'Discover ancient havelis, royal bathhouses, and traditional street food in Lahore.' },
    { id: 'art-2', title: 'Ultimate Bali Catamaran & Snorkeling Guide', category: 'Outdoor Adventures', author: 'TravelNest Team', published_at: '2026-08-02', status: 'PUBLISHED', views: 5890, summary: 'Complete guide for luxury catamaran cruises around Nusa Penida and Lembongan.' },
    { id: 'art-3', title: 'Tokyo Neon Night Food Walks: What to Expect', category: 'Food & Dining', author: 'Ayesha Khan', published_at: '2026-07-28', status: 'PUBLISHED', views: 4120, summary: 'Explore Shinjuku and Omoide Yokocho with local culinary experts.' },
    { id: 'art-4', title: 'Safety Tips for Solo Backpackers in Skardu', category: 'Travel Advice', author: 'TravelNest Team', published_at: '2026-07-20', status: 'DRAFT', views: 0, summary: 'Essential packing list, altitude guide, and trekking permits for Gilgit-Baltistan.' },
  ]);

  // Banners State
  const [banners, setBanners] = useState<Banner[]>([
    { id: 'ban-1', title: 'Summer Flash Sale', headline: '⚡ Flash Sale: Get 15% off Bali & Tokyo Experiences with code TRAVELNEST2026', cta_text: 'Claim Offer', link_url: '/listings?promo=TRAVELNEST2026', status: 'ACTIVE', target_page: 'Global Header Bar' },
    { id: 'ban-2', title: 'Lahore Heritage Special', headline: '🕌 Explore Walled City Lahore Tours with Certified Historian Guides', cta_text: 'Book Heritage Tour', link_url: '/listings?cat=heritage', status: 'ACTIVE', target_page: 'Homepage Hero Section' },
  ]);

  // FAQs State
  const [faqs, setFaqs] = useState<FAQItem[]>([
    { id: 'faq-1', question: 'How do I receive my instant QR booking voucher?', answer: 'Once your payment is authorized, your digital QR voucher is instantly generated and delivered via email and in your My Bookings dashboard.', category: 'Bookings & Vouchers' },
    { id: 'faq-2', question: 'What is the cancellation and refund policy?', answer: 'Free cancellations are supported up to 24 hours before tour start time for 100% full refund.', category: 'Cancellations & Refunds' },
    { id: 'faq-3', question: 'How do verified suppliers receive payouts?', answer: 'Supplier commission payouts are automatically processed every Monday via direct bank wire or Stripe Express ledger.', category: 'Supplier Earnings' },
  ]);

  // Modal Control States
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<CMSArticle | null>(null);
  const [articleForm, setArticleForm] = useState({ title: '', category: 'Culture & Heritage', author: 'TravelNest Team', summary: '', status: 'PUBLISHED' as 'PUBLISHED' | 'DRAFT' });

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [bannerForm, setBannerForm] = useState({ title: '', headline: '', cta_text: 'Explore Now', link_url: '/listings' });

  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: 'General Questions' });

  const triggerAction = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // Article Action Handlers
  const handleDeleteArticle = (id: string, title: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    triggerAction(`Article "${title}" deleted successfully!`);
  };

  const handleToggleArticleStatus = (id: string, currentStatus: string, title: string) => {
    const nextStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: nextStatus as any } : a))
    );
    triggerAction(`Article "${title}" status set to ${nextStatus}!`);
  };

  // Banner Action Handlers
  const handleToggleBannerStatus = (id: string, currentStatus: string, title: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: nextStatus as any } : b))
    );
    triggerAction(`Banner "${title}" status set to ${nextStatus}!`);
  };

  const handleDeleteBanner = (id: string, title: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    triggerAction(`Banner "${title}" removed!`);
  };

  // FAQ Action Handlers
  const handleDeleteFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    triggerAction('FAQ item removed from knowledgebase!');
  };

  // Filtered queries
  const filteredArticles = articles.filter(
    (a) => a.title.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredBanners = banners.filter(
    (b) => b.title.toLowerCase().includes(search.toLowerCase()) || b.headline.toLowerCase().includes(search.toLowerCase())
  );

  const filteredFaqs = faqs.filter(
    (f) => f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Content Management System (CMS)
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
            Publish travel journal blogs, hero announcement banners, and customer FAQ knowledgebase.
          </p>
        </div>

        {/* Dynamic Add Content Button */}
        <button
          style={{
            padding: '10px 20px',
            fontSize: '0.88rem',
            fontWeight: 800,
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)'
          }}
          onClick={() => {
            if (activeTab === 'articles') setIsArticleModalOpen(true);
            else if (activeTab === 'banners') setIsBannerModalOpen(true);
            else setIsFaqModalOpen(true);
          }}
        >
          <Plus size={18} />
          {activeTab === 'articles' ? 'Create Article' : activeTab === 'banners' ? 'Add Announcement Banner' : 'Add FAQ Question'}
        </button>
      </div>

      {actionSuccess && (
        <div style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '14px 24px', borderRadius: '14px', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 16px rgba(16, 185, 129, 0.15)' }}>
          <CheckCircle2 size={20} color="#10b981" /> {actionSuccess}
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div className="admin-filter-bar" style={{ margin: 0 }}>
          <button
            className={`admin-filter-tab ${activeTab === 'articles' ? 'active' : ''}`}
            onClick={() => setActiveTab('articles')}
          >
            <FileText size={15} /> Travel Journal Articles ({articles.length})
          </button>

          <button
            className={`admin-filter-tab ${activeTab === 'banners' ? 'active' : ''}`}
            onClick={() => setActiveTab('banners')}
          >
            <Sparkles size={15} /> Announcement Banners ({banners.length})
          </button>

          <button
            className={`admin-filter-tab ${activeTab === 'faqs' ? 'active' : ''}`}
            onClick={() => setActiveTab('faqs')}
          >
            <HelpCircle size={15} /> Platform FAQs ({faqs.length})
          </button>
        </div>

        <div className="admin-search">
          <Search className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search content, titles or FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 1. ARTICLES TAB */}
      {activeTab === 'articles' && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Article Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Published Date</th>
                <th>Views</th>
                <th>Status</th>
                <th style={{ textAlign: 'center', background: '#f0f9ff', color: '#0284c7', fontWeight: 800 }}>⚙️ Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((art) => (
                <tr key={art.id}>
                  <td>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>{art.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>{art.summary}</div>
                  </td>
                  <td>
                    <span className="badge-purple">{art.category}</span>
                  </td>
                  <td style={{ color: '#334155', fontWeight: 700, fontSize: '0.84rem' }}>{art.author}</td>
                  <td style={{ color: '#64748b', fontSize: '0.84rem' }}>{art.published_at}</td>
                  <td style={{ fontWeight: 800, color: '#0284c7' }}>{art.views.toLocaleString()} views</td>
                  <td>
                    <span className={`admin-badge ${art.status === 'PUBLISHED' ? 'admin-badge--published' : 'admin-badge--draft'}`}>
                      {art.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <button
                        style={{
                          padding: '6px 14px',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          borderRadius: '9999px',
                          background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                          color: '#ffffff',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        onClick={() => {
                          setEditingArticle(art);
                          setArticleForm({
                            title: art.title,
                            category: art.category,
                            author: art.author,
                            summary: art.summary,
                            status: art.status
                          });
                        }}
                      >
                        <Edit2 size={13} color="#ffffff" /> Edit
                      </button>

                      <button
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          borderRadius: '9999px',
                          background: art.status === 'PUBLISHED' ? '#fff1f2' : '#ecfdf5',
                          color: art.status === 'PUBLISHED' ? '#e11d48' : '#047857',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        onClick={() => handleToggleArticleStatus(art.id, art.status, art.title)}
                      >
                        <PowerOff size={13} />
                      </button>

                      <button
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          borderRadius: '9999px',
                          background: '#fff1f2',
                          color: '#e11d48',
                          border: '1px solid #fecdd3',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        onClick={() => handleDeleteArticle(art.id, art.title)}
                        title="Delete Article"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. BANNERS TAB */}
      {activeTab === 'banners' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {filteredBanners.map((b) => (
            <div
              key={b.id}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 4px 20px -2px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span className={`admin-badge ${b.status === 'ACTIVE' ? 'admin-badge--confirmed' : 'admin-badge--draft'}`}>
                    {b.status}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>
                    Target: {b.target_page}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  {b.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  "{b.headline}"
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <span className="code-ref" style={{ fontSize: '0.78rem' }}>CTA: {b.cta_text}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    style={{
                      padding: '6px 14px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      borderRadius: '9999px',
                      background: b.status === 'ACTIVE' ? '#fff1f2' : '#ecfdf5',
                      color: b.status === 'ACTIVE' ? '#e11d48' : '#047857',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleToggleBannerStatus(b.id, b.status, b.title)}
                  >
                    {b.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                  </button>

                  <button
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.82rem',
                      borderRadius: '9999px',
                      background: '#fff1f2',
                      color: '#e11d48',
                      border: '1px solid #fecdd3',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleDeleteBanner(b.id, b.title)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* 3. FAQS TAB */}
      {activeTab === 'faqs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredFaqs.map((f) => (
            <div
              key={f.id}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 4px 20px -2px rgba(0,0,0,0.04)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '20px'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span className="badge-blue" style={{ fontSize: '0.78rem' }}>{f.category}</span>
                  <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#0f172a' }}>{f.question}</h3>
                </div>
                <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                  {f.answer}
                </p>
              </div>

              <button
                style={{
                  padding: '8px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  borderRadius: '9999px',
                  background: '#fff1f2',
                  color: '#e11d48',
                  border: '1px solid #fecdd3',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onClick={() => handleDeleteFaq(f.id)}
              >
                <Trash2 size={14} /> Remove FAQ
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Article Modal */}
      {(isArticleModalOpen || editingArticle) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '580px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                {editingArticle ? 'Edit Article' : 'Create Travel Journal Article'}
              </h3>
              <button onClick={() => { setIsArticleModalOpen(false); setEditingArticle(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingArticle) {
                setArticles((prev) =>
                  prev.map((a) => (a.id === editingArticle.id ? { ...a, ...articleForm } : a))
                );
                triggerAction(`Article "${articleForm.title}" updated!`);
              } else {
                const newArt: CMSArticle = {
                  id: `art-${Date.now()}`,
                  title: articleForm.title,
                  category: articleForm.category,
                  author: articleForm.author,
                  published_at: new Date().toISOString().slice(0, 10),
                  status: articleForm.status as 'PUBLISHED' | 'DRAFT',
                  views: 1,
                  summary: articleForm.summary
                };
                setArticles([newArt, ...articles]);
                triggerAction(`New Article Published: "${articleForm.title}"!`);
              }
              setIsArticleModalOpen(false);
              setEditingArticle(null);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '4px', display: 'block' }}>Article Title *</label>
                <input
                  type="text"
                  required
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '4px', display: 'block' }}>Category *</label>
                  <input
                    type="text"
                    required
                    value={articleForm.category}
                    onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '4px', display: 'block' }}>Author Name *</label>
                  <input
                    type="text"
                    required
                    value={articleForm.author}
                    onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '4px', display: 'block' }}>Content Summary</label>
                <textarea
                  rows={3}
                  value={articleForm.summary}
                  onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => { setIsArticleModalOpen(false); setEditingArticle(null); }} style={{ flex: 1, justifyContent: 'center', padding: '12px' }}>
                  Cancel
                </button>
                <button type="submit" style={{ flex: 1.5, padding: '12px', borderRadius: '9999px', background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)', color: '#ffffff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                  Save Article
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Create Banner Modal */}
      {isBannerModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '520px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Add Announcement Banner</h3>
              <button onClick={() => setIsBannerModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const newBan: Banner = {
                id: `ban-${Date.now()}`,
                title: bannerForm.title || 'New Flash Sale Banner',
                headline: bannerForm.headline || '⚡ Limited Time Offer: Save 20% on tours',
                cta_text: bannerForm.cta_text,
                link_url: bannerForm.link_url,
                status: 'ACTIVE',
                target_page: 'Global Header'
              };
              setBanners([newBan, ...banners]);
              triggerAction('New Announcement Banner Published!');
              setIsBannerModalOpen(false);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '4px', display: 'block' }}>Banner Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Promo Top Bar"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '4px', display: 'block' }}>Headline Text *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ⚡ Flash Sale: Get 15% off with code..."
                  value={bannerForm.headline}
                  onChange={(e) => setBannerForm({ ...bannerForm, headline: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsBannerModalOpen(false)} style={{ flex: 1, justifyContent: 'center', padding: '12px' }}>
                  Cancel
                </button>
                <button type="submit" style={{ flex: 1.5, padding: '12px', borderRadius: '9999px', background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)', color: '#ffffff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                  Publish Banner
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Create FAQ Modal */}
      {isFaqModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '540px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Add FAQ Question</h3>
              <button onClick={() => setIsFaqModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const newFaq: FAQItem = {
                id: `faq-${Date.now()}`,
                question: faqForm.question,
                answer: faqForm.answer,
                category: faqForm.category
              };
              setFaqs([...faqs, newFaq]);
              triggerAction('New FAQ question added to knowledgebase!');
              setIsFaqModalOpen(false);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '4px', display: 'block' }}>Category</label>
                <input
                  type="text"
                  required
                  value={faqForm.category}
                  onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '4px', display: 'block' }}>Question *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How do I request a refund?"
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '4px', display: 'block' }}>Answer Summary *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed answer explanation..."
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsFaqModalOpen(false)} style={{ flex: 1, justifyContent: 'center', padding: '12px' }}>
                  Cancel
                </button>
                <button type="submit" style={{ flex: 1.5, padding: '12px', borderRadius: '9999px', background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)', color: '#ffffff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                  Add FAQ
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
