import React, { useContext, useState } from "react";
import Cookies from "universal-cookie";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Login from "./components/login/Login";
import { Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
//Components
import Home from "./components/home/Home";
import UserVerification from "./components/human-token/token-verification/UserVerification";
import KitOrder from "./components/human-token/tracking/KitOrder";
import PickupOrder from "./components/human-token/tracking/PickupOrder";
import Dashboard from "./components/base/Dashboard";
import WhatsappQuery from "./components/whatsapp-query/WhatsappQuery";
import Food from "./components/nutrition/food/Food";
import Meal from "./components/nutrition/meal/Meal";
import MealTracker from "./components/nutrition/meal-tracker/MealTracker";
import withRole from "./components/redirect/withRole";
import MainContext from "./context/MainContext";
import AccessDenied from "./components/base/AccessDenied";
import Profile from "./components/profile/Profile";

function App() {
  const cookies = new Cookies();
  const { userRole } = useContext(MainContext);

  const [signed, setSigned] = useState(
    cookies.get("access_token") ? true : false
  );

  const [mountLogin, setMountLogin] = useState(
    cookies.get("access_token") ? false : true
  );

  
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
            <Route
              path="/"
              element={
                <Protected signed={signed}>
                  <Home />
                </Protected>
              }
            />

            {/* <Route
              path="/user-verify"
              element={
                <Protected signed={signed}>
                  <UserVerification />
                </Protected>
              }
            /> */}
            <Route
              path="/user-verify"
              element={
                <Protected signed={signed}>
                  {withRole(
                    ["1", "2", "3", "4", "5"],
                    UserVerification
                  )({ userRole })}
                </Protected>
              }
            />

            <Route
              path="/kit"
              element={
                <Protected signed={signed}>
                  <KitOrder />
                </Protected>
              }
            />

            <Route
              path="/order"
              element={
                <Protected signed={signed}>
                  <PickupOrder />
                </Protected>
              }
            />
            <Route
              path="/queries"
              element={
                <Protected signed={signed}>
                  <WhatsappQuery />
                </Protected>
              }
            />
            {/*  */}
            <Route
              path="/food"
              element={
                <Protected signed={signed}>
                  <Food />
                </Protected>
              }
            />
            <Route
              path="/meal"
              element={
                <Protected signed={signed}>
                  <Meal />
                </Protected>
              }
            />
            <Route
              path="/food-intake"
              element={
                <Protected signed={signed}>
                  <MealTracker />
                </Protected>
              }
            />
             <Route
              path="/profile"
              element={
                <Protected signed={signed}>
                  <Profile />
                </Protected>
              }
            />
            {/*  */}
            <Route path="/access-denied" element={<AccessDenied />} />
          </Route>
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