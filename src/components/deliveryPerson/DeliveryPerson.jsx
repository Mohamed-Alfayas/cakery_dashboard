import {
  faEdit,
  faFileLines,
  faRefresh,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Grid } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { GetApi } from "../../hooks/Get/GetApi";
import MainContext from "../../context/MainContext";
import {
  GetDeliveryPersonUrl
} from "../../Constant/urls/urls";
import { useDispatch, useSelector } from "react-redux";
import { setMainCategoryReducerData } from "../../redux/reducer/ChildReducer/MainCategoryReducer";
import PreLoaderComponent from "../../common/PreLoaderComponent";
import EditDeliveryPerson from "./EditDeliveryPerson";
import { setDeliveryPersonReducerData } from "../../redux/reducer/ChildReducer/DeliveryPersonReducer";
import { setIsDeliveryPersonLoadingReducerData } from "../../redux/reducer/ChildReducer/CommonLoaderReducer";

const DeliveryPerson = () => {
  const { ShowNotification } = useContext(MainContext);

  //reducer Data
  const { delivery_person_reducer_data } = useSelector(
    (state) => state.DeliveryPersonReducer
  );
  const { is_delivery_person_loading } = useSelector(
    (state) => state.CommonLoaderReducer
  );
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [editableData, setEditableData] = useState({});

  useEffect(() => {
    getDeliveryPerson();
  }, []);

  const categoryDTColumns = [
    {
      name: "ID",
      selector: (row) => row?.id,
      width: "10%",
    },
    {
      name: "Person Name",
      selector: (row) => row?.name,
      width: "15%",
    },
    {
      name: "Mobile Number",
      selector: (row) => row?.phone,
      width: "15%",
    },
    {
      name: "Email",
      selector: (row) => row?.email,
      width: "15%",
    },
    {
      name: "DOB",
      selector: (row) => row?.dob,
      width: "10%",
    },
    {
      name: "Address",
      selector: (row) => row?.address,
      width: "15%",
    },
    {
      name: "Action",
      minWidth: "10%",
      cell: (row) => (
        <div className="text-center">
          <Button
            variant="contained"
            color="primary"
            size="small"
            className="me-2"
            style={{
              textTransform: "none",
              borderRadius: "5px",
            }}
            onClick={() => {
              setShow(true);
              setEditableData(row);
            }}
          >
            <FontAwesomeIcon icon={faEdit} className="me-2" />
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            style={{
              textTransform: "none",
              borderRadius: "5px",
            }}
            onClick={() => {
              handleDelete(row);
            }}
          >
            <FontAwesomeIcon icon={faTrash} className="me-2" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const getDeliveryPerson = async () => {
    try {
      const result = await GetApi(GetDeliveryPersonUrl);
      console.log("result ====", result);
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
    } finally {
      dispatch(setIsDeliveryPersonLoadingReducerData(false));
    }
  };

  const handleDelete = (row) => {
    // const filterCategories = delivery_person_reducer_data.filter(
    //   (val) => val.id !== row.id
    // );
  };

  if (is_delivery_person_loading) {
    return <PreLoaderComponent />;
  }

  return (
    <div className="cgm-purchase-section">
      <Grid container spaing={2} className="mb-2">
        <Grid item md={6} xs={6} className="text-end search-section">
          <section className="component-heading my-1">
            <FontAwesomeIcon icon={faFileLines} className="mx-2" /> Delivery
            Persons
          </section>
        </Grid>
        <Grid item md={6} xs={6} className="text-end top-action-button-group">
          <div className="ml-auto">
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{
                textTransform: "none",
                borderRadius: "5px",
              }}
              onClick={() => {
                setShow(true);
              }}
            >
              <FontAwesomeIcon icon={faPlus} className="mx-1" />
              Add Deliver Person
            </Button>
            <Button
              variant="contained"
              color="success"
              className="mx-1"
              size="small"
              style={{
                textTransform: "none",
                borderRadius: "5px",
              }}
              onClick={() => getDeliveryPerson()}
            >
              <FontAwesomeIcon icon={faRefresh} className="mx-1" />{" "}
              <span>Refresh</span>
            </Button>
          </div>
        </Grid>
      </Grid>

      <div className={`dt-table`}>
        <DataTable
          columns={categoryDTColumns}
          striped
          data={delivery_person_reducer_data}
          className="dt-table-container"
          pagination
          //   paginationPerPage={categoryParam?.limit}
          //   paginationServer
          //   paginationTotalRows={delivery_person_reducer_dataCount}
          //   onChangePage={handlePageChange}
          //   onChangeRowsPerPage={handleRowsPerPageChange}
          searchable
        />
      </div>

      <EditDeliveryPerson
        show={show}
        setShow={setShow}
        editableData={editableData}
        setEditableData={setEditableData}
      />
    </div>
  );
};

export default DeliveryPerson;
