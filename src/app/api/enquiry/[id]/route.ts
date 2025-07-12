import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// Define the Enquiry schema if not already defined in a separate model file
const EnquirySchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['new', 'contacted', 'closed'], 
    default: 'new' 
  },
}, { timestamps: true });

// Get the Enquiry model (create if it doesn't exist)
const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!['new', 'contacted', 'closed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update enquiry status
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('carId');

    if (!updatedEnquiry) {
      return NextResponse.json(
        { error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEnquiry);
  } catch (error) {
    console.error('Error updating enquiry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const { id } = await params;

    const enquiry = await Enquiry.findById(id).populate('carId');

    if (!enquiry) {
      return NextResponse.json(
        { error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(enquiry);
  } catch (error) {
    console.error('Error fetching enquiry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}