import React, { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faClose, faFileLines, faRefresh, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Avatar, Divider, Grid, IconButton, InputBase, Paper } from "@mui/material";
import { Card, Button } from "react-bootstrap";

import './Notifications.scss'
import SendManualNotification from './SendManualNotification';
import { gettManualNotificationListUsers, gettManualNotificationRecent, gettManualNotificationsByUser } from '../../utils/NotificationAPI';
import MainContext from '../../context/MainContext';
import NotificationContext from '../../context/NotificationContext';
import { formatTimestamp } from '../../commonFunctions';

const Notifications = () => {
  const [show, setShow] = useState(false);
  const { setIsPreLoading, ShowNotification } = useContext(MainContext);
  const [initComp, setInitComp] = useState(true);
  const [isUserView, setIsUserView] = useState(true);

  const {
    initRenderManualNotificationList,
    setInitRenderManualNotificationList,
    recentSendNotficationList,
    setRecentSendNotficationList,
    recentSendNotficationUsersList,
    setRecentSendNotficationUsersList,
    sendNotficationByUser,
    setSendNotficationByUser,
    selectedNotificationUser,
    setSelectedNotificationUser,
  } = useContext(NotificationContext);

  /* Based on Param */
  // useEffect(() => {
  //   if (!initRenderManualNotificationList && !initComp) {
  //     getManualNotificationsListUsersData();
  //   }
  // }, [manualNotficationParam]);

  useEffect(() => {
    if (initRenderManualNotificationList) {
      getManualNotificationsListUsersData();
      gettManualNotificationRecentData();
      setInitRenderManualNotificationList(false);
    }

    setTimeout(() => {
      setInitComp(false);
    }, 1000);
  }, []);

  const getManualNotificationsListUsersData = async () => {
    setIsPreLoading(true);

    try {
      const gettManualNotificationListUsersResponse =
        await gettManualNotificationListUsers();
        setRecentSendNotficationUsersList(gettManualNotificationListUsersResponse?.data?.ch_notifications);
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

  const gettManualNotificationRecentData = async () => {
    setIsPreLoading(true);

    let requestData = {
      offset: 0,
      limit: 30,
    }

    try {
      const gettManualNotificationRecentResponse =
        await gettManualNotificationRecent(requestData);
      console.log(gettManualNotificationRecentResponse?.data);
      setRecentSendNotficationList(gettManualNotificationRecentResponse?.data?.ch_notifications)
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

  const gettManualNotificationsByUserData = async (userId) => {
    setIsPreLoading(true);

    let requestData = {
      offset: 0,
      limit: 30,
      user_id: userId
    }

    try {
      const gettManualNotificationsByUserResponse =
        await gettManualNotificationsByUser(requestData);
      setSendNotficationByUser(gettManualNotificationsByUserResponse?.data?.ch_notifications)
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

  return (
    <div className="in-app-notifications">
      <section className="component-heading mt-1 mb-3">
        <FontAwesomeIcon icon={faFileLines} className="mx-2" /> App
        Notifications
      </section>
      <Grid container spaing={0} className="mb-2">
        <Grid item md={4} xs={6} className="text-end search-section">
          <Paper
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
            }}
            className="kit-search-section"
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search User"
              inputProps={{ "aria-label": "Search User" }}
            />

            <IconButton
              type="button"
              sx={{ p: "10px" }}
              aria-label="search"
              className="py-2 search-clear"
              onClick={() => {}}
            >
              <FontAwesomeIcon icon={faClose} />
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton
              type="button"
              sx={{ p: "10px" }}
              aria-label="search"
              className="py-2 food-search-clear"
              onClick={() => {
                // setIsSearchParam(true);
              }}
            >
              <FontAwesomeIcon icon={faSearch} />
            </IconButton>
          </Paper>
        </Grid>
        <Grid item md={8} xs={6} className="text-end top-action-button-group">
          <div className="ml-auto">
            <Button
              variant="outline-secondary"
              color="secondary"
              className=" mx-1"
              style={{
                textTransform: "none",
                borderRadius: "5px",
                padding: "5px 10px",
              }}
              onClick={() => {
                getManualNotificationsListUsersData();
                gettManualNotificationRecentData();
                setIsUserView(false);
              }}
            >
              <FontAwesomeIcon icon={faRefresh} className="mx-1" />{" "}
              <span>Refresh</span>
            </Button>
            <Button
              variant="outline-primary"
              color="secondary"
              className=" mx-1"
              style={{
                textTransform: "none",
                borderRadius: "5px",
                padding: "5px 10px",
              }}
              onClick={() => {
                setShow(true);
              }}
            >
              <FontAwesomeIcon icon={faBell} className="mx-1" />
              <span>Send Notification</span>
            </Button>
          </div>
        </Grid>
      </Grid>

      <section>
        <div className="notification-view-block">
          <Grid container spacing={2}>
            <Grid item md={4}>
              <Card>
                <Card.Header className="text-start">UserList</Card.Header>
                <section className="notification-users-list ScrollDesign">
                  {recentSendNotficationUsersList?.map((user, index) => (
                    <div
                      className="chat-card"
                      key={index}
                      onClick={() => {
                        setIsUserView(true);
                        setSelectedNotificationUser(user?.user_id);
                        gettManualNotificationsByUserData(user?.user_id);
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item md={2} xs={2} className="image">
                          <Avatar
                            alt="Login User"
                            src={require("../../assets/img/avatar-1.png")}
                            className="user-avatar"
                          />
                        </Grid>
                        <Grid item md={10} xs={10}>
                          <div className="chat-content">
                            <p className="user-id">
                              User ID:{" "}
                              <b>
                                {user?.user_id}{" "}
                                <small style={{ float: "right" }}>
                                  ({formatTimestamp(user?.created_at)})
                                </small>
                              </b>
                            </p>
                            <p className="message">{user?.title}</p>
                            <p className="message">{user?.body}</p>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  ))}
                </section>
              </Card>
            </Grid>
            <Grid item md={8}>
              <Card>
                <Card.Header className="text-start">
                  Recent Sent Notifications{" "}
                  {isUserView && "[User ID: " + selectedNotificationUser + "]"}
                </Card.Header>
                <Card.Body className="recent-chat-list ScrollDesign">
                  {!isUserView ? (
                    <>
                      {recentSendNotficationList?.map((notification, index) => (
                        <div className="sent-item-card" key={index}>
                          <Card>
                            <div className="sent-message-item">
                              <div className="image">
                                <Avatar
                                  alt="Login User"
                                  src={require("../../assets/img/notification-icon.png")}
                                  className="user-avatar"
                                />
                              </div>
                              <div className="content-block">
                                <h4 className="title">
                                  {notification?.title}{" "}
                                  <small>
                                    {formatTimestamp(notification?.created_at)}
                                  </small>
                                </h4>
                                <p className="message">{notification?.body}</p>
                              </div>
                            </div>
                            <span className="sent-info">
                              <div>
                                <p>
                                  User ID: <b>{notification?.user_id} </b>
                                </p>
                                <span className="notification-id">
                                  #{notification?.id}
                                </span>
                              </div>
                              <span className="category">
                                {notification?.sub_type}
                              </span>
                            </span>
                          </Card>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      {sendNotficationByUser?.map((notification, index) => (
                        <div className="sent-item-card" key={index}>
                          <Card>
                            <div className="sent-message-item">
                              <div className="image">
                                <Avatar
                                  alt="Login User"
                                  src={require("../../assets/img/notification-icon.png")}
                                  className="user-avatar"
                                />
                              </div>
                              <div className="content-block">
                                <div className="title-block">
                                  <h4 className="title">
                                    {notification?.title}{" "}
                                  </h4>
                                  <small>
                                    {formatTimestamp(notification?.created_at)}
                                  </small>
                                </div>

                                <p className="message">{notification?.body}</p>
                              </div>
                            </div>
                            <span className="sent-info">
                              <div>
                                <p>
                                  User ID: <b>{notification?.user_id} </b>
                                </p>
                                <span className="notification-id">
                                  #{notification?.id}
                                </span>
                              </div>
                              <span className="category">
                                {notification?.sub_type}
                              </span>
                            </span>
                          </Card>
                        </div>
                      ))}
                    </>
                  )}
                </Card.Body>
              </Card>
            </Grid>
          </Grid>
          <div></div>
        </div>
      </section>

      <SendManualNotification show={show} setShow={setShow} />
    </div>
  );
}

export default Notifications