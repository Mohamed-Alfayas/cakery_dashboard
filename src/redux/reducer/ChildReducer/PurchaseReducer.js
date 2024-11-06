import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  purchase_reducer_data: [],
};

const PurchaseReducer = createSlice({
  name: "PurchaseReducer",
  initialState,
  reducers: {
    setPurchaseBillReducerData: (state, { type, payload }) => {
      return {
        ...state,
        purchase_bill_reducer_data: payload,
      };
    },
    setPurchaseReducerData: (state, { type, payload }) => {
      return {
        ...state,
        purchase_reducer_data: payload,
      };
    },
    addPurchaseReducerData: (state, { type, payload }) => {
      return {
        ...state,
        purchase_reducer_data: [...state?.purchase_reducer_data, payload],
      };
    },
    editPurchaseReducerData: (state, { type, payload }) => {
      return {
        ...state,
        purchase_reducer_data: [...state.purchase_reducer_data]?.map((obj) =>
          obj?.id === payload?.id ? payload : obj
        ),
      };
    },
  },
});

export const {
    setPurchaseBillReducerData,
    setPurchaseReducerData,
    addPurchaseReducerData,
    editPurchaseReducerData,
} = PurchaseReducer?.actions;

export default PurchaseReducer?.reducer;
