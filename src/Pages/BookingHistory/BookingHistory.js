import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BookingHistory.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import { Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/material/styles";
import { updateAgentList } from "../../store/slices/agentListSlice";



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
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#334555",
    color: theme.palette.common.white,
    fontWeight: 500,
  },
}));

const BookingsHistoryScreen = () => {
  const [client, setClient] = useState(null);
  const [bookingHistoryData, setBookingHistoryData] = useState(null);
  const [totalResults, setTotalResults] = useState(null);
  const [page, setPage] = useState(1);
  const [dropdownList, setDropdownList] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const loggedInUserDetails = useSelector(
    (state) => state.loggedInUserDetails.loggedInUserDetails
  );
  const agentList = useSelector((state) => state.agentList.agentList);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (loggedInUserDetails) {
      if (loggedInUserDetails?.role === "admin" && !agentList) {
        fetchAgentsListForAdmin();
      }
      if (loggedInUserDetails?.role !== "admin") {
        fetchAgentDroprDownListForAgentLogin();
      }
    }
  }, [loggedInUserDetails]);

  useEffect(() => {
    if (agentList && agentList.length > 0) {
      setClient(agentList.clientId);
      setDropdownList(agentList);
    }
  }, [agentList]);

  useEffect(() => {
    if (selectedClient !== null) {
      fetchClientBookingHistory();
    }
  }, [selectedClient, page]);

  useEffect(() => {
    if (client) {
      dropdownList?.forEach((user) => {
        if (user?.id === client) {
          setSelectedClient(user);
        }
      });
    }
  }, [client]);

  const fetchAgentDroprDownListForAgentLogin = () => {
    const headersForUserAPI = {
      Authorization: localStorage.getItem("AuthToken"),
    };
    axios
      .get(
        "http://stg-api.aeroprime.in/crm-service/agent/getAgentListForBookingDropDown",
        {
          headers: headersForUserAPI,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setDropdownList(response.data);
          setClient(response?.data[0]?.id);
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  const fetchAgentsListForAdmin = () => {
    const headersForUserAPI = {
      Authorization: localStorage.getItem("AuthToken"),
    };
    axios
      .get("http://stg-api.aeroprime.in/crm-service/user/details", {
        headers: headersForUserAPI,
      })
      .then((response) => {
        if (response.status === 200) {
          dispatch(updateAgentList(response.data));
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

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
          clientId: selectedClient?.clientId,
          agentId: selectedClient?.id,
          pageNo: page,
          pageSize: 10,
        };

    console.log("reqb", reqBody);
    axios
      .post(
        "http://stg-api.aeroprime.in/crm-service/search/fetchLatestBookings",
        reqBody,
        { headers: { Authorization: localStorage.getItem("AuthToken") } }
      )
      .then((response) => {
        setBookingHistoryData(response.data.data);
        setTotalResults(response.data.totalCount);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
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

  const handleDownloadOfflineBookings = () => {
    window.open(
      `http://stg-api.aeroprime.in/crm-service/admin/downloadOfflineBooking`,
      "_blank",
      "noreferrer"
    );
  };

  return (
    <div className="booking-history-wrapper">
      <div className="content">
        <div className="head-btn-wrapper2">
          <div className="Booking-heading">BOOKING HISTORY</div>
          {loggedInUserDetails?.role === "admin" && (
            <div className="download-offline-bookings-btn-wrapper">
              {selectedClient && (
                <button
                  className="download-offline-bookings"
                  variant="contained"
                  onClick={handleDownloadOfflineBookings}
                >
                  DOWNLOAD OFFLINE BOOKINGS
                </button>
              )}
            </div>
          )}
        </div>
        <div className="Breakline1"></div>
        {dropdownList && (
          <div className="client-selection-section">
            <StyledFormControl fullWidth >
              <Select
                className="agent-select"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={client}
                onChange={(event) => {
                  setClient(event.target.value);
                  setPage(1);
                }}
                name="Agent"
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <Typography style={{ color: "#888" }}>Agent</Typography>
                    );
                  }
                  return dropdownList.find((item) => item.id === selected)
                    ?.name;
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
                inputProps={{
                  "aria-label": "Without label",
                }}
                style={{
                  color: "#000",
                  fontSize: "16px",
                  textAlign: "left",
                  // border: "1px solid #E5E2DA",
                  borderRadius: "6px",
                  padding: "0px 3px",
                  display: "flex",
                  alignItems: "center",
                  height: "45px",
                  width: "250px",
                  marginBottom: "40px",
                  marginTop:"10px"
                }}
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
                <MenuItem value="" disabled>
                  Agent
                </MenuItem>
                {dropdownList &&
                  dropdownList.map((client, index) => (
                    <MenuItem
                      key={index}
                      value={client?.id}
                      style={{
                        color: "#000",
                        fontWeight: "normal",
                        textAlign: "left",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                      }}
                    >
                      {client?.name}
                    </MenuItem>
                  ))}
              </Select>
            </StyledFormControl>
          </div>
        )}
        {bookingHistoryData && bookingHistoryData.length > 0 && (
          <>
            <TableContainer
              component={Paper}
              style={{ borderRadius: "10px", overflow: "hidden" }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>PNR</StyledTableCell>
                    <StyledTableCell align="left">Ref Id</StyledTableCell>
                    <StyledTableCell align="left">Airline Code</StyledTableCell>
                    <StyledTableCell align="left">Origin</StyledTableCell>
                    <StyledTableCell align="left">Destination</StyledTableCell>
                    <StyledTableCell align="left">Booked On</StyledTableCell>
                    <StyledTableCell align="left">{`Amount (In ${loggedInUserDetails?.role === "admin"
                      ? selectedClient?.currencyCode
                      : loggedInUserDetails?.currencyCode
                      })`}</StyledTableCell>
                    <StyledTableCell align="left">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows?.map((row) => (
                    <TableRow
                      key={row.bookingID}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.bookingID}
                      </TableCell>
                      <TableCell align="left">{row.referenceID}</TableCell>
                      <TableCell align="left">{row.airlineCode}</TableCell>
                      <TableCell align="left">{row.origin}</TableCell>
                      <TableCell align="left">{row.destination}</TableCell>
                      <TableCell align="left">{row.bookedON}</TableCell>
                      <TableCell align="left">{row.amount}</TableCell>
                      <TableCell align="left">
                        <div className="actions-wrapper">
                          <button
                            variant="contained"
                            size="small"
                            className="view-details-btn"
                            onClick={() =>
                              navigate("/searchPNR", {
                                state: {
                                  agentDetails: row,
                                },
                              })
                            }
                            disabled={
                              loggedInUserDetails?.can_do_pnr_management !== 1
                            }
                          >
                            View Details
                          </button>
                        </div>
                      </TableCell>
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
              count={
                totalResults % 10 === 0
                  ? totalResults / 10
                  : Math.floor(totalResults / 10) + 1
              }
              onChange={(e, page) => setPage(page)}
              page={page}
            />
          </>
        )}
        {bookingHistoryData && bookingHistoryData.length < 1 && (
          <div className="No-Records-head">No Records Found</div>
        )}
      </div>
    </div>
  );
};

export default BookingsHistoryScreen;
