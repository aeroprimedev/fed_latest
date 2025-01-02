import React, { useEffect, useState } from "react";
import "./AddAgent.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useSelector, useDispatch } from "react-redux";
import { updateAgentList } from "../../store/slices/agentListSlice";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import CancelSharpIcon from '@mui/icons-material/CancelSharp';
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px', // Rounded corners
    paddingRight: '30px', // Space for the dropdown icon
    borderColor: '#ddd', // Light border color
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#EF5443', // Hover border color
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#EF5443', // Focus border color
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666', // Label color
  },
  '& .MuiSelect-icon': {
    color: '#f44336', // Dropdown icon color similar to the image
  },
}));

const PlaceholderTypography = styled(Typography)(({ theme }) => ({
  color: '#888',
  fontSize: '16px', // Match the font size of the Select component
}));


const permissionWrapper = {
    isSuperAgent: "Is Super Agent",
    canCreateSubAgent: "Can Create Sub Agent",
    canDeactivateSubAgent: "Can Deactivate Sub Agent",
    canViewBookingOfAllSubAgent: "Can View Bookings of All Sub Agent",
    canActivateSubAgentBannerPromotion: "Can Activate Sub Agent Banner Promotion",
    canDoBannerPromotion: "Can Do Banner Promotion",
    canDoPnrManagement: "Can Do PNR Management",
    canViewMisReport: "Can View Booking Report",
    canViewTopUpReport: "Can View Ledger Report",
    canResetSubAgentPassword: "Can Reset Sub Agent Password",
    canCreateBooking: "Can Create Booking",
};

