import { NextResponse } from 'next/server';
import { generateAutoReply } from '@/lib/forumAutoSeeder';

export async function POST(request: Request) {
  try {
    const { discussionId, content } = await request.json();
    
    if (!discussionId || !content) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // We do NOT await this. We let it run asynchronously in the background so the user gets an instant response from the API.
    generateAutoReply(discussionId, content);

    return NextResponse.json({ message: 'Auto-reply dispatched' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
