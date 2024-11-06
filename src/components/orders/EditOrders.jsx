import { useState, useContext, useEffect } from "react";
import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Accordion, Card, Offcanvas } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import MainContext from "../../context/MainContext";
import { convertDateFormat2 } from "../../commonFunctions";
import {
  GetDeliveryPersonUrl,
  UpdateOrderStatusUrl,
} from "../../Constant/urls/urls";
import { GetApi } from "../../hooks/Get/GetApi";
import { setDeliveryPersonReducerData } from "../../redux/reducer/ChildReducer/DeliveryPersonReducer";
import { PostApi } from "../../hooks/Post/PostApi";

const EditOrders = ({
  show,
  setShow,
  editableData,
  setEditableData,
  statusArray,
}) => {
  const { ShowNotification } = useContext(MainContext);
  const isEditableDataAvail = Boolean(Object.keys(editableData).length);

  const dispatch = useDispatch();

  const { delivery_person_reducer_data } = useSelector(
    (state) => state.DeliveryPersonReducer
  );

  const [preview, setPreview] = useState("");
  const [orderStatus, setOrderStatus] = useState(0);
  const [deliveryPartner, setDeliveryPartner] = useState(0);
  const [orderDetails, setOrderDetails] = useState({
    cake_order_id: 0,
    delivery_status: 0,
    tracking_link: "",
    delivery_partner_id: 1,
  });

  const handleClose = () => {
    setShow(false);
    setPreview("");
    setEditableData({});
  };

  useEffect(() => {
    getDeliveryPersons();
    if (editableData) {
      setOrderDetails((oldData) => ({
        ...oldData,
        cake_order_id: editableData?.id,
        delivery_status: editableData?.delivery_status,
      }));
    }
  }, [show]);

  const getDeliveryPersons = async () => {
    try {
      const result = await GetApi(GetDeliveryPersonUrl);
      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setDeliveryPersonReducerData(result.data.data));
      }
    } catch (error) {
      console.error("getDeliveryPerson Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    }
  };

  const handleDeleiveryPartner = (e) => {
    // setDeliveryPartner(e.target?.value);
    setOrderDetails((oldData) => ({
      ...oldData,
      delivery_partner_id: e.target?.value,
    }));
  };
  const handleOrderStatus = (e) => {
    // setOrderStatus(e.target?.value);
    setOrderDetails((oldData) => ({
      ...oldData,
      delivery_status: e.target?.value,
    }));
  };

  const handleOrder = async () => {
    try {
      const result = await PostApi(UpdateOrderStatusUrl, orderDetails);
      console.log("result ====", result);
      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        if (window.getOrders) {
          window.getOrders();
        }
      }
    } catch (error) {
      console.error("getSubCategories Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    }
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
            <Offcanvas.Title>Order Details</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Card className="order-info-card">
              <Grid container spacing={2} className="">
                <Grid item md={6}>
                  <h4 className="order-id"> Order ID: #{editableData?.id}</h4>
                </Grid>
                <Grid item md={6} className="text-end">
                  <Chip
                    color="secondary"
                    label={statusArray[editableData?.delivery_status]}
                    className="delivery-status"
                  />
                </Grid>
                <Grid item md={6}>
                  <div className="text-left customer-info">
                    <h3>Customer Details:</h3>
                    <h4>{editableData?.customer?.name}</h4>
                    <p>Mob: {editableData?.customer?.phone}</p>
                    <p>Email: {editableData?.customer?.email}</p>
                  </div>
                </Grid>
                <Grid item md={6}>
                  <div className="text-start address-info">
                    <h3>Delivery Address Details:</h3>
                    <h4>{editableData?.delivery_address?.address_title}</h4>
                    <p>{editableData?.delivery_address?.address}</p>
                    <p>{editableData?.delivery_address?.city}</p>
                    <p>{editableData?.delivery_address?.pincode}</p>
                  </div>
                </Grid>
                <Grid item md={6}>
                  <div className="text-start">
                    <h3 className="top-title">Order Time:</h3>
                    {convertDateFormat2(editableData?.order_time)}
                  </div>
                </Grid>
                <Grid item md={6}>
                  <div className="text-start">
                    <h3 className="top-title">Delivery Time:</h3>
                    {convertDateFormat2(editableData?.delivery_time)}
                  </div>
                </Grid>
              </Grid>
            </Card>

            <Accordion defaultActiveKey="0" className="edit-status-card my-3">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Order Status Update</Accordion.Header>
                <Accordion.Body>
                  <TextField
                    className="my-3"
                    id="tracking-link"
                    label="Tracking Link"
                    variant="outlined"
                    fullWidth
                    size="small"
                  />

                  <FormControl fullWidth size="small" className="my-3">
                    <InputLabel id="order-status-label">
                      Delivery Partner
                    </InputLabel>
                    <Select
                      labelId="order-status-label"
                      id="order-status"
                      value={orderDetails.delivery_partner_id}
                      label="Delivery Partner"
                      onChange={(e) => {
                        handleDeleiveryPartner(e);
                      }}
                    >
                      {delivery_person_reducer_data?.map((status, index) => (
                        <MenuItem key={index} value={status.id}>
                          {status.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small" className="my-3">
                    <InputLabel id="order-status-label">
                      Order Status
                    </InputLabel>
                    <Select
                      labelId="order-status-label"
                      id="order-status"
                      value={orderDetails.delivery_status}
                      label="Order Status"
                      onChange={(e) => handleOrderStatus(e)}
                    >
                      {statusArray?.map((status, index) => (
                        <MenuItem key={index} value={index}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

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
                        handleOrder();
                      }}
                    >
                      <FontAwesomeIcon icon={faSave} className="mx-1" />
                      {"Update Order Status"}
                    </Button>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <section className="order-items">
              <h4 className="title">Order Details:</h4>
              {editableData?.cart_details?.map((item, index) => (
                <div key={index} className="item">
                  <div className="item-info">
                    <div className="cake-info">
                      <img src={item?.cake?.images[0]?.url} alt="Cake" />
                      <span>
                        <h4>{item?.cake?.name}</h4>
                        <h5>{item?.cake?.sub_category?.name}</h5>
                      </span>
                    </div>
                    <div className="qty-info">
                      <h4>
                        {item?.cake?.price_list?.kg} Kg * {item?.qty}
                      </h4>
                      <h5></h5>
                    </div>
                  </div>
                  <div className="occasion-info">
                    <Chip
                      color="success"
                      label={item?.greeting_text}
                      className="greeting-text"
                    />
                    {/* <p>Occasion Type: {item?.occasion_type}</p>
                      <p>Occasion Date: {item?.occasion_date}</p> */}
                  </div>
                </div>
              ))}
            </section>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
};

export default EditOrders;
