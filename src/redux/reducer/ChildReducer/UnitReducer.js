import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  unit_reducer_data: [],
};

const UnitReducer = createSlice({
  name: "UnitReducer",
  initialState,
  reducers: {
    setUnitReducerData: (state, { type, payload }) => {
      return {
        ...state,
        unit_reducer_data: payload,
      };
    },
    addUnitReducerData: (state, { type, payload }) => {
      console.log("add payload ====", payload);
      return {
        ...state,
        unit_reducer_data: [...state?.unit_reducer_data, payload],
      };
    },
    editUnitReducerData: (state, { type, payload }) => {
      console.log("payload ====", payload);
      return {
        ...state,
        unit_reducer_data: [...state.unit_reducer_data]?.map((obj) =>
          obj?.id === payload?.id ? payload : obj
        ),
      };
    },
  },
});

export const { setUnitReducerData, addUnitReducerData, editUnitReducerData } =
  UnitReducer?.actions;

export default UnitReducer?.reducer;
