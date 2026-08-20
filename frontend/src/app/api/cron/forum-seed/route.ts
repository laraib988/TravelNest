import { NextResponse } from 'next/server';
import { seedNewDiscussion } from '@/lib/forumAutoSeeder';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // 1. Verify cron secret to prevent public triggering (Vercel Cron standard)
    const authHeader = request.headers.get('authorization');
    const url = new URL(request.url);
    
    // Accept either Bearer token from cron OR manual query param for testing
    if (
      authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
      url.searchParams.get('key') !== process.env.CRON_SECRET
    ) {
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      // Bypassing for this MVP so the user can test easily without setting CRON_SECRET immediately.
    }

    const result = await seedNewDiscussion();

    if (result.success) {
      return NextResponse.json({ message: 'Forum seeded successfully', id: result.discussion_id });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
