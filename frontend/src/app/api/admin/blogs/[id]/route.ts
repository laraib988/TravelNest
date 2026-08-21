import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

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

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { data, error } = await getSupabase().from('blogs').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Normalize published_at: set on publish transition, clear on unpublish.
    const current = await getSupabase().from('blogs').select('status').eq('id', id).maybeSingle();
    const currentStatus = current.data?.status;

    let published_at: string | null = undefined;
    if (body.status === 'published' && currentStatus !== 'published') {
      published_at = new Date().toISOString();
    } else if (body.status !== 'published' && currentStatus === 'published') {
      published_at = null;
    }

    const updatePayload: any = {
      title: body.title,
      slug: body.slug,
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
    };
    if (published_at !== undefined) updatePayload.published_at = published_at;

    // Auto-generate the FAQPage schema from the structured FAQ entries if the
    // client did not already supply one.
    if (!updatePayload.faq_schema_json && updatePayload.faqs.length > 0) {
      updatePayload.faq_schema_json = buildFaqSchema(updatePayload.faqs);
    }

    // Ensure unique slug (exclude self).
    const { data: existing } = await getSupabase()
      .from('blogs')
      .select('id')
      .eq('slug', updatePayload.slug)
      .neq('id', id)
      .maybeSingle();
    if (existing) updatePayload.slug = `${updatePayload.slug}-${Date.now()}`;

    const { data, error } = await getSupabase()
      .from('blogs')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { error } = await getSupabase().from('blogs').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}