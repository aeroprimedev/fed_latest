import React, { useEffect, useState } from "react";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import "./CurrencyConversion.css";
import axios from "axios";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

const PlaceholderTypography = styled(Typography)(({ theme }) => ({
  color: "#888",
  fontSize: "16px",
}));

const CurrencyConversion = ({ open, onClose }) => {
  const [currentCurrencyData, setCurrentCurrencyData] = useState(null);
  const [selectedCurrencyData, setSelectedCurrencyData] = useState(null);
  const [currencyList, setCurrencyList] = useState(null);
  const [conversionRate, setConversionRate] = useState(null);
  const [fromCurrency, setFromCurrency] = useState(null);
  const [toCurrency, setToCurrency] = useState(null);

  const [showCancelSuccessToast, setShowCancelSuccessToast] = useState(false);

  useEffect(() => {
    getCurrencyConversionData();
    getCurrencyListData();
  }, []);

  useEffect(() => {
    setSelectedCurrencyData(null);
    if (toCurrency && fromCurrency) {
      currentCurrencyData?.forEach((currencyConversionData) => {
        if (
          currencyConversionData.fromCurrency === fromCurrency &&
          currencyConversionData.toCurrency === toCurrency
        ) {
          setSelectedCurrencyData(currencyConversionData);
        }
      });
    }
  }, [fromCurrency, toCurrency, currentCurrencyData]);

  const getCurrencyListData = () => {
    axios
      .get("http://stg-api.aeroprime.in/crm-service/currency/dropDown", {
        headers: {
          Authorization: localStorage.getItem("AuthToken"),
        },
      })
      .then((response) => setCurrencyList(response.data))
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  const getCurrencyConversionData = () => {
    axios
      .get(
        "http://stg-api.aeroprime.in/crm-service/currency/conversionDetails",
        {
          headers: {
            Authorization: localStorage.getItem("AuthToken"),
          },
        }
      )
      .then((response) => setCurrentCurrencyData(response.data))
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  const updateCurrencyConversion = () => {
    axios
      .post(
        "http://stg-api.aeroprime.in/crm-service/currency/updateConversion",
        {
          id: selectedCurrencyData?.id,
          fromCurrency: fromCurrency,
          toCurrency: toCurrency,
          conversionRate: conversionRate,
        },
        {
          headers: {
            Authorization: localStorage.getItem("AuthToken"),
          },
        }
      )
      .then((response) => {
        if (response?.data?.success === true) {
          getCurrencyConversionData();
          setShowCancelSuccessToast(true);
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "50px",
        },
      }}
    >
      <div className="add-agent-wrapper">
        <div className="heading-close-btn">
          <DialogTitle className="Add-heading">CURRENCY CONVERSION</DialogTitle>
          <div className="Close-btn" onClick={onClose}>
            {" "}
            <CancelSharpIcon fontSize="large" />{" "}
          </div>
        </div>

        <div className="add-agent-wrapper2">
          <div className="Breakline3"></div>
          <DialogContent>
            <div className="add-agent-wrapper3">
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
                  Conversion Rate Updated!!
                </Alert>
              </Snackbar>

              <div className="currency-conversion-input-wrapper">
                <div className="currency-dd-wrapper">
                  <div className="currency-dd">
                    <StyledFormControl fullWidth>
                      <Select
                        id="demo-simple-select"
                        value={fromCurrency}
                        onChange={(e) => {
                          setFromCurrency(e.target.value);
                          setToCurrency(null);
                        }}
                        displayEmpty
                        renderValue={(selected) => {
                          if (!selected) {
                            return (
                              <PlaceholderTypography
                                style={{ fontSize: "14px" }}
                              >
                                From
                              </PlaceholderTypography>
                            );
                          }
                          return selected;
                        }}
                        style={{
                          fontSize: "14px",
                          width: "333px",
                          height: "52px",
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
                        {currencyList &&
                          Object.keys(currencyList).map((currency, index) => {
                            return (
                              <MenuItem value={currency}>{currency}</MenuItem>
                            );
                          })}
                      </Select>
                    </StyledFormControl>
                  </div>
                  <div className="currency-dd">
                    <StyledFormControl fullWidth>
                      <Select
                        id="demo-simple-select"
                        value={toCurrency}
                        onChange={(e) => {
                          setToCurrency(e.target.value);
                        }}
                        displayEmpty
                        renderValue={(selected) => {
                          if (!selected) {
                            return (
                              <PlaceholderTypography
                                style={{ fontSize: "14px" }}
                              >
                                To
                              </PlaceholderTypography>
                            );
                          }
                          return selected;
                        }}
                        style={{
                          fontSize: "14px",
                          width: "333px",
                          height: "52px",
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
                        {currencyList &&
                          fromCurrency &&
                          currencyList[fromCurrency].map((currency, index) => {
                            return (
                              <MenuItem value={currency}>{currency}</MenuItem>
                            );
                          })}
                      </Select>
                    </StyledFormControl>
                  </div>
                </div>
                {selectedCurrencyData?.conversionRate && (
                  <div className="current-currency-rate">{`Current Conversion Rate: ${selectedCurrencyData?.conversionRate}`}</div>
                )}
                <div className="currency-conversion-input">
                  <div>
                    <FormControl fullWidth>
                      <input
                        type="number"
                        className="Input"
                        placeholder="Conversion Rate"
                        min={0}
                        InputProps={{
                          inputProps: { min: 0 },
                        }}
                        onKeyPress={(event) => {
                          if (event?.key === "-" || event?.key === "+") {
                            event.preventDefault();
                          }
                        }}
                        value={conversionRate}
                        fullWidth
                        onChange={(event) =>
                          setConversionRate(event.target.value)
                        }
                      ></input>
                    </FormControl>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </div>

        <div className="Add-admin-btn-wrapper2">
          <DialogActions>
            <button
              className="Add-admin-btn"
              variant="contained"
              onClick={updateCurrencyConversion}
              disabled={!toCurrency || !fromCurrency || !conversionRate}
            >
              Update
            </button>
          </DialogActions>
        </div>
      </div>
    </Dialog>
  );
};

export default CurrencyConversion;
