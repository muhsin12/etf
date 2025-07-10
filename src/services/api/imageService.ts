// Image Service for handling image uploads to local storage (development) or Azure Blob Storage (production)

/**
 * Upload multiple images to storage
 * In development: Saves to local filesystem
 * In production: Uploads to Azure Blob Storage
 */
export const uploadImages = async (files: File[]): Promise<{ url: string; key: string }[]> => {
  try {
    const formData = new FormData();
    
    // Append all files to the form data
    files.forEach((file, index) => {
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