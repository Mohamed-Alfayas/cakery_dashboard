import {
  Avatar,
  Grid,
  IconButton
} from "@mui/material";
import React, { useContext } from "react";
import { Card } from "react-bootstrap";
import MainContext from "../../context/MainContext";
import "./Profile.scss";
import { faAddressBook, faEnvelopeOpenText, faPhoneSquareAlt, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Profile = () => {
  const { userProfileData } = useContext(MainContext);

//   const pages = [
//     "user-verification",
//     "kit",
//     "order",
//     "whatsapp-query",
//     "food",
//     "meal",
//     "food-intake",
//   ];

  return (
    <section className="profile-page">
      <Card className="profile-info">
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <div className="info">
              <IconButton sx={{ p: 0 }} className="icon-button">
                <Avatar
                  alt="Login User"
                  src={require("../../assets/img/avatar-1.png")}
                  className="user-avatar mx-2"
                />
              </IconButton>
              <div className="content-section">
                <p className="title">DH-1001</p>
                <p className="value">{userProfileData?.name}</p>
              </div>
            </div>
          </Grid>

          
          <Grid item xs={6} md={6}>
            <div className="info">
              <IconButton sx={{ p: 0 }} className="icon-button">
                <FontAwesomeIcon icon={faEnvelopeOpenText} />
              </IconButton>
              <div className="content-section">
                <p className="title">Email</p>
                <p className="value">{userProfileData?.email}</p>
              </div>
            </div>
          </Grid>
          <Grid item xs={6} md={6}>
            <div className="info">
              <IconButton sx={{ p: 0 }} className="icon-button">
                <FontAwesomeIcon icon={faPhoneSquareAlt} />
              </IconButton>
              <div className="content-section">
                <p className="title">Phone</p>
                <p className="value">{userProfileData?.mobile}</p>
              </div>
            </div>
          </Grid>
          <Grid item xs={6} md={6}>
            <div className="info">
              <IconButton sx={{ p: 0 }} className="icon-button">
                <FontAwesomeIcon icon={faShieldHalved} />
              </IconButton>
              <div className="content-section">
                <p className="title">Role</p>
                <p className="value">{"Admin"}</p>
              </div>
            </div>
          </Grid>
          <Grid item xs={6} md={6}>
            <div className="info">
              <IconButton sx={{ p: 0 }} className="icon-button">
                <FontAwesomeIcon icon={faAddressBook} />
              </IconButton>
              <div className="content-section">
                <p className="title">Address</p>
                <p className="value">
                  Veeranamnagalam, KM Colony, nagercoil, Tamilnadu, PIN: 629901.
                </p>
              </div>
            </div>
          </Grid>
         
        </Grid>
      </Card>

   
    </section>
  );
};

export default Profile;
