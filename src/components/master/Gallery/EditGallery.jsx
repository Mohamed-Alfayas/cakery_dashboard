import { faClose, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import React, { useContext, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import MainContext from "../../../context/MainContext";
import { useDispatch } from "react-redux";
import { AddGalleryUrl } from "../../../Constant/urls/urls";
import { PostApi } from "../../../hooks/Post/PostApi";
import { addGalleryListReducerData } from "../../../redux/reducer/ChildReducer/GalleryListReducer";
import "./Gallery.scss";

const EditGallery = ({ show, setShow, setEditableData }) => {
  const { ShowNotification } = useContext(MainContext);
  const dispatch = useDispatch();

  const handleClose = () => {
    setShow(false);
    setSelectedImages([]);
    setImagesFiles([]);
    setEditableData({});
  };

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagesFiles, setImagesFiles] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagesArray = files.map((file) => URL.createObjectURL(file));
    setSelectedImages((prevImages) => prevImages.concat(imagesArray));
    setImagesFiles((prevFiles) => prevFiles.concat(files));

    files.forEach((file) => URL.revokeObjectURL(file));
  };

  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setImagesFiles(imagesFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (!imagesFiles.length) {
      ShowNotification("warning", "Please Choose Image");
      return;
    }
    // let image_list = [];

    imagesFiles.forEach((image, index) => {
      // let imageObject = {
      //   id: 0,
      //   index: index,
      //   image: image,
      // };
      // image_list.push(imageObject);
      formData.append(`images`, image);
    });

    const result = await PostApi(AddGalleryUrl, formData, true);
    console.log("result =====", result);
    if (result.status !== 200) {
      ShowNotification("error", result.data.message);
      return;
    } else {
      ShowNotification("success", result.data.message);
      // result.data.data.map((val) => {
      //   dispatch(addGalleryListReducerData(val));
      // });
      result.data.data.forEach((val) => {
        dispatch(addGalleryListReducerData(val));
      });
    }

    handleClose();
  };

  return (
    <>
      <div>
        <Offcanvas
          className="edit-gallery-section"
          show={show}
          onHide={handleClose}
          placement={"end"}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>{"Image Gallery"}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="image-section">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />

              <div style={{ display: "flex", flexWrap: "wrap", marginTop: 20 }}>
                {selectedImages.map((image, index) => (
                  <div key={index} style={{ position: "relative", margin: 10 }}>
                    <img
                      src={image}
                      alt={`preview ${index}`}
                      style={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="remove-image-icon"
                    >
                      <FontAwesomeIcon icon={faClose} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* add cake button */}
            <div className="text-end">
              <Button
                variant="contained"
                color="success"
                size="small"
                style={{
                  textTransform: "none",
                  borderRadius: "5px",
                }}
                onClick={(e) => {
                  handleSubmit(e);
                }}
              >
                <FontAwesomeIcon icon={faSave} className="mx-1" />
                {"Update"}
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
};

export default EditGallery;
