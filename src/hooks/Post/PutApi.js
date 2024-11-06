import { Api } from "../../Api/Api";

export const PutApi = (url, data, is_multipart = false) =>
  new Promise((resolve, reject) => {
    try {
      const headers = is_multipart
        ? { "Content-Type": "multipart/form-data" }
        : {};

      Api({
        method: "PUT",
        url: url,
        data: data,
        headers: headers,
      })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          // console.log("PostResponse Catch Error ===", err.response);
          resolve(err.response);
        });
    } catch (error) {
      // console.log("PostResponse Error ===", error);
      resolve(error.response);
    }
  });
