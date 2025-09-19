// Universal API base URL constant
export const BASE_URL = "http://localhost:8000/api";

// localStorage key for storing responses
export const STORAGE_KEY = "upload_responses";

export const FILE_STORAGE_URL = "http://localhost:8000/files";

export const getUrl = (path: string) => FILE_STORAGE_URL + "/" + path;
