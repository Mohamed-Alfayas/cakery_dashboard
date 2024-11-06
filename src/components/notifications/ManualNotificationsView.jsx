import React, { useContext, useEffect, useState } from "react";
import MainContext from "../../context/MainContext";
import NotificationContext from "../../context/NotificationContext";
import { getManualNotificationList } from "../../utils/NotificationAPI";
import { faBan, faCircleCheck, faEdit, faFileLines, faPlusCircle, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Chip, Grid } from "@mui/material";
import DataTable from "react-data-table-component";
import "./ManualNotificationsView.scss";
import ManualNotificationCRUD from "./ManualNotificationCRUD";

const ManualNotificationsView = () => {
  const { setIsPreLoading, ShowNotification } = useContext(MainContext);

  const {
    initRenderManualList,
    setInitRenderManualList,
    manualNotficationList,
    setManualNotficationList,
    manualNotficationListCount,
    setManualNotficationListCount,
    manualNotficationParam,
    setManualNotficationListParam,
  } = useContext(NotificationContext);

  const [initComp, setInitComp] = useState(true);
    const [selectedRow, setSelectedRow] = useState(null);

  /* Based on Param */
  useEffect(() => {
    if (!initRenderManualList && !initComp) {
      getManualNotificationListData();
    }
  }, [manualNotficationParam]);

  useEffect(() => {
    if (initRenderManualList) {
      getManualNotificationListData();
      setInitRenderManualList(false);
    }

    setTimeout(() => {
      setInitComp(false);
    }, 1000);
  }, []);
  useEffect(() => {
    console.log(manualNotficationList);
  }, [manualNotficationList]);

  const getManualNotificationListData = async () => {
    let requestParam = manualNotficationParam;
    setIsPreLoading(true);

    try {
      const getManualNotificationListResponse = await getManualNotificationList(
        requestParam
      );

      setManualNotficationList([
        ...getManualNotificationListResponse?.data?.approved,
        ...getManualNotificationListResponse?.data?.not_approved,
      ]);
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response ? error.response.data : error.message
      );
      ShowNotification("error", error?.message);
    } finally {
      setIsPreLoading(false);
    }
  };

  const manualNotificationsColumns = [
    {
      name: "ID",
      selector: (row) => row?.id,
      width: "10%",
    },
    {
      name: "Title",
      selector: (row) => row?.title,
      width: "15%",
    },
    {
      name: "Body",
      selector: (row) => row?.body,
      minWidth: "25%",
    },
    {
      name: "Sub Type",
      selector: (row) => row?.sub_type,
      minWidth: "10%",
    },
    {
      name: "Approval Status",
      selector: (row) => (row?.is_approved ? "Approved" : "Pending"),
      minWidth: "10%",
      cell: (row) => {
        let resultValue = row?.is_approved;
        return (
          <div className="text-center notification-approval-status">
            <Chip
              variant="filled"
              style={{ textTransform: "capitalize" }}
              label={
                resultValue ? (
                  <>
                    <FontAwesomeIcon icon={faCircleCheck} className="mx-1" />
                    Approved
                  </>
                ) : (
                    <>
                    <FontAwesomeIcon icon={faBan} className="mx-1" />
                    Pending
                  </>
                )
              }
              className={resultValue ? "approved" : "pending"}
            />
          </div>
        );
      },
    },
    {
      name: "Action",
      width: "20%",
      cell: (row) => (
        <div className="text-center">
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{
              textTransform: "none",
              borderRadius: "5px",
            }}
            onClick={() => {
              setIsEdit(true);
              setShow(true);
              setSelectedRow(row);
            }}
          >
            <FontAwesomeIcon icon={faEdit} className="mx-1" />
            Edit
          </Button>
        </div>
      ),
    },
  ];

  
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="manual-notifications-list-section">
      <section className="component-heading mt-1 mb-3">
        <FontAwesomeIcon icon={faFileLines} className="mx-2" /> Manual
        Notifications List
      </section>

      <Grid container spaing={2} className="mb-2">
        <Grid item md={4} xs={6} className="text-end search-section"></Grid>
        <Grid item md={8} xs={6} className="text-end top-action-button-group">
          <div className="ml-auto">
            <Button
              variant="outlined"
              color="success"
              className=" mx-1"
              style={{
                textTransform: "none",
                borderRadius: "5px",
                padding: "5px 10px",
              }}
              onClick={() => {
                getManualNotificationListData();
              }}
            >
              <FontAwesomeIcon icon={faRefresh} className="mx-1" />{" "}
              <span>Refresh</span>
            </Button>
            <Button
              variant="outlined"
              color="success"
              className="mx-1"
              style={{
                textTransform: "none",
                borderRadius: "5px",
                padding: "5px 10px",
              }}
              onClick={()=>{
                setShow(true);
                setIsEdit(false);
              }}
            >
              <FontAwesomeIcon icon={faPlusCircle} className="mx-1" />{" "}
              <span>New Notifications</span>
            </Button>
          </div>
        </Grid>
      </Grid>

      <div className={`dt-table`}>
        <DataTable
          columns={manualNotificationsColumns}
          striped
          data={manualNotficationList}
          className="dt-user-list"
          pagination
          paginationPerPage={manualNotficationParam?.limit}
          paginationServer
          //   paginationTotalRows={cgmUserActionListCount}
          //   onChangePage={handlePageChange}
          //   onChangeRowsPerPage={handleRowsPerPageChange}
          searchable
        />
      </div>

      <ManualNotificationCRUD
        show={show}
        setShow={setShow}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        getManualNotificationListData={getManualNotificationListData}
      />
    </div>
  );
};

export default ManualNotificationsView;
