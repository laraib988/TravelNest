import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }];
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.vaitour.com';
  const locales = ['en', 'ja', 'ur', 'fr', 'ar'];

  if (id === 0) {
    const staticPages = [
      '', '/ai-planner', '/blog', '/about', '/contact', '/faq', 
      '/privacy', '/terms', '/cancellation-policy', '/refund-policy'
    ];
    
    const destinations = ['bali', 'tokyo', 'paris', 'lahore', 'dubai', 'rome', 'karachi', 'islamabad'];
    const pages = [...staticPages, ...destinations.map(d => `/destinations/${d}`)];
    
    return pages.flatMap((page) => 
      locales.map((locale) => {
        const url = `${baseUrl}/${locale}${page}`;
        return {
          url,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: page === '' ? 1.0 : 0.8,
          alternates: {
            languages: Object.fromEntries(
              locales.map((l) => [l, `${baseUrl}/${l}${page}`])
            ),
          },
        };
      })
    );
  }

  if (id === 1) {
    const { data: blogs } = await supabase
      .from('blogs')
      .select('slug, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    return (blogs || []).flatMap(blog => 
      locales.map((locale) => ({
        url: `${baseUrl}/${locale}/blog/${blog.slug}`,
        lastModified: new Date(blog.published_at || new Date()),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}/blog/${blog.slug}`])
          ),
        },
      }))
    );
  }

  if (id === 2) {
    const { data: verifiedKyc } = await supabase
      .from('supplier_kyc_records')
      .select('user_id')
      .eq('status', 'VERIFIED');
      
    const verifiedIds = (verifiedKyc || []).map(k => k.user_id);
    
    let tours: any[] = [];
    if (verifiedIds.length > 0) {
      const { data } = await supabase
        .from('products')
        .select('slug, updated_at')
        .eq('status', 'PUBLISHED')
        .in('supplier_id', verifiedIds);
      tours = data || [];
    }

    return tours.flatMap((tour) =>
      locales.map((locale) => ({
        url: `${baseUrl}/${locale}/tours/${tour.slug}`,
        lastModified: new Date(tour.updated_at),
        changeFrequency: 'daily',
        priority: 0.9,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}/tours/${tour.slug}`])
          ),
        },
      }))
    );
  }

  return [];
}
