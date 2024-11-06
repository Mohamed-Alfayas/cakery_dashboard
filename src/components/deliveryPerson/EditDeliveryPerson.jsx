import { useState, useContext, useEffect } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, TextField } from "@mui/material";
import { Offcanvas } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  addMainCategoryReducerData,
  editMainCategoryReducerData,
} from "../../redux/reducer/ChildReducer/MainCategoryReducer";
import { PostApi } from "../../hooks/Post/PostApi";
import {
  CreateDeliveryPersonUrl,
  CreateMainCategoryUrl,
} from "../../Constant/urls/urls";
import MainContext from "../../context/MainContext";
import {
  addDeliveryPersonReducerData,
  editDeliveryPersonReducerData,
} from "../../redux/reducer/ChildReducer/DeliveryPersonReducer";

const EditDeliveryPerson = ({
  show,
  setShow,
  editableData,
  setEditableData,
}) => {
  const { ShowNotification } = useContext(MainContext);
  const isEditableDataAvail = Boolean(Object.keys(editableData).length);
  const dispatch = useDispatch();

  const [deliveryPersonDetails, setDeliveryPersonDetails] = useState({
    id: 0,
    name: "",
    phone: "",
    email: "",
    address: "",
    dob: "",
    image: null,
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (Object.keys(editableData).length) {
      const { id, name, phone, email, address, dob, image_url } = editableData;
      console.log(editableData);
      setDeliveryPersonDetails({
        id: id || 0,
        name: name || "",
        phone: phone || "",
        email: email || "",
        address: address || "",
        dob: dob || "",
        image: null,
      });
      setPreview(image_url || "");
    }
  }, [editableData, show]);

  const handleClose = () => {
    setShow(false);
    setDeliveryPersonDetails({
      id: 0,
      name: "",
      phone: "",
      email: "",
      address: "",
      dob: "",
      image: null,
    });
    setPreview("");
    setEditableData({});
  };

  const handleOnchange = (value, name) => {
    if (name === "image") {
      setDeliveryPersonDetails((oldData) => ({
        ...oldData,
        [name]: value,
      }));
      setPreview(URL.createObjectURL(value));
    } else {
      setDeliveryPersonDetails((oldData) => ({
        ...oldData,
        [name]: value,
        id: isEditableDataAvail ? editableData.id : 0,
      }));
    }
  };

  const handleAddDeliveryPerson = async () => {
    const formData = new FormData();
    if (!deliveryPersonDetails.name) {
      ShowNotification("warning", "Please Enter Person name");
      return;
    }
    if (!deliveryPersonDetails.phone) {
      ShowNotification("warning", "Please Enter Mobile Number");
      return;
    }
    if (!deliveryPersonDetails.email) {
      ShowNotification("warning", "Please Enter Email Address");
      return;
    }
    if (!deliveryPersonDetails.dob) {
      ShowNotification("warning", "Please Enter Date Of Birth");
      return;
    }
    if (!deliveryPersonDetails.address) {
      ShowNotification("warning", "Please Enter Address");
      return;
    }
    if (isEditableDataAvail) {
      formData.append("id", deliveryPersonDetails?.id);
    }
    
    formData.append("name", deliveryPersonDetails.name);
    formData.append("phone", deliveryPersonDetails.phone);
    formData.append("email", deliveryPersonDetails.email);
    formData.append("dob", deliveryPersonDetails.dob);
    formData.append("address", deliveryPersonDetails.address);
    if (deliveryPersonDetails.image) {
      formData.append("image", deliveryPersonDetails.image);
    }
    try {
      const result = await PostApi(CreateDeliveryPersonUrl, formData, true);

      console.log("result ===", result);
      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        if (isEditableDataAvail) {
          dispatch(editDeliveryPersonReducerData(result.data?.data));
        } else {
          dispatch(addDeliveryPersonReducerData(result.data?.data));
        }
        ShowNotification("success", result.data?.message);
        handleClose();

      }
    } catch (error) {
      console.error("post category Error:", error);
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
              {isEditableDataAvail
                ? "Edit delivery Person"
                : "Add delivery Person"}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <TextField
              id="person_name"
              className="my-2"
              label="Delivery Person Name"
              fullWidth
              size="small"
              required
              value={deliveryPersonDetails.name || ""}
              onChange={(e) => {
                handleOnchange(e.target.value, "name");
              }}
            />
            <TextField
              id="person_phone"
              className="my-2"
              label="Mobile Number"
              fullWidth
              size="small"
              required
              value={deliveryPersonDetails.phone || ""}
              onChange={(e) => {
                handleOnchange(e.target.value, "phone");
              }}
            />
            <TextField
              id="person_email"
              className="my-2"
              label="Email"
              fullWidth
              size="small"
              required
              value={deliveryPersonDetails.email || ""}
              onChange={(e) => {
                handleOnchange(e.target.value, "email");
              }}
            />
            <TextField
              id="person_dob"
              className="my-2"
              label="DOB"
              fullWidth
              size="small"
              required
              value={deliveryPersonDetails.dob || ""}
              onChange={(e) => {
                handleOnchange(e.target.value, "dob");
              }}
            />
            <TextField
              id="person_address"
              className="my-2"
              label="Address"
              multiline
              rows={3}
              fullWidth
              size="small"
              required
              value={deliveryPersonDetails.address || ""}
              onChange={(e) => {
                handleOnchange(e.target.value, "address");
              }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleOnchange(e.target.files[0], "image");
              }}
            />
            {preview && (
              <div className="mt-2">
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "10px",
                  }}
                />
              </div>
            )}
            <div className="text-end">
              <Button
                variant="contained"
                color="primary"
                size="small"
                style={{
                  textTransform: "none",
                  borderRadius: "5px",
                }}
                onClick={(e) => {
                  handleAddDeliveryPerson();
                }}
              >
                <FontAwesomeIcon icon={faPlus} className="mx-1" />
                {isEditableDataAvail
                  ? "Edit delivery Person"
                  : "Add delivery Person"}
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
};

export default EditDeliveryPerson;
