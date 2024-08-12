import { createSlice } from "@reduxjs/toolkit";
const initialState = {
show:[],
totalAmount:0,

}
export const cartSlice = createSlice({
    name: "cart",
  initialState,
  reducers: {
    setShow: (state, action) => {
        state.show = action.payload;
      },
      setTotalAmount: (state, action) => {
        state.totalAmount = action.payload;
      },
    
  }
})
export const { setShow } = cartSlice.actions;
export const { setTotalAmount } = cartSlice.actions;

export default cartSlice.reducer;