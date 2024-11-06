import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import { Card } from "react-bootstrap";
import theChennaiCakeryLogo from "../../assets/img/tcc-logo.png";
import MainContext from "../../context/MainContext";
import { useParams } from "react-router";
import { GetApi } from "../../hooks/Get/GetApi";
import { useDispatch, useSelector } from "react-redux";
import { setPurchaseBillReducerData } from "../../redux/reducer/ChildReducer/PurchaseReducer";
import { setConfigReducerData } from "../../redux/reducer/ChildReducer/ConfigReducer";
import { GetConfigurationUrl, PurchaseBillUrl } from "../../Constant/urls/urls";
import { formatDate, formatIndianCurrency } from "../../utils/commonFunctions";
import { setIsConfigLoadingReducerData } from "../../redux/reducer/ChildReducer/CommonLoaderReducer";
import { useNavigate } from "react-router";
import { faBackward, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PurchaseReceipt = () => {
  const navigate = useNavigate();

  const { setIsPreLoading, ShowNotification } = useContext(MainContext);
  const { id } = useParams();
  const dispatch = useDispatch();

  const { config_reducer_data } = useSelector((state) => state.ConfigReducer);

  const { purchase_bill_reducer_data } = useSelector(
    (state) => state.PurchaseReducer
  );

  useEffect(() => {
    getPurchaseBillData();
    getConfiguration();
  }, []);

  const getPurchaseBillData = async () => {
    try {
      setIsPreLoading(true);

      const result = await GetApi(`${PurchaseBillUrl}/${id}/`, {});
      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setPurchaseBillReducerData(result.data?.data));
      }
    } catch (error) {
      console.error("get Items Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    } finally {
      setIsPreLoading(false);
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

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <div>
      <Grid container spacing={2} className="mb-3">
        <Grid item md={12} className="text-end">
          <Button
            variant="contained"
            color="primary"
            style={{
              textTransform: "capitalize",
            }}
            className="ms-2"
            size="small"
            onClick={handleClick}
          >
            <FontAwesomeIcon icon={faBackward} className="me-2" /> Back
          </Button>
          <Button
            variant="contained"
            color="success"
            style={{
              textTransform: "capitalize",
            }}
            className="ms-2"
            size="small"
          >
            <FontAwesomeIcon icon={faDownload} className="me-2" />
            Download
          </Button>
        </Grid>
      </Grid>

      <Card className="p-4 purchase-bill-section">
        <div className="bill-header">
          <img src={theChennaiCakeryLogo} alt="" className="dashboard-icon" />
          <h4 className="company-name">{config_reducer_data?.name}</h4>
          <p className="address mb-1">{config_reducer_data?.company_address}</p>
          <p className="phone mb-1">Ph:  {config_reducer_data?.mobile}</p>
          <p className="email">Email: {config_reducer_data?.email}</p>
        </div>
        {purchase_bill_reducer_data && (
          <div className="bill-details">
            <div className="order-details">
              <Grid container spacing={2} className="" rowSpacing={0}>
                <Grid item md={6} className="text-start">
                  <p className="invoice-id ">
                    Invoice No.: #{purchase_bill_reducer_data?.invoice_number}
                  </p>
                  <p className="order-id ">
                    Purchase ID.: #{purchase_bill_reducer_data?.id}
                  </p>
                  <p className="bill-mode ">
                    Bill Mode: {purchase_bill_reducer_data?.payment_type}
                  </p>
                </Grid>

                <Grid item md={6} className="text-end">
                  <p className="order-date ">
                    Receiving Date:{" "}
                    {formatDate(purchase_bill_reducer_data?.created_at)}
                  </p>
                  <p className="bill-date ">
                    Invoice Date:{" "}
                    {formatDate(purchase_bill_reducer_data?.invoice_date)}
                  </p>
                </Grid>
              </Grid>
            </div>

            {/* <div className="customer-details">
              <h4>Supplier Details</h4>
              <p className="customer-name">
                {purchase_bill_reducer_data?.customer?.name}
              </p>
              <p className="customer-address">
                {purchase_bill_reducer_data?.delivery_address?.address}
              </p>
              <Grid container spacing={2} className="" rowSpacing={0}>
                <Grid item md={5}>
                  <p className="customer-phone">
                    Ph: {purchase_bill_reducer_data?.customer?.phone}
                  </p>
                </Grid>

                <Grid item md={7} className="text-end">
                  <p className="customer-email">
                    Email: {purchase_bill_reducer_data?.customer?.email}
                  </p>
                </Grid>
              </Grid>
            </div> */}

            <div className="cart-details py-4">
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>S.No</TableCell>
                      <TableCell align="left">Item</TableCell>
                      <TableCell align="center">Qty</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Disc.</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purchase_bill_reducer_data?.purchase_items?.map(
                      (item, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {index + 1}
                          </TableCell>
                          <TableCell align="left">{item?.item?.name}</TableCell>

                          <TableCell align="center">
                            {item?.receiving_quantity}
                          </TableCell>
                          <TableCell align="right">
                            {"₹"} {formatIndianCurrency(item?.purchase_price)}
                          </TableCell>
                          <TableCell align="right">{"-"}</TableCell>
                          <TableCell align="right">
                            {"₹"}{" "}
                            {formatIndianCurrency(
                              item?.receiving_quantity * item?.purchase_price
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        colSpan={5}
                        align="right"
                      >
                        <b>SubTotal</b>
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        colSpan={1}
                        align="right"
                      >
                        <b>
                          {"₹"}{" "}
                          {formatIndianCurrency(
                            purchase_bill_reducer_data?.total_amount
                          )}
                        </b>
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        colSpan={5}
                        align="right"
                      >
                        <b>Tax</b>
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        colSpan={1}
                        align="right"
                      >
                        <b>0</b>
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        colSpan={5}
                        align="right"
                      >
                        <b>Grand Total</b>
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        colSpan={1}
                        align="right"
                      >
                        <b>
                          {"₹"}{" "}
                          {formatIndianCurrency(
                            purchase_bill_reducer_data?.total_amount
                          )}
                        </b>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <p className="footer-text mt-4 text-start">
                <b>
                  {purchase_bill_reducer_data?.comment &&
                    `Comment: ${purchase_bill_reducer_data?.comment}`}
                </b>
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PurchaseReceipt;
