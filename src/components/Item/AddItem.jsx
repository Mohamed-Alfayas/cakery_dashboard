import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Checkbox, FormControlLabel, Grid } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import MainContext from "../../../src/context/MainContext";
import { GetSubCategoryUrl, GetTaxCategoryUrl, ItemsUrl } from "../../Constant/urls/urls";
import { PostApi } from "../../hooks/Post/PostApi";
import { addItemReducerData, editItemReducerData } from "../../redux/reducer/ChildReducer/ItemReducer";
import { PutApi } from "../../hooks/Post/PutApi";
import { setSubCategoryReducerData } from "../../redux/reducer/ChildReducer/SubCategoryReducer";
import { GetApi } from "../../hooks/Get/GetApi";
import { setTaxCategoryReducerData } from "../../redux/reducer/ChildReducer/TaxCategoryReducer";

const AddItem = ({ show, setShow, editableData, setEditableData }) => {
  const { ShowNotification } = useContext(MainContext);
  const { item_reducer_data } = useSelector((state) => state.ItemReducer);

  const { sub_category_reducer_data } = useSelector(
    (state) => state.SubCategoryReducer
  );

  const { tax_category_reducer_data } = useSelector(
    (state) => state.TaxCategoryReducer
  );

  const dispatch = useDispatch();
  let isEditableDataAvail = Boolean(Object.keys(editableData).length);

  const [itemDetails, setItemDetails] = useState({
    name: "",
    category: "",
    description: "",
    hsn_code: "",
    purchase_price: 0.0,
    mrp_price: 0.0,
    retail_price: 0.0,
    wholesale_price: 0.0,
    receiving_quantity: 0.0,
    is_serialized: false,
    is_stock: false,
    is_deleted: false,
    unit: {},
  });

  useEffect(() => {
    getSubCategories();
    getTaxCategories();
  }, []);

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

  const getTaxCategories = async () => {
    try {
      const result = await GetApi(GetTaxCategoryUrl);
      
      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setTaxCategoryReducerData(result?.data?.data));
      }
    } catch (error) {
      console.error("get Tax Categories Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    }
  };

  useEffect(() => {
    if (Object.keys(editableData).length) {
      const updatedData = {
        ...editableData,
        category: editableData?.category?.id,
        tax_category: editableData?.tax_category?.id
      };

      setItemDetails(updatedData);
      
    }
  }, [show, editableData]);

  const handleClose = () => {
    setShow(false);
    setItemDetails({
      id: 0,
      name: "",
      category: "",
      description: "",
      hsn_code: "",
      purchase_price: 0,
      mrp_price: 0,
      retail_price: 0,
      wholesale_price: 0,
      receiving_quantity: 0,
      is_serialized: false,
      is_stock: false,
      is_deleted: false,
      unit: {},
    });
    setEditableData({});
  };

  const handleOnchange = (value, name) => {
    setItemDetails((oldData) => ({
      ...oldData,
      [name]: value,
      id: isEditableDataAvail ? editableData.id : 0,
    }));
  };

  const handleSubmitItem = async (e) => {
    e.preventDefault();

    const requestData = itemDetails;
    const isUpdate = Boolean(requestData?.id);
    const apiUrl = isUpdate ? `${ItemsUrl}/${requestData.id}` : ItemsUrl;
    const apiMethod = isUpdate ? PutApi : PostApi;

    try {
      const result = await apiMethod(apiUrl, requestData);

      if (result.status === (isUpdate ? 200 : 201)) {
        ShowNotification("success", result.data.message);
        const action = isEditableDataAvail ? editItemReducerData : addItemReducerData;
        dispatch(action(result.data?.data));
        handleClose();
      } else {
        ShowNotification("error", result.data.message);
      }
    } catch (error) {
      ShowNotification("error", "An error occurred while processing the request.");
    }
  };


  return (
    <div>
      <Offcanvas
        className="cgm-expiry-user-action-modal"
        show={show}
        onHide={handleClose}
        placement={"end"}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {isEditableDataAvail ? "Edit Item" : "Add Item"}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <TextField
            id="item-name"
            className="my-2"
            label="Item Name"
            fullWidth
            size="small"
            required
            value={itemDetails.name || ""}
            onChange={(e) => handleOnchange(e.target.value, "name")}
          />
          {/* <TextField
            id="item-category"
            className="my-2"
            label="Category"
            fullWidth
            size="small"
            value={itemDetails.category || ""}
            onChange={(e) => handleOnchange(e.target.value, "category")}
          /> */}

          <TextField
            id="description"
            className="my-2"
            label="Description"
            fullWidth
            multiline
            rows={2}
            size="small"
            required
            value={itemDetails.description || ""}
            onChange={(e) => handleOnchange(e.target.value, "description")}
          />

          <Grid container spacing={2}>
            <Grid item md={6}>

              <FormControl fullWidth size="small" className="my-2">
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  label="Category"
                  value={itemDetails.category || ""}
                  onChange={(e) => handleOnchange(e.target.value, "category")}
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
                <InputLabel id="category-select-label">TaxCategory</InputLabel>
                <Select
                  labelId="tax-select-label"
                  id="tax-select"
                  label="TaxCategory"
                  value={itemDetails.tax_category || ""}
                  onChange={(e) => handleOnchange(e.target.value, "tax_category")}
                >
                  {tax_category_reducer_data &&
                    tax_category_reducer_data?.length > 0 ? (
                    tax_category_reducer_data?.map((val) => (
                      <MenuItem key={val.id} value={val.id}>
                        {val.tax_category}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No Tax categories available</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item md={6}>
              <TextField
                id="hsn-code"
                className="my-2"
                label="HSN Code"
                fullWidth
                size="small"
                value={itemDetails.hsn_code || ""}
                onChange={(e) => handleOnchange(e.target.value, "hsn_code")}
              />
            </Grid>
            <Grid item md={6}>
              <TextField
                id="receiving-quantity"
                className="my-2"
                label="Receiving Quantity"
                fullWidth
                type="number"
                size="small"
                value={itemDetails.receiving_quantity || 0}
                onChange={(e) => handleOnchange(e.target.value, "receiving_quantity")}
              />
            </Grid>
            <Grid item md={6}>
              <TextField
                id="purchase-price"
                className="my-2"
                label="Purchase Price"
                fullWidth
                type="number"
                size="small"
                value={itemDetails.purchase_price || 0}
                onChange={(e) => handleOnchange(e.target.value, "purchase_price")}
              />
            </Grid>
            <Grid item md={6}>
              <TextField
                id="mrp-price"
                className="my-2"
                label="MRP Price"
                fullWidth
                type="number"
                size="small"
                value={itemDetails.mrp_price || 0}
                onChange={(e) => handleOnchange(e.target.value, "mrp_price")}
              />
            </Grid>
            <Grid item md={6}>
              <TextField
                id="wholesale-price"
                className="my-2"
                label="Wholesale Price"
                fullWidth
                type="number"
                size="small"
                value={itemDetails.wholesale_price || 0}
                onChange={(e) => handleOnchange(e.target.value, "wholesale_price")}
              />
            </Grid>
            <Grid item md={6}>
              <TextField
                id="retail-price"
                className="my-2"
                label="Retail Price"
                fullWidth
                type="number"
                size="small"
                value={itemDetails.retail_price || 0}
                onChange={(e) => handleOnchange(e.target.value, "retail_price")}
              />
            </Grid>
            <Grid item md={4}>
              <div className="">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={itemDetails.is_serialized}
                      onChange={(e) => handleOnchange(e.target.checked, "is_serialized")}
                    />
                  }
                  label="Is Serialized"
                />
              </div>
            </Grid>
            <Grid item md={4}>
              <div className="">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={itemDetails.is_stock}
                      onChange={(e) => handleOnchange(e.target.checked, "is_stock")}
                    />
                  }
                  label="Is Stock"
                />
              </div>
            </Grid>
            <Grid item md={4}>
              <div className="">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={itemDetails.is_deleted}
                      onChange={(e) => handleOnchange(e.target.checked, "is_deleted")}
                    />
                  }
                  label="Is Deleted"
                />
              </div>
            </Grid>

          </Grid>

          {/* add item button */}
          <div className="text-end my-2">
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{
                textTransform: "none",
                borderRadius: "5px",
              }}
              onClick={(e) => handleSubmitItem(e)}
            >
              <FontAwesomeIcon icon={faPlus} className="mx-1" />
              {isEditableDataAvail ? "Update Item" : "Add Item"}
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default AddItem;
