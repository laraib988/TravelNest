export const revalidate = 0; // Ensure sitemap is dynamically generated to include new blogs automatically

import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.vaitour.com';
  const locales = ['en', 'ja', 'ur', 'fr', 'ar'];

  // 1. Static Pages
  const staticPages = [
    '', '/ai-planner', '/blog', '/about', '/contact', '/faq', 
    '/privacy', '/terms', '/cancellation-policy', '/refund-policy'
  ];
  
  const { data: dests } = await supabase
    .from('destinations')
    .select('slug')
    .eq('is_published', true);
    
  const destinationUrls = (dests || []).map(d => `/destinations/${d.slug}`);
  const basePages = [...staticPages, ...destinationUrls];
  
  const staticUrls = basePages.flatMap((page) => 
    locales.map((locale) => {
      const url = `${baseUrl}/${locale}${page}`;
      return {
        url,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}${page}`])
          ),
        },
      };
    })
  );

  // 2. Blogs
  const { data: blogs } = await supabase
    .from('blogs')
    .select('slug, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const blogUrls = (blogs || []).flatMap(blog => 
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/blog/${blog.slug}`,
      lastModified: new Date(blog.published_at || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}/blog/${blog.slug}`])
        ),
      },
    }))
  );

  // 3. Tours
  const { data: verifiedKyc } = await supabase
    .from('supplier_kyc_records')
    .select('user_id')
    .eq('status', 'VERIFIED');
    
  const verifiedIds = (verifiedKyc || []).map(k => k.user_id);
  
  let tourUrls: any[] = [];
  if (verifiedIds.length > 0) {
    const { data: tours } = await supabase
      .from('products')
      .select('slug, updated_at')
      .eq('status', 'PUBLISHED')
      .in('supplier_id', verifiedIds);
      
    tourUrls = (tours || []).flatMap((tour) =>
      locales.map((locale) => ({
        url: `${baseUrl}/${locale}/tours/${tour.slug}`,
        lastModified: new Date(tour.updated_at),
        changeFrequency: 'daily' as const,
        priority: 0.9,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}/tours/${tour.slug}`])
          ),
        },
      }))
    );
  }

  return [...staticUrls, ...blogUrls, ...tourUrls];
}
