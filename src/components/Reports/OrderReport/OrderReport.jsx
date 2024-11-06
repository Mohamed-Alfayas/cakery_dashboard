import {
  faEdit,
  faFileLines,
  faRefresh,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Grid, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import MainContext from "../../../context/MainContext";
import { GetApi } from "../../../hooks/Get/GetApi";
import PreLoaderComponent from "../../../common/PreLoaderComponent";
import {
  GetOccasionReportUrl,
  GetOrderReportUrl,
} from "../../../Constant/urls/urls";
import { setIsOccasionReportLoadingReducerData } from "../../../redux/reducer/ChildReducer/CommonLoaderReducer";
import { setOccasionReportReducerData } from "../../../redux/reducer/ChildReducer/OccasionReportReducer";
import {
  ConvertDateStrFunction,
  ConvertDateTimeStrFunction,
  ISOformatDateTimeFunction,
} from "../../../commonFunctions";
import { setOrderReportReducerData } from "../../../redux/reducer/ChildReducer/OrderReportReducer";

const OrderReport = () => {
  const { ShowNotification } = useContext(MainContext);

  const { order_report_reducer_data } = useSelector(
    (state) => state.OrderReportReducer
  );

  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [filterDates, setFilterDates] = useState({
    from_date: "",
    to_date: "",
  });

  useEffect(() => {
    // getOrderReport();
    const formattedDateTime = new Date().toISOString().slice(0, 16);
    setFilterDates((prevDetails) => ({
      ...prevDetails,
      from_date: formattedDateTime,
      to_date: formattedDateTime
    }));
  }, []);

  const handleDateChange = (value, name) => {
    setFilterDates((oldData) => ({
      ...oldData,
      [name]: value,
    }));
  };
  
  const categoryDTColumns = [
    {
      name: "ID",
      selector: (row) => row?.id,
      width: "15%",
    },
    {
      name: "Customer Name",
      selector: (row) => row?.customer.name,
      width: "20%",
    },
    {
      name: "Address",
      selector: (row) => (
        <div className="text-center">
          <p>{row.delivery_address?.name}</p>
          <p>{row.delivery_address?.phone}</p>
          <p>{row.delivery_address?.email}</p>
        </div>
      ),
      width: "30%",
    },
    {
      name: "Delivery Person",
      selector: (row) => (
        <div className="text-center">
          <p>{row.delivery_person?.name}</p>
          <p>{row.delivery_person?.phone}</p>
        </div>
      ),
      width: "25%",
    },
    {
      name: "Order Time",
      selector: (row) => ISOformatDateTimeFunction(row?.order_time),
      width: "30%",
    },
    {
      name: "Delivered Time",
      selector: (row) => ISOformatDateTimeFunction(row?.delivery_time),
      width: "30%",
    },

  ];

  const getOrderReport = async () => {
    if (!filterDates?.from_date) {
      ShowNotification("error", "Please Select Report Start Date");
      return;
    }
    if (!filterDates?.to_date) {
      ShowNotification("error", "Please Select Report End Date");
      return;
    }
    try {
      const result = await GetApi(
        `${GetOrderReportUrl}from_date=${ConvertDateStrFunction(
          filterDates?.from_date
        )}&to_date=${ConvertDateStrFunction(filterDates?.to_date)}`
      );
      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        if (result.data?.data) {
          dispatch(setOrderReportReducerData(result.data?.data));
        }
      }
    } catch (error) {
      console.error("getOrderReport Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    } finally {
      //   dispatch(setIsOccasionReportLoadingReducerData(false));
    }
  };

  const handleDelete = (row) => {
    // const filterCategories = kg_reducer_data.filter((val) => val.id !== row.id);
  };

  //   if (is_occasion_report_loading) {
  //     return <PreLoaderComponent />;
  //   }
  return (
    <div className="reports-section">
      <Grid container spaing={2} className="mb-2">
        <Grid item md={4} xs={6} className="text-end search-section">
          <section className="component-heading my-1">
            <FontAwesomeIcon icon={faFileLines} className="mx-2" /> Order Report
          </section>
        </Grid>
        <Grid item md={8} xs={6} className="text-end top-action-button-group">
          <div className="ml-auto">

            <Button
              variant="contained"
              color="success"
              className=" mx-1"
              style={{
                textTransform: "none",
                borderRadius: "5px",
              }}
              onClick={() => getOrderReport()}
            >
              <FontAwesomeIcon icon={faRefresh} className="mx-1" />{" "}
              <span>Refresh</span>
            </Button>
          </div>
        </Grid>

        <Grid container spacing={2} className="my-3">

          <Grid item md={4}>
            <TextField
              id="from_date"
              className="my-2"
              label="Start Date"
              fullWidth
              size="small"
              required
              value={filterDates?.from_date || ""}
              onChange={(e) => {
                handleDateChange(e.target.value, "from_date");
              }}
              type="datetime-local"
            />
          </Grid>
          <Grid item md={4}>
            <TextField
              id="to_date"
              className="my-2"
              label="end Date"
              fullWidth
              size="small"
              required
              value={filterDates?.to_date || ""}
              onChange={(e) => {
                handleDateChange(e.target.value, "to_date");
              }}
              type="datetime-local"
            />
          </Grid>

          <Grid item md={4} xs={4} className="text-start d-flex align-items-center">
          <div className="d-flex align-items-center">
            <Button
              variant="contained"
              color="success"
              className=" mx-1"
              style={{
                textTransform: "none",
                borderRadius: "5px",
                display: "block"
              }}
              onClick={() => getOrderReport()}
            >
              <FontAwesomeIcon icon={faRefresh} className="mx-1" />{" "}
              <span>Filter</span>
            </Button>
          </div>
        </Grid>
        </Grid>
      </Grid>

      <div className={`dt-table`}>
        <DataTable
          columns={categoryDTColumns}
          striped
          data={order_report_reducer_data}
          className="dt-table-container"
          
          searchable
        />
      </div>
    </div>
  );
};

export default OrderReport;
