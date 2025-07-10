// Car Service for handling all car-related API calls

export interface Car {
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
  registrationYear: number;
  vin: string;
  images: { url: string }[];
  createdAt?: string;
}

export interface CarFilters {
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
}

/**
 * Fetch all cars with optional filters
 */
export const getAllCars = async (filters?: CarFilters): Promise<Car[]> => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    const url = `/api/cars${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch cars');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in getAllCars:', error);
    throw error;
  }
};

/**
 * Fetch a single car by ID
 */
export const getCarById = async (id: string): Promise<Car> => {
  try {
    const response = await fetch(`/api/cars/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch car details');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error in getCarById for ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new car listing
 */
export const createCar = async (carData: Omit<Car, '_id'>): Promise<Car> => {
  try {
    const response = await fetch('/api/cars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create car listing');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in createCar:', error);
    throw error;
  }
};

/**
 * Update an existing car
 */
export const updateCar = async (id: string, formData: FormData): Promise<Car> => {
  try {
    const response = await fetch(`/api/cars/${id}`, {
      method: 'PUT',
      body: formData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update car');
    }
    
    return data;
  } catch (error) {
    console.error(`Error in updateCar for ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a car by ID
 */
export const deleteCar = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`/api/cars/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete car');
    }
  } catch (error) {
    console.error(`Error in deleteCar for ID ${id}:`, error);
    throw error;
  }
};