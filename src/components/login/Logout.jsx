import React, { useContext, useState } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIdCardClip,
  faRightFromBracket,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import MainContext from "../../context/MainContext";
import { CAKERY_TOKEN } from "../../Constant/Keys/Keys";

const Logout = ({ setSigned, setMountLogin }) => {
  const navigate = useNavigate();
  const [logged, setLogged] = useState(true);
  const cookies = new Cookies();

  const { userRole } = useContext(MainContext);

  const handleLogin = () => {
    cookies.remove("access_token");
    localStorage.removeItem(CAKERY_TOKEN);
    setLogged(false);
    setSigned(false);
    setMountLogin(true);
    navigate("/login");
  };

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return logged ? (
    <>
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open settings">
          <IconButton
            onClick={handleOpenUserMenu}
            sx={{ p: 0 }}
            className="user-icon"
            style={{ fontWeight: "bold" }}
          >
            <Avatar
              alt="Login User"
              src={require("../../assets/img/avatar-1.png")}
              className="mx-2"
            />
            {parseInt(userRole) === 4 ? "Admin" : "Admin"}
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem
            onClick={() => {
              navigate("/profile");
              handleCloseUserMenu();
            }}
          >
            <Typography textAlign="center">
              <FontAwesomeIcon icon={faIdCardClip} className="mx-1" /> Profile
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleLogin}>
            <Typography textAlign="center">
              <FontAwesomeIcon icon={faRightFromBracket} className="mx-1" />{" "}
              Logout
            </Typography>
          </MenuItem>
        </Menu>
      </Box>
    </>
  ) : (
    <>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={handleLogin}
      >
        <FontAwesomeIcon icon={faSignOut} />
      </IconButton>
    </>
  );
};

export default Logout;
