"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getCarById, updateCar, Car } from "@/services/api/carService";

export default function EditCar({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<FileList | null>(null);
  const [carData, setCarData] = useState<Car>({
    _id: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    engineSize: "",
    fuelType: "",
    transmission: "",
    color: "",
    description: "",
    features: [],
    condition: "",
    bodyType: "",
    registrationYear: new Date().getFullYear(),
    vin: "",
    images: [],
  });

  useEffect(() => {
    fetchCarData();
  }, []);

  const fetchCarData = async () => {
    try {
      const data = await getCarById(params.id);
      setCarData(data);
    } catch (error) {
      console.error("Error fetching car data:", error);
      alert("Failed to load car data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate required fields
      const requiredFields = [
        "make",
        "model",
        "year",
        "price",
        "mileage",
        "engineSize",
        "fuelType",
        "transmission",
        "color",
        "description",
        "condition",
        "bodyType",
        "registrationYear",
        "vin",
      ];

      const missingFields = requiredFields.filter(
        (field) => !carData[field as keyof Car]
      );
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      const formData = new FormData();

      // Append car data with type conversion
      Object.entries(carData).forEach(([key, value]) => {
        if (key === "features") {
          formData.append(
            key,
            JSON.stringify(Array.isArray(value) ? value : [])
          );
        } else if (key === "images") {
          formData.append(
            key,
            JSON.stringify(Array.isArray(value) ? value : [])
          );
        } else if (
          ["year", "price", "mileage", "registrationYear"].includes(key)
        ) {
          formData.append(key, String(Number(value)));
        } else {
          formData.append(key, String(value));
        }
      });

      // Append new images if any
      if (images) {
        Array.from(images).forEach((image) => {
          formData.append("newImages", image);
        });
      }

      const data = await updateCar(params.id, formData);

      router.push("/admin/cars");
    } catch (error) {
      console.error("Error updating car:", error);
      alert(error instanceof Error ? error.message : "Failed to update car");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCarData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const features = e.target.value.split(",").map((feature) => feature.trim());
    setCarData((prev) => ({ ...prev, features }));
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Car</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white shadow-md rounded-lg p-6"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Make
              </label>
              <input
                type="text"
                name="make"
                value={carData.make}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Model
              </label>
              <input
                type="text"
                name="model"
                value={carData.model}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <input
                type="number"
                name="year"
                value={carData.year}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={carData.price}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mileage
              </label>
              <input
                type="number"
                name="mileage"
                value={carData.mileage}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Engine Size
              </label>
              <input
                type="text"
                name="engineSize"
                value={carData.engineSize}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fuel Type
              </label>
              <select
                name="fuelType"
                value={carData.fuelType}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Transmission
              </label>
              <select
                name="transmission"
                value={carData.transmission}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Transmission</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <input
                type="text"
                name="color"
                value={carData.color}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Body Type
              </label>
              <select
                name="bodyType"
                value={carData.bodyType}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Registration Year
              </label>
              <input
                type="number"
                name="registrationYear"
                value={carData.registrationYear}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                VIN
              </label>
              <input
                type="text"
                name="vin"
                value={carData.vin}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={carData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Features (comma-separated)
            </label>
            <input
              type="text"
              value={carData.features.join(", ")}
              onChange={handleFeaturesChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Air Conditioning, Bluetooth, Navigation, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Condition
            </label>
            <select
              name="condition"
              value={carData.condition}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Condition</option>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Images
            </label>
            <div className="grid grid-cols-5 gap-4 mt-2">
              {carData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.url}
                    alt={`Car image ${index + 1}`}
                    className="h-24 w-24 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Add New Images
            </label>
            <input
              type="file"
              onChange={(e) => setImages(e.target.files)}
              multiple
              accept="image/*"
              className="mt-1 block w-full"
            />
            <p className="mt-1 text-sm text-gray-500">
              You can upload up to 10 images
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push("/admin/cars")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
