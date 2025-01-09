import React, { useEffect, useState } from "react";
import "./HeaderLanding.css";
import { useSelector, useDispatch } from "react-redux";
import { updateLoggedInUserDetails } from "../../store/slices/loggedInUserDetailsSlice";
import logo from "../../Components/logo.png";
import { Link } from "react-router-dom";
import axios from "axios";
import Currency from "../../Assets/CurrencyConverter.png";
import CurrencyConversionScreen from "../../Pages/CurrencyConversion/CurrencyConversion";

const HeaderLanding = ({ fetchUserDetails, setFetchUserDetails }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const loggedInUserDetails = useSelector(
    (state) => state.loggedInUserDetails.loggedInUserDetails
  );

  useEffect(() => {
    getLoggedInUserDetails();
  }, []);

  useEffect(() => {
    if (fetchUserDetails) {
      const reqBody = {
        // clientId: 1,
      };
      const headers = {
        "Content-Type": " application/json",
        Authorization: localStorage.getItem("AuthToken"),
      };
      axios
        .post(
          "http://stg-api.aeroprime.in/crm-service/payment/getClientCredits",
          reqBody,
          { headers }
        )
        .then((response) => {
          // dispatch(updateLoggedInUserDetails(response.data))
          // setLoggedInUserDetails(response.data);
          setFetchUserDetails(false);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            localStorage.clear();
            window.location.href = "/";
          }
        });
    }
  }, [fetchUserDetails]);

  const getLoggedInUserDetails = () => {
    const reqBody = {
      // clientId: 1,
    };
    const headers = {
      "Content-Type": " application/json",
      Authorization: localStorage.getItem("AuthToken"),
    };
    axios
      .post(
        "http://stg-api.aeroprime.in/crm-service/payment/getClientCredits",
        reqBody,
        { headers }
      )
      .then((response) => dispatch(updateLoggedInUserDetails(response.data)))
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  }
  const handleCloseModal = () => {
    setIsModalOpen(false);

  };

  return (
    <header>
      <div className="header-body-landing">
        <div className="logo-container">
          <Link to="/">
            <img className="logo" src={logo} alt="logo" />
          </Link>
        </div>
        <nav className="navbar">
          <ul>
            <li className="list">
              <a href="/">Flight Search</a>
            </li>

            {((loggedInUserDetails?.role !== "admin" &&
              (loggedInUserDetails?.can_view_mis_report === 1 ||
                loggedInUserDetails?.can_view_top_up_report === 1)) ||
              (loggedInUserDetails?.role === "admin" &&
                (loggedInUserDetails?.can_deactviate_agent_booking_report ===
                  1 ||
                  loggedInUserDetails?.can_deactviate_agent_ledger_report ===
                  1))) && (
                <li className="list">
                  <a href="/Reports">Reports</a>
                </li>
              )}
            <li className="list">
              <a href="/Agents">Agents</a>
            </li>
            {loggedInUserDetails?.role === "admin" && (
              <li className="list">
                <a href="/Admins">Admin</a>
              </li>
            )}
            <li className="list">
              <a href="/bookingsHistory">Booking History</a>
            </li>
            {loggedInUserDetails?.can_do_pnr_management === 1 && (
              <li className="list">
                <a href="/SearchPNR">Search PNR</a>
              </li>
            )}
            {loggedInUserDetails?.role !== "admin" && (
              <li className="list">
                <a href="/availableBalance">Current Balance</a>
              </li>
            )}
              {/* <li className="list">
                <a href="/ProGroup">Pro Group</a>
              </li> */}
            
          </ul>
        </nav>
        
        <div className="header-right">
          <div className="nav-username">
            {loggedInUserDetails?.emailId && (
              <>
                <span>Welcome : {' '}</span>
                <span1>{loggedInUserDetails?.name ?? loggedInUserDetails?.emailId}</span1>
              </>
            )}
          </div>
          <div className="nav-logout">
            <button
              className="logout-btn"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
            >
              Logout
            </button>
            {loggedInUserDetails?.role === "admin" && (
              <button className="Currency-btn" onClick={() => handleOpenModal()}>
                <img className="currency-logo" src={Currency} alt="logo" />
              </button>
            )}

            {isModalOpen && (
              <CurrencyConversionScreen
                open={isModalOpen}
                onClose={handleCloseModal}
              // adminDetails={selectedUserInfo} // Pass the selected admin details here
              // selectedAdminDetails={selectedAdminDetails}
              // setSelectedAdminDetails={setSelectedAdminDetails}
              />
            )}



          </div>
        </div>
      </div>

    </header>
  );
};

export default HeaderLanding;
