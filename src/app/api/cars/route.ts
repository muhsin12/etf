import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Car from '@/models/Car';

interface MongoNumberQuery {
  $gte?: number;
  $lte?: number;
}

interface CarFilters {
  make?: RegExp;
  model?: RegExp;
  price?: MongoNumberQuery;
  year?: MongoNumberQuery;
  mileage?: MongoNumberQuery;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filters: CarFilters = {};

    // Extract filter parameters
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minYear = searchParams.get('minYear');
    const maxYear = searchParams.get('maxYear');
    const minMileage = searchParams.get('minMileage');
    const maxMileage = searchParams.get('maxMileage');
    const fuelType = searchParams.get('fuelType');
    const transmission = searchParams.get('transmission');
    const bodyType = searchParams.get('bodyType');

    if (make) filters.make = new RegExp(make, 'i');
    if (model) filters.model = new RegExp(model, 'i');
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseInt(minPrice);
      if (maxPrice) filters.price.$lte = parseInt(maxPrice);
    }
    if (minYear || maxYear) {
      filters.year = {};
      if (minYear) filters.year.$gte = parseInt(minYear);
      if (maxYear) filters.year.$lte = parseInt(maxYear);
    }
    if (minMileage || maxMileage) {
      filters.mileage = {};
      if (minMileage) filters.mileage.$gte = parseInt(minMileage);
      if (maxMileage) filters.mileage.$lte = parseInt(maxMileage);
    }
    if (fuelType) filters.fuelType = fuelType;
    if (transmission) filters.transmission = transmission;
    if (bodyType) filters.bodyType = bodyType;

    await connectDB();
    const cars = await Car.find(filters).sort({ createdAt: -1 });

    return NextResponse.json(cars, { headers: corsHeaders });
  } catch (error) {
    console.error('Failed to fetch cars:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cars' },
      { status: 500, headers: corsHeaders }
    );
  }
}

interface CarRequestBody {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engineSize: string;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  color: string;
  description: string;
  features: string[];
  images: { url: string; key: string; }[];
  condition: 'New' | 'Like New' | 'Excellent' | 'Good' | 'Fair';
  bodyType: 'Sedan' | 'SUV' | 'Hatchback' | 'Coupe' | 'Wagon' | 'Van' | 'Truck';
  registrationYear: number;
  vin: string;
}

export async function POST(req: NextRequest) {
  try {
    const data: CarRequestBody = await req.json();
    await connectDB();

    const car = new Car(data);
    await car.save();

    return NextResponse.json(car, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error('Failed to create car listing:', error);
    return NextResponse.json(
      { error: 'Failed to create car listing' },
      { status: 500, headers: corsHeaders }
    );
  }
}