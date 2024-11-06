import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { PutApi } from "../../hooks/Post/PutApi";
import { TermsConditionsUrl } from "../../Constant/urls/urls";
import MainContext from "../../context/MainContext";
import { useDispatch } from "react-redux";
import { setTermsReducerData } from "../../redux/reducer/ChildReducer/PolicyReducer";

const EditTermsConditions = ({ show, setShow, editableData }) => {
  const { ShowNotification } = useContext(MainContext);
  const dispatch = useDispatch();

  const [termsModalValue, setTermsModalValue] = useState("");

  useEffect(() => {
    setTermsModalValue(editableData);
  }, [editableData]);

  const handleSaveTerms = async () => {
    let requestData = { content: termsModalValue };

    try {
      const result = await PutApi(TermsConditionsUrl, requestData);

      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setTermsReducerData(result.data?.content));
        ShowNotification("success", "Terms & Conditions updated successfully");
        setShow(false);
      }
    } catch (error) {
      ShowNotification("error", "An unexpected error occurred");
    } finally {
      //   dispatch(setIsTagLoadingReducerData(false)); // End loading
    }
  };

  const handleClose = () => {
    setShow(false);
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
            <Offcanvas.Title>Update Terms & Conditions</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <TextField
              autoFocus
              margin="dense"
              id="content"
              multiline
              rows={20}
              value={termsModalValue}
              onChange={(e) => {
                setTermsModalValue(e.target.value)
              }}
              type="text"
              fullWidth
              variant="outlined"
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
                  handleSaveTerms(e);
                }}
              >
                <FontAwesomeIcon icon={faPlus} className="mx-1" />
                Update
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
};

export default EditTermsConditions;