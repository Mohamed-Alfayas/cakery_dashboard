import React, { useContext, useState } from "react";
import Cookies from "universal-cookie";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Login from "./components/login/Login";
import { Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import DataContext from "./context/DataContext";
import MainContext from "./context/MainContext";

//Components
import Dashboard from "./components/base/Dashboard";
import withRole from "./components/redirect/withRole";
import AccessDenied from "./components/base/AccessDenied";
import PageNotFound from "./components/base/PageNotFound";
import { CAKERY_TOKEN } from "./Constant/Keys/Keys";
import PurchaseReceipt from "./components/purchase/PurchaseReceipt";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

function App() {
  const cookies = new Cookies();
  const { userRole } = useContext(MainContext);
  const { RoutesList } = useContext(DataContext);

  const [signed, setSigned] = useState(() => {
    const token = localStorage.getItem(CAKERY_TOKEN);
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        return Boolean(parsedToken.access);
      } catch (e) {
        console.error("Failed to parse token from localStorage", e);
        return false;
      }
    }
    return false;
  });

  const [mountLogin, setMountLogin] = useState(() => {
    const token = localStorage.getItem(CAKERY_TOKEN);
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        return !Boolean(parsedToken.access);
      } catch (e) {
        console.error("Failed to parse token from localStorage", e);
        return true; // Assuming login should be mounted if token parsing fails
      }
    }
    return true; // Assuming login should be mounted if token doesn't exist
  });

  return (
    <div className="App app-dashboard">
      <ToastContainer />
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <LoginRedirect signed={mountLogin}>
                <Login setSigned={setSigned} />
              </LoginRedirect>
            }
          />

          <Route
            element={
              <Protected signed={signed}>
                <Dashboard setMountLogin={setMountLogin} setSigned={setSigned}>
                  <Outlet />
                </Dashboard>
              </Protected>
            }
          >
            {RoutesList.map((route, index) => {
              if (route.subMenu) {
                return route.subMenu.map((subRoute, subIndex) => (
                  <Route
                    key={`${index}-${subIndex}`}
                    path={subRoute.link}
                    element={
                      <Protected signed={signed}>
                        {withRole(
                          subRoute.accessRoles,
                          subRoute.element
                        )({ userRole })}
                      </Protected>
                    }
                  />
                ));
              } else {
                return (
                  <Route
                    key={index}
                    path={route.link}
                    element={
                      <Protected signed={signed}>
                        {withRole(
                          route.accessRoles,
                          route.element
                        )({ userRole })}
                      </Protected>
                    }
                  />
                );
              }
            })}

            <Route path="/access-denied" element={<AccessDenied />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
          <Route
            path="/purchase/:id"
            element={
              <Protected signed={signed}>
                <Dashboard setMountLogin={setMountLogin} setSigned={setSigned}>
                  <PurchaseReceipt />
                </Dashboard>
              </Protected>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

function Protected({ signed, children }) {
  if (!signed) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function LoginRedirect({ signed, children }) {
  if (!signed) {
    return <Navigate to="/" replace />;
  }
  return children;
}
