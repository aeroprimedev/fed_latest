import React, { useEffect, useState } from "react";
import "./ManageAirlines.css";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Delete } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { updateAgentList } from "../../store/slices/agentListSlice";
import { styled } from "@mui/material/styles";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";
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
  
const ManageAirlinesScreen = ({ open, onClose, agentDetails }) => {
    const [airLinesList, setAirlinesList] = useState([]);
    const [currencyList, setCurrencyList] = useState([]);
    const [currentUserAirlines, setCurrentUserAirlines] = useState([]);
    const [airlinesAvailableforAddition, setAirlinesAvailableforAddition] =
        useState([]);
    const [showAddAirlineWrapper, setShowAddAirlineWrapper] = useState(false);
    const [airline, setAirline] = useState("");
    const [currency, setCurrency] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const clientId = agentDetails?.clientId;

    useEffect(() => {
        if (clientId) {
            fetchAirlineList();
            fetchCurrencyList();
        }
    }, [clientId]);

    useEffect(() => {
        if (airLinesList.length) {
            fetchCurrentUserAirlines();
        }
    }, [airLinesList]);

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
                    navigate("/");
                }
            });
    };

    const fetchAirlineList = () => {
        const headers = {
            "Content-Type": "application/json",
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
                    navigate("/");
                }
            });
    };

    const fetchCurrencyList = () => {
        const headers = {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("AuthToken"),
        };
        axios
            .get("http://stg-api.aeroprime.in/crm-service/admin/getCurrencyList", {
                headers,
            })
            .then((response) => setCurrencyList(response.data))
            .catch((error) => {
                if (error.response.status === 401) {
                    localStorage.clear();
                    navigate("/");
                }
            });
    };

    const fetchCurrentUserAirlines = () => {
        const headers = {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("AuthToken"),
        };
        axios
            .get(
                `http://stg-api.aeroprime.in/crm-service/admin/getAirlineDetails/${clientId}`,
                { headers }
            )
            .then((response) => {
                if (response.status === 200) {
                    setCurrentUserAirlines(response.data);
                    const existingAirlines = response.data.map(
                        (airline) => airline.airlineCode
                    );
                    const availableForAddition = airLinesList.filter(
                        (airline) => !existingAirlines.includes(airline)
                    );
                    setAirlinesAvailableforAddition(availableForAddition);
                }
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    localStorage.clear();
                    navigate("/");
                }
            });
    };

    const addAirline = () => {
        const headers = {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("AuthToken"),
        };
        axios
            .post(
                `http://stg-api.aeroprime.in/crm-service/admin/addUpdateAirline`,
                {
                    clientId: clientId,
                    airlineCode: airline,
                    operatingAirlineCurrency: currency,
                },
                { headers }
            )
            .then((response) => {
                if (response.status === 200) {
                    fetchAgentsListForAdmin();
                    fetchCurrentUserAirlines();
                    setAirline("");
                    setCurrency("");
                    setShowAddAirlineWrapper(false);
                }
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    localStorage.clear();
                    navigate("/");
                }
            });
    };

    const deleteAirline = (airlineId) => {
        const headers = {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("AuthToken"),
        };
        axios
            .post(
                `http://stg-api.aeroprime.in/crm-service/admin/deleteAirline/${clientId}/${airlineId}`,
                {},
                { headers }
            )
            .then((response) => {
                if (response.status === 200) {
                    fetchCurrentUserAirlines();
                }
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    localStorage.clear();
                    navigate("/");
                }
            });
    };

    const updateCurrencyForAirline = (data) => {
        const headers = {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("AuthToken"),
        };
        axios
            .post(
                `http://stg-api.aeroprime.in/crm-service/admin/addUpdateAirline`,
                data,
                { headers }
            )
            .then((response) => {
                if (response.status === 200) {
                    fetchCurrentUserAirlines();
                }
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    localStorage.clear();
                    navigate("/");
                }
            });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
        sx={{
            "& .MuiPaper-root": {
              borderRadius: "50px",
            },
          }}
        >
            <div className="manage-airlines-wrapper">
              <div className="heading-close-btn">
                <DialogTitle className="Add-heading">MANAGE AIRLINES</DialogTitle>
                <div className="Close-btn" onClick={onClose}>
                    {" "}
                    <CancelSharpIcon fontSize="large" />{" "}
                </div>
              </div>
              <div className="add-agent-wrapper2">
               <div className="Breakline3"></div>
                <DialogContent>
                    <div className="current-airlines-currency-wrapper">
                        {currentUserAirlines.map((airline, index) => (
                            <div
                                className="current-airlines-currency"
                                key={airline.id || index}
                            >
                                <div className="current-airline">{airline.airlineCode}</div>
                                <div className="current-currency">
                                    <StyledFormControl fullWidth>
                                        <Select
                                            value={airline.operatingAirlineCurrency}
                                            onChange={(event) => {
                                                updateCurrencyForAirline({
                                                    ...airline,
                                                    operatingAirlineCurrency: event.target.value,
                                                });
                                            }}
                                            renderValue={(selected) => {
                                                if (!selected) {
                                                  return (
                                                    <PlaceholderTypography
                                                      style={{ fontSize: "14px" }}
                                                    >
                                                    
                                                    </PlaceholderTypography>
                                                  );
                                                }
                                                return selected;
                                              }}
                                              style={{
                                                fontSize: "14px",
                                                width: "150px",
                                                height: "52px",
                                              }}
                                              IconComponent={(props) => (
                                                <ExpandMoreIcon
                                                  {...props}
                                                  style={{
                                                    color: "#ff5722",
                                                
                                                  }}
                                                />
                                              )}
                                        >
                                            {currencyList.map((currency, idx) => (
                                                <MenuItem value={currency} key={idx}>
                                                    {currency}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </StyledFormControl>
                                </div>
                                <div className="delete-airline-wrapper">
                                    <Fab
                                        size="small"
                                        style={{
                                            backgroundColor: '#EF5443', // Red background similar to the image
                                            color: '#fff', // White icon color
                                            transition: 'transform 0.3s ease-in-out', // Smooth transition for hover
                                          }}
                                        onClick={() => deleteAirline(airline.id)}
                                          // Add hover effect for enlargement
                                        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                                        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                    >
                                        <Delete/>
                                    </Fab>
                                </div>
                            </div>
                        ))}
                    </div>
                    {airLinesList.length !== currentUserAirlines.length &&
                        !showAddAirlineWrapper && (
                            <div className="add-airline-btn-wrapper">
                                <button
                                   className="Add-airline"
                                    variant="extended"
                                    size="medium"
                                    color="primary"
                                    onClick={() => setShowAddAirlineWrapper(true)}
                                >
                                    <AddIcon sx={{ mr: 1 }} />
                                    Add Airline
                                </button>
                            </div>
                        )}
                    {showAddAirlineWrapper && (
                        <div className="add-airline-wrapper">
                            <div className="airlinr-currency-wrapper">
                                <div className="select-airline">
                                    <StyledFormControl fullWidth>
                                        <Select
                                            value={airline}
                                            onChange={(event) => setAirline(event.target.value)}
                                            displayEmpty
                                            renderValue={(selected) => {
                                            if (!selected) {
                                                return (
                                                <PlaceholderTypography
                                                    style={{ fontSize: "14px" }}
                                                >
                                                Airline
                                                </PlaceholderTypography>
                                                );
                                            }
                                            return selected;
                                            }}
                                            style={{
                                            fontSize: "14px",
                                            width: "150px",
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
                                        >
                                            {airlinesAvailableforAddition.map((airline, index) => (
                                                <MenuItem value={airline} key={index}>
                                                    {airline}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </StyledFormControl>
                                </div>
                                <div className="select-currency">
                                    <StyledFormControl fullWidth>
                                        <Select
                                            value={currency}
                                            onChange={(event) => setCurrency(event.target.value)}
                                            displayEmpty
                                            renderValue={(selected) => {
                                            if (!selected) {
                                                return (
                                                <PlaceholderTypography
                                                    style={{ fontSize: "14px" }}
                                                >
                                                Operating Currency
                                                </PlaceholderTypography>
                                                );
                                            }
                                            return selected;
                                            }}
                                            style={{
                                            fontSize: "14px",
                                            width: "200px",
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
                                        >
                                            {currencyList.map((currency, index) => (
                                                <MenuItem value={currency} key={index}>
                                                    {currency}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </StyledFormControl>
                                </div>
                            </div>
                            <div className="add-airline-btn-wrapper">
                            <DialogActions>
                                <button
                                    className="Add-airline"
                                    variant="extended"
                                    
                                    onClick={addAirline}
                                >
                                    <AddIcon sx={{ mr: 2 }} />
                                    ADD AIRLINE
                                </button>
                            </DialogActions>
                            </div>
                        </div>
                    )}
                </DialogContent>
                </div>
            </div>
        </Dialog>
    );
};

export default ManageAirlinesScreen;
