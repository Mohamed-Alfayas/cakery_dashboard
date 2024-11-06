import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import { MainContextProvider } from "./context/MainContext";
import { DataProvider } from "./context/DataContext";
import { Provider } from "react-redux";
import { store } from "./redux/store/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MainContextProvider>
      <DataProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </DataProvider>
    </MainContextProvider>
  </React.StrictMode>
);
