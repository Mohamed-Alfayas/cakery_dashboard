import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders_reducer_data: [],
};

const OrdersReducer = createSlice({
  name: "OrdersReducer",
  initialState,
  reducers: {
    setOrdersReducerData: (state, { type, payload }) => {
      return {
        ...state,
        orders_reducer_data: payload,
      };
    },
    addOrdersReducerData: (state, { type, payload }) => {
      return {
        ...state,
        orders_reducer_data: [...state?.orders_reducer_data, payload],
      };
    },
    editOrdersReducerData: (state, { type, payload }) => {
      return {
        ...state,
        orders_reducer_data: [...state.orders_reducer_data]?.map((obj) =>
          obj?.id === payload?.id ? payload : obj
        ),
      };
    },
  },
});

export const {
  setOrdersReducerData,
  addOrdersReducerData,
  editOrdersReducerData,
} = OrdersReducer?.actions;

export default OrdersReducer?.reducer;
