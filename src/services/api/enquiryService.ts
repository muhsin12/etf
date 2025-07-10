// Enquiry Service for handling all enquiry-related API calls

export interface Enquiry {
  _id?: string;
  carId: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt?: string;
}

/**
 * Submit a new enquiry
 */
export const submitEnquiry = async (enquiryData: Omit<Enquiry, '_id' | 'createdAt'>): Promise<{ message: string }> => {
  try {
    const response = await fetch('/api/enquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enquiryData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit enquiry');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in submitEnquiry:', error);
    throw error;
  }
};

/**
 * Get all enquiries (admin only)
 */
export const getAllEnquiries = async (): Promise<Enquiry[]> => {
  try {
    const response = await fetch('/api/enquiry');
    
    if (!response.ok) {
      throw new Error('Failed to fetch enquiries');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in getAllEnquiries:', error);
    throw error;
  }
};

/**
 * Get a single enquiry by ID (admin only)
 */
export const getEnquiryById = async (id: string): Promise<Enquiry> => {
  try {
    const response = await fetch(`/api/enquiry/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch enquiry details');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error in getEnquiryById for ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an enquiry by ID (admin only)
 */
export const deleteEnquiry = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`/api/enquiry/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete enquiry');
    }
  } catch (error) {
    console.error(`Error in deleteEnquiry for ID ${id}:`, error);
    throw error;
  }
};