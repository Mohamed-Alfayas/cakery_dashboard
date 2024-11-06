import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Fab,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { GetApi } from "../../../hooks/Get/GetApi";
import {
  CreateCakeUrl,
  GetKgUrl,
  GetSubCategoryUrl,
  GetTagUrl,
  GetUnitUrl,
} from "../../../Constant/urls/urls";
import MainContext from "../../../context/MainContext";
import { useDispatch, useSelector } from "react-redux";
import { setSubCategoryReducerData } from "../../../redux/reducer/ChildReducer/SubCategoryReducer";
import { setKgReducerData } from "../../../redux/reducer/ChildReducer/KgReducer";
import {
  faEdit,
  faPlus,
  faDeleteLeft,
  faClose,
  faListCheck,
  faTrashAlt,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { PostApi } from "../../../hooks/Post/PostApi";
import { setTaglistReducerData } from "../../../redux/reducer/ChildReducer/TagListReducer";
import {
  addCakeListReducerData,
  editCakeListReducerData,
} from "../../../redux/reducer/ChildReducer/CakeListReducer";
import "./Cake.scss";
import { setUnitReducerData } from "../../../redux/reducer/ChildReducer/UnitReducer";

const EditCake = ({ show, setShow, editableData, setEditableData }) => {

  const { ShowNotification } = useContext(MainContext);

  const { sub_category_reducer_data } = useSelector(
    (state) => state.SubCategoryReducer
  );
  
  const { unit_reducer_data } = useSelector(
    (state) => state.UnitReducer
  );

  const { kg_reducer_data } = useSelector((state) => state.KgReducer);
  const { tag_list_reducer_data } = useSelector(
    (state) => state.TagListReducer
  );
  const dispatch = useDispatch();

  let isEditableDataAvail = Boolean(Object.keys(editableData).length);

  // const [preview, setPreview] = useState("");
  const [kgListarr, setKgListarr] = useState([]);
  const [disableKgDropDown, setDisableKgDropdown] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const [tempKg, setTempKg] = useState({
    'kg_id': null,
    'kg_name': null,
    'kg_price': null
  });
  
  const [cakeDetails, setCakeDetails] = useState({
    id: 0,
    name: "",
    price: 0,
    description: "",
    seo_text: "",
    seo_url: "",
    tag: [],
    sub_category: 0,
    kg_list: kgListarr,
    image_list: [],
  });

  useEffect(() => {
    if (Object.keys(editableData).length) {
      let editImageObj = editableData?.images?.map((file) => {
        return {
          id: file.id,
          // image: file,
          is_deleted: false,
          url: file?.url,
        };
      });
      setImagesFiles(editImageObj);

      setCakeDetails((oldData) => ({
        ...oldData,
        id: editableData.id,
        name: editableData.name,
        description: editableData.description,
        seo_text: editableData.seo_text,
        seo_url: editableData.seo_url,
        tag: editableData.tag.toString().split(","),
        sub_category: editableData.sub_category?.id,
        unit: editableData?.unit?.id,
        kg_list: editableData.price_list.map((item) => ({
          // ...item,
          id: item?.id,
          kg_id: item?.kg_id,
          kg_name: item?.kg,
          kg_price: item?.price,
          is_deleted: false,
        })),
        image_list: [],
      }));
      setKgListarr(
        editableData.price_list.map((item) => ({
          // ...item,
          id: item?.id,
          kg_id: item?.kg_id,
          kg_name: item?.kg,
          kg_price: item?.price,
          is_deleted: false,
        }))
      );
    }
    setDisableKgDropdown(false);
    setSelectedUnit(editableData?.unit?.name);
  }, [show, editableData]);

  useEffect(() => {
    getSubCategories();
    getKG();
    getTag();
    getUnit();
  }, []);

  const getUnit = async () => {
    try {
      const result = await GetApi(GetUnitUrl);
      
      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setUnitReducerData(result.data.data));
      }
    } catch (error) {
      console.error("getSubCategories Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    }
  };

  const getSubCategories = async () => {
    try {
      const result = await GetApi(GetSubCategoryUrl);
      
      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setSubCategoryReducerData(result.data.data));
      }
    } catch (error) {
      console.error("getSubCategories Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    }
  };

  const getKG = async () => {
    try {
      const result = await GetApi(GetKgUrl);

      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setKgReducerData(result.data?.data));
      }
    } catch (error) {
      console.error("getKG Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    }
  };

  const getTag = async () => {
    try {
      const result = await GetApi(GetTagUrl);

      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setTaglistReducerData(result.data?.data));
      }
    } catch (error) {
      console.error("getTag Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    }
  };

  const handleClose = () => {
    setShow(false);
    setEditableData({});
    setKgListarr([]);

    setTempKg({
      'id': 0,
      'kg_id': null,
      'kg_name': null,
      'kg_price': null
    });

    setImagesFiles([]);
    setCakeDetails({
      id: 0,
      name: "",
      price: 0,
      description: "",
      seo_text: "",
      seo_url: "",
      tag: [],
      sub_category: 0,
      kg_list: [],
      image_list: [],
    });
  };



  const handleOnchange = (value, name) => {

    if (name === "image_list") {
      setCakeDetails((oldData) => ({
        ...oldData,
        [name]: value,
      }));
      
    } else if (name === "price") {
      const cake_price = parseFloat(value);
      setCakeDetails((oldData) => ({
        ...oldData,
        [name]: cake_price,
      }));
    } else {
      setCakeDetails((oldData) => ({
        ...oldData,
        [name]: value,
      }));
    }
   
  };

  const handleAddCake = async (e) => {
    if (!cakeDetails.name) {
      ShowNotification("warning", "Please enter cake name");
      return;
    }
    if (!cakeDetails.sub_category) {
      ShowNotification("warning", "Please Select Sub Category");
      return;
    }
    if (!cakeDetails.seo_text) {
      ShowNotification("warning", "Please enter Seo Text");
      return;
    }
    if (!cakeDetails.seo_url) {
      ShowNotification("warning", "Please enter Seo URL");
      return;
    }
    if (!cakeDetails.tag.length) {
      ShowNotification("warning", "Please Select Tag");
      return;
    }
    if (!cakeDetails.kg_list.length) {
      ShowNotification("warning", "Please Enter KG");
      return;
    }
    if (
      cakeDetails.image_list.length === 0 &&
      editableData.images.length === 0
    ) {
      ShowNotification("warning", "Please select image");
      return;
    }
    e.preventDefault();
    const formData = new FormData();

    if (isEditableDataAvail) {
      formData.append("id", cakeDetails.id);
    }
    formData.append("name", cakeDetails.name);
    formData.append("price", cakeDetails.price);
    formData.append("description", cakeDetails.description);
    formData.append("seo_text", cakeDetails.seo_text);
    formData.append("seo_url", cakeDetails.seo_url);
    formData.append("sub_category", cakeDetails.sub_category);
    formData.append("unit", cakeDetails?.unit);
    formData.append("tag", cakeDetails.tag);

    // Append each kg_list item individually
    cakeDetails.kg_list.forEach((kgItem, index) => {
      formData.append(`kg_list[]`, JSON.stringify(kgItem));
    });

    /* Image @Vinish */
    let image_list = [];
    let sortImageFiles = imagesFiles?.sort((a, b) => a.id - b.id);
    sortImageFiles.forEach((file, index) => {
      let imageObject = {
        id: file?.id,
        index: index,
        image: file?.image,
        is_deleted: file?.is_deleted,
      };
      image_list.push(imageObject);
      formData.append(`image_data[]`, JSON.stringify(imageObject));
      formData.append(`image_list[]`, file?.image);
    });
    cakeDetails.image_list = image_list;
    /*  */

    const result = await PostApi(CreateCakeUrl, formData, true);
    
    if (result.status !== 200) {
      ShowNotification("error", result.data.message);
      return;
    } else {
      ShowNotification("success", result.data.message);
      if (isEditableDataAvail) {
        dispatch(editCakeListReducerData(result.data?.data));
      } else {
        dispatch(addCakeListReducerData(result.data?.data));
      }
    }

    handleClose();
  };

  
  const [imagesFiles, setImagesFiles] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
   
    const newImageFiles = files.map((file) => ({
      id: 0,
      image: file,
      is_deleted: false,
      url: URL.createObjectURL(file),
    }));
    
    setImagesFiles((prevFiles) => [...prevFiles, ...newImageFiles]);
    setCakeDetails((oldData) => ({
      ...oldData,
      image_list: [...oldData.image_list, ...newImageFiles],
    }));
    
  };

  const removeImage = (index) => {
  
    setImagesFiles((prevImages) =>
      prevImages
        .map((obj, idx) =>
          idx === index ? obj.id !== 0 && { ...obj, is_deleted: true } : obj
        )
        .filter((obj) => obj !== false)
    );
  };

  const restoreImage = (index) => {
    setImagesFiles((prevImages) =>
      prevImages.map((obj, idx) =>
        idx === index
          ? obj.id !== 0
            ? { ...obj, is_deleted: false }
            : null
          : obj
      )
    );
  };

  const handleOnChangeKg = (e) => {
    const { name, value } = e.target;
  
    setTempKg((items) => {
      if (name === "kg") {
        const kgData = kg_reducer_data?.find((val) => val.id === value);
        return {
          ...items,
          kg_id: kgData?.id,
          kg_name: kgData?.kg,
        };
      } else {
        return {
          ...items,
          kg_price: value,
        };
      }
    });
  };

  const handleAddKg = (e) => {
    
    if (tempKg?.kg_id && tempKg?.kg_price) {

      const list = {
        id: tempKg?.id,
        kg_id: tempKg?.kg_id,
        kg_name: tempKg?.kg_name,
        kg_price: tempKg?.kg_price,
        is_deleted: false,
      };

      console.log(list)
      if (tempKg?.id === 0 || !tempKg?.id) {

        if (!kgListarr?.find((val) => val.kg_id === tempKg?.kg_id)) {
          setKgListarr([...kgListarr, list]);

          setCakeDetails((oldData) => ({
            ...oldData,
            kg_list: [...cakeDetails.kg_list, list],
          }));
          setTempKg({});

        } else {
          ShowNotification("warning", "already Added");
        }

      } else {

        const updatedKgListarr = kgListarr.map((item) =>
          item.id === tempKg?.id ? { ...item, ...list } : item
        );
        setKgListarr(updatedKgListarr);
        setCakeDetails((prevData) => ({
          ...prevData,
          kg_list: updatedKgListarr,
        }));
        setTempKg({});

      }

      
    } else {
      ShowNotification("warning", "please enter KG details");
    }
  };

  const handleEditKg = (obj) => {
    setDisableKgDropdown(true);
    setTempKg(obj);
  };

  const handleDeleteKg = (obj) => {
    const filterDeleteKg = kgListarr.map((val) =>
      val.kg_id === obj.kg_id
        ? { ...val, is_deleted: obj.is_deleted === true ? false : true }
        : { ...val, is_deleted: false }
    );
    setKgListarr(filterDeleteKg);
    setCakeDetails((oldData) => ({
      ...oldData,
      kg_list: filterDeleteKg,
    }));
  };
  

  const handleTag = (e) => {
    setCakeDetails((oldData) => ({
      ...oldData,
      tag: e.target.value,
    }));
  };

  return (
    <>
      <div>
        <Offcanvas
          className="edit-cake-section"
          show={show}
          onHide={handleClose}
          placement={"end"}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              {isEditableDataAvail ? "Edit Cake" : "Add Cake"}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <TextField
              id="cakename"
              className="my-2"
              label="Cake Name"
              fullWidth
              size="small"
              required
              value={cakeDetails.name || ""}
              onChange={(e) => {
                handleOnchange(e.target.value, "name");
              }}
            />

            <TextField
              id="description"
              className="my-2"
              label="Cake Description"
              fullWidth
              multiline
              rows={2}
              size="small"
              required
              value={cakeDetails.description || ""}
              onChange={(e) => handleOnchange(e.target.value, "description")}
            />

            <Grid container spacing={2}>
              <Grid item md={6}>
                <FormControl fullWidth size="small" className="my-2">
                  <InputLabel id="category-select-label">Sub Category</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    label="Sub Category"
                    value={cakeDetails.sub_category || ""}
                    onChange={(e) => handleOnchange(e.target.value, "sub_category")}
                  >
                    {sub_category_reducer_data &&
                      sub_category_reducer_data.length > 0 ? (
                      sub_category_reducer_data.map((val) => (
                        <MenuItem key={val.id} value={val.id}>
                          {val.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No categories available</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={6}>
                <FormControl fullWidth size="small" className="my-2">
                  <InputLabel id="category-select-label">Unit</InputLabel>
                  <Select
                    labelId="unit-select-label"
                    id="unit-select"
                    label="Unit"
                    value={cakeDetails.unit || ""}
                    onChange={(e) => {
                      handleOnchange(e.target.value, "unit")
                      const selectedValue = unit_reducer_data.find((unit) => unit.id === e.target.value);
                      setSelectedUnit(selectedValue);
                    }}
                  >
                    {unit_reducer_data &&
                      unit_reducer_data.length > 0 ? (
                      unit_reducer_data.map((val) => (
                        <MenuItem key={val.id} value={val.id} data-name={val?.name}>
                          {val.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No Units available</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <TextField
              id="seo_text"
              className="my-2"
              label="SEO TEXT"
              fullWidth
              size="small"
              required
              value={cakeDetails.seo_text || ""}
              onChange={(e) => handleOnchange(e.target.value, "seo_text")}
            />

            <TextField
              id="seo_url"
              className="my-2"
              label="SEO URL"
              fullWidth
              size="small"
              required
              value={cakeDetails.seo_url || ""}
              onChange={(e) => handleOnchange(e.target.value, "seo_url")}
            />

            {/* Select Tags */}
            <FormControl fullWidth size="small" className="my-2">
              <InputLabel id="category-select-label">Tags</InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                label="Tags"
                multiple
                value={cakeDetails.tag || []}
                onChange={(e) => handleTag(e)}
              >
                {tag_list_reducer_data && tag_list_reducer_data.length > 0 ? (
                  tag_list_reducer_data.map((val) => (
                    <MenuItem key={val.id} value={`${val.id}`}>
                      {val.tag}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No Tags available</MenuItem>
                )}
              </Select>
            </FormControl>

            {/* KG */}
            <Grid container spacing={2}>
              <Grid item md={4}>
                <FormControl fullWidth size="small" className="my-2">
                  <InputLabel id="category-select-label">Sub Unit</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    label="Sub Unit"
                    name="kg"
                    value={tempKg?.kg_id || ""}
                    onChange={(e) => handleOnChangeKg(e)}
                    disabled={disableKgDropDown}
                  // disabled={Object.keys(editableData).length > 0}
                  >
                    {kg_reducer_data && kg_reducer_data.length > 0 ? (
                      kg_reducer_data.filter(
                        (val) => val?.unit?.id === cakeDetails?.unit
                      )?.map((val, index) => (
                        <MenuItem key={index} value={val?.id}>
                          {val.kg}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No Data</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={5}>
                <TextField
                  id="price"
                  className="my-2"
                  label="Price"
                  size="small"
                  name="price"
                  required
                  value={tempKg.kg_price || 0}
                  onChange={(e) => handleOnChangeKg(e)}
                />
              </Grid>
              <Grid item md={3} className="d-flex align-items-center">
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  style={{
                    textTransform: "none",
                    borderRadius: "5px",
                  }}
                  onClick={(e) => handleAddKg(e)}
                >
                  <FontAwesomeIcon icon={faPlus} className="mx-1" />
                  {"Add"}
                </Button>
              </Grid>
            </Grid>

            {/* list of  Kgs and prices */}

            {kgListarr &&
              kgListarr.length > 0 &&
              kgListarr.map((val, index) => {
                return (
                  <>
                    <Grid container key={index} spacing={2}>
                      <Grid item md={7} className="d-flex align-items-center">
                        <div className="p-2">
                          <b>
                            <FontAwesomeIcon
                              icon={faCaretRight}
                              className="me-2"
                            />
                            {val.kg_name} {selectedUnit?.name} - {val.kg_price} Rs.
                          </b>
                        </div>
                      </Grid>
                      <Grid item md={5}>
                        <div className="text-end p-2">
                          
                          <Fab size="medium" color="secondary" aria-label="add" 
                          onClick={() => {
                            handleEditKg(val);
                          }} 
                          className="me-2"
                          style={{
                            borderRadius: '5px',                           
                            width: '40px',
                            height: '40px'
                          }}>
                            <FontAwesomeIcon icon={faEdit} className="" />
                          </Fab>

                          <Fab 
                            size="medium" 
                            color={val?.is_deleted ? "success" : "error"} 
                            aria-label="add" 
                            onClick={() => {
                              handleDeleteKg(val);
                            }} style={{
                              borderRadius: '5px',
                              width: '40px',
                              height: '40px'
                            }}
                          >
                            <FontAwesomeIcon
                              icon={val?.is_deleted ? faPlus : faTrashAlt}
                            />
                          </Fab>

                        </div>
                      </Grid>
                    </Grid>
                  </>
                );
              })}

            <div className="image-section my-3">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />

              <div style={{ display: "flex", flexWrap: "wrap", marginTop: 20 }}>
                {imagesFiles.map((image, index) => (
                  <div key={index} style={{ position: "relative", margin: 10 }}>
                    <img
                      src={image?.url}
                      alt={`preview ${index}`}
                      style={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                    {!image?.is_deleted ? (
                      <button
                        onClick={() => removeImage(index)}
                        className="remove-image-icon"
                      >
                        <FontAwesomeIcon icon={faClose} />
                      </button>
                    ) : (
                      <button
                        onClick={() => restoreImage(index)}
                        className="add-image-icon"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    )}
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
                  handleAddCake(e);
                }}
              >
                <FontAwesomeIcon icon={faPlus} className="mx-1" />
                {isEditableDataAvail ? "Update Cake" : "Add Cake"}
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
};

export default EditCake;
