import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    if (files.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 files allowed' },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(async (file) => {
      // Generate a unique filename
      const fileExtension = file.name.split('.').pop();
      const randomName = crypto.randomBytes(16).toString('hex');
      const fileName = `${randomName}.${fileExtension}`;

      // Convert file to buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Upload to S3
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: `cars/${fileName}`,
        Body: buffer,
        ContentType: file.type,
      });

      await s3Client.send(command);

      // Return the URL of the uploaded file
      return {
        url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/cars/${fileName}`,
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    return NextResponse.json(uploadedFiles);
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}