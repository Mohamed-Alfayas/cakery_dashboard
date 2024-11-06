import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import {
  CreateSubCategoryUrl,
  GetMainCategoryUrl,
} from "../../../Constant/urls/urls";
import { useDispatch, useSelector } from "react-redux";
import MainContext from "../../../context/MainContext";
import { PostApi } from "../../../hooks/Post/PostApi";
import {
  addSubCategoryReducerData,
  editSubCategoryReducerData,
} from "../../../redux/reducer/ChildReducer/SubCategoryReducer";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { setMainCategoryReducerData } from "../../../redux/reducer/ChildReducer/MainCategoryReducer";
import { GetApi } from "../../../hooks/Get/GetApi";

const EditSubCategory = ({ show, setShow, editableData, setEditableData }) => {
  const dispatch = useDispatch();

  const { ShowNotification } = useContext(MainContext);
  const { main_category_reducer_data } = useSelector(
    (state) => state.MainCategoryReducer
  );

  let isEditableDataAvail = Boolean(Object.keys(editableData).length);
  const [cakeDetails, setCakeDetails] = useState({
    id: isEditableDataAvail ? editableData.id : 0,
    main_category: 0,
    name: "",
    description: "",
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (Object.keys(editableData).length) {
      setCakeDetails({
        ...editableData,
        main_category: editableData?.main_category?.id,
      });
      setPreview(editableData?.image_url || "");
    }
  }, [show, editableData]);
  useEffect(() => {
    getCategories();
  }, []);
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
    }
  };

  const handleClose = () => {
    setShow(false);
    setCakeDetails({
      id: 0,
      main_category: 0,
      name: "",
      description: "",
    });
    setPreview("");
    setEditableData({});
  };

  const handleOnchange = (value, name) => {
    if (name === "image") {
      setCakeDetails((oldData) => ({
        ...oldData,
        [name]: value,
      }));
      setPreview(URL.createObjectURL(value));
    } else {
      setCakeDetails((oldData) => ({
        ...oldData,
        [name]: value,
        id: isEditableDataAvail ? editableData.id : 0,
      }));
    }
  };

  const handleAddSubCategory = async () => {
    const formData = new FormData();

    if (!cakeDetails.name) {
      ShowNotification("warning", "Please Enter Category name");
      return;
    }
    if (!cakeDetails.main_category) {
      ShowNotification("warning", "Please Choose Main Category");
      return;
    }
    if (!cakeDetails.image && !editableData?.image_url) {
      ShowNotification("warning", "Please Select Image");
      return;
    }
    if (isEditableDataAvail) {
      formData.append("id", cakeDetails?.id);
    }
    formData.append("name", cakeDetails.name);
    formData.append("description", cakeDetails.description);
    formData.append("main_category", cakeDetails.main_category);

    if (cakeDetails.image) {
      formData.append("image", cakeDetails.image);
    }
    try {
      const result = await PostApi(CreateSubCategoryUrl, formData, true);

      // if (result.status !== 200) {
      //   ShowNotification("error", result.data.message);
      //   return;
      // }
      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        if (isEditableDataAvail) {
          dispatch(editSubCategoryReducerData(result.data?.data));
        } else {
          dispatch(addSubCategoryReducerData(result.data.data));
        }
        ShowNotification("success", result.data?.message);
      }
    } catch (error) {
      console.error("getCategories Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    }
    handleClose();
  };

  return (
    <>
      <div>
        <Offcanvas
          className="cgm-expiry-user-action-modal"
          show={show}
          onHide={handleClose}
          placement={"end"}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              {isEditableDataAvail ? "Edit Sub Category" : "Add Sub Category"}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <TextField
              id="category name"
              className="my-2"
              label="Category Name"
              fullWidth
              size="small"
              required
              value={cakeDetails.name || ""}
              onChange={(e) => {
                handleOnchange(e.target.value, "name");
              }}
            />
            {/* <TextField
              id="main category name"
              className="my-2"
              label="Main Category Name"
              fullWidth
              size="small"
              required
              value={cakeDetails.main_category_name || ""}
              onChange={(e) => {
                handleOnchange(e.target.value, "main_category_name");
              }}
            /> */}
            <FormControl fullWidth size="small" className="my-2">
              <InputLabel id="category-select-label">Main Category</InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                label="Main Category"
                onChange={(e) =>
                  handleOnchange(e.target.value, "main_category")
                }
                value={cakeDetails.main_category || ""}
              >
                {main_category_reducer_data &&
                main_category_reducer_data.length > 0 ? (
                  main_category_reducer_data.map((val) => (
                    <MenuItem key={val.id} value={val.id}>
                      {val.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No categories available</MenuItem>
                )}
              </Select>
            </FormControl>

            <TextField
              id="category Description"
              className="my-2"
              label="Category Description"
              multiline
              rows={3}
              fullWidth
              size="small"
              required
              value={cakeDetails.description || ""}
              onChange={(e) => {
                handleOnchange(e.target.value, "description");
              }}
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleOnchange(e.target.files[0], "image");
              }}
            />
            {preview && (
              <div className="mt-2">
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "10px",
                    objectFit: 'cover'
                  }}
                />
              </div>
            )}

            {/* add cake button */}
            <div className="text-end">
              <Button
                variant="contained"
                color="primary"
                size="small"
                style={{
                  textTransform: "none",
                  borderRadius: "5px",
                }}
                onClick={(e) => {
                  handleAddSubCategory();
                }}
              >
                <FontAwesomeIcon icon={faPlus} className="mx-1" />
                {isEditableDataAvail
                  ? "Update Sub Category"
                  : "Add Sub Category"}
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
};

export default EditSubCategory;
