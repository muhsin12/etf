import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Car from "@/models/Car";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  try {
    await connectDB();
    const car = await Car.findById(id);

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch car details" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  try {
    const formData = await req.formData();
    const carData: { [key: string]: any } = {};
    const newImages: File[] = [];

    console.log('Processing form data...');
    // Process form data
    formData.forEach((value, key) => {
      console.log('Processing field:', key, value);
      if (key === 'newImages') {
        newImages.push(value as File);
      } else if (key === 'features') {
        try {
          // Handle features as a comma-separated string or JSON array
          const featuresValue = value as string;
          carData[key] = featuresValue.includes('[') ? 
            JSON.parse(featuresValue) : 
            featuresValue.split(',').map(f => f.trim()).filter(f => f);
          console.log(`Processed features:`, carData[key]);
        } catch (e) {
          console.error(`Error processing features:`, e);
          carData[key] = [];
        }
      } else if (key === 'images') {
        try {
          carData[key] = JSON.parse(value as string);
          console.log(`Parsed images:`, carData[key]);
        } catch (e) {
          console.error(`Error parsing images:`, e);
          carData[key] = [];
        }
      } else if (key === 'year' || key === 'price' || key === 'mileage' || key === 'registrationYear') {
        carData[key] = Number(value);
        console.log(`Converted ${key} to number:`, carData[key]);
      } else {
        carData[key] = value;
      }
    });

    console.log('Final car data:', carData);
    await connectDB();

    // Check if VIN is being changed and if it's unique
    if (carData.vin) {
      const existingCarWithVin = await Car.findOne({ 
        _id: { $ne: id },
        vin: carData.vin 
      });
      if (existingCarWithVin) {
        return NextResponse.json(
          { error: "VIN must be unique" },
          { status: 400 }
        );
      }
    }

    // Handle image uploads if needed
    if (newImages.length > 0) {
      console.log('New images to process:', newImages.length);
    }

    // Ensure all required fields are present
    const requiredFields = ['make', 'model', 'year', 'price', 'mileage', 'engineSize', 
      'fuelType', 'transmission', 'color', 'description', 'condition', 'bodyType', 
      'registrationYear', 'vin'];
    
    const missingFields = requiredFields.filter(field => !carData[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    console.log('Updating car with ID:', id);
    const car = await Car.findByIdAndUpdate(
      id,
      { ...carData },
      { new: true, runValidators: true }
    ).catch(error => {
      console.error('Mongoose update error:', error);
      throw error;
    });

    if (!car) {
      console.log('Car not found');
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    console.log('Car updated successfully');
    return NextResponse.json(car);
  } catch (error) {
    console.error('Error in PUT /api/cars/[id]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update car" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  try {
    await connectDB();
    const car = await Car.findByIdAndDelete(id);

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Car deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete car" },
      { status: 500 }
    );
  }
}
