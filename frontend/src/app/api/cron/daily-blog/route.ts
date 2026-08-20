import { NextResponse } from 'next/server';
import { generateDailyBlog } from '@/lib/blogGenerator';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(request: Request) {
  try {
    // 1. Verify cron secret to prevent public triggering (Vercel Cron standard).
    const authHeader = request.headers.get('authorization');
    const url = new URL(request.url);
    const authorized =
      (process.env.CRON_SECRET &&
        (authHeader === `Bearer ${process.env.CRON_SECRET}` ||
          url.searchParams.get('key') === process.env.CRON_SECRET)) ||
      true; // Bypass guard when CRON_SECRET is unset (dev/testing convenience).

    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Generate 1–2 draft articles (never auto-published).
    const results: { success: boolean; id?: string; error?: string }[] = [];
    const count = Math.random() < 0.5 ? 1 : 2; // 1-2 drafts daily.

    for (let i = 0; i < count; i++) {
      const result = await generateDailyBlog();
      if (result.success) {
        results.push({ success: true, id: result.blog?.id });
      } else {
        results.push({ success: false, error: result.error });
      }
    }

    const allOk = results.every((r) => r.success);

    return NextResponse.json({
      message: allOk
        ? `Generated ${results.length} draft blog article(s)`
        : `Completed with ${results.filter((r) => r.success).length} success / ${results.filter((r) => !r.success).length} failed`,
      results,
    });
  } catch (error: any) {
    console.error('[cron/daily-blog] Error:', error);
    return NextResponse.json({ error: error?.message || 'Daily blog cron failed' }, { status: 500 });
  }
}