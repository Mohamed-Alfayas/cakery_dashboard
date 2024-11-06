import axios from "axios";
import { BaseUrl } from "../Constant/urls/urls";
import { CAKERY_TOKEN } from "../Constant/Keys/Keys";

export const Api = axios.create({
  baseURL: "",
});

let isRefreshing = false;
let refreshSubscribers = [];

// Function to refresh the token
const getRefreshToken = async () => {
  const refreshToken = JSON.parse(localStorage.getItem(CAKERY_TOKEN)).refresh;
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}api/token/refresh/`,
      {
        refresh: refreshToken,
      }
    );
    const newAccessToken = response.data.access;
    // Update the token in local storage
    const tokenData = JSON.parse(localStorage.getItem(CAKERY_TOKEN));
    tokenData.access = newAccessToken;
    localStorage.setItem(CAKERY_TOKEN, JSON.stringify(tokenData));
    // Return the new token
    return newAccessToken;
  } catch (error) {
    // Handle error
    console.log("getRefreshToken error ====", error);
    throw error; // Rethrow the error for the caller to handle
  }
};

Api.interceptors.request.use(
  (req) => {
    const parsedToken = localStorage.getItem(CAKERY_TOKEN);
    const token = JSON.parse(parsedToken);
    if (token) {
      req.headers["Authorization"] = "Bearer " + token?.access;
      req.headers["Accept"] = "application/json";
      // req.headers["api_from"] = 1;
    }
    return req;
  },
  (err) => {
    Promise.reject(err);
  }
);

// Add response interceptor
Api.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token-related exceptions
    if (
      !!error?.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If token is being refreshed, wait for the new token
        try {
          const newToken = await new Promise((resolve) => {
            refreshSubscribers.push((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(token);
            });
          });
          originalRequest._retry = true;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          // Resend the original request with the new token
          return axios(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      } else {
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = await getRefreshToken();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          refreshSubscribers.forEach((callback) => callback(newToken));
          refreshSubscribers = [];
          return axios(originalRequest);
        } catch (refreshError) {
          console.log("refresh Error ", refreshError);
          // Check if refresh token is expired
          if (!!refreshError.response && refreshError.response.status === 401) {
            // Perform logout action (e.g., clear local storage, redirect to login page)
            logout();
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }

    // Handle other types of errors
    return Promise.reject(error);
  }
);

// Function to get the base URL dynamically
const getBaseURL = () => {
  return BaseUrl;
};

// Set the dynamic base URL
Api.defaults.baseURL = getBaseURL();

// Update base URL whenever the window location changes
window.addEventListener("popstate", () => {
  Api.defaults.baseURL = getBaseURL();
});

window.addEventListener("pushstate", () => {
  Api.defaults.baseURL = getBaseURL();
});

window.addEventListener("replacestate", () => {
  Api.defaults.baseURL = getBaseURL();
});

const logout = () => {
  console.log("logoutFunction Initiated");
  // Clear local storage or perform any other logout actions
  localStorage.removeItem(CAKERY_TOKEN);

  if (window.logoutChannel) {
    window.logoutChannel.close();
  }
  // Create a new broadcast channel
  window.logoutChannel = new BroadcastChannel("logoutChannel");

  // Broadcast logout event to other tabs
  window.logoutChannel.postMessage("logoutEvent");

  // Redirect to login page or perform any other appropriate actions
  window.location.href = "/login/";
};
