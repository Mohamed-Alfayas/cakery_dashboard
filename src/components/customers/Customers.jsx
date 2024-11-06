import {
  faEdit,
  faFileLines,
  faRefresh,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Chip, Grid } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { GetApi } from "../../hooks/Get/GetApi";
import { GetCustomersUrl } from "../../Constant/urls/urls";
import { setCustomersReducerData } from "../../redux/reducer/ChildReducer/CustomersReducer";
import MainContext from "../../context/MainContext";
import PreLoaderComponent from "../../common/PreLoaderComponent";
import ViewCustomers from "./ViewCustomers";
import { setIsCustomersLoadingReducerData } from "../../redux/reducer/ChildReducer/CommonLoaderReducer";

const Customers = () => {
  const { ShowNotification } = useContext(MainContext);

  //reducer Data
  const { customers_reducer_data } = useSelector(
    (state) => state.CustomersReducer
  );
  const { is_customers_loading } = useSelector(
    (state) => state.CommonLoaderReducer
  );
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [customerData, setCustomerData] = useState({});

  useEffect(() => {
    getCustomers();
  }, []);

  const categoryDTColumns = [
    {
      name: "ID",
      selector: (row) => row?.id,
      width: "10%",
    },
    {
      name: "Customer Name",
      selector: (row) => row?.name,
      minWidth: "10%",
    },
    {
      name: "Active Customer",
      selector: (row) => (row?.is_active ? "yes" : "no"),
      minWidth: "10%",
      selector: (row) => (
        <div>
          {row?.is_active ? (
            <Chip
              label="Active"
              color="success"
              style={{ borderRadius: "5px" }}
            />
          ) : (
            <Chip
              label="In-Active"
              color="error"
              style={{ borderRadius: "5px" }}
            />
          )}
        </div>
      ),
    },
    {
      name: "Email",
      selector: (row) => row?.email,
      minWidth: "15%",
    },
    {
      name: "Mobile Number",
      selector: (row) => row?.phone ?? "-",
      minWidth: "10%",
    },
    // {
    //   name: "Action",
    //   selector: (row) => (
    //     <div>
    //       <Button variant="contained" size={"small"} onClick={() => handleCustomerData(row)}>View</Button>
    //     </div>
    //   ),
    //   minWidth: "10%",
    // },
  ];

  const getCustomers = async () => {
    try {
      const result = await GetApi(GetCustomersUrl);
      console.log("result ==", result.data?.data);
      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setCustomersReducerData(result.data?.data));
      }
    } catch (error) {
      console.error("getCustomers Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    } finally {
      dispatch(setIsCustomersLoadingReducerData(false));
    }
  };

  const handleCustomerData = (row) => {
    setCustomerData(row);
    setShow(true);
  };
  const handleDelete = (row) => {
    // const filterCategories = customers_reducer_data.filter(
    //   (val) => val.id !== row.id
    // );
  };

  if (is_customers_loading) {
    return <PreLoaderComponent />;
  }

  return (
    <div className="cgm-purchase-section">
      <Grid container spaing={2} className="mb-2">
        <Grid item md={6} xs={6} className="text-end search-section">
          <section className="component-heading my-1">
            <FontAwesomeIcon icon={faFileLines} className="mx-2" /> Customers
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
              Add Customers
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
              onClick={() => getCustomers()}
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
          data={customers_reducer_data}
          className="dt-table-container"
          pagination
          //   paginationPerPage={categoryParam?.limit}
          //   paginationServer
          //   paginationTotalRows={customers_reducer_dataCount}
          //   onChangePage={handlePageChange}
          //   onChangeRowsPerPage={handleRowsPerPageChange}
          searchable
        />
      </div>

      <ViewCustomers
        show={show}
        setShow={setShow}
        customerData={customerData}
      />
    </div>
  );
};

export default Customers;
