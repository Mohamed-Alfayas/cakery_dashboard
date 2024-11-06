import { Add } from "@mui/icons-material";
import { Button, Fab, Grid, TextField } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { GetPurchase } from "../../Constant/urls/urls";
import { GetApi } from "../../hooks/Get/GetApi";
import { setPurchaseReducerData } from "../../redux/reducer/ChildReducer/PurchaseReducer";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import Purchase from "./Purchase";
import MainContext from "../../context/MainContext";
import { formatDate, formatLocalDate } from "../../utils/commonFunctions";
import { DateRangePicker } from "react-date-range";
import { useNavigate } from "react-router";

const PurchaseHome = () => {

  const navigate = useNavigate();

  const { purchase_reducer_data } = useSelector(
    (state) => state.PurchaseReducer
  );

  const dispatch = useDispatch();
  const { setIsPreLoading, ShowNotification } = useContext(MainContext);
  const [show, setShow] = useState(false);
  const [editableData, setEditableData] = useState(null);

  const getPurchaseData = async (startDate, endDate, page, pageSize) => {
    try {
      setIsPreLoading(true)
      let url = GetPurchase;
      if (startDate && endDate) {
        url += `?start_date=${startDate}&end_date=${endDate}&page=${page || 1}&page_size=${pageSize || 10}`;
      }

      const result = await GetApi(url);

      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setPurchaseReducerData(result.data?.results?.data));
        setTotalLength(result.data?.results?.total_length)
      }
    } catch (error) {
      console.error("get Items Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    } finally {
      setIsPreLoading(false)
    }
  };

  useEffect(() => {
    getPurchaseData();
  }, []);

  const PurchaseDataColumns = [
    {
      name: "ID",
      selector: (row) => row?.id,
      width: "10%",
    },
    {
      name: "Date",
      selector: (row) => formatDate(row?.created_at),
      width: "15%",
    },
    {
      name: "Invoice Date",
      selector: (row) => row?.invoice_date,
      width: "15%",
    },

    {
      name: "Invoice Number",
      selector: (row) => row?.invoice_number,
      width: "15%",
    },
    {
      name: "Total",
      selector: (row) => row?.total_amount,
      width: "15%",
    },

    {
      name: "Payment Type",
      selector: (row) => row?.payment_type,
      width: "15%",
    },

    {
      name: "Action",
      minWidth: "10%",
      cell: (row) => (
        <div className="text-center">
          <Fab
            size="medium"
            color="secondary"
            aria-label="add"
            className="me-2 table-fab-buttons"
            onClick={() => {
              setShow(true);
              setEditableData(row);
            }}
          >
            <FontAwesomeIcon icon={faEdit} className="" />
          </Fab>
          <Fab
            size="medium"
            color="primary"
            aria-label="add"
            className="me-2 table-fab-buttons"
            onClick={() => {
              navigate(`/purchase/${row?.id}`);
            }}
          >
            <FontAwesomeIcon icon={faEye} className="" />
          </Fab>
          <Fab
            size="medium"
            color="error"
            aria-label="add"
            className="me-2 table-fab-buttons"
            onClick={() => {
              // handleDelete(row);
            }}
          >
            <FontAwesomeIcon icon={faTrash} className="" />
          </Fab>
        </div>
      ),
    },
  ];

  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const [showPicker, setShowPicker] = useState(false);
  const [totalLength, setTotalLength] = useState(null);

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const handlePageChange = async (page) => {
    try {
      const pageSize = 10;
      let startDate = formatLocalDate(selectionRange?.startDate);
      let endDate = formatLocalDate(selectionRange?.endDate);
      getPurchaseData(startDate, endDate, page, pageSize);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const textFieldRef = useRef(null);
  const pickerRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      textFieldRef.current &&
      !textFieldRef.current.contains(event.target) &&
      pickerRef.current &&
      !pickerRef.current.contains(event.target)
    ) {
      setShowPicker(false);
    }
  };

  useEffect(() => {
    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div>
      {!show && (
        <div>
          <Grid container spacing={2} alignItems="center" className="mb-3">
            <Grid
              item
              md={6}
              className="d-flex"
              style={{ position: "relative" }}
            >
              <TextField
                value={`${selectionRange?.startDate.toLocaleDateString()} - ${selectionRange.endDate?.toLocaleDateString()}`}
                onClick={toggleDatePicker}
                readOnly
                fullWidth
                size="small"
                variant="outlined"
                style={{ cursor: "pointer", maxWidth: "300px" }}
                ref={textFieldRef}
              />

              <Button
                variant="contained"
                color="primary"
                style={{
                  textTransform: "capitalize",
                }}
                className="ms-2"
                size="small"
                onClick={() => {
                  let startDate = formatLocalDate(selectionRange?.startDate);
                  let endDate = formatLocalDate(selectionRange?.endDate);
                  getPurchaseData(startDate,endDate)
                }}
              >
                Filter
              </Button>

              {showPicker && (
                <div
                  ref={pickerRef}
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "1rem",
                    zIndex: 1000,
                    backgroundColor: "white",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <DateRangePicker
                    ranges={[selectionRange]}
                    onChange={(item) => {
                      console.log(item);
                      setSelectionRange({
                        startDate: item.selection.startDate,
                        endDate: item.selection.endDate,
                        key: item.selection.key,
                      });
                      setShowPicker(false);
                    }}
                    showSelectionPreview={true}
                  />
                </div>
              )}
            </Grid>
            <Grid item md={6} textAlign="right">
              <Button
                variant="contained"
                color="primary"
                style={{
                  textTransform: "capitalize",
                }}
                size="small"
                onClick={() => {
                  setShow(true);
                }}
                startIcon={<Add />}
              >
                New Purchase
              </Button>
            </Grid>
          </Grid>
          <div className={`dt-table`}>
            <DataTable
              columns={PurchaseDataColumns}
              striped
              data={purchase_reducer_data}
              className="dt-table-container"
              pagination
              paginationPerPage={10}
              paginationServer
              paginationTotalRows={totalLength}
              onChangePage={handlePageChange}
              // onChangeRowsPerPage={handleRowsPerPageChange}
              searchable
            />
          </div>
        </div>
      )}

      {show && (
        <Purchase
          show={show}
          setShow={setShow}
          editableData={editableData}
          setEditableData={setEditableData}
        />
      )}
    </div>
  );
};

export default PurchaseHome;
