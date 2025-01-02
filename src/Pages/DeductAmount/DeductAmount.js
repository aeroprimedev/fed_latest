import React, { useEffect, useState } from "react";
import "./DeductAmount.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useLocation, useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";

import Pagination from "@mui/material/Pagination";

import { styled } from "@mui/material/styles";

import backBtn from "../../Assets/left-arrow-back.svg";

import { Chart } from "react-google-charts";

import { useSelector, useDispatch } from "react-redux";
import { updateAgentList } from "../../store/slices/agentListSlice";

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
const CustomRadio = styled(Radio)(({ theme }) => ({
  '&.Mui-checked': {
    color: '#EF5443', // Red color for the selected radio button
  },
  '& .MuiSvgIcon-root': {
    color: '#EF5443',
    fontSize: 24, // Adjust radio button size
  },
  '&.Mui-checked .MuiSvgIcon-root': {
    borderRadius: '50%',
    backgroundColor: '#EF5443', // Background color when checked
    color: 'white', // Checkmark color
  },
  '& .MuiSvgIcon-root::after': {
    content: '""',
    display: 'block',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#fff',
  },
}));
const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    paddingRight: "30px",
   
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

const PlaceholderTypography = styled('div')(({ theme }) => ({
  color: "#888",
  fontSize: "16px",
}));

