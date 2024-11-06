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
import { GetApi } from "../../../hooks/Get/GetApi";
import MainContext from "../../../context/MainContext";
import { GetSubCategoryUrl } from "../../../Constant/urls/urls";
import EditSubCategory from "./EditSubCategory";
import { useDispatch, useSelector } from "react-redux";
import { setSubCategoryReducerData } from "../../../redux/reducer/ChildReducer/SubCategoryReducer";
import PreLoaderComponent from "../../../common/PreLoaderComponent";
import { setIsSubCategoryLoadingReducerData } from "../../../redux/reducer/ChildReducer/CommonLoaderReducer";

const SubCategory = () => {
  const dispatch = useDispatch();
  const { ShowNotification } = useContext(MainContext);
  const { sub_category_reducer_data } = useSelector(
    (state) => state.SubCategoryReducer
  );
  const { is_sub_category_loading } = useSelector(
    (state) => state.CommonLoaderReducer
  );
  const [show, setShow] = useState(false);
  const [editableData, setEditableData] = useState({});

  useEffect(() => {
    getSubCategories();
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
      name: "Main Category Name",
      selector: (row) => row?.main_category.name,
      width: "25%",
    },
    {
      name: "Category Image",
      selector: (row) => row?.image_url,
      width: "20%",
      cell: (row) => (
        <div className="text-center">
          <img
            src={row?.image_url}
            alt="sub_category"
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
  const getSubCategories = async () => {
    try {
      const result = await GetApi(GetSubCategoryUrl);
      console.log("result ====", result);
      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setSubCategoryReducerData(result.data.data));
      }
    } catch (error) {
      console.error("getSubCategories Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    } finally {
      dispatch(setIsSubCategoryLoadingReducerData(false));
    }
  };

  const handleDelete = (row) => {
    // console.log("row ====", row);
    // const filterCategories = sub_category_reducer_data.filter(
    //   (val) => val.id !== row.id
    // );
  };

  if (is_sub_category_loading) {
    return <PreLoaderComponent />;
  }

  return (
    <div className="cgm-purchase-section">
      <Grid container spaing={2} className="mb-2">
        <Grid item md={4} xs={6} className="text-end search-section">
          <section className="component-heading my-1">
            <FontAwesomeIcon icon={faFileLines} className="mx-2" /> Cake Sub
            Categories
          </section>
        </Grid>
        <Grid item md={8} xs={6} className="text-end top-action-button-group">
          <div className="text-end">
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
              Add Sub Category
            </Button>
            <Button
              variant="contained"
              color="success"
              className=" mx-1"
              size="small"
              style={{
                textTransform: "none",
                borderRadius: "5px",
              }}
              onClick={() => getSubCategories()}
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
          data={sub_category_reducer_data}
          className="dt-table-container"
          pagination
          //   paginationPerPage={categoryParam?.limit}
          //   paginationServer
          //   paginationTotalRows={sub_category_reducer_dataCount}
          //   onChangePage={handlePageChange}
          //   onChangeRowsPerPage={handleRowsPerPageChange}
          searchable
        />
      </div>

      <EditSubCategory
        show={show}
        setShow={setShow}
        editableData={editableData}
        setEditableData={setEditableData}
      />
    </div>
  );
};

export default SubCategory;
