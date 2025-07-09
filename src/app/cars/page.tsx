'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { sampleCars } from '@/data/sampleCars';

interface Car {
  _id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engineSize: string;
  fuelType: string;
  transmission: string;
  color: string;
  description: string;
  features: string[];
  condition: string;
  bodyType: string;
  images: { url: string }[];
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    minMileage: '',
    maxMileage: '',
    fuelType: '',
    transmission: '',
    bodyType: '',
  });

  useEffect(() => {
    // Using sample data instead of API call
    setCars(sampleCars);
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredCars = cars.filter(car => {
    return (
      (!filters.make || car.make.toLowerCase().includes(filters.make.toLowerCase())) &&
      (!filters.model || car.model.toLowerCase().includes(filters.model.toLowerCase())) &&
      (!filters.minPrice || car.price >= parseInt(filters.minPrice)) &&
      (!filters.maxPrice || car.price <= parseInt(filters.maxPrice)) &&
      (!filters.minYear || car.year >= parseInt(filters.minYear)) &&
      (!filters.maxYear || car.year <= parseInt(filters.maxYear)) &&
      (!filters.minMileage || car.mileage >= parseInt(filters.minMileage)) &&
      (!filters.maxMileage || car.mileage <= parseInt(filters.maxMileage)) &&
      (!filters.fuelType || car.fuelType === filters.fuelType) &&
      (!filters.transmission || car.transmission === filters.transmission) &&
      (!filters.bodyType || car.bodyType === filters.bodyType)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Cars</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter Cars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              name="make"
              placeholder="Make"
              value={filters.make}
              onChange={handleFilterChange}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              type="text"
              name="model"
              placeholder="Model"
              value={filters.model}
              onChange={handleFilterChange}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="flex space-x-2">
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              <input
                type="number"
                name="minYear"
                placeholder="Min Year"
                value={filters.minYear}
                onChange={handleFilterChange}
                className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="number"
                name="maxYear"
                placeholder="Max Year"
                value={filters.maxYear}
                onChange={handleFilterChange}
                className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              <input
                type="number"
                name="minMileage"
                placeholder="Min Mileage"
                value={filters.minMileage}
                onChange={handleFilterChange}
                className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="number"
                name="maxMileage"
                placeholder="Max Mileage"
                value={filters.maxMileage}
                onChange={handleFilterChange}
                className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <select
              name="fuelType"
              value={filters.fuelType}
              onChange={handleFilterChange}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Fuel Type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            <select
              name="transmission"
              value={filters.transmission}
              onChange={handleFilterChange}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
            <select
              name="bodyType"
              value={filters.bodyType}
              onChange={handleFilterChange}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Body Type</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Coupe">Coupe</option>
              <option value="Wagon">Wagon</option>
              <option value="Van">Van</option>
              <option value="Truck">Truck</option>
            </select>
          </div>
        </div>

        {/* Car Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map(car => (
            <Link
              key={car._id}
              href={`/cars/${car._id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={car.images[0]?.url}
                  alt={`${car.make} ${car.model}`}
                  className="object-cover w-full h-48"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {car.year} {car.make} {car.model}
                </h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Mileage: {car.mileage.toLocaleString()} miles</p>
                  <p>Transmission: {car.transmission}</p>
                  <p>Fuel Type: {car.fuelType}</p>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold text-gray-900">
                    ${car.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No cars found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}