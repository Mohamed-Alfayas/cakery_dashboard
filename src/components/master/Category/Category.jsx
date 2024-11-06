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
import EditCategory from "./EditCategory";
import { GetApi } from "../../../hooks/Get/GetApi";
import MainContext from "../../../context/MainContext";
import { GetMainCategoryUrl } from "../../../Constant/urls/urls";
import { useDispatch, useSelector } from "react-redux";
import { setMainCategoryReducerData } from "../../../redux/reducer/ChildReducer/MainCategoryReducer";
import PreLoaderComponent from "../../../common/PreLoaderComponent";
import { setIsCategoryLoadingReducerData } from "../../../redux/reducer/ChildReducer/CommonLoaderReducer";

const Category = () => {
  const dispatch = useDispatch();
  const { ShowNotification } = useContext(MainContext);

  //reducer Data
  const { main_category_reducer_data } = useSelector(
    (state) => state.MainCategoryReducer
  );
  const { is_category_loading } = useSelector(
    (state) => state.CommonLoaderReducer
  );

  const [show, setShow] = useState(false);
  const [editableData, setEditableData] = useState({});

  useEffect(() => {
    getCategories();
  }, []);

  const categoryDTColumns = [
    {
      name: "ID",
      selector: (row) => row?.id,
      width: "10%",
    },
    {
      name: "Category Name",
      selector: (row) => row?.name,
      width: "25%",
    },
    {
      name: "Category Image",
      selector: (row) => row?.image_url,
      width: "25%",
      cell: (row) => (
        <div className="text-center">
          <img
            src={row?.image_url}
            alt="category"
            className="category-image"
            style={{
              width: "40px",
              height: "40px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
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
            <FontAwesomeIcon icon={faEdit} className="me-2" />
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

  const getCategories = async () => {
    try {
      const result = await GetApi(GetMainCategoryUrl);
      console.log("result ====", result);
      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setMainCategoryReducerData(result.data.data));
      }
    } catch (error) {
      console.error("getCategories Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    } finally {
      dispatch(setIsCategoryLoadingReducerData(false));
    }
  };

  const handleDelete = (row) => {
    // const filterCategories = main_category_reducer_data.filter(
    //   (val) => val.id !== row.id
    // );
  };

  if (is_category_loading) {
    return <PreLoaderComponent />;
  }

  return (
    <div className="cgm-purchase-section">
      <Grid container spaing={2} className="mb-2">
        <Grid item md={6} xs={6} className="text-end search-section">
          <section className="component-heading my-1">
            <FontAwesomeIcon icon={faFileLines} className="mx-2" /> Cake
            Categories
          </section>
        </Grid>
        <Grid item md={6} xs={6} className="text-end top-action-button-group">
          <div className="ml-auto">
            <Button
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
              Add Main Category
            </Button>
            <Button
              variant="contained"
              color="success"
              className="mx-1"
              size="small"
              style={{
                textTransform: "none",
                borderRadius: "5px",
              }}
              onClick={() => getCategories()}
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
          data={main_category_reducer_data}
          className="dt-table-container"
          pagination
          //   paginationPerPage={categoryParam?.limit}
          //   paginationServer
          //   paginationTotalRows={main_category_reducer_dataCount}
          //   onChangePage={handlePageChange}
          //   onChangeRowsPerPage={handleRowsPerPageChange}
          searchable
        />
      </div>

      <EditCategory
        show={show}
        setShow={setShow}
        editableData={editableData}
        setEditableData={setEditableData}
      />
    </div>
  );
};

export default Category;
