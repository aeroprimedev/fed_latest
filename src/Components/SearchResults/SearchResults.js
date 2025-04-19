import React, { useState, useEffect } from "react";
import "./SearchResults.css";
import { useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import axios from "axios";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from "@mui/material";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import SwapHorizontalCircleSharpIcon from "@mui/icons-material/SwapHorizontalCircleSharp";
import DropDown from "../DropDown/DropDown";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import BookingDetails from "../BookingDetails/BookingDetails";
import flyArystan from "../../Assets/fly_arystan.png";
import TurkAirlines from "../../Assets/turk_airlines.png";
import salam from "../../Assets/salam.jpeg";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import Loader from "../Loader/Loader";
import { format } from "date-fns";
import { styled } from "@mui/material/styles";
import FlightIcon from "@mui/icons-material/Flight";
import { Box } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Custom Styled Radio Button
const CustomRadio = styled(Radio)(({ theme }) => ({
  "&.Mui-checked": {
    color: "#EF5443", // Red color for the selected radio button
  },
  "& .MuiSvgIcon-root": {
    color: "#fff",
    fontSize: 24, // Adjust radio button size
  },
  "&.Mui-checked .MuiSvgIcon-root": {
    borderRadius: "50%",
    backgroundColor: "#EF5443", // Background color when checked
    color: "white", // Checkmark color
  },
  "& .MuiSvgIcon-root::after": {
    content: '""',
    display: "block",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "#fff",
  },
}));

// Custom Label Styling
const CustomFormControlLabel = styled(FormControlLabel)({
  "& .MuiFormControlLabel-label": {
    fontSize: "16px",
    fontWeight: 700,
    color: "#fff", // Dark grey text color
    fontFamily: "Inter",
  },
});

const SearchResults = ({ searchResult, setFetchUserDetails }) => {
  const [airline, setAirline] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [tripType, setTripType] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [dateLabel1, setDateLabel1] = useState("");
  const [dateLabel2, setDateLabel2] = useState("");
  const [adult, setAdult] = useState(null);
  const [child, setChild] = useState(null);
  const [infant, setInfant] = useState(null);

  const [selectedAdult, setSelectedAdult] = useState(1);
  const [selectedChild, setSelectedChild] = useState(0);
  const [selectedInfant, setSelectedInfant] = useState(0);
  const [passengerCount, setPassengerCount] = useState(false);
  const [passCount, setPassCount] = useState({
    adult: 0,
    child: 0,
    infant: 0,
  });
  const [flightsAvailable, setFlightsAvailable] = useState(null);
  const [searchResultList, setSearchResultList] = useState(null);
  const [flightClassList, setFlightClassList] = useState(null);
  const [oneWayTripDetails, setoneWayTripDetails] = useState(null);
  const [twoWayTripDetails, setTwoWayTripDetails] = useState(null);
  const [showBookingDetailsDialog, setShowBookingDetailsDialog] =
    useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showNoFlightsMessage, setShowNoFlightsMessage] = useState(false);
  const [showFlexiFare, setShowFlexiFare] = useState(false);
  const [totalTravelers, setTotalTravelers] = useState(0);
  const [showOneWayFlexiFareCard, setShowOneWayFlexiFareCard] = useState(null);
  const [showTwoWayFlexiFareCard, setShowTwoWayFlexiFareCard] = useState(null);
  const [selectedValue, setSelectedValue] = useState("onward");
  const location = useLocation();
  const loggedInUserDetails = useSelector(
    (state) => state.loggedInUserDetails.loggedInUserDetails
  );

  const getTimeInHours = (dt) => {
    let hrs = new Date(dt?.split("+")[0]).getHours();
    return hrs;
  };

  const getTimeInMinutes = (dt) => {
    let minutes = new Date(dt?.split("+")[0]).getMinutes();
    return minutes;
  };

  const connectingFlightDuration = (departure, arrival) => {
    var departureMS = Date.parse(departure?.split("+")[0]);
    var arrivalMS = Date.parse(arrival?.split("+")[0]);
    let difference = Number(arrivalMS) - Number(departureMS);
    let seconds = Math.floor(difference / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    return `${hours}H${minutes - hours * 60}M`;
  };

  // extracting data from location.state to show on drop downs
  //search result should have data from search flight but it is blank and that why even though we have
  // data it is showing no fligh data

  useEffect(() => {
    // handleAirlineChange();
    setSearchResultList(searchResult);
    if (searchResult?.success !== true) {
      setShowNoFlightsMessage(true);
    }
    setAirline(location?.state?.searchRequestBody?.airlineCode);
    setTripType(location?.state?.searchRequestBody?.tripType);
    setOrigin(location?.state?.origin);
    setDestination(location?.state?.destination);
    const { departureDate, returnDate, searchRequestBody } = location.state;
    const convertToDate = (date) => {
      if (date && date.$d) {
        return new Date(date.$d); // For Day.js or similar libraries
      }
      if (typeof date === "string") {
        return new Date(date);
      }
      if (date instanceof Date && !isNaN(date.getTime())) {
        return date;
      }
      return null;
    };

    const depDate = convertToDate(departureDate);
    const retDate = convertToDate(returnDate);

    setDepartureDate(depDate);
    setReturnDate(retDate);

    // Set labels based on dates
    setDateLabel1(depDate ? depDate.toLocaleDateString() : "Departure Date");
    setDateLabel2(retDate ? retDate.toLocaleDateString() : "Return Date");

    // Initialize passenger counts
    let adultCount = 1;
    let childCount = 0;
    let infantCount = 0;

    if (searchRequestBody?.passengerTypeQuantityList) {
      searchRequestBody.passengerTypeQuantityList.forEach((passenger) => {
        if (passenger?.passengerType === "ADLT") {
          adultCount = Number(passenger.quantity);
        }
        if (passenger?.passengerType === "CHLD") {
          childCount = Number(passenger.quantity);
        }
        if (passenger?.passengerType === "INFT") {
          infantCount = Number(passenger.quantity);
        }
      });
    }

    setSelectedAdult(adultCount > 0 ? adultCount : 1);
    setSelectedChild(childCount);
    setSelectedInfant(infantCount);
    // setPassengerCount(true);
    setPassCount({
      adult: adultCount,
      child: childCount,
      infant: infantCount,
    });

    if (adultCount + childCount + infantCount < 2) {
      setShowFlexiFare(true);
    }
    const totalPassengers = adultCount + childCount + infantCount;
    setTotalTravelers(totalPassengers); // Assuming you have this state defined

    // Show no flights message if necessary
  }, []);

  useEffect(() => {
    if (searchResultList?.success === true) {
      let flightClassListData = [];
      const oneWayFlightsData = [];
      const oneWayTripFlights =
        searchResultList?.tripType === "ROUND_TRIP"
          ? searchResultList?.data?.availabilityResultList
              ?.availabilityRouteList[0]?.availabilityByDateList
              ?.originDestinationOptionList
          : searchResultList?.data?.availabilityResultList
              ?.availabilityRouteList?.availabilityByDateList
              ?.originDestinationOptionList;
      if (Array.isArray(oneWayTripFlights)) {
        oneWayTripFlights?.map((flight) => {
          if (Array.isArray(flight?.fareComponentGroupList)) {
            flight?.fareComponentGroupList[0]?.boundList?.availFlightSegmentList?.bookingClassList.map(
              (bookingClass, index) => {
                let flightData = {
                  flightName:
                    flight?.fareComponentGroupList[0]?.boundList
                      ?.availFlightSegmentList?.flightSegment?.airline
                      ?.companyFullName,
                  flightNumber:
                    flight?.fareComponentGroupList[0]?.boundList
                      ?.availFlightSegmentList?.flightSegment?.flightNumber,
                  stops: flight?.fareComponentGroupList.length - 1,
                  flightDuration:
                    flight?.fareComponentGroupList[0]?.boundList?.availFlightSegmentList?.flightSegment?.journeyDuration?.slice(
                      2
                    ),
                  departureCity:
                    flight?.fareComponentGroupList[0]?.boundList
                      ?.availFlightSegmentList?.flightSegment?.departureAirport
                      ?.locationName,
                  departureCityCode:
                    flight?.fareComponentGroupList[0]?.boundList
                      ?.availFlightSegmentList?.flightSegment?.departureAirport
                      ?.locationCode,
                  departureTime: `${
                    getTimeInHours(
                      flight?.fareComponentGroupList[0]?.boundList
                        ?.availFlightSegmentList?.flightSegment
                        ?.departureDateTime
                    ) < 10
                      ? `0${getTimeInHours(
                          flight?.fareComponentGroupList[0]?.boundList
                            ?.availFlightSegmentList?.flightSegment
                            ?.departureDateTime
                        )}`
                      : getTimeInHours(
                          flight?.fareComponentGroupList[0]?.boundList
                            ?.availFlightSegmentList?.flightSegment
                            ?.departureDateTime
                        )
                  }: ${
                    getTimeInMinutes(
                      flight?.fareComponentGroupList[0]?.boundList
                        ?.availFlightSegmentList?.flightSegment
                        ?.departureDateTime
                    ) < 10
                      ? `0${getTimeInMinutes(
                          flight?.fareComponentGroupList[0]?.boundList
                            ?.availFlightSegmentList?.flightSegment
                            ?.departureDateTime
                        )}`
                      : getTimeInMinutes(
                          flight?.fareComponentGroupList[0]?.boundList
                            ?.availFlightSegmentList?.flightSegment
                            ?.departureDateTime
                        )
                  }`,
                  arrivalCity:
                    flight?.fareComponentGroupList[1]?.boundList
                      ?.availFlightSegmentList?.flightSegment?.arrivalAirport
                      ?.locationName,
                  arrivalCityCode:
                    flight?.fareComponentGroupList[1]?.boundList
                      ?.availFlightSegmentList?.flightSegment?.arrivalAirport
                      ?.locationCode,
                  arrivalTime: `${
                    getTimeInHours(
                      flight?.fareComponentGroupList[1]?.boundList
                        ?.availFlightSegmentList?.flightSegment?.arrivalDateTime
                    ) < 10
                      ? `0${getTimeInHours(
                          flight?.fareComponentGroupList[1]?.boundList
                            ?.availFlightSegmentList?.flightSegment
                            ?.arrivalDateTime
                        )}`
                      : getTimeInHours(
                          flight?.fareComponentGroupList[1]?.boundList
                            ?.availFlightSegmentList?.flightSegment
                            ?.arrivalDateTime
                        )
                  }: ${
                    getTimeInMinutes(
                      flight?.fareComponentGroupList[1]?.boundList
                        ?.availFlightSegmentList?.flightSegment?.arrivalDateTime
                    ) < 10
                      ? `0${getTimeInMinutes(
                          flight?.fareComponentGroupList[1]?.boundList
                            ?.availFlightSegmentList?.flightSegment
                            ?.arrivalDateTime
                        )}`
                      : getTimeInMinutes(
                          flight?.fareComponentGroupList[1]?.boundList
                            ?.availFlightSegmentList?.flightSegment
                            ?.arrivalDateTime
                        )
                  }`,

                  cabin: bookingClass?.cabin,
                  resBookDesigCode: bookingClass?.resBookDesigCode,
                  resBookDesigQuantity: bookingClass?.resBookDesigQuantity,
                  totalAmount:
                    flight?.fareComponentGroupList[0]?.fareComponentList[index]
                      ?.pricingOverview?.totalAmount?.value,
                };
              }
            );
          } else {
            const segments = flight?.fareComponentGroupList?.boundList?.availFlightSegmentList;

            // if (
            //   Array.isArray(
            //     flight?.fareComponentGroupList?.boundList
            //       ?.availFlightSegmentList
            //   )
            // ) {
            
if (Array.isArray(segments)) {
  const segment1BookingClass = segments[0]?.bookingClassList?.[0] || {};
  const segment2BookingClass = segments[1]?.bookingClassList?.[0] || {}; // Add this

              flight?.fareComponentGroupList?.boundList?.availFlightSegmentList[0]?.bookingClassList.map(
                (bookingClass, index) => {
                  let baseAmountValue =
                    flight?.fareComponentGroupList?.fareComponentList[index]
                      ?.pricingOverview?.totalAmount?.value;
                  if (
                    flight?.fareComponentGroupList?.fareComponentList[index]
                      ?.pricingOverview?.totalBaseFare?.extraCharges[0]?.value
                  ) {
                    baseAmountValue =
                      Number(baseAmountValue) +
                      Number(
                        flight?.fareComponentGroupList?.fareComponentList[index]
                          ?.pricingOverview?.totalBaseFare?.extraCharges[0]
                          ?.value
                      );
                  }
                  const flightData = {
                    // connectingFlight: true,
                    // flightName:
                    //   flight?.fareComponentGroupList?.boundList
                    //     ?.availFlightSegmentList[0]?.flightSegment?.airline
                    //     ?.companyFullName,
                    // flightNumber:
                    //   flight?.fareComponentGroupList?.boundList
                    //     ?.availFlightSegmentList[0]?.flightSegment
                    //     ?.flightNumber,
                    // flightNumber_RT:
                    //   flight?.fareComponentGroupList?.boundList
                    //     ?.availFlightSegmentList[1]?.flightSegment
                    //     ?.flightNumber ?? null,
                    // stops:
                    //   flight?.fareComponentGroupList?.boundList
                    //     ?.availFlightSegmentList.length - 1,
                    connectingFlight: segments.length > 1,
    flightName: segments[0]?.flightSegment?.airline?.companyFullName,
    flightNumber: segments[0]?.flightSegment?.flightNumber,
    flightNumber_RT: segments[1]?.flightSegment?.flightNumber ?? null,
    stops: segments.length - 1,

                    flightDuration: connectingFlightDuration(
                      flight?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList[0]?.flightSegment
                        ?.departureDateTimeUTC,
                      flight?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList[1]?.flightSegment
                        ?.arrivalDateTimeUTC
                    ),
                    departureCity:
                      flight?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList[0]?.flightSegment
                        ?.departureAirport?.locationName,
                    stopOverCity:
                      flight?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList[0]?.flightSegment
                        ?.arrivalAirport?.locationCode ?? null,
                    departureCityCode:
                      flight?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList[0]?.flightSegment
                        ?.departureAirport?.locationCode,
                    departureTime: `${
                      getTimeInHours(
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList[0]?.flightSegment
                          ?.departureDateTime
                      ) < 10
                        ? `0${getTimeInHours(
                            flight?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList[0]?.flightSegment
                              ?.departureDateTime
                          )}`
                        : getTimeInHours(
                            flight?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList[0]?.flightSegment
                              ?.departureDateTime
                          )
                    }: ${
                      getTimeInMinutes(
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList[0]?.flightSegment
                          ?.departureDateTime
                      ) < 10
                        ? `0${getTimeInMinutes(
                            flight?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList[0]?.flightSegment
                              ?.departureDateTime
                          )}`
                        : getTimeInMinutes(
                            flight?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList[0]?.flightSegment
                              ?.departureDateTime
                          )
                    }`,
                    arrivalCity:
                      flight?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList[1]?.flightSegment
                        ?.arrivalAirport?.locationName,
                    arrivalCityCode:
                      flight?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList[1]?.flightSegment
                        ?.arrivalAirport?.locationCode,
                    arrivalTime: `${
                      getTimeInHours(
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList[1]?.flightSegment
                          ?.arrivalDateTime
                      ) < 10
                        ? `0${getTimeInHours(
                            flight?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList[1]?.flightSegment
                              ?.arrivalDateTime
                          )}`
                        : getTimeInHours(
                            flight?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList[1]?.flightSegment
                              ?.arrivalDateTime
                          )
                    }: ${
                      getTimeInMinutes(
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList[1]?.flightSegment
                          ?.arrivalDateTime
                      ) < 10
                        ? `0${getTimeInMinutes(
                            flight?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList[1]?.flightSegment
                              ?.arrivalDateTime
                          )}`
                        : getTimeInMinutes(
                            flight?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList[1]?.flightSegment
                              ?.arrivalDateTime
                          )
                    }`,

                    // cabin: bookingClass?.cabin,
                    // resBookDesigCode: bookingClass?.resBookDesigCode,
                    // resBookDesigQuantity: bookingClass?.resBookDesigQuantity,
                    // resBookDesigStatusCode:
                    //   bookingClass?.resBookDesigStatusCode,
                    // cabin_Connecting: bookingClass?.cabin,
                    // resBookDesigCode_Connecting: bookingClass?.resBookDesigCode,
                    // resBookDesigQuantity_Connecting:
                    //   bookingClass?.resBookDesigQuantity,
                    // resBookDesigStatusCode_Connecting:
                    //   bookingClass?.resBookDesigStatusCode,
                    // baseAmount: baseAmountValue,
                    // totalAmount: baseAmountValue,
                    // currencyCode:
                    //   flight?.fareComponentGroupList?.fareComponentList[index]
                    //     ?.pricingOverview?.totalAmount?.currency?.code,
                    // passengerFareInfoList:
                    //   flight?.fareComponentGroupList?.fareComponentList[index]
                    //     ?.passengerFareInfoList,
                    // flightSegment: {
                    //   ...flight?.fareComponentGroupList?.boundList
                    //     ?.availFlightSegmentList[0]?.flightSegment,
                    //   arrivalDateTime:
                    //     flight?.fareComponentGroupList?.boundList
                    //       ?.availFlightSegmentList[1]?.flightSegment
                    //       ?.arrivalDateTime,
                    // },
                    // flightSegment_Connecting: {
                    //   ...flight?.fareComponentGroupList?.boundList
                    //     ?.availFlightSegmentList[1]?.flightSegment,

                    // Booking class for each segment
    cabin: segment1BookingClass?.cabin,
    resBookDesigCode: segment1BookingClass?.resBookDesigCode,
    resBookDesigQuantity: segment1BookingClass?.resBookDesigQuantity,
    resBookDesigStatusCode: segment1BookingClass?.resBookDesigStatusCode,

    cabin_Connecting: segment2BookingClass?.cabin,
    resBookDesigCode_Connecting: segment2BookingClass?.resBookDesigCode,
    resBookDesigQuantity_Connecting: segment2BookingClass?.resBookDesigQuantity,
    resBookDesigStatusCode_Connecting: segment2BookingClass?.resBookDesigStatusCode,

    baseAmount: baseAmountValue,
    totalAmount: baseAmountValue,
    currencyCode:
      flight?.fareComponentGroupList?.fareComponentList?.[0]?.pricingOverview
        ?.totalAmount?.currency?.code,

    passengerFareInfoList:
      flight?.fareComponentGroupList?.fareComponentList?.[0]?.passengerFareInfoList,

    flightSegment: {
      ...segments[0]?.flightSegment,
      arrivalDateTime: segments[1]?.flightSegment?.arrivalDateTime,
    },
    flightSegment_Connecting: {
      ...segments[1]?.flightSegment,
                    },
                  };
                  
                  oneWayFlightsData.push(flightData);
                }
              );
            } else {
              flight?.fareComponentGroupList?.boundList?.availFlightSegmentList?.bookingClassList.map(
                (bookingClass, index) => {
                  let baseAmountValue =
                    flight?.fareComponentGroupList?.fareComponentList[index]
                      ?.pricingOverview?.totalAmount?.value;
                  if (
                    flight?.fareComponentGroupList?.fareComponentList[index]
                      ?.pricingOverview?.totalBaseFare?.extraCharges[0]?.value
                  ) {
                    baseAmountValue =
                      Number(baseAmountValue) +
                      Number(
                        flight?.fareComponentGroupList?.fareComponentList[index]
                          ?.pricingOverview?.totalBaseFare?.extraCharges[0]
                          ?.value
                      );
                  }
                  let flightData = {
                    flightName:
                      flight?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList?.flightSegment?.airline
                        ?.companyFullName,
                    flightNumber:
                      flight?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList?.flightSegment?.flightNumber,
                    stops:
                      flight?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList?.flightSegment?.stopQuantity,
                    flightDuration:
                      flight?.fareComponentGroupList?.boundList?.availFlightSegmentList?.flightSegment?.journeyDuration?.slice(
                        2
                      ),
                    departureCity:
                      flight?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList?.flightSegment
                        ?.departureAirport?.locationName,
                    departureCityCode:
                      flight?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList?.flightSegment
                        ?.departureAirport?.locationCode,
                    departureTime: `${
                      getTimeInHours(
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.departureDateTime
                      ) < 10
                        ? `0${getTimeInHours(
                            flight?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.departureDateTime
                          )}`
                        : getTimeInHours(
                            flight?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.departureDateTime
                          )
                    }: ${
                      getTimeInMinutes(
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.departureDateTime
                      ) < 10
                        ? `0${getTimeInMinutes(
                            flight?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.departureDateTime
                          )}`
                        : getTimeInMinutes(
                            flight?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.departureDateTime
                          )
                    }`,
                    arrivalCity:
                      flight?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList?.flightSegment?.arrivalAirport
                        ?.locationName,
                    arrivalCityCode:
                      flight?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList?.flightSegment?.arrivalAirport
                        ?.locationCode,
                    arrivalTime: `${
                      getTimeInHours(
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.arrivalDateTime
                      ) < 10
                        ? `0${getTimeInHours(
                            flight?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.arrivalDateTime
                          )}`
                        : getTimeInHours(
                            flight?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.arrivalDateTime
                          )
                    }: ${
                      getTimeInMinutes(
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.arrivalDateTime
                      ) < 10
                        ? `0${getTimeInMinutes(
                            flight?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.arrivalDateTime
                          )}`
                        : getTimeInMinutes(
                            flight?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.arrivalDateTime
                          )
                    }`,

                    cabin: bookingClass?.cabin,
                    resBookDesigCode: bookingClass?.resBookDesigCode,
                    resBookDesigQuantity: bookingClass?.resBookDesigQuantity,
                    resBookDesigStatusCode:
                      bookingClass?.resBookDesigStatusCode,
                    baseAmount: baseAmountValue,
                    totalAmount: baseAmountValue,
                    currencyCode:
                      flight?.fareComponentGroupList?.fareComponentList[index]
                        ?.pricingOverview?.totalAmount?.currency?.code,
                    passengerFareInfoList:
                      flight?.fareComponentGroupList?.fareComponentList[index]
                        ?.passengerFareInfoList,
                    flightSegment:
                      flight?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList?.flightSegment,
                  };
                  oneWayFlightsData.push(flightData);
                }
              );
            }
          }
        });
      } else {
        if (Object.keys(oneWayTripFlights)?.length > 0) {
          if (
            Array.isArray(
              oneWayTripFlights?.fareComponentGroupList?.boundList
                ?.availFlightSegmentList
            )
          ) {
            oneWayTripFlights?.fareComponentGroupList?.boundList?.availFlightSegmentList[0]?.bookingClassList.map(
              (bookingClass, index) => {
                let baseAmountValue =
                  oneWayTripFlights?.fareComponentGroupList?.fareComponentList[
                    index
                  ]?.pricingOverview?.totalAmount?.value;
                if (
                  oneWayTripFlights?.fareComponentGroupList?.fareComponentList[
                    index
                  ]?.pricingOverview?.totalBaseFare?.extraCharges[0]?.value
                ) {
                  baseAmountValue =
                    Number(baseAmountValue) +
                    Number(
                      oneWayTripFlights?.fareComponentGroupList
                        ?.fareComponentList[index]?.pricingOverview
                        ?.totalBaseFare?.extraCharges[0]?.value
                    );
                }
                let flightData = {
                  connectingFlight: true,
                  flightName:
                    oneWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList[0]?.flightSegment?.airline
                      ?.companyFullName,
                  flightNumber:
                    oneWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList[0]?.flightSegment?.flightNumber,
                  flightNumber_RT:
                    oneWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList[1]?.flightSegment
                      ?.flightNumber ?? null,
                  stops:
                    oneWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList.length - 1,

                  flightDuration: connectingFlightDuration(
                    oneWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList[0]?.flightSegment
                      ?.departureDateTimeUTC,
                    oneWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList[1]?.flightSegment
                      ?.arrivalDateTimeUTC
                  ),
                  departureCity:
                    oneWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList[0]?.flightSegment
                      ?.departureAirport?.locationName,
                  stopOverCity:
                    oneWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList[0]?.flightSegment?.arrivalAirport
                      ?.locationCode ?? null,
                  departureCityCode:
                    oneWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList[0]?.flightSegment
                      ?.departureAirport?.locationCode,
                  departureTime: `${
                    getTimeInHours(
                      oneWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList[0]?.flightSegment
                        ?.departureDateTime
                    ) < 10
                      ? `0${getTimeInHours(
                          oneWayTripFlights?.fareComponentGroupList?.boundList
                            ?.availFlightSegmentList[0]?.flightSegment
                            ?.departureDateTime
                        )}`
                      : getTimeInHours(
                          oneWayTripFlights?.fareComponentGroupList?.boundList
                            ?.availFlightSegmentList[0]?.flightSegment
                            ?.departureDateTime
                        )
                  }: ${
                    getTimeInMinutes(
                      oneWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList[0]?.flightSegment
                        ?.departureDateTime
                    ) < 10
                      ? `0${getTimeInMinutes(
                          oneWayTripFlights?.fareComponentGroupList?.boundList
                            ?.availFlightSegmentList[0]?.flightSegment
                            ?.departureDateTime
                        )}`
                      : getTimeInMinutes(
                          oneWayTripFlights?.fareComponentGroupList?.boundList
                            ?.availFlightSegmentList[0]?.flightSegment
                            ?.departureDateTime
                        )
                  }`,
                  arrivalCity:
                    oneWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList[1]?.flightSegment?.arrivalAirport
                      ?.locationName,
                  arrivalCityCode:
                    oneWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList[1]?.flightSegment?.arrivalAirport
                      ?.locationCode,
                  arrivalTime: `${
                    getTimeInHours(
                      oneWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList[1]?.flightSegment
                        ?.arrivalDateTime
                    ) < 10
                      ? `0${getTimeInHours(
                          oneWayTripFlights?.fareComponentGroupList?.boundList
                            ?.availFlightSegmentList[1]?.flightSegment
                            ?.arrivalDateTime
                        )}`
                      : getTimeInHours(
                          oneWayTripFlights?.fareComponentGroupList?.boundList
                            ?.availFlightSegmentList[1]?.flightSegment
                            ?.arrivalDateTime
                        )
                  }: ${
                    getTimeInMinutes(
                      oneWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList[1]?.flightSegment
                        ?.arrivalDateTime
                    ) < 10
                      ? `0${getTimeInMinutes(
                          oneWayTripFlights?.fareComponentGroupList?.boundList
                            ?.availFlightSegmentList[1]?.flightSegment
                            ?.arrivalDateTime
                        )}`
                      : getTimeInMinutes(
                          oneWayTripFlights?.fareComponentGroupList?.boundList
                            ?.availFlightSegmentList[1]?.flightSegment
                            ?.arrivalDateTime
                        )
                  }`,

                  cabin: bookingClass?.cabin,
                  resBookDesigCode: bookingClass?.resBookDesigCode,
                  resBookDesigQuantity: bookingClass?.resBookDesigQuantity,
                  resBookDesigStatusCode: bookingClass?.resBookDesigStatusCode,
                  cabin_Connecting: bookingClass?.cabin,
                  resBookDesigCode_Connecting: bookingClass?.resBookDesigCode,
                  resBookDesigQuantity_Connecting:
                    bookingClass?.resBookDesigQuantity,
                  resBookDesigStatusCode_Connecting:
                    bookingClass?.resBookDesigStatusCode,
                  baseAmount: baseAmountValue,
                  totalAmount: baseAmountValue,
                  currencyCode:
                    oneWayTripFlights?.fareComponentGroupList
                      ?.fareComponentList[index]?.pricingOverview?.totalAmount
                      ?.currency?.code,
                  passengerFareInfoList:
                    oneWayTripFlights?.fareComponentGroupList
                      ?.fareComponentList[index]?.passengerFareInfoList,
                  flightSegment: {
                    ...oneWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList[0]?.flightSegment,
                    arrivalDateTime:
                      oneWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList[1]?.flightSegment
                        ?.arrivalDateTime,
                  },
                  flightSegment_Connecting: {
                    ...oneWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList[1]?.flightSegment,
                  },
                };

                oneWayFlightsData.push(flightData);
              }
            );
          } else {
            if (
              Array.isArray(
                oneWayTripFlights?.fareComponentGroupList?.boundList
                  ?.availFlightSegmentList?.bookingClassList
              )
            ) {
              oneWayTripFlights?.fareComponentGroupList?.boundList?.availFlightSegmentList?.bookingClassList.map(
                (bookingClass, index) => {
                  let baseAmountValue =
                    oneWayTripFlights?.fareComponentGroupList
                      ?.fareComponentList[index]?.pricingOverview?.totalAmount
                      ?.value;
                  if (
                    oneWayTripFlights?.fareComponentGroupList
                      ?.fareComponentList[index]?.pricingOverview?.totalBaseFare
                      ?.extraCharges[0]?.value
                  ) {
                    baseAmountValue =
                      Number(baseAmountValue) +
                      Number(
                        oneWayTripFlights?.fareComponentGroupList
                          ?.fareComponentList[index]?.pricingOverview
                          ?.totalBaseFare?.extraCharges[0]?.value
                      );
                  }
                  let flightData = {
                    flightName:
                      oneWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList?.flightSegment?.airline
                        ?.companyFullName,
                    flightNumber:
                      oneWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList?.flightSegment?.flightNumber,
                    stops:
                      oneWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList?.flightSegment?.stopQuantity,
                    flightDuration:
                      oneWayTripFlights?.fareComponentGroupList?.boundList?.availFlightSegmentList?.flightSegment?.journeyDuration?.slice(
                        2
                      ),
                    departureCity:
                      oneWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList?.flightSegment
                        ?.departureAirport?.locationName,
                    departureCityCode:
                      oneWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList?.flightSegment
                        ?.departureAirport?.locationCode,

                    departureTime: `${
                      getTimeInHours(
                        oneWayTripFlights?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.departureDateTime
                      ) < 10
                        ? `0${getTimeInHours(
                            oneWayTripFlights?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.departureDateTime
                          )}`
                        : getTimeInHours(
                            oneWayTripFlights?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.departureDateTime
                          )
                    }: ${
                      getTimeInMinutes(
                        oneWayTripFlights?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.departureDateTime
                      ) < 10
                        ? `0${getTimeInMinutes(
                            oneWayTripFlights?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.departureDateTime
                          )}`
                        : getTimeInMinutes(
                            oneWayTripFlights?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.departureDateTime
                          )
                    }`,
                    arrivalCity:
                      oneWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList?.flightSegment?.arrivalAirport
                        ?.locationName,
                    arrivalCityCode:
                      oneWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList?.flightSegment?.arrivalAirport
                        ?.locationCode,
                    arrivalTime: `${
                      getTimeInHours(
                        oneWayTripFlights?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.arrivalDateTime
                      ) < 10
                        ? `0${getTimeInHours(
                            oneWayTripFlights?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.arrivalDateTime
                          )}`
                        : getTimeInHours(
                            oneWayTripFlights?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.arrivalDateTime
                          )
                    }: ${
                      getTimeInMinutes(
                        oneWayTripFlights?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.arrivalDateTime
                      ) < 10
                        ? `0${getTimeInMinutes(
                            oneWayTripFlights?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.arrivalDateTime
                          )}`
                        : getTimeInMinutes(
                            oneWayTripFlights?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.arrivalDateTime
                          )
                    }`,

                    cabin: bookingClass?.cabin,
                    resBookDesigCode: bookingClass?.resBookDesigCode,
                    resBookDesigQuantity: bookingClass?.resBookDesigQuantity,
                    resBookDesigStatusCode:
                      bookingClass?.resBookDesigStatusCode,
                    baseAmount: baseAmountValue,
                    totalAmount: baseAmountValue,
                    currencyCode:
                      oneWayTripFlights?.fareComponentGroupList
                        ?.fareComponentList[index]?.pricingOverview?.totalAmount
                        ?.currency?.code,
                    passengerFareInfoList:
                      oneWayTripFlights?.fareComponentGroupList
                        ?.fareComponentList[index]?.passengerFareInfoList,
                    flightSegment:
                      oneWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList?.flightSegment,
                  };
                  oneWayFlightsData.push(flightData);
                }
              );
            } else {
              let baseAmountValue =
                oneWayTripFlights?.fareComponentGroupList?.fareComponentList
                  ?.pricingOverview?.totalAmount?.value;
              if (
                oneWayTripFlights?.fareComponentGroupList?.fareComponentList
                  ?.pricingOverview?.totalBaseFare?.extraCharges[0]?.value
              ) {
                baseAmountValue =
                  Number(baseAmountValue) +
                  Number(
                    oneWayTripFlights?.fareComponentGroupList?.fareComponentList
                      ?.pricingOverview?.totalBaseFare?.extraCharges[0]?.value
                  );
              }
              let flightData = {
                flightName:
                  oneWayTripFlights?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList?.flightSegment?.airline
                    ?.companyFullName,
                flightNumber:
                  oneWayTripFlights?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList?.flightSegment?.flightNumber,
                stops:
                  oneWayTripFlights?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList?.flightSegment?.stopQuantity,
                flightDuration:
                  oneWayTripFlights?.fareComponentGroupList?.boundList?.availFlightSegmentList?.flightSegment?.journeyDuration?.slice(
                    2
                  ),
                departureCity:
                  oneWayTripFlights?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList?.flightSegment?.departureAirport
                    ?.locationName,
                departureCityCode:
                  oneWayTripFlights?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList?.flightSegment?.departureAirport
                    ?.locationCode,

                departureTime: `${
                  getTimeInHours(
                    oneWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList?.flightSegment?.departureDateTime
                  ) < 10
                    ? `0${getTimeInHours(
                        oneWayTripFlights?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.departureDateTime
                      )}`
                    : getTimeInHours(
                        oneWayTripFlights?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.departureDateTime
                      )
                }: ${
                  getTimeInMinutes(
                    oneWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList?.flightSegment?.departureDateTime
                  ) < 10
                    ? `0${getTimeInMinutes(
                        oneWayTripFlights?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.departureDateTime
                      )}`
                    : getTimeInMinutes(
                        oneWayTripFlights?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.departureDateTime
                      )
                }`,
                arrivalCity:
                  oneWayTripFlights?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList?.flightSegment?.arrivalAirport
                    ?.locationName,
                arrivalCityCode:
                  oneWayTripFlights?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList?.flightSegment?.arrivalAirport
                    ?.locationCode,
                arrivalTime: `${
                  getTimeInHours(
                    oneWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList?.flightSegment?.arrivalDateTime
                  ) < 10
                    ? `0${getTimeInHours(
                        oneWayTripFlights?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.arrivalDateTime
                      )}`
                    : getTimeInHours(
                        oneWayTripFlights?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.arrivalDateTime
                      )
                }: ${
                  getTimeInMinutes(
                    oneWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList?.flightSegment?.arrivalDateTime
                  ) < 10
                    ? `0${getTimeInMinutes(
                        oneWayTripFlights?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.arrivalDateTime
                      )}`
                    : getTimeInMinutes(
                        oneWayTripFlights?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.arrivalDateTime
                      )
                }`,

                cabin:
                  oneWayTripFlights?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList?.bookingClassList?.cabin,
                resBookDesigCode:
                  oneWayTripFlights?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList?.bookingClassList
                    ?.resBookDesigCode,
                resBookDesigQuantity:
                  oneWayTripFlights?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList?.bookingClassList
                    ?.resBookDesigQuantity,
                resBookDesigStatusCode:
                  oneWayTripFlights?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList?.bookingClassList
                    ?.resBookDesigStatusCode,
                baseAmount: baseAmountValue,
                totalAmount: baseAmountValue,
                currencyCode:
                  oneWayTripFlights?.fareComponentGroupList?.fareComponentList
                    ?.pricingOverview?.totalAmount?.currency?.code,
                passengerFareInfoList:
                  oneWayTripFlights?.fareComponentGroupList?.fareComponentList
                    ?.passengerFareInfoList,
                flightSegment:
                  oneWayTripFlights?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList?.flightSegment,
              };
              oneWayFlightsData.push(flightData);
            }
          }
        }
      }
      flightClassListData.push(oneWayFlightsData.reverse());

      if (searchResultList.tripType === "ROUND_TRIP") {
        const twoWayFlightsData = [];
        const twoWayTripFlights =
          searchResultList?.data?.availabilityResultList
            ?.availabilityRouteList[1]?.availabilityByDateList
            ?.originDestinationOptionList;

        if (Array.isArray(twoWayTripFlights)) {
          twoWayTripFlights?.map((flight) => {
            if (Array.isArray(flight?.fareComponentGroupList)) {
              flight?.fareComponentGroupList[0]?.boundList?.availFlightSegmentList?.bookingClassList.map(
                (bookingClass, index) => {
                  let flightData = {
                    flightName:
                      flight?.fareComponentGroupList[0]?.boundList
                        ?.availFlightSegmentList?.flightSegment?.airline
                        ?.companyFullName,
                    flightNumber:
                      flight?.fareComponentGroupList[0]?.boundList
                        ?.availFlightSegmentList?.flightSegment?.flightNumber,
                    stops: flight?.fareComponentGroupList.length - 1,
                    flightDuration:
                      flight?.fareComponentGroupList[0]?.boundList?.availFlightSegmentList?.flightSegment?.journeyDuration?.slice(
                        2
                      ),
                    departureCity:
                      flight?.fareComponentGroupList[0]?.boundList
                        ?.availFlightSegmentList?.flightSegment
                        ?.departureAirport?.locationName,
                    departureCityCode:
                      flight?.fareComponentGroupList[0]?.boundList
                        ?.availFlightSegmentList?.flightSegment
                        ?.departureAirport?.locationCode,

                    departureTime: `${
                      getTimeInHours(
                        flight?.fareComponentGroupList[0]?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.departureDateTime
                      ) < 10
                        ? `0${getTimeInHours(
                            flight?.fareComponentGroupList[0]?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.departureDateTime
                          )}`
                        : getTimeInHours(
                            flight?.fareComponentGroupList[0]?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.departureDateTime
                          )
                    }: ${
                      getTimeInMinutes(
                        flight?.fareComponentGroupList[0]?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.departureDateTime
                      ) < 10
                        ? `0${getTimeInMinutes(
                            flight?.fareComponentGroupList[0]?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.departureDateTime
                          )}`
                        : getTimeInMinutes(
                            flight?.fareComponentGroupList[0]?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.departureDateTime
                          )
                    }`,

                    arrivalCity:
                      flight?.fareComponentGroupList[1]?.boundList
                        ?.availFlightSegmentList?.flightSegment?.arrivalAirport
                        ?.locationName,
                    arrivalCityCode:
                      flight?.fareComponentGroupList[1]?.boundList
                        ?.availFlightSegmentList?.flightSegment?.arrivalAirport
                        ?.locationCode,
                    arrivalTime: `${
                      getTimeInHours(
                        flight?.fareComponentGroupList[1]?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.arrivalDateTime
                      ) < 10
                        ? `0${getTimeInHours(
                            flight?.fareComponentGroupList[1]?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.arrivalDateTime
                          )}`
                        : getTimeInHours(
                            flight?.fareComponentGroupList[1]?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.arrivalDateTime
                          )
                    }: ${
                      getTimeInMinutes(
                        flight?.fareComponentGroupList[1]?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.arrivalDateTime
                      ) < 10
                        ? `0${getTimeInMinutes(
                            flight?.fareComponentGroupList[1]?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.arrivalDateTime
                          )}`
                        : getTimeInMinutes(
                            flight?.fareComponentGroupList[1]?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.arrivalDateTime
                          )
                    }`,

                    cabin: bookingClass?.cabin,
                    resBookDesigCode: bookingClass?.resBookDesigCode,
                    resBookDesigQuantity: bookingClass?.resBookDesigQuantity,
                    totalAmount:
                      flight?.fareComponentGroupList[0]?.fareComponentList[
                        index
                      ]?.pricingOverview?.totalAmount?.value,
                  };
                }
              );
            } else {
              if (
                Array.isArray(
                  flight?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList
                )
              ) {
                flight?.fareComponentGroupList?.boundList?.availFlightSegmentList[0]?.bookingClassList.map(
                  (bookingClass, index) => {
                    let baseAmountValue =
                      flight?.fareComponentGroupList?.fareComponentList[index]
                        ?.pricingOverview?.totalAmount?.value;
                    if (
                      flight?.fareComponentGroupList?.fareComponentList[index]
                        ?.pricingOverview?.totalBaseFare?.extraCharges[0]?.value
                    ) {
                      baseAmountValue =
                        Number(baseAmountValue) +
                        Number(
                          flight?.fareComponentGroupList?.fareComponentList[
                            index
                          ]?.pricingOverview?.totalBaseFare?.extraCharges[0]
                            ?.value
                        );
                    }
                    let flightData = {
                      connectingFlight: true,
                      flightName:
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList[0]?.flightSegment?.airline
                          ?.companyFullName,
                      flightNumber:
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList[0]?.flightSegment
                          ?.flightNumber,
                      flightNumber_RT:
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList[1]?.flightSegment
                          ?.flightNumber ?? null,
                      stops:
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList.length - 1,

                      flightDuration: connectingFlightDuration(
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList[0]?.flightSegment
                          ?.departureDateTimeUTC,
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList[1]?.flightSegment
                          ?.arrivalDateTimeUTC
                      ),
                      departureCity:
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList[0]?.flightSegment
                          ?.departureAirport?.locationName,
                      stopOverCity:
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList[0]?.flightSegment
                          ?.arrivalAirport?.locationCode ?? null,
                      departureCityCode:
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList[0]?.flightSegment
                          ?.departureAirport?.locationCode,
                      departureTime: `${
                        getTimeInHours(
                          flight?.fareComponentGroupList?.boundList
                            ?.availFlightSegmentList[0]?.flightSegment
                            ?.departureDateTime
                        ) < 10
                          ? `0${getTimeInHours(
                              flight?.fareComponentGroupList?.boundList
                                ?.availFlightSegmentList[0]?.flightSegment
                                ?.departureDateTime
                            )}`
                          : getTimeInHours(
                              flight?.fareComponentGroupList?.boundList
                                ?.availFlightSegmentList[0]?.flightSegment
                                ?.departureDateTime
                            )
                      }: ${
                        getTimeInMinutes(
                          flight?.fareComponentGroupList?.boundList
                            ?.availFlightSegmentList[0]?.flightSegment
                            ?.departureDateTime
                        ) < 10
                          ? `0${getTimeInMinutes(
                              flight?.fareComponentGroupList?.boundList
                                ?.availFlightSegmentList[0]?.flightSegment
                                ?.departureDateTime
                            )}`
                          : getTimeInMinutes(
                              flight?.fareComponentGroupList?.boundList
                                ?.availFlightSegmentList[0]?.flightSegment
                                ?.departureDateTime
                            )
                      }`,
                      arrivalCity:
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList[1]?.flightSegment
                          ?.arrivalAirport?.locationName,
                      arrivalCityCode:
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList[1]?.flightSegment
                          ?.arrivalAirport?.locationCode,
                      arrivalTime: `${
                        getTimeInHours(
                          flight?.fareComponentGroupList?.boundList
                            ?.availFlightSegmentList[1]?.flightSegment
                            ?.arrivalDateTime
                        ) < 10
                          ? `0${getTimeInHours(
                              flight?.fareComponentGroupList?.boundList
                                ?.availFlightSegmentList[1]?.flightSegment
                                ?.arrivalDateTime
                            )}`
                          : getTimeInHours(
                              flight?.fareComponentGroupList?.boundList
                                ?.availFlightSegmentList[1]?.flightSegment
                                ?.arrivalDateTime
                            )
                      }: ${
                        getTimeInMinutes(
                          flight?.fareComponentGroupList?.boundList
                            ?.availFlightSegmentList[1]?.flightSegment
                            ?.arrivalDateTime
                        ) < 10
                          ? `0${getTimeInMinutes(
                              flight?.fareComponentGroupList?.boundList
                                ?.availFlightSegmentList[1]?.flightSegment
                                ?.arrivalDateTime
                            )}`
                          : getTimeInMinutes(
                              flight?.fareComponentGroupList?.boundList
                                ?.availFlightSegmentList[1]?.flightSegment
                                ?.arrivalDateTime
                            )
                      }`,
                      cabin: bookingClass?.cabin,
                      resBookDesigCode: bookingClass?.resBookDesigCode,
                      resBookDesigQuantity: bookingClass?.resBookDesigQuantity,
                      resBookDesigStatusCode:
                        bookingClass?.resBookDesigStatusCode,
                      cabin_Connecting: bookingClass?.cabin,
                      resBookDesigCode_Connecting:
                        bookingClass?.resBookDesigCode,
                      resBookDesigQuantity_Connecting:
                        bookingClass?.resBookDesigQuantity,
                      resBookDesigStatusCode_Connecting:
                        bookingClass?.resBookDesigStatusCode,
                      baseAmount: baseAmountValue,
                      totalAmount: baseAmountValue,
                      currencyCode:
                        flight?.fareComponentGroupList?.fareComponentList[index]
                          ?.pricingOverview?.totalAmount?.currency?.code,
                      passengerFareInfoList:
                        flight?.fareComponentGroupList?.fareComponentList[index]
                          ?.passengerFareInfoList,
                      flightSegment: {
                        ...flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList[0]?.flightSegment,
                      },
                      flightSegment_Connecting: {
                        ...flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList[1]?.flightSegment,
                      },
                    };

                    twoWayFlightsData.push(flightData);
                  }
                );
              } else {
                flight?.fareComponentGroupList?.boundList?.availFlightSegmentList?.bookingClassList.map(
                  (bookingClass, index) => {
                    let baseAmountValue =
                      flight?.fareComponentGroupList?.fareComponentList[index]
                        ?.pricingOverview?.totalAmount?.value;
                    if (
                      flight?.fareComponentGroupList?.fareComponentList[index]
                        ?.pricingOverview?.totalBaseFare?.extraCharges[0]?.value
                    ) {
                      baseAmountValue =
                        Number(baseAmountValue) +
                        Number(
                          flight?.fareComponentGroupList?.fareComponentList[
                            index
                          ]?.pricingOverview?.totalBaseFare?.extraCharges[0]
                            ?.value
                        );
                    }
                    let flightData = {
                      flightName:
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment?.airline
                          ?.companyFullName,
                      flightNumber:
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment?.flightNumber,
                      stops:
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment?.stopQuantity,
                      flightDuration:
                        flight?.fareComponentGroupList?.boundList?.availFlightSegmentList?.flightSegment?.journeyDuration?.slice(
                          2
                        ),
                      departureCity:
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.departureAirport?.locationName,
                      departureCityCode:
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.departureAirport?.locationCode,

                      departureTime: `${
                        getTimeInHours(
                          flight?.fareComponentGroupList?.boundList
                            ?.availFlightSegmentList?.flightSegment
                            ?.departureDateTime
                        ) < 10
                          ? `0${getTimeInHours(
                              flight?.fareComponentGroupList?.boundList
                                ?.availFlightSegmentList?.flightSegment
                                ?.departureDateTime
                            )}`
                          : getTimeInHours(
                              flight?.fareComponentGroupList?.boundList
                                ?.availFlightSegmentList?.flightSegment
                                ?.departureDateTime
                            )
                      }: ${
                        getTimeInMinutes(
                          flight?.fareComponentGroupList?.boundList
                            ?.availFlightSegmentList?.flightSegment
                            ?.departureDateTime
                        ) < 10
                          ? `0${getTimeInMinutes(
                              flight?.fareComponentGroupList?.boundList
                                ?.availFlightSegmentList?.flightSegment
                                ?.departureDateTime
                            )}`
                          : getTimeInMinutes(
                              flight?.fareComponentGroupList?.boundList
                                ?.availFlightSegmentList?.flightSegment
                                ?.departureDateTime
                            )
                      }`,

                      arrivalCity:
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.arrivalAirport?.locationName,
                      arrivalCityCode:
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.arrivalAirport?.locationCode,
                      arrivalTime: `${
                        getTimeInHours(
                          flight?.fareComponentGroupList?.boundList
                            ?.availFlightSegmentList?.flightSegment
                            ?.arrivalDateTime
                        ) < 10
                          ? `0${getTimeInHours(
                              flight?.fareComponentGroupList?.boundList
                                ?.availFlightSegmentList?.flightSegment
                                ?.arrivalDateTime
                            )}`
                          : getTimeInHours(
                              flight?.fareComponentGroupList?.boundList
                                ?.availFlightSegmentList?.flightSegment
                                ?.arrivalDateTime
                            )
                      }: ${
                        getTimeInMinutes(
                          flight?.fareComponentGroupList?.boundList
                            ?.availFlightSegmentList?.flightSegment
                            ?.arrivalDateTime
                        ) < 10
                          ? `0${getTimeInMinutes(
                              flight?.fareComponentGroupList?.boundList
                                ?.availFlightSegmentList?.flightSegment
                                ?.arrivalDateTime
                            )}`
                          : getTimeInMinutes(
                              flight?.fareComponentGroupList?.boundList
                                ?.availFlightSegmentList?.flightSegment
                                ?.arrivalDateTime
                            )
                      }`,

                      cabin: bookingClass?.cabin,
                      resBookDesigCode: bookingClass?.resBookDesigCode,
                      resBookDesigQuantity: bookingClass?.resBookDesigQuantity,
                      resBookDesigStatusCode:
                        bookingClass?.resBookDesigStatusCode,
                      baseAmount: baseAmountValue,
                      totalAmount: baseAmountValue,
                      currencyCode:
                        flight?.fareComponentGroupList?.fareComponentList[index]
                          ?.pricingOverview?.totalAmount?.currency?.code,
                      passengerFareInfoList:
                        flight?.fareComponentGroupList?.fareComponentList[index]
                          ?.passengerFareInfoList,
                      flightSegment:
                        flight?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment,
                    };
                    twoWayFlightsData.push(flightData);
                  }
                );
              }
            }
          });
        } else {
          if (
            Array.isArray(
              twoWayTripFlights?.fareComponentGroupList?.boundList
                ?.availFlightSegmentList
            )
          ) {
            twoWayTripFlights?.fareComponentGroupList?.boundList?.availFlightSegmentList[0]?.bookingClassList.map(
              (bookingClass, index) => {
                let baseAmountValue =
                  twoWayTripFlights?.fareComponentGroupList?.fareComponentList[
                    index
                  ]?.pricingOverview?.totalAmount?.value;
                if (
                  twoWayTripFlights?.fareComponentGroupList?.fareComponentList[
                    index
                  ]?.pricingOverview?.totalBaseFare?.extraCharges[0]?.value
                ) {
                  baseAmountValue =
                    Number(baseAmountValue) +
                    Number(
                      twoWayTripFlights?.fareComponentGroupList
                        ?.fareComponentList[index]?.pricingOverview
                        ?.totalBaseFare?.extraCharges[0]?.value
                    );
                }
                let flightData = {
                  connectingFlight: true,
                  flightName:
                    twoWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList[0]?.flightSegment?.airline
                      ?.companyFullName,
                  flightNumber:
                    twoWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList[0]?.flightSegment?.flightNumber,
                  flightNumber_RT:
                    twoWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList[1]?.flightSegment
                      ?.flightNumber ?? null,
                  stops:
                    twoWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList.length - 1,

                  flightDuration: connectingFlightDuration(
                    twoWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList[0]?.flightSegment
                      ?.departureDateTimeUTC,
                    twoWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList[1]?.flightSegment
                      ?.arrivalDateTimeUTC
                  ),
                  departureCity:
                    twoWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList[0]?.flightSegment
                      ?.departureAirport?.locationName,
                  stopOverCity:
                    twoWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList[0]?.flightSegment?.arrivalAirport
                      ?.locationCode ?? null,
                  departureCityCode:
                    twoWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList[0]?.flightSegment
                      ?.departureAirport?.locationCode,
                  departureTime: `${
                    getTimeInHours(
                      twoWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList[0]?.flightSegment
                        ?.departureDateTime
                    ) < 10
                      ? `0${getTimeInHours(
                          twoWayTripFlights?.fareComponentGroupList?.boundList
                            ?.availFlightSegmentList[0]?.flightSegment
                            ?.departureDateTime
                        )}`
                      : getTimeInHours(
                          twoWayTripFlights?.fareComponentGroupList?.boundList
                            ?.availFlightSegmentList[0]?.flightSegment
                            ?.departureDateTime
                        )
                  }: ${
                    getTimeInMinutes(
                      twoWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList[0]?.flightSegment
                        ?.departureDateTime
                    ) < 10
                      ? `0${getTimeInMinutes(
                          twoWayTripFlights?.fareComponentGroupList?.boundList
                            ?.availFlightSegmentList[0]?.flightSegment
                            ?.departureDateTime
                        )}`
                      : getTimeInMinutes(
                          twoWayTripFlights?.fareComponentGroupList?.boundList
                            ?.availFlightSegmentList[0]?.flightSegment
                            ?.departureDateTime
                        )
                  }`,
                  arrivalCity:
                    twoWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList[1]?.flightSegment?.arrivalAirport
                      ?.locationName,
                  arrivalCityCode:
                    twoWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList[1]?.flightSegment?.arrivalAirport
                      ?.locationCode,
                  arrivalTime: `${
                    getTimeInHours(
                      twoWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList[1]?.flightSegment
                        ?.arrivalDateTime
                    ) < 10
                      ? `0${getTimeInHours(
                          twoWayTripFlights?.fareComponentGroupList?.boundList
                            ?.availFlightSegmentList[1]?.flightSegment
                            ?.arrivalDateTime
                        )}`
                      : getTimeInHours(
                          twoWayTripFlights?.fareComponentGroupList?.boundList
                            ?.availFlightSegmentList[1]?.flightSegment
                            ?.arrivalDateTime
                        )
                  }: ${
                    getTimeInMinutes(
                      twoWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList[1]?.flightSegment
                        ?.arrivalDateTime
                    ) < 10
                      ? `0${getTimeInMinutes(
                          twoWayTripFlights?.fareComponentGroupList?.boundList
                            ?.availFlightSegmentList[1]?.flightSegment
                            ?.arrivalDateTime
                        )}`
                      : getTimeInMinutes(
                          twoWayTripFlights?.fareComponentGroupList?.boundList
                            ?.availFlightSegmentList[1]?.flightSegment
                            ?.arrivalDateTime
                        )
                  }`,
                  cabin: bookingClass?.cabin,
                  resBookDesigCode: bookingClass?.resBookDesigCode,
                  resBookDesigQuantity: bookingClass?.resBookDesigQuantity,
                  resBookDesigStatusCode: bookingClass?.resBookDesigStatusCode,
                  cabin_Connecting: bookingClass?.cabin,
                  resBookDesigCode_Connecting: bookingClass?.resBookDesigCode,
                  resBookDesigQuantity_Connecting:
                    bookingClass?.resBookDesigQuantity,
                  resBookDesigStatusCode_Connecting:
                    bookingClass?.resBookDesigStatusCode,
                  baseAmount: baseAmountValue,
                  totalAmount: baseAmountValue,
                  currencyCode:
                    twoWayTripFlights?.fareComponentGroupList
                      ?.fareComponentList[index]?.pricingOverview?.totalAmount
                      ?.currency?.code,
                  passengerFareInfoList:
                    twoWayTripFlights?.fareComponentGroupList
                      ?.fareComponentList[index]?.passengerFareInfoList,
                  flightSegment: {
                    ...twoWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList[0]?.flightSegment,
                  },
                  flightSegment_Connecting: {
                    ...twoWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList[1]?.flightSegment,
                  },
                };

                twoWayFlightsData.push(flightData);
              }
            );
          } else {
            if (
              Array.isArray(
                twoWayTripFlights?.fareComponentGroupList?.boundList
                  ?.availFlightSegmentList?.bookingClassList
              )
            ) {
              twoWayTripFlights?.fareComponentGroupList?.boundList?.availFlightSegmentList?.bookingClassList.map(
                (bookingClass, index) => {
                  let baseAmountValue =
                    twoWayTripFlights?.fareComponentGroupList
                      ?.fareComponentList[index]?.pricingOverview?.totalAmount
                      ?.value;
                  if (
                    twoWayTripFlights?.fareComponentGroupList
                      ?.fareComponentList[index]?.pricingOverview?.totalBaseFare
                      ?.extraCharges[0]?.value
                  ) {
                    baseAmountValue =
                      Number(baseAmountValue) +
                      Number(
                        twoWayTripFlights?.fareComponentGroupList
                          ?.fareComponentList[index]?.pricingOverview
                          ?.totalBaseFare?.extraCharges[0]?.value
                      );
                  }
                  let flightData = {
                    flightName:
                      twoWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList?.flightSegment?.airline
                        ?.companyFullName,
                    flightNumber:
                      twoWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList?.flightSegment?.flightNumber,
                    stops:
                      twoWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList?.flightSegment?.stopQuantity,
                    flightDuration:
                      twoWayTripFlights?.fareComponentGroupList?.boundList?.availFlightSegmentList?.flightSegment?.journeyDuration?.slice(
                        2
                      ),
                    departureCity:
                      twoWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList?.flightSegment
                        ?.departureAirport?.locationName,
                    departureCityCode:
                      twoWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList?.flightSegment
                        ?.departureAirport?.locationCode,

                    departureTime: `${
                      getTimeInHours(
                        twoWayTripFlights?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.departureDateTime
                      ) < 10
                        ? `0${getTimeInHours(
                            twoWayTripFlights?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.departureDateTime
                          )}`
                        : getTimeInHours(
                            twoWayTripFlights?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.departureDateTime
                          )
                    }: ${
                      getTimeInMinutes(
                        twoWayTripFlights?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.departureDateTime
                      ) < 10
                        ? `0${getTimeInMinutes(
                            twoWayTripFlights?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.departureDateTime
                          )}`
                        : getTimeInMinutes(
                            twoWayTripFlights?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.departureDateTime
                          )
                    }`,

                    arrivalCity:
                      twoWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList?.flightSegment?.arrivalAirport
                        ?.locationName,
                    arrivalCityCode:
                      twoWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList?.flightSegment?.arrivalAirport
                        ?.locationCode,
                    arrivalTime: `${
                      getTimeInHours(
                        twoWayTripFlights?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.arrivalDateTime
                      ) < 10
                        ? `0${getTimeInHours(
                            twoWayTripFlights?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.arrivalDateTime
                          )}`
                        : getTimeInHours(
                            twoWayTripFlights?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.arrivalDateTime
                          )
                    }: ${
                      getTimeInMinutes(
                        twoWayTripFlights?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.arrivalDateTime
                      ) < 10
                        ? `0${getTimeInMinutes(
                            twoWayTripFlights?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.arrivalDateTime
                          )}`
                        : getTimeInMinutes(
                            twoWayTripFlights?.fareComponentGroupList?.boundList
                              ?.availFlightSegmentList?.flightSegment
                              ?.arrivalDateTime
                          )
                    }`,

                    cabin: bookingClass?.cabin,
                    resBookDesigCode: bookingClass?.resBookDesigCode,
                    resBookDesigQuantity: bookingClass?.resBookDesigQuantity,
                    resBookDesigStatusCode:
                      bookingClass?.resBookDesigStatusCode,
                    baseAmount: baseAmountValue,
                    totalAmount: baseAmountValue,
                    currencyCode:
                      twoWayTripFlights?.fareComponentGroupList
                        ?.fareComponentList[index]?.pricingOverview?.totalAmount
                        ?.currency?.code,
                    passengerFareInfoList:
                      twoWayTripFlights?.fareComponentGroupList
                        ?.fareComponentList[index]?.passengerFareInfoList,
                    flightSegment:
                      twoWayTripFlights?.fareComponentGroupList?.boundList
                        ?.availFlightSegmentList?.flightSegment,
                  };
                  twoWayFlightsData.push(flightData);
                }
              );
            } else {
              let baseAmountValue =
                twoWayTripFlights?.fareComponentGroupList?.fareComponentList
                  ?.pricingOverview?.totalAmount?.value;
              if (
                twoWayTripFlights?.fareComponentGroupList?.fareComponentList
                  ?.pricingOverview?.totalBaseFare?.extraCharges[0]?.value
              ) {
                baseAmountValue =
                  Number(baseAmountValue) +
                  Number(
                    twoWayTripFlights?.fareComponentGroupList?.fareComponentList
                      ?.pricingOverview?.totalBaseFare?.extraCharges[0]?.value
                  );
              }
              let flightData = {
                flightName:
                  twoWayTripFlights?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList?.flightSegment?.airline
                    ?.companyFullName,
                flightNumber:
                  twoWayTripFlights?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList?.flightSegment?.flightNumber,
                stops:
                  twoWayTripFlights?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList?.flightSegment?.stopQuantity,
                flightDuration:
                  twoWayTripFlights?.fareComponentGroupList?.boundList?.availFlightSegmentList?.flightSegment?.journeyDuration?.slice(
                    2
                  ),
                departureCity:
                  twoWayTripFlights?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList?.flightSegment?.departureAirport
                    ?.locationName,
                departureCityCode:
                  twoWayTripFlights?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList?.flightSegment?.departureAirport
                    ?.locationCode,

                departureTime: `${
                  getTimeInHours(
                    twoWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList?.flightSegment?.departureDateTime
                  ) < 10
                    ? `0${getTimeInHours(
                        twoWayTripFlights?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.departureDateTime
                      )}`
                    : getTimeInHours(
                        twoWayTripFlights?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.departureDateTime
                      )
                }: ${
                  getTimeInMinutes(
                    twoWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList?.flightSegment?.departureDateTime
                  ) < 10
                    ? `0${getTimeInMinutes(
                        twoWayTripFlights?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.departureDateTime
                      )}`
                    : getTimeInMinutes(
                        twoWayTripFlights?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.departureDateTime
                      )
                }`,

                arrivalCity:
                  twoWayTripFlights?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList?.flightSegment?.arrivalAirport
                    ?.locationName,
                arrivalCityCode:
                  twoWayTripFlights?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList?.flightSegment?.arrivalAirport
                    ?.locationCode,
                arrivalTime: `${
                  getTimeInHours(
                    twoWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList?.flightSegment?.arrivalDateTime
                  ) < 10
                    ? `0${getTimeInHours(
                        twoWayTripFlights?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.arrivalDateTime
                      )}`
                    : getTimeInHours(
                        twoWayTripFlights?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.arrivalDateTime
                      )
                }: ${
                  getTimeInMinutes(
                    twoWayTripFlights?.fareComponentGroupList?.boundList
                      ?.availFlightSegmentList?.flightSegment?.arrivalDateTime
                  ) < 10
                    ? `0${getTimeInMinutes(
                        twoWayTripFlights?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.arrivalDateTime
                      )}`
                    : getTimeInMinutes(
                        twoWayTripFlights?.fareComponentGroupList?.boundList
                          ?.availFlightSegmentList?.flightSegment
                          ?.arrivalDateTime
                      )
                }`,

                cabin:
                  twoWayTripFlights?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList?.bookingClassList?.cabin,
                resBookDesigCode:
                  twoWayTripFlights?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList?.bookingClassList
                    ?.resBookDesigCode,
                resBookDesigQuantity:
                  twoWayTripFlights?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList?.bookingClassList
                    ?.resBookDesigQuantity,
                resBookDesigStatusCode:
                  twoWayTripFlights?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList?.bookingClassList
                    ?.resBookDesigStatusCode,
                baseAmount: baseAmountValue,
                totalAmount: baseAmountValue,
                currencyCode:
                  twoWayTripFlights?.fareComponentGroupList?.fareComponentList
                    ?.pricingOverview?.totalAmount?.currency?.code,
                passengerFareInfoList:
                  twoWayTripFlights?.fareComponentGroupList?.fareComponentList
                    ?.passengerFareInfoList,
                flightSegment:
                  twoWayTripFlights?.fareComponentGroupList?.boundList
                    ?.availFlightSegmentList?.flightSegment,
              };
              twoWayFlightsData.push(flightData);
            }
          }
        }
        flightClassListData.push(twoWayFlightsData.reverse());
      }
      setFlightClassList(JSON.parse(JSON.stringify(flightClassListData)));
      setoneWayTripDetails(flightClassListData[0][0]);
      if (flightClassListData[1]) {
        setTwoWayTripDetails(flightClassListData[1][0]);
      }
    }
  }, [searchResultList]);

  useEffect(() => {
    if (airline) {
      setShowLoader(true);
      // setOrigin(null);
      // setDestination(null);
      const headers = {
        Authorization: localStorage.getItem("AuthToken"),
        Accept: "application/json",
      };
      axios
        .get(
          `http://stg-api.aeroprime.in/crm-service/search/originList?airlineCode=${airline}`,
          { headers }
        )
        .then((response) => {
          setFlightsAvailable(response.data);
          setShowLoader(false);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            localStorage.clear();
            window.location.href = "/";
          }
        });
    }
  }, [airline]);

  const airlineOptions =
    loggedInUserDetails?.airlineCodes?.map((airlineCode) => ({
      label: airlineCode,
      value: airlineCode,
    })) || [];
  const handleAirlineChange = (airline) => {
    setAirline(airline);
  };

  const originOptions = flightsAvailable
    ? Object.keys(flightsAvailable).map((city) => ({
        label: city,
        value: city,
      }))
    : [];

  const destinationOptions =
    flightsAvailable && origin
      ? flightsAvailable[origin]?.map((city) => ({
          label: city,
          value: city,
        })) || []
      : [];

  const handleOriginChange = (value) => {
    setOrigin(value);
  };

  const handleDestinationChange = (value) => {
    setDestination(value);
  };

  const handleClose = () => setShowBookingDetailsDialog(false);
  const handleShow = () => setShowBookingDetailsDialog(true);

  const formatDate = (date) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };

  const handleSelection = (type, count) => {
    if (type === "adult") {
      setSelectedAdult(count);
      if (selectedInfant > count) {
        setSelectedInfant(count);
      }
    } else if (type === "child") {
      setSelectedChild(selectedChild === count ? null : count);
    } else if (type === "infant") {
      setSelectedInfant(selectedInfant === count ? null : count);
      if (count <= selectedAdult) {
        setSelectedInfant(selectedInfant === count ? null : count);
      }
    }
  };

  const handleApply = () => {
    const total = selectedAdult + selectedChild + selectedInfant;
    setAdult(selectedAdult);
    setChild(selectedChild);
    setInfant(selectedInfant);
    setTotalTravelers(total);
    setPassengerCount(false);
  };

  // const formatLocation = (loc) => {
  //   if (!loc) return [];
  //   const [code, name] = loc.split(",");
  //   return [code, name];
  // };
  const formatLocation = (location) => {
    if (typeof location !== "string") {
      return []; // Return an empty array for invalid inputs
    }
    const [code, name] = location.split(",");
    return [code ? code.trim() : null, name ? name.trim() : null];
  };

  const handleSearchFlights = () => {
    const adultCount = selectedAdult || 0;
    const childCount = selectedChild || 0;
    const infantCount = selectedInfant || 0;

    setPassCount({
      adult: selectedAdult,
      child: selectedChild,
      infant: selectedInfant,
    });

    // if (!origin || !destination || !departureDate) {
    //   setShowNoFlightsMessage(true);
    //   setShowLoader(false);
    //   return;
    // }
    setoneWayTripDetails(null);
    setTwoWayTripDetails(null);
    setFlightClassList(false);
    setShowNoFlightsMessage(false);
    setShowLoader(true);
    setShowFlexiFare(false);
    setShowOneWayFlexiFareCard(null);
    setShowTwoWayFlexiFareCard(null);

    const formattedDepartureDate = formatDate(departureDate);
    const formattedReturnDate = formatDate(returnDate);

    const [originCode] = formatLocation(origin);
    const [destinationCode] = formatLocation(destination);
    if (originCode === null || destinationCode === null) {
      // Handle the error case here, like showing a message to the user
    }

    // if (!originCode || !destinationCode) {
    //   setShowNoFlightsMessage(true);
    //   setShowLoader(false);
    //   return;
    // }

    const originDestinationInformationList = [];

    if (tripType === "ROUND_TRIP") {
      originDestinationInformationList.push({
        departureDateTime: formattedDepartureDate,
        destinationLocation: destinationCode,
        originLocation: originCode,
      });
      originDestinationInformationList.push({
        departureDateTime: formattedReturnDate,
        destinationLocation: originCode,
        originLocation: destinationCode,
      });
    } else {
      originDestinationInformationList.push({
        departureDateTime: formattedDepartureDate,
        destinationLocation: destinationCode,
        originLocation: originCode,
      });
    }

    const reqBody = {
      passengerTypeQuantityList: [
        { passengerType: "ADLT", quantity: String(adultCount) },
        { passengerType: "CHLD", quantity: String(childCount) },
        { passengerType: "INFT", quantity: String(infantCount) },
      ],
      originDestinationInformationList: originDestinationInformationList,
      tripType: tripType,
      currencyCode: "INR",
      airlineCode: airline,
    };

    const headers = {
      Authorization: localStorage.getItem("AuthToken"),
      Accept: "application/json",
    };

    axios
      .post(
        `http://stg-api.aeroprime.in/airline-service/getAvailability?airlineCode=${airline}&controlPanel=true`,
        reqBody,
        { headers }
      )
      .then((response) => {
        if (response?.data?.success === true) {
          setSearchResultList({
            ...response.data,
            tripType,
            securityToken: response?.data?.metaData?.securityToken ?? null,
          });
        } else {
          setShowNoFlightsMessage(true);
        }
        setShowLoader(false);
        if (adultCount + childCount + infantCount < 2) {
          setShowFlexiFare(true);
        }
      })
      .catch((error) => {
        setShowLoader(false);
        if (error.response?.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  const handleFlexiSelectOnList = (list, pkg, trip) => {
    let tripDetails = JSON.parse(JSON.stringify(list));
    let addOnAmount = 0;
    if (Array.isArray(tripDetails?.passengerFareInfoList)) {
      let farePkgInfoList =
        tripDetails?.passengerFareInfoList[0]?.fareInfoList?.farePkgInfoList;
      let updatedFarePkgInfoList = farePkgInfoList?.map((pkgInfo, index) => {
        if (pkgInfo?.pkgCatagory === pkg?.pkgCatagory) {
          addOnAmount =
            pkgInfo?.price?.value * (passCount.adult + passCount.child);
          return { ...pkgInfo, selected: "true" };
        } else {
          return { ...pkgInfo, selected: "false" };
        }
      });
      // tripDetails?.passengerFareInfoList?.forEach((paxFareInfoList) => {
      //   paxFareInfoList?.fareInfoList?.farePkgInfoList.forEach(
      //     (farePkgInfo) => {
      //       if (farePkgInfo?.pkgCatagory === pkg?.pkgCatagory) {
      //         addOnAmount =
      //           Number(addOnAmount) + Number(farePkgInfo?.price?.value);
      //       }
      //     }
      //   );
      //   console.log(addOnAmount, '...//////')
      // });
      tripDetails.passengerFareInfoList[0].fareInfoList.farePkgInfoList =
        updatedFarePkgInfoList;
    } else {
      let farePkgInfoList =
        tripDetails?.passengerFareInfoList?.fareInfoList?.farePkgInfoList;
      let updatedFarePkgInfoList = farePkgInfoList?.map((pkgInfo, index) => {
        if (pkgInfo?.pkgCatagory === pkg?.pkgCatagory) {
          addOnAmount =
            pkgInfo?.price?.value * (passCount.adult + passCount.child);
          return { ...pkgInfo, selected: "true" };
        } else {
          return { ...pkgInfo, selected: "false" };
        }
      });
      tripDetails.passengerFareInfoList.fareInfoList.farePkgInfoList =
        updatedFarePkgInfoList;
    }

    if (trip === "oneWay") {
      let flightClassListCopy = flightClassList;
      let updatedFlightClassList = flightClassList[0]?.map((flightClass) => {
        if (
          flightClass?.flightNumber === list?.flightNumber &&
          flightClass?.resBookDesigCode === list?.resBookDesigCode
        ) {
          return {
            ...tripDetails,
            totalAmount: `${
              Number(tripDetails?.baseAmount) + Number(addOnAmount)
            }`,
          };
        } else {
          return { ...flightClass };
        }
      });
      flightClassListCopy[0] = updatedFlightClassList;
      setFlightClassList(flightClassListCopy);
      setoneWayTripDetails({
        ...tripDetails,
        totalAmount: `${Number(tripDetails?.baseAmount) + Number(addOnAmount)}`,
      });
    } else {
      let flightClassListCopy = flightClassList;
      let updatedFlightClassList = flightClassList[1]?.map((flightClass) => {
        if (
          flightClass?.flightNumber === list?.flightNumber &&
          flightClass?.resBookDesigCode === list?.resBookDesigCode
        ) {
          return {
            ...tripDetails,
            totalAmount: `${
              Number(tripDetails?.baseAmount) + Number(addOnAmount)
            }`,
          };
        } else {
          return { ...flightClass };
        }
      });
      flightClassListCopy[1] = updatedFlightClassList;
      setFlightClassList(flightClassListCopy);
      setTwoWayTripDetails({
        ...tripDetails,
        totalAmount: `${Number(tripDetails?.baseAmount) + Number(addOnAmount)}`,
      });
    }
  };

  const handleSwap = () => {
    // Swap origin and destination
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const featureMapper = {
    STANDARTSEAT: (
      <div>
        <img
          alt=""
          src="https://kzr.resource.crane.aero/web/sites/default/files/2020-06/ic_seatselect_0.svg?v=f5954e30"
        />
        Standard Seat Selection
      </div>
    ),
    HBAG10: (
      <div>
        <img
          alt=""
          src="https://kzr.resource.crane.aero/web/sites/default/files/2020-06/ic_handbaggage.svg?v=f5954e30"
        />
        Hand baggage 10 kg
      </div>
    ),
    HBAG5: (
      <div>
        <img
          alt=""
          src="https://kzr.resource.crane.aero/web/sites/default/files/2020-06/ic_handbaggage.svg?v=f5954e30"
        />
        Hand baggage 5 kg
      </div>
    ),
    CHECKEDBAG20: (
      <div>
        <img
          alt=""
          src="https://kzr.resource.crane.aero/web/sites/default/files/2020-06/ic_checkedbaggage.svg?v=f5954e30"
        />
        Checked baggage (20 kg)
      </div>
    ),
    ALLSEAT: (
      <div>
        <img
          alt=""
          src="https://kzr.resource.crane.aero/web/sites/default/files/2020-06/ic_seatselect_0.svg?v=f5954e30"
        />
        Any seat selection
      </div>
    ),
    PBORBUNDLE: (
      <div>
        <img
          alt=""
          src="https://kzr.resource.crane.aero/web/sites/default/files/2020-06/ic_priorityboarding_0.svg?v=f5954e30"
        />
        Priority boarding
      </div>
    ),
    PENALTYXISE: (
      <div>
        <img
          alt=""
          src="https://kzr.resource.crane.aero/web/sites/default/files/2020-06/ic_refundvoucher.svg?v=f5954e30"
        />
        Free refund
      </div>
    ),
  };

  const handleChange = (value) => {
    setSelectedValue(value);
  };

  const returnSearchResultContent = () => {
    if (showNoFlightsMessage) {
      return (
        <div className="no-flights-text">
          OOPS!! No Flights Found for this Search!
        </div>
      );
    } else if (
      searchResultList?.tripType === "ONE_WAY" &&
      flightClassList &&
      flightClassList[0]?.length === 0
    ) {
      return (
        <div className="no-flights-text">
          OOPS!! No Flights Found for this Search!
        </div>
      );
    } else if (
      searchResultList?.tripType === "ROUND_TRIP" &&
      flightClassList &&
      (flightClassList[0]?.length === 0 || flightClassList[1]?.length === 0)
    ) {
      return (
        <div className="no-flights-text">
          OOPS!! No Flights Found for this Search!
        </div>
      );
    } else {
      // flight details
      return (
        flightClassList && (
          <>
            <div className="search-result-cards-wrapper">
              <div className="search-result-col">
                <div className="onward-return-wrapper">
                  {tripType === "ROUND_TRIP" ? (
                    <>
                      {/* <FormLabel className="" component="legend">Choose an option:</FormLabel> */}
                      <div className="onward-btn-wrapper">
                        <button
                          className="onward-btn"
                          onClick={() => handleChange("onward")}
                          // style={{
                          //   padding: '10px',
                          //   margin: '5px',
                          //   border: '1px solid',
                          //   borderRadius: '4px',
                          //   cursor: 'pointer',
                          //   backgroundColor: selectedValue === 'onward' ? '#e0f7fa' : '#fff',
                          // }}
                          style={{
                            borderBottom:
                              selectedValue === "onward"
                                ? "2px solid #ef5443"
                                : "none",
                          }}
                        >
                          DEPART
                        </button>
                      </div>
                      <div className="return-btn-wrapper">
                        <button
                          className="return-btn"
                          onClick={() => handleChange("return")}
                          // style={{
                          //   padding: '10px',
                          //   margin: '5px',
                          //   border: '1px solid',
                          //   borderRadius: '4px',
                          //   cursor: 'pointer',
                          //   backgroundColor: selectedValue === 'return' ? '#e0f7fa' : '#fff',
                          // }}
                          style={{
                            borderBottom:
                              selectedValue === "return"
                                ? "2px solid #ef5443"
                                : "none",
                          }}
                        >
                          RETURN
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="oneWay-onward-btn-wrapper">DEPART</div>
                  )}
                </div>

                {selectedValue === "onward" && (
                  <div>
                    {flightClassList[0]?.map((list, index) => {
                      let passengerFareInfoList = Array.isArray(
                        list?.passengerFareInfoList
                      )
                        ? list?.passengerFareInfoList[0]
                        : list?.passengerFareInfoList;
                      let standardPlusFare = 0;
                      let comfortFare = 0;
                      let comfortPlusFare = 0;
                      if (
                        passengerFareInfoList?.fareInfoList?.farePkgInfoList
                      ) {
                        if (Array.isArray(list?.passengerFareInfoList)) {
                          list?.passengerFareInfoList?.forEach(
                            (paxfareInfo) => {
                              standardPlusFare = Number(
                                paxfareInfo?.fareInfoList?.farePkgInfoList[0]
                                  ?.price?.value
                              );
                              comfortFare = Number(
                                paxfareInfo?.fareInfoList?.farePkgInfoList[1]
                                  ?.price?.value
                              );
                              comfortPlusFare = Number(
                                paxfareInfo?.fareInfoList?.farePkgInfoList[2]
                                  ?.price?.value
                              );
                            }
                          );
                        } else {
                          standardPlusFare = Number(
                            list?.passengerFareInfoList?.fareInfoList
                              ?.farePkgInfoList[0]?.price?.value
                          );
                          comfortFare = Number(
                            list?.passengerFareInfoList?.fareInfoList
                              ?.farePkgInfoList[1]?.price?.value
                          );
                          comfortPlusFare = Number(
                            list?.passengerFareInfoList?.fareInfoList
                              ?.farePkgInfoList[2]?.price?.value
                          );
                        }
                      }

                      // oneway details

                      return (
                        <div>
                          <div className="flight-card-wrapper">
                            <div className="flight-section-info">
                              <div className="flight-name-details">
                                <div className="flight-logo">
                                  {list.flightName === "FLY ARYSTAN" && (
                                    <img
                                      className="fly-arystan-logo"
                                      src={flyArystan}
                                      alt="flight-icon"
                                    />
                                  )}
                                  {list.flightName ===
                                    "Turkmenistan Airlines" && (
                                    <img
                                      className="T5-logo"
                                      src={TurkAirlines}
                                      alt="flight-icon"
                                    />
                                  )}
                                  {list.flightName === "SalamAir" && (
                                    <img
                                      className="Salam-logo"
                                      src={salam}
                                      alt="flight-icon"
                                    />
                                  )}
                                </div>
                                <div className="flight-info">
                                  <div className="flight-name">
                                    {list.flightName}
                                  </div>
                                  <div className="flight-number">
                                    Flight No. -{" "}
                                    {`${list.flightNumber}${
                                      list?.flightNumber_RT
                                        ? ` / ${list?.flightNumber_RT}`
                                        : ""
                                    }`}
                                  </div>
                                  <div className="seperator" />
                                  <div className="cabin">{list?.cabin}</div>
                                  <div className="design-code">
                                    Class - {list?.resBookDesigCode}
                                  </div>
                                  <div className="design-code1">
                                    Seats Available -{" "}
                                    {list?.resBookDesigQuantity}
                                  </div>
                                </div>
                              </div>
                              <div className="flight-city-details">
                                <div className="flight-city-left">
                                  <div className="flight-city-name">
                                    {
                                      list?.flightSegment?.departureDateTime?.split(
                                        "T"
                                      )[0]
                                    }
                                  </div>
                                  <div className="flight-city-code">
                                    <span className="flight-city-time">
                                      {list.departureTime}
                                    </span>
                                  </div>
                                  <div className="flight-city-name">
                                    {list.departureCityCode},
                                    {list.departureCity}
                                  </div>
                                </div>
                                <div className="flight-city-seperator">
                                  <div className="duration">
                                    {list.flightDuration}
                                  </div>
                                  <div className="line-plane">
                                    <div className="line-seperator"></div>
                                    <FlightIcon
                                      className="right-plane"
                                      sx={{ transform: "rotate(90deg)" }}
                                    />
                                  </div>
                                  <div className="stop">{`${
                                    Number(list.stops) !== 0
                                      ? `${list.stops} stop`
                                      : "Non stop"
                                  } ${
                                    list?.stopOverCity
                                      ? `via ${list?.stopOverCity}`
                                      : ""
                                  }`}</div>
                                </div>
                                <div className="flight-city-right">
                                  <div className="flight-city-name">
                                    {
                                      list?.flightSegment?.arrivalDateTime?.split(
                                        "T"
                                      )[0]
                                    }
                                  </div>
                                  <div className="flight-city-code">
                                    <span className="flight-city-time">
                                      {list.arrivalTime}
                                    </span>
                                  </div>
                                  <div className="flight-city-name">
                                    {list.arrivalCityCode},{list.arrivalCity}
                                  </div>
                                </div>
                              </div>
                              <div className="flight-book-btn-section">
                                <div>
                                  <button
                                    className="Book-btn"
                                    variant="contained"
                                    disabled={
                                      loggedInUserDetails?.role !== "admin" &&
                                      loggedInUserDetails?.can_create_booking !==
                                        1
                                    }
                                    // color="secondary"
                                    onClick={() => {
                                      if (flightClassList.length === 1) {
                                        setoneWayTripDetails(
                                          JSON.parse(JSON.stringify(list))
                                        );
                                        handleShow();
                                      } else {
                                      }
                                    }}
                                  >
                                    {passengerFareInfoList?.fareInfoList
                                      ?.farePkgInfoList &&
                                      passengerFareInfoList?.fareInfoList
                                        ?.farePkgInfoList[0]?.selected ===
                                        "true" && (
                                        <div className="header1">
                                          (Standard Plus)
                                        </div>
                                      )}
                                    {passengerFareInfoList?.fareInfoList
                                      ?.farePkgInfoList &&
                                      passengerFareInfoList?.fareInfoList
                                        ?.farePkgInfoList[1]?.selected ===
                                        "true" && (
                                        <div className="header1">(Comfort)</div>
                                      )}
                                    {passengerFareInfoList?.fareInfoList
                                      ?.farePkgInfoList &&
                                      passengerFareInfoList?.fareInfoList
                                        ?.farePkgInfoList[2]?.selected ===
                                        "true" && (
                                        <div className="header1">
                                          (Comfort Plus)
                                        </div>
                                      )}
                                    {passengerFareInfoList?.fareInfoList
                                      ?.farePkgInfoList &&
                                      passengerFareInfoList?.fareInfoList
                                        ?.farePkgInfoList[0]?.selected !==
                                        "true" &&
                                      passengerFareInfoList?.fareInfoList
                                        ?.farePkgInfoList[1]?.selected !==
                                        "true" &&
                                      passengerFareInfoList?.fareInfoList
                                        ?.farePkgInfoList[2]?.selected !==
                                        "true" && (
                                        <div className="header1">
                                          (Standard)
                                        </div>
                                      )}

                                    {flightClassList.length === 1 ? (
                                      <div></div>
                                    ) : (
                                      <Radio
                                        className="check-btn"
                                        checked={
                                          list?.flightNumber ===
                                            oneWayTripDetails?.flightNumber &&
                                          list?.resBookDesigCode ===
                                            oneWayTripDetails?.resBookDesigCode &&
                                          list?.flightNumber_RT ===
                                            oneWayTripDetails?.flightNumber_RT
                                        }
                                        onChange={() =>
                                          setoneWayTripDetails(
                                            JSON.parse(JSON.stringify(list))
                                          )
                                        }
                                        value="a"
                                        name="radio-buttons"
                                        inputProps={{ "aria-label": "A" }}
                                        // disabled={loggedInUserDetails?.role === "admin"}

                                        sx={{
                                          color: "#ffffff", // Unchecked radio button color (white)
                                          "&.Mui-checked": {
                                            color: "#ffffff", // Checked radio button color (white)
                                          },
                                          "&:hover": {
                                            color: "#ffffff", // Color on hover
                                            transform: "scale(1.1)", // Slight scale on hover
                                            transition:
                                              "transform 0.3s ease, color 0.3s ease", // Smooth transition
                                          },
                                          "& .MuiSvgIcon-root": {
                                            fontSize: "18px", // Reduce size of the radio button
                                          },
                                          "& .MuiSvgIcon-root": {
                                            fontSize: "18px", // Reduce size of the radio button
                                          },
                                        }}
                                      />
                                    )}

                                    <div className="total-fare1">
                                      <span className="currency1">
                                        {list?.currencyCode}
                                      </span>
                                      <span className="amount1">
                                        {list?.totalAmount}
                                      </span>
                                      {/* <span className="">Book</span> */}
                                    </div>
                                  </button>

                                  <div className="caret-wrapper">
                                    <span
                                      className={`caret ${
                                        showOneWayFlexiFareCard === index
                                          ? "caret-open"
                                          : "caret-close"
                                      }`}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            {showOneWayFlexiFareCard === index && (
                              <div className="flight-section-details">
                                <div className="heading-available-option">
                                  Available Fare Option
                                </div>
                                <div className="head-card-wrapper">
                                  <div
                                    className="flexi-fare-card"
                                    onClick={() =>
                                      handleFlexiSelectOnList(
                                        list,
                                        null,
                                        "oneWay"
                                      )
                                    }
                                  >
                                    <div className="flexi-fare-name-wrapper">
                                      <div className="flexi-fare-name">
                                        Standard
                                      </div>
                                      <div className="amount-flexi">
                                        {Number(list?.baseAmount)}
                                      </div>
                                    </div>
                                    <div className="flexi-features">
                                      {" "}
                                      <div className="feature">
                                        {featureMapper["HBAG5"]}
                                      </div>
                                    </div>
                                  </div>

                                  {passengerFareInfoList?.fareInfoList?.farePkgInfoList?.map(
                                    (pkg, index) => {
                                      return (
                                        <div
                                          className="flexi-fare-card"
                                          onClick={() =>
                                            handleFlexiSelectOnList(
                                              list,
                                              pkg,
                                              "oneWay"
                                            )
                                          }
                                        >
                                          {index === 0 && (
                                            <div className="flexi-fare-name-wrapper">
                                              <div className="flexi-fare-name">
                                                Standard Plus
                                              </div>
                                              <div className="amount-flexi">
                                                {/* {`+${pkg?.price?.value}`} */}
                                                {index === 0 &&
                                                  `+${
                                                    standardPlusFare *
                                                    (passCount.adult +
                                                      passCount.child)
                                                  }`}
                                                {index === 1 &&
                                                  `+${
                                                    comfortFare *
                                                    (passCount.adult +
                                                      passCount.child)
                                                  }`}
                                                {index === 2 &&
                                                  `+${
                                                    comfortPlusFare *
                                                    (passCount.adult +
                                                      passCount.child)
                                                  }`}
                                              </div>
                                            </div>
                                          )}
                                          {index === 1 && (
                                            <div
                                              className="flexi-fare-name-wrapper"
                                              onClick={() =>
                                                handleFlexiSelectOnList(
                                                  list,
                                                  pkg,
                                                  "oneWay"
                                                )
                                              }
                                            >
                                              <div className="flexi-fare-name">
                                                Comfort
                                              </div>
                                              <div className="amount-flexi">
                                                {/* {`+${pkg?.price?.value}`} */}
                                                {index === 0 &&
                                                  `+${
                                                    standardPlusFare *
                                                    (passCount.adult +
                                                      passCount.child)
                                                  }`}
                                                {index === 1 &&
                                                  `+${
                                                    comfortFare *
                                                    (passCount.adult +
                                                      passCount.child)
                                                  }`}
                                                {index === 2 &&
                                                  `+${
                                                    comfortPlusFare *
                                                    (passCount.adult +
                                                      passCount.child)
                                                  }`}
                                              </div>
                                            </div>
                                          )}
                                          {index === 2 && (
                                            <div
                                              className="flexi-fare-name-wrapper"
                                              onClick={() =>
                                                handleFlexiSelectOnList(
                                                  list,
                                                  pkg,
                                                  "oneWay"
                                                )
                                              }
                                            >
                                              <div className="flexi-fare-name">
                                                Comfort Plus
                                              </div>
                                              <div className="amount-flexi">
                                                {/* {`+${pkg?.price?.value}`} */}
                                                {index === 0 &&
                                                  `+${
                                                    standardPlusFare *
                                                    (passCount.adult +
                                                      passCount.child)
                                                  }`}
                                                {index === 1 &&
                                                  `+${
                                                    comfortFare *
                                                    (passCount.adult +
                                                      passCount.child)
                                                  }`}
                                                {index === 2 &&
                                                  `+${
                                                    comfortPlusFare *
                                                    (passCount.adult +
                                                      passCount.child)
                                                  }`}
                                              </div>
                                            </div>
                                          )}

                                          <div className="flexi-features">
                                            {Array.isArray(
                                              pkg?.pkgExplanationType
                                                ?.pkgExplanationList
                                            ) ? (
                                              <>
                                                {pkg?.pkgExplanationType?.pkgExplanationList.map(
                                                  (pkgfeature) => {
                                                    return (
                                                      <div className="feature-flexi-line-wrapper">
                                                        <div className="feature">
                                                          {
                                                            featureMapper[
                                                              pkgfeature
                                                                ?.pkgExplanation
                                                            ]
                                                          }
                                                        </div>
                                                        <div className="flexi-line"></div>
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              </>
                                            ) : (
                                              <>
                                                <div className="feature">
                                                  {
                                                    featureMapper[
                                                      pkg?.pkgExplanationType
                                                        ?.pkgExplanationList
                                                        ?.pkgExplanation
                                                    ]
                                                  }
                                                  <div className="flexi-line"></div>
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                                <div className="fare-btn-wrapper">
                                  <div className="total-fare2">
                                    <span className="currency2">
                                      {list?.currencyCode}
                                    </span>
                                    <span className="amount2">
                                      {list?.totalAmount}
                                    </span>
                                  </div>
                                  {flightClassList.length === 1 ? (
                                    <div></div>
                                  ) : (
                                    <Radio
                                      checked={
                                        list?.flightNumber ===
                                          oneWayTripDetails?.flightNumber &&
                                        list?.resBookDesigCode ===
                                          oneWayTripDetails?.resBookDesigCode &&
                                        list?.flightNumber_RT ===
                                          oneWayTripDetails?.flightNumber_RT
                                      }
                                      onChange={() =>
                                        setoneWayTripDetails(
                                          JSON.parse(JSON.stringify(list))
                                        )
                                      }
                                      value="a"
                                      name="radio-buttons"
                                      inputProps={{ "aria-label": "A" }}
                                      // disabled={loggedInUserDetails?.role === "admin"}

                                      sx={{
                                        color: "#EF5443", // Unchecked radio button color
                                        "&.Mui-checked": {
                                          color: "#EF5443", // Checked radio button color
                                        },
                                        "&:hover": {
                                          color: "#FF9800", // Color on hover
                                          transform: "scale(1.1)", // Slight scale on hover
                                          transition:
                                            "transform 0.3s ease, color 0.3s ease", // Smooth transition
                                        },
                                      }}
                                    />
                                  )}
                                  <div className="Book-button"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedValue === "return" && (
                  <div className="search-result-col">
                    {flightClassList[1]?.map((list, index) => {
                      let passengerFareInfoList = Array.isArray(
                        list?.passengerFareInfoList
                      )
                        ? list?.passengerFareInfoList[0]
                        : list?.passengerFareInfoList;
                      let standardPlusFare = 0;
                      let comfortFare = 0;
                      let comfortPlusFare = 0;
                      if (
                        passengerFareInfoList?.fareInfoList?.farePkgInfoList
                      ) {
                        if (Array.isArray(list?.passengerFareInfoList)) {
                          list?.passengerFareInfoList?.forEach(
                            (paxfareInfo) => {
                              standardPlusFare = Number(
                                paxfareInfo?.fareInfoList?.farePkgInfoList[0]
                                  ?.price?.value
                              );
                              comfortFare = Number(
                                paxfareInfo?.fareInfoList?.farePkgInfoList[1]
                                  ?.price?.value
                              );
                              comfortPlusFare = Number(
                                paxfareInfo?.fareInfoList?.farePkgInfoList[2]
                                  ?.price?.value
                              );
                            }
                          );
                        } else {
                          standardPlusFare = Number(
                            list?.passengerFareInfoList?.fareInfoList
                              ?.farePkgInfoList[0]?.price?.value
                          );
                          comfortFare = Number(
                            list?.passengerFareInfoList?.fareInfoList
                              ?.farePkgInfoList[1]?.price?.value
                          );
                          comfortPlusFare = Number(
                            list?.passengerFareInfoList?.fareInfoList
                              ?.farePkgInfoList[2]?.price?.value
                          );
                        }
                      }

                      // round trip
                      return (
                        <div>
                          <div className="flight-card-wrapper">
                            <div className="flight-section-info">
                              <div className="flight-name-details">
                                <div className="flight-logo">
                                  {list.flightName === "FLY ARYSTAN" && (
                                    <img
                                      className="fly-arystan-logo"
                                      src={flyArystan}
                                      alt="flight-icon"
                                    />
                                  )}
                                  {list.flightName ===
                                    "Turkmenistan Airlines" && (
                                    <img
                                      className="T5-logo"
                                      src={TurkAirlines}
                                      alt="flight-icon"
                                    />
                                  )}
                                  {list.flightName === "SalamAir" && (
                                    <img
                                      className="Salam-logo"
                                      src={salam}
                                      alt="flight-icon"
                                    />
                                  )}
                                </div>
                                <div className="flight-info">
                                  <div className="flight-name">
                                    {list.flightName}
                                  </div>
                                  <div className="flight-number">
                                    Flight No. -{" "}
                                    {`${list.flightNumber}${
                                      list?.flightNumber_RT
                                        ? ` / ${list?.flightNumber_RT}`
                                        : ""
                                    }`}
                                  </div>
                                  <div className="seperator" />
                                  <div className="cabin">{list?.cabin}</div>
                                  <div className="design-code">
                                    Class - {list?.resBookDesigCode}
                                  </div>
                                  <div className="design-code1">
                                    Seats Available -{" "}
                                    {list?.resBookDesigQuantity}
                                  </div>
                                </div>
                              </div>
                              <div className="flight-city-details">
                                <div className="flight-city-left">
                                  <div className="flight-city-name">
                                    {
                                      list?.flightSegment?.departureDateTime?.split(
                                        "T"
                                      )[0]
                                    }
                                  </div>
                                  <div className="flight-city-code">
                                    <span className="flight-city-time">
                                      {list.departureTime}
                                    </span>
                                  </div>
                                  <div className="flight-city-name">
                                    {list.departureCityCode},
                                    {list.departureCity}
                                  </div>
                                </div>
                                <div className="flight-city-seperator">
                                  <div className="duration">
                                    {list.flightDuration}
                                  </div>
                                  <div className="line-plane">
                                    <div className="line-seperator"></div>
                                    <FlightIcon
                                      className="right-plane"
                                      sx={{ transform: "rotate(90deg)" }}
                                    />
                                  </div>
                                  <div className="stop">{`${
                                    Number(list.stops) !== 0
                                      ? `${list.stops} stop`
                                      : "Non stop"
                                  } ${
                                    list?.stopOverCity
                                      ? `via ${list?.stopOverCity}`
                                      : ""
                                  }`}</div>
                                </div>
                                <div className="flight-city-right">
                                  <div className="flight-city-name">
                                    {
                                      list?.flightSegment?.arrivalDateTime?.split(
                                        "T"
                                      )[0]
                                    }
                                  </div>
                                  <div className="flight-city-code">
                                    <span className="flight-city-time">
                                      {list.arrivalTime}
                                    </span>
                                  </div>
                                  <div className="flight-city-name">
                                    {list.arrivalCityCode},{list.arrivalCity}
                                  </div>
                                </div>
                                {/* <div className="duration-stop">
                            <div className="duration">{list.flightDuration}</div>
                            <div className="stop">{`${
                              list.stops === 0
                                ? `${list.stops} stops`
                                : "Non stop"
                            }`}</div>
                          </div> */}
                              </div>
                              <div className="flight-book-btn-section">
                                {/* {passengerFareInfoList?.fareInfoList?.farePkgInfoList && ( */}
                                <div>
                                  <button
                                    className="Book-btn"
                                    variant="contained"
                                    // color="secondary"
                                    // onClick={() =>
                                    //   setShowTwoWayFlexiFareCard(prevIndex =>
                                    //     prevIndex === index ? null : index
                                    //   )
                                    // }
                                    disabled={
                                      loggedInUserDetails?.role !== "admin" &&
                                      loggedInUserDetails?.can_create_booking !==
                                        1
                                    }
                                  >
                                    {passengerFareInfoList?.fareInfoList
                                      ?.farePkgInfoList &&
                                      passengerFareInfoList?.fareInfoList
                                        ?.farePkgInfoList[0]?.selected ===
                                        "true" && (
                                        <div className="header1">
                                          (Standard Plus)
                                        </div>
                                      )}
                                    {passengerFareInfoList?.fareInfoList
                                      ?.farePkgInfoList &&
                                      passengerFareInfoList?.fareInfoList
                                        ?.farePkgInfoList[1]?.selected ===
                                        "true" && (
                                        <div className="header1">(Comfort)</div>
                                      )}
                                    {passengerFareInfoList?.fareInfoList
                                      ?.farePkgInfoList &&
                                      passengerFareInfoList?.fareInfoList
                                        ?.farePkgInfoList[2]?.selected ===
                                        "true" && (
                                        <div className="header1">
                                          (Comfort Plus)
                                        </div>
                                      )}
                                    {passengerFareInfoList?.fareInfoList
                                      ?.farePkgInfoList &&
                                      passengerFareInfoList?.fareInfoList
                                        ?.farePkgInfoList[0]?.selected !==
                                        "true" &&
                                      passengerFareInfoList?.fareInfoList
                                        ?.farePkgInfoList[1]?.selected !==
                                        "true" &&
                                      passengerFareInfoList?.fareInfoList
                                        ?.farePkgInfoList[2]?.selected !==
                                        "true" && (
                                        <div className="header1">
                                          (Standard)
                                        </div>
                                      )}
                                    {/* <div className="total-fare">

                                    {`${list?.currencyCode} ${list?.totalAmount}`}
                                  </div> */}
                                    <Radio
                                      checked={
                                        list?.flightNumber ===
                                          twoWayTripDetails?.flightNumber &&
                                        list?.resBookDesigCode ===
                                          twoWayTripDetails?.resBookDesigCode &&
                                        list?.flightNumber_RT ===
                                          twoWayTripDetails?.flightNumber_RT
                                      }
                                      onChange={() =>
                                        setTwoWayTripDetails(
                                          JSON.parse(JSON.stringify(list))
                                        )
                                      }
                                      value="a"
                                      name="radio-buttons"
                                      inputProps={{ "aria-label": "A" }}
                                      // disabled={loggedInUserDetails?.role === "admin"}

                                      sx={{
                                        color: "#ffffff", // Unchecked radio button color
                                        "&.Mui-checked": {
                                          color: "#ffffff", // Checked radio button color
                                        },
                                        "&:hover": {
                                          color: "#ffffff", // Color on hover
                                          transform: "scale(1.1)", // Slight scale on hover
                                          transition:
                                            "transform 0.3s ease, color 0.3s ease", // Smooth transition
                                        },
                                        "& .MuiSvgIcon-root": {
                                          fontSize: "18px", // Reduce size of the radio button
                                        },
                                      }}
                                    />
                                    <div className="total-fare1">
                                      <span className="currency1">
                                        {list?.currencyCode}
                                      </span>
                                      <span className="amount1">
                                        {list?.totalAmount}
                                      </span>
                                      {/* <span className="">Book</span> */}
                                    </div>
                                  </button>

                                  {/* {flightClassList.length === 1 ? (
                                      <button
                                        className="Book-btn3"
                                        variant="contained"
                                        // color="secondary"
                                        disabled={
                                          loggedInUserDetails?.role !== "admin" &&
                                          loggedInUserDetails?.can_create_booking !== 1
                                        }
                                        onClick={() =>
                                          setTwoWayTripDetails(
                                            JSON.parse(JSON.stringify(list))
                                          )
                                        }
                                      >
                                        BOOK
                                      </button>
                                    ) : (
                                     
                                    )}
                                 */}

                                  <div className="caret-wrapper">
                                    <span
                                      className={`caret ${
                                        showTwoWayFlexiFareCard === index
                                          ? "caret-open"
                                          : "caret-close"
                                      }`}
                                    />
                                  </div>
                                </div>
                                {/* )
                            } */}
                              </div>
                            </div>
                            {showTwoWayFlexiFareCard === index && (
                              <div className="flight-section-details">
                                <div className="heading-available-option">
                                  Available Fare Option
                                </div>
                                <div className="head-card-wrapper">
                                  <div
                                    className="flexi-fare-card"
                                    onClick={() =>
                                      handleFlexiSelectOnList(
                                        list,
                                        null,
                                        "twoWay"
                                      )
                                    }
                                  >
                                    <div className="flexi-fare-name-wrapper">
                                      <div className="flexi-fare-name">
                                        Standard
                                      </div>
                                      <div className="amount-flexi">
                                        {Number(list?.baseAmount)}
                                      </div>
                                    </div>
                                    <div className="flexi-features">
                                      {" "}
                                      <div className="feature">
                                        {featureMapper["HBAG5"]}
                                      </div>
                                    </div>
                                  </div>

                                  {passengerFareInfoList?.fareInfoList?.farePkgInfoList?.map(
                                    (pkg, index) => {
                                      return (
                                        <div
                                          className="flexi-fare-card"
                                          onClick={() =>
                                            handleFlexiSelectOnList(
                                              list,
                                              pkg,
                                              "twoWay"
                                            )
                                          }
                                        >
                                          {index === 0 && (
                                            <div className="flexi-fare-name-wrapper">
                                              <div className="header">
                                                Standard Plus
                                              </div>
                                              <div className="amount-flexi">
                                                {/* {`+${pkg?.price?.value}`} */}
                                                {index === 0 &&
                                                  `+${
                                                    standardPlusFare *
                                                    (passCount.adult +
                                                      passCount.child)
                                                  }`}
                                                {index === 1 &&
                                                  `+${
                                                    comfortFare *
                                                    (passCount.adult +
                                                      passCount.child)
                                                  }`}
                                                {index === 2 &&
                                                  `+${
                                                    comfortPlusFare *
                                                    (passCount.adult +
                                                      passCount.child)
                                                  }`}
                                              </div>
                                            </div>
                                          )}
                                          {index === 1 && (
                                            <div
                                              className="flexi-fare-name-wrapper"
                                              onClick={() =>
                                                handleFlexiSelectOnList(
                                                  list,
                                                  pkg,
                                                  "twoWay"
                                                )
                                              }
                                            >
                                              <div className="header">
                                                Comfort
                                              </div>
                                              <div className="amount-flexi">
                                                {/* {`+${pkg?.price?.value}`} */}
                                                {index === 0 &&
                                                  `+${
                                                    standardPlusFare *
                                                    (passCount.adult +
                                                      passCount.child)
                                                  }`}
                                                {index === 1 &&
                                                  `+${
                                                    comfortFare *
                                                    (passCount.adult +
                                                      passCount.child)
                                                  }`}
                                                {index === 2 &&
                                                  `+${
                                                    comfortPlusFare *
                                                    (passCount.adult +
                                                      passCount.child)
                                                  }`}
                                              </div>
                                            </div>
                                          )}
                                          {index === 2 && (
                                            <div
                                              className="flexi-fare-name-wrapper"
                                              onClick={() =>
                                                handleFlexiSelectOnList(
                                                  list,
                                                  pkg,
                                                  "twoWay"
                                                )
                                              }
                                            >
                                              <div className="header">
                                                Comfort Plus
                                              </div>
                                              <div className="amount-flexi">
                                                {/* {`+${pkg?.price?.value}`} */}
                                                {index === 0 &&
                                                  `+${
                                                    standardPlusFare *
                                                    (passCount.adult +
                                                      passCount.child)
                                                  }`}
                                                {index === 1 &&
                                                  `+${
                                                    comfortFare *
                                                    (passCount.adult +
                                                      passCount.child)
                                                  }`}
                                                {index === 2 &&
                                                  `+${
                                                    comfortPlusFare *
                                                    (passCount.adult +
                                                      passCount.child)
                                                  }`}
                                              </div>
                                            </div>
                                          )}

                                          <div className="flexi-features">
                                            {Array.isArray(
                                              pkg?.pkgExplanationType
                                                ?.pkgExplanationList
                                            ) ? (
                                              <>
                                                {pkg?.pkgExplanationType?.pkgExplanationList.map(
                                                  (pkgfeature) => {
                                                    return (
                                                      <div className="feature-flexi-line-wrapper">
                                                        <div className="feature">
                                                          {
                                                            featureMapper[
                                                              pkgfeature
                                                                ?.pkgExplanation
                                                            ]
                                                          }
                                                        </div>
                                                        <div className="flexi-line"></div>
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              </>
                                            ) : (
                                              <>
                                                <div className="feature">
                                                  {
                                                    featureMapper[
                                                      pkg?.pkgExplanationType
                                                        ?.pkgExplanationList
                                                        ?.pkgExplanation
                                                    ]
                                                  }
                                                  <div className="flexi-line"></div>
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                                <div className="fare-btn-wrapper">
                                  <div className="total-fare2">
                                    <span className="currency2">
                                      {list?.currencyCode}
                                    </span>
                                    <span className="amount2">
                                      {list?.totalAmount}
                                    </span>
                                  </div>
                                  <div className="Book-button1"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <Dialog
                fullScreen
                open={showBookingDetailsDialog}
                onClose={handleClose}
                TransitionComponent={Transition}
              >
                <AppBar
                  sx={{ position: "relative", backgroundColor: "#ef5443" }}
                >
                  <Toolbar>
                    <IconButton
                      className="close-btn-bd-dailog1"
                      edge="start"
                      color="inherit"
                      onClick={() => {
                        handleClose();
                        handleSearchFlights();
                      }}
                      aria-label="close"
                    >
                      <CloseIcon sx={{ color: "#ffff" }} />
                    </IconButton>
                  </Toolbar>
                </AppBar>
                <div>
                  <BookingDetails
                    oneWayTripDetails={oneWayTripDetails}
                    twoWayTripDetails={twoWayTripDetails}
                    passengerTypeQuantityList={[
                      {
                        passengerType: "ADLT",
                        quantity: String(selectedAdult ?? 0),
                      },
                      {
                        passengerType: "CHLD",
                        quantity: String(selectedChild ?? 0),
                      },
                      {
                        passengerType: "INFT",
                        quantity: String(selectedInfant ?? 0),
                      },
                    ]}
                    loggedInUserDetails={loggedInUserDetails}
                    airline={airline}
                    setFetchUserDetails={setFetchUserDetails}
                    securityToken={searchResultList?.securityToken}
                  />
                </div>
              </Dialog>
            </div>
            {searchResultList?.tripType === "ROUND_TRIP" && (
              <div className="book-btn-wrapper">
                {oneWayTripDetails && (
                  <div className="trip-details">
                    <div className="flight-info2">
                      <div className="logo1">
                        {oneWayTripDetails?.flightName === "FLY ARYSTAN" && (
                          <img
                            className="KC"
                            src={flyArystan}
                            alt="flight-icon"
                          />
                        )}
                        {oneWayTripDetails?.flightName ===
                          "Turkmenistan Airlines" && (
                          <img
                            className="T5"
                            src={TurkAirlines}
                            alt="flight-icon"
                          />
                        )}
                        {oneWayTripDetails?.flightName === "SalamAir" && (
                          <img className="OV" src={salam} alt="flight-icon" />
                        )}
                      </div>
                      <div className="flight-number1">
                        {`${oneWayTripDetails.flightNumber}${
                          oneWayTripDetails?.flightNumber_RT
                            ? ` / ${oneWayTripDetails?.flightNumber_RT}`
                            : ""
                        }`}
                      </div>
                      <div className="class1">{`Class - ${oneWayTripDetails?.resBookDesigCode}`}</div>
                    </div>
                    <div className="time1">
                      {oneWayTripDetails?.departureTime}
                    </div>
                    <div className="seperator-wrapper">
                      <div className="duration1">
                        {oneWayTripDetails?.flightDuration}
                      </div>
                      <div className="line-plane1">
                        <div className="line-seperator1"></div>
                        <FlightIcon
                          className="right-plane1"
                          sx={{ transform: "rotate(90deg)" }}
                        />
                        <div className="line-seperator2"></div>
                      </div>
                      <div className="stops1">
                        {Number(oneWayTripDetails?.stops) === 0
                          ? "Non stop"
                          : `${oneWayTripDetails?.stops} stops`}
                      </div>
                    </div>
                    <div className="time2">
                      {oneWayTripDetails?.arrivalTime}
                    </div>
                  </div>
                )}
                <div className="trip-seperator"></div>
                {twoWayTripDetails && (
                  <div className="trip-details">
                    <div className="flight-info2">
                      <div className="logo1">
                        {twoWayTripDetails?.flightName === "FLY ARYSTAN" && (
                          <img
                            className="KC"
                            src={flyArystan}
                            alt="flight-icon"
                          />
                        )}
                        {twoWayTripDetails?.flightName ===
                          "Turkmenistan Airlines" && (
                          <img
                            className="T5"
                            src={TurkAirlines}
                            alt="flight-icon"
                          />
                        )}
                        {twoWayTripDetails?.flightName === "SalamAir" && (
                          <img className="OV" src={salam} alt="flight-icon" />
                        )}
                      </div>
                      <div className="flight-number1">
                        {`${twoWayTripDetails.flightNumber}${
                          twoWayTripDetails?.flightNumber_RT
                            ? ` / ${twoWayTripDetails?.flightNumber_RT}`
                            : ""
                        }`}
                      </div>

                      <div className="class1">{`Class - ${twoWayTripDetails?.resBookDesigCode}`}</div>
                    </div>
                    <div className="time1">
                      {twoWayTripDetails?.departureTime}
                    </div>
                    <div className="seperator-wrapper">
                      <div className="duration1">
                        {twoWayTripDetails?.flightDuration}
                      </div>
                      <div className="line-plane1">
                        <div className="line-seperator1"></div>
                        <FlightIcon
                          className="right-plane1"
                          sx={{ transform: "rotate(90deg)" }}
                        />
                        <div className="line-seperator2"></div>
                      </div>
                      <div className="stops1">
                        {Number(twoWayTripDetails?.stops) === 0
                          ? "Non stop"
                          : `${twoWayTripDetails?.stops} stops`}
                      </div>
                    </div>
                    <div className="time2">
                      {twoWayTripDetails?.arrivalTime}
                    </div>
                  </div>
                )}
                <div className="trip-seperator"></div>
                <div className="fare-section">
                  <div className="fare-wrapper">
                    <div className="fare-header">Total Fare:</div>
                    <div className="fare">
                      {/* <img
                        src={rupeeSvgWhite}
                        alt="INR"
                        className="rupeeSvgWhite"
                      /> */}
                      <div className="currency-code1">
                        {oneWayTripDetails?.currencyCode}
                      </div>
                      <div className="total-amount1">
                        {Math.round(
                          (Number(oneWayTripDetails?.totalAmount) +
                            Number(twoWayTripDetails?.totalAmount)) *
                            100
                        ) / 100}
                      </div>
                      {/* {`${
                        Number(oneWayTripDetails?.totalAmount) +
                        Number(twoWayTripDetails?.totalAmount)
                      }`} */}
                    </div>
                  </div>
                  <div className="btn-wrapper">
                    <button
                      variant="contained"
                      className="buttom-book-btn"
                      disabled={
                        !oneWayTripDetails ||
                        !twoWayTripDetails ||
                        (loggedInUserDetails?.role !== "admin" &&
                          loggedInUserDetails?.can_create_booking !== 1)
                      }
                      onClick={handleShow}
                    >
                      BOOK NOW
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )
      );
    }
  };

  return (
    <div className="search-result-wrapper">
      {showLoader && <Loader hideLoader={false} />}
      <div className="search-flights-wrapper">
        <div className="airline-trip-container">
          {airline && (
            <div className="airline-dropdown1">
              <DropDown
                options={airlineOptions}
                value={airline}
                onChange={(selectedValue) => handleAirlineChange(selectedValue)}
                placeholder="Select an airline..."
              />
            </div>
          )}
          {tripType && (
            <div className="search-trip-section">
              <FormControl>
                <RadioGroup
                  row
                  aria-label="trip-type"
                  name="trip-type"
                  value={tripType}
                  onChange={(e) => setTripType(e.target.value)}
                >
                  <CustomFormControlLabel
                    value="ONE_WAY"
                    control={<CustomRadio />}
                    label="One-way"
                  />
                  <CustomFormControlLabel
                    value="ROUND_TRIP"
                    control={<CustomRadio />}
                    label="Round-trip"
                  />
                </RadioGroup>
              </FormControl>
            </div>
          )}
        </div>
        <div className="search-flights-section">
          {origin && (
            <div className="origin-selection1">
              <DropDown
                name="originDropdown"
                options={originOptions}
                value={origin}
                onChange={handleOriginChange}
                placeholder="Select an origin..."
              />
              <i className="icon-plane">
                <FlightTakeoffIcon />
              </i>
            </div>
          )}

          <SwapHorizontalCircleSharpIcon
            className="Swap-icon"
            onClick={handleSwap}
          />
          {destination && (
            <div className="Destination-Selection1">
              <DropDown
                name="destinationDropdown"
                options={destinationOptions}
                value={destination}
                onChange={handleDestinationChange}
                placeholder="Select a destination..."
                disabled={!origin}
              />
              <i className="icon-plane">
                <FlightLandIcon />
              </i>
            </div>
          )}

          <div className="date-selection">
            <DatePicker
              selected={departureDate}
              onChange={(date) => {
                setDepartureDate(date);
                setDateLabel1(
                  date ? date.toLocaleDateString() : "Departure Date"
                );
                if (returnDate && date > returnDate) {
                  setReturnDate(null);
                  setDateLabel2("Select Return Date");
                }
              }}
              customInput={
                <button className="calender-button1">
                  <span className="date-label">{dateLabel1}</span>
                  <i className="Calender-icon">
                    <CalendarMonthIcon />
                  </i>
                </button>
              }
              dateFormat="dd/mm/yy"
              minDate={new Date()} // Prevent past dates
              dayClassName={(date) =>
                date < new Date().setHours(0, 0, 0, 0) ? "disabled-date" : ""
              }
            />
            <DatePicker
              disabled={tripType !== "ROUND_TRIP"}
              selected={returnDate}
              onChange={(date) => {
                setReturnDate(date);
                setDateLabel2(date ? date.toLocaleDateString() : "Return Date");
              }}
              minDate={departureDate}
              dayClassName={(date) =>
                date < (departureDate || new Date()).setHours(0, 0, 0, 0)
                  ? "disabled-date"
                  : ""
              }
              customInput={
                <button
                  className={`calender-button2 ${
                    tripType !== "ROUND_TRIP" ? "disabled" : ""
                  }`}
                >
                  <span
                    className={` date-label ${
                      tripType !== "ROUND_TRIP" ? "disabled" : ""
                    }`}
                  >
                    {dateLabel2}
                  </span>
                  <i
                    className={` Calender-icon ${
                      tripType !== "ROUND_TRIP" ? "disabled" : ""
                    }`}
                  >
                    <CalendarMonthIcon />
                  </i>
                </button>
              }
              dateFormat="MM/dd/yyyy"
            />
          </div>
          <div className="Passenger-Selection1">
            <div className="Pax">
              {totalTravelers > 0 ? (
                <button
                  className="total-passenger1"
                  onClick={() => setPassengerCount(!passengerCount)}
                >
                  {`${totalTravelers} Traveler${totalTravelers > 1 ? "s" : ""}`}
                </button>
              ) : (
                <button
                  className="open-passenger-selection"
                  onClick={() => setPassengerCount(!passengerCount)}
                >
                  Select Passengers
                </button>
              )}
              {passengerCount && (
                <div className="passenger-selection-container">
                  <div className="passenger-type">
                    <label>ADULTS (16y+)</label>
                    <div className="passenger-buttons">
                      {Array.from({ length: 9 }, (_, i) => (
                        <button
                          key={i}
                          className={selectedAdult === i + 1 ? "selected" : ""}
                          onClick={() => handleSelection("adult", i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="passenger-type">
                    <label>CHILDREN (2Y - 12Y)</label>
                    <div className="passenger-buttons">
                      {Array.from({ length: 9 }, (_, i) => (
                        <button
                          key={i}
                          className={selectedChild === i + 1 ? "selected" : ""}
                          onClick={() => handleSelection("child", i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="passenger-type">
                    <label>INFANTS (below 2y)</label>
                    <div className="passenger-buttons">
                      {Array.from({ length: 9 }, (_, i) => (
                        <button
                          key={i}
                          className={selectedInfant === i + 1 ? "selected" : ""}
                          onClick={() => handleSelection("infant", i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button className="apply-button" onClick={handleApply}>
                    Apply
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="search-flights-section2">
            <div className="search-btn-wrapper">
              <FormControl>
                <button
                  className="search-btn2"
                  variant="contained"
                  onClick={handleSearchFlights}
                  disabled={
                    tripType === "ROUND_TRIP"
                      ? !origin ||
                        !destination ||
                        !departureDate ||
                        !returnDate ||
                        selectedAdult + selectedChild + selectedInfant < 1 ||
                        selectedAdult + selectedChild + selectedInfant > 9
                      : !origin ||
                        !destination ||
                        !departureDate ||
                        selectedAdult + selectedChild + selectedInfant < 1 ||
                        selectedAdult + selectedChild + selectedInfant > 9
                  }
                >
                  Modify Search
                </button>
              </FormControl>
            </div>
          </div>
        </div>
      </div>
      {returnSearchResultContent()}
    </div>
  );
};

export default SearchResults;
