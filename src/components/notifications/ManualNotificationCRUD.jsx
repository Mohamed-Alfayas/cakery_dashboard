import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Checkbox, FormControlLabel, FormGroup, Grid, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Offcanvas } from "react-bootstrap";
import { addManualNotificationList, updateManualNotificationList } from "../../utils/NotificationAPI";
import MainContext from "../../context/MainContext";

const ManualNotificationCRUD = ({
  show,
  setShow,
  isEdit,
  setIsEdit,
  selectedRow,
  setSelectedRow,
  getManualNotificationListData,
}) => {
  const { setIsPreLoading, ShowNotification } = useContext(MainContext);

  const handleClose = () => {
    handleClear();
    setShow(false);
    setIsEdit(false);
    setSelectedRow([]);
  };
  const handleClear = () => {
    setInputSubtype("");
    setInputTitle("");
    setInputMessage("");
    setInputApprovedStatus(false);
  };

  useEffect(() => {
    if (show) {
      setInputSubtype(selectedRow?.sub_type);
      setInputTitle(selectedRow?.title);
      setInputMessage(selectedRow?.body);
      setInputApprovedStatus(selectedRow?.is_approved);
    }
  }, [selectedRow]);

  const [inputSubtype, setInputSubtype] = useState("");
  const [inputTitle, setInputTitle] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [inputApprovedStatus, setInputApprovedStatus] = useState(false);

  const handleAddManualAppNotification = async () => {
    let requestData = {
      sub_type: inputSubtype,
      title: inputTitle,
      body: inputMessage,
    };

    try {
      const AddManualNotificationResponse = await addManualNotificationList(
        requestData
      );

      handleClose();

      ShowNotification("success", "Add Manual Notification successfully.");
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response ? error.response.data : error.message
      );
      ShowNotification("error", error.message);
    } finally {
      getManualNotificationListData()
      setIsPreLoading(false);
    }
  };

  const handleUpdateManualAppNotification = async () => {
    let requestData = {
      notification_id: selectedRow?.id,
      is_approved: inputApprovedStatus,
      sub_type: inputSubtype,
      title: inputTitle,
      body: inputMessage,
    };

    try {
      const updateManualNotificationResponse =
        await updateManualNotificationList(requestData);
      handleClose();

      ShowNotification("success", "Manual Notification updated successfully");
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response ? error.response.data : error.message
      );
      ShowNotification("error", error.message);
    } finally {
      getManualNotificationListData()
      setIsPreLoading(false);
    }
  };

  return (
    <div className="">
      <Offcanvas
        className="ManualNotificationCRUD-modal"
        show={show}
        onHide={handleClose}
        placement={"end"}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Manual Notifications</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <TextField
            className="my-2"
            label="Sub Type"
            size={"small"}
            placeholder="Enter Sub Type"
            fullWidth
            variant="outlined"
            value={inputSubtype}
            onChange={(e) => {
              setInputSubtype(e.target.value.toLocaleLowerCase());
            }}
          />
          <TextField
            className="my-2"
            label="Notification title"
            size={"small"}
            placeholder="Notification title"
            fullWidth
            variant="outlined"
            value={inputTitle}
            onChange={(e) => {
              setInputTitle(e.target.value);
            }}
          />
          <TextField
            className="my-2"
            label="Notification message"
            size={"small"}
            placeholder="Notification message"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={inputMessage}
            onChange={(e) => {
              setInputMessage(e.target.value);
            }}
          />

          {isEdit && (
            <FormGroup aria-label="position">
              <FormControlLabel
                control={<Checkbox />}
                label="Is Approved"
                labelPlacement="end"
                checked={inputApprovedStatus}
                onChange={(e) => {
                  setInputApprovedStatus(e.target.checked);
                }}
              />
            </FormGroup>
          )}

          <div className="text-end">
            <Button
              variant="outline-success"
              color="secondary"
              className="my-2"
              style={{
                textTransform: "none",
                borderRadius: "5px",
                padding: "5px 10px",
              }}
              disabled={!inputSubtype || !inputMessage || !inputTitle}
              onClick={() => {
                isEdit
                  ? handleUpdateManualAppNotification()
                  : handleAddManualAppNotification();
              }}
            >
              <FontAwesomeIcon icon={faSave} className="mx-1" />{" "}
              <span>{isEdit ? "Update" : "Add"} Notification</span>
            </Button>
          </div>

          <p>View</p>
          <div className="notifcations-show">
            <Card>
              <Grid container spaing={2}>
                <Grid item md={2} className="logo-section">
                  <img
                    alt="Login User"
                    src={require("../../assets/img/dh-logo-dark.png")}
                    className="message-logo"
                  />
                </Grid>
                <Grid item md={10} className="message-section">
                  <h4>{inputTitle || "Notification Title"}</h4>
                  <p>{inputMessage || "Sample notification message for app"}</p>
                </Grid>
              </Grid>
            </Card>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default ManualNotificationCRUD;
