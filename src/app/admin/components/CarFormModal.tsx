"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createCar, updateCar, Car } from "@/services/api/carService";
import { uploadImages } from "@/services/api/imageService";

interface CarFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  carToEdit?: Car | null;
}

const defaultCarData = {
  make: "",
  model: "",
  year: new Date().getFullYear(),
  price: 0,
  mileage: 0,
  engineSize: "",
  fuelType: "Petrol",
  transmission: "Manual",
  color: "",
  description: "",
  features: [],
  condition: "Good",
  bodyType: "Sedan",
  registrationYear: new Date().getFullYear(),
  vin: "",
  images: [],
};

export default function CarFormModal({
  isOpen,
  onClose,
  onSuccess,
  carToEdit,
}: CarFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState<Omit<Car, "_id">>(defaultCarData);

  // Populate form when editing a car
  useEffect(() => {
    if (carToEdit) {
      setFormData({
        ...carToEdit,
        features: Array.isArray(carToEdit.features) ? carToEdit.features : [],
      });
    } else {
      setFormData(defaultCarData);
    }
  }, [carToEdit]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: Omit<Car, "_id">) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      if (fileList.length > 10) {
        alert("You can only upload up to 10 images");
        return;
      }
      setImages(fileList);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload images first if there are any
      let uploadedImages: { url: string; key: string }[] = [];
      if (images.length > 0) {
        try {
          uploadedImages = await uploadImages(images);
          console.log("Images uploaded successfully:", uploadedImages);
        } catch (error) {
          console.error("Error uploading images:", error);
          alert("Failed to upload images");
          // Continue with car creation/update even if image upload fails
        }
      }

      if (carToEdit) {
        // Update existing car
        const formDataObj = new FormData();

        // Append car data with type conversion
        Object.entries(formData).forEach(([key, value]) => {
          if (key === "features") {
            const featuresArray =
              typeof value === "string"
                ? value.split(",").map((f: string) => f.trim())
                : value;
            formDataObj.append(key, JSON.stringify(featuresArray));
          } else if (key === "images" && Array.isArray(value)) {
            // Keep existing images
            const existingImages = Array.isArray(value) ? value : [];
            // Combine with newly uploaded images
            const allImages = [...existingImages, ...uploadedImages];
            formDataObj.append(key, JSON.stringify(allImages));
          } else if (
            ["year", "price", "mileage", "registrationYear"].includes(key)
          ) {
            formDataObj.append(key, String(Number(value)));
          } else {
            formDataObj.append(key, String(value));
          }
        });

        await updateCar(carToEdit._id, formDataObj);
      } else {
        // Create new car
        await createCar({
          ...formData,
          year: parseInt(String(formData.year)),
          price: parseFloat(String(formData.price)),
          mileage: parseFloat(String(formData.mileage)),
          registrationYear: parseInt(String(formData.registrationYear)),
          features:
            typeof formData.features === "string"
              ? (formData.features as string)
                  .split(",")
                  .map((f: string) => f.trim())
              : formData.features,
          images: uploadedImages, // Use uploaded images with correct type
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving car listing:", error);
      alert("Failed to save car listing");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-5 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-1">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {carToEdit ? "Edit Car" : "Add New Car"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Make
              </label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-md px-4 py-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 hover:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Model
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-md px-4 py-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 hover:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                required
                min="1900"
                max={new Date().getFullYear() + 1}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-md px-4 py-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 hover:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-md px-4 py-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 hover:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mileage
              </label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleInputChange}
                required
                min="0"
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-md px-4 py-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 hover:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Engine Size
              </label>
              <input
                type="text"
                name="engineSize"
                value={formData.engineSize}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-md px-4 py-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 hover:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fuel Type
              </label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-md px-4 py-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 hover:border-blue-400"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Transmission
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-md px-4 py-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 hover:border-blue-400"
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
                <option value="Semi-Automatic">Semi-Automatic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-md px-4 py-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 hover:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Condition
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-md px-4 py-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 hover:border-blue-400"
              >
                <option value="Excellent">Excellent</option>
                <option value="Very Good">Very Good</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Body Type
              </label>
              <select
                name="bodyType"
                value={formData.bodyType}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-md px-4 py-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 hover:border-blue-400"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Coupe">Coupe</option>
                <option value="Convertible">Convertible</option>
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
                value={formData.registrationYear}
                onChange={handleInputChange}
                required
                min="1900"
                max={new Date().getFullYear()}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-md px-4 py-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 hover:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                VIN
              </label>
              <input
                type="text"
                name="vin"
                value={formData.vin}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-md px-4 py-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 hover:border-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Features (comma separated)
            </label>
            <input
              type="text"
              name="features"
              value={
                typeof formData.features === "string"
                  ? formData.features
                  : formData.features.join(", ")
              }
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-md px-4 py-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 hover:border-blue-400"
              placeholder="Air Conditioning, Bluetooth, Navigation, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-md px-4 py-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 hover:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Images
            </label>
            <label className="mt-1 flex items-center justify-center px-6 py-3 border-2 border-gray-300 border-dashed rounded-md shadow-sm hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-8 w-8 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex justify-center text-sm text-gray-600">
                  <span className="relative font-medium text-blue-600 hover:text-blue-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    Click to browse for car images
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Upload up to 10 car images (PNG, JPG, GIF formats)
                </p>
              </div>
            </label>
          </div>

          {carToEdit && carToEdit.images.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Images
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {carToEdit.images.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={image.url}
                      alt={`Car image ${index + 1}`}
                      width={96}
                      height={96}
                      className="object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-md shadow-md hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border-2 border-transparent rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 hover:shadow-lg"
            >
              {loading ? "Saving..." : carToEdit ? "Update Car" : "Add Car"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
