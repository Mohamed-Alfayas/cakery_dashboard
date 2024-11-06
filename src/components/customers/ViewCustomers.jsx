import { useContext, useEffect } from "react";
import { Offcanvas } from "react-bootstrap";
import MainContext from "../../context/MainContext";
import { InputLabel } from "@mui/material";

const ViewCustomers = ({ show, setShow, customerData }) => {
  const { ShowNotification } = useContext(MainContext);

  useEffect(() => {
    console.log("customerdata ===", customerData);
  }, [show]);

  const handleClose = () => {
    setShow(false);
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
            <Offcanvas.Title>View Customer</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <InputLabel>Name</InputLabel>
            <InputLabel>{customerData.name}</InputLabel>
            <InputLabel>Email</InputLabel>
            <InputLabel>{customerData.email}</InputLabel>
            <InputLabel>Phone</InputLabel>
            <InputLabel>{customerData.phone}</InputLabel>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
};

export default ViewCustomers;
