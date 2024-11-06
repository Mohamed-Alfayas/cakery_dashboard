import React, { useState, useContext } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router";
// import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import preloaderGif from "../../assets/img/preloader-2.gif";
import "./Login.css";
import MainContext from "../../context/MainContext";
import { LoginApi } from "../../hooks/Login/LoginApi";
import { CAKERY_TOKEN } from "../../Constant/Keys/Keys";

const Login = ({ setSigned }) => {
  const navigate = useNavigate();
  const cookies = new Cookies();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAccessToken, ShowNotification } = useContext(MainContext);

  const [passwordType, setPasswordType] = useState("password");

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const validateEmail = (inputText) => {
    //const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (inputText.match(mailformat)) {
      return true;
    } else {
      return false;
    }
  };

  const handleChange = (e, callback) => {
    callback(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!validateEmail(email)) {
        ShowNotification("warning", "Enter a Valid Email Address");
        return;
      }
      if (!password.trim()) {
        ShowNotification("warning", "Enter a Valid Password");
        return;
      }
  
      const data = { username: email, password: password };
      setIsLoginPreLoading(true);
  
      const result = await LoginApi(data);
  
      if (!result?.status) {
        ShowNotification("error", "Network Error");
        return;
      }
  
      const { status, data: responseData } = result;
  
      if (status !== 200) {
        ShowNotification("error", responseData?.message);
        return;
      }
  
      ShowNotification("success", responseData?.message);
  
      const responseToken = responseData?.tokens?.access;
  
      localStorage.setItem(CAKERY_TOKEN, JSON.stringify(responseData.tokens));
      cookies.set("access_token", responseToken, { path: "/", maxAge: 604800 });
  
      setAccessToken(responseToken);
      setSigned(true);
      navigate("/");
    } catch (error) {
      ShowNotification("error", "An unexpected error occurred");
    } finally {
      setIsLoginPreLoading(false);
    }
  };  

  //Initial Preloader
  const [isLoginPreLoading, setIsLoginPreLoading] = useState(false); //Initial Loader

  const Preloader = () => {
    return (
      <div className="preloader-section">
        <img src={preloaderGif} alt="Loading..." />
      </div>
    );
  };

  /* Login/Signup Panel */

  const [activePanel, setActivePanel] = useState(false);

  const handlePanelToggle = (status) => {
    setActivePanel(status);
  };

  return (
    <div>
      {isLoginPreLoading && <Preloader />}
      <div className="login-container">
        <div
          className={`container ${activePanel ? "active" : ""}`}
          id="container"
        >
          <div className="form-container sign-up">
            <form>
              <h1>Create Account</h1>

              <span>or use your email for registration</span>
              <input type="text" placeholder="Name" />
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <button type="submit">Sign Up</button>
            </form>
          </div>
          <div className="form-container sign-in">
            <form>
              <h1 className="log-in-text">Log In </h1>

              <span className="mb-2 log-in-desc">
                Use your E-mail and Password
              </span>

              <Form.Group
                className="mb-2 text-start w-100"
                controlId="formBasicEmail"
              >
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  onChange={(e) => handleChange(e, setEmail)}
                />
              </Form.Group>
              <Form.Group
                className="mb-2 text-start w-100"
                controlId="formBasicPassword"
              >
                <InputGroup>
                  <Form.Control
                    type={passwordType}
                    placeholder="Password"
                    onChange={(e) => handleChange(e, setPassword)}
                    onKeyUp={(event) => {
                      if (event.key === "Enter") {
                        handleSubmit();
                      }
                    }}
                  />
                  <InputGroup.Text
                    onClick={togglePassword}
                    style={{ cursor: "pointer" }}
                  >
                    {passwordType === "password" ? (
                      <FontAwesomeIcon icon={faEye} />
                    ) : (
                      <FontAwesomeIcon icon={faEyeSlash} />
                    )}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              <Button variant="primary" onClick={handleSubmit}>
                Sign In
              </Button>
            </form>
          </div>
          <div className="toggle-container">
            <div className="toggle">
              <div
                className={`toggle-panel toggle-left ${
                  activePanel ? "active" : ""
                }`}
              >
                <h1>Welcome Back!</h1>
                <p>Enter your personal details to use all site features</p>
                <button
                  className="hidden"
                  onClick={() => handlePanelToggle(false)}
                  id="login"
                >
                  Sign In
                </button>
              </div>
              <div
                className={`toggle-panel toggle-right ${
                  activePanel ? "active" : ""
                }`}
              >
                <img
                  src={require("../../assets/img/tcc-logo.png")}
                  alt=""
                  className="login-logo"
                />

                <h1>Chennai Cakery</h1>
                <p>Admin Dashboard</p>
                {/* <button
                  className="hidden"
                  onClick={() => handlePanelToggle(true)}
                  id="register"
                >
                  Sign Up
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
