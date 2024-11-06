import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  occasion_report_reducer_data: [],
};

const OccasionReportReducer = createSlice({
  name: "OccasionReportReducer",
  initialState,
  reducers: {
    setOccasionReportReducerData: (state, { type, payload }) => {
      return {
        ...state,
        occasion_report_reducer_data: payload,
      };
    },
    addOccasionReportReducerData: (state, { type, payload }) => {
      console.log("add payload ====", payload);
      return {
        ...state,
        occasion_report_reducer_data: [
          ...state?.occasion_report_reducer_data,
          payload,
        ],
      };
    },
    editOccasionReportReducerData: (state, { type, payload }) => {
      console.log("payload ====", payload);
      return {
        ...state,
        occasion_report_reducer_data: [
          ...state.occasion_report_reducer_data,
        ]?.map((obj) => (obj?.id === payload?.id ? payload : obj)),
      };
    },
  },
});

export const {
  setOccasionReportReducerData,
  addOccasionReportReducerData,
  editOccasionReportReducerData,
} = OccasionReportReducer?.actions;

export default OccasionReportReducer?.reducer;
