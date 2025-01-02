import "./Home.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "../LoginPage/LoginPage";
//import LandingPage from "../LandingPage/LandingPage";
import SignupPage from "../SignupPage/SignupPage";
import ForgotPassword from "../PasswordPage/PasswordPage";
import Reports from "../Reports/Reports";
import Admins from "../Admins/Admins";
import EditAdmin from "../EditAdmin/EditAdmin";
import Agents from "../Agents/Agents";
import AdjustMarkupScreen from "../AdjustMarkup/AdjustMarkup";
import SearchPnr from "../SearchPNR/SearchPnr";
import AddBalanceScreen from "../AddBalance/AddBalance";
import DeductBalanceScreen from "../DeductAmount/DeductAmount";
import BookingsHistoryScreen from "../BookingHistory/BookingHistory";
import AvailableBalanceScreen from "../AvailableBalance/AvailableBalance";
import ProGroup from "../ProGroup/ProGroup";
import Open from "../ProGroup/Open/Open";
import Quoted from "../ProGroup/Quoted/Quoted";
import UnderNegotiation from "../ProGroup/UnderNegotiation/UnderNegotiation";
import Confirmed from "../ProGroup/Confirmed/Confirmed";
import GroupHistory from "../ProGroup/GroupHistory/GroupHistory";
// import HeaderLanding from './Components/HeaderLanding/HeaderLanding';
// import SearchFlightResult from '../../Components/SearchResults/SearchResults';
import SearchResults from "../../Components/SearchResults/SearchResults";
import HeaderLanding from "../../Components/HeaderLanding/HeaderLanding";
import Footer from "../../Components/Footer/Footer";
//import SearchFlights from "../../Components/SearchFlights/SearchFlights";
import { SearchFlightsTest2 } from "../../Components/SearchFlights/searchFlightTest2"
//import SearchFlightsTest from "../../Components/SearchFlights/SearchFlightsTest";
// import { SearchResult } from "../../Components/SearchResults/SearchResults";

const Home = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const [searchResult, setSearchResult] = useState(null);

  const [fetchUserDetails, setFetchUserDetails] = useState(false);
  const [showFooter, setShowFooter] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Determine whether to show the footer based on the current route
    if (location.pathname === "/searchResults") {
      setShowFooter(false);
    } else {
      setShowFooter(true);
    }
  }, [location.pathname]);

  return (

    <div className="home-wrapper">

      {localStorage.getItem("loggedin") === "true" && (
        <HeaderLanding
          fetchUserDetails={fetchUserDetails}
          setFetchUserDetails={setFetchUserDetails}
        />

      )}
      <div
        className={`${localStorage.getItem("loggedin") === "true"
          ? "content-container"
          : ""
          }`}
      >
        <Routes>
          {/* <Route path="/" element={<LoginPage />} /> */}
          <Route path="/signup" element={<SignupPage />}
          />
          <Route path="/forgotpassword" element={<ForgotPassword />}
          />
          {/* <Route path="landing" element={<LandingPage />}/> */}
          {/* <Route path="/searchflight" element={<LandingPage />} /> */}
          <Route path="/reports" element={<Reports />}
          />
          <Route path="/admins" element={<Admins />}
          />
          <Route path="/editAdmin/:id" element={<EditAdmin />}
          />
          <Route path="/bookingsHistory" element={<BookingsHistoryScreen />}
          />
          <Route path="/agents" element={<Agents />}
          />
          <Route path="/SearchPNR" element={<SearchPnr />}
          />
          <Route path="/addBalance" element={<AddBalanceScreen
          />}
          />
          <Route path="/deductBalance" element={<DeductBalanceScreen />}
          />
          <Route path="/adjustMarkup" element={<AdjustMarkupScreen />}
          />
          <Route path="/ProGroup" element={<ProGroup />}
          />
          <Route path="/Open-grp" element={<Open />}
          />
          <Route path="/Quoted-grp" element={<Quoted />}
          />
          <Route path="/Under-Negotiation-grp" element={<UnderNegotiation />}
          />
          <Route path="/Confirmed-grp" element={<Confirmed />}
          />
          <Route path="/History-grp" element={<GroupHistory />}
          />
          <Route path="/availableBalance" element={<AvailableBalanceScreen />}
          />
          <Route path="/searchResults"
            element={
              <SearchResults
                searchResult={searchResult}
                setFetchUserDetails={setFetchUserDetails}
              />

            }
            a
          />
          {/* <Route path ="header" element={<HeaderLanding />} /> */}
          <Route path="/"
            element={
              localStorage.getItem("loggedin") === "true" ? (
                // <LandingPage />
                <SearchFlightsTest2 setSearchResult={setSearchResult} />

              ) : (
                // <SearchFlights setSearchResult={setSearchResult} />
                <LoginPage setUserLoggedIn={setUserLoggedIn} />
              )
            }
          />

        </Routes>

      </div>

      {showFooter && <Footer />}

    </div>
  );
};

export default Home;
