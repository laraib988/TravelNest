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
    
    let result;

    if (urlString) {
      // 🚀 OPTIMIZATION: Let Cloudinary fetch the URL directly instead of downloading it in Vercel Serverless Function!
      // This prevents timeout errors and Vercel fetch bandwidth limits.
      result = await cloudinary.uploader.upload(urlString, { folder: 'vaitour' });
    } else if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'vaitour' },
          (error, uploadResult) => {
            if (error) reject(error);
            else resolve(uploadResult);
          }
        ).end(buffer);
      });
    } else {
      return NextResponse.json({ error: 'No file or url provided' }, { status: 400 });
    }

    return NextResponse.json({ url: result.secure_url });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload image' }, { status: 500 });
  }
}
