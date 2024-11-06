import { useState, useEffect, useRef } from "react";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Grid, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Card, Offcanvas, Table } from "react-bootstrap";
import theChennaiCakeryLogo from "../../assets/img/tcc-logo.png";
import './Invoice.scss';
import jsPDF from "jspdf";
import ReactToPrint from 'react-to-print';
import { convertDateFormat2 } from "../../commonFunctions";

const BillView = ({ show, setShow, billData }) => {

  const handleClose = () => {
    setShow(false);
  };

  const [billTotal, setBillTotal] = useState(0)

  useEffect(() => {
    if (show) {
      let total = billData?.cart_details.reduce((sum, item) => {
        return sum + (item.price * item.qty);
      }, 0);
      setBillTotal(total)
      console.log(billData)
    }
  }, [show])


  

  
  const invoiceRef = useRef();

  const generatePDFHtml2pdf = () => {
    // const doc = new jsPDF("p", "px", 'a4');

    // doc.html(invoiceRef.current, {
    //   async callback(doc) {
    //     var pageCount = doc.internal.getNumberOfPages();
    //     await doc.save("Bill");
    //   },
    //   x: 0,
    //   y: 0,
    //   // width: '400px',
    //   // windowWidth: invoiceRef.current.scrollWidth,
    // });
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
              Invoice
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <ReactToPrint
              trigger={() => <Button
                variant="contained"
                color="primary"
                size="small"
                className="mb-2"
                style={{
                  textTransform: "none",
                  borderRadius: "5px",
                }}
              >
                <FontAwesomeIcon icon={faPrint} className="mx-1" />
                Print Bill
              </Button>}
              content={() => invoiceRef.current}
            />
            
            <Card className="p-4 invoice-section" ref={invoiceRef}>

              <div className="bill-header">
                <img
                  src={theChennaiCakeryLogo}
                  alt=""
                  className="dashboard-icon"
                />
                <h4 className="company-name">Magilshe Cakery</h4>
                <p className="address">15, Subramaniyo Madali street, Saidapet, Chennai-81.</p>
                <p className="phone">Ph:+91 96004 27774</p>
                <p className="email">Email: thechennaicakery@gmail.com</p>
              </div>

              <div className="bill-details">

                <div className="order-details">
                  <Grid container spacing={2} className="" rowSpacing={0}>
                    <Grid item md={4}>
                      <p className="invoice-id ">Invoice No.: #{billData?.id}</p>
                      <p className="order-id ">Order No.: #{billData?.id}</p>
                      <p className="bill-mode ">Bill Mode: Cash</p>
                    </Grid>

                    <Grid item md={8} className="text-end">
                      <p className="order-date ">Order Date: {convertDateFormat2(billData?.order_time)}</p>
                      <p className="bill-date ">Bill Date: {convertDateFormat2(billData?.delivery_time)}</p>
                    </Grid>
                  </Grid>
                </div>

                <div className="customer-details">
                  <h4>Customer Details</h4>
                  <p className="customer-name">{billData?.customer?.name}</p>
                  <p className="customer-address">{billData?.delivery_address?.address}</p>
                  <Grid container spacing={2} className="" rowSpacing={0}>
                    <Grid item md={5}>
                      <p className="customer-phone">Ph: {billData?.customer?.phone}</p>
                    </Grid>

                    <Grid item md={7} className="text-end">
                      <p className="customer-email">Email: {billData?.customer?.email}</p>
                    </Grid>
                  </Grid>
                </div>

                <div className="cart-details py-4">
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>S.No</TableCell>
                          <TableCell align="left">Item</TableCell>
                          <TableCell align="center">Qty</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {billData?.cart_details?.map((item, index) => (
                          <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {index + 1}
                            </TableCell>
                            <TableCell align="left">
                              {/* <img 
                                src={item?.cake?.images[0]?.url} 
                                alt="Cake" 
                                style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "50%", marginRight: "0.5rem" }} 
                              /> */}
                              {item.cake?.name} [{item?.cake?.price_list?.kg} Kg ]</TableCell>

                            <TableCell align="center">{item?.qty}</TableCell>
                            <TableCell align="right">{item?.price}</TableCell>
                            <TableCell align="right">{item?.qty * item?.price}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row" colSpan={4} align="right">
                            <b>SubTotal</b>
                          </TableCell>
                          <TableCell component="th" scope="row" colSpan={1} align="right">
                            <b>{billTotal}</b>
                          </TableCell>
                        </TableRow>
                        <TableRow
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row" colSpan={4} align="right">
                            <b>Tax
                            </b>
                          </TableCell>
                          <TableCell component="th" scope="row" colSpan={1} align="right">
                            <b>0
                            </b>
                          </TableCell>
                        </TableRow>
                        <TableRow
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row" colSpan={4} align="right">
                            <b>Grand Total</b>
                          </TableCell>
                          <TableCell component="th" scope="row" colSpan={1} align="right">
                            <b>{billTotal}</b>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <p className="footer-text mt-4 text-center"><b>Thank you for your Business!...</b></p>

                </div>

              </div>

            </Card>

          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
};

export default BillView;
