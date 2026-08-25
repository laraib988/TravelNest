import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Calendar, User, ArrowLeft, CheckCircle2, MapPin } from 'lucide-react';

export const revalidate = 86400; // 24h ISR
export const dynamicParams = true;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const APP_URL = 'https://www.vaitour.com';

async function getBlog(slug: string) {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) {
    console.error('Blog fetch error:', error);
    return null;
  }
  return data;
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from('blogs')
    .select('*')
    .eq('status', 'published')
    .limit(50);
  return (data || []).map((b) => ({ slug: b.slug }));
}

import { headers } from 'next/headers';
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const headersList = await headers();
  const locale = headersList.get('x-locale') || 'en';
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return { title: 'Blog not found' };

  return {
    title: blog.meta_title || blog.title,
    description: blog.meta_description || blog.summary,
    keywords: blog.focus_keywords || [],
    alternates: { 
      canonical: `${APP_URL}/${locale}/blog/${blog.slug}`,
      languages: {
        en: `${APP_URL}/en/blog/${blog.slug}`,
        ja: `${APP_URL}/ja/blog/${blog.slug}`,
        ur: `${APP_URL}/ur/blog/${blog.slug}`,
        fr: `${APP_URL}/fr/blog/${blog.slug}`,
        ar: `${APP_URL}/ar/blog/${blog.slug}`,
        'x-default': `${APP_URL}/en/blog/${blog.slug}`
      }
    },
    openGraph: {
      title: blog.meta_title || blog.title,
      description: blog.meta_description || blog.summary,
      type: 'article',
      url: `${APP_URL}/blog/${blog.slug}`,
      images: blog.hero_image ? [{ url: blog.hero_image, alt: blog.hero_image_alt }] : [],
      authors: [blog.author_name],
      publishedTime: blog.published_at,
    },
  };
}

