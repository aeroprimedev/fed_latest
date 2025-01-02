import React, { useEffect, useState } from "react";
import "./SearchPnr.css";
import axios from "axios";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useLocation } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import downloadSvg from "../../Assets/download.svg";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Loader from "../../Components/Loader/Loader";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useSelector, useDispatch } from "react-redux";
import { updateAgentList } from "../../store/slices/agentListSlice";
import { updateAdminList } from "../../store/slices/adminListSlice";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SearchPnr = () => {
  const location = useLocation();
  const [isFocused, setIsFocused] = useState(false);
  const [pnr, setPnr] = useState("");
  const [refId, setRefId] = useState(null);
  const [paxFirstName, setPaxFirstName] = useState(null);
  const [paxLastName, setpaxLastName] = useState(null);
  const [details, setDetails] = useState(null);
  const [pnrHistory, setPnrHistory] = useState(null);
  const [viewCancelBooking, setViewCancelBooking] = useState(null);
  const [viewCancelBookingTicketItemList, setViewCancelBookingTicketItemList] =
    useState(null);
  const [viewCancelAmount, setViewCancelAmount] = useState(null);
  const [show, setShow] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelBookingDetails, setCancelBookingDetails] = useState(null);
  const [totalResults, setTotalResults] = useState(null);
  const [page, setPage] = useState(1);
  const [recentTrans, showRecentTrans] = useState(false);
  const [showConfirmPNRfailure, setShowConfirmPNRfailure] = useState(false);
  const [loggedInUserClients, setLoggedInUserClients] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [showCancelSuccessToast, setShowCancelSuccessToast] = useState(false);
  const [usersCurrencyList, setUsersCurrencyList] = useState(null);
  const dispatch = useDispatch();
  const query = new URLSearchParams(location.search);
  const pnrFromQuery = query.get("pnr") || "";
  const loggedInUserDetails = useSelector(
    (state) => state.loggedInUserDetails.loggedInUserDetails
  );
  const agentList = useSelector((state) => state.agentList.agentList);
  const adminList = useSelector((state) => state.adminList.adminList);

  useEffect(() => {
    if (loggedInUserDetails) {
      axios
        .get("http://stg-api.aeroprime.in/crm-service/client/details", {
          headers: {
            Authorization: localStorage.getItem("AuthToken"),
          },
        })
        .then((response) => setLoggedInUserClients(response.data))
        .catch((error) => {
          if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = "/";
          }
        });
    }
  }, [loggedInUserDetails]);

  useEffect(() => {
    if (loggedInUserDetails) {
      const pnrToFetch =
        location?.state?.agentDetails?.bookingID || pnrFromQuery;
      if (pnrToFetch) {
        setPnr(pnrToFetch);
        fetchDetails(pnrToFetch);
      } else {
        fetchDetails();
      }
    }
  }, [
    location?.state?.agentDetails?.bookingID,
    page,
    pnrFromQuery,
    loggedInUserDetails,
  ]);

  useEffect(() => {
    if (loggedInUserDetails && !agentList) {
      loggedInUserDetails?.role === "admin"
        ? fetchAgentsListForAdmin()
        : fetchAgentsListForAgent();
    }
  }, [loggedInUserDetails, agentList]);

  useEffect(() => {
    if (!adminList) {
      fetchAdminList();
    }
  }, [adminList]);

  const fetchDetails = (specificPnr = "") => {
    setShowLoader(true);
    const reqBody = {
      pageNo: page,
      pageSize: 10,
      clientId: loggedInUserDetails?.clientId,
    };

    if (specificPnr) {
      reqBody.bookingID = specificPnr;
    }

    axios
      .post(
        "http://stg-api.aeroprime.in/crm-service/search/searchBooking",
        reqBody,
        {
          headers: {
            Authorization: localStorage.getItem("AuthToken"),
          },
        }
      )
      .then((response) => {
        setDetails(response.data.data);
        setTotalResults(response?.data?.totalCount);
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

  const fetchAdminList = () => {
    const headersForUserAPI = {
      Authorization: localStorage.getItem("AuthToken"),
    };
    axios
      .get("http://stg-api.aeroprime.in/crm-service/admin/getAdminList", {
        headers: headersForUserAPI,
      })
      .then((response) => {
        if (response.status === 200) {
          dispatch(updateAdminList(response.data));
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  useEffect(() => {
    if (agentList || adminList) {
      let userCurrencyList = {};
      agentList?.forEach((user) => {
        userCurrencyList[user?.clientId] = user?.currencySymbol;
      });
      adminList?.forEach((user) => {
        userCurrencyList[user?.clientId] = user?.currencySymbol;
      });
      setUsersCurrencyList(userCurrencyList);
    }
  }, [agentList, adminList]);

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

  const fetchAgentsListForAgent = () => {
    const headersForUserAPI = {
      Authorization: localStorage.getItem("AuthToken"),
    };
    axios
      .get("http://stg-api.aeroprime.in/crm-service/agent/getAgentList", {
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

  const handlePnrSearch = () => {
    setShowLoader(true);
    const reqBody = {
      pageNo: 1,
      pageSize: 10,
      clientId: loggedInUserDetails?.clientId,
    };

    if (pnr) {
      reqBody.bookingID = pnr;
    }
    if (refId) {
      reqBody.referenceID = refId;
    }
    if (paxFirstName) {
      reqBody.paxFirstName = paxFirstName;
    }
    if (paxLastName) {
      reqBody.paxLastName = paxLastName;
    }
    axios
      .post(
        "http://stg-api.aeroprime.in/crm-service/search/searchBooking",
        reqBody,
        {
          headers: {
            Authorization: localStorage.getItem("AuthToken"),
          },
        }
      )
      .then((response) => {
        setDetails(response.data.data);
        setTotalResults(response?.data?.totalCount);
        showRecentTrans(false);
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

  const fetchPnrHistory = (refId) => {
    setShowLoader(true);
    axios
      .post(
        "http://stg-api.aeroprime.in/airline-service/getPNRHistoryByRefId",
        {
          referenceID: refId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("AuthToken"),
          },
        }
      )
      .then((response) => {
        setPnrHistory(response.data.data);
        handleShow();
        setShowLoader(false);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
        setShowLoader(false);
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
      .then((response) => setLoggedInUserClients(response.data))
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  const fetchViewCancelBooking = (referenceID, bookingID, airlineCode) => {
    setShowLoader(true);
    axios
      .post(
        `http://stg-api.aeroprime.in/airline-service/viewCancelBooking?airlineCode=${airlineCode}`,
        {
          bookingReferenceID: {
            companyName: {
              cityCode: "ALA",
              code: "KC",
              codeContext: "CRANE",
              companyFullName: "TEST OTA",
              companyShortName: "TEST OTA",
              countryCode: "KZ",
            },
            ID: bookingID,
            referenceID: referenceID,
          },
          airlineCode: airlineCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("AuthToken"),
          },
        }
      )
      .then((response) => {
        setCancelBookingDetails({ referenceID, bookingID, airlineCode });
        setViewCancelBooking(response.data.data);
        setViewCancelBookingTicketItemList(
          Array.isArray(
            response.data.data?.AirCancelBookingResponse?.airBookingList
              ?.ticketInfo?.ticketItemList
          )
            ? response.data.data?.AirCancelBookingResponse?.airBookingList
              ?.ticketInfo?.ticketItemList[0]
            : response.data.data?.AirCancelBookingResponse?.airBookingList
              ?.ticketInfo?.ticketItemList
        );
        let cancellationAmount = 0;
        if (
          Array.isArray(
            response.data.data?.AirCancelBookingResponse?.airBookingList
              ?.ticketInfo?.ticketItemList
          )
        ) {
          response.data.data?.AirCancelBookingResponse?.airBookingList?.ticketInfo?.ticketItemList.forEach(
            (paxDetails) => {
              cancellationAmount =
                cancellationAmount +
                Number(
                  paxDetails?.pricingOverview?.equivTotalAmountList?.value
                );
            }
          );
        } else {
          cancellationAmount = Number(
            response.data.data?.AirCancelBookingResponse?.airBookingList
              ?.ticketInfo?.ticketItemList?.pricingOverview
              ?.equivTotalAmountList?.value
          );
        }
        setViewCancelAmount(cancellationAmount);
        setShowLoader(false);
        handleCancelDialogShow();
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
        setShowLoader(false);
      });
  };

  const handleCancelBooking = () => {
    handleCancelDialogClose();
    setShowLoader(true);
    axios
      .post(
        `http://stg-api.aeroprime.in/airline-service/commitCancelBooking?airlineCode=${cancelBookingDetails?.airlineCode}`,
        {
          bookingReferenceID: {
            companyName: {
              cityCode: "ALA",
              code: "KC",
              codeContext: "CRANE",
              companyFullName: "TEST OTA",
              companyShortName: "TEST OTA",
              countryCode: "KZ",
            },
            ID: cancelBookingDetails?.bookingID,
            referenceID: cancelBookingDetails?.referenceID,
          },
          airlineCode: cancelBookingDetails?.airlineCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("AuthToken"),
          },
        }
      )
      .then((response) => {
        setCancelBookingDetails(null);
        handleCancelDialogClose();
        handlePnrSearch();
        setShowLoader(false);
        setShowCancelSuccessToast(true);
      })
      .catch((error) => {
        setShowLoader(false);
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  const createData = (
    agencyCode,
    agencyName,
    historyExplanation,
    recordedAt
  ) => {
    return {
      agencyCode,
      agencyName,
      historyExplanation,
      recordedAt,
    };
  };

  const handleTicketDownload = (id) => {
    window.open(
      `http://stg-api.aeroprime.in/airline-service/eticket?referenceid=${id}`,
      "_blank",
      "noreferrer"
    );
  };

  const rows = Array.isArray(
    pnrHistory?.AirBookingHistoryResponse?.airBookingHistoryList
  )
    ? pnrHistory?.AirBookingHistoryResponse?.airBookingHistoryList?.map(
      (history) => {
        return createData(
          history?.creator?.agencyCode,
          history?.creator?.agencyName,
          history?.historyExplanation,
          history?.recordedAt
        );
      }
    )
    : [
      createData(
        pnrHistory?.AirBookingHistoryResponse?.airBookingHistoryList?.creator
          ?.agencyCode,
        pnrHistory?.AirBookingHistoryResponse?.airBookingHistoryList?.creator
          ?.agencyName,
        pnrHistory?.AirBookingHistoryResponse?.airBookingHistoryList
          ?.historyExplanation,
        pnrHistory?.AirBookingHistoryResponse?.airBookingHistoryList
          ?.recordedAt
      ),
    ];

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCancelDialogClose = () => setShowCancelDialog(false);
  const handleCancelDialogShow = () => setShowCancelDialog(true);

  const openFailurePNRDialog = () => setShowConfirmPNRfailure(true);
  const closeFailurePNRDialog = () => setShowConfirmPNRfailure(false);

  return (
    <div className="search-pnr-wrapper">
      {showLoader && <Loader hideLoader={true} />}
      <div className="Search-Pnr-Heading">SEARCH PNR</div>
      <div className="Breakline1"></div>
      <Snackbar
        open={showCancelSuccessToast}
        autoHideDuration={3000}
        onClose={() => setShowCancelSuccessToast(false)}
      >
        <Alert
          onClose={() => setShowCancelSuccessToast(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Booking Cancelled!
        </Alert>
      </Snackbar>

      <div className="search-pnr">
        <div className="search-pnr-element-wrapper">
          <div className="search-pnr-element input-element">
            <FormControl fullWidth>
              <input
                className="Input-PNR"
                error={pnr?.length > 6}
                placeholder="PNR*"
                value={pnr}
                
                onChange={(event) => {
                  setPnr(event?.target?.value.toUpperCase());
                }}
              ></input>
            </FormControl>
          </div>
          <div className="search-pnr-element input-element">
            <FormControl fullWidth>
              <input
                className={`Input-PNR ${isFocused ? "focused" : ""}`}
                placeholder="Reference Id"
                value={refId}
                fullWidth
                onChange={(event) => setRefId(event.target.value)}
              ></input>
            </FormControl>
          </div>
        </div>
        <div className="search-pnr-element-wrapper">
          <div className="search-pnr-element input-element">
            <FormControl fullWidth>
              <input
                className={`Input-PNR ${isFocused ? "focused" : ""}`}
                placeholder="First Name"
                value={paxFirstName}
                fullWidth
                onChange={(event) => setPaxFirstName(event.target.value)}
              ></input>
            </FormControl>
          </div>
          <div className="search-pnr-element input-element">
            <FormControl fullWidth>
              <input
                className={`Input-PNR ${isFocused ? "focused" : ""}`}
                placeholder="Last Name*"
                value={paxLastName}
                fullWidth
                onChange={(event) => setpaxLastName(event.target.value)}
              ></input>
            </FormControl>
          </div>
        </div>
      </div>
      <div className="search-pnr-element search-btn">
        <button
          className="Search-btn"
          variant="contained"
          onClick={handlePnrSearch}
          disabled={!(pnr || refId || paxFirstName || paxLastName)}
        >
          <div className="Search">Search ➜ </div>
        </button>
      </div>
      {showLoader && <div className="Loader">Loading...</div>}
      {details && (
        <div className="view-details">
          {!(details?.length > 0) && (
            <div className="No-Records-head">No Details Found !!</div>
          )}
          {details?.length > 0 && (
            <div className="details-header">
              <span
                style={{
                  color: recentTrans ? "#EF5443" : "#EF5443",
                  fontSize: "20px",
                  fontWeight: "500",
                }}
              >
                {recentTrans ? "RECENT BOOKINGS" : "DETAILS"}
              </span>
              <div className="Breakline"></div>
            </div>
          )}

          {details?.length > 0 &&
            details?.map((detail) => {
              return (
                <div className="details-container">
                  <div className={`confirm-text-${detail?.bookingStatus}`}>
                    {detail?.bookingStatus === "Pending" && (
                      <span>Pending</span>
                    )}
                    {detail?.bookingStatus === "Pending due to low balance" && (
                      <span>Pending due to low balance</span>
                    )}
                    {detail?.bookingStatus === "Cancelled" && (
                      <span>Cancelled</span>
                    )}
                    {detail?.bookingStatus === "UnKnown" && (
                      <span>UnKnown</span>
                    )}
                    {detail?.bookingStatus === "Confirmed" && (
                      <>
                        {detail?.isNewSystem === 1 && (
                          <span className="img-wrapper">
                            <button
                            className="download-btn"
                              variant="contained"
                              onClick={() =>
                                handleTicketDownload(detail?.referenceID)
                              }
                            >
                          <CloudDownloadIcon />
                            </button>
                          </span>
                        )}
                        <span className="text">Confirmed</span>
                      </>
                    )}
                  </div>
                  <div className="details-row">
                    <div className="detail">
                      Airline Code:{" "}
                      <span className="detail-data">{detail?.airlineCode}</span>
                    </div>
                    <div className="detail">
                      Origin:{" "}
                      <span className="detail-data">{detail?.origin}</span>
                    </div>
                    <div className="detail">
                      Destination:{" "}
                      <span className="detail-data">{detail?.destination}</span>
                    </div>
                  </div>
                  <div className="details-row">
                    <div className="detail">
                      Trip Type:{" "}
                      <span className="detail-data">
                        {detail?.tripType === "ONE_WAY" && "One Way"}
                        {detail?.tripType === "ROUND_TRIP" && "Round Trip"}
                      </span>
                    </div>
                    <div className="detail">
                      PNR No:{" "}
                      <span className="detail-data">{detail?.bookingID}</span>
                    </div>
                    <div className="detail">
                      Reference Id:{" "}
                      <span className="detail-data">{detail?.referenceID}</span>
                    </div>
                  </div>
                  <div className="details-row">
                    <div className="detail">
                      Amount:{" "}
                      <span className="detail-data">
                        {`${usersCurrencyList?.[detail?.clientId]} ${detail?.amount
                          }`}
                      </span>
                    </div>
                    {loggedInUserDetails?.role === "admin" && (
                      <div className="detail">
                        Agent Name:
                        <span className="detail-data">
                          {loggedInUserClients?.[detail?.clientId] || "Unknown"}
                        </span>
                      </div>
                    )}
                    <div className="detail bookedOn">
                      Booked On:{" "}
                      <span className="detail-data">{detail?.bookedON}</span>
                    </div>
                  </div>
                  <div className="btn-row">
                    <div className="View-Pnr-btn">
                      <button
                        className="View-btn"
                        onClick={() => fetchPnrHistory(detail?.referenceID)}
                      >
                        <h1 className="View">View PNR History</h1>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
      {details?.length > 0 && (
        <div className="pagination-wrapper">
          <Pagination
            sx={{
              "& .MuiPaginationItem-root": {
                "&.Mui-selected": {
                  backgroundColor: "#EF5443",
                  color: "white",
                },
              },
            }}
            count={Math.floor(totalResults / 10) + 1}
            onChange={(e, page) => setPage(page)}
            page={page}
          />
        </div>
      )}
      <Dialog
        fullScreen
        open={show}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ backgroundColor: "#EF5443", position: "relative" }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              PNR History
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 550 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Agency Code</TableCell>
                <TableCell align="left">Agency Name</TableCell>
                <TableCell align="left">History Explanantion</TableCell>
                <TableCell align="left">Recorded At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.map((row) => (
                <TableRow
                  key={row.agencyCode}
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row.agencyCode}
                  </TableCell>
                  <TableCell align="left">{row.agencyCode}</TableCell>
                  <TableCell align="left">{row.historyExplanation}</TableCell>
                  <TableCell align="left">{row.recordedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Dialog>
      <Dialog
        open={showCancelDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {viewCancelAmount
              ? `Do you want to cancel this booking? Cancellation Charges: ${viewCancelAmount}`
              : `Cancellation not Allowed`}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            {`*Sometimes, cancellation charges are more than booking amount. In such cases no amount will be refunded.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {viewCancelAmount ? (
            <>
              <Button
                onClick={() => {
                  setCancelBookingDetails(null);
                  handleCancelDialogClose();
                }}
              >
                Disagree
              </Button>
              <Button onClick={handleCancelBooking} autoFocus>
                Agree
              </Button>
            </>
          ) : (
            <Button onClick={handleCancelDialogClose} autoFocus>
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog
        open={showConfirmPNRfailure}
        onClose={closeFailurePNRDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            We are not able to confirm your PNR at this momemnt. Kindly try
            after sometime!!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFailurePNRDialog} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div >
  );
};

export default SearchPnr;
