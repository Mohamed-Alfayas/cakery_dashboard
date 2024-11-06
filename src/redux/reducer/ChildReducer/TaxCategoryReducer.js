import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tax_category_reducer_data: [],
};

const TaxCategoryReducer = createSlice({
  name: "TaxCategoryReducer",
  initialState,
  reducers: {
    setTaxCategoryReducerData: (state, { type, payload }) => {
      return {
        ...state,
        tax_category_reducer_data: payload,
      };
    },
    addTaxCategoryReducerData: (state, { type, payload }) => {
      return {
        ...state,
        tax_category_reducer_data: [
          ...state?.tax_category_reducer_data,
          payload,
        ],
      };
    },
    editTaxCategoryReducerData: (state, { type, payload }) => {
      console.log("payload ====", payload);
      return {
        ...state,
        tax_category_reducer_data: [...state.tax_category_reducer_data]?.map(
          (obj) => (obj?.id === payload?.id ? payload : obj)
        ),
      };
    },
  },
});

export const {
  setTaxCategoryReducerData,
  addTaxCategoryReducerData,
  editTaxCategoryReducerData,
} = TaxCategoryReducer?.actions;

export default TaxCategoryReducer?.reducer;
