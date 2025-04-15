import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
//Khoi tao gia tri cua mot Slice trong redux
const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false
}
// Khai tao mot slice trong kho luu tru - redux store
export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  //Synchronous (Đồng bộ)
  reducers: {
    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true
    },
    clearAndHideCurrentActiveCard: (state) => {
      state.currentActiveCard = null
      state.isShowModalActiveCard = false
    },
    updateCurrentActiveCard: (state, action) => {
      const fullCard = action.payload
      state.currentActiveCard = fullCard
    }
  },
  //Asynchronous (Bất đồng bộ)
  extraReducers: (builder) => { }
})

export const { clearAndHideCurrentActiveCard, updateCurrentActiveCard, showModalActiveCard } = activeCardSlice.actions

export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}

export const selectIsShowModalActiveCard = (state) => {
  return state.activeCard.isShowModalActiveCard
}

export const activeCardReducer = activeCardSlice.reducer