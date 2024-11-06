import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  delivery_person_report_reducer_data: [],
};

const DeliveryPersonReportReducer = createSlice({
  name: "DeliveryPersonReportReducer",
  initialState,
  reducers: {
    setDeliveryPersonReportReducerData: (state, { type, payload }) => {
      return {
        ...state,
        delivery_person_report_reducer_data: payload,
      };
    },
    addDeliveryPersonReportReducerData: (state, { type, payload }) => {
      console.log("add payload ====", payload);
      return {
        ...state,
        delivery_person_report_reducer_data: [
          ...state?.delivery_person_report_reducer_data,
          payload,
        ],
      };
    },
    editDeliveryPersonReportReducerData: (state, { type, payload }) => {
      console.log("payload ====", payload);
      return {
        ...state,
        delivery_person_report_reducer_data: [
          ...state.delivery_person_report_reducer_data,
        ]?.map((obj) => (obj?.id === payload?.id ? payload : obj)),
      };
    },
  },
});

export const {
  setDeliveryPersonReportReducerData,
  addDeliveryPersonReportReducerData,
  editDeliveryPersonReportReducerData,
} = DeliveryPersonReportReducer?.actions;

export default DeliveryPersonReportReducer?.reducer;
