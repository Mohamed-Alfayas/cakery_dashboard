import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormControl, Button, InputLabel, MenuItem, Select, TextField, Grid } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import MainContext from "../../context/MainContext";
import { PostApi } from "../../hooks/Post/PostApi";
import { CreateOfferUrl } from "../../Constant/urls/urls";
import {
  addOffersReducerData,
  editOffersReducerData,
} from "../../redux/reducer/ChildReducer/OffersReducer";
import { ConvertDateTimeStrFunction } from "../../commonFunctions";

const EditOffers = ({ show, setShow, editableData, setEditableData }) => {
  const { ShowNotification } = useContext(MainContext);
  const dispatch = useDispatch();
  const { cake_list_reducer_data } = useSelector(
    (state) => state.CakeListReducer
  );

  let isEditableDataAvail = Boolean(Object.keys(editableData).length);

  const [offerDetails, setOfferDetails] = useState({
    id: 0,
    type: 3,
    id_list: {},
    name: "",
    offer_per: 0,
    offer_from: "",
    offer_to: "",
    image: {},
  });

  const [selectedCakes, setSelectedCakes] = useState([]);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (Object.keys(editableData).length) {

      const newIdList = new Set(editableData?.id_list);
      setOfferDetails({
        ...editableData,
        id_list: { newIdList },
      });
      if (editableData?.url) {
        setPreview(editableData?.url);
      } else {
        setPreview("");
      }
      setSelectedCakes(editableData?.cake_list)
    } else {
      const formattedDateTime = new Date().toISOString().slice(0, 16);
      setOfferDetails((prevDetails) => ({
        ...prevDetails,
        offer_to: formattedDateTime,
        offer_from: formattedDateTime
      }));
    }
  }, [show, editableData]);


  useEffect(() => {
    const filteredData = cake_list_reducer_data.filter((val) =>
      selectedCakes.includes(val.id)
    );
    const mappedData = filteredData.flatMap((val) =>
      val.price_list.map((obj) => obj.id)
    );
    const mappedObj = (mappedData);

    setOfferDetails((oldData) => ({
      ...oldData,
      id_list: mappedObj,
    }));
  }, [selectedCakes]);

  useEffect(() => {
    if (offerDetails.offer_from) {
      const formattedDateString = ConvertDateTimeStrFunction(
        offerDetails.offer_from
      );
      setOfferDetails((oldData) => ({
        ...oldData,
        offer_from: formattedDateString,
      }));
    }
  }, [offerDetails.offer_from]);
  useEffect(() => {
    if (offerDetails.offer_to) {
      const formattedDateString = ConvertDateTimeStrFunction(
        offerDetails.offer_to
      );

      setOfferDetails((oldData) => ({
        ...oldData,
        offer_to: formattedDateString,
      }));
    }
  }, [offerDetails.offer_to]);

  const handleClose = () => {
    setShow(false);
    setOfferDetails({
      id: 0,
      type: 3,
      id_list: {},
      name: "",
      offer_per: 0,
      offer_from: "",
      offer_to: "",
    });
    setSelectedCakes([]);
    setEditableData({});
  };

  const handleOnchange = (value, name) => {
    if (name === "offer_per" && value > 99.9) {
      return; // Stop execution if the value is greater than 100
    }

    if (name === "image") {
      setPreview(URL.createObjectURL(value));
      setOfferDetails((oldData) => ({
        ...oldData,
        image: value,
      }));
    } else {
      setOfferDetails((oldData) => ({
        ...oldData,
        [name]: value,
        id: isEditableDataAvail ? editableData.id : 0,
      }));
    }
  };

  const handleCakeList = (e) => {
    console.log(e.target.value.flat())
    setSelectedCakes(e.target.value.flat());
  };

  const handleOffer = async (e) => {
    e.preventDefault();

    if (!offerDetails.name) {
      ShowNotification("warning", "Please Enter Offer Name");
      return;
    }
    if (!offerDetails.offer_from) {
      ShowNotification("warning", "Please Enter Offer from Date");
      return;
    }
    if (!offerDetails.offer_to) {
      ShowNotification("warning", "Please Enter Offer end Date");
      return;
    }
    if (!offerDetails.offer_per) {
      ShowNotification("warning", "Please Enter Offer Percentage");
      return;
    }

    const formData = new FormData();

    if (isEditableDataAvail) {
      formData.append("id", offerDetails.id);
    } else {
      formData.append("id", 0);
    }
    formData.append("type", 3);
    formData.append("id_list", offerDetails.id_list);
    formData.append("name", offerDetails.name);
    formData.append("offer_per", offerDetails.offer_per);
    formData.append("offer_from", offerDetails.offer_from);
    formData.append("offer_to", offerDetails.offer_to);
    if (offerDetails.image) {
      formData.append("image", offerDetails.image);
    }

    try {
      const result = await PostApi(CreateOfferUrl, formData);
      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        if (isEditableDataAvail) {
          ShowNotification("success", result.data?.message);
          dispatch(editOffersReducerData(result.data?.data));
        } else {
          ShowNotification("success", result.data?.message);
          dispatch(addOffersReducerData(result.data.data));
        }
      }
      handleClose();
    } catch (error) {
      console.error("offer Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    }

    
  };
  return (
    <>
      <div>
        <Offcanvas
          className="cgm-expiry-user-action-modal"
          show={show}
          onHide={handleClose}
          placement={"end"}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              {isEditableDataAvail ? "Edit offer" : "Add offer"}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>

            <Grid container spacing={2}>

              <Grid item md={12}>

                <TextField
                  id="offer name"
                  className="my-2"
                  label="offer Name"
                  fullWidth
                  size="small"
                  required
                  value={offerDetails.name || ""}
                  onChange={(e) => {
                    handleOnchange(e.target.value, "name");
                  }}
                />
              </Grid>

              <Grid item md={6}>
                <TextField
                  id="offer_start_date"
                  className="my-2"
                  label="Offer Start Date"
                  fullWidth
                  size="small"
                  required
                  value={offerDetails.offer_from || ""}
                  onChange={(e) => {
                    handleOnchange(e.target.value, "offer_from");
                  }}
                  type="datetime-local"
                />
              </Grid>

              <Grid item md={6}>
                <TextField
                  id="offer_end_date"
                  className="my-2"
                  label="Offer End Date"
                  fullWidth
                  type="datetime-local"
                  size="small"
                  required
                  value={offerDetails.offer_to || ""}
                  onChange={(e) => {
                    handleOnchange(e.target.value, "offer_to");
                  }}

                />
              </Grid>

              <Grid item md={4}>

                <TextField
                  id="offer_per"
                  className="my-2"
                  label="Offer Percentage"
                  fullWidth
                  size="small"
                  required
                  value={offerDetails.offer_per || ""}
                  onChange={(e) => {
                    handleOnchange(e.target.value, "offer_per");
                  }}
                  type="number"
                />
              </Grid>
              <Grid item md={8}>

                {/* display all Cakes */}
                <FormControl fullWidth size="small" className="my-2">
                  <InputLabel id="category-select-label">Offered Cakes</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    label="Offered Cakes"
                    multiple
                    value={selectedCakes}
                    onChange={handleCakeList}
                  >
                    {cake_list_reducer_data && cake_list_reducer_data.length > 0 ? (
                      cake_list_reducer_data.map((val) => (
                        <MenuItem key={val.id} value={val.id}>
                          {val.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No Cakes available</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item md={12}>

                <Grid container spacing={2}>
                  <Grid item md={9}>
                    <div className="my-2">
                      <InputLabel>Offer Image</InputLabel>
                      <input
                        type="file"
                        accept="image/*"
                        className="mt-2"
                        onChange={(e) => {
                          handleOnchange(e.target.files[0], "image");
                        }}
                      />
                    </div>
                  </Grid>

                  <Grid item md={3}>

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
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* add cake button */}
            <div className="text-end mt-4">
              <Button
                variant="contained"
                color="primary"
                size="small"
                style={{
                  textTransform: "none",
                  borderRadius: "5px",
                }}
                onClick={(e) => {
                  handleOffer(e);
                }}
              >
                <FontAwesomeIcon icon={faPlus} className="mx-1" />
                {isEditableDataAvail ? "Update offer" : "Add offer"}
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
};

export default EditOffers;
