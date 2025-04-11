import { configureStore } from '@reduxjs/toolkit'
import habitReducer from './habitReducer';
import eventReducer from './eventReducer'

const store = configureStore({
  reducer: {
    habits: habitReducer,
    events: eventReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store