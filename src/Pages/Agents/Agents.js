import React, { useState, useEffect, useCallback } from "react";
import "./Agents.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateAgentList } from "../../store/slices/agentListSlice";
import axios from "axios";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditAgent from "../EditAgent/EditAgent";
import AddAgent from "../AddAgent/AddAgent";
import DeletePopUp from "../../Components/DeletePopUp/DeletePopUp";
import DeleteSubPopUp from "../../Components/DeletePopUp/DeleteSubPopUp";
import AdjustMarkup from "../AdjustMarkup/AdjustMarkup";
import ManageAirlinesScreen from "../ManageAirlines/ManageAirlines";
import CustomDialog from "../../Components/CustomDialog/CustomDialog";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#334555",
    color: theme.palette.common.white,
    fontWeight: 500,
  },
}));

function createDataForAdmin(
  name,
  email,
  role,
  clientName,
  active,
  balance,
  markup,
  clientId,
  creditLimit,
  totalAvailableCredits,
  currencySymbol,
  currencyCode
) {
  const roleMapper = {
    super_admin: "Super Admin",
    admin: "Admin",
    agent: "Agent",
  };
  let roleDisplay = roleMapper[role];
  return {
    name,
    email,
    roleDisplay,
    clientName,
    active,
    balance,
    markup,
    clientId,
    creditLimit,
    totalAvailableCredits,
    currencySymbol,
    currencyCode,
  };
}

function createDataForAgent(
  name,
  email,
  clientId,
  phone,
  id,
  isActive,
  password,
  canActivateSubAgentBannerPromotion,
  canCreateBooking,
  canCreateSubAgent,
  canDeactivateSubAgent,
  canDoBannerPromotion,
  canDoPnrManagement,
  canResetSubAgentPassword,
  canViewBookingOfAllSubAgent,
  canViewMisReport,
  canViewTopUpReport,
  isSuperAgent,
  isMasterAgent
) {
  return {
    name,
    email,
    clientId,
    phone,
    id,
    isActive,
    password,
    canActivateSubAgentBannerPromotion,
    canCreateBooking,
    canCreateSubAgent,
    canDeactivateSubAgent,
    canDoBannerPromotion,
    canDoPnrManagement,
    canResetSubAgentPassword,
    canViewBookingOfAllSubAgent,
    canViewMisReport,
    canViewTopUpReport,
    isSuperAgent,
    isMasterAgent,
  };
}

