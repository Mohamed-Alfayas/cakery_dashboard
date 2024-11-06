import React, { useContext, useEffect, useState } from "react";
import { Card, Offcanvas, Button } from "react-bootstrap";
import { TextField, Grid, Autocomplete } from "@mui/material";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainContext from "../../context/MainContext";
import {
  getManualNotificationList,
  sendManualNotifications,
} from "../../utils/NotificationAPI";
import Swal from 'sweetalert2';

const SendManualNotification = ({ show, setShow }) => {
  const handleClose = () => {
    setShow(false);
    setTitle("");
    setMessage("");
  };
  const { setIsPreLoading, ShowNotification } = useContext(MainContext);

  useEffect(() => {
    if (show) {
      getManualNotificationListData();
    }
  }, [show]);

  const [userID, setUserID] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [manualNotificationsList, setManualNotficationList] = useState([]);

  const handleSendManualAppNotification = async () => {
    let requestData = {
      user_id: userID,
      title: title,
      body: message,
      sub_type: selectedNotification?.sub_type,
      type: selectedNotification?.type,
      category: selectedNotification?.category,
    };
    console.log(requestData);

    setIsPreLoading(true);
    try {
      const sendAppNotificationResponse = await sendManualNotifications(
        requestData
      );
      handleClose();
      ShowNotification("success", "Manual Notification successfully sent");
    } catch (error) {
      console.log(error);
      console.error(
        "Error fetching data:",
        error.response ? error.response.data : error.message
      );
      console.log("test");
      ShowNotification("error", error?.errorMessage);
    } finally {
      setIsPreLoading(false);
    }
  };

  const getManualNotificationListData = async () => {
    setIsPreLoading(true);

    try {
      const getManualNotificationListResponse =
        await getManualNotificationList();
      console.log(getManualNotificationListResponse?.data?.approved);
      setManualNotficationList(
        getManualNotificationListResponse?.data?.approved
      );
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response ? error.response.data : error.message
      );
      ShowNotification("error", error?.errorMessage);
    } finally {
      setIsPreLoading(false);
    }
  };

  const [selectedNotification, setSelectedNotification] = useState(null);

  const hanldleSubtypeChange = (event, newValue) => {
    setSelectedNotification(newValue);
    setMessage(newValue?.body);
    setTitle(newValue?.title);
  };

  return (
    <div>
      <Offcanvas
        className="send-notification"
        show={show}
        onHide={handleClose}
        placement={"end"}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Send App-Notifications</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Autocomplete
            options={manualNotificationsList}
            getOptionLabel={(option) =>
              `${option.sub_type} - [Title: ${option.title}]`
            }
            value={selectedNotification}
            onChange={hanldleSubtypeChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Notification"
                variant="outlined"
                size="small"
              />
            )}
            className="notifications-search my-2"
          />

          <TextField
            className="my-2"
            label="User UUID"
            // type="number"
            name="user_uuid"
            size={"small"}
            placeholder="Enter user UUID"
            fullWidth
            variant="outlined"
            value={userID}
            onChange={(e) => {
              setUserID(e.target.value);
            }}
          />
          <TextField
            className="my-2"
            label="Notification title"
            size={"small"}
            name="notification_title"
            placeholder="Notification title"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
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
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
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
              onClick={() => {
                Swal.fire({
                  title: "Are you sure you want to send the notification?",
                  text: "",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes, Send",
                  reverseButtons: true,
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleSendManualAppNotification();
                  }
                });                
              }}
            >
              <FontAwesomeIcon icon={faPaperPlane} className="mx-1" />{" "}
              <span>Send Notification</span>
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
                  <h4>{title || "Notification Title"}</h4>
                  <p>{message || "Sample notification message for app"}</p>
                </Grid>
              </Grid>
            </Card>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default SendManualNotification;
