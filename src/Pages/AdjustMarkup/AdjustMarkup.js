import React, { useEffect, useState } from "react";
import './AdjustMarkup.css'
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogContentText } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateAgentList } from "../../store/slices/agentListSlice";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 100,
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

const AdjustMarkup = ({ open, onClose, rowData }) => {
    const [agentDetails, setAgentDetails] = useState(null);
    const [airline, setAirline] = useState(null);
    const [currentAirlineMarkup, setCurrentAirlineMarkup] = useState(null);
    const [markup, setMarkup] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [showCancelSuccessToast, setShowCancelSuccessToast] = useState(false);
    const agentList = useSelector((state) => state.agentList.agentList);

    const loggedInUserDetails = useSelector(
        (state) => state.loggedInUserDetails.loggedInUserDetails
    );
    const dispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        if (airline) {
            agentDetails?.markupList?.forEach((airlineMarkup) => {
                if (airlineMarkup?.airlineCode === airline) {
                    setCurrentAirlineMarkup(airlineMarkup);
                }
            });
        }
    }, [airline]);

    const handleDialogOpen = () => {
        setShowDialog(true);
    };

    const handleDialogClose = () => {
        setShowDialog(false);
    };

    useEffect(() => {
        if (!agentList) {
            fetchAgentsListForAdmin();
        }
    }, [agentList]);

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

    useEffect(() => {
        if (agentList && rowData?.clientId) {
            agentList?.forEach((agent) => {
                if (agent.email === rowData?.email) {
                    setAgentDetails(agent);
                }
            });
        }
    }, [agentList, rowData?.clientId, rowData]);

    const handleAdjustMarkup = () => {
        const headers = {
            "Content-Type": " application/json",
            Authorization: localStorage.getItem("AuthToken"),
        };
        axios
            .post(
                `http://stg-api.aeroprime.in/airline-service/admin/addMarkup`,
                {
                    clientId:
                        loggedInUserDetails?.role === "agent"
                            ? loggedInUserDetails?.clientId
                            : agentDetails?.clientId,
                    markupValue: Number(markup),
                    airlineCode: currentAirlineMarkup?.airlineCode ?? airline,
                    id: currentAirlineMarkup?.id,
                },
                { headers }
            )
            // .then((response) => {
            //     handleDialogClose();
            //     fetchAgentsListForAdmin();
            //     setShowCancelSuccessToast(true);
            //     navigate("/agents");
            // })
            .then((response) => {
                if (response.status === 200) {
                    // ✅ Update currentAirlineMarkup with the new markup value
                    setCurrentAirlineMarkup((prev) => ({
                        ...prev,
                        markupValue: Number(markup), // Update with new value
                    }));
                    // ✅ Show success toast
                    setShowCancelSuccessToast(true);

                    // ✅ Close the modal automatically
                    handleDialogClose();
                    // onClose();  // 🚀 This will close the main modal
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
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
        sx={{
            "& .MuiPaper-root": {
              borderRadius: "50px",
            },
          }}
        >
            <div className="add-agent-wrapper">
                <div className="heading-close-btn">
                    <DialogTitle className="Add-heading">ADJUST MARKUP</DialogTitle>
                    <div className="Close-btn" onClick={onClose}>
                    {" "}
                    <CancelSharpIcon fontSize="large" />{" "}
                    </div>
                </div>

                 <div className="add-agent-wrapper2">
                    <div className="Breakline3"></div>
                    <DialogContent>
                        <div className="adjust-markup-wrapper3">
                            <div className="agent-details">
                                <div className="details-col">
                                    <div className="details-field">
                                        Name: <span className="name-text">{agentDetails?.name}</span>
                                    </div>
                                </div>
                                <div className="details-col">
                                    <div className="details-field">
                                        Email: <span className="email-txt">{agentDetails?.email}</span>
                                    </div>
                                </div>
                            </div>

                            {agentDetails?.airlineCodes?.length > 0 ? (
                                <>
                                  {airline && (
                                        <div className="current-airline-markup">
                                            Current Airline Markup:{" "}
                                            <span>
                                                {currentAirlineMarkup
                                                    ? `${currentAirlineMarkup?.markupValue}%`
                                                    : "Not Available"}
                                            </span>
                                        </div>
                                    )}
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
                                                      Markup Rate Updated!!
                                                    </Alert>
                                                  </Snackbar>
                                <div className="adjust-markup-section">
                                    <div className="airline-dd">
                                        <StyledFormControl fullWidth>
                                            <Select
                                                value={airline}
                                                onChange={(e) => {
                                                    setAirline(e.target.value);
                                                    setCurrentAirlineMarkup(null);
                                                }}
                                                displayEmpty
                                                renderValue={(selected) => {
                                                    if (!selected) {
                                                      return (
                                                        <PlaceholderTypography
                                                          style={{ fontSize: "14px" }}
                                                        >
                                                         Select an Airline
                                                        </PlaceholderTypography>
                                                      );
                                                    }
                                                    return selected;
                                                  }}
                                                  style={{
                                                    fontSize: "14px",
                                                    width: "223px",
                                                    height: "52px",
                                                    margin: "8px",
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
                                                {agentDetails?.airlineCodes?.map((airline, index) => (
                                                    <MenuItem key={index} value={airline}>
                                                        {airline}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </StyledFormControl>
                                    </div>

                                  

                                    <div className="adjust-markup-section-element">
                                        <FormControl fullWidth>
                                            <input
                                            className="Input1"
                                                type="number"
                                               placeholder="Markup %"
                                                InputProps={{
                                                    inputProps: { min: 0 },
                                                }}
                                                value={markup}
                                                onChange={(e) => setMarkup(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === "-" || e.key === "+") e.preventDefault();
                                                }}
                                            />
                                        </FormControl>
                                    </div>
                                </div>
                                <div>
                                    <div className="Add-admin-btn-wrapper2">
                                        <button
                                         className="Add-admin-btn"
                                            variant="contained"
                                            onClick={handleDialogOpen}
                                            disabled={!airline || !markup}
                                        >
                                            Update
                                        </button>
                                    </div>

                                    <Dialog
                                        open={showDialog}
                                        onClose={handleDialogClose}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                Are you sure you want to update the markup value?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleDialogClose}>Cancel</Button>
                                            <Button onClick={handleAdjustMarkup} autoFocus>
                                                Confirm
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>
                                </>
                            ) : (
                                <div style={{ marginTop: "25px" }}>No Airlines enabled yet!</div>
                            )}
                        </div>
                    </DialogContent>
                </div>
            </div>    
        </Dialog>
    );
};

export default AdjustMarkup;
