import {
  faEdit,
  faFileLines,
  faRefresh,
  faPlus,
  faTrash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Chip, Grid } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import EditOrders from "./EditOrders";
import MainContext from "../../context/MainContext";
import PreLoaderComponent from "../../common/PreLoaderComponent";
import { GetApi } from "../../hooks/Get/GetApi";
import { GetOrderUrl } from "../../Constant/urls/urls";
import { setOrdersReducerData } from "../../redux/reducer/ChildReducer/OrdersReducer";
import { convertDateFormat } from "../../commonFunctions";
import "./Orders.scss";
import BillView from "./BillView";
import { setIsOrdersLoadingReducerData } from "../../redux/reducer/ChildReducer/CommonLoaderReducer";

const Orders = () => {
  const { ShowNotification } = useContext(MainContext);

  //reducer Data
  const { orders_reducer_data } = useSelector((state) => state.OrdersReducer);
  const { is_orders_loading } = useSelector(
    (state) => state.CommonLoaderReducer
  );
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [editableData, setEditableData] = useState({});

  useEffect(() => {
    getOrders();
    window.getOrders = getOrders;
  }, []);

  const statusArray = [
    "",
    "Pending",
    "Order Placed",
    "Confirmed",
    "Preparing",
    "Ready",
    "Delivered",
    "Cancel Requested",
    "Cancelled",
    "Rejected",
  ];

  const categoryDTColumns = [
    {
      name: "ID",
      selector: (row) => row?.id,
      width: "5%",
    },
    {
      name: "Order Time",
      selector: (row) => convertDateFormat(row?.order_time),
      width: "10%",
    },
    {
      name: "Delivery Time",
      selector: (row) => convertDateFormat(row?.delivery_time),
      width: "10%",
    },
    {
      name: "Customer",
      selector: (row) => row?.id,
      width: "25%",
      cell: (row) => (
        <div className="text-left customer-info">
          <h4>{row?.customer?.name}</h4>
          <p>Mob: {row?.customer?.phone}</p>
          <p>Email: {row?.customer?.email}</p>
        </div>
      ),
    },
    {
      name: "Delivery Address",
      selector: (row) => row?.id,
      width: "25%",
      cell: (row) => (
        <div className="text-start address-info">
          <h4>{row?.delivery_address?.address_title}</h4>
          <p>{row?.delivery_address?.address}</p>
          <p>{row?.delivery_address?.pincode}</p>
        </div>
      ),
    },
    {
      name: (
        <>
          Item
          <br />
          Qty
        </>
      ),
      selector: (row) => row?.cart_id_list?.length,
      width: "5%",
    },
    // {
    //   name: "Cart Details",
    //   selector: (row) => (row?.id),
    //   width: "25%",
    //   cell: (row) => (
    //     <div className="text-start address-info">
    //       <h4>{row?.delivery_address?.address_title}</h4>
    //       <p>{row?.delivery_address?.address}</p>
    //       <p>{row?.delivery_address?.pincode}</p>
    //     </div>
    //   ),
    // },
    {
      name: "Order Status",
      selector: (row) => row?.image_url,
      minWidth: "15%",
      cell: (row) => (
        <div className="text-center">
          <Chip
            label={statusArray[row?.delivery_status]}
            color="secondary"
            style={{ borderRadius: "5px" }}
          />
        </div>
      ),
    },

    {
      name: "Action",
      minWidth: "10%",
      cell: (row) => (
        <div className="text-center">
          <Button
            variant="contained"
            color="primary"
            size="small"
            className="me-2"
            style={{
              textTransform: "none",
              borderRadius: "5px",
            }}
            onClick={() => {
              setShow(true);
              setEditableData(row);
            }}
          >
            <FontAwesomeIcon icon={faEye} className="me-2" />
            View
          </Button>
          {statusArray[row?.delivery_status] === "Delivered" && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              className="me-2"
              style={{
                textTransform: "none",
                borderRadius: "5px",
              }}
              onClick={() => {
                setShowBill(true);
                setEditableData(row);
              }}
            >
              <FontAwesomeIcon icon={faEye} className="me-2" />
              View Bill
            </Button>
          )}
        </div>
      ),
    },
  ];

  const getOrders = async () => {
    try {
      const result = await GetApi(GetOrderUrl);
      console.log("result=  = ", result);
      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setOrdersReducerData(result.data?.data));
      }
    } catch (error) {
      console.error("getOrders Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    } finally {
      dispatch(setIsOrdersLoadingReducerData(false));
    }
  };

  if (is_orders_loading) {
    return <PreLoaderComponent />;
  }

  return (
    <div className="cgm-purchase-section">
      <Grid container spaing={2} className="mb-2">
        <Grid item md={6} xs={6} className="text-end search-section">
          <section className="component-heading my-1">
            <FontAwesomeIcon icon={faFileLines} className="mx-2" /> Cake Orders
          </section>
        </Grid>
        <Grid item md={6} xs={6} className="text-end top-action-button-group">
          <div className="ml-auto">
            {/* <Button
              variant="contained"
              color="primary"
              size="small"
              style={{
                textTransform: "none",
                borderRadius: "5px",
              }}
              onClick={() => {
                setShow(true);
              }}
            >
              <FontAwesomeIcon icon={faPlus} className="mx-1" />
              Add Orders
            </Button> */}
            <Button
              variant="contained"
              color="success"
              className="mx-1"
              size="small"
              style={{
                textTransform: "none",
                borderRadius: "5px",
              }}
              onClick={() => getOrders()}
            >
              <FontAwesomeIcon icon={faRefresh} className="mx-1" />{" "}
              <span>Refresh</span>
            </Button>
          </div>
        </Grid>
      </Grid>

      <div className={`dt-table`}>
        <DataTable
          columns={categoryDTColumns}
          striped
          data={orders_reducer_data}
          className="dt-table-container"
          pagination
          //   paginationPerPage={categoryParam?.limit}
          //   paginationServer
          //   paginationTotalRows={orders_reducer_dataCount}
          //   onChangePage={handlePageChange}
          //   onChangeRowsPerPage={handleRowsPerPageChange}
          searchable
        />
      </div>

      <EditOrders
        show={show}
        setShow={setShow}
        editableData={editableData}
        setEditableData={setEditableData}
        statusArray={statusArray}
      />

      <BillView show={showBill} setShow={setShowBill} billData={editableData} />
    </div>
  );
};

export default Orders;
