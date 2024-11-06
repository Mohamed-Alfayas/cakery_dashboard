import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart_reducer_data: [],
};

const CartReducer = createSlice({
  name: "CartReducer",
  initialState,
  reducers: {
    setCartReducerData: (state, { type, payload }) => {
      return {
        ...state,
        cart_reducer_data: payload,
      };
    },
    addCartReducerData: (state, { type, payload }) => {
      return {
        ...state,
        cart_reducer_data: [...state?.cart_reducer_data, payload],
      };
    },
    editCartReducerData: (state, { type, payload }) => {
      return {
        ...state,
        cart_reducer_data: [...state.cart_reducer_data]?.map((obj) =>
          obj?.id === payload?.id ? payload : obj
        ),
      };
    },
  },
});

export const { setCartReducerData, addCartReducerData, editCartReducerData } =
  CartReducer?.actions;

export default CartReducer?.reducer;
