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
import { GetOccasionReportUrl } from "../../../Constant/urls/urls";
import { setIsOccasionReportLoadingReducerData } from "../../../redux/reducer/ChildReducer/CommonLoaderReducer";
import { setOccasionReportReducerData } from "../../../redux/reducer/ChildReducer/OccasionReportReducer";
import {
  ConvertDateStrFunction,
  ConvertDateTimeStrFunction,
} from "../../../commonFunctions";

const OccasionReport = () => {
  const { ShowNotification } = useContext(MainContext);

  const { occasion_report_reducer_data } = useSelector(
    (state) => state.OccasionReportReducer
  );

  const { is_occasion_report_loading } = useSelector(
    (state) => state.CommonLoaderReducer
  );

  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [filterDates, setFilterDates] = useState({
    from_date: "",
    to_date: "",
  });

  useEffect(() => {
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
      name: "Type",
      selector: (row) => row?.type,
      width: "20%",
    },
    {
      name: "Date",
      selector: (row) => row?.date,
      width: "20%",
    },
    {
      name: "Name",
      selector: (row) => row?.person_name,
      width: "25%",
    },
    {
      name: "Phone",
      selector: (row) => row?.person_phone,
      width: "20%",
    },    
  ];

  const getOccasionReport = async () => {
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
        `${GetOccasionReportUrl}from_date=${ConvertDateStrFunction(
          filterDates?.from_date
        )}&to_date=${ConvertDateStrFunction(filterDates?.to_date)}`
      );
      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        if (result.data?.data) {
          dispatch(setOccasionReportReducerData(result.data?.data));
        }
      }
    } catch (error) {
      console.error("getOccasionReport Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    } finally {
      //   dispatch(setIsOccasionReportLoadingReducerData(false));
    }
  };

 
  return (
    <div className="cgm-purchase-section">
      <Grid container spaing={2} className="mb-2">
        <Grid item md={4} xs={6} className="text-end search-section">
          <section className="component-heading my-1">
            <FontAwesomeIcon icon={faFileLines} className="mx-2" /> Occasion
            Report
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
              onClick={() => getOccasionReport()}
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
                onClick={() => getOccasionReport()}
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
          data={occasion_report_reducer_data}
          className="dt-table-container"
          pagination
          //   paginationPerPage={categoryParam?.limit}
          //   paginationServer
          //   paginationTotalRows={kg_reducer_dataCount}
          //   onChangePage={handlePageChange}
          //   onChangeRowsPerPage={handleRowsPerPageChange}
          searchable
        />
      </div>
    </div>
  );
};

export default OccasionReport;
