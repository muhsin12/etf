"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getAllCars } from "@/services/api/carService";
import CarImageCarousel from "@/components/CarImageCarousel";

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

export default function Home() {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const data = await getAllCars();
        setFeaturedCars(data.slice(0, 3)); // Get only the latest 3 cars for featured section
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to ETF Garage</h1>
          <p className="text-xl mb-8">
            Find your perfect pre-owned vehicle at the best prices
          </p>
          <Link
            href="/contact"
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
          >
            Contact Us Today
          </Link>
        </div>
      </div>

      {/* Latest Cars Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Latest Vehicles
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : featuredCars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">
              No featured cars available at the moment.
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredCars.map((car) => (
                <Link
                  key={car._id}
                  href={`/cars/${car._id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  onClick={(e) => {
                    // Allow navigation only if the click is not on the carousel
                    if ((e.target as Element).closest(".carousel-container")) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <CarImageCarousel
                      images={car.images}
                      altText={`${car.make} ${car.model}`}
                      className="h-48"
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
            <div className="mt-10 text-center">
              <Link
                href="/cars"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
              >
                View All Available Cars
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Why Choose ETF Garage?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">
                All our vehicles undergo rigorous quality checks
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">
                Competitive pricing on all our vehicles
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-600">
                Professional guidance throughout your purchase
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
