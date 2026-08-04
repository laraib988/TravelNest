import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');
  if (secret !== 'travelnest_secret_token_123') {
    return NextResponse.json({ message: 'Invalid revalidation token' }, { status: 401 });
  }

  const body = await request.json();
  const paths: string[] = body.paths || [];

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: true, paths, now: Date.now() });
}
