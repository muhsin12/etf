import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { BlobServiceClient } from "@azure/storage-blob";
import fs from "fs/promises";
import path from "path";

// Azure configuration (for production)
const AZURE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME || "cars";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    if (files.length > 10) {
      return NextResponse.json(
        { error: "Maximum 10 files allowed" },
        { status: 400 }
      );
    }

    let uploadedFiles: { url: string; key: string }[];

    if (process.env.NODE_ENV === "development") {
      uploadedFiles = await uploadToLocal(files);
    } else {
      uploadedFiles = await uploadToAzure(files);
    }

    return NextResponse.json(uploadedFiles);
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}

async function uploadToAzure(files: File[]) {
  if (!AZURE_CONNECTION_STRING) {
    throw new Error("Azure Storage connection string is not configured");
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_CONNECTION_STRING
  );
  const containerClient =
    blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);

  // Create container if it doesn't exist
  await containerClient.createIfNotExists({
    access: "blob", // Public read access for blobs only
  });

  const uploadPromises = files.map(async (file) => {
    // Generate a unique filename
    const fileExtension = file.name.split(".").pop();
    const randomName = crypto.randomBytes(16).toString("hex");
    const fileName = `${randomName}.${fileExtension}`;

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    // Convert file to buffer and upload
    const buffer = Buffer.from(await file.arrayBuffer());
    await blockBlobClient.upload(buffer, buffer.length, {
      blobHTTPHeaders: { blobContentType: file.type },
    });

    // Return the URL of the uploaded file
    return {
      url: blockBlobClient.url.replace(/`/g, ""),
      key: fileName,
    };
  });

  return Promise.all(uploadPromises);
}


async function uploadToLocal(files: File[]) {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  const uploadPromises = files.map(async (file) => {
    const fileExtension = file.name.split(".").pop();
    const randomName = crypto.randomBytes(16).toString("hex");
    const fileName = `${randomName}.${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    return {
      url: `/uploads/${fileName}`,
      key: fileName,
    };
  });

  return Promise.all(uploadPromises);
}
