import React, { useEffect, useState } from "react";
import "./BookingDetails.css";
import axios from "axios";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FlightIcon from "@mui/icons-material/Flight";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import flyArystan from "../../Assets/fly_arystan.png";
import TurkAirlines from "../../Assets/turk_airlines.png";
import salam from "../../Assets/salam.jpeg";
// import rupeeSvg from "../../assets/rupee-sign.svg";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import successGIF from "../../Assets/successicon.gif";
import errorGIF from "../../Assets/fail-icon.gif";
import { Box } from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { styled } from "@mui/material/styles";
import Loader from "../Loader/Loader";

import dayjs from "dayjs";

import { useDispatch } from "react-redux";
import { updateLoggedInUserDetails } from "../../store/slices/loggedInUserDetailsSlice";

const countryCodeArray = [
  { country: "Afghanistan", code: "93", iso: "AF" },
  { country: "Albania", code: "355", iso: "AL" },
  { country: "Algeria", code: "213", iso: "DZ" },
  { country: "American Samoa", code: "1-684", iso: "AS" },
  { country: "Andorra", code: "376", iso: "AD" },
  { country: "Angola", code: "244", iso: "AO" },
  { country: "Anguilla", code: "1-264", iso: "AI" },
  { country: "Antarctica", code: "672", iso: "AQ" },
  { country: "Antigua and Barbuda", code: "1-268", iso: "AG" },
  { country: "Argentina", code: "54", iso: "AR" },
  { country: "Armenia", code: "374", iso: "AM" },
  { country: "Aruba", code: "297", iso: "AW" },
  { country: "Australia", code: "61", iso: "AU" },
  { country: "Austria", code: "43", iso: "AT" },
  { country: "Azerbaijan", code: "994", iso: "AZ" },
  { country: "Bahamas", code: "1-242", iso: "BS" },
  { country: "Bahrain", code: "973", iso: "BH" },
  { country: "Bangladesh", code: "880", iso: "BD" },
  { country: "Barbados", code: "1-246", iso: "BB" },
  { country: "Belarus", code: "375", iso: "BY" },
  { country: "Belgium", code: "32", iso: "BE" },
  { country: "Belize", code: "501", iso: "BZ" },
  { country: "Benin", code: "229", iso: "BJ" },
  { country: "Bermuda", code: "1-441", iso: "BM" },
  { country: "Bhutan", code: "975", iso: "BT" },
  { country: "Bolivia", code: "591", iso: "BO" },
  { country: "Bosnia and Herzegovina", code: "387", iso: "BA" },
  { country: "Botswana", code: "267", iso: "BW" },
  { country: "Brazil", code: "55", iso: "BR" },
  { country: "British Indian Ocean Territory", code: "246", iso: "IO" },
  { country: "British Virgin Islands", code: "1-284", iso: "VG" },
  { country: "Brunei", code: "673", iso: "BN" },
  { country: "Bulgaria", code: "359", iso: "BG" },
  { country: "Burkina Faso", code: "226", iso: "BF" },
  { country: "Burundi", code: "257", iso: "BI" },
  { country: "Cambodia", code: "855", iso: "KH" },
  { country: "Cameroon", code: "237", iso: "CM" },
  { country: "Canada", code: "1", iso: "CA" },
  { country: "Cape Verde", code: "238", iso: "CV" },
  { country: "Cayman Islands", code: "1-345", iso: "KY" },
  { country: "Central African Republic", code: "236", iso: "CF" },
  { country: "Chad", code: "235", iso: "TD" },
  { country: "Chile", code: "56", iso: "CL" },
  { country: "China", code: "86", iso: "CN" },
  { country: "Christmas Island", code: "61", iso: "CX" },
  { country: "Cocos Islands", code: "61", iso: "CC" },
  { country: "Colombia", code: "57", iso: "CO" },
  { country: "Comoros", code: "269", iso: "KM" },
  { country: "Cook Islands", code: "682", iso: "CK" },
  { country: "Costa Rica", code: "506", iso: "CR" },
  { country: "Croatia", code: "385", iso: "HR" },
  { country: "Cuba", code: "53", iso: "CU" },
  { country: "Curacao", code: "599", iso: "CW" },
  { country: "Cyprus", code: "357", iso: "CY" },
  { country: "Czech Republic", code: "420", iso: "CZ" },
  { country: "Democratic Republic of the Congo", code: "243", iso: "CD" },
  { country: "Denmark", code: "45", iso: "DK" },
  { country: "Djibouti", code: "253", iso: "DJ" },
  { country: "Dominica", code: "1-767", iso: "DM" },
  { country: "Dominican Republic", code: "1-809, 1-829, 1-849", iso: "DO" },
  { country: "East Timor", code: "670", iso: "TL" },
  { country: "Ecuador", code: "593", iso: "EC" },
  { country: "Egypt", code: "20", iso: "EG" },
  { country: "El Salvador", code: "503", iso: "SV" },
  { country: "Equatorial Guinea", code: "240", iso: "GQ" },
  { country: "Eritrea", code: "291", iso: "ER" },
  { country: "Estonia", code: "372", iso: "EE" },
  { country: "Ethiopia", code: "251", iso: "ET" },
  { country: "Falkland Islands", code: "500", iso: "FK" },
  { country: "Faroe Islands", code: "298", iso: "FO" },
  { country: "Fiji", code: "679", iso: "FJ" },
  { country: "Finland", code: "358", iso: "FI" },
  { country: "France", code: "33", iso: "FR" },
  { country: "French Polynesia", code: "689", iso: "PF" },
  { country: "Gabon", code: "241", iso: "GA" },
  { country: "Gambia", code: "220", iso: "GM" },
  { country: "Georgia", code: "995", iso: "GE" },
  { country: "Germany", code: "49", iso: "DE" },
  { country: "Ghana", code: "233", iso: "GH" },
  { country: "Gibraltar", code: "350", iso: "GI" },
  { country: "Greece", code: "30", iso: "GR" },
  { country: "Greenland", code: "299", iso: "GL" },
  { country: "Grenada", code: "1-473", iso: "GD" },
  { country: "Guam", code: "1-671", iso: "GU" },
  { country: "Guatemala", code: "502", iso: "GT" },
  { country: "Guernsey", code: "44-1481", iso: "GG" },
  { country: "Guinea", code: "224", iso: "GN" },
  { country: "Guinea-Bissau", code: "245", iso: "GW" },
  { country: "Guyana", code: "592", iso: "GY" },
  { country: "Haiti", code: "509", iso: "HT" },
  { country: "Honduras", code: "504", iso: "HN" },
  { country: "Hong Kong", code: "852", iso: "HK" },
  { country: "Hungary", code: "36", iso: "HU" },
  { country: "Iceland", code: "354", iso: "IS" },
  { country: "India", code: "91", iso: "IN" },
  { country: "Indonesia", code: "62", iso: "ID" },
  { country: "Iran", code: "98", iso: "IR" },
  { country: "Iraq", code: "964", iso: "IQ" },
  { country: "Ireland", code: "353", iso: "IE" },
  { country: "Isle of Man", code: "44-1624", iso: "IM" },
  { country: "Israel", code: "972", iso: "IL" },
  { country: "Italy", code: "39", iso: "IT" },
  { country: "Ivory Coast", code: "225", iso: "CI" },
  { country: "Jamaica", code: "1-876", iso: "JM" },
  { country: "Japan", code: "81", iso: "JP" },
  { country: "Jersey", code: "44-1534", iso: "JE" },
  { country: "Jordan", code: "962", iso: "JO" },
  { country: "Kazakhstan", code: "7", iso: "KZ" },
  { country: "Kenya", code: "254", iso: "KE" },
  { country: "Kiribati", code: "686", iso: "KI" },
  { country: "Kosovo", code: "383", iso: "XK" },
  { country: "Kuwait", code: "965", iso: "KW" },
  { country: "Kyrgyzstan", code: "996", iso: "KG" },
  { country: "Laos", code: "856", iso: "LA" },
  { country: "Latvia", code: "371", iso: "LV" },
  { country: "Lebanon", code: "961", iso: "LB" },
  { country: "Lesotho", code: "266", iso: "LS" },
  { country: "Liberia", code: "231", iso: "LR" },
  { country: "Libya", code: "218", iso: "LY" },
  { country: "Liechtenstein", code: "423", iso: "LI" },
  { country: "Lithuania", code: "370", iso: "LT" },
  { country: "Luxembourg", code: "352", iso: "LU" },
  { country: "Macao", code: "853", iso: "MO" },
  { country: "Macedonia", code: "389", iso: "MK" },
  { country: "Madagascar", code: "261", iso: "MG" },
  { country: "Malawi", code: "265", iso: "MW" },
  { country: "Malaysia", code: "60", iso: "MY" },
  { country: "Maldives", code: "960", iso: "MV" },
  { country: "Mali", code: "223", iso: "ML" },
  { country: "Malta", code: "356", iso: "MT" },
  { country: "Marshall Islands", code: "692", iso: "MH" },
  { country: "Mauritania", code: "222", iso: "MR" },
  { country: "Mauritius", code: "230", iso: "MU" },
  { country: "Mayotte", code: "262", iso: "YT" },
  { country: "Mexico", code: "52", iso: "MX" },
  { country: "Micronesia", code: "691", iso: "FM" },
  { country: "Moldova", code: "373", iso: "MD" },
  { country: "Monaco", code: "377", iso: "MC" },
  { country: "Mongolia", code: "976", iso: "MN" },
  { country: "Montenegro", code: "382", iso: "ME" },
  { country: "Montserrat", code: "1-664", iso: "MS" },
  { country: "Morocco", code: "212", iso: "MA" },
  { country: "Mozambique", code: "258", iso: "MZ" },
  { country: "Myanmar", code: "95", iso: "MM" },
  { country: "Namibia", code: "264", iso: "NA" },
  { country: "Nauru", code: "674", iso: "NR" },
  { country: "Nepal", code: "977", iso: "NP" },
  { country: "Netherlands", code: "31", iso: "NL" },
  { country: "Netherlands Antilles", code: "599", iso: "AN" },
  { country: "New Caledonia", code: "687", iso: "NC" },
  { country: "New Zealand", code: "64", iso: "NZ" },
  { country: "Nicaragua", code: "505", iso: "NI" },
  { country: "Niger", code: "227", iso: "NE" },
  { country: "Nigeria", code: "234", iso: "NG" },
  { country: "Niue", code: "683", iso: "NU" },
  { country: "North Korea", code: "850", iso: "KP" },
  { country: "Northern Mariana Islands", code: "1-670", iso: "MP" },
  { country: "Norway", code: "47", iso: "NO" },
  { country: "Oman", code: "968", iso: "OM" },
  { country: "Pakistan", code: "92", iso: "PK" },
  { country: "Palau", code: "680", iso: "PW" },
  { country: "Palestine", code: "970", iso: "PS" },
  { country: "Panama", code: "507", iso: "PA" },
  { country: "Papua New Guinea", code: "675", iso: "PG" },
  { country: "Paraguay", code: "595", iso: "PY" },
  { country: "Peru", code: "51", iso: "PE" },
  { country: "Philippines", code: "63", iso: "PH" },
  { country: "Pitcairn", code: "64", iso: "PN" },
  { country: "Poland", code: "48", iso: "PL" },
  { country: "Portugal", code: "351", iso: "PT" },
  { country: "Puerto Rico", code: "1-787, 1-939", iso: "PR" },
  { country: "Qatar", code: "974", iso: "QA" },
  { country: "Republic of the Congo", code: "242", iso: "CG" },
  { country: "Reunion", code: "262", iso: "RE" },
  { country: "Romania", code: "40", iso: "RO" },
  { country: "Russia", code: "7", iso: "RU" },
  { country: "Rwanda", code: "250", iso: "RW" },
  { country: "Saint Barthelemy", code: "590", iso: "BL" },
  { country: "Saint Helena", code: "290", iso: "SH" },
  { country: "Saint Kitts and Nevis", code: "1-869", iso: "KN" },
  { country: "Saint Lucia", code: "1-758", iso: "LC" },
  { country: "Saint Martin", code: "590", iso: "MF" },
  { country: "Saint Pierre and Miquelon", code: "508", iso: "PM" },
  { country: "Saint Vincent and the Grenadines", code: "1-784", iso: "VC" },
  { country: "Samoa", code: "685", iso: "WS" },
  { country: "San Marino", code: "378", iso: "SM" },
  { country: "Sao Tome and Principe", code: "239", iso: "ST" },
  { country: "Saudi Arabia", code: "966", iso: "SA" },
  { country: "Senegal", code: "221", iso: "SN" },
  { country: "Serbia", code: "381", iso: "RS" },
  { country: "Seychelles", code: "248", iso: "SC" },
  { country: "Sierra Leone", code: "232", iso: "SL" },
  { country: "Singapore", code: "65", iso: "SG" },
  { country: "Sint Maarten", code: "1-721", iso: "SX" },
  { country: "Slovakia", code: "421", iso: "SK" },
  { country: "Slovenia", code: "386", iso: "SI" },
  { country: "Solomon Islands", code: "677", iso: "SB" },
  { country: "Somalia", code: "252", iso: "SO" },
  { country: "South Africa", code: "27", iso: "ZA" },
  { country: "South Korea", code: "82", iso: "KR" },
  { country: "South Sudan", code: "211", iso: "SS" },
  { country: "Spain", code: "34", iso: "ES" },
  { country: "Sri Lanka", code: "94", iso: "LK" },
  { country: "Sudan", code: "249", iso: "SD" },
  { country: "Suriname", code: "597", iso: "SR" },
  { country: "Svalbard and Jan Mayen", code: "47", iso: "SJ" },
  { country: "Swaziland", code: "268", iso: "SZ" },
  { country: "Sweden", code: "46", iso: "SE" },
  { country: "Switzerland", code: "41", iso: "CH" },
  { country: "Syria", code: "963", iso: "SY" },
  { country: "Taiwan", code: "886", iso: "TW" },
  { country: "Tajikistan", code: "992", iso: "TJ" },
  { country: "Tanzania", code: "255", iso: "TZ" },
  { country: "Thailand", code: "66", iso: "TH" },
  { country: "Togo", code: "228", iso: "TG" },
  { country: "Tokelau", code: "690", iso: "TK" },
  { country: "Tonga", code: "676", iso: "TO" },
  { country: "Trinidad and Tobago", code: "1-868", iso: "TT" },
  { country: "Tunisia", code: "216", iso: "TN" },
  { country: "Turkey", code: "90", iso: "TR" },
  { country: "Turkmenistan", code: "993", iso: "TM" },
  { country: "Turks and Caicos Islands", code: "1-649", iso: "TC" },
  { country: "Tuvalu", code: "688", iso: "TV" },
  { country: "U.S. Virgin Islands", code: "1-340", iso: "VI" },
  { country: "Uganda", code: "256", iso: "UG" },
  { country: "Ukraine", code: "380", iso: "UA" },
  { country: "United Arab Emirates", code: "971", iso: "AE" },
  { country: "United Kingdom", code: "44", iso: "GB" },
  { country: "United States", code: "1", iso: "US" },
  { country: "Uruguay", code: "598", iso: "UY" },
  { country: "Uzbekistan", code: "998", iso: "UZ" },
  { country: "Vanuatu", code: "678", iso: "VU" },
  { country: "Vatican", code: "379", iso: "VA" },
  { country: "Venezuela", code: "58", iso: "VE" },
  { country: "Vietnam", code: "84", iso: "VN" },
  { country: "Wallis and Futuna", code: "681", iso: "WF" },
  { country: "Western Sahara", code: "212", iso: "EH" },
  { country: "Yemen", code: "967", iso: "YE" },
  { country: "Zambia", code: "260", iso: "ZM" },
  { country: "Zimbabwe", code: "263", iso: "ZW" },
];

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    // borderRadius: "10px",
    paddingRight: "30px",
    borderColor: "#ddd",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#EF5443",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#EF5443",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#666",
  },
  "& .MuiSelect-icon": {
    color: "#f44336",
  },
}));
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: "100px",
      width: 100,
    },
  },
};