const AgentsScreen = () => {
  const [visibleRowId, setVisibleRowId] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);
  const [selectedAgentDetails, setSelectedAgentDetails] = useState(null);
  const [balance, setBalance] = useState(null);
  const [airlineCodes, setAirlineCodes] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isAddAgentOpen, setIsAddAgentOpen] = useState(false);
  const [isEditAgentOpen, setIsEditAgentOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleteOpenSub, setIsDeleteOpenSub] = useState(false);
  const [selectedSubClientId, setSelectedSubClientId] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [adjustMarkupOpen, setAdjustMarkupOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [manageAirlinesOpen, setManageAirlinesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [airlineCode, setAirlineCode] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loggedInUserDetails = useSelector(
    (state) => state.loggedInUserDetails.loggedInUserDetails
  );

  useEffect(() => {
    if (loggedInUserDetails) {
      setAirlineCode(loggedInUserDetails?.airlineCodes);
    }
  }, [loggedInUserDetails]);
  const agentList = useSelector((state) => state.agentList.agentList);

  useEffect(() => {
    if (loggedInUserDetails && !agentList) {
      loggedInUserDetails?.role === "admin"
        ? fetchAgentsListForAdmin()
        : fetchAgentsListForAgent();
    }
  }, [loggedInUserDetails, agentList]);

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

  const agentListForAdminRows = agentList?.map((user) => {
    return createDataForAdmin(
      user.name,
      user.email,
      user.role,
      user.clientName ?? "-",
      user.active,
      user.balance ?? "Not Available",
      user.markup ?? "Not Available",
      user.clientId,
      user.creditLimit ?? "Not Available",
      user.totalAvailableCredits,
      user.currencySymbol,
      user.currencyCode
    );
  });

  const agentListForAgentRows = agentList?.map((user) => {
    return createDataForAgent(
      user.name,
      user.email,
      user.clientId,
      user.phone,
      user.id,
      user.isActive,
      user.password,
      user.canActivateSubAgentBannerPromotion,
      user.canCreateBooking,
      user.canCreateSubAgent,
      user.canDeactivateSubAgent,
      user.canDoBannerPromotion,
      user.canDoPnrManagement,
      user.canResetSubAgentPassword,
      user.canViewBookingOfAllSubAgent,
      user.canViewMisReport,
      user.canViewTopUpReport,
      user.isSuperAgent,
      user.isMasterAgent
    );
  });

  const handleDisableUser = () => {
    if (loggedInUserDetails?.role === "admin") {
      handleDisableAgentForAdminLogin();
      setSelectedUserInfo({
        ...selectedUserInfo,
        active: !selectedUserInfo.active, // Toggle the active status
      });
    } else {
      handleEditAgentForAgentLogin();
      setSelectedUserInfo({
        ...selectedUserInfo,
        active: !selectedUserInfo.isActive, // Toggle the active status
      });
    }
   
  };

  const handleDisableAgentForAdminLogin = () => {
    const headers = {
      "Content-Type": " application/json",
      Authorization: localStorage.getItem("AuthToken"),
    };
    axios
      .post(
        `http://stg-api.aeroprime.in/crm-service/user/disableAgent?agentEmailId=${selectedUserInfo.email}`,
        {
          active: !selectedUserInfo.active,
        },
        { headers }
      )
      .then((response) => {
        dispatch(updateAgentList(response.data));
        handleClose();
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  const handleEditAgentForAgentLogin = () => {
    const reqBody = {
      ...selectedUserInfo,
      isActive: selectedUserInfo?.isActive === 1 ? 0 : 1,
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
          fetchAgentsListForAgent();
          handleClose();
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  const handleClickOpen = (user) => {
    setSelectedUserInfo(user);
    setShowDialog(true);


  };

  const handleClose = () => {
    setSelectedUserInfo(null);
    setShowDialog(false);

  };

  function createAirlineBalanceData(
    airlineCode,
    balance,
    walletCurrency
  ) {
    return { airlineCode, balance, walletCurrency};
  }

  const handleEditAgentOpen = useCallback((id) => {
    console.log("byee", id)
    setSelectedAgentId(id);
    setIsEditAgentOpen(true);
  }, []);

  const handleEditAgentClose = () => {
    console.log("aa", isEditAgentOpen)
    setIsEditAgentOpen(false);
    setSelectedAgentId(null);
  };

  const handleDeleteConfirm = () => {
    const headers = {
      "Content-Type": " application/json",
      Authorization: localStorage.getItem("AuthToken"),
    };
    axios
      .post(
        "http://stg-api.aeroprime.in/crm-service/agent/deleteSuperAgent",
        { clientId: selectedClientId },
        { headers }
      )
      .then((response) => {
        if (response.data.success === true) {
          loggedInUserDetails?.role === "admin"
            ? fetchAgentsListForAdmin()
            : fetchAgentsListForAgent();
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          console.log("error 401");
        }
      })
      .finally(() => {
        handleDeleteClose();
      });
  };

  const handleDeleteOpen = (clientId) => {
    setSelectedClientId(clientId);
    setIsDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
    setSelectedClientId(null);
  };

  const handleDeleteSubOpen = (id) => {
    setSelectedSubClientId(id);
    setIsDeleteOpenSub(true);
  };

  const handleDeleteSubClose = () => {
    setIsDeleteOpenSub(false);
    setSelectedSubClientId(null);
  };

  const handleDeleteSubConfirm = () => {
    const headers = {
      "Content-Type": " application/json",
      Authorization: localStorage.getItem("AuthToken"),
    };
    axios
      .post(
        "http://stg-api.aeroprime.in/crm-service/agent/delete",
        { id: selectedSubClientId },
        { headers }
      )
      .then((response) => {
        if (response.data.success === true) {
          loggedInUserDetails?.role === "admin"
            ? fetchAgentsListForAdmin()
            : fetchAgentsListForAgent();
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          console.log("error 401");
        }
      })
      .finally(() => {
        handleDeleteSubClose();
      });
  };

  const handleIsAddAgentOpen = () => {
    setIsAddAgentOpen(true);
  };

  const handleIsAddAgentClose = () => {
    setIsAddAgentOpen(false);
  };

  const handleOpenAdjustMarkup = (row) => {
    setSelectedAgent(row);
    setAdjustMarkupOpen(true);
  };

  const handleCloseAdjustMarkup = () => {
    setAdjustMarkupOpen(false);
    setSelectedAgent(null);
  };

  const handleOpenManageAirlines = (agent) => {
    setSelectedAgent(agent);
    setAirlineCodes(loggedInUserDetails?.airlineCodes);
    setManageAirlinesOpen(true);
  };

  const handleCloseManageAirlines = () => {
    setManageAirlinesOpen(false);
    setSelectedAgent(null);
  };

  const handleButtonClick = (clientId) => {
    if (visibleRowId === clientId) {
      setVisibleRowId(null);
    } else {
      fetchCurrentUserAirlines(clientId);
      setVisibleRowId(clientId);
    }
  };

  const handleButtonClickSubAgent = (clientId, id) => {
    if (visibleRowId === id) {
      setVisibleRowId(null);
    } else {
      fetchCurrentUserAirlines(clientId);
      setVisibleRowId(id);
    }
  };

  const fetchCurrentUserAirlines = (clientId) => {
    const headers = {
      "Content-Type": " application/json",
      Authorization: localStorage.getItem("AuthToken"),
    };
    axios
      .get(
        `http://stg-api.aeroprime.in/crm-service/admin/getAirlineDetails/${clientId}`,
        { headers }
      )
      .then((response) => {
        if (response.status === 200) {
          const airlineDetails = response.data;

          const codes = airlineDetails.map((item) => item.airlineCode);
          const balances = airlineDetails.map((item) => ({
            airlineCode: item.airlineCode,
            balance: item.balance,
            currency: item.walletCurrency
          }));

          setAirlineCodes(codes);
          setBalance(balances);
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          console.log("error 401");
        }
      });
  };

  const filteredAgents = agentListForAdminRows?.filter((row) =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  if (loggedInUserDetails?.role === "admin") {
    return (
      <div className="users-wrapper">
        <div>

          <CustomDialog
            open={showDialog}
            onClose={handleClose}
            onConfirm={handleDisableUser}
            loggedInUserDetails={{ role: "admin" }}
            selectedUserInfo={selectedUserInfo}

          />

          {isEditAgentOpen && (
            <EditAgent
              open={isEditAgentOpen}
              onClose={handleEditAgentClose}
              agentId={selectedAgentId}
            />
          )}

          {isDeleteOpen && (
            <DeletePopUp
              open={isDeleteOpen}
              onClose={handleDeleteClose}
              onConfirm={handleDeleteConfirm}
              clientId={selectedClientId}
            />
          )}
          {adjustMarkupOpen && (
            <AdjustMarkup
              open={adjustMarkupOpen}
              onClose={handleCloseAdjustMarkup}
              rowData={selectedAgent}
            />
          )}
          {manageAirlinesOpen && (
            <ManageAirlinesScreen
              open={manageAirlinesOpen}
              onClose={handleCloseManageAirlines}
              agentDetails={selectedAgent}
            />
          )}
        </div>
        <div className="head-btn-wrapper">
          <div className="Agent-heading">AGENTS</div>

          <div className="register-btn-wrapper">
            <Button
              variant="contained"
              onClick={() => handleIsAddAgentOpen()}
              disabled={
                (loggedInUserDetails?.role !== "admin" &&
                  loggedInUserDetails?.can_create_sub_agent !== 1) ||
                (loggedInUserDetails?.role === "admin" &&
                  loggedInUserDetails?.can_create_sub_agent !== 1)
              }
            >
              Add Agent
            </Button>
            {isAddAgentOpen && (
              <AddAgent open={isAddAgentOpen} onClose={handleIsAddAgentClose} />
            )}
          </div>
        </div>
        <div className="Break-line"></div>
        <div className="search-wrapper">
          <SearchIcon className="search-icon" />
          <input
            className="Admin-Search-btn"
            type="text"
            placeholder="Search by Agent Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          {/* <Dialog
            open={showDialog}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {`${(loggedInUserDetails?.role === "admin" &&
                  selectedUserInfo?.active) ||
                  selectedUserInfo?.isActive
                  ? "Do you want to disable this user? Disabled Agent cannot make transactions"
                  : "Do you want to enable this user? Enabled Agent can make transactions"
                  }`}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Disagree</Button>
              <Button onClick={handleDisableUser} autoFocus>
                Agree
              </Button>
            </DialogActions>
          </Dialog> */}
          <TableContainer
            component={Paper}
            style={{ borderRadius: "10px", overflow: "auto" }}
          >
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Name</StyledTableCell>
                  <StyledTableCell align="center">Email</StyledTableCell>
                  <StyledTableCell align="center">Agent Name</StyledTableCell>
                  <StyledTableCell align="center">
                    Enable/Disable Agent
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{width : "32%"}}>Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAgents?.map((row) => {
                  if (row.name !== "Admin") {
                    return (
                      <React.Fragment key={row.clientId}>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row"  align="center">
                            {row.name}
                          </TableCell>
                          <TableCell align="center">{row.email}</TableCell>
                          <TableCell align="center">{row.clientName}</TableCell>
                          <TableCell align="center">
                            <FormControlLabel
                              control={
                                <Switch
                                  defaultChecked={row.active}
                                  disabled={
                                    loggedInUserDetails?.can_deactivate_sub_agent !==
                                    1
                                  }
                                  checked={row.active}
                                  onChange={() => handleClickOpen(row)}
                                />
                              }
                            />

                          </TableCell>
                          <TableCell>
                            <div className="edit-delete-wrapper">
                              <IconButton
                                aria-label="edit-agent"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditAgentOpen(row.clientId);
                                }}
                                disabled={
                                  loggedInUserDetails?.can_create_sub_agent !==
                                  1
                                }
                              >
                                <EditIcon />
                              </IconButton>


                              {/* <Dialog
                                open={isEditAgentOpen}
                                onClose={handleEditAgentClose}
                                BackdropProps={{
                                  style: {
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                  },
                                }}
                              ></Dialog> */}


                              <IconButton
                                aria-label="delete-agent"
                                color="primary"
                                onClick={() => {
                                  handleDeleteOpen(row.clientId);
                                }}
                                disabled={
                                  loggedInUserDetails?.can_create_sub_agent !==
                                  1
                                }
                              >
                                <DeleteIcon />
                              </IconButton>

                            </div>
                            <div className="actions-wrapper">

                              <Button
                                variant="contained"
                                size="small"
                                className="update-balance-btn"
                                onClick={() =>
                                  navigate("/addBalance", {
                                    state: { agentDetails: row },
                                  })
                                }
                                disabled={
                                  loggedInUserDetails?.can_add_balance !== 1
                                }
                              >
                                Update Balance
                              </Button>
                              <Button
                                variant="contained"
                                size="small"
                                className="deduct-balance-btn"
                                onClick={() =>
                                  navigate("/deductBalance", {
                                    state: { agentDetails: row },
                                  })
                                }
                                disabled={
                                  loggedInUserDetails?.can_add_balance !== 1
                                }
                              >
                                Deduct Balance
                              </Button>
                              <Button
                                variant="contained"
                                size="small"
                                className="adjust-markup-btn"
                                onClick={() => handleOpenAdjustMarkup(row)}
                                disabled={
                                  loggedInUserDetails?.can_add_balance !== 1
                                }
                              >
                                Adjust Markup
                              </Button>


                              <Button
                                variant="contained"
                                className="adjust-credit-btn"
                                onClick={() => handleOpenManageAirlines(row)}
                              >
                                Manage Airlines
                              </Button>

                            </div>
                            <div>
                              <Button
                                onClick={() => handleButtonClick(row.clientId)}
                                startIcon={
                                  visibleRowId === row.clientId ? (
                                    <ExpandLessIcon />
                                  ) : (
                                    <ExpandMoreIcon />
                                  )
                                }
                              >
                                {visibleRowId === row.clientId
                                  ? "Hide Wallet Balance"
                                  : "Show Wallet Balance"}
                              </Button>
                              {visibleRowId === row.clientId && (
                                <TableContainer component={Paper} style={{ borderRadius: "10px", overflow: "hidden" }}>
                                  <Table
                                    sx={{ tableLayout: "auto", width: "100%", overflow: "auto" }}
                                    aria-label="simple table"
                                  >
                                    <TableHead>
                                      <TableRow>
                                        <StyledTableCell>S.No.</StyledTableCell>
                                        <StyledTableCell align="left">
                                          Airline
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          Balance
                                        </StyledTableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {balance?.map((balanceRow, index) => (
                                        <TableRow
                                          key={index}
                                          sx={{
                                            "&:last-child td, &:last-child th":
                                              { border: 0 },
                                          }}
                                        >
                                          <TableCell component="th" scope="row">
                                            {index + 1}
                                          </TableCell>
                                          <TableCell align="left">
                                            {balanceRow.airlineCode}
                                          </TableCell>
                                          <TableCell align="left">
                                            {`${balanceRow.currency} ${balanceRow.balance}`}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  }
                  return null;
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    );
  }
  
  return (
    <div className="users-wrapper">
      <div>
        <CustomDialog
          open={showDialog}
          onClose={handleClose}
          onConfirm={handleDisableUser}
          loggedInUserDetails={{ role: "agent" }}
          selectedUserInfo={selectedUserInfo}
        />
        {isEditAgentOpen && (
          <EditAgent
            open={isEditAgentOpen}
            onClose={handleEditAgentClose}
            agentId={selectedAgentId}

          />
        )}
        {isDeleteOpenSub && (
          <DeleteSubPopUp
            open={isDeleteOpenSub}
            onClose={handleDeleteSubClose}
            onConfirm={handleDeleteSubConfirm}
          />
        )}
        {isDeleteOpenSub && (
          <DeleteSubPopUp
            open={isDeleteOpenSub}
            onClose={handleDeleteSubClose}
            onConfirm={handleDeleteSubConfirm}
          />
        )}
      </div>
      <div className="head-btn-wrapper">
        <div className="Agent-heading">AGENTS LIST</div>
        <div className="register-btn-wrapper">
          <Button
            variant="contained"
            onClick={() => handleIsAddAgentOpen()}
            disabled={loggedInUserDetails?.can_create_sub_agent !== 1}
          >
            Add Agent
          </Button>
          {isAddAgentOpen && (
            <AddAgent open={isAddAgentOpen} onClose={handleIsAddAgentClose} />
          )}
        </div>
      </div>
      <div className="Break-line-agent"></div>
      <div className="sub-Agent-heading">SUPER AGENTS</div>

      <div>
        <TableContainer
          component={Paper}
          style={{ borderRadius: "10px", overflow: "hidden" }}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell align="left">Email</StyledTableCell>
                <StyledTableCell align="left">Phone Number</StyledTableCell>
                <StyledTableCell align="left">
                  Enable/Disable Agent
                </StyledTableCell>
                <StyledTableCell align="left">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agentListForAgentRows?.map((row) => {
                if (row.isSuperAgent === 1) {
                  // console.log(row.name);
                  return (
                    <TableRow
                      key={row.name}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                      <TableCell align="left">{row.phone}</TableCell>
                      <TableCell align="center">
                        {loggedInUserDetails.emailId !== row.email && (
                          <FormControlLabel
                            control={
                              <Switch
                                defaultChecked={row.isActive}
                                disabled={
                                  loggedInUserDetails?.can_deactivate_sub_agent !==
                                  1
                                }
                                checked={row.isActive}
                                onChange={(e) => handleClickOpen(row)}
                              />
                            }
                          />

                        )}

                      </TableCell>
                      <TableCell align="left">
                        {loggedInUserDetails.emailId !== row.email &&
                          row.isMasterAgent !== 1 && (
                            <IconButton
                              aria-label="edit-agent"
                              color="primary"
                              onClick={() => handleEditAgentOpen(row.id)}
                              disabled={
                                loggedInUserDetails?.can_create_sub_agent !== 1
                              }
                            >
                              <EditIcon />

                            </IconButton>
                          )}
                        {loggedInUserDetails.emailId !== row.email &&
                          row.isMasterAgent !== 1 && (
                            <IconButton
                              aria-label="delete-agent"
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSubOpen(row.id);
                              }}
                              disabled={
                                loggedInUserDetails?.can_create_sub_agent !== 1
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}

                        <div>
                          <Button
                            onClick={() => {
                              console.log("hiii", visibleRowId, row.id, row.clientId)
                              handleButtonClickSubAgent(row.clientId,  row.id)}
                             
                            }
                            startIcon={
                              visibleRowId === row.id ? (
                                <ExpandLessIcon />
                              ) : (
                                <ExpandMoreIcon />
                              )
                            }
                          >
                            {visibleRowId === row.id
                              ? "Hide Wallet Balance"
                              : "Show Wallet Balance"}
                          </Button>
                          {visibleRowId === row.id && (
                            
                            <TableContainer component={Paper}>
                              <Table
                                sx={{ minWidth: 350 }}
                                aria-label="simple table"
                              >
                                <TableHead>
                                  <TableRow>
                                    <StyledTableCell>S.No.</StyledTableCell>
                                    <StyledTableCell align="left">
                                      Airline
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                      Balance
                                    </StyledTableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {balance?.map((balanceRow, index) => (
                                    <TableRow
                                      key={index}
                                      sx={{
                                        "&:last-child td, &:last-child th": {
                                          border: 0,
                                        },
                                      }}
                                    >
                                      <TableCell component="th" scope="row">
                                        {index + 1}
                                      </TableCell>
                                      <TableCell align="left">
                                        {balanceRow.airlineCode}
                                      </TableCell>
                                      <TableCell align="left">
                                        {`${balanceRow.currency} ${balanceRow.balance}`}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="sub-Agent-heading">SUB AGENTS</div>

      <div>
        <TableContainer
          component={Paper}
          style={{ borderRadius: "10px", overflow: "hidden" }}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell align="left">Email</StyledTableCell>
                <StyledTableCell align="left">Phone Number</StyledTableCell>
                <StyledTableCell align="left">
                  Enable/Disable Agent
                </StyledTableCell>
                <StyledTableCell align="left">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agentListForAgentRows?.map((row) => {
                if (row.isSuperAgent !== 1) {
                  return (
                    <TableRow
                      key={row.name}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                      <TableCell align="left">{row.phone}</TableCell>

                      <TableCell align="center">
                        {loggedInUserDetails.emailId !== row.email && (
                          <FormControlLabel
                            control={
                              <Switch
                                defaultChecked={row.isActive}
                                disabled={
                                  loggedInUserDetails?.can_deactivate_sub_agent !==
                                  1
                                }
                                checked={row.isActive}
                                onChange={(e) => handleClickOpen(row)}
                              />
                            }
                          />
                        )}
                        {/* <CustomDialog
                          open={showDialog}
                          onClose={handleClose}
                          onConfirm={handleDisableUser}
                          loggedInUserDetails={{ role: "admin" }}
                          selectedUserInfo={selectedUserInfo}
                        /> */}
                      </TableCell>
                      <TableCell align="left">
                        {loggedInUserDetails.emailId !== row.email &&
                          row.isMasterAgent !== 1 && (
                            <IconButton
                              aria-label="edit-agent"
                              onClick={() =>
                                handleEditAgentOpen(row.id)

                              }
                              disabled={
                                loggedInUserDetails?.can_create_sub_agent !== 1
                              }
                            >
                              <EditIcon />
                              {/* {isEditAgentOpen && (
                                <EditAgent
                                  open={isEditAgentOpen}
                                  onClose={handleEditAgentClose}
                                  agentId={setSelectedAgentId}
                                />
                              )} */}
                            </IconButton>
                          )}
                        {loggedInUserDetails.emailId !== row.email &&
                          row.isMasterAgent !== 1 && (
                            <IconButton
                              aria-label="delete-agent"
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSubOpen(row.id);
                              }}
                              disabled={
                                loggedInUserDetails?.can_create_sub_agent !== 1
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}

                        {/* <div>
                          <Button
                            onClick={() => handleButtonClick(row.clientId)}
                            startIcon={
                              visibleRowId === row.clientId ? (
                                <ExpandLessIcon />
                              ) : (
                                <ExpandMoreIcon />
                              )
                            }
                          >
                            {visibleRowId === row.clientId
                              ? "Hide Wallet Balance"
                              : "Show Wallet Balance"}
                          </Button>
                          {visibleRowId === row.clientId && (
                            <TableContainer component={Paper}>
                              <Table
                                sx={{ minWidth: 350 }}
                                aria-label="simple table"
                              >
                                <TableHead>
                                  <TableRow>
                                    <StyledTableCell>S.No.</StyledTableCell>
                                    <StyledTableCell align="left">
                                      Airline
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                      Balance
                                    </StyledTableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {balance?.map((balanceRow, index) => (
                                    <TableRow
                                      key={index}
                                      sx={{
                                        "&:last-child td, &:last-child th": {
                                          border: 0,
                                        },
                                      }}
                                    >
                                      <TableCell component="th" scope="row">
                                        {index + 1}
                                      </TableCell>
                                      <TableCell align="left">
                                        {balanceRow.airlineCode}
                                      </TableCell>
                                      <TableCell align="left">
                                        {`${balanceRow.currency} ${balanceRow.balance}`}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          )}
                        </div> */}
                      </TableCell>
                    </TableRow>
                  );
                }
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {/* <Dialog
        open={showDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`${(loggedInUserDetails?.role === "admin" &&
              selectedUserInfo?.active) ||
              selectedUserInfo?.isActive
              ? "Do you want to disable this user? Disabled Agent cannot make transactions"
              : "Do you want to enable this user? Enabled Agent can make transactions"
              }`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleDisableUser} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog> */}
    </div >
  );

};

export default AgentsScreen;
