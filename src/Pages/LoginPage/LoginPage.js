import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderLogin from "../../Components/HeaderLogin/HeaderLogin";
import "./LoginPage.css";
import Footer from "../../Components/Footer/Footer";
import axios from "axios"
import Alert from "@mui/material/Alert";

const LoginPage = ({ setUserLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  // const navigate = useNavigate();

  const handleSubmit = (event) => {

    event.preventDefault();
    setError(false);
    const loginData = {
      email: username,
      password: password,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post("http://stg-api.aeroprime.in/crm-service/user/login", loginData, {
        headers,
      })
      .then((response) => {

        setUserLoggedIn(true);
        localStorage.setItem("AuthToken", `Bearer ${response.data.token}`);
        localStorage.setItem("loggedin", `true`);
        //navigate('/landing');
      })
      .catch((error) => {
        setError(true);

      });
  };
  const handleKeyDown = (e) => {
    if (e.keyCode === 'Enter') {
      handleSubmit(e);
    }
  }

  // useEffect(() => {
  //   document.addEventListener('keydown', handleKeyDown);

  //   return () => {
  //     document.removeEventListener('keydown', handleKeyDown);
  //   };
  // });

  useEffect(() => {
    const formElement = document.querySelector('.login-form');
    formElement.addEventListener('keydown', handleKeyDown);

    return () => {
      formElement.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <HeaderLogin />
      <div className="login-form-container">
        <h1 className="login-title">LOGIN WITH YOUR TRAVEL AGENT ACCOUNT</h1>
        <div className="break-line"></div>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            className="login-Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="User Name"
          />

          <input
            type="password"
            className="login-Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
          />



          <button type="submit" className="login-button" onClick={handleSubmit}>

            LOGIN
          </button>
          {error && <div className="login-sections-error">
            <Alert severity="error">
              Login Failed! Please Try with correct username and password!
            </Alert>
          </div>}
          {/* <p className="forgot-password">
            <Link to="forgotpassword">Forgot Password?</Link>
          </p> */}
        </form>

        {/* <div className="signup-link-container">
          <p className="signup-link">
            Don't have an account?
            <span>
              <Link to="signup">Sign-Up</Link>
            </span>
          </p>
        </div> */}
      </div >

      {/* <Footer /> */}
    </>
  );
}

export default LoginPage;
