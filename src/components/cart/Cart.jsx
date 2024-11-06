import {
  faEdit,
  faFileLines,
  faRefresh,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Grid } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import EditCart from "./EditCart";
import { GetCartUrl } from "../../Constant/urls/urls";
import { setCartReducerData } from "../../redux/reducer/ChildReducer/CartReducer";
import MainContext from "../../context/MainContext";
import { GetApi } from "../../hooks/Get/GetApi";
import PreLoaderComponent from "../../common/PreLoaderComponent";
import { convertDateFormat } from "../../commonFunctions";
import { setIsCartLoadingReducerData } from "../../redux/reducer/ChildReducer/CommonLoaderReducer";

const Cart = () => {
  const { ShowNotification } = useContext(MainContext);

  //reducer Data
  const { cart_reducer_data } = useSelector((state) => state.CartReducer);
  const { is_cart_loading } = useSelector((state) => state.CommonLoaderReducer);
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [editableData, setEditableData] = useState({});

  useEffect(() => {
    getCart();
  }, []);

  const categoryDTColumns = [
    {
      name: "ID",
      selector: (row) => row?.id,
      minWidth: "10%",
    },

    {
      name: "Cart Item",
      selector: (row) => row?.cake_image,
      minWidth: "25%",
      cell: (row) => (
        <div className="text-start d-flex">
          <img
            src={row?.cake?.images?.[0]?.url}
            alt="cart"
            className="category-image me-2"
            style={{
              width: "40px",
              height: "40px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
          <div>
            <p className="m-0">
              <b>{row?.cake?.name}</b>
            </p>
            <p>{row?.cake?.sub_category?.name}</p>
          </div>
        </div>
      ),
    },
    {
      name: "KG",
      selector: (row) => row?.cake?.price_list?.kg + " Kg",
      minWidth: "5%",
    },
    {
      name: "Qty",
      selector: (row) => row?.qty,
      minWidth: "5%",
    },
    {
      name: "Occasion Date",
      selector: (row) => convertDateFormat(row?.occasion_date),
      minWidth: "5%",
    },
    {
      name: "Occasion Type",
      selector: (row) => row?.occasion_type,
      minWidth: "5%",
    },
  ];

  const getCart = async () => {
    try {
      const result = await GetApi(GetCartUrl);

      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setCartReducerData(result.data?.data));
      }
    } catch (error) {
      console.error("getCart Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    } finally {
      dispatch(setIsCartLoadingReducerData(false));
    }
  };

  const handleDelete = (row) => {
    // const filterCategories = cart_reducer_data.filter(
    //   (val) => val.id !== row.id
    // );
  };

  if (is_cart_loading) {
    return <PreLoaderComponent />;
  }
  return (
    <div className="cgm-purchase-section">
      <Grid container spaing={2} className="mb-2">
        <Grid item md={6} xs={6} className="text-end search-section">
          <section className="component-heading my-1">
            <FontAwesomeIcon icon={faFileLines} className="mx-2" /> Cart
          </section>
        </Grid>
        <Grid item md={6} xs={6} className="text-end top-action-button-group">
          <div className="ml-auto">
            <Button
              variant="contained"
              color="success"
              className="mx-1"
              size="small"
              style={{
                textTransform: "none",
                borderRadius: "5px",
              }}
              onClick={() => getCart()}
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
          data={cart_reducer_data}
          className="dt-table-container"
          pagination
          //   paginationPerPage={categoryParam?.limit}
          //   paginationServer
          //   paginationTotalRows={cart_reducer_dataCount}
          //   onChangePage={handlePageChange}
          //   onChangeRowsPerPage={handleRowsPerPageChange}
          searchable
        />
      </div>

      <EditCart
        show={show}
        setShow={setShow}
        editableData={editableData}
        setEditableData={setEditableData}
      />
    </div>
  );
};

export default Cart;
