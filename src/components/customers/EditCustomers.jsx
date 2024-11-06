import { useState, useContext, useEffect } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, TextField } from "@mui/material";
import { Offcanvas } from "react-bootstrap";
import { useDispatch } from "react-redux";
import MainContext from "../../context/MainContext";

const EditCustomers = ({ show, setShow, editableData, setEditableData }) => {
  const { ShowNotification } = useContext(MainContext);
  const isEditableDataAvail = Boolean(Object.keys(editableData).length);
  const dispatch = useDispatch();

  const [customerDetails, setCustomerDetails] = useState({
    id: 0,
    name: "",
    description: "",
    image: null,
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (Object.keys(editableData).length) {
      const { id, name, description, image_url } = editableData;
      setCustomerDetails({
        id: id || 0,
        name: name || "",
        description: description || "",
        image: image_url || null,
      });
      setPreview(image_url || "");
    }
  }, [editableData, show]);

  const handleClose = () => {
    setShow(false);
    setCustomerDetails({
      id: 0,
      name: "",
      description: "",
      image: null,
    });
    setPreview("");
    setEditableData({});
  };

  const handleOnchange = (value, name) => {
    if (name === "image") {
      setCustomerDetails((oldData) => ({
        ...oldData,
        [name]: value,
      }));
      setPreview(URL.createObjectURL(value));
    } else {
      setCustomerDetails((oldData) => ({
        ...oldData,
        [name]: value,
        id: isEditableDataAvail ? editableData.id : 0,
      }));
    }
  };

  const handleCustomers = async () => {
    // const formData = new FormData();

    // formData.append("id", customerDetails?.id);
    // formData.append("name", customerDetails.name);
    // formData.append("description", customerDetails.description);
    // if (customerDetails.image) {
    //   formData.append("image", customerDetails.image);
    // }

    // const result = await PostApi(CreateMainCategoryUrl, formData, true);

    // if (result.status !== 200) {
    //   ShowNotification("error", result.data.message);
    ShowNotification("error", "");
    dispatch();
    //   return;
    // }

    // if (isEditableDataAvail) {
    //   dispatch(editMainCategoryReducerData(result.data?.data));
    // } else {
    //   console.log("cake result ====", result);
    //   dispatch(addMainCategoryReducerData(result.data?.data));
    // }

    handleClose();
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
              {isEditableDataAvail ? "Edit Customer" : "Add Customer"}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <TextField
              id="category-name"
              className="my-2"
              label="Customer Name"
              fullWidth
              size="small"
              required
              value={customerDetails.name || ""}
              onChange={(e) => {
                handleOnchange(e.target.value, "name");
              }}
            />
            <TextField
              id="category-description"
              className="my-2"
              label="Category Description"
              multiline
              rows={3}
              fullWidth
              size="small"
              required
              value={customerDetails.description || ""}
              onChange={(e) => {
                handleOnchange(e.target.value, "description");
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
                  handleCustomers();
                }}
              >
                <FontAwesomeIcon icon={faPlus} className="mx-1" />
                {isEditableDataAvail ? "Update Customer" : "Add Customer"}
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
};

export default EditCustomers;
