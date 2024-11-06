import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { PostApi } from "../../../hooks/Post/PostApi";
import { CreateUnitUrl, UpdateUnitUrl } from "../../../Constant/urls/urls";
import {
  addUnitReducerData,
  editUnitReducerData,
} from "../../../redux/reducer/ChildReducer/UnitReducer";
import MainContext from "../../../context/MainContext";

const EditUnit = ({ show, setShow, editableData, setEditableData }) => {
  const { ShowNotification } = useContext(MainContext);
  const dispatch = useDispatch();

  let isEditableDataAvail = Boolean(Object.keys(editableData).length);
  const [unitDetails, setUnitDetails] = useState({
    id: 0,
    name: "",
    description: "",
  });
  useEffect(() => {
    if (Object.keys(editableData).length) {
      setUnitDetails(editableData);
    }
  }, [show, editableData]);
  const handleClose = () => {
    setShow(false);
    setUnitDetails({
      id: 0,
      name: "",
      description: "",
    });
    setEditableData({});
  };

  const handleOnchange = (value, name) => {
    setUnitDetails((oldData) => ({
      ...oldData,
      [name]: value,
      id: isEditableDataAvail ? editableData.id : 0,
    }));
  };

  const handleAddUnit = async (e) => {
    e.preventDefault();
    if (!unitDetails.name) {
      ShowNotification("warning", "Please Enter Unit");
      return;
    }

    let data = isEditableDataAvail
      ? unitDetails
      : { name: unitDetails?.name, description: unitDetails.description };

    try {
      const result = await PostApi(UpdateUnitUrl, data);

      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        if (isEditableDataAvail) {
          dispatch(editUnitReducerData(result.data.data));
        } else {
          dispatch(addUnitReducerData(result.data.data));
        }
        ShowNotification("success", result.data?.message);
      }
    } catch (error) {
      console.error("Unit Error:", error);
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
              {isEditableDataAvail ? "Edit Unit" : "Add Unit"}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <TextField
              id="name"
              className="my-2"
              label="Unit Name"
              fullWidth
              type="text"
              size="small"
              required
              value={unitDetails.name || ""}
              onChange={(e) => {
                handleOnchange(e.target.value, "name");
              }}
            />
            <TextField
              id=" description"
              className="my-2"
              label="Description"
              fullWidth
              size="small"
              required
              value={unitDetails.description || ""}
              onChange={(e) => {
                handleOnchange(e.target.value, "description");
              }}
            />

            {/* add Unit button */}
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
                  handleAddUnit(e);
                }}
              >
                <FontAwesomeIcon icon={faPlus} className="mx-1" />
                {isEditableDataAvail ? "Update Unit" : "Add Unit"}
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
};

export default EditUnit;
