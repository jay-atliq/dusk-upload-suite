import { ApiResponse, UploadResponse } from "@/types";
import { STORAGE_KEY } from "./constants";

export const getStoredResponses = (): ApiResponse[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
};

export const addResponseToStorage = (response: UploadResponse[]) => {
  try {
    const existing = getStoredResponses();
    const newResponse: ApiResponse[] = response.map((each) => ({
      ...each,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    }));
    const updated = [...newResponse, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return newResponse;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    throw error;
  }
};

export const clearStoredResponses = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};
