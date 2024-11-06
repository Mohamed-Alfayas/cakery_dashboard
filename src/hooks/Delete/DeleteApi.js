import { Api } from "../../Api/Api";

export const DeleteApi = (url) =>
  new Promise((resolve, reject) => {
    try {
      console.log("url ====", url);
      Api({
        method: "DELETE",
        url: url,
      })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          console.log("err ====", err);
          console.log("GetResponse Catch Error ===", err.response);
        });
    } catch (error) {
      console.log("GetResponse Error ===", error);
      reject(error.response);
    }
  });
