import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

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

    // Use local upload for both development and production
    const uploadedFiles = await uploadToLocal(files);

    return NextResponse.json(uploadedFiles);
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}

async function uploadToLocal(files: File[]) {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  
  // Ensure the uploads directory exists
  await fs.mkdir(uploadDir, { recursive: true });

  const uploadPromises = files.map(async (file) => {
    // Validate file type (images only)
    if (!file.type.startsWith('image/')) {
      throw new Error(`Invalid file type: ${file.type}. Only images are allowed.`);
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error(`File too large: ${file.name}. Maximum size is 5MB.`);
    }

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
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
