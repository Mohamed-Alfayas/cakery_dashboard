import {
  faFileLines,
  faRefresh,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Button, Grid } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import MainContext from "../../../context/MainContext";
import EditGallery from "./EditGallery";
import { useDispatch, useSelector } from "react-redux";
import { GetApi } from "../../../hooks/Get/GetApi";
import { DeleteGalleryUrl, GetGalleryUrl } from "../../../Constant/urls/urls";
import { setGalleryListReducerData } from "../../../redux/reducer/ChildReducer/GalleryListReducer";
import { DeleteApi } from "../../../hooks/Delete/DeleteApi";
import PreLoaderComponent from "../../../common/PreLoaderComponent";
import { setIsGalleryLoadingReducerData } from "../../../redux/reducer/ChildReducer/CommonLoaderReducer";

const GalleryComponent = () => {
  const { ShowConfirmation, ShowNotification } = useContext(MainContext);

  const { gallery_list_reducer_data } = useSelector(
    (state) => state.GalleryListReducer
  );
  const { is_gallery_loading } = useSelector(
    (state) => state.CommonLoaderReducer
  );

  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [editableData, setEditableData] = useState({});

  useEffect(() => {
    getGallery();
  }, []);
  const categoryDTColumns = [
    {
      name: "ID",
      selector: (row) => row?.id,
      width: "20%",
    },
    {
      name: "Image",
      selector: (row, index) => (
        <div className="text-center">
          <Avatar key={index} alt="Gallery-image" src={row?.image_url} />
        </div>
      ),
      width: "20%",
    },
    
    {
      name: "View",
      minWidth: "10%",
      cell: (row) => (
        <div className="text-center">
          <Button
            variant="contained"
            color="error"
            size="small"
            style={{
              textTransform: "none",
              borderRadius: "5px",
            }}
            onClick={() => {
              handleDeleteImage(row);
            }}
          >
            <FontAwesomeIcon icon={faTrash} className="me-2" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const getGallery = async () => {
    try {
      const result = await GetApi(GetGalleryUrl);

      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setGalleryListReducerData(result.data?.data));
      }
    } catch (error) {
      console.error("getGallery Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    } finally {
      dispatch(setIsGalleryLoadingReducerData(false));
    }
  };

  const handleDeleteImage = async (obj) => {
    const testSwal = await ShowConfirmation(
      "Are you sure do you want to delete?",
      "yes",
      "no"
    );
    console.log(obj);
    if (testSwal === "yes") {
      const url = `${DeleteGalleryUrl}${obj.id}`;
      const result = await DeleteApi(url);
      console.log("result =====", result);
      if (result.status !== 200) {
        ShowNotification("error", result.data.message);
      } else {
        ShowNotification("success", result.data.message);
        const filteredData = gallery_list_reducer_data.filter(
          (val) => val.id !== obj.id
        );
        dispatch(setGalleryListReducerData(filteredData));
      }
    }
  };

  if (is_gallery_loading) {
    return <PreLoaderComponent />;
  }

  return (
    <div className="gallery-section">
      <Grid container spaing={2} className="mb-2">
        <Grid item md={4} xs={6} className="text-end search-section">
          <section className="component-heading my-1">
            <FontAwesomeIcon icon={faFileLines} className="mx-2" /> Gallery
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
              Add Image
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
              onClick={() => getGallery()}
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
          data={gallery_list_reducer_data}
          className="dt-table-container"
          pagination
          searchable
        />
      </div>

      {/* <div style={{ display: "flex", flexWrap: "wrap", marginTop: 20 }}>
        {gallery_list_reducer_data.map((image, index) => (
          <div key={index} style={{ position: "relative", margin: 10 }}>
            <img
              src={image?.image_url}
              alt={`preview ${index}`}
              style={{ width: 100, height: 100, objectFit: "cover" }}
            />
            <button
              onClick={() => handleDeleteImage(image)}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: 20,
                height: 20,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              x
            </button>
          </div>
        ))}
      </div> */}

      <EditGallery
        show={show}
        setShow={setShow}
        editableData={editableData}
        setEditableData={setEditableData}
      />
    </div>
  );
};

export default GalleryComponent;
