import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  is_category_loading: true,
  is_sub_category_loading: true,
  is_tag_loading: true,
  is_kg_loading: true,
  is_cake_loading: true,
  is_gallery_loading: true,
  is_cart_loading: true,
  is_orders_loading: true,
  is_offers_loading: true,
  is_customers_loading: true,
  is_delivery_person_loading: true,
  is_feedback_loading: true,
  is_config_loading: true,
  is_occasion_report_loading: true,
  is_delivery_person_report_loading: true,
  is_order_report_loading: true,
  is_Unit_loading: true,
  is_item_loading: true
};

const CommonLoaderReducer = createSlice({
  name: "CommonLoaderReducer",
  initialState,
  reducers: {
    setIsCategoryLoadingReducerData: (state, { type, payload }) => {
      return {
        ...state,
        is_category_loading: payload,
      };
    },
    setIsSubCategoryLoadingReducerData: (state, { type, payload }) => {
      return {
        ...state,
        is_sub_category_loading: payload,
      };
    },
    setIsTagLoadingReducerData: (state, { type, payload }) => {
      return {
        ...state,
        is_tag_loading: payload,
      };
    },
    setIsUnitLoadingReducerData: (state, { type, payload }) => {
      return {
        ...state,
        is_Unit_loading: payload,
      };
    },
    setIsKgLoadingReducerData: (state, { type, payload }) => {
      return {
        ...state,
        is_kg_loading: payload,
      };
    },
    setIsCakeLoadingReducerData: (state, { type, payload }) => {
      return {
        ...state,
        is_cake_loading: payload,
      };
    },
    setIsGalleryLoadingReducerData: (state, { type, payload }) => {
      return {
        ...state,
        is_gallery_loading: payload,
      };
    },
    setIsCartLoadingReducerData: (state, { type, payload }) => {
      return {
        ...state,
        is_cart_loading: payload,
      };
    },
    setIsOrdersLoadingReducerData: (state, { type, payload }) => {
      return {
        ...state,
        is_orders_loading: payload,
      };
    },
    setIsOffersLoadingReducerData: (state, { type, payload }) => {
      return {
        ...state,
        is_offers_loading: payload,
      };
    },
    setIsCustomersLoadingReducerData: (state, { type, payload }) => {
      return {
        ...state,
        is_customers_loading: payload,
      };
    },
    setIsDeliveryPersonLoadingReducerData: (state, { type, payload }) => {
      return {
        ...state,
        is_delivery_person_loading: payload,
      };
    },
    setIsFeedbackLoadingReducerData: (state, { type, payload }) => {
      return {
        ...state,
        is_feedback_loading: payload,
      };
    },
    setIsConfigLoadingReducerData: (state, { type, payload }) => {
      return {
        ...state,
        is_config_loading: payload,
      };
    },
    setIsOccasionReportLoadingReducerData: (state, { type, payload }) => {
      return {
        ...state,
        is_occasion_report_loading: payload,
      };
    },
    setIsDeliveryPersonReportLoadingReducerData: (state, { type, payload }) => {
      return {
        ...state,
        is_delivery_person_report_loading: payload,
      };
    },
    setIsOrderReportLoadingReducerData: (state, { type, payload }) => {
      return {
        ...state,
        is_order_report_loading: payload,
      };
    },
    setIsItemLoadingReducerData: (state, { type, payload }) => {
      return {
        ...state,
        is_item_loading: payload,
      };
    },
  },
});

export const {
  setIsCategoryLoadingReducerData,
  setIsSubCategoryLoadingReducerData,
  setIsTagLoadingReducerData,
  setIsKgLoadingReducerData,
  setIsCakeLoadingReducerData,
  setIsGalleryLoadingReducerData,
  setIsCartLoadingReducerData,
  setIsOrdersLoadingReducerData,
  setIsOffersLoadingReducerData,
  setIsCustomersLoadingReducerData,
  setIsDeliveryPersonLoadingReducerData,
  setIsFeedbackLoadingReducerData,
  setIsConfigLoadingReducerData,
  setIsOrderReportLoadingReducerData,
  setIsOccasionReportLoadingReducerData,
  setIsDeliveryPersonReportLoadingReducerData,
  setIsUnitLoadingReducerData,
  setIsItemLoadingReducerData
} = CommonLoaderReducer?.actions;

export default CommonLoaderReducer?.reducer;
