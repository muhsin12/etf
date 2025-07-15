import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About MMP Garage</h1>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Trusted Partner in Pre-owned Vehicles</h2>
            
            <p className="text-gray-600 mb-6">
              MMP Garage is your premier destination for quality pre-owned vehicles. With years of experience in the automotive industry, 
              we pride ourselves on offering a carefully curated selection of second-hand cars that meet our rigorous standards for quality and reliability.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Mission</h3>
                <p className="text-gray-600">
                  To provide our customers with reliable, high-quality pre-owned vehicles while delivering exceptional service and transparency 
                  throughout the car buying process.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Values</h3>
                <ul className="text-gray-600 list-disc list-inside">
                  <li>Quality Assurance</li>
                  <li>Customer Satisfaction</li>
                  <li>Transparency</li>
                  <li>Integrity</li>
                </ul>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose MMP Garage?</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Expert Inspection</h4>
                  <p className="text-gray-600">Every vehicle undergoes a thorough inspection process</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Quality Guarantee</h4>
                  <p className="text-gray-600">All vehicles meet our high-quality standards</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">After-Sales Support</h4>
                  <p className="text-gray-600">Dedicated support team for all your needs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}