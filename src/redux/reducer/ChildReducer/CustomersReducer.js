import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customers_reducer_data: [],
};

const CustomersReducer = createSlice({
  name: "CustomersReducer",
  initialState,
  reducers: {
    setCustomersReducerData: (state, { type, payload }) => {
      return {
        ...state,
        customers_reducer_data: payload,
      };
    },
    addCustomersReducerData: (state, { type, payload }) => {
      return {
        ...state,
        customers_reducer_data: [...state?.customers_reducer_data, payload],
      };
    },
    editCustomersReducerData: (state, { type, payload }) => {
      return {
        ...state,
        customers_reducer_data: [...state.customers_reducer_data]?.map((obj) =>
          obj?.id === payload?.id ? payload : obj
        ),
      };
    },
  },
});

export const {
  setCustomersReducerData,
  addCustomersReducerData,
  editCustomersReducerData,
} = CustomersReducer?.actions;

export default CustomersReducer?.reducer;
