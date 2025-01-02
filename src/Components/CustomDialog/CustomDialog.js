import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Backdrop } from '@mui/material';
import { styled } from '@mui/system';



const StyledDialog = styled(Dialog)({
  '& .MuiPaper-root': {
    borderRadius: '10px',
    padding: '20px',
    maxWidth: '400px',
  },
});

const StyledDialogTitle = styled(DialogTitle)({
  textAlign: 'center',
  fontSize: '1.5rem',
  fontWeight: 'bold',
});

const StyledDialogContentText = styled(DialogContentText)({
  textAlign: 'center',
  margin: '15px 0',
  fontSize: '1rem',
});

const CancelButton = styled(Button)({
  color: '#fff',
  backgroundColor: '#D3D3D3',
  '&:hover': {
    backgroundColor: '#c0c0c0',
  },
});

const DeleteButton = styled(Button)({
  color: '#fff',
  backgroundColor: '#FF5C5C',
  '&:hover': {
    backgroundColor: '#ff4d4d',
  },
});



const CustomDialog = ({ open, onClose, onConfirm, loggedInUserDetails, selectedUserInfo }) => {

  return (

    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      BackdropProps={{
        style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }, // Adjust the opacity here
      }}

    >
      <StyledDialogTitle id="alert-dialog-title">Are you sure?</StyledDialogTitle>
      <DialogContent>
        <StyledDialogContentText id="alert-dialog-description">
          {loggedInUserDetails?.role === "admin" && selectedUserInfo?.active ? (
            "Do you really want to disable this user? Disabled Admin cannot make transactions."
          ) : loggedInUserDetails?.role === "agent" && selectedUserInfo?.isActive ? (
            "Do you want to disable this user? Disabled Agent cannot make transactions."
          ) : loggedInUserDetails?.role === "agent" && !selectedUserInfo?.isActive ? (
            "Do you want to enable this user? Enabled Agent can make transactions."
          ) : (
            "Do you really want to enable this user? Enabled Admin can make transactions."
          )}
        </StyledDialogContentText>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'center' }}>
        <CancelButton onClick={onClose}>Cancel</CancelButton>
        <DeleteButton onClick={onConfirm} autoFocus>
          Confirm
        </DeleteButton>
      </DialogActions>
    </StyledDialog>

  );
};

export default CustomDialog;
