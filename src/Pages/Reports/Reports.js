import React, { useState, useEffect } from "react";
import "./Reports.css";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import Loader from "../../Components/Loader/Loader";
import downloadSvg from "../../Assets/download.svg";
import { useSelector } from "react-redux";




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

const CustomDatePicker = styled(DatePicker)({
  "& .MuiInputBase-root": {
    width: "300px",
    height: "50px",
  },
  "& .MuiInputBase-input": {
    color: "#ef5443",
    fontSize: "15px",
  },
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#334555",
    color: theme.palette.common.white,
    fontWeight: 500,
  },
}));
const PlaceholderTypography = styled('div')(({ theme }) => ({
  color: "#888",
  fontSize: "16px",
}));

const Reports = () => {
  const [agent, setAgent] = useState(null);
  const [airline, setAirline] = useState("All");
  const [origin, setOrigin] = useState("All");
  const [destination, setDestination] = useState("All");
  const [reportType, setReportType] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [flightsAvailable, setFlightsAvailable] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [totalResults, setTotalResults] = useState(null);
  const [page, setPage] = useState(1);
  const [showLoader, setShowLoader] = useState(false);
  const [firstFetch, setFirstFetch] = useState(true);
  const [agentList, setAgentList] = useState(null);
  const [usersList, setUsersList] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [airLinesList, setAirlinesList] = useState(null);
  const loggedInUserDetails = useSelector(
    (state) => state.loggedInUserDetails.loggedInUserDetails
  );

  useEffect(() => {
    fetchOriginList();
    fetchAirlineList();
  }, []);

  useEffect(() => {
    if (loggedInUserDetails?.role === "admin") {
      fetchClientListForLoggedInAdmin();
      fetchUserList();
    }
  }, [loggedInUserDetails]);

  useEffect(() => {
    if (!firstFetch) {
      handleFetchReport();
      setFirstFetch(false);
      setShowLoader(true);
    }
  }, [page]);

  useEffect(() => {
    if (agent) {
      if (loggedInUserDetails?.role === "admin") {
        usersList?.forEach((user) => {
          if (user?.clientId == agent) {
            setSelectedClient(user);
          }
        });
      } else {
        agentList?.forEach((user) => {
          if (user?.id === agent) {
            setSelectedClient(user);
          }
        });
      }
    }
  }, [agent]);

  useEffect(() => {
    if (loggedInUserDetails?.role !== "admin") {
    }
  }, [loggedInUserDetails]);

  useEffect(() => {
    if (
      (reportType === "bookingReport" || reportType === "failureReport") &&
      loggedInUserDetails?.role !== "admin"
    ) {
      getAgentListForBookingReportDropDown();
    }
    if (
      reportType === "transactionReport" &&
      loggedInUserDetails?.role !== "admin"
    ) {
      getAgentListForLedgerReportDropDown();
    }
  }, [reportType]);

  const fetchAirlineList = () => {
    const headers = {
      "Content-Type": " application/json",
      Authorization: localStorage.getItem("AuthToken"),
    };
    axios
      .get("http://stg-api.aeroprime.in/crm-service/admin/getAirlineList", {
        headers,
      })
      .then((response) => setAirlinesList(response.data))
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  const getAgentListForBookingReportDropDown = () => {
    const headers = {
      "Content-Type": " application/json",
      Authorization: localStorage.getItem("AuthToken"),
    };
    axios
      .get(
        "http://stg-api.aeroprime.in/crm-service/agent/getAgentListForBookingReportDropDown",
        {
          headers,
        }
      )
      .then((response) => setAgentList(response.data))
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  const getAgentListForLedgerReportDropDown = () => {
    const headers = {
      "Content-Type": " application/json",
      Authorization: localStorage.getItem("AuthToken"),
    };
    axios
      .get(
        "http://stg-api.aeroprime.in/crm-service/agent/getAgentListForLedgerReportDropDown",
        {
          headers,
        }
      )
      .then((response) => setAgentList(response.data))
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  const fetchUserList = () => {
    const headers = {
      "Content-Type": " application/json",
      Authorization: localStorage.getItem("AuthToken"),
    };
    axios
      .get("http://stg-api.aeroprime.in/crm-service/user/details", {
        headers,
      })
      .then((response) => setUsersList(response.data))
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  const fetchOriginList = () => {
    const headers = {
      "Content-Type": " application/json",
      Authorization: localStorage.getItem("AuthToken"),
    };
    axios
      .get("http://stg-api.aeroprime.in/crm-service/search/originList", {
        headers,
      })
      .then((response) => setFlightsAvailable(response.data))
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  const fetchClientListForLoggedInAdmin = () => {
    const headers = {
      "Content-Type": " application/json",
      Authorization: localStorage.getItem("AuthToken"),
    };
    axios
      .get("http://stg-api.aeroprime.in/crm-service/client/details", {
        headers,
      })
      .then((response) => setAgentList(response.data))
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  const handleOriginChange = (selectedValue) => {
    setOrigin(selectedValue);
    setDestination("All");
  };

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    handleOriginChange(selectedValue);
  };

  const getAvailableDestinations = () => {
    if (!origin || !flightsAvailable) return [];
    const originKey = Array.isArray(origin) ? origin.join(",") : origin;
    console.log("Origin Key:", originKey);
    return flightsAvailable[originKey] || [];
  };

  const handleDestinationChange = (selectedValue) => {
    console.log("Selected Destination:", selectedValue);
    setDestination(selectedValue);
  };

  const handledesChange = (event) => {
    const selectedValue = event.target.value;
    handleDestinationChange(selectedValue);
  };

  const handleAirlineChange = (airline) => {
    const headers = {
      "Content-Type": " application/json",
      Authorization: localStorage.getItem("AuthToken"),
    };
    setAirline(airline);
    setOrigin("All");
    setDestination("All");
    axios
      .get(
        `http://stg-api.aeroprime.in/crm-service/search/originList?airlineCode=${airline}`,
        { headers }
      )
      .then((response) => setFlightsAvailable(response.data))
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  const handleDownloadReport = () => {
    const originCode = Array.isArray(origin) ? origin[0] : "All";
    const destinationCode = Array.isArray(destination) ? destination[0] : "All";
    const clientCode =
      loggedInUserDetails?.role === "agent"
        ? loggedInUserDetails?.clientId
        : agent;
    const startDt = `${startDate["$y"]}-${startDate["$M"] + 1}-${startDate["$D"]
      }`;
    let bookingReportUrl =
      loggedInUserDetails?.role === "admin"
        ? `http://stg-api.aeroprime.in/crm-service/download/${reportType}?startDate=${startDt}&endDate=${endDate}&airlineCode=${airline}&origin=${originCode}&destination=${destinationCode}&tripType=All&clientId=${clientCode}`
        : `http://stg-api.aeroprime.in/crm-service/download/${reportType}?startDate=${startDt}&endDate=${endDate}&airlineCode=${airline}&origin=${originCode}&destination=${destinationCode}&tripType=All&clientId=${clientCode}&agentId=${selectedClient?.id}`;
    let transactionReportUrl =
      loggedInUserDetails?.role === "admin"
        ? `http://stg-api.aeroprime.in/crm-service/download/${reportType}?startDate=${startDt}&endDate=${endDate}&airlineCode=${airline}&clientId=${clientCode}`
        : `http://stg-api.aeroprime.in/crm-service/download/${reportType}?startDate=${startDt}&endDate=${endDate}&airlineCode=${airline}&clientId=${clientCode}&agentId=${selectedClient?.id}`;
    if (reportType === "bookingReport") {
      window.open(bookingReportUrl, "_blank", "noreferrer");
    }
    if (reportType === "transactionReport") {
      window.open(transactionReportUrl, "_blank", "noreferrer");
    }
  };

  const handleFetchReport = (pageNumber) => {
    setShowLoader(true);
    setFirstFetch(false);
    const originCode = Array.isArray(origin) ? origin[0] : "All";
    const destinationCode = Array.isArray(destination) ? destination[0] : "All";
    const clientCode =
      loggedInUserDetails?.role === "agent"
        ? loggedInUserDetails?.clientId
        : agent;
    const startDt = `${startDate["$y"]}-${startDate["$M"] + 1}-${startDate["$D"]
      }`;
    let bookingReportUrl =
      loggedInUserDetails?.role === "admin"
        ? `http://stg-api.aeroprime.in/crm-service/user/bookingDetails?startDate=${startDt}&endDate=${endDate}&airlineCode=${airline}&origin=${originCode}&destination=${destinationCode}&tripType=All&clientId=${clientCode}&pageNo=${pageNumber ? pageNumber : page
        }&pageSize=10`
        : `http://stg-api.aeroprime.in/crm-service/user/bookingDetails?startDate=${startDt}&endDate=${endDate}&airlineCode=${airline}&origin=${originCode}&destination=${destinationCode}&tripType=All&clientId=${clientCode}&agentId=${selectedClient?.id
        }&pageNo=${pageNumber ? pageNumber : page}&pageSize=10`;
    let transactionReportUrl =
      loggedInUserDetails?.role === "admin"
        ? `http://stg-api.aeroprime.in/crm-service/user/transactionDetails?startDate=${startDt}&endDate=${endDate}&airlineCode=${airline}&clientId=${clientCode}&pageNo=${pageNumber ? pageNumber : page
        }&pageSize=10`
        : `http://stg-api.aeroprime.in/crm-service/user/transactionDetails?startDate=${startDt}&endDate=${endDate}&airlineCode=${airline}&clientId=${clientCode}&agentId=${selectedClient?.id
        }&pageNo=${pageNumber ? pageNumber : page}&pageSize=10`;
    axios
      .get(
        reportType === "bookingReport"
          ? bookingReportUrl
          : transactionReportUrl,
        { headers: { Authorization: localStorage.getItem("AuthToken") } }
      )
      .then((response) => {
        setTableData(response.data.data);
        setTotalResults(response.data.totalCount);
        setShowLoader(false);
      })
      .catch((error) => {
        setShowLoader(false);
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  function createData(
    referenceID,
    paxName,
    tripType,
    bookingID,
    origin,
    destination,
    amount,
    invoiceNO,
    airlineCode,
    paxFirstName,
    paxLastName,
    flightDate
  ) {
    return {
      referenceID,
      paxName,
      tripType,
      bookingID,
      origin,
      destination,
      amount,
      invoiceNO,
      airlineCode,
      paxFirstName,
      paxLastName,
      flightDate,
    };
  }

  const BookingReportrows = tableData?.map((data) => {
    return createData(
      data.referenceID,
      data.paxName,
      data.tripType,
      data.bookingID,
      data.origin,
      data.destination,
      data.amount,
      data.invoiceNO,
      data.airlineCode,
      data.paxFirstName,
      data.paxLastName,
      data.flightDate
    );
  });

  function createTansactionData(
    id,
    clientId,
    amount,
    remarks,
    transactionDate,
    airlineCode
  ) {
    return {
      id,
      clientId,
      amount,
      remarks,
      transactionDate,
      airlineCode,
    };
  }

  const TransactionReportrows = tableData?.map((data) => {
    return createTansactionData(
      data.id,
      data.clientId,
      data.amount,
      data.remarks,
      data.transactionDate,
      data.airlineCode
    );
  });

  return (
    <div className="reports-wrapper">
      <div className="Report-heading">REPORTS</div>
      <div className="Break-line-rp"></div>
      <div className="report-airline-section">
        <StyledFormControl fullWidth>
          <Select
            id="demo-simple-select"
            value={airline || ""}
            onChange={(event) => handleAirlineChange(event.target.value)}
            name="Airline"
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return <PlaceholderTypography>Airline</PlaceholderTypography>;
              }
              return selected;
            }}
            style={{
              color: "#000",
              fontSize: "15px",
              width: "230px",
              height: "50px",
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
            <MenuItem value="All">All</MenuItem>
            {airLinesList?.map((airline) => (
              <MenuItem key={airline} value={airline}>
                {airline}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      </div>
      <div className="report-selection-section">
        {showLoader && <Loader hideLoader={false} />}
        {loggedInUserDetails?.role === "admin" && (
          <div className="report-client-selection-section">
            <StyledFormControl fullWidth variant="outlined">
              <Select
                id="demo-simple-select"
                value={agent || ""}
                onChange={(event) => {
                  setAgent(event.target.value);
                  setTableData(null);
                }}
                name="Agent"
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return <PlaceholderTypography>All Agents</PlaceholderTypography>;
                  }
                  const selectedItem = agentList[selected];
                  return selectedItem || "";
                }}
                inputProps={{
                  "aria-label": "Without label",
                }}
                style={{
                  color: "#000",
                  fontSize: "15px",
                  width: "300px",
                  height: "55px"
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
                      maxWidth: "300px",
                      overflow: "hidden",
                    },
                  },
                  MenuListProps: {
                    style: {
                      padding: 0,
                      maxHeight: "200px",
                      maxWidth: "300px",
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

                {agentList &&
                  Object.keys(agentList).map((key) => (
                    <MenuItem
                      key={key}
                      value={key}
                      style={{
                        color: "#000",
                        fontWeight: "normal",
                        textAlign: "left",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                      }}
                    >
                      {agentList[key]}
                    </MenuItem>
                  ))}
              </Select>
            </StyledFormControl>
          </div>
        )}

        <div className="report-type-dd-section">
          <StyledFormControl fullWidth>
            <Select
              id="demo-simple-select"
              value={reportType || ""}
              onChange={(event) => {
                setReportType(event.target.value);
                setPage(1);
                setTableData(null);
              }}
              name="Report Type"
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return (
                    <PlaceholderTypography>Report Type</PlaceholderTypography>
                  );
                }
                const reportTypeOptions = {
                  bookingReport: "Booking Report",
                  transactionReport: "Ledger Report",
                  failureReport: "Failed Booking Report",
                };
                return reportTypeOptions[selected] || "";
              }}
              style={{
                color: "#000",
                fontSize: "15px",
                width: "300px",
                height: "55px",
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
              {((loggedInUserDetails?.role === "admin" &&
                loggedInUserDetails?.can_deactviate_agent_booking_report ===
                1) ||
                (loggedInUserDetails?.role !== "admin" &&
                  loggedInUserDetails?.can_view_mis_report === 1)) && (
                  <MenuItem value="bookingReport">Booking Report</MenuItem>
                )}
              {((loggedInUserDetails?.role === "admin" &&
                loggedInUserDetails?.can_deactviate_agent_ledger_report ===
                1) ||
                (loggedInUserDetails?.role !== "admin" &&
                  loggedInUserDetails?.can_view_top_up_report === 1)) && (
                  <MenuItem value="transactionReport">Ledger Report</MenuItem>
                )}
              {((loggedInUserDetails?.role === "admin" &&
                loggedInUserDetails?.can_deactviate_agent_booking_report ===
                1) ||
                (loggedInUserDetails?.role !== "admin" &&
                  loggedInUserDetails?.can_view_mis_report === 1)) && (
                  <MenuItem value="failureReport">Failed Booking Report</MenuItem>
                )}
            </Select>
          </StyledFormControl>
        </div>
      </div>
      {loggedInUserDetails?.role !== "admin" && reportType && (
        <div className="report-client-selection-section">
          <StyledFormControl fullWidth>
            <Select
              id="demo-simple-select"
              value={agent || ""}
              onChange={(event) => {
                setAgent(event.target.value);
                setTableData(null);
              }}
              name="Agent"
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <PlaceholderTypography>Agent</PlaceholderTypography>;
                }
                const selectedAgent = agentList.find(
                  (item) => item.id === selected
                );
                return selectedAgent ? selectedAgent.name : "";
              }}
              style={{
                color: "#000",
                fontSize: "15px",
                width: "300px",
                height: "50px",
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
              {agentList &&
                agentList.map((agent) => (
                  <MenuItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </MenuItem>
                ))}
            </Select>
          </StyledFormControl>
        </div>
      )}

      {reportType === "bookingReport" && (
        <div className="report-city-section">
          <div className="report-origin-section">
            <StyledFormControl fullWidth>
              <Select
                id="demo-simple-select"
                value={origin || ""}
                onChange={handleChange}
                name="Origin"
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <PlaceholderTypography>Origin</PlaceholderTypography>
                    );
                  }
                  return selected;
                }}
                style={{
                  color: "#000",
                  fontSize: "15px",
                  width: "300px",
                  height: "50px",
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
                disabled={reportType === "transactionReport"}
              >
                <MenuItem value="All">Any</MenuItem>
                {flightsAvailable &&
                  Object.keys(flightsAvailable).map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
              </Select>
            </StyledFormControl>
          </div>
          <div className="report-destination-section">
            <StyledFormControl fullWidth>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={destination || ""}
                onChange={handledesChange}
                MenuProps={MenuProps}
                disabled={reportType === "transactionReport"}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <PlaceholderTypography>Destination</PlaceholderTypography>
                    );
                  }
                  return selected;
                }}
                style={{
                  color: "#000",
                  fontSize: "15px",
                  width: "300px",
                  height: "50px",
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
                <MenuItem value="All">Any</MenuItem>
                {getAvailableDestinations().map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </div>
        </div>
      )}
      <div className="report-dates-section">
        <div className="start-date-picker-section">
          <StyledFormControl fullWidth>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}
                sx={{ height: '60px' }}
              >
                <CustomDatePicker onChange={(val) => setStartDate(val)} />
              </DemoContainer>
               
            </LocalizationProvider>
          </StyledFormControl>
        </div>
        <div className="end-date-picker-section">
          <StyledFormControl fullWidth>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}
                sx={{ height: '60px' }}
              >
                <CustomDatePicker
                  onChange={(val) =>
                    setEndDate(`${val["$y"]}-${val["$M"] + 1}-${val["$D"]}`)
                  }
                  minDate={startDate}
                  disabled={!startDate}
                />
              </DemoContainer>
            </LocalizationProvider>
          </StyledFormControl>
        </div>
      </div>

      <div className="fetch-report-btn-wrapper">
        <StyledFormControl>
          <button
            className="fetch-btn"
            variant="contained"
            onClick={() => handleFetchReport(1)}
            disabled={
              loggedInUserDetails?.role === "admin"
                ? !agent || !reportType || !startDate || !endDate
                : !reportType || !startDate || !endDate
            }
          >
            Fetch Report
          </button>
        </StyledFormControl>
      </div>
      {
        tableData && tableData.length > 0 && (
          <>
            <div className="download-report-btn-wrapper">
              <StyledFormControl>
                <button
                  className="download-btn"
                  variant="contained"
                  onClick={handleDownloadReport}
                  disabled={
                    loggedInUserDetails?.role === "admin"
                      ? !agent || !reportType || !startDate || !endDate
                      : !reportType || !startDate || !endDate
                  }
                >
                  <img src={downloadSvg} alt="" className="downloadIcon" />
                  Download CSV
                </button>
              </StyledFormControl>
            </div>
            <TableContainer
              component={Paper}
              style={{ borderRadius: "10px", overflow: "hidden" }}
            >
              <Table aria-label="simple table">
                <TableHead>
                  {reportType === "bookingReport" ? (
                    <TableRow>
                      <StyledTableCell align="left">Ticket Id</StyledTableCell>
                      <StyledTableCell align="left">PNR No</StyledTableCell>
                      <StyledTableCell align="left">Pax Name</StyledTableCell>
                      <StyledTableCell align="left">Origin</StyledTableCell>
                      <StyledTableCell align="left">Destination</StyledTableCell>
                      <StyledTableCell align="left">Airline Code</StyledTableCell>
                      <StyledTableCell align="left">Flight Date</StyledTableCell>
                      <StyledTableCell align="left">Trip Type</StyledTableCell>
                      <StyledTableCell align="left">
                        {`Amount (In ${loggedInUserDetails?.role === "admin"
                          ? selectedClient?.currencyCode
                          : loggedInUserDetails?.currencyCode
                          })`}
                      </StyledTableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <StyledTableCell align="left">
                        {`Amount (In ${loggedInUserDetails?.role === "admin"
                          ? selectedClient?.currencyCode
                          : loggedInUserDetails?.currencyCode
                          })`}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Transaction Date
                      </StyledTableCell>
                      <StyledTableCell align="left">Remarks</StyledTableCell>
                      <StyledTableCell align="left">Airline Code</StyledTableCell>
                    </TableRow>
                  )}
                </TableHead>
                <TableBody>
                  {reportType === "bookingReport" &&
                    BookingReportrows?.map((row) => (
                      <TableRow
                        key={row.referenceID}
                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {row.referenceID}
                        </TableCell>
                        <TableCell align="left">{row.bookingID}</TableCell>
                        <TableCell align="left">
                          {row.paxName ??
                            `${row.paxFirstName ?? ""} ${row.paxLastName ?? ""}`}
                        </TableCell>
                        <TableCell align="left">{row.origin}</TableCell>
                        <TableCell align="left">{row.destination}</TableCell>
                        <TableCell align="left">{row.airlineCode}</TableCell>
                        <TableCell align="left">{row.flightDate}</TableCell>
                        <TableCell align="left">
                          {row.tripType === "ONE_WAY" ? "One Way" : "Return Trip"}
                        </TableCell>
                        <TableCell align="left">{row.amount}</TableCell>
                      </TableRow>
                    ))}
                  {reportType === "transactionReport" &&
                    TransactionReportrows?.map((row) => (
                      <TableRow
                        key={row.referenceID}
                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {row.amount}
                        </TableCell>
                        <TableCell align="left">{row.transactionDate}</TableCell>
                        <TableCell align="left">{row.remarks}</TableCell>
                        <TableCell align="left">{row.airlineCode}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination
              sx={{
                "& .MuiPaginationItem-root": {
                  "&.Mui-selected": {
                    backgroundColor: "#EF5443",
                    color: "white",
                  },
                },
              }}
              count={Math.ceil(totalResults / 10)}
              color="primary"
              onChange={(e, page) => setPage(page)}
              page={page}
            />
          </>
        )
      }
      {tableData && tableData.length === 0 && <div className="No-Records">No Records Found!!</div>}
    </div >
  );
};

export default Reports;
