import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import HeaderLanding from '../../Components/HeaderLanding/HeaderLanding.js';
// import DropDown from '../../Components/DropDown/DropDown.js';
// import Flight-Search from '../../Components/FlightSearch/FlightSearch';
// import  PassengerSelector from '../../Components/PassengerSelector/PassengerSelector';

import SearchFlights from "../../Components/SearchFlights/SearchFlightsTest.jsx";
import "./LandingPage.css";
import Footer from "../../Components/Footer/Footer";
// import FlightSearch from '../../Components/FlightSearch/FlightSearch.js';
import { SearchFlightsTest } from "../../Components/SearchFlights/SearchFlightsTest";
const LandingPage = () => {
  //for dropdown button
  //  const [isOpen, setIsOpen] = useState(false);

  //  const toggleDropdown = () => {
  //     setIsOpen(!isOpen);
  //  };

  //for radio button
  // const [selectedValue, setSelectedValue] = useState('');

  // const handleChange = (event) => {
  //   event.preventDefault();
  //     setSelectedValue(event.target.value);
  // };

  // calender dropdown
  // const [startDate, setStartDate] = useState(null);
  // const [dateLabel1, setDateLabel1] = useState('Select Departing Date');

  // const [EndDate, setEndDate] = useState(null);
  // const [dateLabel2, setDateLabel2] = useState('Select Returning Date');
  const [searchResult, setSearchResult] = useState(null);

  return (
    <div className="Landing-page-container">
      {/* <HeaderLanding/> */}
      <div className="Pnr-container">
        <div className="Pnr-tittle">
          <h2>SEARCH PNR</h2>
        </div>
        <div className="Break-line"></div>

        <div className="Pnr-input">
          <input className="pnr-inputbox" type="text"></input>
          <input className="pnr-submit-button" type="submit" />
        </div>
      </div>

      <div className="Booking-container">
        <div className="Booking-tittle">
          <h2>BOOK YOUR FLIGHT</h2>
        </div>
        <div className="Breakline"></div>

        <div className='selection-container'>
          <SearchFlights setSearchResult={setSearchResult} />
        </div>
      </div>
      <div className="Recent-Booking-container">
        <div className="Recent-Booking-tittle">
          <h2>Recent Booking</h2>
        </div>

        <div className="Break-line"></div>
      </div>

      <div className="footer-landing">
        <Footer />
      </div>
    </div>
  );
};


export default LandingPage;