const DeductBalanceScreen = () => {
  const [amount, setAmount] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [transactionSummary, setTransactionSummery] = useState(null);
  const [agentDetails, setAgentDetails] = useState(null);
  const [transactionType, setTransactionType] = useState("all");
  const [deductionReasonList, setDeductionReasonList] = useState(null);
  const [deductionReason, setDeductionReason] = useState(null);
  const [deductionOtherReason, setOtherDeductionReason] = useState(null);
  const [currentUserAirlines, setCurrentUserAirlines] = useState(null);
  const [selectedAirline, setSelectedAirline] = useState(null);
  const [airline, setAirline] = useState(null);

  const [chartDataMonthly, setChartDataMonthly] = useState([]);
  const [chartDataWeekly, setChartDataWeekly] = useState([]);

  const [totalResults, setTotalResults] = useState(null);
  const [page, setPage] = useState(1);

  const agentList = useSelector((state) => state.agentList.agentList);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchCurrentUserAirlines();
    fetchDeductAmountReasonList();
  }, [location?.state?.agentDetails?.clientId]);

  useEffect(() => {
    if (airline) {
      fetchChartData();
      fetchLastTenTransactions();
    }
  }, [airline]);

  useEffect(() => {
    if (!agentList) {
      fetchAgentsListForAdmin();
    }
  }, [agentList]);

  useEffect(() => {
    if (agentList && location?.state?.agentDetails?.clientId) {
      agentList?.forEach((agent) => {
        if (agent.email === location.state.agentDetails.email) {
          setAgentDetails(agent);
        }
      });
    }
  }, [agentList, location?.state?.agentDetails?.clientId, agentDetails]);

  const fetchCurrentUserAirlines = () => {
    const headers = {
      "Content-Type": " application/json",
      Authorization: localStorage.getItem("AuthToken"),
    };
    axios
      .get(
        `http://stg-api.aeroprime.in/crm-service/admin/getAirlineDetails/${location?.state?.agentDetails?.clientId}`,
        { headers }
      )
      .then((response) => {
        if (response.status === 200) {
          setCurrentUserAirlines(response.data);
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  const fetchDeductAmountReasonList = () => {
    const headersForUserAPI = {
      Authorization: localStorage.getItem("AuthToken"),
    };
    axios
      .get(
        "http://stg-api.aeroprime.in/crm-service/agent/getReasonListForAmountDeduction",
        {
          headers: headersForUserAPI,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setDeductionReasonList(response.data);
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

  const fetchChartData = () => {
    const headers = {
      "Content-Type": " application/json",
      Authorization: localStorage.getItem("AuthToken"),
    };
    axios
      .post(
        `http://stg-api.aeroprime.in/crm-service/download/chart-data`,
        {
          clientId: location?.state?.agentDetails?.clientId,
          airlineCode: airline,
        },
        { headers }
      )
      .then((response) => {
        setChartData(response.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  useEffect(() => {
    if (airline) {
      fetchLastTenTransactions();
    }
  }, [transactionType, page, airline]);

  const fetchLastTenTransactions = () => {
    const headers = {
      "Content-Type": " application/json",
      Authorization: localStorage.getItem("AuthToken"),
    };
    const reqBody =
      transactionType === "all"
        ? {
          clientId: location?.state?.agentDetails?.clientId,
          pageNo: page,
          pageSize: 10,
          airlineCode: airline,
        }
        : {
          clientId: location?.state?.agentDetails?.clientId,
          pageNo: page,
          pageSize: 10,
          paymentType: transactionType,
          airlineCode: airline,
        };
    axios
      .post(
        `http://stg-api.aeroprime.in/crm-service/payment/latestTransactions`,
        reqBody,
        { headers }
      )
      .then((response) => {
        setTransactionSummery(response.data.data);
        setTotalResults(response.data.totalCount);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  const handleDialogOpen = () => {
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setAmount(0);
    setShowDialog(false);
  };

  const handleDeductBalance = () => {
    const headers = {
      "Content-Type": " application/json",
      Authorization: localStorage.getItem("AuthToken"),
    };
    axios
      .post(
        `http://stg-api.aeroprime.in/crm-service/payment/updateCredits`,
        {
          clientId: location?.state?.agentDetails?.clientId,
          payment: `-${Number(amount)}`,
          reason:
          deductionReason === "Other"
            ? deductionOtherReason
            : deductionReason,
          airlineCode: airline,
        },
        { headers }
      )
      .then((response) => {
        handleDialogClose();
        fetchLastTenTransactions();
        fetchAgentsListForAdmin();
        fetchChartData();
        navigate("/agents");
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  useEffect(() => {
    if (chartData) {
      if (Object.keys(chartData?.["monthly"]).length === 0) {
        setChartDataMonthly([]);
      } else {
        let monthlyData = [["Month", "Credit", "Debit"]];
        Object.keys(chartData?.["monthly"])?.forEach((month) => {
          monthlyData.push([
            month,
            chartData?.["monthly"]?.[month]?.["earned"]
              ? chartData?.["monthly"]?.[month]?.["earned"]
              : 0,
            chartData?.["monthly"]?.[month]?.["spent"]
              ? chartData?.["monthly"]?.[month]?.["spent"]
              : 0,
          ]);
        });
        setChartDataMonthly(monthlyData);
      }
      if (Object.keys(chartData?.["weekly"]).length === 0) {
        setChartDataWeekly([]);
      } else {
        let weeklyData = [["Week", "Credit", "Debit"]];
        Object.keys(chartData?.["weekly"])?.forEach((week) => {
          weeklyData.push([
            week,
            chartData?.["weekly"]?.[week]?.["earned"]
              ? chartData?.["weekly"]?.[week]?.["earned"]
              : 0,
            chartData?.["weekly"]?.[week]?.["spent"]
              ? chartData?.["weekly"]?.[week]?.["spent"]
              : 0,
          ]);
        });
        setChartDataWeekly(weeklyData);
      }
    }
  }, [chartData]);

  function createData(amount, date) {
    const amountFigure = amount < 0 ? amount * -1 : amount;
    const amountType = amount < 0 ? "Debit" : "Credit";
    return { amountType, amountFigure, date };
  }

  const rows = transactionSummary?.map((transaction) => {
    return createData(transaction.amount, transaction.transactionDate);
  });

  function createAirlineBalanceData(
    airlineCode,
    balance,
    operatingAirlineCurrency
  ) {
    return { airlineCode, balance, operatingAirlineCurrency };
  }

  const airlineBalanceRows = currentUserAirlines?.map((airline) => {
    return createAirlineBalanceData(
      airline.airlineCode,
      airline.balance,
      airline.operatingAirlineCurrency
    );
  });

  const optionsMonthly = {
    title: "Month Wise Breakup",
    chartArea: { width: "60%" },
    hAxis: {
      title: `Amount (in ${selectedAirline?.operatingAirlineCurrency})`,
      minValue: 0,
    },
    vAxis: {
      title: "Month",
    },
  };

  const optionsWeekly = {
    title: "Week Wise Breakup",
    chartArea: { width: "60%" },
    hAxis: {
      title: `Amount (in ${selectedAirline?.operatingAirlineCurrency})`,
      minValue: 0,
    },
    vAxis: {
      title: "Week",
    },
  };

  return (
    <div className="add-balance-wrapper">
      <div className="back-btn-wrapper">
        <div className="btn-wrapper" onClick={() => navigate("/Agents")}>
          <img src={backBtn} alt="" className="back-btn" />
        </div>
        <div className="head-btn-wrapper-ub">
          <div className="Agent-heading">DEDUCT BALANCE</div>
          <div className="Break-line"></div>
        </div>
      </div>
      <div className="agent-details-ub">
        <div className="details-col">
          <div className="details-field-ub">
            Name: <span>{agentDetails?.name}</span>
          </div>
        </div>
        <div className="details-col">
          {/* <div className="details-field">
            Agent Name: <span>{agentDetails?.clientName}</span>
          </div> */}
          {/* <div className="details-field">
            Current Balance:{" "}
            <span>{`${location?.state?.agentDetails?.currencySymbol} ${agentDetails?.balance}`}</span>
          </div> */}
          <div className="details-field-ub">
            Email: <span>{agentDetails?.email}</span>
          </div>
        </div>
      </div>
      <div className="table-btn-wrapper">
      <div className="airline-balance-table-wrapper">
        <div className="airline-balance-table">
          <TableContainer component={Paper} sx={{ borderRadius: '20px', overflow: 'hidden' }}>
            <Table sx={{ minWidth: 350 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>S.No.</StyledTableCell>
                  <StyledTableCell align="left">Airline</StyledTableCell>
                  <StyledTableCell align="left">Balance</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {airlineBalanceRows?.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell align="left">{row.airlineCode}</TableCell>
                    <TableCell align="left">{`${row.operatingAirlineCurrency} ${row.balance}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <div className="add-amount-section">
        <div className="add-amount-section-element">
          <StyledFormControl fullWidth>
            <Select
              id="demo-simple-select"
              value={airline}
              onChange={(event) => {
                currentUserAirlines?.forEach(airline => {
                  if (airline.airlineCode === event.target.value) {
                    setSelectedAirline(airline);
                  }
                })
                setAirline(event.target.value);
                setTransactionType("all");
                setPage(1);
              }}
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
              {currentUserAirlines?.map((airline) => (
                <MenuItem value={airline.airlineCode}>
                  {airline.airlineCode}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        </div>
        <div className="add-amount-section-element">
          <FormControl fullWidth>
            <input
              type="number"
              className="Input-balance"
              placeholder="Amount (in Rs)"
              min={0}
              label={`Amount ${airline ? `(in ${selectedAirline.operatingAirlineCurrency})` : ""}`}
              InputProps={{
                inputProps: { min: 0 },
              }}
              onKeyPress={(event) => {
                if (event?.key === "-" || event?.key === "+") {
                  event.preventDefault();
                }
              }}
              value={amount}
              fullWidth
              onChange={(event) => setAmount(event.target.value)}
            ></input>
          </FormControl>
        </div>
        <div className="add-amount-section-element">
          <StyledFormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={deductionReason}
             
              onChange={(event) => setDeductionReason(event.target.value)}
              name="Reason"
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <PlaceholderTypography>Reason</PlaceholderTypography>;
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
              {deductionReasonList?.map((reason) => (
                <MenuItem value={reason}>{reason}</MenuItem>
              ))}
            </Select>
          </StyledFormControl>
       
        </div>
        <div className="add-amount-section-element">
        {deductionReason === "Other" && (
            <div className="deduct-amount-section-element-textfield">
              <FormControl fullWidth>
                <input
                  type="text"
                  className="Input-balance"
                  placeholder="Mention Other Reason"
                  value={deductionOtherReason}
                  fullWidth
                  onChange={(event) =>
                    setOtherDeductionReason(event.target.value)
                  }
                ></input>
              </FormControl>
            </div>
          )}
            </div>
          <button
           className="add-amount-btn"
            variant="contained"
            onClick={handleDialogOpen}
            disabled={!amount || !deductionReason || !airline}
          >
            Deduct Amount
          </button>
        <Dialog
          open={showDialog}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure to deduct balance for this user? Once done cannot be
              reverted
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Disagree</Button>
            <Button onClick={handleDeductBalance} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      </div>
      <div className="charts-wrapper">
        {(chartDataMonthly?.length > 0 || chartDataWeekly?.length > 0) && (
          // <div className="credit-debit-chart-header">Credit-Debit History</div>
          <div className="head-btn-wrapper-ub">
          <div className="Agent-heading">CREDIT-DEBIT HISTORY</div>
          <div className="Break-line"></div>
        </div>
        )}
        <div className="charts">
          {chartDataMonthly?.length > 0 && (
            <div className="monthy-chart chart">
              <Chart
                chartType="BarChart"
                width="500px"
                height="400px"
                data={chartDataMonthly}
                options={optionsMonthly}
              />
            </div>
          )}
          {chartDataWeekly?.length > 0 && (
            <div className="weekly-chart chart">
              <Chart
                chartType="BarChart"
                width="500px"
                height="400px"
                data={chartDataWeekly}
                options={optionsWeekly}
              />
            </div>
          )}
        </div>
      </div>

      {airline && (
        <div className="table-wrapper">
         <div className="head-btn-wrapper-ub">
            <div className="Agent-heading">LATEST TRANSACTIONS</div>
            <div className="Break-line"></div>
          </div>
        
        
          <div className="radio-selection-ub">
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                // defaultValue={transactionType}
                name="radio-buttons-group"
                onChange={(e) => {
                  setTransactionType(e.target.value);
                  setPage(1);
                }}
                value={transactionType}
              >
                <FormControlLabel value="all" control={<CustomRadio />} label="All" />
                <FormControlLabel
                  value="credit"
                  control={<CustomRadio />}
                  label="Credit"
                />
                <FormControlLabel
                  value="debit"
                  control={<CustomRadio />}
                  label="Debit"
                />
                <FormControlLabel
                  value="refund"
                  control={<CustomRadio />}
                  label="Refund"
                />
              </RadioGroup>
            </FormControl>
          </div>

          <TableContainer component={Paper}  sx={{ borderRadius: '20px', overflow: 'hidden' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>S.No.</StyledTableCell>
                  <StyledTableCell align="left">{`Amount (${location?.state?.agentDetails?.currencySymbol})`}</StyledTableCell>
                  <StyledTableCell align="left">Type</StyledTableCell>
                  <StyledTableCell align="left">Date</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows?.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell align="left">{row.amountFigure}</TableCell>
                    <TableCell align="left">{row.amountType}</TableCell>
                    <TableCell align="left">{row.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {rows?.length > 0 && (
            <div className="pagination-wrapper">
              <Pagination
                sx={{
                  "& .MuiPaginationItem-root": {
                    // Rounded pagination buttons
                    "&.Mui-selected": {
                      backgroundColor: "#EF5443",
                      color: "white",
                    },
                  },
                }}
                count={Math.floor(totalResults / 10) + 1}
                color="primary"
                onChange={(e, page) => setPage(page)}
                page={page}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeductBalanceScreen;
