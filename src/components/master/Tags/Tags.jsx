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
import EditTags from "./EditTags";
import { useDispatch, useSelector } from "react-redux";
import { GetApi } from "../../../hooks/Get/GetApi";
import { GetTagUrl } from "../../../Constant/urls/urls";
import { setTaglistReducerData } from "../../../redux/reducer/ChildReducer/TagListReducer";
import PreLoaderComponent from "../../../common/PreLoaderComponent";
import MainContext from "../../../context/MainContext";
import { setIsTagLoadingReducerData } from "../../../redux/reducer/ChildReducer/CommonLoaderReducer";
// import { addTaglistReducerData } from "../../../redux/reducer/ChildReducer/TagListReducer";

const TagsComponent = () => {
  const { ShowNotification } = useContext(MainContext);

  const { tag_list_reducer_data } = useSelector(
    (state) => state.TagListReducer
  );
  const { is_tag_category_loading } = useSelector(
    (state) => state.CommonLoaderReducer
  );
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [editableData, setEditableData] = useState({});

  useEffect(() => {
    getTag();
  }, []);
  const categoryDTColumns = [
    {
      name: "ID",
      selector: (row) => row?.id,
      width: "10%",
    },
    {
      name: "Tag Name",
      selector: (row) => row?.tag,
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

  const getTag = async () => {
    try {
      const result = await GetApi(GetTagUrl);

      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setTaglistReducerData(result.data?.data));
      }
    } catch (error) {
      console.error("getTag Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    } finally {
      dispatch(setIsTagLoadingReducerData(false));
    }
  };

  const handleDelete = (row) => {
    // const filterCategories = tag_list_reducer_data.filter(
    //   (val) => val.id !== row.id
    // );
  };

  if (is_tag_category_loading) {
    return <PreLoaderComponent />;
  }
  return (
    <div className="cgm-purchase-section">
      <Grid container spaing={2} className="mb-2">
        <Grid item md={4} xs={6} className="text-end search-section">
          <section className="component-heading my-1">
            <FontAwesomeIcon icon={faFileLines} className="mx-2" /> Tags
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
              Add Tags
            </Button>
            <Button
              variant="contained"
              color="success"
              className=" mx-1"
              style={{
                textTransform: "none",
                borderRadius: "5px",
                padding: "5px 10px",
              }}
              onClick={() => getTag()}
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
          data={tag_list_reducer_data}
          className="dt-table-container"
          pagination
          //   paginationPerPage={categoryParam?.limit}
          //   paginationServer
          //   paginationTotalRows={tag_list_reducer_dataCount}
          //   onChangePage={handlePageChange}
          //   onChangeRowsPerPage={handleRowsPerPageChange}
          searchable
        />
      </div>

      <EditTags
        show={show}
        setShow={setShow}
        editableData={editableData}
        setEditableData={setEditableData}
      />
    </div>
  );
};

export default TagsComponent;
