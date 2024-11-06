import React, { useState } from 'react'
import { Card, Offcanvas, Button } from "react-bootstrap";
import { TextField, Grid } from "@mui/material";
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SendNotification = ({show, setShow}) => {

  const handleClose = () => {
    setShow(false);
  };

  const [userID, setUserID] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

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
          <TextField
            className="my-2"
            label="User Id"
            type="number"
            size={"small"}
            placeholder="Enter user id"
            fullWidth
            variant="outlined"
            value={userID}
            onChange={(e) => {
              setUserID(e.target.value)
            }}
          />
          <TextField
            className="my-2"
            label="Notification title"
            size={"small"}
            placeholder="Notification title"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
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
              setMessage(e.target.value)
            }}
          />
          <div className='text-end'>
          <Button
            variant="outline-success"
            color="secondary"
            className="my-2"
            style={{
              textTransform: "none",
              borderRadius: "5px",
              padding: "5px 10px",
            }}
            onClick={() => {}}
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
                  <p>
                    {message || "Sample notification message for app"}
                  </p>
                </Grid>
              </Grid>
            </Card>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default SendNotification