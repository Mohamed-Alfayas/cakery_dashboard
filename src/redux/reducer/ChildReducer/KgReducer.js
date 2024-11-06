import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  kg_reducer_data: [],
};

const KgReducer = createSlice({
  name: "KgReducer",
  initialState,
  reducers: {
    setKgReducerData: (state, { type, payload }) => {
      return {
        ...state,
        kg_reducer_data: payload,
      };
    },
    addKgReducerData: (state, { type, payload }) => {
      return {
        ...state,
        kg_reducer_data: [...state?.kg_reducer_data, payload],
      };
    },
    editKgReducerData: (state, { type, payload }) => {
      return {
        ...state,
        kg_reducer_data: [...state.kg_reducer_data]?.map((obj) =>
          obj?.id === payload?.id ? payload : obj
        ),
      };
    },
  },
});

export const { setKgReducerData, addKgReducerData, editKgReducerData } =
  KgReducer?.actions;

export default KgReducer?.reducer;
