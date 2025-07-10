# Services Directory

This directory contains service modules that handle API calls and data fetching logic for the application. By centralizing these operations, we improve code organization, readability, and maintainability.

## Structure

### `/api`

Contains service modules for interacting with backend API endpoints:

- **carService.ts**: Handles all car-related API operations
  - `getAllCars()`: Fetches all cars with optional filters
  - `getCarById()`: Fetches a single car by ID
  - `createCar()`: Creates a new car listing
  - `updateCar()`: Updates an existing car
  - `deleteCar()`: Deletes a car by ID

- **enquiryService.ts**: Handles all enquiry-related API operations
  - `submitEnquiry()`: Submits a new enquiry
  - `getAllEnquiries()`: Gets all enquiries (admin only)
  - `getEnquiryById()`: Gets a single enquiry by ID (admin only)
  - `deleteEnquiry()`: Deletes an enquiry by ID (admin only)

- **authService.ts**: Handles authentication-related API operations
  - `login()`: Logs in to the admin panel
  - `logout()`: Logs out from the admin panel

## Usage

Import the required service functions in your components:

```typescript
import { getAllCars, getCarById } from '@/services/api/carService';

// Example usage in a component
const fetchCars = async () => {
  try {
    const cars = await getAllCars();
    // Process the cars data
  } catch (error) {
    console.error('Error fetching cars:', error);
  }
};
```

Or import all services from the index file:

```typescript
import { getAllCars, submitEnquiry, login } from '@/services/api';
```

## Benefits

- **Centralized API Logic**: All API calls are managed in one place
- **Code Reusability**: Service functions can be reused across components
- **Easier Maintenance**: Changes to API endpoints only need to be updated in one place
- **Better Testing**: Service functions can be easily mocked for testing
- **Type Safety**: TypeScript interfaces ensure consistent data structures