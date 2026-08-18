import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const dynamic = 'force-dynamic';

const stripBase64 = (obj: any): any => {
  if (typeof obj === 'string' && obj.startsWith('data:image/')) return '';
  if (Array.isArray(obj)) return obj.map(stripBase64);
  if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) newObj[key] = stripBase64(obj[key]);
    return newObj;
  }
  return obj;
};

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();

    const updates: any = { updated_at: new Date().toISOString() };
    const allowedFields = [
      'name', 'slug', 'country', 'country_code', 'hero_image', 'description',
      'best_points', 'trending_places', 'faqs', 'gallery', 'itinerary',
      'best_time_to_visit', 'popular_activities_count', 'is_published'
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) updates[field] = body[field];
    });

    // Auto-generate slug if name changed but slug wasn't explicitly provided
    if (body.name && !body.slug) {
      updates.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const sanitized = stripBase64(updates);

    let { data, error } = await supabase
      .from('destinations')
      .update(sanitized)
      .eq('id', id)
      .select()
      .maybeSingle();

    // If best_time_to_visit column doesn't exist in DB, retry without it
    if (error && (error.message?.includes('best_time_to_visit') || error.message?.includes('schema cache'))) {
      console.warn('best_time_to_visit column not found, retrying without it...');
      const { best_time_to_visit, ...withoutBttv } = sanitized;
      const retry = await supabase
        .from('destinations')
        .update(withoutBttv)
        .eq('id', id)
        .select()
        .maybeSingle();
      data = retry.data;
      error = retry.error;
    }

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: 'Destination not found with this ID.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error updating destination:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const { error } = await supabase
      .from('destinations')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting destination:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
