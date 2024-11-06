import axios from "axios";
import Cookies from "universal-cookie";

const { REACT_APP_BASE_URL, REACT_APP_CLIENT_ID } = process.env;

const cookies = new Cookies();

const createAxiosInstance = (baseURL) => {
  return axios.create({
    baseURL: baseURL,
    headers: {
      client_id: REACT_APP_CLIENT_ID,
      access_token: cookies.get("access_token"),
      user_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });
};

const LoginAPI = createAxiosInstance(REACT_APP_BASE_URL);

//Interceptors
const applyAccessTokenInterceptor = (apiInstance) => {
  apiInstance.interceptors.request.use(
    (req) => {
      const token = cookies.get("access_token");
      if (token) {
        req.headers["access_token"] = token; // Set Access Token
      }
      return req;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  apiInstance.interceptors.response.use(
    (req) => {
      return req;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
};

applyAccessTokenInterceptor(LoginAPI);


export { LoginAPI };
