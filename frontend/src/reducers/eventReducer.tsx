import { createSlice } from '@reduxjs/toolkit';
import eventAPI from '../APIs/eventAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppDispatch, RootState } from './store';
import { EventItem } from '@howljs/calendar-kit';
import { rest } from 'lodash';
import { getLocalTimeWithTimezone } from '../utils/getLocalTimeZoneTime';
// Define initial state
const initialState: EventItem[] = [];

// Create event slice
const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    update(state, action) {
      const updatedEvent = action.payload;
      //console.log("Reducer updating:", updatedEvent);
      return state.map(event =>
      (event.id === updatedEvent.id ?
        updatedEvent
        : event));
    },
    create(state, action) {
      state.push(action.payload);
    },
    updateStatus(state, action) {
      return action.payload;
    },
    initialEvent(state, action) {
      return action.payload;
    },
    removeEvent(state, action) {
      return state.filter(event => event.id !== action.payload);
    }
  }
});

export const { update, create, updateStatus, initialEvent, removeEvent } = eventSlice.actions;

const saveEventToStorage = async (event: EventItem[]) => {
  try {
    await AsyncStorage.setItem('events', JSON.stringify(event));
  } catch (error) {
    console.error('Error saving event to AsyncStorage:', error);
  }
};

const saveUpdatedEvent = async (getState: () => RootState) => {
  const updatedEvent = getState().events;
  await saveEventToStorage(updatedEvent);
};

// Async Thunks
export const initializeEvents = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const storedEvent = await AsyncStorage.getItem('events');
      const event = storedEvent ? JSON.parse(storedEvent) : await eventAPI.getEvents();
      dispatch(initialEvent(event));
      //await saveEventToStorage(event);
    } catch (error) {
      console.error('Error initializing event:', error);
    }
  };
};

export const createEvent = (content: EventItem) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const newEvent = await eventAPI.createEvent(content);
      //console.log("Reducer newEvent:", newEvent);
      dispatch(create(newEvent));

      await saveUpdatedEvent(getState);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };
};

export const updatedEvent = (id: string, updatedEvent: EventItem) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const updatingEvent = await eventAPI.updateEvent(id, updatedEvent);
      //console.log("API update response (before dispatch):", updatedEvent);
      dispatch(update(updatingEvent));

      await saveUpdatedEvent(getState);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };
};

export const deleteEvent = (id: string) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      await eventAPI.deleteEvent(id);
      dispatch(removeEvent(id));

      await saveUpdatedEvent(getState);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };
};

export const updateEventStatus = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const currentTime = getLocalTimeWithTimezone();
      const events = getState().events;

      const updates = [];

      for (const event of events) {
        const endDateTime = event.end.dateTime;

        if (!endDateTime) {
          console.warn(`Event with id ${event.id} has no end dateTime.`);
          continue;
        }

        const newStatus =
          event.status === "Completed"
            ? "Completed"
            : new Date(endDateTime).getTime() > new Date(currentTime).getTime()
              ? "Pending"
              : "Overdue";

        // Only update if the status has changed
        if (newStatus !== event.status) {
          console.log(`Updating event ${event.id} status from ${event.status} to ${newStatus}`);
          updates.push(eventAPI.updateEvent(event.id, { ...event, status: newStatus }));
        }
      }

      // Perform all updates in parallel
      const updatedEvents = await Promise.all(updates);

      // Dispatch all updates at once
      updatedEvents.forEach(updatedEvent => dispatch(update(updatedEvent)));
      await saveUpdatedEvent(getState);
    } catch (error) {
      console.error("Error updating event status:", error);
    }
  };
};


// export const updateEventStatus = () => {
//   return async (dispatch: AppDispatch, getState: () => RootState) => {
//     try {
//       const currentTime = getLocalTimeWithTimezone();
//       getState().events.map(async event => {
//         const endDateTime = event.end.dateTime;

//         // Ensure endDateTime is defined before creating a Date object
//         if (!endDateTime) {
//           console.warn(`Event with id ${event.id} has no end dateTime.`);
//           return event;
//         }

//         const status =
//           event.status === "Completed" ? "Completed"
//             : new Date(endDateTime).getTime() > new Date(currentTime).getTime()
//               ? "Pending"
//               : "Overdue";

//         console.log("Status : ", status);
//         const updatedEvent = await eventAPI.updateEvent(event.id, { ...event, status: status });
//         dispatch(update(updatedEvent));
//       })
//     } catch (error) {
//       console.error('Error deleting habit:', error);
//     }
//   };
// };

export default eventSlice.reducer;
