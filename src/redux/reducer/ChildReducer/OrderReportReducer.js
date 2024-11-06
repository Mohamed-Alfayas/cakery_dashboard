import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  order_report_reducer_data: [],
};

const OrderReportReducer = createSlice({
  name: "OrderReportReducer",
  initialState,
  reducers: {
    setOrderReportReducerData: (state, { type, payload }) => {
      return {
        ...state,
        order_report_reducer_data: payload,
      };
    },
    addOrderReportReducerData: (state, { type, payload }) => {
      console.log("add payload ====", payload);
      return {
        ...state,
        order_report_reducer_data: [
          ...state?.order_report_reducer_data,
          payload,
        ],
      };
    },
    editOrderReportReducerData: (state, { type, payload }) => {
      console.log("payload ====", payload);
      return {
        ...state,
        order_report_reducer_data: [...state.order_report_reducer_data]?.map(
          (obj) => (obj?.id === payload?.id ? payload : obj)
        ),
      };
    },
  },
});

export const {
  setOrderReportReducerData,
  addOrderReportReducerData,
  editOrderReportReducerData,
} = OrderReportReducer?.actions;

export default OrderReportReducer?.reducer;
