import React, { useContext, useEffect } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Typography from "@mui/material/Typography";
import "./SideBarComponent.scss";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import theChennaiCakeryLogo from "../../assets/img/tcc-logo.png";
import MainContext from "../../context/MainContext";
import DataContext from "../../context/DataContext";

const SideBarComponent = ({ collapsed, toggled, setToggled, setBroken }) => {
  const { activeLink, setActiveLink, userRole } = useContext(MainContext);
  const { RoutesList } = useContext(DataContext);

  const location = useLocation();

  useEffect(() => {
    const pathArray = location.pathname.split("/");
    const lastParam = pathArray[pathArray.length - 1];
    setActiveLink(lastParam);
  }, []);

  return (
    <div>
      <Sidebar
        collapsed={collapsed}
        className={`dashboard-sidebar`}
        onBackdropClick={() => setToggled(!toggled)}
        toggled={toggled}
        onBreakPoint={setBroken}
        breakPoint="md"
      >
        <Menu className="sideBarHeader">
          <MenuItem
            icon={
              <img
                src={theChennaiCakeryLogo}
                alt=""
                className="dashboard-icon"
              />
            }
            component={<Link to={"/"} />}
            onClick={() => setActiveLink("")}
          >
            <span className="dashboard-title">Magilshe</span>
            <span
              className="toggle-icon-mobile"
              onClick={() => setToggled(!toggled)}
            >
              <FontAwesomeIcon icon={faCircleChevronLeft} />
            </span>
          </MenuItem>
        </Menu>
        <div className="asideBar-nav-section">
          {RoutesList.map((item) => (
            <RenderNavItem
              key={item.key}
              item={item}
              activeLink={activeLink}
              setActiveLink={setActiveLink}
              collapsed={collapsed}
              userRole={userRole}
            />
          ))}
        </div>
      </Sidebar>
    </div>
  );
};

const RenderNavItem = ({
  item,
  activeLink,
  setActiveLink,
  collapsed,
  userRole,
}) => {
  if (
    !item ||
    (item.subMenu &&
      !item.subMenu.some(
        (subItem) =>
          subItem.accessRoles === "all" ||
          subItem?.accessRoles?.includes(parseInt(userRole))
      ))
  ) {
    return null;
  }

  return (
    <>
      {item.heading_name && !item.isNoSubNav && (
        <div className="my-2 mx-4">
          <Typography
            variant="body2"
            fontWeight={600}
            style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: "0.5px" }}
            className="section-head"
          >
            {item.heading_name}
          </Typography>
        </div>
      )}

      <Menu key={item.key}>
        {item.subMenu ? (
          <SubMenu
            icon={<FontAwesomeIcon icon={item.icon} />}
            label={item.label}
            // open={item.subMenu.some(subItem => subItem.key === activeLink)}
          >
            {item.subMenu.map(
              (subItem) =>
                (subItem.accessRoles === "all" ||
                  subItem?.accessRoles?.includes(parseInt(userRole))) &&
                !item.isNoSubNav && (
                  <MenuItem
                    className="nav-menu-item"
                    key={subItem.key}
                    active={activeLink === subItem.key}
                    component={<Link to={subItem.link} />}
                    icon={<FontAwesomeIcon icon={subItem.icon} />}
                    onClick={() => setActiveLink(subItem.key)}
                  >
                    {subItem.label}
                  </MenuItem>
                )
            )}
          </SubMenu>
        ) : (
          (item.accessRoles === "all" ||
            item?.accessRoles?.includes(parseInt(userRole))) &&
          !item.isNoSubNav && (
            <MenuItem
              className="nav-menu-item"
              icon={<FontAwesomeIcon icon={item.icon} />}
              component={<Link to={item.link} />}
              active={activeLink === item.key}
              onClick={() => setActiveLink(item.key)}
            >
              {item.label}
            </MenuItem>
          )
        )}
      </Menu>
    </>
  );
};

export default SideBarComponent;
