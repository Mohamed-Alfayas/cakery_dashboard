import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  delivery_person_reducer_data: [],
};

const DeliveryPersonReducer = createSlice({
  name: "DeliveryPersonReducer",
  initialState,
  reducers: {
    setDeliveryPersonReducerData: (state, { type, payload }) => {
      return {
        ...state,
        delivery_person_reducer_data: payload,
      };
    },
    addDeliveryPersonReducerData: (state, { type, payload }) => {
      console.log("add payload ====", payload);
      return {
        ...state,
        delivery_person_reducer_data: [
          ...state?.delivery_person_reducer_data,
          payload,
        ],
      };
    },
    editDeliveryPersonReducerData: (state, { type, payload }) => {
      console.log("payload ====", payload);
      return {
        ...state,
        delivery_person_reducer_data: [
          ...state.delivery_person_reducer_data,
        ]?.map((obj) => (obj?.id === payload?.id ? payload : obj)),
      };
    },
  },
});

export const {
  setDeliveryPersonReducerData,
  addDeliveryPersonReducerData,
  editDeliveryPersonReducerData,
} = DeliveryPersonReducer?.actions;

export default DeliveryPersonReducer?.reducer;
