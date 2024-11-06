import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sub_category_reducer_data: [],
};

const SubCategoryReducer = createSlice({
  name: "SubCategoryReducer",
  initialState,
  reducers: {
    setSubCategoryReducerData: (state, { type, payload }) => {
      return {
        ...state,
        sub_category_reducer_data: payload,
      };
    },
    addSubCategoryReducerData: (state, { type, payload }) => {
      return {
        ...state,
        sub_category_reducer_data: [
          ...state?.sub_category_reducer_data,
          payload,
        ],
      };
    },
    editSubCategoryReducerData: (state, { type, payload }) => {
      console.log("payload ====", payload);
      return {
        ...state,
        sub_category_reducer_data: [...state.sub_category_reducer_data]?.map(
          (obj) => (obj?.id === payload?.id ? payload : obj)
        ),
      };
    },
  },
});

export const {
  setSubCategoryReducerData,
  addSubCategoryReducerData,
  editSubCategoryReducerData,
} = SubCategoryReducer?.actions;

export default SubCategoryReducer?.reducer;
