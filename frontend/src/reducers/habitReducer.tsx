import { createSlice } from '@reduxjs/toolkit';
import habitAPI from '../APIs/habitAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HabitData } from '../types/types';
import { AppDispatch, RootState } from './store';
import { getLocalTimeWithTimezone } from '../utils/getLocalTimeZoneTime';
// Define initial state
const initialState: HabitData[] = [];

// Create habit slice
const habitSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    updateProgress(state, action) {
      const { id, time, progress } = action.payload;
      const habit = state.find(h => h._id === id);
      if (habit) {
        habit.habit_accumulating_time = habit.habit_accumulating_time + time;
        habit.habit_progress = progress;
      }
    },
    update(state, action) {
      const updatedHabit = action.payload;
      return state.map(habit =>
      (habit._id === updatedHabit._id ?
        updatedHabit
        : habit));
    },
    updateStatus(state, action) {
      return action.payload;
    },
    create(state, action) {
      state.push(action.payload);
    },
    initialHabits(state, action) {
      return action.payload;
    },
    removeHabit(state, action) {
      return state.filter(habit => habit._id !== action.payload);
    }
  }
});

export const { updateProgress, update, updateStatus, create, initialHabits, removeHabit } = habitSlice.actions;

const saveHabitsToStorage = async (habits: HabitData[]) => {
  try {
    await AsyncStorage.setItem('habits', JSON.stringify(habits));
  } catch (error) {
    console.error('Error saving habits to AsyncStorage:', error);
  }
};

const saveUpdatedHabits = async (getState: () => RootState) => {
  const updatedeHabits = getState().habits;
  await saveHabitsToStorage(updatedeHabits);
};

// Async Thunks
export const initializeHabits = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const storedHabits = await AsyncStorage.getItem('habits');
      const habits = storedHabits ? JSON.parse(storedHabits) : await habitAPI.getHabits();
      dispatch(initialHabits(habits));
      await AsyncStorage.setItem('habits', JSON.stringify(habits));
    } catch (error) {
      console.error('Error initializing habits:', error);
    }
  };
};

export const createHabit = (content: HabitData) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const newHabit = await habitAPI.createHabit(content);
      dispatch(create(newHabit));

      await saveUpdatedHabits(getState)
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };
};

export const updatedHabit = (id: string, updatedHabit: HabitData) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const updatingHabit = await habitAPI.updateHabit(id, updatedHabit);
      dispatch(update(updatingHabit));

      await saveUpdatedHabits(getState)
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  };
};

export const deleteHabit = (id: string) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      await habitAPI.deleteHabit(id);
      dispatch(removeHabit(id));

      await saveUpdatedHabits(getState)
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };
};

export const updateHabitsStatus = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const habits = getState().habits;

      const updatedHabits = await Promise.all(
        habits.map(async (habit) => {
          const isCheckedToday = habit.checked_dates.some(
            (date) => date.split("T")[0] === today
          );

          if (habit.is_checked === isCheckedToday) {
            return habit;
          }

          const updatedHabit = await habitAPI.updateHabit(habit._id, {
            ...habit,
            is_checked: isCheckedToday,
          });
          return updatedHabit;
        })
      );

      const actuallyUpdatedHabits = updatedHabits.filter(
        (habit, index) => habit !== habits[index]
      );

      if (actuallyUpdatedHabits.length > 0) {
        actuallyUpdatedHabits.forEach((habit) => {
          dispatch(update(habit));
        });
      }

      await saveUpdatedHabits(getState)
    } catch (error) {
      console.error('Error updating habits status:', error);
    }
  };
};


export default habitSlice.reducer;
