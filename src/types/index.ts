export interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
}

export interface ApiResponse {
  id: string;
  timestamp: number;
  imageUrls: string[];
  data: Record<string, any>;
  success: boolean;
}

export interface UploadResponse {
  imageUrls?: string[];
  data?: Record<string, any>;
  [key: string]: any;
}