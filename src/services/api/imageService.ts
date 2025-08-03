// Image Service for handling image uploads to local storage

/**
 * Upload multiple images to local storage
 * Saves images to public/uploads directory for both development and production
 */
export const uploadImages = async (files: File[]): Promise<{ url: string; key: string }[]> => {
  try {
    const formData = new FormData();
    
    // Append all files to the form data
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload images');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in uploadImages:', error);
    throw error;
  }
};