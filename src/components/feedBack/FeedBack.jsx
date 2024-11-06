import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import MainContext from "../../context/MainContext";
import PreLoaderComponent from "../../common/PreLoaderComponent";
import { GetApi } from "../../hooks/Get/GetApi";
import { GetFeedBackUrl } from "../../Constant/urls/urls";
import { setFeedBackReducerData } from "../../redux/reducer/ChildReducer/FeedBackReducer";
import { setIsFeedbackLoadingReducerData } from "../../redux/reducer/ChildReducer/CommonLoaderReducer";

const FeedBack = () => {
  const { ShowNotification } = useContext(MainContext);

  //reducer Data
  const { feedback_reducer_data } = useSelector(
    (state) => state.FeedBackReducer
  );
  const { is_feedback_loading } = useSelector(
    (state) => state.CommonLoaderReducer
  );
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [editableData, setEditableData] = useState({});

  useEffect(() => {
    getFeecBack();
  }, []);

  const categoryDTColumns = [
    {
      name: "ID",
      selector: (row) => row?.id,
      width: "10%",
    },
    {
      name: "Name",
      selector: (row) => row?.name,
      width: "15%",
    },
    {
      name: "Mobile",
      selector: (row) => row?.mobile,
      width: "15%",
    },
    {
      name: "Message",
      selector: (row) => row?.message,
      minWidth: "45%",
    },
    // {
    //   name: "SubScribed",
    //   selector: (row) => (row?.is_subscribed ? "yes" : "no"),
    //   width: "15%",
    // },
  ];

  const getFeecBack = async () => {
    try {
      const result = await GetApi(GetFeedBackUrl);
      console.log("result=  = ", result);
      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setFeedBackReducerData(result.data?.data));
      }
    } catch (error) {
      console.error("getFeecBack Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    } finally {
      dispatch(setIsFeedbackLoadingReducerData(false));
    }
  };

  if (is_feedback_loading) {
    return <PreLoaderComponent />;
  }

  return (
    <div className="cgm-purchase-section">
      {/* <Grid container spaing={2} className="mb-2">
          <Grid item md={6} xs={6} className="text-end search-section">
            <section className="component-heading my-1">
              <FontAwesomeIcon icon={faFileLines} className="mx-2" /> Cake Orders
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
                Add Orders
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
                onClick={() => getFeecBack()}
              >
                <FontAwesomeIcon icon={faRefresh} className="mx-1" />{" "}
                <span>Refresh</span>
              </Button>
            </div>
          </Grid>
        </Grid> */}

      <div className={`dt-table`}>
        <DataTable
          columns={categoryDTColumns}
          striped
          data={feedback_reducer_data}
          className="dt-table-container"
          pagination
          //   paginationPerPage={categoryParam?.limit}
          //   paginationServer
          //   paginationTotalRows={orders_reducer_dataCount}
          //   onChangePage={handlePageChange}
          //   onChangeRowsPerPage={handleRowsPerPageChange}
          searchable
        />
      </div>
    </div>
  );
};

export default FeedBack;
