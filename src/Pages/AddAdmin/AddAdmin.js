import React, { useEffect, useState } from "react";
import "./AddAdmin.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FormControl from "@mui/material/FormControl";
import Switch from "@mui/material/Switch";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch } from "react-redux";
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

const AddAdmin = ({ open, onClose }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [permissions, setPermissions] = useState({});
    const [showInputErrors, setShowInputErrors] = useState(false);
    const [existingEmails, setExistingEmails] = useState(null);
    const [emailError, setEmailError] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        fetchSystemEmails();
        setPermissions({
            isSuperAdmin: 1,
            canAddBalance: 1,
            canDoPnrManagement: 1,
            canModifyBooking: 1,
            canCancelBooking: 1,
            canCreateSuperAgent: 1,
            canCreateSubAgent: 1,
            canDeactivateSuperAgent: 1,
            canDeactivateSubAgent: 1,
            canDeactivateAgentBookingReport: 1,
            canDeactivateAgentLedgerReport: 1,
            canResetSuperAgentPassword: 1,
            canResetSubAgentPassword: 1,
            canActivateAgentBannerPromotion: 1,
        });
    }, []);

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

    const handleToggleChange = (event, permission) => {
        let permissionsObj = JSON.parse(JSON.stringify(permissions));
        permissions[permission] === 0
            ? (permissionsObj[permission] = 1)
            : (permissionsObj[permission] = 0);
        setPermissions(JSON.parse(JSON.stringify(permissionsObj)));
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

    const handleAddAdmin = () => {
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
            const reqBody = {
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
                    }
                })
                .catch((error) => {
                    if (error.response.status === 401) {
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
                    <DialogTitle className="Add-heading">ADD ADMIN</DialogTitle>
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
                            <div className="add-agent-section-permissions-wrapper2">
                                <div className="permissions-container">
                                    {permissions &&
                                        Object.keys(permissions)?.map((permission, index) => {
                                            if (index <= Object.keys(permissions)?.length / 2) {
                                                return (
                                                    <div key={index + permission}>
                                                        <span className="switch-container">
                                                            <Switch
                                                                checked={
                                                                    permissions[permission] === 1 ? true : false
                                                                }
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
                                                                checked={
                                                                    permissions[permission] === 1 ? true : false
                                                                }
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
                            {emailError && (
                                <div style={{ margin: "20px" }}>
                                    Email already exists in system.
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </div>
                <div className="Add-admin-btn-wrapper">
                    <DialogActions>
                        <button
                            className="Add-admin-btn"
                            variant="contained"
                            onClick={handleAddAdmin}
                            disabled={!name || !email || !phoneNumber || !password}
                        >
                            ADD ADMIN
                        </button>
                    </DialogActions>
                </div>
            </div>
        </Dialog>
    );
};

export default AddAdmin;
