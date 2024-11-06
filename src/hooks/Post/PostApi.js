import { Api } from "../../Api/Api";

export const PostApi = (url, data, is_multipart) =>
  new Promise((resolve, reject) => {
    try {
      const headers = is_multipart
        ? { "Content-Type": "multipart/form-data" }
        : {};

      Api({
        method: "POST",
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
