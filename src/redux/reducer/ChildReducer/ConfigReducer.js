import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  config_reducer_data: [],
};

const ConfigReducer = createSlice({
  name: "ConfigReducer",
  initialState,
  reducers: {
    setConfigReducerData: (state, { type, payload }) => {
      return {
        ...state,
        config_reducer_data: payload,
      };
    },
    addConfigReducerData: (state, { type, payload }) => {
      return {
        ...state,
        config_reducer_data: [...state?.config_reducer_data, payload],
      };
    },
    editConfigReducerData: (state, { type, payload }) => {
      return {
        ...state,
        config_reducer_data: [...state.config_reducer_data]?.map((obj) =>
          obj?.id === payload?.id ? payload : obj
        ),
      };
    },
  },
});

export const {
  setConfigReducerData,
  addConfigReducerData,
  editConfigReducerData,
} = ConfigReducer?.actions;

export default ConfigReducer?.reducer;
