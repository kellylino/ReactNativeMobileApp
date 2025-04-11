import axios, { AxiosResponse } from 'axios';
import { HabitData } from '../types/types';
import { getAuthConfig, handleAxiosError, base_url } from './axiosHelper';

const baseUrl = `http://${base_url}:6000/api/habit`;

const getHabits = async (): Promise<HabitData[]> => {
  try {
    const response: AxiosResponse<HabitData[]> = await axios.get(baseUrl, getAuthConfig());
    console.log(response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

const createHabit = async (newHabit: HabitData): Promise<HabitData> => {
  try {
    const response: AxiosResponse<HabitData> = await axios.post(baseUrl, newHabit, getAuthConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

const updateHabit = async (id: string, updatedHabit: Partial<HabitData>): Promise<HabitData> => {
  try {
    const response: AxiosResponse<HabitData> = await axios.put(`${baseUrl}/${id}`, updatedHabit, getAuthConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

const deleteHabit = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${baseUrl}/${id}`, getAuthConfig());
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export default {  getHabits, createHabit, updateHabit, deleteHabit };
