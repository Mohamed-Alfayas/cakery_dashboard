import {
  faEdit,
  faFileLines,
  faRefresh,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Fab, Grid } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import MainContext from "../../../context/MainContext";
import EditKG from "./EditKG";
import { useDispatch, useSelector } from "react-redux";
import { GetApi } from "../../../hooks/Get/GetApi";
import { subUnitUrl } from "../../../Constant/urls/urls";
import { setKgReducerData } from "../../../redux/reducer/ChildReducer/KgReducer";
import PreLoaderComponent from "../../../common/PreLoaderComponent";
import { setIsKgLoadingReducerData } from "../../../redux/reducer/ChildReducer/CommonLoaderReducer";

const KGComponent = () => {
  const { ShowNotification } = useContext(MainContext);

  const { kg_reducer_data } = useSelector((state) => state.KgReducer);
  const { is_kg_loading } = useSelector((state) => state.CommonLoaderReducer);

  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [editableData, setEditableData] = useState({});

  const categoryDTColumns = [
    {
      name: "ID",
      selector: (row) => row?.id,
      width: "10%",
    },
    {
      name: "KG",
      selector: (row) => row?.kg,
      width: "15%",
    },
    {
      name: "Unit",
      selector: (row) => row?.unit?.name,
      width: "15%",
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
          <Fab size="medium" color="secondary" aria-label="add"
            className="me-2 table-fab-buttons"
            onClick={() => {
              setShow(true);
              setEditableData(row);
            }}
          >
            <FontAwesomeIcon icon={faEdit} className="" />
          </Fab>
          <Fab size="medium" color="error" aria-label="add"
            className="me-2 table-fab-buttons"
            onClick={() => {
              handleDelete(row);
            }}
          >
            <FontAwesomeIcon icon={faTrash} className="" />
          </Fab>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getKG();
  }, []);

  const getKG = async () => {
    try {
      const result = await GetApi(subUnitUrl);

      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setKgReducerData(result.data?.data));
      }
    } catch (error) {
      console.error("get KG Data Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    } finally {
      dispatch(setIsKgLoadingReducerData(false));
    }
  };

  const handleDelete = (row) => {
    // const filterCategories = kg_reducer_data.filter((val) => val.id !== row.id);
  };

  if (is_kg_loading) {
    return <PreLoaderComponent />;
  }

  return (
    <div className="cgm-purchase-section">
      <Grid container spaing={2} className="mb-2">
        <Grid item md={4} xs={6} className="text-end search-section">
          <section className="component-heading my-1">
            <FontAwesomeIcon icon={faFileLines} className="mx-2" /> Sub Unit
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
              Add Sub Unit
            </Button>
            <Button
              variant="contained"
              color="success"
              className=" mx-1"
              style={{
                textTransform: "none",
                borderRadius: "5px",
              }}
              onClick={() => getKG()}
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
          data={kg_reducer_data}
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

      <EditKG
        show={show}
        setShow={setShow}
        editableData={editableData}
        setEditableData={setEditableData}
      />
    </div>
  );
};

export default KGComponent;
