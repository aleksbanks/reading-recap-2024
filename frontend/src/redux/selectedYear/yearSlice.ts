import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const yearSlice = createSlice({
  name: 'year',
  initialState: new Date().getFullYear(),
  reducers: {
    setYear: (_, action: PayloadAction<number>) => action.payload
  }
});

export const { setYear } = yearSlice.actions;
export default yearSlice.reducer; 