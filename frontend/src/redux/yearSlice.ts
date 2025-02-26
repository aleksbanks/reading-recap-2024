import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

const yearSlice = createSlice({
  name: 'year',
  initialState: new Date().getFullYear(),
  reducers: {
    setYear: (_, action: PayloadAction<number>) => action.payload
  }
});

export const { setYear } = yearSlice.actions;
export const selectYear = (state: RootState) => state.year;
export default yearSlice.reducer; 