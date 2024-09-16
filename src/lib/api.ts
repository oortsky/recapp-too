import axios, { AxiosResponse } from "axios";

// Define the base URL for the axios instance
const baseURL = "https://recapp-backend-production.up.railway.app/api/";

// Create an axios instance with the base URL
const axiosInstance = axios.create({
  baseURL,
});

// Define a generic type for the API response
type APIResponse<T> = AxiosResponse<T>;

// Function to fetch data
export const fetchAPI = async <T>(endpoint: string): Promise<T> => {
  try {
    const response: APIResponse<T> = await axiosInstance.get(endpoint);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Function to create data
export const createAPI = async <T>(endpoint: string, data: unknown): Promise<T> => {
  try {
    const response: APIResponse<T> = await axiosInstance.post(endpoint, data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating data:", error);
    throw error;
  }
};

// Function to update data
export const updateAPI = async <T>(endpoint: string, id: number, data: unknown): Promise<T> => {
  try {
    const response: APIResponse<T> = await axiosInstance.put(`${endpoint}/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating data:", error);
    throw error;
  }
};

// Function to delete data
export const deleteAPI = async <T>(endpoint: string, id: number): Promise<T> => {
  try {
    const response: APIResponse<T> = await axiosInstance.delete(`${endpoint}/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting data:", error);
    throw error;
  }
};