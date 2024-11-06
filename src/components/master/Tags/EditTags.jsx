import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import MainContext from "../../../context/MainContext";
import { useDispatch } from "react-redux";
import { CreateTgUrl } from "../../../Constant/urls/urls";
import {
  addTaglistReducerData,
  editTaglistReducerData,
} from "../../../redux/reducer/ChildReducer/TagListReducer";
import { PostApi } from "../../../hooks/Post/PostApi";

const EditTags = ({ show, setShow, editableData, setEditableData }) => {
  const { ShowNotification } = useContext(MainContext);
  const dispatch = useDispatch();
  // const { tag_list_reducer_data } = useSelector(
  //   (state) => state.TaglistReducer
  // );

  let isEditableDataAvail = Boolean(Object.keys(editableData).length);

  const [tagDetails, setTagDetails] = useState({
    id: 0,
    tag: "",
  });

  useEffect(() => {
    if (Object.keys(editableData).length) {
      setTagDetails(editableData);
    }
  }, [show, editableData]);

  const handleClose = () => {
    setShow(false);
    setTagDetails({
      id: 0,
      tag: "",
    });
    setEditableData({});
  };

  const handleOnchange = (value, name) => {
    setTagDetails((oldData) => ({
      ...oldData,
      [name]: value,
      id: isEditableDataAvail ? editableData.id : 0,
    }));
  };

  const handleAddTag = async (e) => {
    e.preventDefault();

    if (!tagDetails.tag) {
      ShowNotification("warning", "Enter Tag Name");
      return;
    }
    let data = isEditableDataAvail ? tagDetails : { tag: tagDetails?.tag };

    try {
      const result = await PostApi(CreateTgUrl, data);

      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        if (isEditableDataAvail) {
          ShowNotification("success", result.data?.message);
          dispatch(editTaglistReducerData(result.data?.data));
        } else {
          ShowNotification("success", result.data?.message);
          dispatch(addTaglistReducerData(result.data.data));
        }
      }
    } catch (error) {
      console.error("tag Error:", error);
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
              {isEditableDataAvail ? "Edit Tag" : "Add Tag"}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <TextField
              id="tag name"
              className="my-2"
              label="Tag Name"
              fullWidth
              size="small"
              required
              value={tagDetails.tag || ""}
              onChange={(e) => {
                handleOnchange(e.target.value, "tag");
              }}
            />

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
                  handleAddTag(e);
                }}
              >
                <FontAwesomeIcon icon={faPlus} className="mx-1" />
                {isEditableDataAvail ? "Update Tag" : "Add Tag"}
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
};

export default EditTags;
