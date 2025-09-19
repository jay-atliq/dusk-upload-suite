import { BASE_URL } from '@/utils/constants';
import { UploadResponse } from '@/types';

export const uploadImages = async (files: File[]): Promise<UploadResponse> => {
  const formData = new FormData();
  
  files.forEach((file, index) => {
    formData.append(`image_${index}`, file);
  });

  try {
    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};