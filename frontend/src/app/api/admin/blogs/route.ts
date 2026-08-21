import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const dynamic = 'force-dynamic';

// Build a valid FAQPage JSON-LD schema from structured FAQ entries.
function buildFaqSchema(faqs: { question?: string; answer?: string }[]): string {
  const valid = (faqs || []).filter((f) => f?.question?.trim() && f?.answer?.trim());
  if (valid.length === 0) return '';
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: valid.map((f) => ({
      '@type': 'Question',
      name: f.question!.trim(),
      acceptedAnswer: { '@type': 'Answer', text: f.answer!.trim() },
    })),
  });
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: error.message, data: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const slug =
      body.slug ||
      (body.title || 'untitled')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const blog: any = {
      title: body.title,
      slug,
      meta_title: body.meta_title || '',
      meta_description: body.meta_description || '',
      focus_keywords: body.focus_keywords || [],
      summary: body.summary || '',
      content_markdown: body.content_markdown || '',
      hero_image: body.hero_image || '',
      hero_image_alt: body.hero_image_alt || '',
      images: body.images || [],
      author_name: body.author_name || 'TravelNest Editorial Team',
      author_bio: body.author_bio || '',
      author_avatar: body.author_avatar || '',
      author_role: body.author_role || 'Contributor',
      author_url: body.author_url || '',
      schema_json: body.schema_json || '',
      faq_schema_json: body.faq_schema_json || '',
      faqs: body.faqs || [],
      quick_takeaways: body.quick_takeaways || [],
      itinerary: body.itinerary || [],
      cost_breakdown: body.cost_breakdown || [],
      best_time_to_visit: body.best_time_to_visit || [],
      status: body.status || 'draft',
      published_at: body.status === 'published' ? new Date().toISOString() : null,
    };

    // Auto-generate the FAQPage schema from the structured FAQ entries if the
    // client did not already supply one.
    if (!blog.faq_schema_json && blog.faqs.length > 0) {
      blog.faq_schema_json = buildFaqSchema(blog.faqs);
    }

    // Ensure unique slug.
    const { data: existing } = await supabase
      .from('blogs')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();
    if (existing) blog.slug = `${slug}-${Date.now()}`;

    const { data, error } = await supabase.from('blogs').insert(blog).select().maybeSingle();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}