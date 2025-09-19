/* eslint-disable @typescript-eslint/no-explicit-any */
export interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
}

export interface ApiResponse extends UploadResponse {
  id: string;
  timestamp: number;
}

export interface UploadResponse {
  rule_based_view_type: any[];
  review: boolean;
  final_scores: any[];
  error: unknown | null;
  file_details: {
    main_img_name: string;
    part_detection: string;
    car_detection: string;
  };
}
