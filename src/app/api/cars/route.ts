import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Car from '@/models/Car';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filters: any = {};

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

    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch cars' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    await connectDB();

    const car = new Car(data);
    await car.save();

    return NextResponse.json(car, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create car listing' },
      { status: 500 }
    );
  }
}