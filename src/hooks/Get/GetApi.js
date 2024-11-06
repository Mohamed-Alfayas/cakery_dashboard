import { Api } from "../../Api/Api";

export const GetApi = (url) =>
  new Promise((resolve, reject) => {
    try {
      // console.log("url ====", url);
      Api({
        method: "GET",
        url: url,
      })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          console.info("err ====", err);
          console.error("GetResponse Catch Error ===", err.response);
          resolve(err.response);
        });
    } catch (error) {
      console.log("GetResponse Error ===", error);
      reject(error.response);
    }
  });
