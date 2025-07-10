'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getCarById, Car } from '@/services/api/carService';
import { submitEnquiry } from '@/services/api/enquiryService';

interface EnquiryForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function CarDetailsPage() {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState<EnquiryForm>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState<{
    loading: boolean;
    error: string | null;
    success: boolean;
  }>({ loading: false, error: null, success: false });

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const data = await getCarById(id as string);
        setCar(data);
      } catch (error) {
        console.error('Error fetching car data:', error);
      }
    };
    
    fetchCarData();
  }, [id]);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ loading: true, error: null, success: false });

    try {
      await submitEnquiry({
        carId: id as string,
        ...enquiryForm,
      });

      setSubmitStatus({ loading: false, error: null, success: true });
      setShowEnquiryForm(false);
      setEnquiryForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setSubmitStatus({
        loading: false,
        error: 'Failed to submit enquiry. Please try again.',
        success: false,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEnquiryForm(prev => ({ ...prev, [name]: value }));
  };

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500">Car not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Car Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image Gallery */}
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={car.images[0]?.url}
              alt={`${car.make} ${car.model}`}
              className="object-cover w-full h-96"
            />
          </div>

          {/* Car Information */}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {car.year} {car.make} {car.model}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  ${car.price.toLocaleString()}
                </h2>
                <div className="space-y-2 text-gray-600">
                  <p>Mileage: {car.mileage.toLocaleString()} miles</p>
                  <p>Engine: {car.engineSize}</p>
                  <p>Fuel Type: {car.fuelType}</p>
                  <p>Transmission: {car.transmission}</p>
                  <p>Color: {car.color}</p>
                  <p>Body Type: {car.bodyType}</p>
                  <p>Condition: {car.condition}</p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-600 mb-6">{car.description}</p>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Features</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  {car.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Enquiry Button */}
            <div className="mt-8">
              <button
                onClick={() => setShowEnquiryForm(true)}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
              >
                Enquire Now
              </button>
            </div>
          </div>
        </div>

        {/* Enquiry Form Modal */}
        {showEnquiryForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Enquire About This Car</h2>
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={enquiryForm.name}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={enquiryForm.email}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={enquiryForm.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={enquiryForm.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {submitStatus.error && (
                  <p className="text-red-600">{submitStatus.error}</p>
                )}

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowEnquiryForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitStatus.loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
                  >
                    {submitStatus.loading ? 'Sending...' : 'Send Enquiry'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}