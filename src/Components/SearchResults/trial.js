import React, { useState, useEffect } from "react";
import "./SearchResults.css";
import { useLocation } from "react-router-dom";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import Button from "@mui/material/Button";
import axios from "axios";
import Radio from "@mui/material/Radio";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";

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
import salaam from "../../Assets/salam.jpeg";
// import rupeeSvg from "../../assets/rupee-sign.svg";
// import rupeeSvgWhite from "../../assets/rupee-sign-white.svg";

import { useSelector } from "react-redux";

import dayjs from "dayjs";
import Loader from "../Loader/Loader";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const SearchResults = ({ searchResult, setFetchUserDetails }) => {
    const [airline, setAirline] = useState(null);
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [tripType, setTripType] = useState(null);
    const [departureDate, setDepartureDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);
    const [adult, setAdult] = useState(null);
    const [child, setChild] = useState(null);
    const [infant, setInfant] = useState(null);
    const [passengerCount, setPassengerCount] = useState({
        adult: 0,
        child: 0,
        infant: 0
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

    const [showOneWayFlexiFareCard, setShowOneWayFlexiFareCard] = useState(null);
    const [showTwoWayFlexiFareCard, setShowTwoWayFlexiFareCard] = useState(null);

    const location = useLocation();

    const today = dayjs();

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
        // console.log(departure, arrival, '....//////', departureMS, arrivalMS, difference)
        let seconds = Math.floor(difference / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        return `${hours}H${minutes - hours * 60}M`;
    };

    useEffect(() => {
        if (searchResultList?.success === true) {
            // availabilityRouteList - one/two eay
            // originDestinationOptionList - single/multiple flights
            //  availFlightSegmentList - connecting/non-connecting flights

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

            // console.log(oneWayTripFlights, "one way flights ...////");

            if (Array.isArray(oneWayTripFlights)) {
                console.log(oneWayTripFlights, "one way multiple flights ....////");
                oneWayTripFlights?.map((flight) => {
                    if (Array.isArray(flight?.fareComponentGroupList)) {
                        // console.log(
                        //   "one way - multiple flights with stops .../////  KC connecting flight redundant case",
                        //   flight?.fareComponentGroupList
                        // );
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
                                    departureTime: `${getTimeInHours(
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
                                        }: ${getTimeInMinutes(
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
                                    arrivalTime: `${getTimeInHours(
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
                                        }: ${getTimeInMinutes(
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
                                // oneWayFlightsData.push(flightData);
                            }
                        );
                    } else {
                        // console.log(
                        //   "one way - multiple flights without stops ...////",
                        //   flight?.fareComponentGroupList
                        // );

                        if (
                            Array.isArray(
                                flight?.fareComponentGroupList?.boundList
                                    ?.availFlightSegmentList
                            )
                        ) {
                            console.log(
                                "one way - multiple flights with stops ...////",
                                flight?.fareComponentGroupList?.boundList
                                    ?.availFlightSegmentList[0]
                            );

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
                                        departureTime: `${getTimeInHours(
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
                                            }: ${getTimeInMinutes(
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
                                        arrivalTime: `${getTimeInHours(
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
                                            }: ${getTimeInMinutes(
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
                                        resBookDesigCode_Connecting: bookingClass?.resBookDesigCode,
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
                                            arrivalDateTime:
                                                flight?.fareComponentGroupList?.boundList
                                                    ?.availFlightSegmentList[1]?.flightSegment
                                                    ?.arrivalDateTime,
                                        },
                                        flightSegment_Connecting: {
                                            ...flight?.fareComponentGroupList?.boundList
                                                ?.availFlightSegmentList[1]?.flightSegment,
                                            // arrivalDateTime:
                                            //   flight?.fareComponentGroupList?.boundList
                                            //     ?.availFlightSegmentList[1]?.flightSegment
                                            //     ?.arrivalDateTime,
                                        },
                                    };

                                    oneWayFlightsData.push(flightData);
                                }
                            );
                        } else {
                            console.log(
                                "one way - multiple flights without stops ...////",
                                flight?.fareComponentGroupList?.boundList
                                    ?.availFlightSegmentList
                            );

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
                                        departureTime: `${getTimeInHours(
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
                                            }: ${getTimeInMinutes(
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
                                        arrivalTime: `${getTimeInHours(
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
                                            }: ${getTimeInMinutes(
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

                        // if (
                        //   Array.isArray(
                        //     flight?.fareComponentGroupList?.boundList
                        //       ?.availFlightSegmentList?.bookingClassList
                        //   )
                        // ) {
                        //   flight?.fareComponentGroupList?.boundList?.availFlightSegmentList?.bookingClassList.map(
                        //     (bookingClass, index) => {
                        //       let baseAmountValue =
                        //         flight?.fareComponentGroupList?.fareComponentList[index]
                        //           ?.pricingOverview?.totalAmount?.value;
                        //       if (
                        //         flight?.fareComponentGroupList?.fareComponentList[index]
                        //           ?.pricingOverview?.totalBaseFare?.extraCharges[0]?.value
                        //       ) {
                        //         baseAmountValue =
                        //           Number(baseAmountValue) +
                        //           Number(
                        //             flight?.fareComponentGroupList?.fareComponentList[index]
                        //               ?.pricingOverview?.totalBaseFare?.extraCharges[0]
                        //               ?.value
                        //           );
                        //       }
                        //       let flightData = {
                        //         flightName:
                        //           flight?.fareComponentGroupList?.boundList
                        //             ?.availFlightSegmentList?.flightSegment?.airline
                        //             ?.companyFullName,
                        //         flightNumber:
                        //           flight?.fareComponentGroupList?.boundList
                        //             ?.availFlightSegmentList?.flightSegment?.flightNumber,
                        //         stops:
                        //           flight?.fareComponentGroupList?.boundList
                        //             ?.availFlightSegmentList?.flightSegment?.stopQuantity,
                        //         flightDuration:
                        //           flight?.fareComponentGroupList?.boundList?.availFlightSegmentList?.flightSegment?.journeyDuration?.slice(
                        //             2
                        //           ),
                        //         departureCity:
                        //           flight?.fareComponentGroupList?.boundList
                        //             ?.availFlightSegmentList?.flightSegment
                        //             ?.departureAirport?.locationName,
                        //         departureCityCode:
                        //           flight?.fareComponentGroupList?.boundList
                        //             ?.availFlightSegmentList?.flightSegment
                        //             ?.departureAirport?.locationCode,
                        //         departureTime: `${
                        //           getTimeInHours(
                        //             flight?.fareComponentGroupList?.boundList
                        //               ?.availFlightSegmentList?.flightSegment
                        //               ?.departureDateTime
                        //           ) < 10
                        //             ? `0${getTimeInHours(
                        //                 flight?.fareComponentGroupList?.boundList
                        //                   ?.availFlightSegmentList?.flightSegment
                        //                   ?.departureDateTime
                        //               )}`
                        //             : getTimeInHours(
                        //                 flight?.fareComponentGroupList?.boundList
                        //                   ?.availFlightSegmentList?.flightSegment
                        //                   ?.departureDateTime
                        //               )
                        //         }: ${
                        //           getTimeInMinutes(
                        //             flight?.fareComponentGroupList?.boundList
                        //               ?.availFlightSegmentList?.flightSegment
                        //               ?.departureDateTime
                        //           ) < 10
                        //             ? `0${getTimeInMinutes(
                        //                 flight?.fareComponentGroupList?.boundList
                        //                   ?.availFlightSegmentList?.flightSegment
                        //                   ?.departureDateTime
                        //               )}`
                        //             : getTimeInMinutes(
                        //                 flight?.fareComponentGroupList?.boundList
                        //                   ?.availFlightSegmentList?.flightSegment
                        //                   ?.departureDateTime
                        //               )
                        //         }`,
                        //         arrivalCity:
                        //           flight?.fareComponentGroupList?.boundList
                        //             ?.availFlightSegmentList?.flightSegment?.arrivalAirport
                        //             ?.locationName,
                        //         arrivalCityCode:
                        //           flight?.fareComponentGroupList?.boundList
                        //             ?.availFlightSegmentList?.flightSegment?.arrivalAirport
                        //             ?.locationCode,
                        //         arrivalTime: `${
                        //           getTimeInHours(
                        //             flight?.fareComponentGroupList?.boundList
                        //               ?.availFlightSegmentList?.flightSegment
                        //               ?.arrivalDateTime
                        //           ) < 10
                        //             ? `0${getTimeInHours(
                        //                 flight?.fareComponentGroupList?.boundList
                        //                   ?.availFlightSegmentList?.flightSegment
                        //                   ?.arrivalDateTime
                        //               )}`
                        //             : getTimeInHours(
                        //                 flight?.fareComponentGroupList?.boundList
                        //                   ?.availFlightSegmentList?.flightSegment
                        //                   ?.arrivalDateTime
                        //               )
                        //         }: ${
                        //           getTimeInMinutes(
                        //             flight?.fareComponentGroupList?.boundList
                        //               ?.availFlightSegmentList?.flightSegment
                        //               ?.arrivalDateTime
                        //           ) < 10
                        //             ? `0${getTimeInMinutes(
                        //                 flight?.fareComponentGroupList?.boundList
                        //                   ?.availFlightSegmentList?.flightSegment
                        //                   ?.arrivalDateTime
                        //               )}`
                        //             : getTimeInMinutes(
                        //                 flight?.fareComponentGroupList?.boundList
                        //                   ?.availFlightSegmentList?.flightSegment
                        //                   ?.arrivalDateTime
                        //               )
                        //         }`,

                        //         cabin: bookingClass?.cabin,
                        //         resBookDesigCode: bookingClass?.resBookDesigCode,
                        //         resBookDesigQuantity: bookingClass?.resBookDesigQuantity,
                        //         resBookDesigStatusCode:
                        //           bookingClass?.resBookDesigStatusCode,
                        //         baseAmount: baseAmountValue,
                        //         totalAmount: baseAmountValue,
                        //         currencyCode:
                        //           flight?.fareComponentGroupList?.fareComponentList[index]
                        //             ?.pricingOverview?.totalAmount?.currency?.code,
                        //         passengerFareInfoList:
                        //           flight?.fareComponentGroupList?.fareComponentList[index]
                        //             ?.passengerFareInfoList,
                        //         flightSegment:
                        //           flight?.fareComponentGroupList?.boundList
                        //             ?.availFlightSegmentList?.flightSegment,
                        //       };
                        //       oneWayFlightsData.push(flightData);
                        //     }
                        //   );
                        // } else {
                        //   let baseAmountValue =
                        //     flight?.fareComponentGroupList?.fareComponentList
                        //       ?.pricingOverview?.totalAmount?.value;
                        //   if (
                        //     flight?.fareComponentGroupList?.fareComponentList
                        //       ?.pricingOverview?.totalBaseFare?.extraCharges[0]?.value
                        //   ) {
                        //     baseAmountValue =
                        //       Number(baseAmountValue) +
                        //       Number(
                        //         flight?.fareComponentGroupList?.fareComponentList
                        //           ?.pricingOverview?.totalBaseFare?.extraCharges[0]?.value
                        //       );
                        //   }
                        //   let flightData = {
                        //     flightName:
                        //       flight?.fareComponentGroupList?.boundList
                        //         ?.availFlightSegmentList?.flightSegment?.airline
                        //         ?.companyFullName,
                        //     flightNumber:
                        //       flight?.fareComponentGroupList?.boundList
                        //         ?.availFlightSegmentList?.flightSegment?.flightNumber,
                        //     stops:
                        //       flight?.fareComponentGroupList?.boundList
                        //         ?.availFlightSegmentList?.flightSegment?.stopQuantity,
                        //     flightDuration:
                        //       flight?.fareComponentGroupList?.boundList?.availFlightSegmentList?.flightSegment?.journeyDuration?.slice(
                        //         2
                        //       ),
                        //     departureCity:
                        //       flight?.fareComponentGroupList?.boundList
                        //         ?.availFlightSegmentList?.flightSegment?.departureAirport
                        //         ?.locationName,
                        //     departureCityCode:
                        //       flight?.fareComponentGroupList?.boundList
                        //         ?.availFlightSegmentList?.flightSegment?.departureAirport
                        //         ?.locationCode,
                        //     departureTime: `${
                        //       getTimeInHours(
                        //         flight?.fareComponentGroupList?.boundList
                        //           ?.availFlightSegmentList?.flightSegment?.departureDateTime
                        //       ) < 10
                        //         ? `0${getTimeInHours(
                        //             flight?.fareComponentGroupList?.boundList
                        //               ?.availFlightSegmentList?.flightSegment
                        //               ?.departureDateTime
                        //           )}`
                        //         : getTimeInHours(
                        //             flight?.fareComponentGroupList?.boundList
                        //               ?.availFlightSegmentList?.flightSegment
                        //               ?.departureDateTime
                        //           )
                        //     }: ${
                        //       getTimeInMinutes(
                        //         flight?.fareComponentGroupList?.boundList
                        //           ?.availFlightSegmentList?.flightSegment?.departureDateTime
                        //       ) < 10
                        //         ? `0${getTimeInMinutes(
                        //             flight?.fareComponentGroupList?.boundList
                        //               ?.availFlightSegmentList?.flightSegment
                        //               ?.departureDateTime
                        //           )}`
                        //         : getTimeInMinutes(
                        //             flight?.fareComponentGroupList?.boundList
                        //               ?.availFlightSegmentList?.flightSegment
                        //               ?.departureDateTime
                        //           )
                        //     }`,
                        //     arrivalCity:
                        //       flight?.fareComponentGroupList?.boundList
                        //         ?.availFlightSegmentList?.flightSegment?.arrivalAirport
                        //         ?.locationName,
                        //     arrivalCityCode:
                        //       flight?.fareComponentGroupList?.boundList
                        //         ?.availFlightSegmentList?.flightSegment?.arrivalAirport
                        //         ?.locationCode,
                        //     arrivalTime: `${
                        //       getTimeInHours(
                        //         flight?.fareComponentGroupList?.boundList
                        //           ?.availFlightSegmentList?.flightSegment?.arrivalDateTime
                        //       ) < 10
                        //         ? `0${getTimeInHours(
                        //             flight?.fareComponentGroupList?.boundList
                        //               ?.availFlightSegmentList?.flightSegment
                        //               ?.arrivalDateTime
                        //           )}`
                        //         : getTimeInHours(
                        //             flight?.fareComponentGroupList?.boundList
                        //               ?.availFlightSegmentList?.flightSegment
                        //               ?.arrivalDateTime
                        //           )
                        //     }: ${
                        //       getTimeInMinutes(
                        //         flight?.fareComponentGroupList?.boundList
                        //           ?.availFlightSegmentList?.flightSegment?.arrivalDateTime
                        //       ) < 10
                        //         ? `0${getTimeInMinutes(
                        //             flight?.fareComponentGroupList?.boundList
                        //               ?.availFlightSegmentList?.flightSegment
                        //               ?.arrivalDateTime
                        //           )}`
                        //         : getTimeInMinutes(
                        //             flight?.fareComponentGroupList?.boundList
                        //               ?.availFlightSegmentList?.flightSegment
                        //               ?.arrivalDateTime
                        //           )
                        //     }`,
                        //     cabin:
                        //       flight?.fareComponentGroupList?.boundList
                        //         ?.availFlightSegmentList?.bookingClassList?.cabin,
                        //     resBookDesigCode:
                        //       flight?.fareComponentGroupList?.boundList
                        //         ?.availFlightSegmentList?.bookingClassList
                        //         ?.resBookDesigCode,
                        //     resBookDesigQuantity:
                        //       flight?.fareComponentGroupList?.boundList
                        //         ?.availFlightSegmentList?.bookingClassList
                        //         ?.resBookDesigQuantity,
                        //     resBookDesigStatusCode:
                        //       flight?.fareComponentGroupList?.boundList
                        //         ?.availFlightSegmentList?.bookingClassList
                        //         ?.resBookDesigStatusCode,
                        //     baseAmount: baseAmountValue,
                        //     totalAmount: baseAmountValue,
                        //     currencyCode:
                        //       flight?.fareComponentGroupList?.fareComponentList
                        //         ?.pricingOverview?.totalAmount?.currency?.code,
                        //     passengerFareInfoList:
                        //       flight?.fareComponentGroupList?.fareComponentList
                        //         ?.passengerFareInfoList,
                        //     flightSegment:
                        //       flight?.fareComponentGroupList?.boundList
                        //         ?.availFlightSegmentList?.flightSegment,
                        //   };
                        //   oneWayFlightsData.push(flightData);
                        // }
                    }
                });
            } else {
                console.log(oneWayTripFlights, "one way single flight ....////");
                if (Object.keys(oneWayTripFlights)?.length > 0) {
                    if (
                        Array.isArray(
                            oneWayTripFlights?.fareComponentGroupList?.boundList
                                ?.availFlightSegmentList
                        )
                    ) {
                        console.log(
                            "one way - single flight with stops ...////",
                            oneWayTripFlights?.fareComponentGroupList
                        );
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
                                    departureTime: `${getTimeInHours(
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
                                        }: ${getTimeInMinutes(
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
                                    arrivalTime: `${getTimeInHours(
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
                                        }: ${getTimeInMinutes(
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
                                        // arrivalDateTime:
                                        //   oneWayTripFlights?.fareComponentGroupList?.boundList
                                        //     ?.availFlightSegmentList[1]?.flightSegment
                                        //     ?.arrivalDateTime,
                                    },
                                    flightSegment_Connecting: {
                                        ...oneWayTripFlights?.fareComponentGroupList?.boundList
                                            ?.availFlightSegmentList[1]?.flightSegment,
                                        // arrivalDateTime:
                                        //   oneWayTripFlights?.fareComponentGroupList?.boundList
                                        //     ?.availFlightSegmentList[1]?.flightSegment
                                        //     ?.arrivalDateTime,
                                    },
                                };

                                oneWayFlightsData.push(flightData);
                            }
                        );
                    } else {
                        console.log(
                            "one way - single flight without stops ...////",
                            oneWayTripFlights?.fareComponentGroupList
                        );

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

                                        departureTime: `${getTimeInHours(
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
                                            }: ${getTimeInMinutes(
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
                                        arrivalTime: `${getTimeInHours(
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
                                            }: ${getTimeInMinutes(
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

                                departureTime: `${getTimeInHours(
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
                                    }: ${getTimeInMinutes(
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
                                arrivalTime: `${getTimeInHours(
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
                                    }: ${getTimeInMinutes(
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
                console.log(twoWayTripFlights, "two way flights ...////");
                if (Array.isArray(twoWayTripFlights)) {
                    twoWayTripFlights?.map((flight) => {
                        if (Array.isArray(flight?.fareComponentGroupList)) {
                            // console.log(
                            //   "two way - multiple flights with stops ...//// redundant KC case",
                            //   flight?.fareComponentGroupList
                            // );
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

                                        departureTime: `${getTimeInHours(
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
                                            }: ${getTimeInMinutes(
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
                                        arrivalTime: `${getTimeInHours(
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
                                            }: ${getTimeInMinutes(
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
                                    // twoWayFlightsData.push(flightData);
                                }
                            );
                        } else {
                            if (
                                Array.isArray(
                                    flight?.fareComponentGroupList?.boundList
                                        ?.availFlightSegmentList
                                )
                            ) {
                                console.log(
                                    "two way - multiple flights with stops ...////",
                                    flight?.fareComponentGroupList?.boundList
                                        ?.availFlightSegmentList[0]
                                );

                                // flight?.fareComponentGroupList?.boundList?.availFlightSegmentList[0]?.bookingClassList.map(
                                //   (bookingClass, index) => {
                                //     let baseAmountValue =
                                //       flight?.fareComponentGroupList?.fareComponentList[
                                //         index
                                //       ]?.pricingOverview?.totalAmount?.value;
                                //     if (
                                //       flight?.fareComponentGroupList?.fareComponentList[
                                //         index
                                //       ]?.pricingOverview?.totalBaseFare?.extraCharges[0]?.value
                                //     ) {
                                //       baseAmountValue =
                                //         Number(baseAmountValue) +
                                //         Number(
                                //           flight?.fareComponentGroupList
                                //             ?.fareComponentList[index]?.pricingOverview
                                //             ?.totalBaseFare?.extraCharges[0]?.value
                                //         );
                                //     }
                                //     let flightData = {
                                //       connectingFlight: true,
                                //       flightName:
                                //         flight?.fareComponentGroupList?.boundList
                                //           ?.availFlightSegmentList[0]?.flightSegment?.airline
                                //           ?.companyFullName,
                                //       flightNumber:
                                //         flight?.fareComponentGroupList?.boundList
                                //           ?.availFlightSegmentList[0]?.flightSegment?.flightNumber,
                                //       flightNumber_RT:
                                //         flight?.fareComponentGroupList?.boundList
                                //           ?.availFlightSegmentList[1]?.flightSegment
                                //           ?.flightNumber ?? null,
                                //       stops:
                                //         flight?.fareComponentGroupList?.boundList
                                //           ?.availFlightSegmentList.length - 1,

                                //       flightDuration: connectingFlightDuration(
                                //         flight?.fareComponentGroupList?.boundList
                                //           ?.availFlightSegmentList[0]?.flightSegment
                                //           ?.departureDateTimeUTC,
                                //         flight?.fareComponentGroupList?.boundList
                                //           ?.availFlightSegmentList[1]?.flightSegment
                                //           ?.arrivalDateTimeUTC
                                //       ),
                                //       departureCity:
                                //         flight?.fareComponentGroupList?.boundList
                                //           ?.availFlightSegmentList[0]?.flightSegment
                                //           ?.departureAirport?.locationName,
                                //       stopOverCity:
                                //         flight?.fareComponentGroupList?.boundList
                                //           ?.availFlightSegmentList[0]?.flightSegment?.arrivalAirport
                                //           ?.locationCode ?? null,
                                //       departureCityCode:
                                //         flight?.fareComponentGroupList?.boundList
                                //           ?.availFlightSegmentList[0]?.flightSegment
                                //           ?.departureAirport?.locationCode,
                                //       departureTime: `${
                                //         getTimeInHours(
                                //           flight?.fareComponentGroupList?.boundList
                                //             ?.availFlightSegmentList[0]?.flightSegment
                                //             ?.departureDateTime
                                //         ) < 10
                                //           ? `0${getTimeInHours(
                                //               flight?.fareComponentGroupList?.boundList
                                //                 ?.availFlightSegmentList[0]?.flightSegment
                                //                 ?.departureDateTime
                                //             )}`
                                //           : getTimeInHours(
                                //               flight?.fareComponentGroupList?.boundList
                                //                 ?.availFlightSegmentList[0]?.flightSegment
                                //                 ?.departureDateTime
                                //             )
                                //       }: ${
                                //         getTimeInMinutes(
                                //           flight?.fareComponentGroupList?.boundList
                                //             ?.availFlightSegmentList[0]?.flightSegment
                                //             ?.departureDateTime
                                //         ) < 10
                                //           ? `0${getTimeInMinutes(
                                //               flight?.fareComponentGroupList?.boundList
                                //                 ?.availFlightSegmentList[0]?.flightSegment
                                //                 ?.departureDateTime
                                //             )}`
                                //           : getTimeInMinutes(
                                //               flight?.fareComponentGroupList?.boundList
                                //                 ?.availFlightSegmentList[0]?.flightSegment
                                //                 ?.departureDateTime
                                //             )
                                //       }`,
                                //       arrivalCity:
                                //         flight?.fareComponentGroupList?.boundList
                                //           ?.availFlightSegmentList[1]?.flightSegment?.arrivalAirport
                                //           ?.locationName,
                                //       arrivalCityCode:
                                //         flight?.fareComponentGroupList?.boundList
                                //           ?.availFlightSegmentList[1]?.flightSegment?.arrivalAirport
                                //           ?.locationCode,
                                //       arrivalTime: `${
                                //         getTimeInHours(
                                //           flight?.fareComponentGroupList?.boundList
                                //             ?.availFlightSegmentList[1]?.flightSegment
                                //             ?.arrivalDateTime
                                //         ) < 10
                                //           ? `0${getTimeInHours(
                                //               flight?.fareComponentGroupList?.boundList
                                //                 ?.availFlightSegmentList[1]?.flightSegment
                                //                 ?.arrivalDateTime
                                //             )}`
                                //           : getTimeInHours(
                                //               flight?.fareComponentGroupList?.boundList
                                //                 ?.availFlightSegmentList[1]?.flightSegment
                                //                 ?.arrivalDateTime
                                //             )
                                //       }: ${
                                //         getTimeInMinutes(
                                //           flight?.fareComponentGroupList?.boundList
                                //             ?.availFlightSegmentList[1]?.flightSegment
                                //             ?.arrivalDateTime
                                //         ) < 10
                                //           ? `0${getTimeInMinutes(
                                //               flight?.fareComponentGroupList?.boundList
                                //                 ?.availFlightSegmentList[1]?.flightSegment
                                //                 ?.arrivalDateTime
                                //             )}`
                                //           : getTimeInMinutes(
                                //               flight?.fareComponentGroupList?.boundList
                                //                 ?.availFlightSegmentList[1]?.flightSegment
                                //                 ?.arrivalDateTime
                                //             )
                                //       }`,

                                //       cabin: bookingClass?.cabin,
                                //       resBookDesigCode: bookingClass?.resBookDesigCode,
                                //       resBookDesigQuantity: bookingClass?.resBookDesigQuantity,
                                //       resBookDesigStatusCode: bookingClass?.resBookDesigStatusCode,
                                //       cabin_Connecting: bookingClass?.cabin,
                                //       resBookDesigCode_Connecting: bookingClass?.resBookDesigCode,
                                //       resBookDesigQuantity_Connecting:
                                //         bookingClass?.resBookDesigQuantity,
                                //       resBookDesigStatusCode_Connecting:
                                //         bookingClass?.resBookDesigStatusCode,
                                //       baseAmount: baseAmountValue,
                                //       totalAmount: baseAmountValue,
                                //       currencyCode:
                                //         flight?.fareComponentGroupList
                                //           ?.fareComponentList[index]?.pricingOverview?.totalAmount
                                //           ?.currency?.code,
                                //       passengerFareInfoList:
                                //         flight?.fareComponentGroupList
                                //           ?.fareComponentList[index]?.passengerFareInfoList,
                                //       flightSegment: {
                                //         ...flight?.fareComponentGroupList?.boundList
                                //           ?.availFlightSegmentList[0]?.flightSegment,
                                //         // arrivalDateTime:
                                //         //   flight?.fareComponentGroupList?.boundList
                                //         //     ?.availFlightSegmentList[1]?.flightSegment
                                //         //     ?.arrivalDateTime,
                                //       },
                                //       flightSegment_Connecting: {
                                //         ...flight?.fareComponentGroupList?.boundList
                                //           ?.availFlightSegmentList[1]?.flightSegment,
                                //         // arrivalDateTime:
                                //         //   flight?.fareComponentGroupList?.boundList
                                //         //     ?.availFlightSegmentList[1]?.flightSegment
                                //         //     ?.arrivalDateTime,
                                //       },
                                //     };

                                //     oneWayFlightsData.push(flightData);
                                //   }
                                // );

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
                                            departureTime: `${getTimeInHours(
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
                                                }: ${getTimeInMinutes(
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
                                            arrivalTime: `${getTimeInHours(
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
                                                }: ${getTimeInMinutes(
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
                                                // arrivalDateTime:
                                                //   flight?.fareComponentGroupList?.boundList
                                                //     ?.availFlightSegmentList[1]?.flightSegment
                                                //     ?.arrivalDateTime,
                                            },
                                            flightSegment_Connecting: {
                                                ...flight?.fareComponentGroupList?.boundList
                                                    ?.availFlightSegmentList[1]?.flightSegment,
                                                // arrivalDateTime:
                                                //   flight?.fareComponentGroupList?.boundList
                                                //     ?.availFlightSegmentList[1]?.flightSegment
                                                //     ?.arrivalDateTime,
                                            },
                                        };

                                        twoWayFlightsData.push(flightData);
                                    }
                                );
                            } else {
                                console.log(
                                    "two way - multiple flights without stops ...////",
                                    flight?.fareComponentGroupList?.boundList
                                        ?.availFlightSegmentList
                                );

                                // flight?.fareComponentGroupList?.boundList?.availFlightSegmentList?.bookingClassList.map(
                                //   (bookingClass, index) => {
                                //     let baseAmountValue =
                                //       flight?.fareComponentGroupList?.fareComponentList[index]
                                //         ?.pricingOverview?.totalAmount?.value;
                                //     if (
                                //       flight?.fareComponentGroupList?.fareComponentList[index]
                                //         ?.pricingOverview?.totalBaseFare?.extraCharges[0]?.value
                                //     ) {
                                //       baseAmountValue =
                                //         Number(baseAmountValue) +
                                //         Number(
                                //           flight?.fareComponentGroupList?.fareComponentList[index]
                                //             ?.pricingOverview?.totalBaseFare?.extraCharges[0]
                                //             ?.value
                                //         );
                                //     }
                                //     let flightData = {
                                //       flightName:
                                //         flight?.fareComponentGroupList?.boundList
                                //           ?.availFlightSegmentList?.flightSegment?.airline
                                //           ?.companyFullName,
                                //       flightNumber:
                                //         flight?.fareComponentGroupList?.boundList
                                //           ?.availFlightSegmentList?.flightSegment?.flightNumber,
                                //       stops:
                                //         flight?.fareComponentGroupList?.boundList
                                //           ?.availFlightSegmentList?.flightSegment?.stopQuantity,
                                //       flightDuration:
                                //         flight?.fareComponentGroupList?.boundList?.availFlightSegmentList?.flightSegment?.journeyDuration?.slice(
                                //           2
                                //         ),
                                //       departureCity:
                                //         flight?.fareComponentGroupList?.boundList
                                //           ?.availFlightSegmentList?.flightSegment
                                //           ?.departureAirport?.locationName,
                                //       departureCityCode:
                                //         flight?.fareComponentGroupList?.boundList
                                //           ?.availFlightSegmentList?.flightSegment
                                //           ?.departureAirport?.locationCode,
                                //       departureTime: `${
                                //         getTimeInHours(
                                //           flight?.fareComponentGroupList?.boundList
                                //             ?.availFlightSegmentList?.flightSegment
                                //             ?.departureDateTime
                                //         ) < 10
                                //           ? `0${getTimeInHours(
                                //               flight?.fareComponentGroupList?.boundList
                                //                 ?.availFlightSegmentList?.flightSegment
                                //                 ?.departureDateTime
                                //             )}`
                                //           : getTimeInHours(
                                //               flight?.fareComponentGroupList?.boundList
                                //                 ?.availFlightSegmentList?.flightSegment
                                //                 ?.departureDateTime
                                //             )
                                //       }: ${
                                //         getTimeInMinutes(
                                //           flight?.fareComponentGroupList?.boundList
                                //             ?.availFlightSegmentList?.flightSegment
                                //             ?.departureDateTime
                                //         ) < 10
                                //           ? `0${getTimeInMinutes(
                                //               flight?.fareComponentGroupList?.boundList
                                //                 ?.availFlightSegmentList?.flightSegment
                                //                 ?.departureDateTime
                                //             )}`
                                //           : getTimeInMinutes(
                                //               flight?.fareComponentGroupList?.boundList
                                //                 ?.availFlightSegmentList?.flightSegment
                                //                 ?.departureDateTime
                                //             )
                                //       }`,
                                //       arrivalCity:
                                //         flight?.fareComponentGroupList?.boundList
                                //           ?.availFlightSegmentList?.flightSegment?.arrivalAirport
                                //           ?.locationName,
                                //       arrivalCityCode:
                                //         flight?.fareComponentGroupList?.boundList
                                //           ?.availFlightSegmentList?.flightSegment?.arrivalAirport
                                //           ?.locationCode,
                                //       arrivalTime: `${
                                //         getTimeInHours(
                                //           flight?.fareComponentGroupList?.boundList
                                //             ?.availFlightSegmentList?.flightSegment
                                //             ?.arrivalDateTime
                                //         ) < 10
                                //           ? `0${getTimeInHours(
                                //               flight?.fareComponentGroupList?.boundList
                                //                 ?.availFlightSegmentList?.flightSegment
                                //                 ?.arrivalDateTime
                                //             )}`
                                //           : getTimeInHours(
                                //               flight?.fareComponentGroupList?.boundList
                                //                 ?.availFlightSegmentList?.flightSegment
                                //                 ?.arrivalDateTime
                                //             )
                                //       }: ${
                                //         getTimeInMinutes(
                                //           flight?.fareComponentGroupList?.boundList
                                //             ?.availFlightSegmentList?.flightSegment
                                //             ?.arrivalDateTime
                                //         ) < 10
                                //           ? `0${getTimeInMinutes(
                                //               flight?.fareComponentGroupList?.boundList
                                //                 ?.availFlightSegmentList?.flightSegment
                                //                 ?.arrivalDateTime
                                //             )}`
                                //           : getTimeInMinutes(
                                //               flight?.fareComponentGroupList?.boundList
                                //                 ?.availFlightSegmentList?.flightSegment
                                //                 ?.arrivalDateTime
                                //             )
                                //       }`,

                                //       cabin: bookingClass?.cabin,
                                //       resBookDesigCode: bookingClass?.resBookDesigCode,
                                //       resBookDesigQuantity: bookingClass?.resBookDesigQuantity,
                                //       resBookDesigStatusCode:
                                //         bookingClass?.resBookDesigStatusCode,
                                //       baseAmount: baseAmountValue,
                                //       totalAmount: baseAmountValue,
                                //       currencyCode:
                                //         flight?.fareComponentGroupList?.fareComponentList[index]
                                //           ?.pricingOverview?.totalAmount?.currency?.code,
                                //       passengerFareInfoList:
                                //         flight?.fareComponentGroupList?.fareComponentList[index]
                                //           ?.passengerFareInfoList,
                                //       flightSegment:
                                //         flight?.fareComponentGroupList?.boundList
                                //           ?.availFlightSegmentList?.flightSegment,
                                //     };
                                //     oneWayFlightsData.push(flightData);
                                //   }
                                // );

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

                                            departureTime: `${getTimeInHours(
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
                                                }: ${getTimeInMinutes(
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
                                            arrivalTime: `${getTimeInHours(
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
                                                }: ${getTimeInMinutes(
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

                            // console.log(
                            //   "two way -multiple flights without stops ...////",
                            //   flight?.fareComponentGroupList
                            // );

                            // if (
                            //   Array.isArray(
                            //     flight?.fareComponentGroupList?.boundList
                            //       ?.availFlightSegmentList?.bookingClassList
                            //   )
                            // ) {
                            //   flight?.fareComponentGroupList?.boundList?.availFlightSegmentList?.bookingClassList.map(
                            //     (bookingClass, index) => {
                            //       let baseAmountValue =
                            //         flight?.fareComponentGroupList?.fareComponentList[index]
                            //           ?.pricingOverview?.totalAmount?.value;
                            //       if (
                            //         flight?.fareComponentGroupList?.fareComponentList[index]
                            //           ?.pricingOverview?.totalBaseFare?.extraCharges[0]?.value
                            //       ) {
                            //         baseAmountValue =
                            //           Number(baseAmountValue) +
                            //           Number(
                            //             flight?.fareComponentGroupList?.fareComponentList[
                            //               index
                            //             ]?.pricingOverview?.totalBaseFare?.extraCharges[0]
                            //               ?.value
                            //           );
                            //       }
                            //       let flightData = {
                            //         flightName:
                            //           flight?.fareComponentGroupList?.boundList
                            //             ?.availFlightSegmentList?.flightSegment?.airline
                            //             ?.companyFullName,
                            //         flightNumber:
                            //           flight?.fareComponentGroupList?.boundList
                            //             ?.availFlightSegmentList?.flightSegment?.flightNumber,
                            //         stops:
                            //           flight?.fareComponentGroupList?.boundList
                            //             ?.availFlightSegmentList?.flightSegment?.stopQuantity,
                            //         flightDuration:
                            //           flight?.fareComponentGroupList?.boundList?.availFlightSegmentList?.flightSegment?.journeyDuration?.slice(
                            //             2
                            //           ),
                            //         departureCity:
                            //           flight?.fareComponentGroupList?.boundList
                            //             ?.availFlightSegmentList?.flightSegment
                            //             ?.departureAirport?.locationName,
                            //         departureCityCode:
                            //           flight?.fareComponentGroupList?.boundList
                            //             ?.availFlightSegmentList?.flightSegment
                            //             ?.departureAirport?.locationCode,

                            //         departureTime: `${
                            //           getTimeInHours(
                            //             flight?.fareComponentGroupList?.boundList
                            //               ?.availFlightSegmentList?.flightSegment
                            //               ?.departureDateTime
                            //           ) < 10
                            //             ? `0${getTimeInHours(
                            //                 flight?.fareComponentGroupList?.boundList
                            //                   ?.availFlightSegmentList?.flightSegment
                            //                   ?.departureDateTime
                            //               )}`
                            //             : getTimeInHours(
                            //                 flight?.fareComponentGroupList?.boundList
                            //                   ?.availFlightSegmentList?.flightSegment
                            //                   ?.departureDateTime
                            //               )
                            //         }: ${
                            //           getTimeInMinutes(
                            //             flight?.fareComponentGroupList?.boundList
                            //               ?.availFlightSegmentList?.flightSegment
                            //               ?.departureDateTime
                            //           ) < 10
                            //             ? `0${getTimeInMinutes(
                            //                 flight?.fareComponentGroupList?.boundList
                            //                   ?.availFlightSegmentList?.flightSegment
                            //                   ?.departureDateTime
                            //               )}`
                            //             : getTimeInMinutes(
                            //                 flight?.fareComponentGroupList?.boundList
                            //                   ?.availFlightSegmentList?.flightSegment
                            //                   ?.departureDateTime
                            //               )
                            //         }`,

                            //         arrivalCity:
                            //           flight?.fareComponentGroupList?.boundList
                            //             ?.availFlightSegmentList?.flightSegment
                            //             ?.arrivalAirport?.locationName,
                            //         arrivalCityCode:
                            //           flight?.fareComponentGroupList?.boundList
                            //             ?.availFlightSegmentList?.flightSegment
                            //             ?.arrivalAirport?.locationCode,
                            //         arrivalTime: `${
                            //           getTimeInHours(
                            //             flight?.fareComponentGroupList?.boundList
                            //               ?.availFlightSegmentList?.flightSegment
                            //               ?.arrivalDateTime
                            //           ) < 10
                            //             ? `0${getTimeInHours(
                            //                 flight?.fareComponentGroupList?.boundList
                            //                   ?.availFlightSegmentList?.flightSegment
                            //                   ?.arrivalDateTime
                            //               )}`
                            //             : getTimeInHours(
                            //                 flight?.fareComponentGroupList?.boundList
                            //                   ?.availFlightSegmentList?.flightSegment
                            //                   ?.arrivalDateTime
                            //               )
                            //         }: ${
                            //           getTimeInMinutes(
                            //             flight?.fareComponentGroupList?.boundList
                            //               ?.availFlightSegmentList?.flightSegment
                            //               ?.arrivalDateTime
                            //           ) < 10
                            //             ? `0${getTimeInMinutes(
                            //                 flight?.fareComponentGroupList?.boundList
                            //                   ?.availFlightSegmentList?.flightSegment
                            //                   ?.arrivalDateTime
                            //               )}`
                            //             : getTimeInMinutes(
                            //                 flight?.fareComponentGroupList?.boundList
                            //                   ?.availFlightSegmentList?.flightSegment
                            //                   ?.arrivalDateTime
                            //               )
                            //         }`,

                            //         cabin: bookingClass?.cabin,
                            //         resBookDesigCode: bookingClass?.resBookDesigCode,
                            //         resBookDesigQuantity: bookingClass?.resBookDesigQuantity,
                            //         resBookDesigStatusCode:
                            //           bookingClass?.resBookDesigStatusCode,
                            //         baseAmount: baseAmountValue,
                            //         totalAmount: baseAmountValue,
                            //         currencyCode:
                            //           flight?.fareComponentGroupList?.fareComponentList[index]
                            //             ?.pricingOverview?.totalAmount?.currency?.code,
                            //         passengerFareInfoList:
                            //           flight?.fareComponentGroupList?.fareComponentList[index]
                            //             ?.passengerFareInfoList,
                            //         flightSegment:
                            //           flight?.fareComponentGroupList?.boundList
                            //             ?.availFlightSegmentList?.flightSegment,
                            //       };
                            //       twoWayFlightsData.push(flightData);
                            //     }
                            //   );
                            // } else {
                            //   let baseAmountValue =
                            //     flight?.fareComponentGroupList?.fareComponentList
                            //       ?.pricingOverview?.totalAmount?.value;
                            //   if (
                            //     flight?.fareComponentGroupList?.fareComponentList
                            //       ?.pricingOverview?.totalBaseFare?.extraCharges[0]?.value
                            //   ) {
                            //     baseAmountValue =
                            //       Number(baseAmountValue) +
                            //       Number(
                            //         flight?.fareComponentGroupList?.fareComponentList
                            //           ?.pricingOverview?.totalBaseFare?.extraCharges[0]?.value
                            //       );
                            //   }
                            //   let flightData = {
                            //     flightName:
                            //       flight?.fareComponentGroupList?.boundList
                            //         ?.availFlightSegmentList?.flightSegment?.airline
                            //         ?.companyFullName,
                            //     flightNumber:
                            //       flight?.fareComponentGroupList?.boundList
                            //         ?.availFlightSegmentList?.flightSegment?.flightNumber,
                            //     stops:
                            //       flight?.fareComponentGroupList?.boundList
                            //         ?.availFlightSegmentList?.flightSegment?.stopQuantity,
                            //     flightDuration:
                            //       flight?.fareComponentGroupList?.boundList?.availFlightSegmentList?.flightSegment?.journeyDuration?.slice(
                            //         2
                            //       ),
                            //     departureCity:
                            //       flight?.fareComponentGroupList?.boundList
                            //         ?.availFlightSegmentList?.flightSegment?.departureAirport
                            //         ?.locationName,
                            //     departureCityCode:
                            //       flight?.fareComponentGroupList?.boundList
                            //         ?.availFlightSegmentList?.flightSegment?.departureAirport
                            //         ?.locationCode,

                            //     departureTime: `${
                            //       getTimeInHours(
                            //         flight?.fareComponentGroupList?.boundList
                            //           ?.availFlightSegmentList?.flightSegment
                            //           ?.departureDateTime
                            //       ) < 10
                            //         ? `0${getTimeInHours(
                            //             flight?.fareComponentGroupList?.boundList
                            //               ?.availFlightSegmentList?.flightSegment
                            //               ?.departureDateTime
                            //           )}`
                            //         : getTimeInHours(
                            //             flight?.fareComponentGroupList?.boundList
                            //               ?.availFlightSegmentList?.flightSegment
                            //               ?.departureDateTime
                            //           )
                            //     }: ${
                            //       getTimeInMinutes(
                            //         flight?.fareComponentGroupList?.boundList
                            //           ?.availFlightSegmentList?.flightSegment
                            //           ?.departureDateTime
                            //       ) < 10
                            //         ? `0${getTimeInMinutes(
                            //             flight?.fareComponentGroupList?.boundList
                            //               ?.availFlightSegmentList?.flightSegment
                            //               ?.departureDateTime
                            //           )}`
                            //         : getTimeInMinutes(
                            //             flight?.fareComponentGroupList?.boundList
                            //               ?.availFlightSegmentList?.flightSegment
                            //               ?.departureDateTime
                            //           )
                            //     }`,

                            //     arrivalCity:
                            //       flight?.fareComponentGroupList?.boundList
                            //         ?.availFlightSegmentList?.flightSegment?.arrivalAirport
                            //         ?.locationName,
                            //     arrivalCityCode:
                            //       flight?.fareComponentGroupList?.boundList
                            //         ?.availFlightSegmentList?.flightSegment?.arrivalAirport
                            //         ?.locationCode,
                            //     arrivalTime: `${
                            //       getTimeInHours(
                            //         flight?.fareComponentGroupList?.boundList
                            //           ?.availFlightSegmentList?.flightSegment?.arrivalDateTime
                            //       ) < 10
                            //         ? `0${getTimeInHours(
                            //             flight?.fareComponentGroupList?.boundList
                            //               ?.availFlightSegmentList?.flightSegment
                            //               ?.arrivalDateTime
                            //           )}`
                            //         : getTimeInHours(
                            //             flight?.fareComponentGroupList?.boundList
                            //               ?.availFlightSegmentList?.flightSegment
                            //               ?.arrivalDateTime
                            //           )
                            //     }: ${
                            //       getTimeInMinutes(
                            //         flight?.fareComponentGroupList?.boundList
                            //           ?.availFlightSegmentList?.flightSegment?.arrivalDateTime
                            //       ) < 10
                            //         ? `0${getTimeInMinutes(
                            //             flight?.fareComponentGroupList?.boundList
                            //               ?.availFlightSegmentList?.flightSegment
                            //               ?.arrivalDateTime
                            //           )}`
                            //         : getTimeInMinutes(
                            //             flight?.fareComponentGroupList?.boundList
                            //               ?.availFlightSegmentList?.flightSegment
                            //               ?.arrivalDateTime
                            //           )
                            //     }`,

                            //     cabin:
                            //       flight?.fareComponentGroupList?.boundList
                            //         ?.availFlightSegmentList?.bookingClassList?.cabin,
                            //     resBookDesigCode:
                            //       flight?.fareComponentGroupList?.boundList
                            //         ?.availFlightSegmentList?.bookingClassList
                            //         ?.resBookDesigCode,
                            //     resBookDesigQuantity:
                            //       flight?.fareComponentGroupList?.boundList
                            //         ?.availFlightSegmentList?.bookingClassList
                            //         ?.resBookDesigQuantity,
                            //     resBookDesigStatusCode:
                            //       flight?.fareComponentGroupList?.boundList
                            //         ?.availFlightSegmentList?.bookingClassList
                            //         ?.resBookDesigStatusCode,
                            //     baseAmount: baseAmountValue,
                            //     totalAmount: baseAmountValue,
                            //     currencyCode:
                            //       flight?.fareComponentGroupList?.fareComponentList
                            //         ?.pricingOverview?.totalAmount?.currency?.code,
                            //     passengerFareInfoList:
                            //       flight?.fareComponentGroupList?.fareComponentList
                            //         ?.passengerFareInfoList,
                            //     flightSegment:
                            //       flight?.fareComponentGroupList?.boundList
                            //         ?.availFlightSegmentList?.flightSegment,
                            //   };
                            //   twoWayFlightsData.push(flightData);
                            // }
                        }
                    });
                } else {
                    if (
                        Array.isArray(
                            twoWayTripFlights?.fareComponentGroupList?.boundList
                                ?.availFlightSegmentList
                        )
                    ) {
                        // console.log(
                        //   "two way - single flight with stops ...////",
                        //   twoWayTripFlights?.fareComponentGroupList
                        // );
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
                                    departureTime: `${getTimeInHours(
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
                                        }: ${getTimeInMinutes(
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
                                    arrivalTime: `${getTimeInHours(
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
                                        }: ${getTimeInMinutes(
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
                                        // arrivalDateTime:
                                        //   twoWayTripFlights?.fareComponentGroupList?.boundList
                                        //     ?.availFlightSegmentList[1]?.flightSegment
                                        //     ?.arrivalDateTime,
                                    },
                                    flightSegment_Connecting: {
                                        ...twoWayTripFlights?.fareComponentGroupList?.boundList
                                            ?.availFlightSegmentList[1]?.flightSegment,
                                        // arrivalDateTime:
                                        //   twoWayTripFlights?.fareComponentGroupList?.boundList
                                        //     ?.availFlightSegmentList[1]?.flightSegment
                                        //     ?.arrivalDateTime,
                                    },
                                };

                                twoWayFlightsData.push(flightData);
                            }
                        );
                    } else {
                        // console.log(
                        //   "two way -single flight without stops ...////",
                        //   twoWayTripFlights?.fareComponentGroupList
                        // );
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

                                        departureTime: `${getTimeInHours(
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
                                            }: ${getTimeInMinutes(
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
                                        arrivalTime: `${getTimeInHours(
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
                                            }: ${getTimeInMinutes(
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

                                departureTime: `${getTimeInHours(
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
                                    }: ${getTimeInMinutes(
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
                                arrivalTime: `${getTimeInHours(
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
                                    }: ${getTimeInMinutes(
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
        // handleAirlineChange();
        setSearchResultList(searchResult);

        if (searchResult?.success !== true) {
            setShowNoFlightsMessage(true);
        }
        setAirline(location?.state?.searchRequestBody?.airlineCode);
        setTripType(location?.state?.searchRequestBody?.tripType);
        setOrigin(location?.state?.origin);
        setDestination(location?.state?.destination);
        let departureDate = location?.state?.departureDate
            ? dayjs(
                `${location?.state?.departureDate?.["$y"]}-${location?.state?.departureDate?.["$M"] + 1
                }-${location?.state?.departureDate?.["$D"]}`
            )
            : null;
        let returnDate = location?.state?.returnDate
            ? dayjs(
                `${location?.state?.returnDate?.["$y"]}-${location?.state?.returnDate?.["$M"] + 1
                }-${location?.state?.returnDate?.["$D"]}`
            )
            : null;
        setDepartureDate(departureDate);
        setReturnDate(returnDate);
        let totalPax = 0;
        let adultCount = 0;
        let childCount = 0;
        let infantCount = 0;
        location?.state?.searchRequestBody?.passengerTypeQuantityList?.forEach(
            (passenger) => {
                totalPax = totalPax + Number(passenger.quantity);
                if (passenger?.passengerType === "ADLT") {
                    setAdult(Number(passenger.quantity));
                    adultCount = Number(passenger.quantity)
                }
                if (passenger?.passengerType === "CHLD") {
                    setChild(Number(passenger.quantity));
                    childCount = Number(passenger.quantity)
                }
                if (passenger?.passengerType === "INFT") {
                    setInfant(Number(passenger.quantity));
                    infantCount = Number(passenger.quantity)
                }
            }
        );
        if (totalPax < 2) {
            setShowFlexiFare(true);
        }
        setPassengerCount({
            adult: adultCount,
            child: childCount,
            infant: infantCount
        })
    }, []);

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

    const handleAirlineChange = (airline) => {
        setAirline(airline);
    };

    const handleClose = () => setShowBookingDetailsDialog(false);
    const handleShow = () => setShowBookingDetailsDialog(true);



    const handleSearchFlights = () => {
        setPassengerCount({
            adult: adult,
            child: child,
            infant: infant
        })
        setoneWayTripDetails(null);
        setTwoWayTripDetails(null);
        setFlightClassList(false);
        setShowNoFlightsMessage(false);
        setShowLoader(true);
        setShowFlexiFare(false);
        setShowOneWayFlexiFareCard(null);
        setShowTwoWayFlexiFareCard(null);
        const originDestinationInformationList = [];
        if (tripType === "ROUND_TRIP") {
            originDestinationInformationList[0] = {
                departureDateTime: `${departureDate["$y"]}-${departureDate["$M"] + 1 < 10
                    ? `0${departureDate["$M"] + 1}`
                    : `${departureDate["$M"] + 1}`
                    }-${departureDate["$D"] < 10
                        ? `0${departureDate["$D"]}`
                        : departureDate["$D"]
                    }`,
                destinationLocation: destination[0].split(",")[0],
                originLocation: origin[0].split(",")[0],
            };
            originDestinationInformationList[1] = {
                departureDateTime: `${returnDate["$y"]}-${returnDate["$M"] + 1 < 10
                    ? `0${returnDate["$M"] + 1}`
                    : `${returnDate["$M"] + 1}`
                    }-${returnDate["$D"] < 10 ? `0${returnDate["$D"]}` : returnDate["$D"]}`,
                destinationLocation: origin[0].split(",")[0],
                originLocation: destination[0].split(",")[0],
            };
        } else {
            originDestinationInformationList[0] = {
                departureDateTime: `${departureDate["$y"]}-${departureDate["$M"] + 1 < 10
                    ? `0${departureDate["$M"] + 1}`
                    : `${departureDate["$M"] + 1}`
                    }-${departureDate["$D"] < 10
                        ? `0${departureDate["$D"]}`
                        : departureDate["$D"]
                    }`,
                destinationLocation: destination[0].split(",")[0],
                originLocation: origin[0].split(",")[0],
            };
        }

        const reqBody = {
            passengerTypeQuantityList: [
                {
                    passengerType: "ADLT",
                    quantity: String(adult ?? 0),
                },
                {
                    passengerType: "CHLD",
                    quantity: String(child ?? 0),
                },
                {
                    passengerType: "INFT",
                    quantity: String(infant ?? 0),
                },
            ],
            originDestinationInformationList: originDestinationInformationList,
            tripType: tripType,
            currencyCode: "INR",
            airlineCode: airline,
            // islive: "true",
        };

        // const reqBody = {
        //   passengerTypeQuantityList: [
        //     {
        //       passengerType: "ADLT",
        //       quantity: "1",
        //     },
        //     {
        //       passengerType: "CHLD",
        //       quantity: "0",
        //     },
        //     {
        //       passengerType: "INFT",
        //       quantity: "0",
        //     },
        //   ],
        //   originDestinationInformationList: [
        //     {
        //       departureDateTime: "2024-03-13",
        //       destinationLocation: "LHR",
        //       originLocation: "DEL",
        //     },
        //   ],
        //   tripType: "ONE_WAY",
        //   currencyCode: "INR",
        //   airlineCode: "T5",
        // };

        const headers = {
            Authorization: localStorage.getItem("AuthToken"),
            Accept: "application/json",
        };
        // setSearchResult(null);
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
                    console.log("SearchResultList--->", searchResultList);
                } else {
                    setShowNoFlightsMessage(true);
                }
                setShowLoader(false);
                if (adult + child + infant < 2) {
                    setShowFlexiFare(true);
                }
            })
            .catch((error) => {
                setShowLoader(false);
                if (error.response.status === 401) {
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
                    addOnAmount = pkgInfo?.price?.value * (passengerCount.adult + passengerCount.child);
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
                    addOnAmount = pkgInfo?.price?.value * (passengerCount.adult + passengerCount.child);
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
                        totalAmount: `${Number(tripDetails?.baseAmount) + Number(addOnAmount)
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
                        totalAmount: `${Number(tripDetails?.baseAmount) + Number(addOnAmount)
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
            return (
                flightClassList && (
                    <>
                        <div className="search-result-cards-wrapper">
                            <div className="search-result-col">
                                {flightClassList[0]?.map((list, index) => {
                                    let passengerFareInfoList = Array.isArray(
                                        list?.passengerFareInfoList
                                    )
                                        ? list?.passengerFareInfoList[0]
                                        : list?.passengerFareInfoList;
                                    let standardPlusFare = 0;
                                    let comfortFare = 0;
                                    let comfortPlusFare = 0;
                                    if (passengerFareInfoList?.fareInfoList?.farePkgInfoList) {
                                        if (Array.isArray(list?.passengerFareInfoList)) {
                                            list?.passengerFareInfoList?.forEach((paxfareInfo) => {
                                                standardPlusFare =
                                                    Number(
                                                        paxfareInfo?.fareInfoList?.farePkgInfoList[0]
                                                            ?.price?.value
                                                    );
                                                comfortFare =
                                                    Number(
                                                        paxfareInfo?.fareInfoList?.farePkgInfoList[1]
                                                            ?.price?.value
                                                    );
                                                comfortPlusFare =
                                                    Number(
                                                        paxfareInfo?.fareInfoList?.farePkgInfoList[2]
                                                            ?.price?.value
                                                    );
                                            });
                                        } else {
                                            standardPlusFare =

                                                Number(
                                                    list?.passengerFareInfoList?.fareInfoList
                                                        ?.farePkgInfoList[0]?.price?.value
                                                );
                                            comfortFare =
                                                Number(
                                                    list?.passengerFareInfoList?.fareInfoList
                                                        ?.farePkgInfoList[1]?.price?.value
                                                );
                                            comfortPlusFare =
                                                Number(
                                                    list?.passengerFareInfoList?.fareInfoList
                                                        ?.farePkgInfoList[2]?.price?.value
                                                );
                                        }
                                    }
                                    return (
                                        <div className="flight-card-wrapper">
                                            <div className="flight-section-info">
                                                <div className="flight-name-details">
                                                    <div className="flight-logo">
                                                        {list.flightName === "FLY ARYSTAN" && (
                                                            <img src={flyArystan} alt="flight-icon" />
                                                        )}
                                                        {list.flightName === "Turkmenistan Airlines" && (
                                                            <img src={TurkAirlines} alt="flight-icon" />
                                                        )}
                                                        {list.flightName === "Salam Airline" && (
                                                            <img src={salaam} alt="flight-icon" />
                                                        )}
                                                    </div>
                                                    <div className="flight-name">{list.flightName}</div>
                                                    <div className="flight-number">
                                                        {`${list.flightNumber}${list?.flightNumber_RT
                                                            ? ` / ${list?.flightNumber_RT}`
                                                            : ""
                                                            }`}
                                                    </div>
                                                    <div className="seperator" />
                                                    <div className="cabin">{list?.cabin}</div>
                                                    <div className="design-code">
                                                        Class - {list?.resBookDesigCode}
                                                    </div>
                                                    <div className="design-code">
                                                        Seats Available - {list?.resBookDesigQuantity}
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
                                                            {list.departureCityCode}
                                                            <span className="flight-city-time">
                                                                {list.departureTime}
                                                            </span>
                                                        </div>
                                                        <div className="flight-city-name">
                                                            {list.departureCity}
                                                        </div>
                                                    </div>
                                                    <div className="flight-city-seperator">
                                                        <div className="duration">
                                                            {list.flightDuration}
                                                        </div>
                                                        <div className="line-seperator"></div>
                                                        <div className="stop">{`${Number(list.stops) !== 0
                                                            ? `${list.stops} stop`
                                                            : "Non stop"
                                                            } ${list?.stopOverCity
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
                                                            {list.arrivalCityCode}
                                                        </div>
                                                        <div className="flight-city-name">
                                                            {list.arrivalCity}
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
                                                    <div className="total-fare">
                                                        {/* <img
                              src={rupeeSvg}
                              alt="INR"
                              className="rupeeSvg"
                            /> */}
                                                        {`${list?.currencyCode} ${list?.totalAmount}`}
                                                    </div>
                                                    {passengerFareInfoList?.fareInfoList
                                                        ?.farePkgInfoList &&
                                                        passengerFareInfoList?.fareInfoList
                                                            ?.farePkgInfoList[0]?.selected === "true" && (
                                                            <div className="header">(Standard Plus)</div>
                                                        )}
                                                    {passengerFareInfoList?.fareInfoList
                                                        ?.farePkgInfoList &&
                                                        passengerFareInfoList?.fareInfoList
                                                            ?.farePkgInfoList[1]?.selected === "true" && (
                                                            <div className="header">(Comfort)</div>
                                                        )}
                                                    {passengerFareInfoList?.fareInfoList
                                                        ?.farePkgInfoList &&
                                                        passengerFareInfoList?.fareInfoList
                                                            ?.farePkgInfoList[2]?.selected === "true" && (
                                                            <div className="header">(Comfort Plus)</div>
                                                        )}
                                                    {passengerFareInfoList?.fareInfoList
                                                        ?.farePkgInfoList &&
                                                        passengerFareInfoList?.fareInfoList
                                                            ?.farePkgInfoList[0]?.selected !== "true" &&
                                                        passengerFareInfoList?.fareInfoList
                                                            ?.farePkgInfoList[1]?.selected !== "true" &&
                                                        passengerFareInfoList?.fareInfoList
                                                            ?.farePkgInfoList[2]?.selected !== "true" && (
                                                            <div className="header">(Standard)</div>
                                                        )}
                                                    {flightClassList.length === 1 ? (
                                                        <Button
                                                            variant="contained"
                                                            // color="secondary"
                                                            disabled={
                                                                loggedInUserDetails?.role !== "admin" &&
                                                                loggedInUserDetails?.can_create_booking !== 1
                                                            }
                                                            onClick={() => {
                                                                setoneWayTripDetails(
                                                                    JSON.parse(JSON.stringify(list))
                                                                );
                                                                handleShow();
                                                            }}
                                                        >
                                                            Book
                                                        </Button>
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
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            {/* {showFlexiFare && ( */}
                                            {passengerFareInfoList?.fareInfoList?.farePkgInfoList && (
                                                <div
                                                    className="flight-section-details-text"
                                                    onClick={() => setShowOneWayFlexiFareCard(index)}
                                                >
                                                    Flexi Fare
                                                    <div className="caret-wrapper">
                                                        <span
                                                            className={`caret ${showOneWayFlexiFareCard === index
                                                                ? "caret-open"
                                                                : "caret-close"
                                                                }`}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            {/* )} */}
                                            {showOneWayFlexiFareCard === index && (
                                                <div className="flight-section-details">
                                                    <div className="flexi-fare-card">
                                                        <div className="header">Standard</div>
                                                        <div className="flexi-features">
                                                            {" "}
                                                            <div className="feature">
                                                                {featureMapper["HBAG5"]}
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="amount"
                                                            onClick={() =>
                                                                handleFlexiSelectOnList(list, null, "oneWay")
                                                            }
                                                        >
                                                            {Number(list?.baseAmount)}
                                                        </div>
                                                    </div>
                                                    {passengerFareInfoList?.fareInfoList?.farePkgInfoList?.map(
                                                        (pkg, index) => {
                                                            return (
                                                                <div className="flexi-fare-card">
                                                                    {index === 0 && (
                                                                        <div className="header">Standard Plus</div>
                                                                    )}
                                                                    {index === 1 && (
                                                                        <div className="header">Comfort</div>
                                                                    )}
                                                                    {index === 2 && (
                                                                        <div className="header">Comfort Plus</div>
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
                                                                                            <div className="feature">
                                                                                                {
                                                                                                    featureMapper[
                                                                                                    pkgfeature?.pkgExplanation
                                                                                                    ]
                                                                                                }
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
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    <div
                                                                        className="amount"
                                                                        onClick={() =>
                                                                            handleFlexiSelectOnList(
                                                                                list,
                                                                                pkg,
                                                                                "oneWay"
                                                                            )
                                                                        }
                                                                    >
                                                                        {/* {`+${pkg?.price?.value}`} */}
                                                                        {index === 0 && `+${standardPlusFare * (passengerCount.adult + passengerCount.child)}`}
                                                                        {index === 1 && `+${comfortFare * (passengerCount.adult + passengerCount.child)}`}
                                                                        {index === 2 && `+${comfortPlusFare * (passengerCount.adult + passengerCount.child)}`}
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
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
                                    if (passengerFareInfoList?.fareInfoList?.farePkgInfoList) {
                                        if (Array.isArray(list?.passengerFareInfoList)) {
                                            list?.passengerFareInfoList?.forEach((paxfareInfo) => {
                                                standardPlusFare =
                                                    Number(
                                                        paxfareInfo?.fareInfoList?.farePkgInfoList[0]
                                                            ?.price?.value
                                                    );
                                                comfortFare =
                                                    Number(
                                                        paxfareInfo?.fareInfoList?.farePkgInfoList[1]
                                                            ?.price?.value
                                                    );
                                                comfortPlusFare =
                                                    Number(
                                                        paxfareInfo?.fareInfoList?.farePkgInfoList[2]
                                                            ?.price?.value
                                                    );
                                            });
                                        } else {
                                            standardPlusFare =
                                                Number(
                                                    list?.passengerFareInfoList?.fareInfoList
                                                        ?.farePkgInfoList[0]?.price?.value
                                                );
                                            comfortFare =
                                                Number(
                                                    list?.passengerFareInfoList?.fareInfoList
                                                        ?.farePkgInfoList[1]?.price?.value
                                                );
                                            comfortPlusFare =
                                                Number(
                                                    list?.passengerFareInfoList?.fareInfoList
                                                        ?.farePkgInfoList[2]?.price?.value
                                                );
                                        }
                                    }
                                    return (
                                        <div className="flight-card-wrapper">
                                            <div className="flight-section-info">
                                                <div className="flight-name-details">
                                                    <div className="flight-logo">
                                                        {list.flightName === "FLY ARYSTAN" && (
                                                            <img src={flyArystan} alt="flight-icon" />
                                                        )}
                                                        {list.flightName === "Turkmenistan Airlines" && (
                                                            <img src={TurkAirlines} alt="flight-icon" />
                                                        )}
                                                        {list.flightName === "Salam Airline" && (
                                                            <img src={salaam} alt="flight-icon" />
                                                        )}
                                                    </div>
                                                    <div className="flight-name">{list.flightName}</div>
                                                    <div className="flight-number">
                                                        {`${list.flightNumber}${list?.flightNumber_RT
                                                            ? ` / ${list?.flightNumber_RT}`
                                                            : ""
                                                            }`}
                                                    </div>
                                                    <div className="seperator" />
                                                    <div className="cabin">{list?.cabin}</div>
                                                    <div className="design-code">
                                                        Class - {list?.resBookDesigCode}
                                                    </div>
                                                    <div className="design-code">
                                                        Seats Available - {list?.resBookDesigQuantity}
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
                                                            {list.departureCityCode}
                                                            <span className="flight-city-time">
                                                                {list.departureTime}
                                                            </span>
                                                        </div>
                                                        <div className="flight-city-name">
                                                            {list.departureCity}
                                                        </div>
                                                    </div>
                                                    <div className="flight-city-seperator">
                                                        <div className="duration">
                                                            {list.flightDuration}
                                                        </div>
                                                        <div className="line-seperator"></div>
                                                        <div className="stop">{`${Number(list.stops) !== 0
                                                            ? `${list.stops} stop`
                                                            : "Non stop"
                                                            } ${list?.stopOverCity
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
                                                            {list.arrivalCityCode}
                                                        </div>
                                                        <div className="flight-city-name">
                                                            {list.arrivalCity}
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
                                                    <div className="total-fare">
                                                        {/* <img
                              src={rupeeSvg}
                              alt="INR"
                              className="rupeeSvg"
                            /> */}
                                                        {/* {list?.totalAmount} */}
                                                        {`${list?.currencyCode} ${list?.totalAmount}`}
                                                    </div>
                                                    {passengerFareInfoList?.fareInfoList
                                                        ?.farePkgInfoList &&
                                                        passengerFareInfoList?.fareInfoList
                                                            ?.farePkgInfoList[0]?.selected === "true" && (
                                                            <div className="header">(Standard Plus)</div>
                                                        )}
                                                    {passengerFareInfoList?.fareInfoList
                                                        ?.farePkgInfoList &&
                                                        passengerFareInfoList?.fareInfoList
                                                            ?.farePkgInfoList[1]?.selected === "true" && (
                                                            <div className="header">(Comfort)</div>
                                                        )}
                                                    {passengerFareInfoList?.fareInfoList
                                                        ?.farePkgInfoList &&
                                                        passengerFareInfoList?.fareInfoList
                                                            ?.farePkgInfoList[2]?.selected === "true" && (
                                                            <div className="header">(Comfort Plus)</div>
                                                        )}
                                                    {passengerFareInfoList?.fareInfoList
                                                        ?.farePkgInfoList &&
                                                        passengerFareInfoList?.fareInfoList
                                                            ?.farePkgInfoList[0]?.selected !== "true" &&
                                                        passengerFareInfoList?.fareInfoList
                                                            ?.farePkgInfoList[1]?.selected !== "true" &&
                                                        passengerFareInfoList?.fareInfoList
                                                            ?.farePkgInfoList[2]?.selected !== "true" && (
                                                            <div className="header">(Standard)</div>
                                                        )}
                                                    {flightClassList.length === 1 ? (
                                                        <Button
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
                                                            Book
                                                        </Button>
                                                    ) : (
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
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            {/* {showFlexiFare && ( */}
                                            {passengerFareInfoList?.fareInfoList?.farePkgInfoList && (
                                                <div
                                                    className="flight-section-details-text"
                                                    onClick={() => setShowTwoWayFlexiFareCard(index)}
                                                >
                                                    Flexi Fare
                                                    <div className="caret-wrapper">
                                                        <span
                                                            className={`caret ${showTwoWayFlexiFareCard === index
                                                                ? "caret-open"
                                                                : "caret-close"
                                                                }`}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            {/* )} */}
                                            {showTwoWayFlexiFareCard === index && (
                                                <div className="flight-section-details">
                                                    <div className="flexi-fare-card">
                                                        <div className="header">Standard</div>
                                                        <div className="flexi-features">
                                                            <div className="feature">
                                                                {featureMapper["HBAG5"]}
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="amount"
                                                            onClick={() =>
                                                                handleFlexiSelectOnList(list, null, "twoWay")
                                                            }
                                                        >
                                                            {Number(list?.baseAmount)}
                                                        </div>
                                                    </div>
                                                    {passengerFareInfoList?.fareInfoList?.farePkgInfoList?.map(
                                                        (pkg, index) => {
                                                            return (
                                                                <div className="flexi-fare-card">
                                                                    {index === 0 && (
                                                                        <div className="header">Standard Plus</div>
                                                                    )}
                                                                    {index === 1 && (
                                                                        <div className="header">Comfort</div>
                                                                    )}
                                                                    {index === 2 && (
                                                                        <div className="header">Comfort Plus</div>
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
                                                                                            <div className="feature">
                                                                                                {
                                                                                                    featureMapper[
                                                                                                    pkgfeature?.pkgExplanation
                                                                                                    ]
                                                                                                }
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
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    <div
                                                                        className="amount"
                                                                        onClick={() =>
                                                                            handleFlexiSelectOnList(
                                                                                list,
                                                                                pkg,
                                                                                "twoWay"
                                                                            )
                                                                        }
                                                                    >
                                                                        {/* {`+${pkg?.price?.value}`} */}
                                                                        {index === 0 && `+${standardPlusFare * (passengerCount.adult + passengerCount.child)}`}
                                                                        {index === 1 && `+${comfortFare * (passengerCount.adult + passengerCount.child)}`}
                                                                        {index === 2 && `+${comfortPlusFare * (passengerCount.adult + passengerCount.child)}`}
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <Dialog
                                fullScreen
                                open={showBookingDetailsDialog}
                                onClose={handleClose}
                                TransitionComponent={Transition}
                            >
                                <AppBar sx={{ position: "relative" }}>
                                    <Toolbar>
                                        <Typography
                                            sx={{ ml: 2, flex: 1 }}
                                            variant="h6"
                                            component="div"
                                        >
                                            Booking Details
                                        </Typography>
                                        <IconButton
                                            edge="start"
                                            color="inherit"
                                            onClick={() => {
                                                handleClose();
                                                handleSearchFlights();
                                            }}
                                            aria-label="close"
                                        >
                                            <CloseIcon />
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
                                                quantity: String(adult ?? 0),
                                            },
                                            {
                                                passengerType: "CHLD",
                                                quantity: String(child ?? 0),
                                            },
                                            {
                                                passengerType: "INFT",
                                                quantity: String(infant ?? 0),
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
                                        <div className="flight-info">
                                            <div className="logo">
                                                {oneWayTripDetails?.flightName === "FLY ARYSTAN" && (
                                                    <img src={flyArystan} alt="flight-icon" />
                                                )}
                                                {oneWayTripDetails?.flightName ===
                                                    "Turkmenistan Airlines" && (
                                                        <img src={TurkAirlines} alt="flight-icon" />
                                                    )}
                                                {oneWayTripDetails?.flightName === "Salam Airline" && (
                                                    <img src={salaam} alt="flight-icon" />
                                                )}
                                            </div>
                                            <div className="flight-number">
                                                {`${oneWayTripDetails.flightNumber}${oneWayTripDetails?.flightNumber_RT
                                                    ? ` / ${oneWayTripDetails?.flightNumber_RT}`
                                                    : ""
                                                    }`}
                                            </div>
                                            <div className="class">{`Class - ${oneWayTripDetails?.resBookDesigCode}`}</div>
                                        </div>
                                        <div className="time">
                                            {oneWayTripDetails?.departureTime}
                                        </div>
                                        <div className="seperator-wrapper">
                                            <div className="duration">
                                                {oneWayTripDetails?.flightDuration}
                                            </div>
                                            <div className="seperator"></div>
                                            <div className="stops">
                                                {Number(oneWayTripDetails?.stops) === 0
                                                    ? "Non stop"
                                                    : `${oneWayTripDetails?.stops} stops`}
                                            </div>
                                        </div>
                                        <div className="time">{oneWayTripDetails?.arrivalTime}</div>
                                    </div>
                                )}
                                <div className="trip-seperator"></div>
                                {twoWayTripDetails && (
                                    <div className="trip-details">
                                        <div className="flight-info">
                                            <div className="logo">
                                                {twoWayTripDetails?.flightName === "FLY ARYSTAN" && (
                                                    <img src={flyArystan} alt="flight-icon" />
                                                )}
                                                {twoWayTripDetails?.flightName ===
                                                    "Turkmenistan Airlines" && (
                                                        <img src={TurkAirlines} alt="flight-icon" />
                                                    )}
                                                {twoWayTripDetails?.flightName === "Salam Airline" && (
                                                    <img src={salaam} alt="flight-icon" />
                                                )}
                                            </div>
                                            <div className="flight-number">
                                                {`${twoWayTripDetails.flightNumber}${twoWayTripDetails?.flightNumber_RT
                                                    ? ` / ${twoWayTripDetails?.flightNumber_RT}`
                                                    : ""
                                                    }`}
                                            </div>

                                            <div className="class">{`Class - ${twoWayTripDetails?.resBookDesigCode}`}</div>
                                        </div>
                                        <div className="time">
                                            {twoWayTripDetails?.departureTime}
                                        </div>
                                        <div className="seperator-wrapper">
                                            <div className="duration">
                                                {twoWayTripDetails?.flightDuration}
                                            </div>
                                            <div className="seperator"></div>
                                            <div className="stops">
                                                {Number(twoWayTripDetails?.stops) === 0
                                                    ? "Non stop"
                                                    : `${twoWayTripDetails?.stops} stops`}
                                            </div>
                                        </div>
                                        <div className="time">{twoWayTripDetails?.arrivalTime}</div>
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
                                            {`${oneWayTripDetails?.currencyCode} ${Math.round(
                                                (Number(oneWayTripDetails?.totalAmount) +
                                                    Number(twoWayTripDetails?.totalAmount)) *
                                                100
                                            ) / 100
                                                }`}
                                            {/* {`${
                        Number(oneWayTripDetails?.totalAmount) +
                        Number(twoWayTripDetails?.totalAmount)
                      }`} */}
                                        </div>
                                    </div>
                                    <div className="btn-wrapper">
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            disabled={
                                                !oneWayTripDetails ||
                                                !twoWayTripDetails ||
                                                (loggedInUserDetails?.role !== "admin" &&
                                                    loggedInUserDetails?.can_create_booking !== 1)
                                            }
                                            onClick={handleShow}
                                        >
                                            Book
                                        </Button>
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
                <div className="search-flights-section">
                    {airline && (
                        <div className="search-airline-section">
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Airline</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={airline}
                                    label="Airline"
                                    onChange={(event) => handleAirlineChange(event.target.value)}
                                    name="Airline"
                                // inputLabelProps={{
                                //   className: "text_input"
                                // }}
                                // variant="secondary"
                                >
                                    {loggedInUserDetails?.airlineCodes?.map((airline) => (
                                        <MenuItem value={airline}>{airline}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    )}
                    {origin && (
                        <div className="search-origin-section">
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Origin</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={origin}
                                    // defaultValue={origin}
                                    label="Origin"
                                    onChange={(e) => {
                                        setOrigin([e.target.value]);
                                    }}
                                    // name="Origin"
                                    displayEmpty
                                    MenuProps={MenuProps}
                                >
                                    {flightsAvailable &&
                                        Object.keys(flightsAvailable).map((city, index) => {
                                            return <MenuItem value={city}>{city}</MenuItem>;
                                        })}
                                </Select>
                            </FormControl>
                        </div>
                    )}
                    {destination && (
                        <div className="search-destination-section">
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                    Destination
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={destination}
                                    defaultValue={destination}
                                    label="Destination"
                                    onChange={(e) => setDestination([e.target.value])}
                                    MenuProps={MenuProps}
                                // disabled={!origin}
                                >
                                    {flightsAvailable &&
                                        origin &&
                                        flightsAvailable[`${origin}`]?.map((city, index) => {
                                            return <MenuItem value={city}>{city}</MenuItem>;
                                        })}
                                </Select>
                            </FormControl>
                        </div>
                    )}
                    {tripType && (
                        <div className="search-trip-section">
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Trip Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={tripType}
                                    label="Trip Type"
                                    onChange={(e) => setTripType(e.target.value)}
                                    name="Trip Type"
                                >
                                    <MenuItem value="ONE_WAY">One Way</MenuItem>
                                    <MenuItem value="ROUND_TRIP">Round Trip</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    )}
                    <div className="search-departure-section">
                        <FormControl fullWidth>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DatePicker"]}>
                                    <DatePicker
                                        label="Departure Date"
                                        onChange={(val) => setDepartureDate(val)}
                                        value={departureDate}
                                        minDate={today}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </FormControl>
                    </div>
                    <div className="search-return-section">
                        <FormControl fullWidth>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DatePicker"]}>
                                    <DatePicker
                                        label="Return Date"
                                        onChange={(val) => setReturnDate(val)}
                                        disabled={!departureDate}
                                        minDate={departureDate}
                                        value={returnDate}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </FormControl>
                    </div>
                </div>
                <div className="search-flights-section">
                    {adult !== null && (
                        <div className="add-passenger-type">
                            <FormControl fullWidth>
                                <TextField
                                    type="number"
                                    min={0}
                                    label="Adult"
                                    InputProps={{
                                        inputProps: { min: 0, max: 9 },
                                    }}
                                    value={adult}
                                    fullWidth
                                    onChange={(event) => {
                                        setAdult(Number(event.target.value));
                                        if (infant > event.target.value) {
                                            setInfant(Number(event.target.value));
                                        }
                                        setShowOneWayFlexiFareCard(null);
                                        setShowTwoWayFlexiFareCard(null);
                                    }}
                                ></TextField>
                            </FormControl>
                        </div>
                    )}
                    {child !== null && (
                        <div className="add-passenger-type">
                            <FormControl fullWidth>
                                <TextField
                                    type="number"
                                    min={0}
                                    label="Child (2-12 yrs)"
                                    InputProps={{
                                        inputProps: { min: 0, max: 9 },
                                    }}
                                    value={child}
                                    fullWidth
                                    onChange={(event) => {
                                        setChild(Number(event.target.value));
                                        setShowOneWayFlexiFareCard(null);
                                        setShowTwoWayFlexiFareCard(null);
                                    }}
                                ></TextField>
                            </FormControl>
                        </div>
                    )}
                    {infant !== null && (
                        <div className="add-passenger-type">
                            <FormControl fullWidth>
                                <TextField
                                    disabled={!adult || adult < 1}
                                    type="number"
                                    min={0}
                                    label="Infant (<2 yrs)"
                                    InputProps={{
                                        inputProps: { min: 0, max: adult },
                                    }}
                                    value={infant}
                                    fullWidth
                                    onChange={(event) => {
                                        setInfant(Number(event.target.value))
                                        setShowOneWayFlexiFareCard(null);
                                        setShowTwoWayFlexiFareCard(null);
                                    }}
                                ></TextField>
                            </FormControl>
                        </div>
                    )}
                    <div className="search-btn-wrapper">
                        <FormControl>
                            <Button
                                variant="contained"
                                onClick={handleSearchFlights}
                                disabled={
                                    tripType === "ROUND_TRIP"
                                        ? !origin ||
                                        !destination ||
                                        !departureDate ||
                                        !returnDate ||
                                        adult + child + infant < 1 ||
                                        adult + child + infant > 9
                                        : !origin ||
                                        !destination ||
                                        !departureDate ||
                                        adult + child + infant < 1 ||
                                        adult + child + infant > 9
                                }
                            >
                                Search
                            </Button>
                        </FormControl>
                    </div>
                </div>
                <div className="search-flights-section"></div>
            </div>
            {returnSearchResultContent()}
        </div>
    );
};

export default SearchResults;
