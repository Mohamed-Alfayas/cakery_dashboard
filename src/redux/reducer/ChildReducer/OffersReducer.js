import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  offers_reducer_data: [],
};

const OffersReducer = createSlice({
  name: "OffersReducer",
  initialState,
  reducers: {
    setOffersReducerData: (state, { type, payload }) => {
      return {
        ...state,
        offers_reducer_data: payload,
      };
    },
    addOffersReducerData: (state, { type, payload }) => {
      console.log("add payload ====", payload);
      return {
        ...state,
        offers_reducer_data: [...state?.offers_reducer_data, payload],
      };
    },
    editOffersReducerData: (state, { type, payload }) => {
      console.log("payload ====", payload);
      return {
        ...state,
        offers_reducer_data: [...state.offers_reducer_data]?.map((obj) =>
          obj?.id === payload?.id ? payload : obj
        ),
      };
    },
  },
});

export const {
  setOffersReducerData,
  addOffersReducerData,
  editOffersReducerData,
} = OffersReducer?.actions;

export default OffersReducer?.reducer;
