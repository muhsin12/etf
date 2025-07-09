import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// Create Enquiry Schema
const EnquirySchema = new mongoose.Schema({
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Car'
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: String,
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    await connectDB();

    // Validate required fields and convert carId to ObjectId
    if (!data.carId || !data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate carId format
    if (!data.carId || typeof data.carId !== 'string' || data.carId.length !== 24) {
      return NextResponse.json(
        { error: 'Invalid car ID format. Expected a 24-character hexadecimal string.' },
        { status: 400 }
      );
    }

    // Convert carId to ObjectId
    try {
      data.carId = new mongoose.Types.ObjectId(data.carId);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid car ID format. The ID must be a valid MongoDB ObjectId.' },
        { status: 400 }
      );
    }

    // Create new enquiry
    const enquiry = new Enquiry(data);
    await enquiry.save();

    // TODO: Send email notification to admin
    // This would typically involve setting up an email service
    // like SendGrid, AWS SES, or similar

    return NextResponse.json(
      { message: 'Enquiry submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}