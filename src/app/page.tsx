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
      <div
        className="relative bg-cover bg-center py-32 px-4 text-white"
        style={{ backgroundImage: "url('/images/hero-bg.png')" }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <h1 className="text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up">
            Your Journey Starts Here
          </h1>
          <p className="text-2xl mb-10 animate-fade-in-up animation-delay-200">
            Discover premium vehicles and exceptional service at MMP Garage.
          </p>
          <Link
            href="/cars"
            className="inline-block bg-red-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-red-700 transition duration-300 transform hover:scale-105 animate-fade-in-up animation-delay-400"
          >
            Explore Our Inventory
          </Link>
        </div>
      </div>

      {/* Latest Cars Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
          Our Latest Arrivals
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
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 flex flex-col"
                >
                  <CarImageCarousel
                    images={car.images}
                    altText={`${car.make} ${car.model}`}
                    className="w-full h-48 rounded-t-xl"
                  />
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {car.year} {car.make} {car.model}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {car.bodyType} - {car.fuelType}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                        <p>
                          <strong className="font-semibold">Mileage:</strong>{" "}
                          {car.mileage.toLocaleString()} miles
                        </p>
                        <p>
                          <strong className="font-semibold">
                            Transmission:
                          </strong>{" "}
                          {car.transmission}
                        </p>
                        <p>
                          <strong className="font-semibold">Fuel Type:</strong>{" "}
                          {car.fuelType}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 text-right">
                      <span className="text-3xl font-extrabold text-gray-900">
                        £{car.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/cars"
                className="inline-block bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-red-700 transition duration-300 transform hover:scale-105"
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
          <h2 className="text-4xl font-extrabold text-gray-900 mb-12 text-center">
            Why Choose <span className="text-red-600">MMP Garage</span>?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md transform hover:scale-105 transition duration-300">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                Quality Assured
              </h3>
              <p className="text-gray-700">
                Every vehicle undergoes a rigorous multi-point inspection for
                your peace of mind.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md transform hover:scale-105 transition duration-300">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                Transparent Pricing
              </h3>
              <p className="text-gray-700">
                No hidden fees or surprises. What you see is what you pay.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md transform hover:scale-105 transition duration-300">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                Dedicated Support
              </h3>
              <p className="text-gray-700">
                Our team is here to assist you every step of the way, from
                selection to after-sales.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gray-900 text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-6">
            Ready to Find Your Dream Car?
          </h2>
          <p className="text-xl mb-10">
            Browse our extensive inventory or get in touch with our sales team
            today.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/cars"
              className="bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-red-700 transition duration-300 transform hover:scale-105"
            >
              Browse Cars
            </Link>
            <Link
              href="/contact"
              className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-gray-200 transition duration-300 transform hover:scale-105"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
