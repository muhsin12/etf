import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { BlobServiceClient } from '@azure/storage-blob';

// Determine if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Local storage configuration
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const LOCAL_UPLOAD_URL_PREFIX = '/uploads';

// Azure configuration (for production)
const AZURE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME || 'cars';

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

    // Choose upload method based on environment
    let uploadedFiles;
    if (isDevelopment) {
      uploadedFiles = await uploadToLocalStorage(files);
    } else {
      uploadedFiles = await uploadToAzure(files);
    }

    return NextResponse.json(uploadedFiles);
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}

async function uploadToLocalStorage(files: File[]) {
  // Ensure upload directory exists
  try {
    await mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
  }

  const uploadPromises = files.map(async (file) => {
    // Generate a unique filename
    const fileExtension = file.name.split('.').pop();
    const randomName = crypto.randomBytes(16).toString('hex');
    const fileName = `${randomName}.${fileExtension}`;
    const filePath = path.join(LOCAL_UPLOAD_DIR, fileName);
    
    // Convert file to buffer and save to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    
    // Return the URL of the uploaded file
    return {
      url: `${LOCAL_UPLOAD_URL_PREFIX}/${fileName}`,
      key: fileName
    };
  });

  return Promise.all(uploadPromises);
}

async function uploadToAzure(files: File[]) {
  if (!AZURE_CONNECTION_STRING) {
    throw new Error('Azure Storage connection string is not configured');
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);
  
  // Create container if it doesn't exist
  await containerClient.createIfNotExists({
    access: 'blob' // Public read access for blobs only
  });

  const uploadPromises = files.map(async (file) => {
    // Generate a unique filename
    const fileExtension = file.name.split('.').pop();
    const randomName = crypto.randomBytes(16).toString('hex');
    const fileName = `${randomName}.${fileExtension}`;
    
    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    
    // Convert file to buffer and upload
    const buffer = Buffer.from(await file.arrayBuffer());
    await blockBlobClient.upload(buffer, buffer.length, {
      blobHTTPHeaders: { blobContentType: file.type }
    });
    
    // Return the URL of the uploaded file
    return {
      url: blockBlobClient.url,
      key: fileName
    };
  });

  return Promise.all(uploadPromises);
}