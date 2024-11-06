import { configureStore } from "@reduxjs/toolkit";
import { MainReducer } from "../reducer/ParentReducer/MainReducer";

export const store = configureStore({
  reducer: MainReducer,
});
