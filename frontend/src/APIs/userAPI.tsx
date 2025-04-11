import axios, { AxiosResponse } from 'axios';
import { UserData } from '../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuthConfig, handleAxiosError, base_url } from '../APIs/axiosHelper';

const baseUrl = `http://${base_url}:6000/api/user`;

// let token: string;

// const setToken = (newToken: string) => {
//   token = newToken;
// };

const createUser = async (newUser: UserData): Promise<UserData> => {
  try {
    const response: AxiosResponse<UserData> = await axios.post(`${baseUrl}/register`, newUser);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

const loginUser = async (email: string, password: string): Promise<{ token: string; user: UserData }> => {
  try {
    const response: AxiosResponse<{ token: string; user: UserData }> = await axios.post(`${baseUrl}/login`, { email, password });
    // setToken(response.data.token);
    // AsyncStorage.setItem('token', token);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

const getUserById = async (): Promise<UserData> => {
  try {
    const response: AxiosResponse<UserData> = await axios.get(baseUrl, getAuthConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

const updateUser = async (updatedUser: Partial<UserData>): Promise<UserData> => {
  try {
    const response: AxiosResponse<UserData> = await axios.put(baseUrl, updatedUser, getAuthConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

const deleteUser = async (): Promise<void> => {
  try {
    await axios.delete(baseUrl, getAuthConfig());
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};


export default {  getUserById, createUser, updateUser, deleteUser, loginUser };
