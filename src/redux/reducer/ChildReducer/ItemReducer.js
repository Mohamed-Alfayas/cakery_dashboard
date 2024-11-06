import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  item_reducer_data: [],
};

const ItemReducer = createSlice({
  name: "ItemReducer",
  initialState,
  reducers: {
    setItemReducerData: (state, { type, payload }) => {
      return {
        ...state,
        item_reducer_data: payload,
      };
    },
    addItemReducerData: (state, { type, payload }) => {
      return {
        ...state,
        item_reducer_data: [...state?.item_reducer_data, payload],
      };
    },
    editItemReducerData: (state, { type, payload }) => {
      return {
        ...state,
        item_reducer_data: [...state.item_reducer_data]?.map((obj) =>
          obj?.id === payload?.id ? payload : obj
        ),
      };
    },
  },
});

export const { setItemReducerData, addItemReducerData, editItemReducerData } =
  ItemReducer?.actions;

export default ItemReducer?.reducer;
