import { faFileLines, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Grid, InputLabel, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import MainContext from "../../context/MainContext";
import { GetApi } from "../../hooks/Get/GetApi";
import {
  GetConfigurationUrl,
  UpdateConfigurationUrl,
} from "../../Constant/urls/urls";
import PreLoaderComponent from "../../common/PreLoaderComponent";
import { setConfigReducerData } from "../../redux/reducer/ChildReducer/ConfigReducer";
import { useDispatch, useSelector } from "react-redux";
import { PostApi } from "../../hooks/Post/PostApi";
import { setIsConfigLoadingReducerData } from "../../redux/reducer/ChildReducer/CommonLoaderReducer";

const Config = () => {
  const { ShowNotification } = useContext(MainContext);
  const dispatch = useDispatch();

  const { config_reducer_data } = useSelector((state) => state.ConfigReducer);
  const { is_config_loading } = useSelector(
    (state) => state.CommonLoaderReducer
  );
  const [companyDetails, setCompanyDetails] = useState({
    id: 0,
    name: "",
    company_address: "",
    email: "",
    website: "",
    mobile: 0,
    company_fax: "",
    gst_number: "",
    food_license_number: "",
    map_iframe_link: "",
    description: "",
    return_policy: "",
    image: {},
    greeting_text: "",
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    getConfiguration();
  }, []);
  useEffect(() => {
    setCompanyDetails(config_reducer_data);
    if (config_reducer_data?.url) {
      setPreview(config_reducer_data?.url);
    } else {
      setPreview("");
    }
  }, [config_reducer_data]);

  const handleOnchange = (value, name) => {
    console.log("value ===", value);
    if (name === "image") {
      setPreview(URL.createObjectURL(value));
      console.log("valuye ===", value);
      setCompanyDetails((oldData) => ({
        ...oldData,
        image: value,
      }));
    } else {
      setCompanyDetails((oldData) => ({
        ...oldData,
        [name]: value,
      }));
    }
  };

  const handleValidate = (msg, value, name) => {
    if (value) {
      switch (name) {
        case "phone":
          const regex_mobile = /^[6-9]\d{9}$/;
          const is_valid_mobile = regex_mobile.test(value);
          if (!is_valid_mobile)
            return ShowNotification(
              "error",
              "Please Enter Valid Mobile Number"
            );
          break;
        case "email":
          const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const is_valid_email = regex_email.test(value);
          if (!is_valid_email)
            return ShowNotification(
              "error",
              "Please Enter Valid Email Address"
            );
          break;

        default:
          break;
      }
    } else {
      ShowNotification("error", msg);
      return;
    }
  };

  const getConfiguration = async () => {
    try {
      const result = await GetApi(GetConfigurationUrl);
      console.log("result = ===", result);
      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        if (!!result.data.data) {
          dispatch(setConfigReducerData(result.data.data));
        }
      }
    } catch (error) {
      console.error("getCakeList Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    } finally {
      dispatch(setIsConfigLoadingReducerData(false));
    }
  };

  const handleSave = async () => {
    console.log("company ===", companyDetails);
    const formdata = new FormData();
    if (!companyDetails.name) return handleValidate("Enter Company Name");
    if (!companyDetails.mobile) return handleValidate("Enter Mobile Number");
    if (!companyDetails.email) return handleValidate("Enter Email Address");

    if (!companyDetails.company_address)
      return handleValidate("Enter Company Address");
    if (!companyDetails.image && !companyDetails.url)
      return handleValidate("Please Choose Company Logo");

    handleValidate("", companyDetails.mobile, "phone");
    handleValidate("", companyDetails.email, "email");
    console.log("company details ====", companyDetails);

    formdata.append("id", companyDetails?.id || 0);
    formdata.append("name", companyDetails?.name);
    formdata.append("company_address", companyDetails?.company_address);
    formdata.append("email", companyDetails?.email);
    formdata.append("website", companyDetails?.website);
    formdata.append("mobile", companyDetails?.mobile);
    formdata.append("company_fax", companyDetails?.company_fax || "");
    formdata.append("gst_number", companyDetails?.gst_number);
    formdata.append("food_license_number", companyDetails?.food_license_number);
    formdata.append("map_iframe_link", companyDetails?.map_iframe_link);
    formdata.append("description", companyDetails?.description);
    formdata.append("return_policy", companyDetails?.return_policy);
    formdata.append("greeting_text", companyDetails?.greeting_text || "");
    if(companyDetails?.image){
      formdata.append("image", companyDetails?.image);
    }
    try {
      const result = await PostApi(UpdateConfigurationUrl, formdata);
      console.log("result = ===", result);
      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setConfigReducerData(result.data.data));
      }
    } catch (error) {
      console.error("getCakeList Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    }
  };

  if (is_config_loading) {
    return <PreLoaderComponent />;
  }

  return (
    <div>
      <section className="component-heading my-2">
        <FontAwesomeIcon icon={faFileLines} className="mx-2" />
        Configuration
      </section>

      <Card className="p-4 my-2">
        <Grid container spacing={2}>
          <Grid item md={6} xs={6} className="text-start">
            <div className="my-2">
              <InputLabel>Company Name</InputLabel>
              <TextField
                id="name"
                className="my-2"
                fullWidth
                size="small"
                required
                value={companyDetails.name || ""}
                onChange={(e) => handleOnchange(e.target.value, "name")}
              />
            </div>

            <div className="my-2">
              <InputLabel>Mobile Number</InputLabel>
              <TextField
                id="mobile_number"
                className="my-2"
                fullWidth
                size="small"
                required
                value={companyDetails.mobile || ""}
                onChange={(e) => handleOnchange(e.target.value, "mobile")}
              />
            </div>
            <div className="my-2">
              <InputLabel>Email</InputLabel>
              <TextField
                id="email"
                className="my-2"
                fullWidth
                size="small"
                required
                value={companyDetails.email || ""}
                onChange={(e) => handleOnchange(e.target.value, "email")}
              />
            </div>
            <div className="my-2">
              <InputLabel>Company Website</InputLabel>
              <TextField
                id="website"
                className="my-2"
                fullWidth
                size="small"
                required
                value={companyDetails.website || ""}
                onChange={(e) => handleOnchange(e.target.value, "website")}
              />
            </div>

            <div className="my-2">
              <InputLabel>GST-IN</InputLabel>
              <TextField
                className="my-2"
                fullWidth
                size="small"
                required
                value={companyDetails.gst_number || ""}
                onChange={(e) => handleOnchange(e.target.value, "gst_number")}
              />
            </div>
            <div className="my-2">
              <InputLabel>Food License Number</InputLabel>
              <TextField
                className="my-2"
                fullWidth
                size="small"
                required
                value={companyDetails.food_license_number || ""}
                onChange={(e) =>
                  handleOnchange(e.target.value, "food_license_number")
                }
              />
            </div>
            <div className="my-2">
              <InputLabel>Company Address</InputLabel>
              <TextField
                id="company_address"
                className="my-2"
                fullWidth
                multiline
                rows={3}
                size="small"
                required
                value={companyDetails.company_address || ""}
                onChange={(e) =>
                  handleOnchange(e.target.value, "company_address")
                }
              />
            </div>
          </Grid>
          <Grid item md={6} className="text-start">
            <div>
              <div className="my-2">
                <InputLabel>Company Logo</InputLabel>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2"
                  onChange={(e) => {
                    handleOnchange(e.target.files[0], "image");
                  }}
                />
              </div>
              {preview && (
                <div className="text-start">
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "10px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </div>

            <div className="my-2">
              <InputLabel>Google Map Iframe</InputLabel>
              <TextField
                className="my-2"
                fullWidth
                size="small"
                required
                value={companyDetails.map_iframe_link || ""}
                onChange={(e) =>
                  handleOnchange(e.target.value, "map_iframe_link")
                }
              />
            </div>

            <div className="my-2">
              <InputLabel>description</InputLabel>
              <TextField
                className="my-2"
                fullWidth
                size="small"
                required
                multiline
                rows={4}
                value={companyDetails.description || ""}
                onChange={(e) => handleOnchange(e.target.value, "description")}
              />
            </div>

            <div className="my-2">
              <InputLabel>Return Policy</InputLabel>
              <TextField
                className="my-2"
                fullWidth
                size="small"
                required
                multiline
                rows={4}
                value={companyDetails.return_policy || ""}
                onChange={(e) =>
                  handleOnchange(e.target.value, "return_policy")
                }
              />
            </div>
            <div className="text-end">
              <Button
                variant="contained"
                color="success"
                size="small"
                style={{
                  textTransform: "none",
                  borderRadius: "5px",
                }}
                onClick={(e) => handleSave()}
              >
                <FontAwesomeIcon icon={faSave} className="mx-1" />
                Save Configuration
              </Button>
            </div>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default Config;
