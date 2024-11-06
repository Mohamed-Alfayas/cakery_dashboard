import {
  faEdit,
  faFileLines,
  faRefresh,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Chip, Grid } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import EditTags from "./EditOffers";
import { useDispatch, useSelector } from "react-redux";
import MainContext from "../../context/MainContext";
import { GetCakeUrl, GetOfferUrl } from "../../Constant/urls/urls";
import { GetApi } from "../../hooks/Get/GetApi";
import { setOffersReducerData } from "../../redux/reducer/ChildReducer/OffersReducer";
import PreLoaderComponent from "../../common/PreLoaderComponent";
import EditOffers from "./EditOffers";
import { convertDateFormat } from "../../commonFunctions";
import { setIsOffersLoadingReducerData } from "../../redux/reducer/ChildReducer/CommonLoaderReducer";
import { setCakeListReducerData } from "../../redux/reducer/ChildReducer/CakeListReducer";

const Offers = () => {
  const { ShowNotification } = useContext(MainContext);

  const { offers_reducer_data } = useSelector((state) => state.OffersReducer);
  const { is_offers_loading } = useSelector(
    (state) => state.CommonLoaderReducer
  );

  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [editableData, setEditableData] = useState({});

  useEffect(() => {
    getCakeList();
    getOffers();
  }, []);
  const categoryDTColumns = [
    {
      name: "ID",
      selector: (row) => row?.id,
      width: "10%",
    },
    {
      name: "Offer Name",
      selector: (row) => row?.name,
      minWidth: "15%",
    },
    {
      name: "Offer %",
      selector: (row) => (row?.offer_per + " %"),
      minWidth: "5%",
    },
    {
      name: "Offer Start",
      selector: (row) => convertDateFormat(row?.offer_from),
      minWidth: "15%",
    },
    {
      name: "Offer End",
      selector: (row) => convertDateFormat(row?.offer_to),
      minWidth: "15%",
    },
    {
      name: "Status",
      selector: (row) => row?.offer_to,
      minWidth: "10%",
      cell: (row) =>{
        const currentDate = new Date();
        const offerFrom = new Date(row.offer_from);
        const offerTo = new Date(row.offer_to);
        let status = currentDate >= offerFrom && currentDate <= offerTo ? true : false;

        return (
          <div className="text-center">
            {status ?
              <Chip label="Active" color="success" />
              : <Chip label="In-Active" color="error" />}
          </div>
        )

      }
    },
    {
      name: "View",
      minWidth: "10%",
      cell: (row) => (
        <div className="text-center">
          <Button
            variant="contained"
            color="primary"
            size="small"
            className="me-1"
            style={{
              textTransform: "none",
              borderRadius: "5px",
            }}
            onClick={() => {
              console.log(row)
              setShow(true);
              setEditableData(row);
            }}
          >
            <FontAwesomeIcon icon={faEdit} className="mx-1" />
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

  const getCakeList = async () => {
    try {
      const result = await GetApi(GetCakeUrl);
      console.log("result = ===", result);
      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setCakeListReducerData(result.data.data));
      }
    } catch (error) {
      console.error("getCakeList Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    }
  };

  const getOffers = async () => {
    try {
      const result = await GetApi(GetOfferUrl);

      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setOffersReducerData(result.data?.data));
      }
    } catch (error) {
      console.error("getOffers Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    } finally {
      dispatch(setIsOffersLoadingReducerData(false));
    }
  };

  const handleDelete = (row) => {
    // const filterCategories = tag_list_reducer_data.filter(
    //   (val) => val.id !== row.id
    // );
  };

  if (is_offers_loading) {
    return <PreLoaderComponent />;
  }
  return (
    <div className="cgm-purchase-section">
      <Grid container spaing={2} className="mb-2">
        <Grid item md={4} xs={6} className="text-end search-section">
          <section className="component-heading my-1">
            <FontAwesomeIcon icon={faFileLines} className="mx-2" /> Offers
          </section>
        </Grid>
        <Grid item md={8} xs={6} className="text-end top-action-button-group">
          <div className="ml-auto">
            <Button
              variant="contained"
              color="primary"
              size="small"
              className="me-1"
              style={{
                textTransform: "none",
                borderRadius: "5px",
              }}
              onClick={() => {
                setShow(true);
              }}
            >
              <FontAwesomeIcon icon={faPlus} className="mx-1" />
              Add Offers
            </Button>
            <Button
              variant="contained"
              color="success"
              className=" mx-1"
              style={{
                textTransform: "none",
                borderRadius: "5px",
                padding: "5px 10px",
              }}
              onClick={() => getOffers()}
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
          data={offers_reducer_data}
          className="dt-table-container"
          pagination
          //   paginationPerPage={categoryParam?.limit}
          //   paginationServer
          //   paginationTotalRows={tag_list_reducer_dataCount}
          //   onChangePage={handlePageChange}
          //   onChangeRowsPerPage={handleRowsPerPageChange}
          searchable
        />
      </div>

      <EditOffers
        show={show}
        setShow={setShow}
        editableData={editableData}
        setEditableData={setEditableData}
      />
    </div>
  );
};

export default Offers;
