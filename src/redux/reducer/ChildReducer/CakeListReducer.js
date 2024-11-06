import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cake_list_reducer_data: [],
};

const CakeListReducer = createSlice({
  name: "CakeListReducer",
  initialState,
  reducers: {
    setCakeListReducerData: (state, { type, payload }) => {
      return {
        ...state,
        cake_list_reducer_data: payload,
      };
    },
    addCakeListReducerData: (state, { type, payload }) => {
      return {
        ...state,
        cake_list_reducer_data: [...state?.cake_list_reducer_data, payload],
      };
    },
    editCakeListReducerData: (state, { type, payload }) => {
      return {
        ...state,
        cake_list_reducer_data: [...state.cake_list_reducer_data]?.map((obj) =>
          obj?.id === payload?.id ? payload : obj
        ),
      };
    },
  },
});

export const {
  setCakeListReducerData,
  addCakeListReducerData,
  editCakeListReducerData,
} = CakeListReducer?.actions;

export default CakeListReducer?.reducer;
