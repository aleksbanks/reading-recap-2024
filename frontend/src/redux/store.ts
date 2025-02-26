import { configureStore } from '@reduxjs/toolkit';
import yearReducer from './selectedYear/yearSlice';
import modalReducer from './modal/modalSlice';

export const store = configureStore({
  reducer: {
    year: yearReducer,
    modal: modalReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 