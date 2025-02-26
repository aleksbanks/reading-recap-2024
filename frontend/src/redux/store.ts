import { configureStore } from '@reduxjs/toolkit';
import yearReducer from './yearSlice';

export const store = configureStore({
  reducer: {
    year: yearReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 