import { createSlice } from '@reduxjs/toolkit'

const modalSlice = createSlice({
  name: 'modal',
  initialState: false,
  reducers: {
    openModal: () => true,
    closeModal: () => false
  }
})

export const { openModal, closeModal } = modalSlice.actions
export default modalSlice.reducer