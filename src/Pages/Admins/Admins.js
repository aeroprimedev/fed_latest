import React, { useState, useEffect, useCallback } from "react";
import EditAdmin from "../EditAdmin/EditAdmin";
import "./Admins.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import CustomDialog from "../../Components/CustomDialog/CustomDialog";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import DeletePopUpAdmin from "../../Components/DeletePopUp/DeletePopUpAdmin";
import { updateAdminList } from "../../store/slices/adminListSlice";
import AddAdmin from "../AddAdmin/AddAdmin";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#334555",
    color: theme.palette.common.white,
    fontWeight: 500,
    paddingLeft: "50px",
    MarginBottom: "20px",
  },
}));

function createData(
  name,
  email,
  phone,
  id,
  isActive,
  isSuperAdmin,
  password,
  clientId,
  airlineCodes,
  airlineCurrencyCode,
  canActivateAgentBannerPromotion,
  canAddBalance,
  canCancelBooking,
  canCreateSubAgent,
  canCreateSuperAgent,
  canDeactivateAgentBookingReport,
  canDeactivateAgentLedgerReport,
  canDeactivateSubAgent,
  canDeactivateSuperAgent,
  canDoPnrManagement,
  canModifyBooking,
  canResetSubAgentPassword,
  canResetSuperAgentPassword
) {
  return {
    name,
    email,
    phone,
    id,
    isActive,
    isSuperAdmin,
    password,
    clientId,
    airlineCodes,
    airlineCurrencyCode,
    canActivateAgentBannerPromotion,
    canAddBalance,
    canCancelBooking,
    canCreateSubAgent,
    canCreateSuperAgent,
    canDeactivateAgentBookingReport,
    canDeactivateAgentLedgerReport,
    canDeactivateSubAgent,
    canDeactivateSuperAgent,
    canDoPnrManagement,
    canModifyBooking,
    canResetSubAgentPassword,
    canResetSuperAgentPassword,
  };
}
const Admins = () => {
  const [selectedUserInfo, setSelectedUserInfo] = useState({});
  const [selectedAdminDetails, setSelectedAdminDetails] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteAdminId, setDeleteAdminId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const adminList = useSelector((state) => state.adminList.adminList);
  const loggedInUserDetails = useSelector(
    (state) => state.loggedInUserDetails.loggedInUserDetails
  );

  useEffect(() => {
    if (!adminList) {
      fetchAdminList();
    }
  }, [adminList]);

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

  const rows = adminList?.map((user) => {
    return createData(
      user.name,
      user.email,
      user.phone,
      user.id,
      user.isActive,
      user.isSuperAdmin,
      user.password,
      user.clientId,
      user.airlineCodes,
      user.airlineCurrencyCode,
      user.canActivateAgentBannerPromotion,
      user.canAddBalance,
      user.canCancelBooking,
      user.canCreateSubAgent,
      user.canCreateSuperAgent,
      user.canDeactivateAgentBookingReport,
      user.canDeactivateAgentLedgerReport,
      user.canDeactivateSubAgent,
      user.canDeactivateSuperAgent,
      user.canDoPnrManagement,
      user.canModifyBooking,
      user.canResetSubAgentPassword,
      user.canResetSuperAgentPassword
    );
  });

  const handleDisableAdmin = () => {
    const reqBody = {
      ...selectedUserInfo,
      isActive: selectedUserInfo?.isActive === 1 ? 0 : 1,
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
          handleCloseDialog();
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  };

  const handleOpenDialog = (user) => {
    setSelectedUserInfo(user);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedUserInfo(null);
    setShowDialog(false);
  };

  const handleOpenModal = useCallback(
    (id) => {
      const selectedAdmin = adminList.find((admin) => admin.id === id);

      if (!selectedAdmin) {
        return;
      }
      setSelectedAdminDetails(selectedAdmin);
      setIsModalOpen(true);
    },
    [adminList]
  );
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAdminDetails(null);
  };

  const handleIsAdminOpen = () => {
    setIsAdminOpen(true);
  };

  const handleIsAdminClose = () => {
    setIsAdminOpen(false);
  };

  const handleDeleteOpen = (adminId) => {
    console.log("id", adminId);
    setDeleteAdminId(adminId);

    setIsDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
    setDeleteAdminId(null);
  };

  // DO NOT DELETE THIS CODE
  const handleDeleteAdmin = () => {
    console.log("delete confirm agent id:", deleteAdminId);
    // const headersForUserAPI = {
    //   Authorization: localStorage.getItem("AuthToken"),
    // };
    // axios
    //   .post(
    //     "http://stg-api.aeroprime.in/crm-service/admin/delete",
    //     { id: deleteAdminId },
    //     {
    //       headers: headersForUserAPI,
    //     }
    //   )
    //   .then((response) => {
    //     if (response.data.success === true) {
    //       fetchAdminList();
    //     }
    //   })
    //   .catch((error) => {
    //     if (error.response.status === 401) {
    //       localStorage.clear();
    //       window.location.href = "/";
    //     }
    //   });
    handleDeleteClose();
  };
  const filteredRows = rows?.filter((row) =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="users-wrapper1">
      <div>
        {isModalOpen && (
          <EditAdmin
            open={isModalOpen}
            onClose={handleCloseModal}
            selectedAdminDetails={selectedAdminDetails}
          />
        )}
        {isDeleteOpen && (
          <DeletePopUpAdmin
            open={isDeleteOpen}
            onClose={handleDeleteClose}
            onConfirm={handleDeleteAdmin}
          />
        )}

      </div>
      <div>
        <CustomDialog
          open={showDialog}
          onClose={handleCloseDialog}
          onConfirm={handleDisableAdmin}
          loggedInUserDetails={{ role: "admin" }}
          selectedUserInfo={{ active: true }}
        />
      </div>
      <div className="head-btn-wrapper">
        <div className="Admin-Heading">ADMINS</div>
        <div className="register-btn-wrapper">
          <Button
            variant="contained"
            onClick={() => handleIsAdminOpen()}
            disabled={
              (loggedInUserDetails?.role === "admin" &&
                loggedInUserDetails?.can_create_super_agent !== 1) ||
              (loggedInUserDetails?.role !== "admin" &&
                loggedInUserDetails?.can_create_super_agent !== 1)
            }
          >
            Add Admin
          </Button>

          {isAdminOpen && (
            <AddAdmin open={isAdminOpen} onClose={handleIsAdminClose} />
          )}
        </div>
      </div>
      <div className="Break-line"></div>
      <div className="search-wrapper">
        <SearchIcon className="search-icon" />
        <input
          className="Admin-Search-btn"
          type="text"
          placeholder="Search by Admin Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div>
        <TableContainer
          component={Paper}
          style={{ borderRadius: "10px", overflow: "auto" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
              {filteredRows?.length > 0 &&
                filteredRows?.map((row) => {
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
                                  loggedInUserDetails?.can_deactivate_super_agent !==
                                  1
                                }
                                checked={row.isActive}
                                onChange={(e) => handleOpenDialog(row)}
                              />
                            }
                          />
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {loggedInUserDetails.emailId !== row.email && (
                          <IconButton
                            aria-label="edit-admin"
                            color="primary"
                            onClick={() => handleOpenModal(row.id)}
                            disabled={
                              (loggedInUserDetails?.role === "admin" &&
                                loggedInUserDetails?.can_create_super_agent !==
                                1) ||
                              (loggedInUserDetails?.role !== "admin" &&
                                loggedInUserDetails?.can_create_super_agent !==
                                1)
                            }
                          >
                            <EditIcon />
                          </IconButton>
                        )}


                        {loggedInUserDetails.emailId !== row.email && (
                          <IconButton
                            aria-label="delete-agent"
                            color="primary"
                            onClick={() => handleDeleteOpen(row.id)}
                            disabled={
                              (loggedInUserDetails?.role === "admin" &&
                                loggedInUserDetails?.can_create_super_agent !==
                                1) ||
                              (loggedInUserDetails?.role !== "admin" &&
                                loggedInUserDetails?.can_create_super_agent !==
                                1)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}

                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Admins;
