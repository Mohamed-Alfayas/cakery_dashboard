import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  feedback_reducer_data: [],
};

const FeedBackReducer = createSlice({
  name: "FeedBackReducer",
  initialState,
  reducers: {
    setFeedBackReducerData: (state, { type, payload }) => {
      return {
        ...state,
        feedback_reducer_data: payload,
      };
    },
    addFeedBackReducerData: (state, { type, payload }) => {
      console.log("add payload ====", payload);
      return {
        ...state,
        feedback_reducer_data: [...state?.feedback_reducer_data, payload],
      };
    },
    editFeedBackReducerData: (state, { type, payload }) => {
      console.log("payload ====", payload);
      return {
        ...state,
        feedback_reducer_data: [...state.feedback_reducer_data]?.map((obj) =>
          obj?.id === payload?.id ? payload : obj
        ),
      };
    },
  },
});

export const {
  setFeedBackReducerData,
  addFeedBackReducerData,
  editFeedBackReducerData,
} = FeedBackReducer?.actions;

export default FeedBackReducer?.reducer;
