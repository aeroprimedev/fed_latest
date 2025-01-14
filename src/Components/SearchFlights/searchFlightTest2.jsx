import React, { useEffect, useState } from "react";
import "./SearchFlights.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DropDown from "../DropDown/DropDown";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "../Loader/Loader";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { format } from "date-fns";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import SearchIcon from "@mui/icons-material/Search";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#334555",
    color: theme.palette.common.white,
    fontWeight: 500,
  },
}));
const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
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
// Custom Styled Radio Button
const CustomRadio = styled(Radio)(({ theme }) => ({
  "&.Mui-checked": {
    color: "#EF5443", // Red color for the selected radio button
  },
  "& .MuiSvgIcon-root": {
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
const PlaceholderTypography = styled("div")(({ theme }) => ({
  color: "#888",
  fontSize: "16px",
}));

// Custom Label Styling
const CustomFormControlLabel = styled(FormControlLabel)({
  "& .MuiFormControlLabel-label": {
    fontSize: "16px",
    fontWeight: 700,
    color: "#334555", // Dark grey text color
    fontFamily: "Inter",
  },
});
const CustomDatePicker = styled(DatePicker)({
  "& .MuiInputBase-root": {
    width: "400px",
    height: "50px",
  },
  "& .MuiInputBase-input": {
    color: "#000",
    fontSize: "15px",
  },
});
export function SearchFlightsTest2({ setSearchResult }) {
  const [errorMessage, setErrorMessage] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [bookingHistoryData, setBookingHistoryData] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [totalResults, setTotalResults] = useState(null);
  const [page, setPage] = useState(1);
  const [airlineOptions, setAirlineOptions] = useState([]);
  const [tripType, setTripType] = useState("ONE_WAY");
  const [flightsAvailable, setFlightsAvailable] = useState({});
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [dateLabel1, setDateLabel1] = useState("Departing");
  const [dateLabel2, setDateLabel2] = useState("Returning");
  const [showPassengerSelection, setShowPassengerSelection] = useState(false);
  const [adult, setAdults] = useState(1);
  const [child, setChildren] = useState(0);
  const [infant, setInfants] = useState(0);

  const [selectedAdult, setSelectedAdult] = useState(1);
  const [selectedChild, setSelectedChild] = useState(0);
  const [selectedInfant, setSelectedInfant] = useState(0);
  const [totalTravelers, setTotalTravelers] = useState(0);
  const [pnr, setPnr] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [airline, setAirline] = useState(" ");
  const loggedInUserDetails = useSelector(
    (state) => state.loggedInUserDetails.loggedInUserDetails
  );

  // const currentDate = new Date();
  // currentDate.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

  console.log(loggedInUserDetails);

  function getAirlineAndOption() {
    if (loggedInUserDetails && loggedInUserDetails.airlineCodes) {
      setAirlineOptions(loggedInUserDetails?.airlineCodes);
      setAirline(loggedInUserDetails?.airlineCodes[0]);
    }
  }
  useEffect(() => getAirlineAndOption(), [loggedInUserDetails]);

  useEffect(() => {
    if (loggedInUserDetails) {
      setSelectedClient(loggedInUserDetails?.role);
    }
    console.log(selectedClient);
  }, [loggedInUserDetails]);
  useEffect(() => {
    if (airline) {
      setShowLoader(true);
      setOrigin(null);
      setDestination(null);
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
  const formatLocation = (location) => {
    if (!location) return [];
    const [code, name] = location.split(",");
    return [code, name];
  };

  const formatDate = (date) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };
  // const formatDate = (date) => {
  //     const formatter = new Intl.DateTimeFormat("en-GB", {
  //       day: "numeric",
  //       month: "short", // 'May' instead of '05'
  //       year: "2-digit", // '24' instead of '2024'
  //     });

  // Replace standard apostrophe with a more typographically correct one
  //     return formatter.format(date).replace("'", "’");
  //   };

  const handleOriginChange = (value) => {
    setOrigin(value);
  };
  const handleDestinationChange = (value) => {
    setDestination(value);
  };
  const originList = Object.keys(flightsAvailable);
  const destinationOptions = origin ? flightsAvailable[origin] : [];

  const handleAirlineChange = async (airline) => {
    setAirline(airline);
    setShowLoader(true);
  };

  const handleSearchFlights = () => {
    setErrorMessage(false);
    setShowLoader(true);
    const [originCode] = formatLocation(origin);
    const [destinationCode] = formatLocation(destination);
    const formattedDepartureDate = formatDate(departureDate);
    const formattedReturnDate = formatDate(returnDate);

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
        if (response.status === 200) {
          setSearchResult({
            ...response.data,
            tripType,
            securityToken: response?.data?.metaData?.securityToken ?? null,
          });
          console.log(setSearchResult);
          navigate("/searchResults", {
            state: {
              searchRequestBody: reqBody,
              departureDate: departureDate,
              returnDate: returnDate,
              origin: origin,
              destination: destination,
            },
          });

          setShowLoader(false);
        }
        if (response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
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

  const handleSelection = (type, value) => {
    if (type === "adult") setSelectedAdult(value);
    if (type === "child")
      setSelectedChild(selectedChild === value ? null : value);
    if (type === "infant")
      setSelectedInfant(selectedInfant === value ? null : value);
  };

  const handleApply = () => {
    const total = selectedAdult + selectedChild + selectedInfant;
    setAdults(selectedAdult);
    setChildren(selectedChild);
    setInfants(selectedInfant);
    setTotalTravelers(total);
    setShowPassengerSelection(false);
  };

  const handleClick = () => {
    handleSearchFlights();
  };

  const handlePnrSearch = () => {
    if (pnr) {
      navigate(`/SearchPNR?pnr=${pnr}`);
    }
  };

  function createData(
    airlineCode,
    amount,
    bookedON,
    bookingID,
    destination,
    origin,
    referenceID,
    tripType
  ) {
    return {
      airlineCode,
      amount,
      bookedON,
      bookingID,
      destination,
      origin,
      referenceID,
      tripType,
    };
  }
  const rows = bookingHistoryData?.map((data) => {
    return createData(
      data.airlineCode,
      data.amount,
      data.bookedON,
      data.bookingID,
      data.destination,
      data.origin,
      data.referenceID,
      data.tripType
    );
  });

  const fetchClientBookingHistory = () => {
    let reqBody =
      loggedInUserDetails?.role === "admin"
        ? {
            clientId: selectedClient?.clientId,
            agentId: -1,
            pageNo: page,
            pageSize: 10,
          }
        : {
            clientId: loggedInUserDetails?.clientId,
            agentId: -1,
            pageNo: page,
            pageSize: 10,
          };

    axios
      .post(
        "http://stg-api.aeroprime.in/crm-service/search/fetchLatestBookings",
        reqBody,
        { headers: { Authorization: localStorage.getItem("AuthToken") } }
      )
      .then((response) => {
        setBookingHistoryData(response.data.data);
        console.log("booking", bookingHistoryData);
        setTotalResults(response.data.totalCount);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  useEffect(() => {
    if (selectedClient !== null) {
      fetchClientBookingHistory();
    }
  }, [selectedClient, page]);

  return (
    <div className="Landing-page-container">
      <div className="Pnr-container">
        <div className="Pnr-tittle">SEARCH PNR</div>
        <div className="line"></div>
        <div className="search-wrapper">
          <SearchIcon className="search-icon" />
          <input
            className="Admin-Search-btn1"
            type="text"
            value={pnr}
            onChange={(e) => setPnr(e.target.value.toUpperCase())}
            placeholder="Enter PNR"
          />
          <button
            onClick={handlePnrSearch}
            disabled={!pnr}
            className="Search-btn1"
          >
            Search
          </button>
        </div>
      </div>

      <div className="Booking-container">
        <div className="Booking-tittle">BOOK YOUR FLIGHT</div>
        <div className="line"></div>

        <div className="selection-container">
          <div className="Search-Flights">
            <div className="Dropdown-wrapper">
              {showLoader && <Loader hideLoader={false} />}
              {loggedInUserDetails?.airlineCodes?.length > 0 ? (
                <>
                  <div className="Airline-Trip-Container">
                    <div className="airline-dropdown-1">
                      {/* <DropDown
                                                name="abc"
                                                options={airlineOptions}
                                                value={airline}
                                                onChange={handleAirlineChange}
                                                placeholder="Enter Airline here"
                                            />
                                            <i className="icon-arrow">
                                                <ExpandMoreIcon />
                                            </i> */}
                      <StyledFormControl fullWidth>
                        <Select
                          id="demo-simple-select"
                          value={airline || ""}
                          onChange={(event) =>
                            handleAirlineChange(event.target.value)
                          }
                          name="Airline"
                          displayEmpty
                          renderValue={(selected) => {
                            if (!selected) {
                              return (
                                <PlaceholderTypography>
                                  Airline
                                </PlaceholderTypography>
                              );
                            }
                            return selected;
                          }}
                          style={{
                            color: "#000",
                            fontSize: "15px",
                            width: "230px",
                            height: "50px",
                            cursor: "pointer",
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
                          MenuProps={{
                            PaperProps: {
                              style: {
                                border: "1px solid #E5E2DA",
                                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                                marginTop: "8px",
                                borderRadius: "6px",
                                maxHeight: "200px",
                                overflow: "hidden",
                              },
                            },
                            MenuListProps: {
                              style: {
                                padding: 0,
                                maxHeight: "200px",
                                overflowY: "auto",
                                scrollbarWidth: "none",
                                msOverflowStyle: "none",
                              },
                              "&::-webkit-scrollbar": {
                                display: "none",
                              },
                            },
                          }}
                        >
                          {airlineOptions?.map((airline) => (
                            <MenuItem key={airline} value={airline}>
                              {airline}
                            </MenuItem>
                          ))}
                        </Select>
                      </StyledFormControl>
                    </div>

                    <div className="search-trip-section">
                      <FormControl>
                        <RadioGroup
                          row
                          aria-labelledby="trip-type-radio-buttons"
                          name="trip-type-radio-buttons"
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
                  </div>
                  <div className="Search-Selection-Container">
                    <div className="Origin-Selection">
                      <DropDown
                        name="abcd"
                        className="Origin-Selection-dropdown"
                        options={originList}
                        value={origin}
                        onChange={handleOriginChange}
                        optionLabelKey={null}
                        optionValueKey={null}
                      />
                      <i className="icon-plane">
                        <FlightTakeoffIcon />
                      </i>
                    </div>
                    <div className="Destination-Selection">
                      <DropDown
                        name="abcd"
                        className="Origin-Selection-dropdown-1"
                        options={destinationOptions}
                        value={destination}
                        onChange={handleDestinationChange}
                        optionLabelKey={null} // Options are strings
                        optionValueKey={null} // Options are strings
                        // Optionally disable the dropdown if no origin is selected
                        disabled={!origin}
                      />
                      <i className="icon-plane">
                        <FlightLandIcon />
                      </i>
                    </div>
                    <div className="date-selection">
                      <DatePicker
                        selected={departureDate}
                        onChange={(date) => {
                          setDepartureDate(date);
                          setDateLabel1(formatDate(date)); // Format date on change
                        }}
                        customInput={
                          <button className="calender-button">
                            <span className="date-label">
                              {dateLabel1}
                              {/* Departure */}
                            </span>
                            <i className="Calender-icon">
                              <CalendarMonthIcon />
                            </i>
                          </button>
                        }
                      />

                      <div className="return-date-selection">
                        <DatePicker
                          disabled={tripType !== "ROUND_TRIP"}
                          selected={returnDate}
                          onChange={(date) => {
                            setReturnDate(date);
                            setDateLabel2(formatDate(date));
                          }}
                          customInput={
                            <button
                              className={`calender-button ${
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
                        />
                      </div>
                    </div>

                    <div className="Passenger-Selection">
                      <div className="Pax">
                        {totalTravelers > 0 ? (
                          <span className="total-passenger">
                            {`${totalTravelers} Traveler${
                              totalTravelers > 1 ? "s" : ""
                            }`}
                          </span>
                        ) : (
                          <button
                            className="open-passenger-selection"
                            onClick={() =>
                              setShowPassengerSelection(!showPassengerSelection)
                            }
                          >
                            Select Passengers
                          </button>
                        )}
                        {showPassengerSelection && (
                          <div className="passenger-selection-container">
                            <div className="passenger-type">
                              <label>ADULTS (16y+)</label>
                              <div className="passenger-buttons">
                                {Array.from({ length: 10 }, (_, i) => (
                                  <button
                                    key={i}
                                    className={
                                      selectedAdult === i + 1 ? "selected" : ""
                                    }
                                    onClick={() =>
                                      handleSelection("adult", i + 1)
                                    }
                                  >
                                    {i + 1}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="passenger-type">
                              <label>CHILDREN (2Y - 12Y)</label>
                              <div className="passenger-buttons">
                                {Array.from({ length: 6 }, (_, i) => (
                                  <button
                                    key={i}
                                    className={
                                      selectedChild === i + 1 ? "selected" : ""
                                    }
                                    onClick={() =>
                                      handleSelection("child", i + 1)
                                    }
                                  >
                                    {i + 1}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="passenger-type">
                              <label>INFANTS (below 2y)</label>
                              <div className="passenger-buttons">
                                {Array.from({ length: 6 }, (_, i) => (
                                  <button
                                    key={i}
                                    className={
                                      selectedInfant === i + 1 ? "selected" : ""
                                    }
                                    onClick={() =>
                                      handleSelection("infant", i + 1)
                                    }
                                  >
                                    {i + 1}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <button
                              className="apply-button"
                              onClick={handleApply}
                            >
                              Apply
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* <div className="Search-Button">
                <button
                  className="Search-button"
                  variant="contained"
                  onClick={handleClick()}
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
                </button>
              </div> */}
                    <div className="Search-Button">
                      <button
                        className="Search-button"
                        variant="contained"
                        onClick={handleClick}
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
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div>No Airlines enabled yet. Search not Allowed !!</div>
              )}
              {errorMessage && (
                <div>Operation Not Allowed. Please contact system admin!</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="Recent-Booking-container">
        <div className="Recent-Booking-tittle">RECENT BOOKINGS</div>
        <div className="line"></div>
        <div className="Recent-table-container">
          {bookingHistoryData && bookingHistoryData.length > 0 && (
            <>
              <TableContainer
                component={Paper}
                style={{ borderRadius: "10px", overflow: "hidden" }}
              >
                <Table sx={{ minWidth: 750 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>PNR</StyledTableCell>
                      <StyledTableCell align="left">Ref Id</StyledTableCell>
                      <StyledTableCell align="left">
                        Airline Code
                      </StyledTableCell>
                      <StyledTableCell align="left">Origin</StyledTableCell>
                      <StyledTableCell align="left">
                        Destination
                      </StyledTableCell>
                      <StyledTableCell align="left">Booked On</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows?.map((row) => (
                      <TableRow
                        key={row.bookingID}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.bookingID}
                        </TableCell>
                        <TableCell align="left">{row.referenceID}</TableCell>
                        <TableCell align="left">{row.airlineCode}</TableCell>
                        <TableCell align="left">{row.origin}</TableCell>
                        <TableCell align="left">{row.destination}</TableCell>
                        <TableCell align="left">{row.bookedON}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* <Pagination
            sx={{
              "& .MuiPaginationItem-root": {
                // Rounded pagination buttons
                "&.Mui-selected": {
                  backgroundColor: "#EF5443",
                  color: "white",
                },
              },
            }}
            // count={Math.floor(totalResults / 10) + 1}
            count={
              totalResults % 10 === 0
                ? totalResults / 10
                : Math.floor(totalResults / 10) + 1
            }
            onChange={(e, page) => setPage(page)}
            page={page}
          /> */}
            </>
          )}
          {bookingHistoryData && bookingHistoryData.length < 1 && (
            <div>No Records Found</div>
          )}
        </div>
      </div>
    </div>
  );
}