const PlaceholderTypography = styled("div")(({ theme }) => ({
  color: "#707271",
  fontSize: "14px",
}));

const CustomDatePicker = styled(DatePicker)({
  "& .MuiInputBase-root": {
    width: "250px",
  },
  "& .MuiInputBase-input": {
    color: "#ef5443",
    fontSize: "13px",
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#334555",
    color: theme.palette.common.white,
    fontWeight: 500,
  },
  // [`&.${tableCellClasses.body}`]: {
  //   fontSize: 14,
  // },
}));

const BookingDetails = ({
  oneWayTripDetails,
  twoWayTripDetails,
  passengerTypeQuantityList,
  loggedInUserDetails,
  airline,
  setFetchUserDetails,
  securityToken,
}) => {
  const [passengerDetailList, setPassengerDetailList] = useState(null);
  const [email, setEmail] = useState(null);
  const [code, setCode] = useState("+91");
  const [mobileNo, setMobileNo] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [showPendingConfirmPNR, setShowPendingConfirmPNR] = useState(false);
  const [showBookingFail, setShowBookingFail] = useState(false);

  const [bookingResponse, setBookingResponse] = useState(null);

  const [showLoader, setShowLoader] = useState(false);

  const [showInputErrors, setShowInputErrors] = useState(false);

  const [isOfflineBooking, setIsOfflineBooking] = useState(false);

  const dispatch = useDispatch();

  

  useEffect(() => {
    let passengerDetailsArray = {};
    if (passengerTypeQuantityList) {
      passengerTypeQuantityList?.map((passengerTypeObj) => {
        for (let i = 1; i <= Number(passengerTypeObj?.quantity); i++) {
          let passengerType = "";
          if (passengerTypeObj?.passengerType === "ADLT") {
            passengerType = "Adult";
          }
          if (passengerTypeObj?.passengerType === "CHLD") {
            passengerType = "Child";
          }
          if (passengerTypeObj?.passengerType === "INFT") {
            passengerType = "Infant";
          }
          if (passengerType === "Infant") {
            passengerDetailsArray[`${passengerType} ${i}`] = {
              name: null,
              surname: null,
              birthDate: null,
              passengerTypeCode: "INFT",
            };
          } else {
            passengerDetailsArray[`${passengerType} ${i}`] = {
              birthDate: null,
              email: null,
              fname: null,
              lname: null,
              areaCode: "+91",
              countryCode: "IN",
              docExpireDate: null,
              docHolderNationality: "IN",
              docID: null,
              docType: "PASSPORT",
              gender: null,
              passengerTypeCode: passengerTypeObj?.passengerType,
              nameTitle: null,
            };
          }
        }
      });
    }
    setPassengerDetailList(passengerDetailsArray);
    setShowBookingSuccess(false);
    setShowPendingConfirmPNR(false);
    setShowBookingFail(false);
  }, []);

  const handleBookButtonClick = () => {
    let showError = false;
    Object.values(passengerDetailList)?.forEach((pax) => {
      if (
        pax?.nameTitle === null ||
        pax?.fname === null ||
        pax?.fname === "" ||
        pax?.lname === null ||
        pax?.lname === "" ||
        pax?.docID === null ||
        pax?.docID === "" ||
        pax?.birthDate === null ||
        pax?.birthDate === "" ||
        pax?.docExpireDate === null ||
        pax?.docExpireDate === "" ||
        email === null ||
        email === "" ||
        !String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ) ||
        mobileNo === null ||
        mobileNo === "" ||
        mobileNo?.length !== 10
      ) {
        showError = true;
      }
    });
    if (showError) {
      setShowInputErrors(showError);
    } else {
      handleOpenConfirmationDialog();
    }
  };

  const handlePassengerDetailUpdate = (passsenger, value, fieldName) => {
    let passengerList = JSON.parse(JSON.stringify(passengerDetailList));
    passengerList[passsenger][fieldName] = value;
    if (fieldName === "nameTitle") {
      if (value === "MRS") {
        passengerList[passsenger]["gender"] = "F";
      } else {
        passengerList[passsenger]["gender"] = "M";
      }
    }

    if (fieldName === "docHolderNationality") {
      passengerList[passsenger]["countryCode"] = value;
    }
    setPassengerDetailList(passengerList);
  };

  const handleBooking = () => {
    setShowLoader(true);
    handleCloseConfirmationDialog();
    const reqBody = {};
    reqBody.booking = oneWayTripDetails?.connectingFlight
      ? [
          {
            cabin: [oneWayTripDetails?.cabin],
            resBookDesigCode: [oneWayTripDetails?.resBookDesigCode],
            resBookDesigQuantity: [oneWayTripDetails?.resBookDesigQuantity],
            resBookDesigStatusCode: [oneWayTripDetails?.resBookDesigStatusCode],
          },
          {
            cabin: [oneWayTripDetails?.cabin_Connecting],
            resBookDesigCode: [oneWayTripDetails?.resBookDesigCode_Connecting],
            resBookDesigQuantity: [oneWayTripDetails?.resBookDesigQuantity_Connecting],
            resBookDesigStatusCode: [oneWayTripDetails?.resBookDesigStatusCode_Connecting],
          },

        ]
      : {
          cabin: [oneWayTripDetails?.cabin],
          resBookDesigCode: [oneWayTripDetails?.resBookDesigCode],
          resBookDesigQuantity: [oneWayTripDetails?.resBookDesigQuantity],
          resBookDesigStatusCode: [oneWayTripDetails?.resBookDesigStatusCode],
        };

    let fareInfo = Array.isArray(oneWayTripDetails?.passengerFareInfoList)
      ? oneWayTripDetails?.passengerFareInfoList[0]?.fareInfoList
      : oneWayTripDetails?.passengerFareInfoList?.fareInfoList;

    reqBody.fareInfo = oneWayTripDetails?.connectingFlight
      ? [
          {
            cabin: [fareInfo[0]?.cabin],
            cabinClassCode: [fareInfo[0]?.cabinClassCode],
            fareGroupName: [fareInfo[0]?.fareGroupName],
            fareReferenceCode: fareInfo[0]?.fareReferenceCode,
            fareReferenceID: fareInfo[0]?.fareReferenceID,
            fareReferenceName: fareInfo[0]?.fareReferenceName,
            flightSegmentSequence: fareInfo[0]?.flightSegmentSequence,
            resBookDesigCode: fareInfo[0]?.resBookDesigCode,
          },
          {
            cabin: [fareInfo[0]?.cabin],
            cabinClassCode: [fareInfo[0]?.cabinClassCode],
            fareGroupName: [fareInfo[0]?.fareGroupName],
            fareReferenceCode: fareInfo[0]?.fareReferenceCode,
            fareReferenceID: fareInfo[0]?.fareReferenceID,
            fareReferenceName: fareInfo[0]?.fareReferenceName,
            flightSegmentSequence: fareInfo[0]?.flightSegmentSequence,
            resBookDesigCode: oneWayTripDetails?.resBookDesigCode_Connecting,
          },
        ]
      : {
          cabin: [fareInfo?.cabin],
          cabinClassCode: [fareInfo?.cabinClassCode],
          fareGroupName: [fareInfo?.fareGroupName],
          fareReferenceCode: fareInfo?.fareReferenceCode,
          fareReferenceID: fareInfo?.fareReferenceID,
          fareReferenceName: fareInfo?.fareReferenceName,
          flightSegmentSequence: fareInfo?.flightSegmentSequence,
          resBookDesigCode: fareInfo?.resBookDesigCode,
        };
    let selectedFarePkg = [];
    fareInfo?.farePkgInfoList?.forEach((pkg) => {
      if (pkg?.selected === "true") {
        selectedFarePkg.push(pkg);
      }
    });

    if (selectedFarePkg?.length > 0) {
      reqBody.fareInfo.farePkgInfoList = selectedFarePkg;
      reqBody.fareInfo.fareBaggageAllowance = fareInfo?.fareBaggageAllowance;
    }

    reqBody.flightSegment = oneWayTripDetails?.connectingFlight
      ? [
          {
            ...oneWayTripDetails?.flightSegment,
            airline: [
              {
                code: [oneWayTripDetails?.flightSegment?.airline?.code],
                companyFullName: [
                  oneWayTripDetails?.flightSegment?.airline?.companyFullName,
                ],
              },
            ],
            arrivalAirport: JSON.parse(
              JSON.stringify(oneWayTripDetails?.flightSegment?.arrivalAirport)
            ),
            arrivalDateTime: oneWayTripDetails?.flightSegment?.arrivalDateTime,
            arrivalDateTimeUTC:
              oneWayTripDetails?.flightSegment?.arrivalDateTimeUTC,
            departureAirport: JSON.parse(
              JSON.stringify(oneWayTripDetails?.flightSegment?.departureAirport)
            ),
            departureDateTime:
              oneWayTripDetails?.flightSegment?.departureDateTime,
            departureDateTimeUTC:
              oneWayTripDetails?.flightSegment?.departureDateTimeUTC,
            flightNumber: oneWayTripDetails?.flightSegment?.flightNumber,
            codeshare: oneWayTripDetails?.flightSegment?.codeshare,
            flightSegmentID: oneWayTripDetails?.flightSegment?.flightSegmentID,
            ondControlled: oneWayTripDetails?.flightSegment?.ondControlled,
            sector: oneWayTripDetails?.flightSegment?.sector,
          },
          {
            ...oneWayTripDetails?.flightSegment_Connecting,
            airline: [
              {
                code: [
                  oneWayTripDetails?.flightSegment_Connecting?.airline?.code,
                ],
                companyFullName: [
                  oneWayTripDetails?.flightSegment_Connecting?.airline
                    ?.companyFullName,
                ],
              },
            ],
            arrivalAirport: JSON.parse(
              JSON.stringify(
                oneWayTripDetails?.flightSegment_Connecting?.arrivalAirport
              )
            ),
            arrivalDateTime:
              oneWayTripDetails?.flightSegment_Connecting?.arrivalDateTime,
            arrivalDateTimeUTC:
              oneWayTripDetails?.flightSegment_Connecting?.arrivalDateTimeUTC,
            departureAirport: JSON.parse(
              JSON.stringify(
                oneWayTripDetails?.flightSegment_Connecting?.departureAirport
              )
            ),
            departureDateTime:
              oneWayTripDetails?.flightSegment_Connecting?.departureDateTime,
            departureDateTimeUTC:
              oneWayTripDetails?.flightSegment_Connecting?.departureDateTimeUTC,
            flightNumber:
              oneWayTripDetails?.flightSegment_Connecting?.flightNumber,
            codeshare: oneWayTripDetails?.flightSegment?.codeshare,
            flightSegmentID:
              oneWayTripDetails?.flightSegment_Connecting?.flightSegmentID,
            ondControlled:
              oneWayTripDetails?.flightSegment_Connecting?.ondControlled,
            sector: oneWayTripDetails?.flightSegment_Connecting?.sector,
          },
        ]
      : {
          ...oneWayTripDetails?.flightSegment,
          airline: [
            {
              code: [oneWayTripDetails?.flightSegment?.airline?.code],
              companyFullName: [
                oneWayTripDetails?.flightSegment?.airline?.companyFullName,
              ],
            },
          ],
          arrivalAirport: JSON.parse(
            JSON.stringify(oneWayTripDetails?.flightSegment?.arrivalAirport)
          ),
          arrivalDateTime: oneWayTripDetails?.flightSegment?.arrivalDateTime,
          arrivalDateTimeUTC:
            oneWayTripDetails?.flightSegment?.arrivalDateTimeUTC,
          departureAirport: JSON.parse(
            JSON.stringify(oneWayTripDetails?.flightSegment?.departureAirport)
          ),
          departureDateTime:
            oneWayTripDetails?.flightSegment?.departureDateTime,
          departureDateTimeUTC:
            oneWayTripDetails?.flightSegment?.departureDateTimeUTC,
          flightNumber: oneWayTripDetails?.flightSegment?.flightNumber,
          codeshare: oneWayTripDetails?.flightSegment?.codeshare,
          flightSegmentID: oneWayTripDetails?.flightSegment?.flightSegmentID,
          ondControlled: oneWayTripDetails?.flightSegment?.ondControlled,
          sector: oneWayTripDetails?.flightSegment?.sector,
        };

    // if (oneWayTripDetails?.flightNumber_RT) {
    //   reqBody.flightSegment.flightNumber_RT =
    //     oneWayTripDetails?.flightNumber_RT;
    // }

    let travellerList = [];
    let infantList = [];
    Object.values(passengerDetailList)?.forEach((details) => {
      if (details?.passengerTypeCode === "INFT") {
        infantList.push(details);
      } else {
        const paxDetails = {
          ...details,
          email: email,
          areaCode: code,
          mobileNo: mobileNo,
        };
        travellerList.push(paxDetails);
      }
    });
    reqBody.airTravelerList = travellerList;
    reqBody.airlineCode = oneWayTripDetails?.flightSegment?.airline?.code;

    if (infantList.length > 0) {
      reqBody.infantDetails = infantList;
    }

    if (twoWayTripDetails) {
      reqBody.booking_RT = twoWayTripDetails?.connectingFlight
        ? [
            {
              cabin: [twoWayTripDetails?.cabin],
              resBookDesigCode: [twoWayTripDetails?.resBookDesigCode],
              resBookDesigQuantity: [twoWayTripDetails?.resBookDesigQuantity],
              resBookDesigStatusCode: [
                twoWayTripDetails?.resBookDesigStatusCode,
              ],
            },
            {
              cabin: [twoWayTripDetails?.cabin],
              resBookDesigCode: [twoWayTripDetails?.resBookDesigCode],
              resBookDesigQuantity: [twoWayTripDetails?.resBookDesigQuantity],
              resBookDesigStatusCode: [
                twoWayTripDetails?.resBookDesigStatusCode,
              ],
            },
          ]
        : {
            cabin: [twoWayTripDetails?.cabin],
            resBookDesigCode: [twoWayTripDetails?.resBookDesigCode],
            resBookDesigQuantity: [twoWayTripDetails?.resBookDesigQuantity],
            resBookDesigStatusCode: [twoWayTripDetails?.resBookDesigStatusCode],
          };
      let fareInfo_RT = Array.isArray(twoWayTripDetails?.passengerFareInfoList)
        ? twoWayTripDetails?.passengerFareInfoList[0]?.fareInfoList
        : twoWayTripDetails?.passengerFareInfoList?.fareInfoList;

      reqBody.fareInfo_RT = twoWayTripDetails?.connectingFlight
        ? [
            {
              cabin: [fareInfo_RT[0]?.cabin],
              cabinClassCode: [fareInfo_RT[0]?.cabinClassCode],
              fareGroupName: [fareInfo_RT[0]?.fareGroupName],
              fareReferenceCode: fareInfo_RT[0]?.fareReferenceCode,
              fareReferenceID: fareInfo_RT[0]?.fareReferenceID,
              fareReferenceName: fareInfo_RT[0]?.fareReferenceName,
              flightSegmentSequence: fareInfo_RT[0]?.flightSegmentSequence,
              resBookDesigCode: fareInfo_RT[0]?.resBookDesigCode,
            },
            {
              cabin: [fareInfo_RT[1]?.cabin],
              cabinClassCode: [fareInfo_RT[1]?.cabinClassCode],
              fareGroupName: [fareInfo_RT[1]?.fareGroupName],
              fareReferenceCode: fareInfo_RT[1]?.fareReferenceCode,
              fareReferenceID: fareInfo_RT[1]?.fareReferenceID,
              fareReferenceName: fareInfo_RT[1]?.fareReferenceName,
              flightSegmentSequence: fareInfo_RT[1]?.flightSegmentSequence,
              resBookDesigCode: fareInfo_RT[1]?.resBookDesigCode,
            },
          ]
        : {
            cabin: [fareInfo_RT?.cabin],
            cabinClassCode: [fareInfo_RT?.cabinClassCode],
            fareGroupName: [fareInfo_RT?.fareGroupName],
            fareReferenceCode: fareInfo_RT?.fareReferenceCode,
            fareReferenceID: fareInfo_RT?.fareReferenceID,
            fareReferenceName: fareInfo_RT?.fareReferenceName,
            flightSegmentSequence: fareInfo_RT?.flightSegmentSequence,
            resBookDesigCode: fareInfo_RT?.resBookDesigCode,
          };

      let selectedFarePkg = [];
      fareInfo_RT?.farePkgInfoList?.forEach((pkg) => {
        if (pkg?.selected === "true") {
          selectedFarePkg.push(pkg);
        }
      });

      if (selectedFarePkg?.length > 0) {
        reqBody.fareInfo_RT.farePkgInfoList = selectedFarePkg;
        reqBody.fareInfo_RT.fareBaggageAllowance =
          fareInfo_RT?.fareBaggageAllowance;
      }

      reqBody.flightSegment_RT = twoWayTripDetails?.connectingFlight
        ? [
            {
              airline: [
                {
                  code: [twoWayTripDetails?.flightSegment?.airline?.code],
                  companyFullName: [
                    twoWayTripDetails?.flightSegment?.airline?.companyFullName,
                  ],
                },
              ],
              arrivalAirport: JSON.parse(
                JSON.stringify(twoWayTripDetails?.flightSegment?.arrivalAirport)
              ),
              arrivalDateTime:
                twoWayTripDetails?.flightSegment?.arrivalDateTime,
              arrivalDateTimeUTC:
                twoWayTripDetails?.flightSegment?.arrivalDateTimeUTC,
              departureAirport: JSON.parse(
                JSON.stringify(
                  twoWayTripDetails?.flightSegment?.departureAirport
                )
              ),
              departureDateTime:
                twoWayTripDetails?.flightSegment?.departureDateTime,
              departureDateTimeUTC:
                twoWayTripDetails?.flightSegment?.departureDateTimeUTC,
              flightNumber: twoWayTripDetails?.flightSegment?.flightNumber,
              codeshare: twoWayTripDetails?.flightSegment?.codeshare,
              flightSegmentID:
                twoWayTripDetails?.flightSegment?.flightSegmentID,
              ondControlled: twoWayTripDetails?.flightSegment?.ondControlled,
              sector: twoWayTripDetails?.flightSegment?.sector,
            },
            {
              airline: [
                {
                  code: [
                    twoWayTripDetails?.flightSegment_Connecting?.airline?.code,
                  ],
                  companyFullName: [
                    twoWayTripDetails?.flightSegment_Connecting?.airline
                      ?.companyFullName,
                  ],
                },
              ],
              arrivalAirport: JSON.parse(
                JSON.stringify(
                  twoWayTripDetails?.flightSegment_Connecting?.arrivalAirport
                )
              ),
              arrivalDateTime:
                twoWayTripDetails?.flightSegment_Connecting?.arrivalDateTime,
              arrivalDateTimeUTC:
                twoWayTripDetails?.flightSegment_Connecting?.arrivalDateTimeUTC,
              departureAirport: JSON.parse(
                JSON.stringify(
                  twoWayTripDetails?.flightSegment_Connecting?.departureAirport
                )
              ),
              departureDateTime:
                twoWayTripDetails?.flightSegment_Connecting?.departureDateTime,
              departureDateTimeUTC:
                twoWayTripDetails?.flightSegment_Connecting
                  ?.departureDateTimeUTC,
              flightNumber:
                twoWayTripDetails?.flightSegment_Connecting?.flightNumber,
              codeshare: twoWayTripDetails?.flightSegment?.codeshare,
              flightSegmentID:
                twoWayTripDetails?.flightSegment_Connecting?.flightSegmentID,
              ondControlled:
                twoWayTripDetails?.flightSegment_Connecting?.ondControlled,
              sector: twoWayTripDetails?.flightSegment_Connecting?.sector,
            },
          ]
        : {
            airline: [
              {
                code: [twoWayTripDetails?.flightSegment?.airline?.code],
                companyFullName: [
                  twoWayTripDetails?.flightSegment?.airline?.companyFullName,
                ],
              },
            ],
            arrivalAirport: JSON.parse(
              JSON.stringify(twoWayTripDetails?.flightSegment?.arrivalAirport)
            ),
            arrivalDateTime: twoWayTripDetails?.flightSegment?.arrivalDateTime,
            arrivalDateTimeUTC:
              twoWayTripDetails?.flightSegment?.arrivalDateTimeUTC,
            departureAirport: JSON.parse(
              JSON.stringify(twoWayTripDetails?.flightSegment?.departureAirport)
            ),
            departureDateTime:
              twoWayTripDetails?.flightSegment?.departureDateTime,
            departureDateTimeUTC:
              twoWayTripDetails?.flightSegment?.departureDateTimeUTC,
            flightNumber: twoWayTripDetails?.flightSegment?.flightNumber,
            codeshare: twoWayTripDetails?.flightSegment?.codeshare,
            flightSegmentID: twoWayTripDetails?.flightSegment?.flightSegmentID,
            ondControlled: twoWayTripDetails?.flightSegment?.ondControlled,
            sector: twoWayTripDetails?.flightSegment?.sector,
          };

      // if (twoWayTripDetails?.flightNumber_RT) {
      //   reqBody.flightSegment.flightNumber_RT =
      //     twoWayTripDetails?.flightNumber_RT;
      // }
    }

    axios
      .post(
        `http://stg-api.aeroprime.in/airline-service/createTicket?airlineCode=${airline}`,
        reqBody,
        {
          headers: {
            Authorization: localStorage.getItem("AuthToken"),
            Accept: "application/json",
            securityToken: `${securityToken}`,
          },
        }
      )
      .then((response) => {
        if (response?.data?.success === true) {
          setBookingResponse(response.data);
          // setShowBookingSuccess(true);
          if (response.data.isOfflineBooking === true) {
            setIsOfflineBooking(true);
            setShowLoader(false);
          } else {
            handleConfirmPNR(
              response?.data?.data?.airBookingList?.airReservation
                ?.bookingReferenceIDList?.referenceID,
              response?.data?.data?.airBookingList?.ticketInfo?.totalAmount
                ?.value
            );
          }
          getLoggedInUserDetails();
        } else {
          handleCloseConfirmationDialog();
          setShowBookingFail(true);
          setShowLoader(false);
        }
      })
      .catch((error) => {
        handleCloseConfirmationDialog();
        setShowBookingFail(true);
        setShowLoader(false);
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  // const handleBooking = () => {
  //   setShowLoader(true);
  //   handleCloseConfirmationDialog();

  //   const reqBody = {};

  //   // Booking details - One Way
  //   const buildBookingArray = (details) => [
  //     console.log("details", details),
  //     {
  //       cabin: [details?.cabin],
  //       resBookDesigCode: [details?.resBookDesigCode],
  //       resBookDesigQuantity: [details?.resBookDesigQuantity],
  //       resBookDesigStatusCode: [details?.resBookDesigStatusCode],
  //     },
  //     {
  //       cabin: [details?.cabin],
  //       resBookDesigCode: [details?.resBookDesigCode],
  //       resBookDesigQuantity: [details?.resBookDesigQuantity],
  //       resBookDesigStatusCode: [details?.resBookDesigStatusCode],
  //     },
  //   ];

  //   reqBody.booking = oneWayTripDetails?.connectingFlight
  //     ? buildBookingArray(oneWayTripDetails)
  //     : {
  //         cabin: [oneWayTripDetails?.cabin],
  //         resBookDesigCode: [oneWayTripDetails?.resBookDesigCode],
  //         resBookDesigQuantity: [oneWayTripDetails?.resBookDesigQuantity],
  //         resBookDesigStatusCode: [oneWayTripDetails?.resBookDesigStatusCode],
  //       };

  //   // Fare Info - One Way
  //   let fareInfo = Array.isArray(oneWayTripDetails?.passengerFareInfoList)
  //     ? oneWayTripDetails?.passengerFareInfoList[0]?.fareInfoList
  //     : oneWayTripDetails?.passengerFareInfoList?.fareInfoList;

  //   const mapFareInfo = (info) => ({
  //     cabin: [info?.cabin],
  //     cabinClassCode: [info?.cabinClassCode],
  //     fareGroupName: [info?.fareGroupName],
  //     fareReferenceCode: info?.fareReferenceCode,
  //     fareReferenceID: info?.fareReferenceID,
  //     fareReferenceName: info?.fareReferenceName,
  //     flightSegmentSequence: info?.flightSegmentSequence,
  //     resBookDesigCode: info?.resBookDesigCode,
  //   });

  //   reqBody.fareInfo = oneWayTripDetails?.connectingFlight
  //     ? [mapFareInfo(fareInfo[0]), mapFareInfo(fareInfo[1])]
  //     : mapFareInfo(fareInfo);

  //   const selectedFarePkg = fareInfo?.farePkgInfoList?.filter(
  //     (pkg) => pkg?.selected === "true"
  //   );

  //   if (selectedFarePkg?.length > 0) {
  //     reqBody.fareInfo.farePkgInfoList = selectedFarePkg;
  //     reqBody.fareInfo.fareBaggageAllowance = fareInfo?.fareBaggageAllowance;
  //   }

  //   // Flight Segment - One Way
  //   const mapFlightSegment = (segment) => ({
  //     ...segment,
  //     airline: [
  //       {
  //         code: [segment?.airline?.code],
  //         companyFullName: [segment?.airline?.companyFullName],
  //       },
  //     ],
  //     arrivalAirport: JSON.parse(JSON.stringify(segment?.arrivalAirport)),
  //     departureAirport: JSON.parse(JSON.stringify(segment?.departureAirport)),
  //     arrivalDateTime: segment?.arrivalDateTime,
  //     arrivalDateTimeUTC: segment?.arrivalDateTimeUTC,
  //     departureDateTime: segment?.departureDateTime,
  //     departureDateTimeUTC: segment?.departureDateTimeUTC,
  //     flightNumber: segment?.flightNumber,
  //     codeshare: segment?.codeshare,
  //     flightSegmentID: segment?.flightSegmentID,
  //     ondControlled: segment?.ondControlled,
  //     sector: segment?.sector,
  //   });

  //   reqBody.flightSegment = oneWayTripDetails?.connectingFlight
  //     ? [
  //         mapFlightSegment(oneWayTripDetails?.flightSegment),
  //         mapFlightSegment(oneWayTripDetails?.flightSegment_Connecting),
  //       ]
  //     : mapFlightSegment(oneWayTripDetails?.flightSegment);

  //   // Traveler and Infant List
  //   let travellerList = [];
  //   let infantList = [];

  //   Object.values(passengerDetailList)?.forEach((details) => {
  //     if (details?.passengerTypeCode === "INFT") {
  //       infantList.push(details);
  //     } else {
  //       travellerList.push({
  //         ...details,
  //         email,
  //         areaCode: code,
  //         mobileNo,
  //       });
  //     }
  //   });

  //   reqBody.airTravelerList = travellerList;
  //   reqBody.airlineCode = oneWayTripDetails?.flightSegment?.airline?.code;

  //   if (infantList.length > 0) {
  //     reqBody.infantDetails = infantList;
  //   }

  //   // Two Way Trip Details
  //   if (twoWayTripDetails) {
  //     reqBody.booking_RT = twoWayTripDetails?.connectingFlight
  //       ? buildBookingArray(twoWayTripDetails)
  //       : {
  //           cabin: [twoWayTripDetails?.cabin],
  //           resBookDesigCode: [twoWayTripDetails?.resBookDesigCode],
  //           resBookDesigQuantity: [twoWayTripDetails?.resBookDesigQuantity],
  //           resBookDesigStatusCode: [twoWayTripDetails?.resBookDesigStatusCode],
  //         };

  //     let fareInfo_RT = Array.isArray(twoWayTripDetails?.passengerFareInfoList)
  //       ? twoWayTripDetails?.passengerFareInfoList[0]?.fareInfoList
  //       : twoWayTripDetails?.passengerFareInfoList?.fareInfoList;

  //     reqBody.fareInfo_RT = twoWayTripDetails?.connectingFlight
  //       ? [mapFareInfo(fareInfo_RT[0]), mapFareInfo(fareInfo_RT[1])]
  //       : mapFareInfo(fareInfo_RT);

  //     const selectedFarePkg_RT = fareInfo_RT?.farePkgInfoList?.filter(
  //       (pkg) => pkg?.selected === "true"
  //     );

  //     if (selectedFarePkg_RT?.length > 0) {
  //       reqBody.fareInfo_RT.farePkgInfoList = selectedFarePkg_RT;
  //       reqBody.fareInfo_RT.fareBaggageAllowance =
  //         fareInfo_RT?.fareBaggageAllowance;
  //     }

  //     reqBody.flightSegment_RT = twoWayTripDetails?.connectingFlight
  //       ? [
  //           mapFlightSegment(twoWayTripDetails?.flightSegment),
  //           mapFlightSegment(twoWayTripDetails?.flightSegment_Connecting),
  //         ]
  //       : mapFlightSegment(twoWayTripDetails?.flightSegment);
  //   }

  //   // Final API Call
  //   axios
  //     .post(
  //       `http://stg-api.aeroprime.in/airline-service/createTicket?airlineCode=${airline}`,
  //       reqBody,
  //       {
  //         headers: {
  //           Authorization: localStorage.getItem("AuthToken"),
  //           Accept: "application/json",
  //           securityToken: `${securityToken}`,
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       if (response?.data?.success === true) {
  //         setBookingResponse(response.data);
  //         if (response.data.isOfflineBooking === true) {
  //           setIsOfflineBooking(true);
  //           setShowLoader(false);
  //         } else {
  //           handleConfirmPNR(
  //             response?.data?.data?.airBookingList?.airReservation
  //               ?.bookingReferenceIDList?.referenceID,
  //             response?.data?.data?.airBookingList?.ticketInfo?.totalAmount
  //               ?.value
  //           );
  //         }
  //         getLoggedInUserDetails();
  //       } else {
  //         handleCloseConfirmationDialog();
  //         setShowBookingFail(true);
  //         setShowLoader(false);
  //       }
  //     })
  //     .catch((error) => {
  //       handleCloseConfirmationDialog();
  //       setShowBookingFail(true);
  //       setShowLoader(false);
  //       if (error.response?.status === 401) {
  //         localStorage.clear();
  //         window.location.href = "/";
  //       }
  //     });
  // };

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

  const handleConfirmPNR = (refId, amount) => {
    axios
      .post(
        `http://stg-api.aeroprime.in/airline-service/ticketReservationByRefId?airlineCode=${airline}`,
        {
          referenceID: refId,
          value: Number(amount),
          airlineCode: oneWayTripDetails?.flightSegment?.airline?.code,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("AuthToken"),
            securityToken: `${securityToken}`,
          },
        }
      )
      .then((response) => {
        if (response?.data?.success === true) {
          setShowBookingSuccess(true);
        } else {
          setShowPendingConfirmPNR(true);
        }
        setFetchUserDetails(true);
        handleCloseConfirmationDialog();
        setShowLoader(false);
      })
      .catch((error) => {
        handleCloseConfirmationDialog();
        setShowPendingConfirmPNR(true);
        setShowLoader(false);
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  const handleTicketDownload = (id) => {
    window.open(
      `http://stg-api.aeroprime.in/airline-service/eticket?referenceid=${id}`,
      "_blank",
      "noreferrer"
    );
  };

  const handleCloseConfirmationDialog = () => setShowConfirmDialog(false);
  const handleOpenConfirmationDialog = () => setShowConfirmDialog(true);

  let OneWayFareInfoList = Array.isArray(
    oneWayTripDetails?.passengerFareInfoList
  )
    ? oneWayTripDetails?.passengerFareInfoList[0]?.fareInfoList
    : oneWayTripDetails?.passengerFareInfoList?.fareInfoList;
  let TwoWayFareInfoList = Array.isArray(
    twoWayTripDetails?.passengerFareInfoList
  )
    ? twoWayTripDetails?.passengerFareInfoList[0]?.fareInfoList
    : twoWayTripDetails?.passengerFareInfoList?.fareInfoList;

  return (
    <div className="booking-details-wrapper">
      {showLoader && <Loader hideLoader={true} />}
      <div className="Review-Flight-Details-wrapper">
        <Box
          sx={{
            borderRadius: "50%",
            background: "white",
            border: "2px solid #ef5443", // Circular ring
            padding: "8px", // Space for the icon
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 1,
          }}
        >
          <FlightIcon sx={{ color: "#ef5443", transform: "rotate(90deg)" }} />
        </Box>
        <div className="Review-Flight-Details">REVIEW FLIGHT DETAILS</div>
      </div>
      <div className="flight-cards">
        <div className="flight-cards-col">
          {oneWayTripDetails && (
            <div className="flight-card-wrapper-booking-details">
              <div className="ticket-head">
                <div className="depart-head-wrapper">
                  <div className="depart-head">DEPART</div>
                </div>
                <div className="ticket-head-right">
                  <i className="icon-plane-bd">
                    <FlightTakeoffIcon />
                  </i>
                  <div className="depart-arrival-city-wrapper-bd">
                    <div className="flight-depart-city-name">
                      {oneWayTripDetails?.departureCity}
                    </div>
                    <div className="dash">-</div>
                    <div className="flight-arrival-city-name">
                      {oneWayTripDetails?.arrivalCity}
                    </div>
                  </div>
                </div>
                <div className="depart-head-seperator"></div>
                <div className="flight-date">
                  {
                    oneWayTripDetails?.flightSegment?.departureDateTime?.split(
                      "T"
                    )[0]
                  }
                </div>
              </div>
              <div className="bd-flight-name-details">
                <div className="bd-flight-name-details">
                  <div className="flight-logo">
                    {oneWayTripDetails.flightName === "FLY ARYSTAN" && (
                      <img src={flyArystan} alt="flight-icon" />
                    )}
                    {oneWayTripDetails.flightName ===
                      "Turkmenistan Airlines" && (
                      <img
                        className="T5-logo-bd"
                        src={TurkAirlines}
                        alt="flight-icon"
                      />
                    )}
                    {oneWayTripDetails.flightName === "SalamAir" && (
                      <img src={salam} alt="flight-icon" />
                    )}
                  </div>
                  <div className="bd-ticket-wrapper">
                    <div className="flight-name">
                      {oneWayTripDetails?.flightName}
                    </div>
                    <div className="flight-number">
                      {`${oneWayTripDetails.flightNumber}${
                        oneWayTripDetails?.flightNumber_RTA
                          ? ` / ${oneWayTripDetails?.flightNumber_RT}`
                          : ""
                      }`}
                    </div>
                    <div className="seperator" />
                    <div className="cabin">{oneWayTripDetails?.cabin}</div>
                    <div className="design-code">
                      Class - {oneWayTripDetails?.resBookDesigCode}
                    </div>
                    <div className="design-code">
                      Seats Available -{" "}
                      {oneWayTripDetails?.resBookDesigQuantity}
                    </div>
                  </div>
                </div>
                <div className="flight-city-details">
                  <div className="flight-city-left">
                    {/* <div className="flight-city-name">
                        {
                          oneWayTripDetails?.flightSegment?.departureDateTime?.split(
                            "T"
                          )[0]
                        }
                      </div> */}
                    <div className="flight-city-code">
                      <span className="flight-city-time">
                        {oneWayTripDetails?.departureTime}
                      </span>
                    </div>
                    <div className="flight-city-name">
                      {oneWayTripDetails?.departureCity},(
                      {oneWayTripDetails?.departureCityCode})
                    </div>
                  </div>
                  <div className="flight-city-seperator">
                    <div className="duration">
                      {oneWayTripDetails?.flightDuration}
                    </div>
                    <div className="line-plane">
                      <div className="line-seperator"></div>
                      <FlightIcon
                        className="right-plane"
                        sx={{ transform: "rotate(90deg)" }}
                      />
                    </div>
                    <div className="stop">{`${
                      Number(oneWayTripDetails.stops) !== 0
                        ? `${oneWayTripDetails.stops} stop`
                        : "Non stop"
                    } ${
                      oneWayTripDetails?.stopOverCity
                        ? `via ${oneWayTripDetails?.stopOverCity}`
                        : ""
                    }`}</div>
                  </div>
                  <div className="flight-city-right">
                    {/* <div className="flight-city-name">
                        {
                          oneWayTripDetails?.flightSegment?.arrivalDateTime?.split(
                            "T"
                          )[0]
                        }
                      </div> */}
                    <div className="flight-city-code">
                      <span className="flight-city-time">
                        {oneWayTripDetails?.arrivalTime}
                      </span>
                    </div>
                    <div className="flight-city-name">
                      {oneWayTripDetails?.arrivalCity},(
                      {oneWayTripDetails?.arrivalCityCode})
                    </div>
                  </div>
                </div>
                {OneWayFareInfoList?.farePkgInfoList && (
                  <div className="flexi-selection-bd">
                    {OneWayFareInfoList?.farePkgInfoList[0]?.selected ===
                      "true" && (
                      <div className="flexi-selection-bd">
                        <div className="header-bd">
                          <div className="header-sub-bd">Standard Plus</div>
                        </div>
                        <div className="flexi-features-bd">
                          {OneWayFareInfoList?.farePkgInfoList[0]?.pkgExplanationType?.pkgExplanationList?.map(
                            (pkgfeature) => {
                              return (
                                <div className="feature-bd">
                                  {featureMapper[pkgfeature?.pkgExplanation]}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                    {OneWayFareInfoList?.farePkgInfoList[1]?.selected ===
                      "true" && (
                      <div className="flexi-selection-bd">
                        <div className="header-bd">
                          <div className="header-sub-bd">Comfort</div>
                        </div>
                        <div className="flexi-features-bd">
                          {OneWayFareInfoList?.farePkgInfoList[1]?.pkgExplanationType?.pkgExplanationList?.map(
                            (pkgfeature) => {
                              return (
                                <div className="feature-bd">
                                  {featureMapper[pkgfeature?.pkgExplanation]}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                    {OneWayFareInfoList?.farePkgInfoList[2]?.selected ===
                      "true" && (
                      <div className="flexi-selection-bd">
                        <div className="header-bd">
                          <div className="header-sub-bd">Comfort Plus</div>
                        </div>
                        <div className="flexi-features-bd">
                          {OneWayFareInfoList?.farePkgInfoList[2]?.pkgExplanationType?.pkgExplanationList?.map(
                            (pkgfeature) => {
                              return (
                                <div className="feature-bd">
                                  {featureMapper[pkgfeature?.pkgExplanation]}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                    {OneWayFareInfoList?.farePkgInfoList[0]?.selected !==
                      "true" &&
                      OneWayFareInfoList?.farePkgInfoList[1]?.selected !==
                        "true" &&
                      OneWayFareInfoList?.farePkgInfoList[2]?.selected !==
                        "true" && (
                        <div className="flexi-selection-bd">
                          <div className="header-bd">
                            <div className="header-sub-bd">Standard</div>
                          </div>
                          <div className="flexi-features-bd">
                            <div className="feature-bd">
                              {featureMapper["HBAG5"]}
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          )}
          {twoWayTripDetails && (
            <div className="flight-card-wrapper-booking-details">
              <div className="ticket-head">
                <div className="depart-head-wrapper">
                  <div className="depart-head">RETURN</div>
                </div>
                <div className="ticket-head-right">
                  <i className="icon-plane-bd">
                    <FlightLandIcon />
                  </i>
                  <div className="depart-arrival-city-wrapper-bd">
                    <div className="flight-depart-city-name">
                      {twoWayTripDetails?.departureCity}
                    </div>
                    <div className="dash">-</div>
                    <div className="flight-arrival-city-name">
                      {twoWayTripDetails?.arrivalCity}
                    </div>
                  </div>
                </div>
                <div className="depart-head-seperator"></div>
                <div className="flight-date">
                  {
                    twoWayTripDetails?.flightSegment?.departureDateTime?.split(
                      "T"
                    )[0]
                  }
                </div>
              </div>
              <div className="bd-flight-name-details">
                <div className="bd-flight-name-details">
                  <div className="flight-logo">
                    {twoWayTripDetails.flightName === "FLY ARYSTAN" && (
                      <img
                        className="T5-logo-bd"
                        src={flyArystan}
                        alt="flight-icon"
                      />
                    )}
                    {twoWayTripDetails.flightName ===
                      "Turkmenistan Airlines" && (
                      <img
                        className="T5-logo-bd"
                        src={TurkAirlines}
                        alt="flight-icon"
                      />
                    )}
                    {twoWayTripDetails?.flightName === "SalamAir" && (
                      <img
                        className="OV-logo-bd"
                        src={salam}
                        alt="flight-icon"
                      />
                    )}
                  </div>
                  <div className="bd-ticket-wrapper">
                    <div className="flight-name">
                      {twoWayTripDetails?.flightName}
                    </div>
                    <div className="flight-number">
                      {`${twoWayTripDetails.flightNumber}${
                        twoWayTripDetails?.flightNumber_RT
                          ? ` / ${twoWayTripDetails?.flightNumber_RT}`
                          : ""
                      }`}
                    </div>
                    <div className="seperator" />
                    <div className="cabin">{twoWayTripDetails?.cabin}</div>
                    <div className="design-code">
                      Class - {twoWayTripDetails?.resBookDesigCode}
                    </div>
                    <div className="design-code">
                      Seats Available -{" "}
                      {twoWayTripDetails?.resBookDesigQuantity}
                    </div>
                  </div>
                </div>
                <div className="flight-city-details">
                  <div className="flight-city-left">
                    {/* <div className="flight-city-name">
                        {
                          twoWayTripDetails?.flightSegment?.departureDateTime?.split(
                            "T"
                          )[0]
                        }
                      </div> */}
                    <div className="flight-city-code">
                      <span className="flight-city-time">
                        {twoWayTripDetails?.departureTime}
                      </span>
                    </div>
                    <div className="flight-city-name">
                      {twoWayTripDetails?.departureCity}.(
                      {twoWayTripDetails?.departureCityCode})
                    </div>
                  </div>
                  <div className="flight-city-seperator">
                    <div className="duration">
                      {twoWayTripDetails?.flightDuration}
                    </div>
                    <div className="line-plane">
                      <FlightIcon
                        className="right-plane"
                        sx={{ transform: "rotate(270deg)" }}
                      />
                      <div className="line-seperator"></div>
                    </div>
                    <div className="stop">{`${
                      Number(twoWayTripDetails.stops) !== 0
                        ? `${twoWayTripDetails.stops} stop`
                        : "Non stop"
                    } ${
                      twoWayTripDetails?.stopOverCity
                        ? `via ${twoWayTripDetails?.stopOverCity}`
                        : ""
                    }`}</div>
                  </div>
                  <div className="flight-city-right">
                    {/* <div className="flight-city-name">
                        {
                          twoWayTripDetails?.flightSegment?.arrivalDateTime?.split(
                            "T"
                          )[0]
                        }
                      </div> */}
                    <div className="flight-city-code">
                      <span className="flight-city-time">
                        {twoWayTripDetails?.arrivalTime}
                      </span>
                    </div>
                    <div className="flight-city-name">
                      {twoWayTripDetails?.arrivalCity},(
                      {twoWayTripDetails?.arrivalCityCode})
                    </div>
                  </div>
                </div>
                {TwoWayFareInfoList?.farePkgInfoList && (
                  <div className="flexi-selection-bd">
                    {TwoWayFareInfoList?.farePkgInfoList[0]?.selected ===
                      "true" && (
                      <div className="flexi-selection-bd">
                        <div className="header-bd">
                          <div className="header-sub-bd">Standard Plus</div>
                        </div>
                        <div className="flexi-features-bd">
                          {TwoWayFareInfoList?.farePkgInfoList[0]?.pkgExplanationType?.pkgExplanationList?.map(
                            (pkgfeature) => {
                              return (
                                <div className="feature-bd">
                                  {featureMapper[pkgfeature?.pkgExplanation]}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                    {TwoWayFareInfoList?.farePkgInfoList[1]?.selected ===
                      "true" && (
                      <div className="flexi-selection-bd">
                        <div className="header-bd">
                          <div className="header-sub-bd">Comfort</div>
                        </div>
                        <div className="flexi-features-bd">
                          {TwoWayFareInfoList?.farePkgInfoList[1]?.pkgExplanationType?.pkgExplanationList?.map(
                            (pkgfeature) => {
                              return (
                                <div className="feature-bd">
                                  {featureMapper[pkgfeature?.pkgExplanation]}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                    {TwoWayFareInfoList?.farePkgInfoList[2]?.selected ===
                      "true" && (
                      <div className="flexi-selection-bd">
                        <div className="header-bd">
                          <div className="header-sub-bd">Comfort Plus</div>
                        </div>
                        <div className="flexi-features-bd">
                          {TwoWayFareInfoList?.farePkgInfoList[2]?.pkgExplanationType?.pkgExplanationList?.map(
                            (pkgfeature) => {
                              return (
                                <div className="feature-bd">
                                  {featureMapper[pkgfeature?.pkgExplanation]}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                    {TwoWayFareInfoList?.farePkgInfoList[0]?.selected !==
                      "true" &&
                      TwoWayFareInfoList?.farePkgInfoList[1]?.selected !==
                        "true" &&
                      TwoWayFareInfoList?.farePkgInfoList[2]?.selected !==
                        "true" && (
                        <div className="flexi-selection-bd">
                          <div className="header-bd">
                            <div className="header-sub-bd">Standard</div>
                          </div>
                          <div className="flexi-features-bd">
                            <div className="feature-bd">
                              {featureMapper["HBAG5"]}
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {oneWayTripDetails && twoWayTripDetails && (
          <div className="fare-section-bd">
            <div className="Price-Summary-bd-wrapper">
              <div className="Price-Summary-bd">PRICE SUMMARY</div>
            </div>
            <div className="fare-header-bd">TOTAL TO PAY</div>
            <div className="fare-header-seperator"></div>
            <div className="fare-bd">
              <span className="currency-code-bd">
                {oneWayTripDetails?.currencyCode}
              </span>
              <span className="total-amount-bd">
                {Math.round(
                  (Number(oneWayTripDetails?.totalAmount) +
                    Number(twoWayTripDetails?.totalAmount)) *
                    100
                ) / 100}
              </span>
              {/* {`${oneWayTripDetails?.currencyCode} ${Math.round(
                (Number(oneWayTripDetails?.totalAmount) +
                  Number(twoWayTripDetails?.totalAmount)) *
                100
              ) / 100
                }`} */}
              {/* {`${oneWayTripDetails?.currencyCode} ${Math.round(
                (Number(oneWayTripDetails?.totalAmount) * 100) / 100
              )}`} */}
              {/* <img src={rupeeSvg} alt="INR" className="rupeeSvg" />
              {`${
                Number(oneWayTripDetails?.totalAmount) +
                Number(twoWayTripDetails?.totalAmount)
              }`} */}
            </div>
          </div>
        )}
        {oneWayTripDetails && !twoWayTripDetails && (
          <div className="fare-section-bd">
            <div className="Price-Summary-bd-wrapper">
              <div className="Price-Summary-bd">PRICE SUMMARY</div>
            </div>
            <div className="fare-header-bd">TOTAL TO PAY</div>
            <div className="fare-header-seperator"></div>
            <div className="fare-bd">
              <span className="currency-code-bd">
                {oneWayTripDetails?.currencyCode}
              </span>
              <span className="total-amount-bd">
                {`${oneWayTripDetails?.currencyCode} ${Math.round(
                  (Number(oneWayTripDetails?.totalAmount) * 100) / 100
                )}`}
              </span>
              {/* {`${oneWayTripDetails?.currencyCode} ${Math.round(
              (Number(oneWayTripDetails?.totalAmount) +
                Number(twoWayTripDetails?.totalAmount)) *
              100
            ) / 100
              }`} */}

              {/* <img src={rupeeSvg} alt="INR" className="rupeeSvg" />
            {`${
              Number(oneWayTripDetails?.totalAmount) +
              Number(twoWayTripDetails?.totalAmount)
            }`} */}
            </div>
          </div>
        )}
      </div>
      {!(
        showBookingSuccess ||
        showPendingConfirmPNR ||
        showBookingFail ||
        isOfflineBooking
      ) && (
        <div className="Contact-Details-bd-wrapper">
          {passengerDetailList && (
            <Dialog
              open={showConfirmDialog}
              onClose={handleCloseConfirmationDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle
                id="alert-dialog-title"
                style={{ display: "flex", justifyContent: "center" }}
              >
                Confirmation
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {/* <div style={{ display: "flex", flexDirection: "column" }}> */}
                  <div>The booking will be created for the following:</div>
                  <div className="pax-name">
                    {Object.values(passengerDetailList)?.map((pax) => {
                      if (pax?.passengerTypeCode === "INFT") {
                        return <div>{`${pax?.name} ${pax?.surname}`}</div>;
                      } else {
                        return (
                          <div>{`${pax?.nameTitle === "MRS" ? "Mrs." : "Mr."} ${
                            pax?.fname
                          } ${pax?.lname}`}</div>
                        );
                      }
                    })}
                  </div>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseConfirmationDialog}>
                  Disagree
                </Button>
                <Button onClick={handleBooking} autoFocus>
                  Agree
                </Button>
              </DialogActions>
            </Dialog>
          )}
          <div className="Contact-Details-bd">CONTACT INFO</div>
          <div className="Contact-Details-bd-seperator"></div>
          <div className="email-no-wrapper-bd">
            <div className="email-wrapper">
              <FormControl fullWidth>
                <input
                  //  className={`Input-bd ${isFocused ? "focused" : ""}`}
                  className={`Input-bd ${
                    showInputErrors &&
                    (!email ||
                      !String(email)
                        ?.toLowerCase()
                        ?.match(
                          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        ))
                      ? "error"
                      : ""
                  }`}
                  type="email"
                  placeholder="Email ID*"
                  value={email}
                  fullWidth
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  // error={
                  //   showInputErrors &&
                  //   (!email ||
                  //     !String(email)
                  //       ?.toLowerCase()
                  //       ?.match(
                  //         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                  //       ))
                  // }
                ></input>
              </FormControl>
              {/* <FormControl fullWidth>
                  <input
                    className="Input-bd"
                    type="email"
                    placeholder="Confirm Email ID*"
                    value={email}
                    fullWidth
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    error={
                      showInputErrors &&
                      (!email ||
                        !String(email)
                          ?.toLowerCase()
                          ?.match(
                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                          ))
                    }
                  ></input>
                </FormControl> */}
            </div>

            <div className="mobileNo-wrapper-bd">
              <div className="country-code-bd">
                <StyledFormControl fullWidth>
                  <Select
                    className="country-code-bd"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={code}
                    label=""
                    onChange={(event) => setCode(event.target.value)}
                    name="Airline"
                    style={{
                      color: "#707271",
                      fontFamily: "Inter",
                      fontSize: "14px",
                      fontWeight: "400",
                      width: "110px",
                      height: "55px",
                      marginRight: "10px",
                      boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)", // Add your box shadow here
                    }}
                    IconComponent={(props) => (
                      <ExpandMoreIcon
                        {...props}
                        style={{
                          color: "#ff5722",
                          marginRight: "8px",
                        }}
                      />
                    )}
                    MenuProps={MenuProps}
                  >
                    {countryCodeArray?.map((countryCode) => {
                      return (
                        <MenuItem
                          value={`+${countryCode?.code}`}
                        >{`+${countryCode?.code}`}</MenuItem>
                      );
                    })}
                  </Select>
                </StyledFormControl>
              </div>
              <div className="mobile-no-wrapper">
                <FormControl fullWidth>
                  <input
                    className={`Input-bd ${
                      showInputErrors && (!mobileNo || mobileNo?.length !== 10)
                        ? "error"
                        : ""
                    }`}
                    type="number"
                    placeholder="Mobile Number"
                    value={mobileNo}
                    fullWidth
                    onChange={(event) => setMobileNo(event.target.value)}
                    required
                    // error={
                    //   showInputErrors && (!mobileNo || mobileNo?.length !== 10)
                    // }
                  ></input>
                </FormControl>
              </div>
            </div>
          </div>
        </div>
      )}
      {!(
        showBookingSuccess ||
        showPendingConfirmPNR ||
        showBookingFail ||
        isOfflineBooking
      ) && (
        <div className="pax-details-wrapper">
          <div className="Contact-Details-bd">PASSENGER DETAILS</div>
          <div className="Contact-Details-bd-seperator"></div>
          {passengerDetailList &&
            Object.keys(passengerDetailList)?.map((pax, index) => {
              return (
                <div className="pax-details">
                  <div className="header-pax">
                    <AccountCircleRoundedIcon />
                    {pax}
                  </div>
                  <div className="details-section">
                    <div className="firstName-wrapper">
                      {passengerDetailList[pax]?.passengerTypeCode !==
                        "INFT" && (
                        <div className="title">
                          <StyledFormControl
                            fullWidth
                            error={
                              showInputErrors &&
                              passengerDetailList[pax]?.nameTitle === null
                            }
                          >
                            {/* <InputLabel id="demo-simple-select-label">
                                  Title
                                </InputLabel> */}
                            <Select
                              className="country-code-bd"
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={passengerDetailList[pax].nameTitle}
                              onChange={(event) =>
                                handlePassengerDetailUpdate(
                                  pax,
                                  event.target.value,
                                  "nameTitle"
                                )
                              }
                              name="Airline"
                              required
                              displayEmpty
                              renderValue={(selected) => {
                                if (!selected) {
                                  return (
                                    <PlaceholderTypography>
                                      Tittle
                                    </PlaceholderTypography>
                                  );
                                }
                                return selected;
                              }}
                              style={{
                                color: "#707271",
                                fontFamily: "Inter",
                                fontSize: "14px",
                                fontWeight: "400",
                                width: "110px",
                                height: "50px",
                                boxShadow:
                                  "0px 4px 4px 0px rgba(0, 0, 0, 0.25)", // Add your box shadow here
                              }}
                              IconComponent={(props) => (
                                <ExpandMoreIcon
                                  {...props}
                                  style={{
                                    color: "#ff5722",
                                    marginRight: "8px",
                                  }}
                                />
                              )}
                            >
                              <MenuItem value="MRS">Mrs.</MenuItem>
                              <MenuItem value="MR">Mr.</MenuItem>
                            </Select>
                          </StyledFormControl>
                        </div>
                      )}
                      <div className="firstName-bd">
                        <FormControl fullWidth>
                          <input
                            // error={
                            //   showInputErrors &&
                            //   (passengerDetailList[pax]?.passengerTypeCode !==
                            //     "INFT"
                            //     ? !passengerDetailList[pax]?.fname
                            //     : !passengerDetailList[pax]?.name)
                            // }

                            // className="Input-bd-name"
                            className={`Input-bd-name ${
                              showInputErrors &&
                              (passengerDetailList[pax]?.passengerTypeCode !==
                              "INFT"
                                ? !passengerDetailList[pax]?.fname
                                : !passengerDetailList[pax]?.name)
                                ? "error"
                                : ""
                            }`}
                            required
                            type="text"
                            placeholder="First Name"
                            value={passengerDetailList[pax].fname}
                            fullWidth
                            onChange={(event) =>
                              handlePassengerDetailUpdate(
                                pax,
                                event.target.value,
                                passengerDetailList[pax]?.passengerTypeCode ===
                                  "INFT"
                                  ? "name"
                                  : "fname"
                              )
                            }
                          ></input>
                        </FormControl>
                      </div>
                    </div>
                    <div className="lastName-wrapper-bd">
                      <FormControl fullWidth>
                        <input
                          // error={
                          //   showInputErrors &&
                          //   (passengerDetailList[pax]?.passengerTypeCode !==
                          //     "INFT"
                          //     ? !passengerDetailList[pax]?.lname
                          //     : !passengerDetailList[pax]?.surname)
                          // }
                          // className="Input-bd-name"
                          className={`Input-bd-name ${
                            showInputErrors &&
                            (passengerDetailList[pax]?.passengerTypeCode !==
                            "INFT"
                              ? !passengerDetailList[pax]?.lname
                              : !passengerDetailList[pax]?.surname)
                              ? "error"
                              : ""
                          }`}
                          required
                          type="text"
                          placeholder="Last Name"
                          value={passengerDetailList[pax].lname}
                          fullWidth
                          onChange={(event) =>
                            handlePassengerDetailUpdate(
                              pax,
                              event.target.value,
                              passengerDetailList[pax]?.passengerTypeCode ===
                                "INFT"
                                ? "surname"
                                : "lname"
                            )
                          }
                        ></input>
                      </FormControl>
                    </div>
                    <div className="birthdate-wrapper">
                      <StyledFormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DatePicker"]}>
                            <CustomDatePicker
                              slotProps={{
                                textField: {
                                  error:
                                    showInputErrors &&
                                    !passengerDetailList[pax]?.birthDate,
                                },
                              }}
                              label="Birth Date"
                              onChange={(val) =>
                                handlePassengerDetailUpdate(
                                  pax,
                                  `${val["$y"]}-${
                                    val["$M"] + 1 < 10
                                      ? `0${val["$M"] + 1}`
                                      : `${val["$M"] + 1}`
                                  }-${
                                    val["$D"] < 10 ? `0${val["$D"]}` : val["$D"]
                                  }`,
                                  "birthDate"
                                )
                              }
                              minDate={
                                passengerDetailList[pax]?.passengerTypeCode ===
                                "INFT"
                                  ? dayjs(
                                      oneWayTripDetails?.flightSegment
                                        ?.departureDateTime
                                    ).subtract(2, "year")
                                  : passengerDetailList[pax]
                                      ?.passengerTypeCode === "CHLD"
                                  ? dayjs(
                                      oneWayTripDetails?.flightSegment
                                        ?.departureDateTime
                                    ).subtract(12, "year")
                                  : null
                              }
                              maxDate={
                                passengerDetailList[pax]?.passengerTypeCode ===
                                "INFT"
                                  ? dayjs()
                                  : passengerDetailList[pax]
                                      ?.passengerTypeCode === "CHLD"
                                  ? dayjs(
                                      oneWayTripDetails?.flightSegment
                                        ?.departureDateTime
                                    ).subtract(2, "year")
                                  : dayjs()
                              }
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </StyledFormControl>
                    </div>
                  </div>
                  <div className="details-section">
                    {passengerDetailList[pax]?.passengerTypeCode !== "INFT" && (
                      <div className="nationality">
                        <StyledFormControl
                          fullWidth
                          error={
                            showInputErrors &&
                            !passengerDetailList[pax]?.docHolderNationality
                          }
                        >
                          <Select
                            className="Nationality-bd"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={
                              Object.values(passengerDetailList)[index]
                                ?.docHolderNationality
                            }
                            onChange={(event) =>
                              handlePassengerDetailUpdate(
                                pax,
                                event.target.value,
                                "docHolderNationality"
                              )
                            }
                            name="Nationality"
                            style={{
                              color: "#707271",
                              fontFamily: "Inter",
                              fontSize: "14px",
                              fontWeight: "400",
                              width: "150px",
                              height: "50px",
                              marginRight: "10px",
                              boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)", // Add your box shadow here
                            }}
                            IconComponent={(props) => (
                              <ExpandMoreIcon
                                {...props}
                                style={{
                                  color: "#ff5722",
                                  marginRight: "8px",
                                }}
                              />
                            )}
                            MenuProps={MenuProps}
                          >
                            {countryCodeArray?.map((countryCode) => {
                              return (
                                <MenuItem value={countryCode?.iso}>
                                  {countryCode?.country}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </StyledFormControl>
                      </div>
                    )}

                    {passengerDetailList[pax]?.passengerTypeCode !== "INFT" && (
                      <div className="passport-number">
                        <FormControl fullWidth>
                          <input
                            error={
                              showInputErrors &&
                              !passengerDetailList[pax]?.docID
                            }
                            required
                            className="Input-bd-name"
                            type="text"
                            placeholder="Passport Number"
                            fullWidth
                            onChange={(event) =>
                              handlePassengerDetailUpdate(
                                pax,
                                event.target.value,
                                "docID"
                              )
                            }
                          ></input>
                        </FormControl>
                      </div>
                    )}
                    {passengerDetailList[pax]?.passengerTypeCode !== "INFT" && (
                      <div className="passport-date">
                        <StyledFormControl
                          fullWidth
                          error={
                            showInputErrors &&
                            !passengerDetailList[pax]?.docExpireDate
                          }
                        >
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer
                              components={["DatePicker"]}
                              sx={{ height: "55px" }}
                            >
                              <CustomDatePicker
                                slotProps={{
                                  textField: {
                                    error:
                                      showInputErrors &&
                                      !passengerDetailList[pax]?.docExpireDate,
                                  },
                                }}
                                label="Passport Expiry Date"
                                onChange={(val) =>
                                  handlePassengerDetailUpdate(
                                    pax,
                                    `${val["$y"]}-${
                                      val["$M"] + 1 < 10
                                        ? `0${val["$M"] + 1}`
                                        : `${val["$M"] + 1}`
                                    }-${
                                      val["$D"] < 10
                                        ? `0${val["$D"]}`
                                        : val["$D"]
                                    }`,
                                    "docExpireDate"
                                  )
                                }
                                minDate={
                                  twoWayTripDetails
                                    ? dayjs(
                                        twoWayTripDetails?.flightSegment
                                          ?.departureDateTime
                                      )
                                    : dayjs(
                                        oneWayTripDetails?.flightSegment
                                          ?.departureDateTime
                                      )
                                }
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </StyledFormControl>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
      {!(
        showBookingSuccess ||
        showPendingConfirmPNR ||
        showBookingFail ||
        isOfflineBooking
      ) && (
        <div className="Book-btn-bd-wrapper">
          <button
            className="Book-btn-bd"
            variant="contained"
            onClick={handleBookButtonClick}
          >
            BOOK NOW
          </button>
        </div>
      )}
      {(showBookingSuccess || showPendingConfirmPNR || isOfflineBooking) && (
        <div className="success-wrapper">
          <img src={successGIF} alt="" className="success-icon" />
          {showBookingSuccess && (
            <div className="success-msg">
              Your Booking has been Successful !!
              <div className="download -ticket-btn">
                <Button
                  variant="contained"
                  onClick={() =>
                    handleTicketDownload(
                      bookingResponse?.data?.airBookingList?.airReservation
                        ?.bookingReferenceIDList?.referenceID
                    )
                  }
                >
                  Download Ticket
                </Button>
              </div>
            </div>
          )}
          {showPendingConfirmPNR && (
            <div className="success-pending-msg">
              <div className="success-msg-header">
                Booking has been created. Unfortunately, PNR has not been
                confirmed yet!!
              </div>
              {/* <div className="success-msg-subheader">
                  Please try confirming your PNR after sometime from Search PNR
                  screen!!
                </div> */}
            </div>
          )}
          {isOfflineBooking && (
            <div className="success-pending-msg">
              <div className="success-msg-header">
                {bookingResponse?.message}
              </div>
            </div>
          )}
          <div className="section">
            {!isOfflineBooking && (
              <div className="pnr">{`PNR - ${bookingResponse?.data?.airBookingList?.airReservation?.bookingReferenceIDList?.ID}`}</div>
            )}
            {!isOfflineBooking && (
              <div className="ref">{`Reference Id - ${bookingResponse?.data?.airBookingList?.airReservation?.bookingReferenceIDList?.referenceID}`}</div>
            )}
          </div>
          <div className="section">
            <div className="booked-pax-wrapper">
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead sx={{ backgroundColor: "#004e89" }}>
                    <TableRow>
                      <StyledTableCell>S.No.</StyledTableCell>
                      <StyledTableCell align="left">
                        Passenger Type
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Passenger Name
                      </StyledTableCell>
                      <StyledTableCell align="left">Gender</StyledTableCell>
                      <StyledTableCell align="left">
                        Passport No.
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.values(passengerDetailList)?.map((pax, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell align="left">
                          {pax?.passengerTypeCode === "ADLT" && `Adult`}
                          {pax?.passengerTypeCode === "CHLD" && `Child`}
                          {pax?.passengerTypeCode === "INFT" && `Infant`}
                        </TableCell>
                        <TableCell align="left">
                          {pax?.passengerTypeCode === "INFT"
                            ? `${pax?.name} ${pax?.surname}`
                            : `${pax?.nameTitle === "MRS" ? "Mrs." : "Mr."} ${
                                pax?.fname
                              } ${pax?.lname}`}
                        </TableCell>
                        <TableCell align="left">
                          {pax?.passengerTypeCode === "INFT"
                            ? ``
                            : `${pax?.gender === "M" ? "Male" : "Female"}`}
                        </TableCell>
                        <TableCell>{pax?.docID}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      )}
      {showBookingFail && (
        <div className="error-wrapper">
          <img src={errorGIF} alt="" className="error-icon" />
          <div className="error-msg">
            OOPS!! Your booking cannot be confirmed at this moment.
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetails;
