import axios, { AxiosResponse } from 'axios';
import { EventItem } from '@howljs/calendar-kit';
import { getAuthConfig, handleAxiosError, base_url } from './axiosHelper';

const baseUrl = `http://${base_url}:6000/api/event`;

const getEvents = async (): Promise<EventItem[]> => {
  try {
    const response: AxiosResponse<EventItem[]> = await axios.get(baseUrl, getAuthConfig());
    //console.log("event api: ",response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

const createEvent = async (newEvent: EventItem): Promise<EventItem> => {
  try {
    const response: AxiosResponse<EventItem> = await axios.post(baseUrl, newEvent, getAuthConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

const updateEvent = async (id: string, updatedEvent: Partial<EventItem>): Promise<EventItem> => {
  try {
    const response: AxiosResponse<EventItem> = await axios.put(`${baseUrl}/${id}`, updatedEvent, getAuthConfig());
    //console.log("event api update: ",response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

const deleteEvent = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${baseUrl}/${id}`, getAuthConfig());
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export default {  getEvents, createEvent, updateEvent, deleteEvent };
