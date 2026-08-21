import { revalidatePath } from 'next/cache';
 
export async function POST(req: Request) {
  const { slug, secret } = await req.json();
  if (secret !== process.env.REVALIDATE_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }
  revalidatePath(`/tours/${slug}`);
  return Response.json({ revalidated: true });
}
