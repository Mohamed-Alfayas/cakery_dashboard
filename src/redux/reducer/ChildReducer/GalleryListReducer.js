import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  gallery_list_reducer_data: [],
};

const GalleryListReducer = createSlice({
  name: "GalleryListReducer",
  initialState,
  reducers: {
    setGalleryListReducerData: (state, { type, payload }) => {
      return {
        ...state,
        gallery_list_reducer_data: payload,
      };
    },
    addGalleryListReducerData: (state, { type, payload }) => {
      return {
        ...state,
        gallery_list_reducer_data: [
          ...state?.gallery_list_reducer_data,
          payload,
        ],
      };
    },
    editGalleryListReducerData: (state, { type, payload }) => {
      return {
        ...state,
        gallery_list_reducer_data: [...state.gallery_list_reducer_data]?.map(
          (obj) => (obj?.id === payload?.id ? payload : obj)
        ),
      };
    },
  },
});

export const {
  setGalleryListReducerData,
  addGalleryListReducerData,
  editGalleryListReducerData,
} = GalleryListReducer?.actions;

export default GalleryListReducer?.reducer;
