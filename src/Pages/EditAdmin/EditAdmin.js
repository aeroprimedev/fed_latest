import React, { useEffect, useState } from "react";
import "./EditAdmin.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import FormControl from "@mui/material/FormControl";

import Switch from "@mui/material/Switch";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useSelector, useDispatch } from "react-redux";
import { updateAdminList } from "../../store/slices/adminListSlice";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";

const permissionWrapper = {
  isSuperAdmin: "Is Super Admin",
  canAddBalance: "Can Add Balance",
  canDoPnrManagement: "Can Do PNR Management",
  canModifyBooking: "Can Modify Booking",
  canCancelBooking: "Can Cancel Booking",
  canCreateSuperAgent: "Can Create Admin",
  canCreateSubAgent: "Can Create Agent",
  canDeactivateSuperAgent: "Can Deactivate Admin",
  canDeactivateSubAgent: "Can Deactivate Agent",
  canDeactivateAgentBookingReport: "Can View Agent Booking Report",
  canDeactivateAgentLedgerReport: "Can View Agent Ledger Report",
  canResetSuperAgentPassword: "Can Reset Admin Password",
  canResetSubAgentPassword: "Can Reset Agent Password",
  canActivateAgentBannerPromotion: "Can Activate Agent Banner Promotion",
};

const EditAdminModal = ({ open, onClose, selectedAdminDetails }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [permissions, setPermissions] = useState({});
  const [showInputErrors, setShowInputErrors] = useState(false);

  const dispatch = useDispatch();
  const loggedInUserDetails = useSelector(
    (state) => state.loggedInUserDetails.loggedInUserDetails
  );
  const adminList = useSelector((state) => state.adminList.adminList);

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedAdminDetails) {
      setName(selectedAdminDetails.name || "");
      setEmail(selectedAdminDetails.email || "");
      setPhoneNumber(selectedAdminDetails.phone || "");
      setPassword(selectedAdminDetails.password || "");
      setPermissions({
        isSuperAdmin: selectedAdminDetails.isSuperAdmin || 0,
        canAddBalance: selectedAdminDetails.canAddBalance || 0,
        canDoPnrManagement: selectedAdminDetails.canDoPnrManagement || 0,
        canModifyBooking: selectedAdminDetails.canModifyBooking || 0,
        canCancelBooking: selectedAdminDetails.canCancelBooking || 0,
        canCreateSuperAgent: selectedAdminDetails.canCreateSuperAgent || 0,
        canCreateSubAgent: selectedAdminDetails.canCreateSubAgent || 0,
        canDeactivateSuperAgent:
          selectedAdminDetails.canDeactivateSuperAgent || 0,
        canDeactivateSubAgent: selectedAdminDetails.canDeactivateSubAgent || 0,
        canDeactivateAgentBookingReport:
          selectedAdminDetails.canDeactivateAgentBookingReport || 0,
        canDeactivateAgentLedgerReport:
          selectedAdminDetails.canDeactivateAgentLedgerReport || 0,
        canResetSuperAgentPassword:
          selectedAdminDetails.canResetSuperAgentPassword || 0,
        canResetSubAgentPassword:
          selectedAdminDetails.canResetSubAgentPassword || 0,
        canActivateAgentBannerPromotion:
          selectedAdminDetails.canActivateAgentBannerPromotion || 0,
      });
    }
  }, [selectedAdminDetails]);

  useEffect(() => {
    if (!adminList) {
      fetchAdminList();
    }
  }, [adminList]);

  const handleToggleChange = (event, permission) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [permission]: event.target.checked ? 1 : 0,
    }));
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

  const handleEditAdmin = () => {
    if (
      !String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) ||
      phoneNumber?.length !== 10
    ) {
      setShowInputErrors(true);
    } else {
      const reqBody = {
        ...selectedAdminDetails,
        name: name,
        password: password,
        email: email,
        phone: phoneNumber,
        ...permissions,
      };
      axios
        .post(
          `http://stg-api.aeroprime.in/crm-service/admin/addUpdate`,
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
            fetchAdminList();
            onClose();
            navigate("/admins");
          }
        })
        .catch((error) => {
          console.error("Error updating admin:", error);
          if (error.response && error.response.status === 401) {
            localStorage.clear();
            window.location.href = "/";
          }
        });
    }
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
          <DialogTitle className="Add-heading">EDIT ADMIN</DialogTitle>
          <div className="Close-btn" onClick={onClose}>
            {" "}
            <CancelSharpIcon fontSize="large" />{" "}
          </div>
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
                      disabled
                    ></input>
                  </FormControl>
                </div>
              </div>
              <div className="add-agent-section">
                <div className="phone-wrapper">
                  <FormControl fullWidth>
                    <input
                      type="number"
                      className="Input"
                      placeholder="Phone Number"
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
                      disabled={
                        loggedInUserDetails?.role === "admin" &&
                        loggedInUserDetails?.can_reset_super_agent_password !==
                        1
                      }
                    ></input>
                  </FormControl>
                </div>
              </div>
              <div className="add-agent-section-permissions-wrapper2">
                <div className="permissions-container">
                  {permissions &&
                    Object.keys(permissions)?.map((permission, index) => {
                      if (index <= Object.keys(permissions)?.length / 2) {
                        return (
                          <div key={index + permission}>
                            <span className="switch-container">
                              <Switch
                                checked={permissions[permission] === 1}
                                onChange={(event) =>
                                  handleToggleChange(event, permission)
                                }
                                inputProps={{ "aria-label": "controlled" }}
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
                                checked={permissions[permission] === 1}
                                onChange={(event) =>
                                  handleToggleChange(event, permission)
                                }
                                inputProps={{ "aria-label": "controlled" }}
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
            </div>
          </DialogContent>
        </div>

        <div className="Add-admin-btn-wrapper">
          <DialogActions>
            <button
              className="Add-admin-btn"
              variant="contained"
              onClick={handleEditAdmin}
              disabled={!name || !email || !phoneNumber || !password}
            >
              UPDATE
            </button>
          </DialogActions>
        </div>
      </div>
    </Dialog>
  );
};

export default EditAdminModal;
