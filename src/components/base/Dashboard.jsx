import React, { useContext, useEffect, useState } from "react";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import preloader2 from "../../assets/img/preloader-2.gif";
import "./Dashboard.scss";
import Logout from "../login/Logout";
import SideBarComponent from "./SideBarComponent";
import MainContext from "../../context/MainContext";

import NotificationBlock from "../notifications/NotificationBlock";

const Dashboard = ({ children, setSigned, setMountLogin }) => {

  const { isInitPreLoading, isPreLoading } = useContext(MainContext);

  const Preloader = () => {
    return (
      <div className="preloader-section">
        <img src={preloader2} alt="Loading..." />
      </div>
    );
  };

  const [collapsed, setCollapsed] = useState();

  /* Local Storage */

  useEffect(() => {
    const storedValue = localStorage.getItem('isCollapsedNav');
    const isCollapsedNav = !!storedValue && storedValue.toLowerCase() === 'true';
    setCollapsed(isCollapsedNav)
  },[]);

  /*  */

  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);

  /*  */

  
  
  return (
    <div>
      {isPreLoading && <Preloader />}

      {isInitPreLoading ? (
        <Preloader />
      ) : (
        <>
          <div>
            <div style={{ display: "flex", height: "100%" }}>
              <SideBarComponent
                collapsed={collapsed}
                toggled={toggled}
                setToggled={setToggled}
                broken={broken}
                setBroken={setBroken}
              />
              <main
                style={{ padding: 10 }}
                className={`main-component-section p-0 ${collapsed ? "sidebar-close": "sidebar-open"}`}
              >
                <Box className="top-navbar">
                  <AppBar position="static">
                    <Toolbar className="d-flex justify-content-between">
                      <div>
                        <IconButton
                          size="large"
                          edge="start"
                          color="inherit"
                          aria-label="menu"
                          className="collapse-button-desktop"
                          onClick={() => {
                            setCollapsed(!collapsed);
                            localStorage.setItem("isCollapsedNav", !collapsed);
                          }}
                        >
                          <FontAwesomeIcon icon={faBars} />
                        </IconButton>
                        {broken && (
                          <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            className="collapse-button-mobile"
                            onClick={() => {
                              setCollapsed(false);
                              setToggled(!toggled);
                            }}
                          >
                            <FontAwesomeIcon icon={faBars} />
                            <img
                              src={require("../../assets/img/tcc-logo.png")}
                              alt=""
                              className="dashboard-icon mx-2"
                            />
                          </IconButton>
                        )}
                      </div>
                      <div className="d-flex justify-content-start">
                       

                        <NotificationBlock />
                       
                        <Logout
                          setSigned={setSigned}
                          setMountLogin={setMountLogin}
                        />
                      </div>
                    </Toolbar>
                  </AppBar>
                </Box>

                <section className="main-component">{children}</section>
              </main>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
