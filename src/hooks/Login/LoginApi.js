import axios from "axios";
import { BaseUrl, LoginUrl } from "../../Constant/urls/urls";

export const LoginApi = (data) =>
  new Promise((resolve, reject) => {
    try {
      axios({
        method: "POST",
        url: `${BaseUrl}${LoginUrl}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          console.log("LoginResponse Catch Error ===", err);
          resolve(err.response);
        });
    } catch (error) {
      console.log("LoginResponse Error ===", error);
      resolve(error.response);
    }
  });
