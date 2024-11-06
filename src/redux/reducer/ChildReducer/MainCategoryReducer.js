import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  main_category_reducer_data: [],
};

const MainCategoryReducer = createSlice({
  name: "MainCategoryReducer",
  initialState,
  reducers: {
    setMainCategoryReducerData: (state, { type, payload }) => {
      console.log("setPayload ====", payload);
      return {
        ...state,
        main_category_reducer_data: payload,
      };
    },
    addMainCategoryReducerData: (state, { type, payload }) => {
      console.log("add payload ====", payload);
      return {
        ...state,
        main_category_reducer_data: [
          ...state?.main_category_reducer_data,
          payload,
        ],
      };
    },
    editMainCategoryReducerData: (state, { type, payload }) => {
      console.log("edit payload ====", payload);
      return {
        ...state,
        main_category_reducer_data: [...state.main_category_reducer_data]?.map(
          (obj) => (obj?.id === payload?.id ? payload : obj)
        ),
      };
    },
  },
});

export const {
  setMainCategoryReducerData,
  addMainCategoryReducerData,
  editMainCategoryReducerData,
} = MainCategoryReducer?.actions;

export default MainCategoryReducer?.reducer;
