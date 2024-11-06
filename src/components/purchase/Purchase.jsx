import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Autocomplete,
  Grid,
  TextField,
  Button,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
} from "@mui/material";
import { Add, AddBox, Delete, PlusOne } from "@mui/icons-material";
import { PostApi } from "../../hooks/Post/PostApi";
import { ItemsUrl, PurchaseUrl } from "../../Constant/urls/urls";
import MainContext from "../../context/MainContext";
import { setItemReducerData } from "../../redux/reducer/ChildReducer/ItemReducer";
import { setIsItemLoadingReducerData } from "../../redux/reducer/ChildReducer/CommonLoaderReducer";
import { paymentMode } from "../../Constant/Constant";
import { AddPurchase } from "../../Constant/urls/urls";
import { GetApi } from "../../hooks/Get/GetApi";
import {
  addPurchaseReducerData,
  editPurchaseReducerData,
  setPurchaseReducerData,
} from "../../redux/reducer/ChildReducer/PurchaseReducer";
import { PutApi } from "../../hooks/Post/PutApi";

const Purchase = ({ setShow, editableData, setEditableData }) => {
  const { item_reducer_data } = useSelector((state) => state.ItemReducer);

  const dispatch = useDispatch();
  const { ShowNotification, setIsPreLoading } = useContext(MainContext);

  const [selectedItem, setSelectedItem] = React.useState(null);
  const [purchaseItems, setPurchaseItems] = React.useState([]);
  const [selectedPaymentModes, setSelectedPaymentModes] = useState([]);
  const [purchaseTotal, setPurchaseTotal] = useState(0);
  const [purchaseDetail, setPurchaseDetail] = useState({
    comment: "",
    payment_type: "",
    invoice_date: "",
    invoice_number: "",
    total_amount: 0,
  });

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    if (editableData) {
      const formattedPurchaseItems = editableData?.purchase_items.map(
        ({ id, item, ...rest }) => ({
          id,
          item_name: item?.name,
          is_edit_item: true,
          ...rest,
        })
      );

      setPurchaseItems(formattedPurchaseItems);

      setPurchaseDetail({
        id: editableData?.id || null,
        comment: editableData?.comment,
        payment_type: editableData?.payment_type,
        invoice_date: editableData?.invoice_date,
        invoice_number: editableData?.invoice_number,
        total_amount: editableData?.total_amount,
      });
    }
  }, [editableData]);

  const getItems = async () => {
    try {
      const result = await GetApi(ItemsUrl);

      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setItemReducerData(result.data?.data));
      }
    } catch (error) {
      console.error("get Items Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    } finally {
      dispatch(setIsItemLoadingReducerData(false));
    }
  };

  const handleChange = (event, value) => {
    if (!value) return;

    console.log("Selected Value:", value);

    setSelectedItem(null);

    setPurchaseItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.item_id === value.id
      );

      if (existingItemIndex !== -1) {
        return prevItems.map((item, index) => {
          if (index === existingItemIndex) {
            const updatedItem = {
              ...item,
              quantity_purchased: item.quantity_purchased + 1,
              total: (item.quantity_purchased + 1) * item.purchase_price,
            };
            return updatedItem;
          }
          return item;
        });
      } else {
        const newPurchaseItem = {
          item_id: value?.id,
          item_name: value?.name,
          description: value?.description || "",
          serialnumber: "",
          quantity_purchased: 1,
          mrp_price: value?.mrp_price,
          purchase_price: value?.purchase_price,
          retail_price: value?.retail_price,
          wholesale_price: value?.wholesale_price,
          discount: 0,
          discount_type: 1,
          stock_location: 1,
          receiving_quantity: value?.receiving_quantity,
          free_qty: 0,
          total: value?.purchase_price * 1, // Initialize total
        };

        return [...prevItems, newPurchaseItem];
      }
    });
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;

    const updatedItems = purchaseItems.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item };

        if (name === "quantity_purchased") {
          let newQuantity = parseInt(value, 10);
          if (isNaN(newQuantity) || newQuantity <= 0) {
            newQuantity = 1;
          }
          updatedItem.quantity_purchased = newQuantity;
        } else {
          updatedItem[name] = value;
        }

        // Update total when purchase price or quantity changes
        if (name === "purchase_price" || name === "quantity_purchased") {
          updatedItem.total =
            updatedItem.purchase_price * updatedItem.quantity_purchased;
        }

        return updatedItem;
      }
      return item;
    });

    setPurchaseItems(updatedItems);
    handleCalculateTotal();
  };

  const paymentModeArray = Object.keys(paymentMode).map((key) => ({
    value: key,
    label: paymentMode[key],
  }));

  const handlePaymentChange = (event, newValue) => {
    setSelectedPaymentModes(newValue);
  };

  const handleCalculateTotal = () => {
    let calculateTotal = purchaseItems
      .filter((item) => !item?.is_deleted)
      .reduce((sum, item) => {
        return sum + item.purchase_price * item.quantity_purchased;
      }, 0);
    setPurchaseTotal(calculateTotal);
  };

  const handleFinishClick = () => {
    if(parseFloat(purchaseTotal) !== parseFloat(purchaseDetail?.total_amount)){
      ShowNotification("warning", "Please check Total with Amount Tendered");
      return;
    }

    if (purchaseDetail?.id) {
      updatePurchase();
    } else {
      AddPurchaseEntry();
    }

    console.log("Purchase Details:", purchaseDetail);
  };

  const AddPurchaseEntry = async () => {
    try {
      setIsPreLoading(true);
      let requestData = {
        purchase: purchaseDetail,
        items: purchaseItems,
      };

      const result = await PostApi(AddPurchase, requestData);

      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(addPurchaseReducerData(result.data?.data));
        setShow(false);
        setEditableData(null)
      }
    } catch (error) {
      console.error("get Items Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    } finally {
      // dispatch(setIsItemLoadingReducerData(false));
      setIsPreLoading(false);
    }
  };

  const updatePurchase = async () => {
    try {
      setIsPreLoading(true);
      let requestData = {
        purchase: purchaseDetail,
        items: purchaseItems,
      };
      
      const result = await PutApi(
        `${PurchaseUrl}/${requestData.purchase?.id}/`,
        requestData
      );
      

      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(editPurchaseReducerData(result.data?.data));
        setShow(false);
        setEditableData(null)
      }
    } catch (error) {
      console.error("get Items Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    } finally {
      // dispatch(setIsItemLoadingReducerData(false));
      setIsPreLoading(false);
    }
  };

  useEffect(() => {
    handleCalculateTotal();
  }, [purchaseItems]);

  useEffect(() => {
    console.log(purchaseDetail);
  }, [purchaseDetail]);

  const handlePurchaseDetailChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;

    setPurchaseDetail((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCancelClick = () => {
    setPurchaseItems([]);
    setPurchaseDetail({
      comment: "",
      payment_type: "",
      invoice_date: "",
      invoice_number: "",
      total_amount: 0,
    });
    setSelectedItem(null);
    setSelectedPaymentModes([]);
    setPurchaseTotal(0);
    setShow(false);
    setEditableData(null)
  };

  return (
    <div>
      <Grid container spacing={2} alignItems="center" className="mb-3">
        <Grid item md={3}>
          <TextField
            variant="outlined"
            fullWidth
            label="Receiving Mode"
            size="small"
          />
        </Grid>
        <Grid item md={3}>
          <TextField
            variant="outlined"
            fullWidth
            label="Stock Source"
            size="small"
          />
        </Grid>
        <Grid item md={6} textAlign="right">
          <Button variant="contained" color="primary" startIcon={<Add />}>
            New Item
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item md={9}>
          <Paper>
            <Autocomplete
              className="p-2 mb-3"
              size="small"
              id="item-box"
              options={item_reducer_data}
              getOptionLabel={(option) => option.name}
              getOptionSelected={(option, value) => option.id === value?.id}
              value={selectedItem}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Select an Item"
                />
              )}
              onChange={handleChange}
            />
          </Paper>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Delete</TableCell>
                  <TableCell>Item Name</TableCell>
                  <TableCell>Purchase Price</TableCell>
                  <TableCell>MRP Price</TableCell>
                  <TableCell>Wholesale Price</TableCell>
                  <TableCell>Retail Price</TableCell>
                  <TableCell>Qty.</TableCell>
                  {/* <TableCell>Free Qty</TableCell>
                  <TableCell>Ship Pack</TableCell>
                  <TableCell>Discount</TableCell> */}
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchaseItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {item?.is_deleted ? (
                        <IconButton
                          color="success"
                          onClick={() =>
                            setPurchaseItems(
                              purchaseItems.map((p_item, p_index) =>
                                p_index === index
                                  ? { ...p_item, is_deleted: false }
                                  : p_item
                              )
                            )
                          }
                        >
                          <AddBox />
                        </IconButton>
                      ) : (
                        <IconButton
                          color="error"
                          onClick={() => {
                            setPurchaseItems(
                              purchaseItems
                                .map((p_item, p_index) => {
                                  if (p_index === index) {
                                    return item?.is_edit_item
                                      ? { ...p_item, is_deleted: true }
                                      : null;
                                  }
                                  return p_item;
                                })
                                .filter(Boolean)
                            );
                          }}
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCell>{item?.item_name}</TableCell>
                    <TableCell>
                      <TextField
                        name="purchase_price"
                        size="small"
                        disabled={item?.is_deleted}
                        variant="outlined"
                        fullWidth
                        value={item?.purchase_price}
                        onChange={(e) => handleInputChange(index, e)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="mrp_price"
                        size="small"
                        variant="outlined"
                        disabled={item?.is_deleted}
                        fullWidth
                        value={item?.mrp_price}
                        onChange={(e) => handleInputChange(index, e)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="wholesale_price"
                        size="small"
                        variant="outlined"
                        disabled={item?.is_deleted}
                        fullWidth
                        value={item?.wholesale_price}
                        onChange={(e) => handleInputChange(index, e)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="retail_price"
                        size="small"
                        variant="outlined"
                        disabled={item?.is_deleted}
                        fullWidth
                        value={item?.retail_price}
                        onChange={(e) => handleInputChange(index, e)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="quantity_purchased"
                        size="small"
                        variant="outlined"
                        disabled={item?.is_deleted}
                        fullWidth
                        value={item?.quantity_purchased}
                        onChange={(e) => handleInputChange(index, e)}
                      />
                    </TableCell>
                    {/* <TableCell>
                      <TextField name="free_qty" size="small" variant="outlined" fullWidth value={item?.free_qty} 
                      onChange={(e) => handleInputChange(index, e)} />
                    </TableCell>
                    <TableCell>
                      <TextField name="ship_pack" size="small" variant="outlined" fullWidth value={item?.receiving_quantity} 
                      onChange={(e) => handleInputChange(index, e)} />
                    </TableCell>
                    <TableCell>
                      <TextField name="discount" size="small" variant="outlined" fullWidth value={item?.discount} 
                      onChange={(e) => handleInputChange(index, e)} />
                    </TableCell> */}
                    <TableCell>
                      {item?.is_deleted
                        ? "-"
                        : `₹${(
                            item?.purchase_price * item?.quantity_purchased
                          )?.toFixed(2)}`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item md={3}>
          <Paper sx={{ padding: 2 }}>
            {purchaseDetail?.id && (
              <p className="mb-3" style={{fontWeight: "600", color: "red"}}>
                Purchase ID: #{purchaseDetail?.id}
              </p>
            )}
            <Autocomplete
              size="small"
              disablePortal
              id="supplier-box"
              options={item_reducer_data}
              getOptionLabel={(option) => option.name}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="Select Supplier" />
              )}
            />
            <TextField
              fullWidth
              label="Invoice Number"
              name="invoice_number"
              onChange={handlePurchaseDetailChange}
              value={purchaseDetail?.invoice_number}
              size="small"
              sx={{ marginTop: 2 }}
            />
            <TextField
              fullWidth
              label="Purchase Date"
              type="date"
              name="invoice_date"
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ marginTop: 2 }}
              value={purchaseDetail?.invoice_date}
              onChange={handlePurchaseDetailChange}
            />
            <Autocomplete
              size="small"
              name="payment_type"
              disablePortal
              id="payment-mode-box"
              options={paymentModeArray}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              } // Compare option.value with value.value
              value={
                paymentModeArray.find(
                  (option) => option.value === purchaseDetail?.payment_type
                ) || null
              }
              onChange={(event, newValue) => {
                handlePurchaseDetailChange({
                  target: {
                    name: "payment_type",
                    value: newValue ? newValue.value : "",
                  },
                });
              }}
              fullWidth
              sx={{ marginTop: 2 }}
              renderInput={(params) => (
                <TextField {...params} label="Select Payment Modes" />
              )}
            />

            <TextField
              name="total_amount"
              fullWidth
              label="Amount Tendered"
              onChange={handlePurchaseDetailChange}
              value={purchaseDetail?.total_amount}
              size="small"
              sx={{ marginTop: 2 }}
            />

            <TextField
              name="comment"
              multiline
              fullWidth
              label="Comment"
              onChange={handlePurchaseDetailChange}
              value={purchaseDetail?.comment}
              size="small"
              sx={{ marginTop: 2 }}
            />
            <Typography variant="h5" className="my-3">
              Grand Total: {purchaseTotal}
            </Typography>
            <div
              className="d-flex justify-content-between"
              style={{ marginTop: 10, textAlign: "right" }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={handleCancelClick}
                sx={{ marginRight: 2 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleFinishClick}
              >
                Finish
              </Button>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Purchase;
