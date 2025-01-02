import React, { useEffect, useState } from 'react'
import DropDown from "../../Components/DropDown/DropDown";
import  "./ProGroup.css";
import { useSelector } from "react-redux";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ProGroupHeader from '../../Components/ProGroupHeader/ProGroupHeader';
const ProGroup = () => {



  const [airlineOptions, setAirlineOptions] = useState([]);
  const [airline, setAirline] = useState(" ");
  const [showLoader, setShowLoader] = useState(false);

  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event) => {
    setIsChecked(event.target.checked);
  };
  const loggedInUserDetails = useSelector(
    (state) => state.loggedInUserDetails.loggedInUserDetails
);
  function getAirlineAndOption() {
    if (loggedInUserDetails && loggedInUserDetails.airlineCodes) {
        setAirlineOptions(loggedInUserDetails?.airlineCodes);
        setAirline(loggedInUserDetails?.airlineCodes[0]);
    }
}
useEffect(() => getAirlineAndOption(), [loggedInUserDetails]);



  const handleAirlineChange = async (airline) => {
    setAirline(airline);
    setShowLoader(true);
};




  return (
    <div className='Page-Wrapper'>
        <div className='search-pnr-wrapper'>
        <div className='Pro-group-heading'>PRO GROUP</div>
        <div className='Break-line'></div>
        </div>
        <div className='Airline-Dropdown'>
          <DropDown
              name="abc"
              options={airlineOptions}
              value={airline}
              onChange={handleAirlineChange}
              placeholder="Enter Airline here"
          />
          <i className="icon-arrow">
          <ExpandMoreIcon />
          </i>
        </div>
        <div className='airliner-banner'>

        </div>
        <div className='Progroup-Header'>
         <ProGroupHeader/>
        </div>
        <div>
        <div className='Confirm-Wrapper'>
        <div className="Break-line"></div>
        <div className='Create-heading'>Create Request</div>
        <div className='Info-heading'>Basic Information</div>
        <div className='Btn-dropdown-1'>
       
              <input
                className="Input-PNR1"
               
                placeholder="Group Name*"
                // value={pnr}
                
                // onChange={(event) => {
                //   setPnr(event?.target?.value.toUpperCase());
                // }}
              ></input>
           
            <div className='Airline-Dropdown1'>
          <DropDown
              name="abc"
              // options={}
              // value={airline}
              // onChange={handleAirlineChange}
              placeholder="Group Type*"
          />
          <i className="icon-arrow">
          <ExpandMoreIcon />
          </i>
        </div>
        </div>
        <div className='Info-heading2'>Itinerary</div>
        <div className='Wrapper'>
          <div className="search-trip-section1">
            <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  // defaultValue={tripType}
                  name="radio-buttons-group"
                  // onChange={(e) => setTripType(e.target.value)}
                >
                  <FormControlLabel
                    value="ONE_WAY"
                    control={<Radio />}
                    label="One Way"
                  />
                  <FormControlLabel
                    value="ROUND_TRIP"
                    control={<Radio />}
                    label="Round Trip"
                  />
                  <FormControlLabel
                    value="Multiple"
                    control={<Radio />}
                    label="Multiple"
                  />
                </RadioGroup>
              
              </FormControl>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleChange}
                  />
                  Flexible Travel Date
                </label>
              </div>
            
          </div>
          <div className='Wrapper2'>
            <div className='Group-Type-Dropdown'>
                <DropDown
                    name="abc"
                    // options={}
                    // value={airline}
                    // onChange={handleAirlineChange}
                    placeholder="Group Type*"
                />
                <i className="icon-arrow">
                <ExpandMoreIcon />
                </i>
            </div>
            <FormControl fullWidth>
                <input
                  className="Group-Name"
                
                  placeholder="Group Name*"
                  // value={pnr}
                  
                  // onChange={(event) => {
                  //   setPnr(event?.target?.value.toUpperCase());
                  // }}
                ></input>
            </FormControl>
          </div>
        </div>
        

         <div className='Wrapper3'>
            
              <input
                className="Input3"
                placeholder="Origin*"
                // value={pnr}
                
                // onChange={(event) => {
                //   setPnr(event?.target?.value.toUpperCase());
                // }}
              ></input>
            
              <input
                className="Input3"
                placeholder="Destination*"
                // value={pnr}
                
                // onChange={(event) => {
                //   setPnr(event?.target?.value.toUpperCase());
                // }}
              ></input>
           
              <input
                className="Input3"
                placeholder="Date*"
                // value={pnr}
                
                // onChange={(event) => {
                //   setPnr(event?.target?.value.toUpperCase());
                // }}
              ></input>
           
            
              <input
                className="Input3"
                placeholder="Flight No."
                // value={pnr}
                
                // onChange={(event) => {
                //   setPnr(event?.target?.value.toUpperCase());
                // }}
              ></input>
           
         </div>
        <div className='Remarks-Container'>
            <FormControl fullWidth>
              <input
                className="Input4"
                placeholder="Remarks"
                // value={pnr}
                
                // onChange={(event) => {
                //   setPnr(event?.target?.value.toUpperCase());
                // }}
              ></input>
            </FormControl>
        </div>
        <div className='Terms'>
              <div className='Terms-Text'>
                <label>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleChange}
                  />
                  By submitting this form, I agree to Vietnam Airlines Terms & Conditions. I also hereby agree to receive future communication and newsletters from Vietnam Airlines.
                </label>
               
              </div>
        </div>
        <div className="View-Pnr-btn">
                      <button
                        className="View-btn"
                        // onClick={() => fetchPnrHistory(detail?.referenceID)}
                      >
                        <h1 className="View">SUBMIT</h1>
                      </button>
        </div>
        </div>
        </div>
    </div>
  )
}

export default ProGroup