import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError, AxiosRequestConfig } from "axios";

let token: string;

//export const base_url = '192.168.1.102';

//export const base_url = '153.1.195.187';

export const base_url = 'localhost';

export const setToken = (newToken: string) => {
  token = newToken;
  AsyncStorage.setItem('token', token);
};

export const getAuthConfig = (): AxiosRequestConfig => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const handleAxiosError = (error: unknown) : string => {
  const axiosError = error as AxiosError<{ message: string }>;

  if (axiosError.response) {
    // The request was made and the server responded with an error status
    throw new Error(axiosError.response.data?.message || "An unknown error occurred");
  } else if (axiosError.request) {
    // Request was made but no response received (e.g., network issue)
    throw new Error("No response from server. Check your internet connection.");
  } else {
    // Other unexpected errors
    throw new Error(axiosError.message);
  }
}