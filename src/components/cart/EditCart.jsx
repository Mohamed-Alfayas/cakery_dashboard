import { useState, useContext, useEffect } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, TextField } from "@mui/material";
import { Offcanvas } from "react-bootstrap";
import { useDispatch } from "react-redux";
import MainContext from "../../context/MainContext";

const EditCart = ({ show, setShow, editableData, setEditableData }) => {
  const { ShowNotification } = useContext(MainContext);
  const isEditableDataAvail = Boolean(Object.keys(editableData).length);
  const dispatch = useDispatch();

  const [cakeDetails, setCakeDetails] = useState({
    id: 0,
    name: "",
    description: "",
    image: null,
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (Object.keys(editableData).length) {
      const { id, name, description, image_url } = editableData;
      setCakeDetails({
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
    setCakeDetails({
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
      setCakeDetails((oldData) => ({
        ...oldData,
        [name]: value,
      }));
      setPreview(URL.createObjectURL(value));
    } else {
      setCakeDetails((oldData) => ({
        ...oldData,
        [name]: value,
        id: isEditableDataAvail ? editableData.id : 0,
      }));
    }
  };

  const handleAddCart = async () => {
    // const formData = new FormData();

    // formData.append("id", cakeDetails?.id);
    // formData.append("name", cakeDetails.name);
    // formData.append("description", cakeDetails.description);
    // if (cakeDetails.image) {
    //   formData.append("image", cakeDetails.image);
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
              {isEditableDataAvail ? "Edit Cart" : "Add Cart"}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <TextField
              id="category-name"
              className="my-2"
              label="Cart Name"
              fullWidth
              size="small"
              required
              value={cakeDetails.name || ""}
              onChange={(e) => {
                handleOnchange(e.target.value, "name");
              }}
            />
            <TextField
              id="category-description"
              className="my-2"
              label="Cart Description"
              multiline
              rows={3}
              fullWidth
              size="small"
              required
              value={cakeDetails.description || ""}
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
                  handleAddCart();
                }}
              >
                <FontAwesomeIcon icon={faPlus} className="mx-1" />
                {isEditableDataAvail ? "Update Cart" : "Add Cart"}
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
};

export default EditCart;
