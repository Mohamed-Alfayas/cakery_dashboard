import { createContext } from "react";
//Components
import Home from "../components/home/Home";
import Profile from "../components/profile/Profile";

/* Font Awesome */
import {
  faUser,
  faHomeAlt,
  faUserTag,
  faCakeCandles,
  faImage,
  faPercentage,
  faTags,
  faWeightScale,
  faLayerGroup,
  faCartFlatbed,
  faChartLine,
  faCartShopping,
  faUserGroup,
  faGears,
  faMessage,
  faChartBar,
  faTruck,
  faBasketShopping,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import Category from "../components/master/Category/Category";
import SubCategory from "../components/master/SubCategories/SubCategory";
import TagsComponent from "../components/master/Tags/Tags";
import KGComponent from "../components/master/KG/KG";
import CakeComponent from "../components/master/Cake/Cake";
import GalleryComponent from "../components/master/Gallery/Gallery";
import Cart from "../components/cart/Cart";
import Customers from "../components/customers/Customers";
import Orders from "../components/orders/Orders";
import Config from "../components/config/Config";
import DeliveryPerson from "../components/deliveryPerson/DeliveryPerson";
import FeedBack from "../components/feedBack/FeedBack";
import Offers from "../components/offers/Offers";
import OccasionReport from "../components/Reports/OccasionReport/OccasionReport";
import DeliveryPersonReport from "../components/Reports/DeliveryPersonReport/DeliveryPersonReport";
import OrderReport from "../components/Reports/OrderReport/OrderReport";
import UnitComponent from "../components/master/Unit/Unit";
import ItemComponent from "../components/Item/Item";
import Purchase from "../components/purchase/Purchase";
import Sales from "../components/sales/Sales";
import PurchaseHome from "../components/purchase/PurchaseHome";
import Terms from "../components/Terms&condtions/Terms";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const RoutesList = [
    {
      label: "Home",
      key: "home",
      heading_name: "Dashboard",
      link: "/",
      icon: faHomeAlt,
      element: Home,
      accessRoles: "all",
    },
    {
      label: "Master",
      heading_name: "Master",
      key: "master",
      icon: faCartFlatbed,
      subMenu: [
        {
          label: "Categories",
          key: "categories",
          link: "/categories",
          icon: faLayerGroup,
          element: Category,
          accessRoles: "all",
        },
        {
          label: "Sub Categories",
          key: "sub_categories",
          link: "/subcategories",
          icon: faLayerGroup,
          element: SubCategory,
          accessRoles: "all",
        },
        {
          label: "Tags",
          key: "tags",
          link: "/tags",
          icon: faTags,
          element: TagsComponent,
          accessRoles: "all",
        },
        {
          label: "Unit",
          key: "unit",
          link: "/unit",
          icon: faWeightScale,
          element: UnitComponent,
          accessRoles: "all",
        },
        {
          label: "Sub Unit",
          key: "sub-unit",
          link: "/sub-unit",
          icon: faWeightScale,
          element: KGComponent,
          accessRoles: "all",
        },
        {
          label: "Products",
          key: "products",
          link: "/products",
          icon: faBasketShopping,
          element: CakeComponent,
          accessRoles: "all",
        },
        {
          label: "Item",
          key: "item",
          link: "/item",
          icon: faBasketShopping,
          element: ItemComponent,
          accessRoles: "all",
        },
        {
          label: "Gallery",
          key: "gallery",
          link: "/gallery",
          icon: faImage,
          element: GalleryComponent,
          accessRoles: "all",
        },
       
      ],
    },
    {
      label: "Purchase",
      key: "purchase",
      link: "/purchase",
      icon: faReceipt,
      element: PurchaseHome,
      accessRoles: "all",
    },
    // {
    //   label: "Sales",
    //   key: "sales",
    //   link: "/sales",
    //   icon: faReceipt,
    //   element: Sales,
    //   accessRoles: "all",
    // },
    {
      label: "Cart",
      key: "cart",
      link: "/cart",
      icon: faCartShopping,
      element: Cart,
      accessRoles: "all",
    },
    {
      label: "Orders",
      key: "orders",
      link: "/orders",
      icon: faUser,
      element: Orders,
      accessRoles: "all",
    },
    {
      label: "Offers",
      key: "offers",
      link: "/offers",
      icon: faPercentage,
      element: Offers,
      accessRoles: "all",
    },
    {
      label: "Customers",
      key: "customers",
      link: "/customers",
      icon: faUserGroup,
      element: Customers,
      accessRoles: "all",
    },
    {
      label: "Delivery Person",
      key: "delivery_person",
      link: "/delivery_person",
      icon: faTruck,
      element: DeliveryPerson,
      accessRoles: "all",
    },
    {
      label: "FeedBack",
      key: "feedback",
      link: "/feedback",
      icon: faMessage,
      element: FeedBack,
      accessRoles: "all",
    },
    {
      label: "Configuration",
      key: "configuration",
      link: "/configuration",
      icon: faGears,
      element: Config,
      accessRoles: "all",
    },
    {
      label: "Terms&Conditions",
      key: "Terms&Conditions",
      link: "/Terms&Conditions",
      icon: faGears,
      element: Terms,
      accessRoles: "all",
    },
    {
      label: "Reports",
      heading_name: "Reports",
      key: "reports",
      icon: faChartLine,
      subMenu: [
        {
          label: "Occasion Reports",
          key: "occasion_reports",
          link: "/occasion_reports",
          icon: faChartBar,
          element: OccasionReport,
          accessRoles: "all",
        },
        {
          label: "Delivery Person Reports",
          key: "delivery_person_reports",
          link: "/delivery_person_reports",
          icon: faChartBar,
          element: DeliveryPersonReport,
          accessRoles: "all",
        },
        {
          label: "Order Reports",
          key: "order_reports",
          link: "/order_reports",
          icon: faChartBar,
          element: OrderReport,
          accessRoles: "all",
        },
      ],
    },
    {
      label: "Profile",
      key: "profile",
      heading_name: "Profile",
      link: "/profile",
      icon: faUser,
      element: Profile,
      accessRoles: "all",
    },
  ];

  return (
    <DataContext.Provider value={{ RoutesList }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
