import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tag_list_reducer_data: [],
};

const TaglistReducer = createSlice({
  name: "TaglistReducer",
  initialState,
  reducers: {
    setTaglistReducerData: (state, { type, payload }) => {
      return {
        ...state,
        tag_list_reducer_data: payload,
      };
    },
    addTaglistReducerData: (state, { type, payload }) => {
      console.log("add payload ====", payload);
      return {
        ...state,
        tag_list_reducer_data: [...state?.tag_list_reducer_data, payload],
      };
    },
    editTaglistReducerData: (state, { type, payload }) => {
      console.log("payload ====", payload);
      return {
        ...state,
        tag_list_reducer_data: [...state.tag_list_reducer_data]?.map((obj) =>
          obj?.id === payload?.id ? payload : obj
        ),
      };
    },
  },
});

export const {
  setTaglistReducerData,
  addTaglistReducerData,
  editTaglistReducerData,
} = TaglistReducer?.actions;

export default TaglistReducer?.reducer;
