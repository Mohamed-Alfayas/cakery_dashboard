import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { PostApi } from "../../../hooks/Post/PostApi";
import { CreateKgUrl, GetUnitUrl, subUnitUrl } from "../../../Constant/urls/urls";
import { setUnitReducerData } from "../../../redux/reducer/ChildReducer/UnitReducer";
import {
  addKgReducerData,
  editKgReducerData,
} from "../../../redux/reducer/ChildReducer/KgReducer";
import MainContext from "../../../context/MainContext";
import { GetApi } from "../../../hooks/Get/GetApi";
import { setIsUnitLoadingReducerData } from "../../../redux/reducer/ChildReducer/CommonLoaderReducer";
import { PutApi } from "../../../hooks/Post/PutApi";

const EditKG = ({ show, setShow, editableData, setEditableData }) => {
  const { ShowNotification } = useContext(MainContext);

  const { unit_reducer_data } = useSelector(
    (state) => state.UnitReducer
  );

  const dispatch = useDispatch();

  let isEditableDataAvail = Boolean(Object.keys(editableData).length);
  const [KgDetails, setKgDetails] = useState({
    // id: 0,
    kg: "",
    unit:"",
    description: "",
  });

  useEffect(() => {
    if (Object.keys(editableData).length) {
      setKgDetails({
        id: editableData?.id,
        kg: editableData?.kg,
        description: editableData?.description,
        unit: editableData?.unit?.id,
      });
    }
  }, [show, editableData]);

  useEffect(() => {
    getUnit()
  }, []);

  const handleClose = () => {
    setShow(false);
    setKgDetails({
      // id: 0,
      kg: "",
      unit:{},
      description: "",
    });
    setEditableData({});
  };

  const handleOnchange = (value, name) => {
    
    setKgDetails((oldData) => ({
      ...oldData,
      [name]: value,
      // id: isEditableDataAvail ? editableData.id : 0,
    }));
  };

  const hanldeUnitchange = (value) => {    
    setKgDetails((oldData) => ({
      ...oldData,
      unit: value,     
    }));
  };

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

  const handleCreateSubUnit = async (e) => {
    e.preventDefault();

    if (!KgDetails.kg) {
      ShowNotification("warning", "Please Enter KG");
      return;
    }

    let data = KgDetails;

    try {

      const result = await PostApi(subUnitUrl, data);

      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 201) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        if (isEditableDataAvail) {
          dispatch(editKgReducerData(result.data.data));
        } else {
          dispatch(addKgReducerData(result.data.data));
          dispatch(setUnitReducerData(result.data.data));

        }
        ShowNotification("success", result.data?.message);
        handleClose();
      }
    } catch (error) {
      console.error("Kg Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    }

  };

  const handleUpdateSubUnit = async (e) => {
    
    e.preventDefault();
    if (!KgDetails.kg) {
      ShowNotification("warning", "Please Enter KG");
      return;
    }

    let data = KgDetails;

    try {

      const result = await PutApi(`${subUnitUrl}/${data?.id}`, data);

      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {        
        dispatch(editKgReducerData(result.data.data));
        
        ShowNotification("success", result.data?.message);
        handleClose();

      }
    } catch (error) {
      console.error("Kg Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    }

  }

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
              {isEditableDataAvail ? "Edit KG" : "Add KG"}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <TextField
              id="kG (Weight)"
              className="my-2"
              label="KG Name"
              fullWidth
              type="number"
              size="small"
              required
              value={KgDetails.kg || "" }
              onChange={(e) => {
                handleOnchange(e.target.value, "kg");
              }}
            />

            <FormControl fullWidth size="small" className="my-2">
              <InputLabel id="category-select-label">Unit</InputLabel>
              <Select
                labelId="unit-select-label"
                id="unit"
                label="Unit name"
                value={KgDetails?.unit || "" }
                onChange={(e) => hanldeUnitchange(e.target.value)}
              >
                {unit_reducer_data &&
                  unit_reducer_data.length > 0 ? (
                    unit_reducer_data.map((val) => (
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
              id=" description"
              className="my-2"
              label="Description"
              fullWidth
              size="small"
              required
              value={KgDetails.description || ""}
              onChange={(e) => {
                handleOnchange(e.target.value, "description");
              }}
            />

            {/* add KG button */}
            <div className="text-end">
              <Button
                variant="contained"
                color="primary"
                size="small"
                style={{
                  textTransform: "none",
                  borderRadius: "5px",
                }}
                onClick={(e) => isEditableDataAvail ? handleUpdateSubUnit(e) : handleCreateSubUnit(e)}
              >
                <FontAwesomeIcon icon={faPlus} className="mx-1" />
                {isEditableDataAvail ? "Update KG" : "Add KG"}
              </Button>

            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
};

export default EditKG;
