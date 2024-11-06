import {
  faEdit,
  faFileLines,
  faRefresh,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Fab, Grid } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import MainContext from "../../context/MainContext";
import AddItem from "./AddItem";
import { useDispatch, useSelector } from "react-redux";
import { GetApi } from "../../hooks/Get/GetApi";
import { ItemsUrl } from "../../Constant/urls/urls";
import { setItemReducerData } from "../../redux/reducer/ChildReducer/ItemReducer";
import PreLoaderComponent from "../../common/PreLoaderComponent";
import { setIsItemLoadingReducerData } from "../../redux/reducer/ChildReducer/CommonLoaderReducer";

const ItemComponent = () => {
  const { ShowNotification } = useContext(MainContext);

  const { item_reducer_data } = useSelector((state) => state.ItemReducer);
  const { is_item_loading } = useSelector((state) => state.CommonLoaderReducer);

  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [editableData, setEditableData] = useState({});

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
      name: "Category",
      selector: (row) => row?.category?.name,
      width: "15%",
    },
    {
      name: "Tax",
      selector: (row) => row?.tax_category?.tax_category,
      width: "5%",
    },
    {
      name: "Retail Price",
      selector: (row) => row?.retail_price,
      width: "15%",
    },
    {
      name: "Purchase Price",
      selector: (row) => row?.purchase_price,
      width: "15%",
    },
    {
      name: "View",
      minWidth: "10%",
      cell: (row) => (
        <div className="text-center">
          <Fab size="medium" color="secondary" aria-label="add"
            className="me-2 table-fab-buttons"
            onClick={() => {
              setShow(true);
              setEditableData(row);
            }}
          >
            <FontAwesomeIcon icon={faEdit} className="" />
          </Fab>
          <Fab size="medium" color="error" aria-label="add"
            className="me-2 table-fab-buttons"
            onClick={() => {
              // handleDelete(row);
            }}
          >
            <FontAwesomeIcon icon={faTrash} className="" />
          </Fab>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getItems();
  }, []);

  const [totalLength, setTotalLength] = useState(null);

  const getItems = async (page, pageSize) => {
    try {

      let url = ItemsUrl;
      if (page && pageSize) {
        url += `?page=${page || 1}&page_size=${pageSize || 5}`;
      }

      const result = await GetApi(url);

      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setItemReducerData(result.data?.results?.data));
        setTotalLength(result.data?.results?.total_length)
      }
    } catch (error) {
      console.error("get Items Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    } finally {
      dispatch(setIsItemLoadingReducerData(false));
    }
  };

  const handlePageChange = async (page) => {
    try {
      const pageSize = 5;
      getItems(page, pageSize);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = (row) => {
    // const filterCategories = kg_reducer_data.filter((val) => val.id !== row.id);
  };

  if (is_item_loading) {
    return <PreLoaderComponent />;
  }

  return (
    <div className="cgm-purchase-section">
      <Grid container spaing={2} className="mb-2">
        <Grid item md={4} xs={6} className="text-end search-section">
          <section className="component-heading my-1">
            <FontAwesomeIcon icon={faFileLines} className="mx-2" /> Item
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
              Add Item
            </Button>
            <Button
              variant="contained"
              color="success"
              className=" mx-1"
              style={{
                textTransform: "none",
                borderRadius: "5px",
              }}
              onClick={() => getItems()}
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
          data={item_reducer_data}
          className="dt-table-container"
          pagination
          paginationPerPage={5}
          paginationServer
          paginationTotalRows={totalLength}
          onChangePage={handlePageChange}
          searchable
        />
      </div>

      <AddItem
        show={show}
        setShow={setShow}
        editableData={editableData}
        setEditableData={setEditableData}
      />
    </div>
  );
};

export default ItemComponent;
