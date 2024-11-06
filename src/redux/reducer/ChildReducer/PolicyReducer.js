import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  policy_reducer_data: [],
  terms_reducer_data: [],
};

const PolicyReducer = createSlice({
  name: "PolicyReducer",
  initialState,
  reducers: {
    setPolicyReducerData: (state, { type, payload }) => {
      return {
        ...state,
        policy_reducer_data: payload,
      };
    },
    setTermsReducerData: (state, { type, payload }) => {
      return {
        ...state,
        terms_reducer_data: payload,
      };
    },
  },
});

export const { setPolicyReducerData, setTermsReducerData } =
  PolicyReducer?.actions;

export default PolicyReducer?.reducer;
