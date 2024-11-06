import React, {  } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faClock,
  faSquareCheck,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { Avatar, Badge } from "@mui/material";
import "./Notifications.scss";
import moment from 'moment';

const NotificationBlock = () => {


  const notificationData = [
    {
      type: "water",
      title: "Stay Hydrated! Drink a glass of water",
      comment: "Drink a glass of water",
      notification_id: "8836f4d0-ad08-4537-b9d0-485fcbb63887",
      notification_date: "2024-04-12T07:08:00.702Z",
    },
    {
      type: "water",
      title: "Stay Hydrated! Drink a glass of water",
      comment: "Drink a glass of water",
      notification_id: "8836f4d0-ad08-4537-b9d0-485fcbb63887",
      notification_date: "2024-04-12T07:30:00.702Z",
    },
    {
      type: "water",
      title: "Stay Hydrated! Drink a glass of water",
      comment: "Drink a glass of water",
      notification_id: "8836f4d0-ad08-4537-b9d0-485fcbb63887",
      notification_date: "2024-04-12T07:08:00.702Z",
    },
    {
      type: "water",
      title: "Stay Hydrated! Drink a glass of water",
      comment: "Drink a glass of water",
      notification_id: "8836f4d0-ad08-4537-b9d0-485fcbb63887",
      notification_date: "2024-04-12T06:08:00.702Z",
    },
    {
      type: "water",
      title: "Stay Hydrated! Drink a glass of water",
      comment: "Drink a glass of water",
      notification_id: "8836f4d0-ad08-4537-b9d0-485fcbb63887",
      notification_date: "2022-12-22T00:30:00.702Z",
    },
  ];


  function TimeAgo({ dateTime }) {
    const formattedTimeAgo = () => {
      return moment(dateTime).fromNow();
    };
  
    return <span>{formattedTimeAgo()}</span>;
  }
  
  return (
    <div className="notification-block">
      <div className="top-head-dropdown">
        <DropdownButton
          title={
            <span className="notification-icon">
              <Badge color="error" badgeContent={5} max={10}> 
                <FontAwesomeIcon icon={faBell}/>
              </Badge>
            </span>
          }
          // bsStyle="default"
        >
          <div className="dropdown-header">
            <p>
              <b>Notifications</b>
            </p>
            <p>
              Mark all as read
              <FontAwesomeIcon icon={faSquareCheck} className="mx-1" />
            </p>
          </div>
          <div className="ScrollDesign notification-dropdown">
            {notificationData?.map((notification, index) => (
              <Dropdown.Item href="#" className="inner-block" key={index}>
                <section className="notification-item">
                  <div className="top-section">
                    <Avatar
                      alt="Login User"
                      src={require("../../assets/img/notification-icon.png")}
                      className="notification-icon"
                    />

                    <div className="content">
                      <div className="notification-title">
                        {notification?.title}
                      </div>
                      <div className="notification-text">
                        {notification?.comment}
                      </div>
                    </div>
                  </div>
                  <div className="bottom-section">
                    <p className="time-text">
                      <FontAwesomeIcon icon={faClock} className="mx-1" />{" "}
                      <TimeAgo dateTime={notification?.notification_date} />
                    </p>
                  </div>
                </section>
              </Dropdown.Item>
            ))}
          </div>
          <div className="dropdown-footer">
            <p>
              <FontAwesomeIcon icon={faTrashCan} /> Clear all
            </p>
          </div>
        </DropdownButton>
      </div>
    </div>
  );
};

export default NotificationBlock;
