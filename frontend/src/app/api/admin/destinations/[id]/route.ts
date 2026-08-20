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
      'meta_title', 'meta_description',
      'best_points', 'highlights', 'trending_places', 'faqs', 'gallery', 'itinerary',
      'best_time_to_visit', 'meta_data', 'popular_activities_count', 'is_published'
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) updates[field] = body[field];
    });

    // Clean highlights to only non-empty strings
    if (body.highlights !== undefined) {
      updates.highlights = (body.highlights || []).filter((h: any) => typeof h === 'string' && h.trim() !== '');
    }

    // Auto-generate slug if name changed but slug wasn't explicitly provided
    if (body.name && !body.slug) {
      updates.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    // If meta_data exists, inject it as a hidden FAQ
    if (body.meta_data) {
      const currentFaqs = body.faqs || [];
      // Remove any existing hidden FAQ first
      const cleanFaqs = currentFaqs.filter((f: any) => f.question !== '__META_DATA__');
      cleanFaqs.push({
        question: '__META_DATA__',
        answer: JSON.stringify(body.meta_data)
      });
      updates.faqs = cleanFaqs;
      delete updates.meta_data;
    }

    const sanitized = stripBase64(updates);

    let { data, error } = await supabase
      .from('destinations')
      .update(sanitized)
      .eq('id', id)
      .select()
      .maybeSingle();

    // Smart Retry loop for missing schema columns (e.g. best_time_to_visit, highlights)
    const MISSING_COLUMN_MAP: Record<string, string> = {
      best_time_to_visit: 'best_time_to_visit',
      highlights: 'highlights',
      meta_title: 'meta_title',
      meta_description: 'meta_description',
    };

    let attempts = 0;
    let updatePayload = sanitized;
    while (attempts < 6) {
      const updateRes = await supabase
        .from('destinations')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .maybeSingle();
      data = updateRes.data;
      error = updateRes.error;

      if (!error) {
        break;
      }

      if (error.message?.includes('schema cache') || error.message?.includes('Could not find the')) {
        const missing = Object.keys(MISSING_COLUMN_MAP).find((key) =>
          error.message?.includes(`'${key}'`) || error.message?.includes(key)
        );
        if (missing) {
          console.warn(`${missing} column not found, retrying update without it...`);
          const { [missing]: _drop, ...remaining } = updatePayload;
          updatePayload = remaining;
          attempts++;
          continue;
        }
      }
      break;
    }

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: 'Destination not found with this ID.' }, { status: 404 });
    }

    // --- STEP 6: ACTION AUDIT LOGGING ---
    try {
      const { logAuditAction } = await import('@/lib/audit');
      await logAuditAction({
        actorId: 'ADMIN_PORTAL',
        actorRole: 'ADMIN',
        action: 'UPDATE_DESTINATION',
        entityId: id,
        entityType: 'DESTINATION',
        details: { fieldsUpdated: Object.keys(updates) },
        ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1'
      });
    } catch (auditErr) {
      console.error('Failed to log audit action:', auditErr);
    }
    // ------------------------------------

    return NextResponse.json({ data });
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
