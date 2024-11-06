import { combineReducers } from "@reduxjs/toolkit";
import MainCategoryReducer from "../ChildReducer/MainCategoryReducer";
import KgReducer from "../ChildReducer/KgReducer";
import TagListReducer from "../ChildReducer/TagListReducer";
import SubCategoryReducer from "../ChildReducer/SubCategoryReducer";
import CakeListReducer from "../ChildReducer/CakeListReducer";
import GalleryListReducer from "../ChildReducer/GalleryListReducer";
import CartReducer from "../ChildReducer/CartReducer";
import CustomersReducer from "../ChildReducer/CustomersReducer";
import OrdersReducer from "../ChildReducer/OrdersReducer";
import DeliveryPersonReducer from "../ChildReducer/DeliveryPersonReducer";
import ConfigReducer from "../ChildReducer/ConfigReducer";
import FeedBackReducer from "../ChildReducer/FeedBackReducer";
import OffersReducer from "../ChildReducer/OffersReducer";
import CommonLoaderReducer from "../ChildReducer/CommonLoaderReducer";
import OccasionReportReducer from "../ChildReducer/OccasionReportReducer";
import DeliveryPersonReportReducer from "../ChildReducer/DeliveryPersonReportReducer";
import OrderReportReducer from "../ChildReducer/OrderReportReducer";
import UnitReducer from "../ChildReducer/UnitReducer";
import ItemReducer from "../ChildReducer/ItemReducer";
import PurchaseReducer from "../ChildReducer/PurchaseReducer";
import TaxCategoryReducer from "../ChildReducer/TaxCategoryReducer";
import PolicyReducer from "../ChildReducer/PolicyReducer";

export const MainReducer = combineReducers({
  MainCategoryReducer: MainCategoryReducer,
  SubCategoryReducer: SubCategoryReducer,
  TagListReducer: TagListReducer,
  KgReducer: KgReducer,
  CakeListReducer: CakeListReducer,
  GalleryListReducer: GalleryListReducer,
  CartReducer: CartReducer,
  CustomersReducer: CustomersReducer,
  OrdersReducer: OrdersReducer,
  DeliveryPersonReducer: DeliveryPersonReducer,
  ConfigReducer: ConfigReducer,
  FeedBackReducer: FeedBackReducer,
  OffersReducer: OffersReducer,
  CommonLoaderReducer: CommonLoaderReducer,
  OccasionReportReducer: OccasionReportReducer,
  DeliveryPersonReportReducer: DeliveryPersonReportReducer,
  OrderReportReducer: OrderReportReducer,
  UnitReducer: UnitReducer,
  ItemReducer: ItemReducer,
  TaxCategoryReducer: TaxCategoryReducer,
  PurchaseReducer:PurchaseReducer,
  PolicyReducer:PolicyReducer
});
