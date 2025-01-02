import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
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

const isDeletePopUpOpen = ({ open, onClose, deleteAdminId, onConfirm, loggedInUserDetails }) => {



    // const deleteSuperAgent = (id) => {
    //     const headers = {
    //         "Content-Type": " application/json",
    //         Authorization: localStorage.getItem("AuthToken"),
    //     };
    //     axios
    //         .post(
    //             "http://stg-api.aeroprime.in/crm-service/agent/deleteSuperAgent",
    //             { clientId: id },
    //             { headers }
    //         )
    //         .then((response) => {
    //             if (response.data.success === true) {
    //                 loggedInUserDetails?.role === "admin"
    //                     ? fetchAgentsListForAdmin()
    //                     : fetchAgentsListForAgent();
    //             }
    //         })
    //         .catch((error) => {
    //             if (error.response.status === 401) {
    //                 localStorage.clear();
    //                 window.location.href = "/";
    //             }
    //         });
    //     console.log("delete superagent", id)
    // };

    return (
        <StyledDialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <StyledDialogTitle id="alert-dialog-title">Are you sure?</StyledDialogTitle>
            <DialogContent>
                <StyledDialogContentText id="alert-dialog-description">

                    {`${(loggedInUserDetails?.role === "admin") ||

                        "Do you really want to disable this user? Delete Admin cannot make transactions."
                        }`}
                </StyledDialogContentText>
            </DialogContent>
            <DialogActions style={{ justifyContent: 'center' }}>
                <CancelButton onClick={onClose}>Cancel</CancelButton>
                <DeleteButton onClick={() => onConfirm()}>
                    Confirm
                </DeleteButton>
            </DialogActions>
        </StyledDialog>
    );
};

export default isDeletePopUpOpen;
