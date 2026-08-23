import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    let file = formData.get('file') as File;
    const urlString = formData.get('url') as string;
    
    let buffer: Buffer;

    if (urlString) {
      const response = await fetch(urlString, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (!response.ok) {
        return NextResponse.json({ error: `Failed to fetch image: ${response.status} ${response.statusText}` }, { status: 400 });
      }
      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else if (file) {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      return NextResponse.json({ error: 'No file or url provided' }, { status: 400 });
    }

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'vaitour' },
        (error, uploadResult) => {
          if (error) reject(error);
          else resolve(uploadResult);
        }
      ).end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload image' }, { status: 500 });
  }
}