const AddAgent = ({ open, onClose }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [agentDisplayCurrency, setAgentDisplayCurrency] = useState(null);
    const [permissions, setPermissions] = useState(null);
    const [showInputErrors, setShowInputErrors] = useState(false);
    const [existingEmails, setExistingEmails] = useState(null);
    const [emailError, setEmailError] = useState(false);
    const [currencyList, setCurrencyList] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loggedInUserDetails = useSelector(
        (state) => state.loggedInUserDetails.loggedInUserDetails
    );

    useEffect(() => {
        fetchCurrencyList();
        fetchSystemEmails();
        setPermissions({
          isSuperAgent: 1,
          canCreateSubAgent: 1,
          canDeactivateSubAgent: 1,
          canViewBookingOfAllSubAgent: 1,
          canActivateSubAgentBannerPromotion: 1,
          canDoBannerPromotion: 1,
          canDoPnrManagement: 1,
          canViewMisReport: 1,
          canViewTopUpReport: 1,
          canResetSubAgentPassword: 1,
          canCreateBooking: 1,
        });
      }, []);

      const handleToggleChange = (event, permission) => {
        let permissionsObj = JSON.parse(JSON.stringify(permissions));
        permissions[permission] === 0
          ? (permissionsObj[permission] = 1)
          : (permissionsObj[permission] = 0);
        setPermissions(JSON.parse(JSON.stringify(permissionsObj)));
      };
    

      const fetchSystemEmails = () => {
        const headersForUserAPI = {
          Authorization: localStorage.getItem("AuthToken"),
        };
        axios
          .get(
            "http://stg-api.aeroprime.in/crm-service/admin/getAvailableEmailList",
            {
              headers: headersForUserAPI,
            }
          )
          .then((response) => {
            if (response?.data) {
              setExistingEmails(response?.data);
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

      const fetchAgentsListForAgent = () => {
        const headersForUserAPI = {
          Authorization: localStorage.getItem("AuthToken"),
        };
        axios
          .get("http://stg-api.aeroprime.in/crm-service/agent/getAgentList", {
            headers: headersForUserAPI,
          })
          .then((response) => dispatch(updateAgentList(response.data)))
          .catch((error) => {
            if (error.response.status === 401) {
              localStorage.clear();
              window.location.href = "/";
            }
          });
      };
    
      const fetchCurrencyList = () => {
        const headers = {
          "Content-Type": " application/json",
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
              window.location.href = "/";
            }
          });
      };
    

      const handleAddAgentForAgentLogin = () => {
        const reqBody = {
          name: name,
          password: password,
          email: email,
          phone: phoneNumber,
          currencyCode: agentDisplayCurrency,
          ...permissions,
          isActive: 1,
        };
        axios
        .post(
          `http://stg-api.aeroprime.in/crm-service/agent/addUpdate`,
          reqBody,
          {
            headers: {
              Authorization: localStorage.getItem("AuthToken"),
              Accept: "application/json",
            },
          }
        )
        .then((response) => {
            if (response.data.success === true) {
              loggedInUserDetails?.role === "admin"
                ? fetchAgentsListForAdmin()
                : fetchAgentsListForAgent();
            //   navigate("/agents");
            onClose();
            }
          })
          .catch((error) => {
            if (error.response.status === 401) {
              localStorage.clear();
              window.location.href = "/";
            }
          });
      };

      const handleAddAgentForAdminLogin = () => {
        const reqBody = {
          name: name,
          password: password,
          email: email,
          phone: phoneNumber,
          currencyCode: agentDisplayCurrency,
          ...permissions,
          isActive: 1,
        };
        axios
          .post(
            `http://stg-api.aeroprime.in/crm-service/agent/addSuperAgent`,
            reqBody,
            {
              headers: {
                Authorization: localStorage.getItem("AuthToken"),
                Accept: "application/json",
              },
            }
          )
          .then((response) => {
            if (response.data.success === true) {
              loggedInUserDetails?.role === "admin"
                ? fetchAgentsListForAdmin()
                : fetchAgentsListForAgent();
            //   navigate("/agents");
            onClose();
            }
          })
          .catch((error) => {
            if (error.response.status === 401) {
              localStorage.clear();
              window.location.href = "/";
            }
          });
      };
      const handleAddAgent = () => {
        if (
          !String(email)
            .toLowerCase()
            .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ) ||
          phoneNumber?.length !== 10
        ) {
          setShowInputErrors(true);
        } else if (existingEmails.includes(email)) {
          setEmailError(true);
        } else {
          loggedInUserDetails?.role === "admin"
            ? handleAddAgentForAdminLogin()
            : handleAddAgentForAgentLogin();
        }
      };


    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "50px", // Set your desired border-radius
          },
        }} 
        >
           <div className="add-agent-wrapper">
           <div className="heading-close-btn">
            <DialogTitle className="Add-heading">ADD AGENT</DialogTitle>
            <div className="Close-btn" onClick={onClose}> <CancelSharpIcon  fontSize="large"  /> </div>
            </div>
            <div className="add-agent-wrapper2">
            <div className="Breakline3"></div>
            <DialogContent>
                <div className="add-agent-wrapper3">
                    <div className="add-agent-section">
                        <div className="name-wrapper">
                            <FormControl fullWidth>
                                <input
                                  className="Input"
                                     placeholder="Name"
                                    type="name"
                                    value={name}
                                    fullWidth
                                    onChange={(event) => setName(event.target.value)}
                                    required
                                ></input>
                            </FormControl>
                        </div>
                        <div className="email-wrapper">
                            <FormControl fullWidth>
                                <input
                                    className="Input"
                                    placeholder="Email Id"
                                    type="email"
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
                            </FormControl>
                        </div>
                    </div>
                    <div className="add-agent-section">
                        <div className="phone-wrapper">
                            <FormControl fullWidth>
                                <input
                                    className="Input"
                                    placeholder="Phone Number"
                                    type="number"
                                    value={phoneNumber}
                                    fullWidth
                                    onChange={(event) => setPhoneNumber(event.target.value)}
                                    required
                                    error={
                                        showInputErrors &&
                                        (!phoneNumber || phoneNumber?.length !== 10)
                                    }
                                ></input>
                            </FormControl>
                        </div>
                        <div className="password-wrapper">
                            <FormControl fullWidth>
                                <input
                                   className="Input"
                                    placeholder="Password"
                                    type="password"
                                    value={password || ""}
                                    fullWidth
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                ></input>
                            </FormControl>
                        </div>
                    </div>
                    {loggedInUserDetails?.role === "admin" && (
                     <div className="add-agent-section">
                        <div className="currency-wrapper">
                          <StyledFormControl fullWidth>
                            <Select
                                id="demo-simple-select"
                                value={agentDisplayCurrency}
                                className="select-currency"
                                onChange={(event) => {
                                setAgentDisplayCurrency(event.target.value);
                                }}
                                name="Agent Display Currency"
                                displayEmpty
                                renderValue={(selected) => {
                                  if (!selected) {
                                    return (
                                      <PlaceholderTypography>Display Currency</PlaceholderTypography>
                                    );
                                  }
                                  return selected;
                                }}
                                style={{
                                 
                                  fontSize: "14px", // Font size
                                    width: "333px",
                                  height: "52px"
                                }}
                                IconComponent={(props) => (
                                  <ExpandMoreIcon
                                    {...props}
                                    style={{
                                      color: "#ff5722", // Arrow color
                                      marginRight: "8px", // Spacing to match the design
                                    }}
                                  />
                                )} 
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      border: "1px solid #E5E2DA", // Border for dropdown
                                      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // Subtle shadow
                                      marginTop: "8px",
                                      borderRadius: "6px", // Matching rounded corners for the dropdown
                                      maxHeight: "200px", // Limit the height to trigger scrolling
                                      overflow: "hidden", // Hide the scrollbar
                                    },
                                  },
                                  MenuListProps: {
                                    style: {
                                      padding: 0,
                                      maxHeight: "200px", // Ensure the list is scrollable
                                      overflowY: "auto", // Enable vertical scrolling
                                      scrollbarWidth: "none", // Hide scrollbar in Firefox
                                      msOverflowStyle: "none", // Hide scrollbar in IE and Edge
                                    },
                                    "&::-webkit-scrollbar": {
                                      display: "none",
                                    },
                                  },
                                }} 
                            >
                            {currencyList &&
                            currencyList?.map((currency, index) => {
                            return <MenuItem value={currency}>{currency}</MenuItem>;
                            })}
                            </Select>
                          </StyledFormControl>
                        </div>
                      </div>
                    )} 
      <div className="add-agent-section permissions-wrapper2">
      <div className="permissions-container">
        {permissions &&
          Object.keys(permissions)?.map((permission, index) => {
            if (
              index <= Object.keys(permissions)?.length / 2 &&
              ((loggedInUserDetails?.role === "admin" &&
                permission !== "isSuperAgent") ||
                loggedInUserDetails?.role !== "admin")
            ) {
              return (
                <div key={index + permission}>
                  <span className="switch-container">
                    <Switch
                      checked={permissions[permission] === 1 ? true : false}
                      onChange={(event) =>
                        handleToggleChange(event, permission)
                      }
                      inputProps={{ "aria-label": "controlled" }}
                      disabled={
                        permission === "isSuperAgent" &&
                        loggedInUserDetails?.role === "sub_agent"
                      }
                    />
                  </span>
                  <span className="switch-label-container">
                    {permissionWrapper[permission]}
                  </span>
                </div>
              );
            }
          })}
      </div>
      <div className="permissions-container">
        {permissions &&
          Object.keys(permissions)?.map((permission, index) => {
            if (index > Object.keys(permissions)?.length / 2) {
              return (
                <div key={index + permission}>
                  <span className="switch-container">
                    <Switch
                      checked={permissions[permission] === 1 ? true : false}
                      onChange={(event) =>
                        handleToggleChange(event, permission)
                      }
                      inputProps={{ "aria-label": "controlled" }}
                      disabled={
                        permission === "isSuperAgent" &&
                        loggedInUserDetails?.role === "sub_agent"
                      }
                    />
                  </span>
                  <span className="switch-label-container">
                    {permissionWrapper[permission]}
                  </span>
                </div>
              );
            }
          })}
      </div>
    </div>
    {emailError && (
      <div style={{ margin: "20px" }}>Email already exists in system.</div>
    )}
                </div> 
            </DialogContent>
            </div>
            <div className="Add-admin-btn-wrapper">
            <DialogActions>
                  <button
                  className="Add-admin-btn"
                    variant="contained"
                    onClick={handleAddAgent}
                    disabled={!name || !email || !phoneNumber || !password}
                >
                    ADD AGENT
                </button>
             
            </DialogActions>
            </div>
            </div> 
        </Dialog>
    );
};

export default AddAgent;