// Build a Table of Contents from markdown H2/H3 headings.
function buildToC(markdown: string) {
  const toc: { id: string; text: string; level: number }[] = [];
  const re = /^(#{2,3})\s+(.+)$/gm;
  let match: RegExpExecArray | null;
  while ((match = re.exec(markdown))) {
    const level = match[1].length;
    const text = match[2].trim().replace(/[*_`]/g, '');
    toc.push({ id: `heading-${toc.length}`, text, level });
  }
  return toc;
}

// Extract FAQ questions from markdown for display.
function extractFaqs(markdown: string) {
  const faqs: { question: string; answer: string }[] = [];
  const section = markdown.split(/^##\s+FAQs?/im)[1];
  if (!section) return faqs;
  const re = /^\s*[-*]\s+\*\*(.+?)\*\*\s*(.+)$/gm;
  let match: RegExpExecArray | null;
  while ((match = re.exec(section))) {
    faqs.push({ question: match[1].trim(), answer: match[2].trim() });
  }
  return faqs;
}

async function getRelatedDestinations() {
  const { data } = await supabase
    .from('destinations')
    .select('*')
    .eq('is_published', true)
    .limit(3);
  return data || [];
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();

  // Prefer the structured FAQs column (edited by the admin); fall back to
  // extracting them from the markdown body for older articles.
  const structuredFaqs = Array.isArray(blog.faqs)
    ? (blog.faqs as { question: string; answer: string }[]).filter((f) => f?.question && f?.answer)
    : [];
  const faqs = structuredFaqs.length > 0 ? structuredFaqs : extractFaqs(blog.content_markdown || '');

  // Strip extracted/structured sections from markdown to avoid duplicate identical headings
  let cleanMarkdown = blog.content_markdown || '';
  if (blog.quick_takeaways && blog.quick_takeaways.length > 0) {
    cleanMarkdown = cleanMarkdown.replace(/##\s*Quick Takeaways[\s\S]*?(?=##\s|$)/i, '');
  }
  if (faqs.length > 0) {
    cleanMarkdown = cleanMarkdown.replace(/##\s*FAQs?[\s\S]*?(?=##\s|$)/i, '');
    cleanMarkdown = cleanMarkdown.replace(/##\s*Frequently Asked Questions[\s\S]*?(?=##\s|$)/i, '');
  }

  const toc = buildToC(cleanMarkdown);
  const related = await getRelatedDestinations();

  let articleSchema: any = null;
  let faqSchema: any = null;
  try {
    articleSchema = blog.schema_json ? JSON.parse(blog.schema_json) : null;
  } catch (e) {}
  try {
    faqSchema = blog.faq_schema_json ? JSON.parse(blog.faq_schema_json) : null;
  } catch (e) {}

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.vaitour.com/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.vaitour.com/blog' },
      { '@type': 'ListItem', position: 3, name: blog.title, item: `https://www.vaitour.com/blog/${blog.slug}` }
    ]
  };

  const jsonLd = [
    breadcrumbSchema,
    articleSchema && { ...articleSchema, '@context': 'https://schema.org' },
    faqSchema && { ...faqSchema, '@context': 'https://schema.org' },
  ].filter(Boolean);

  const shareUrl = `${APP_URL}/blog/${blog.slug}`;
  const shareText = encodeURIComponent(blog.title);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 80px' }}>
        <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', marginBottom: '24px', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Back to all guides
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 260px', gap: '48px', alignItems: 'start' }}>
          {/* Main column */}
          <article style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '40px', border: '1px solid #e2e8f0' }}>
            {/* Hero */}
            <div style={{ marginBottom: '28px' }}>
              {blog.hero_image && (
                <Image src={blog.hero_image} alt={blog.hero_image_alt || blog.title} style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}  width={100} height={800} />
              )}
              <h1 style={{ fontSize: '2.4rem', color: '#0f172a', lineHeight: 1.2, marginBottom: '16px', fontWeight: 800 }}>
                {blog.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {blog.author_avatar && (
                    <Image src={blog.author_avatar} alt={blog.author_name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}  width={32} height={32} />
                  )}
                  <strong>{blog.author_name}</strong>
                  {blog.author_role && <span>· {blog.author_role}</span>}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} />
                  {blog.published_at ? new Date(blog.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                </span>
              </div>
            </div>

            {/* Quick Takeaways */}
            {blog.quick_takeaways && blog.quick_takeaways.length > 0 && (
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 'var(--radius-md)', padding: '20px 24px', marginBottom: '28px' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0c4a6e', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} /> Quick Takeaways
                </h2>
                <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {blog.quick_takeaways.slice(0, 5).map((item: string, i: number) => (
                    <li key={i} style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.6 }}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Markdown content */}
            <div className="blog-content" style={{ fontSize: '1.02rem', lineHeight: 1.85, color: '#334155' }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: (props) => {
                    const idx = toc.findIndex((t) => t.level === 2 && t.text === String(props.children || '').trim());
                    return <h2 id={`heading-${idx >= 0 ? idx : 0}`} style={{ fontSize: '1.5rem', color: '#0f172a', margin: '36px 0 14px', fontWeight: 800 }} {...props} />;
                  },
                  h3: (props) => <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: '28px 0 12px', fontWeight: 700 }} {...props} />,
                  p: (props) => <p style={{ margin: '0 0 16px' }} {...props} />,
                  a: (props) => <a {...props} style={{ color: 'var(--brand-primary)', fontWeight: 600 }} target={props.href?.startsWith('http') ? '_blank' : undefined} rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined} />,
                  ul: (props) => <ul style={{ paddingLeft: '24px', margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }} {...props} />,
                  ol: (props) => <ol style={{ paddingLeft: '24px', margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }} {...props} />,
                  li: (props) => <li style={{ marginBottom: '4px' }} {...props} />,
                  blockquote: (props) => <blockquote style={{ borderLeft: '4px solid var(--brand-primary)', background: '#f8fafc', padding: '14px 20px', borderRadius: 'var(--radius-sm)', margin: '0 0 16px', color: '#475569' }} {...props} />,
                  table: (props) => <div style={{ overflowX: 'auto', margin: '0 0 20px' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }} {...props} /></div>,
                  th: (props) => <th style={{ border: '1px solid #e2e8f0', padding: '10px 14px', background: '#f1f5f9', textAlign: 'left', fontWeight: 700, color: '#0f172a' }} {...props} />,
                  td: (props) => <td style={{ border: '1px solid #e2e8f0', padding: '10px 14px' }} {...props} />,
                }}
              >
                {cleanMarkdown}
              </ReactMarkdown>
            </div>

            {/* Rendered FAQs (admin-editable, mirrors the FAQPage schema) */}
            {faqs.length > 0 && (
              <div style={{ marginTop: '32px', borderTop: '1px solid #e2e8f0', paddingTop: '28px' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: '0 0 20px' }}>
                  Frequently Asked Questions
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {faqs.map((faq, i) => (
                    <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '18px 20px' }}>
                      <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>{faq.question}</h3>
                      <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.7, margin: 0 }}>{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* ToC */}
            {toc.length > 0 && (
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                  On This Page
                </p>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {toc.filter((t) => t.level === 2).map((t) => (
                    <a key={t.id} href={`#${t.id}`} style={{ fontSize: '0.85rem', color: '#475569', textDecoration: 'none', padding: '4px 0', borderBottom: '1px solid #f1f5f9', transition: 'color 0.15s' }}>
                      {t.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Share */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '20px' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                Share This Guide
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', textDecoration: 'none', background: '#f8fafc' }}>X</a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', textDecoration: 'none', background: '#f8fafc' }}>FB</a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', textDecoration: 'none', background: '#f8fafc' }}>In</a>
              </div>
            </div>

            {/* Author bio */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                {blog.author_avatar && (
                  <Image src={blog.author_avatar} alt={blog.author_name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }}  width={56} height={56} />
                )}
                <div>
                  <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{blog.author_name}</p>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{blog.author_role}</span>
                </div>
              </div>
              {blog.author_bio && (
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>{blog.author_bio}</p>
              )}
            </div>
          </aside>
        </div>

        {/* Related destinations */}
        {related.length > 0 && (
          <div style={{ marginTop: '56px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
              Explore These Destinations
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {related.map((d: any) => (
                <Link key={d.id} href={`/destinations/${d.slug}`} className="card-panel card-interactive" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '160px', position: 'relative' }}>
                    {d.hero_image ? (
                      <Image src={d.hero_image} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}  width={100} height={100} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0f172a, #334155)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MapPin size={32} color="rgba(255,255,255,0.3)" />
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '18px' }}>
                    <p style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px', marginTop: 0 }}>{d.name}</p>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{d.country}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}