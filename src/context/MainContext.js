import { createContext, useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
const MainContext = createContext({});

export const MainContextProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState("");
  const [isInitPreLoading, setIsInitPreLoading] = useState(true); //Initial Loader
  const [isPreLoading, setIsPreLoading] = useState(false); // Preloading Other

  /*  */
  const [activeLink, setActiveLink] = useState("");

  const [userRole, setUserRole] = useState("");

  const { REACT_APP_CLIENT_ID } = process.env;

  const headers = {
    access_token: accessToken,
    user_timezone: "Asia/Calcutta",
    "Content-Type": "application/json",
    client_id: REACT_APP_CLIENT_ID,
  };

  useEffect(() => {
    if (new Cookies().get("access_token")) {
      setAccessToken(new Cookies().get("access_token"));
    }else{
      console.log("Access Token Not Found")
    }
  }, []);

  const ShowNotification = (type, message) => {
    toast[type](message, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const ShowConfirmation = async (
    title,
    positiveButtonText,
    negativeButtonText
  ) => {
    const result = await Swal.fire({
      title: title,
      // showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: positiveButtonText,
      denyButtonText: negativeButtonText,
      focusConfirm: false,
    });
    // }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      // Swal.fire("Saved!", "", "success");
      return "yes";
    } else if (result.isDenied) {
      return "no";
      // Swal.fire("Changes are not saved", "", "info");
    }
    // });
    console.log("after function call ");
  };

  useEffect(() => {
    return async () => {
      setTimeout(() => {
        setIsInitPreLoading(false);
      }, 2000);
    };
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
    }
  }, [accessToken]);

  return (
    <MainContext.Provider
      value={{
        ShowNotification,
        ShowConfirmation,
        accessToken,
        setAccessToken,

        isInitPreLoading,
        isPreLoading,
        setIsPreLoading,
        setIsInitPreLoading,
        activeLink,
        setActiveLink,
        headers,
        userRole,
        setUserRole,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export default MainContext;
