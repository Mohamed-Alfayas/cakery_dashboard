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
  import MainContext from "../../../context/MainContext";
  import EditUnit from "./EditUnit";
  import { useDispatch, useSelector } from "react-redux";
  import { GetUnitUrl } from "../../../Constant/urls/urls";
  import { GetApi } from "../../../hooks/Get/GetApi";
  import { setUnitReducerData } from "../../../redux/reducer/ChildReducer/UnitReducer";
  import PreLoaderComponent from "../../../common/PreLoaderComponent";
  import { setIsUnitLoadingReducerData } from "../../../redux/reducer/ChildReducer/CommonLoaderReducer";
  
  const UnitComponent = () => {
    const { ShowNotification } = useContext(MainContext);
  
    const { unit_reducer_data } = useSelector((state) => state.UnitReducer);
    const { is_Unit_loading } = useSelector((state) => state.CommonLoaderReducer);
  
    const dispatch = useDispatch();
  
    const [show, setShow] = useState(false);
    const [editableData, setEditableData] = useState({});
  
    useEffect(() => {
      getUnit();
    }, []);
    const categoryDTColumns = [
      {
        name: "ID",
        selector: (row) => row?.id,
        width: "10%",
      },
      {
        name: "Unit",
        selector: (row) => row?.name,
        width: "25%",
      },
      {
        name: "Description",
        selector: (row) => row?.description,
        width: "25%",
      },
      {
        name: "View",
        minWidth: "10%",
        cell: (row) => (
          <div className="text-center">
            <Button
              variant="contained"
              color="primary"
              size="small"
              className="me-1"
              style={{
                textTransform: "none",
                borderRadius: "5px",
              }}
              onClick={() => {
                setShow(true);
                setEditableData(row);
              }}
            >
              <FontAwesomeIcon icon={faEdit} className="mx-1" />
              Edit
            </Button>
  
            <Button
              variant="contained"
              color="error"
              size="small"
              style={{
                textTransform: "none",
                borderRadius: "5px",
              }}
              onClick={() => {
                handleDelete(row);
              }}
            >
              <FontAwesomeIcon icon={faTrash} className="me-2" />
              Delete
            </Button>
          </div>
        ),
      },
    ];
  
    const getUnit = async () => {
      try {
        const result = await GetApi(GetUnitUrl);
  
        if (!result || typeof result.status === "undefined") {
          ShowNotification("error", "Network Error");
        } else if (result.status !== 200) {
          ShowNotification("error", result.data?.message || "An error occurred");
        } else {
          dispatch(setUnitReducerData(result.data?.data));
        }
      } catch (error) {
        console.error("getKG Error:", error);
        ShowNotification("error", "An unexpected error occurred");
      } finally {
        dispatch(setIsUnitLoadingReducerData(false));
      }
    };
  
    const handleDelete = (row) => {
      // const filterCategories = kg_reducer_data.filter((val) => val.id !== row.id);
    };
  
    if (is_Unit_loading) {
      return <PreLoaderComponent />;
    }
    return (
      <div className="cgm-purchase-section">
        <Grid container spaing={2} className="mb-2">
          <Grid item md={4} xs={6} className="text-end search-section">
            <section className="component-heading my-1">
              <FontAwesomeIcon icon={faFileLines} className="mx-2" /> Unit
            </section>
          </Grid>
          <Grid item md={8} xs={6} className="text-end top-action-button-group">
            <div className="ml-auto">
              <Button
                variant="contained"
                color="primary"
                size="small"
                className="me-1"
                style={{
                  textTransform: "none",
                  borderRadius: "5px",
                }}
                onClick={() => {
                  setShow(true);
                }}
              >
                <FontAwesomeIcon icon={faPlus} className="mx-1" />
                Add Unit
              </Button>
              <Button
                variant="contained"
                color="success"
                className=" mx-1"
                style={{
                  textTransform: "none",
                  borderRadius: "5px",
                }}
                onClick={() => getUnit()}
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
            data={unit_reducer_data}
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
  
        <EditUnit
          show={show}
          setShow={setShow}
          editableData={editableData}
          setEditableData={setEditableData}
        />
      </div>
    );
  };
  
  export default UnitComponent;
  