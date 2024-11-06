import React, { useContext, useEffect, useState } from "react";
import { Button, Grid } from "@mui/material";
import { PrivacyPolicyUrl, TermsConditionsUrl } from "../../Constant/urls/urls";
import { useDispatch, useSelector } from "react-redux";
import MainContext from "../../context/MainContext";
import EditTermsConditions from "./EditTerms";
import { GetApi } from "../../hooks/Get/GetApi";
import {
  setPolicyReducerData,
  setTermsReducerData,
} from "../../redux/reducer/ChildReducer/PolicyReducer";
import EditPolicy from "./EditPolicy";

const Terms = () => {
  const dispatch = useDispatch();
  const { ShowNotification } = useContext(MainContext);

  const { terms_reducer_data, policy_reducer_data } = useSelector(
    (state) => state.PolicyReducer
  );

  const [isTermsShow, setIsTermsShow] = useState(false);
  const [isPrivacyShow, setIsPrivacyShow] = useState(false);

  useEffect(() => {
    getTermsAndConditions();
    getPrivacyPolicy();
  }, []);

  const getTermsAndConditions = async () => {
    try {
      const result = await GetApi(TermsConditionsUrl);

      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setTermsReducerData(result.data?.content));
      }
    } catch (error) {
      console.error("get Items Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    } finally {
    }
  };
  const getPrivacyPolicy = async () => {
    try {
      const result = await GetApi(PrivacyPolicyUrl);

      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
        ShowNotification("error", result.data?.message || "An error occurred");
      } else {
        dispatch(setPolicyReducerData(result.data?.content));
      }
    } catch (error) {
      console.error("get Items Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    } finally {
    }
  };

  return (
    <div style={{ textAlign: "right", margin: "20px" }}>
      <Button
        variant="contained"
        color="primary"
        className="me-2"
        onClick={() => {
          setIsTermsShow(true);
        }}
      >
        Add Terms & Conditions
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          setIsPrivacyShow(true);
        }}
      >
        Add Privacy & Policy
      </Button>

      <Grid container spacing={2} className="mt-3 text-start">
        <Grid item md={6}>
          <h5>Terms & Conditions</h5>
          <hr/>
          <pre className="text-start">{terms_reducer_data}</pre>
        </Grid>
        <Grid item md={6}>
          <h5>Privacy Policy</h5>
          <hr/>
          <pre className="text-start">{policy_reducer_data}</pre>
        </Grid>
      </Grid>

      <EditTermsConditions
        show={isTermsShow}
        setShow={setIsTermsShow}
        editableData={terms_reducer_data}
      />
      <EditPolicy
        show={isPrivacyShow}
        setShow={setIsPrivacyShow}
        editableData={policy_reducer_data}
      />
    </div>
  );
};

export default Terms;
