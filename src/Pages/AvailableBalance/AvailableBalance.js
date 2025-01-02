import React, { useEffect, useState } from "react";
import "./AvailableBalance.css";

import axios from "axios";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

import { useSelector } from "react-redux";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#334555",
        color: theme.palette.common.white,
        fontWeight: 500,
    },
    // [`&.${tableCellClasses.body}`]: {
    //   fontSize: 14,
    // },
}));

const AvailableBalanceScreen = () => {
    const [currentUserAirlines, setCurrentUserAirlines] = useState(null);

    const loggedInUserDetails = useSelector(
        (state) => state.loggedInUserDetails.loggedInUserDetails
    );

    useEffect(() => {
        if (
            loggedInUserDetails?.role !== "admin" &&
            loggedInUserDetails?.clientId
        ) {
            fetchCurrentUserAirlines();
        }
    }, [loggedInUserDetails]);

    const fetchCurrentUserAirlines = () => {
        const headers = {
            "Content-Type": " application/json",
            Authorization: localStorage.getItem("AuthToken"),
        };
        axios
            .get(
                `http://stg-api.aeroprime.in/crm-service/admin/getAirlineDetails/${loggedInUserDetails?.clientId}`,
                { headers }
            )
            .then((response) => {
                if (response.status === 200) {
                    setCurrentUserAirlines(response.data);
                }
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    localStorage.clear();
                    window.location.href = "/";
                }
            });
    };

    function createAirlineBalanceData(
        airlineCode,
        balance,
        creditLimit,
        operatingAirlineCurrency
    ) {
        return { airlineCode, balance, creditLimit, operatingAirlineCurrency };
    }

    const airlineBalanceRows = currentUserAirlines?.map((airline) => {
        return createAirlineBalanceData(
            airline.airlineCode,
            airline.balance,
            airline.creditLimit,
            airline.operatingAirlineCurrency
        );
    });

    return (
        <div className="available-balance-wrapper">
            <div className="Current-Balance-heading">CURRENT BALANCE</div>
            <div className="Break-line"></div>
            <div className="airline-balance-table-wrapper">
                <div className="airline-balance-table">
                    <TableContainer component={Paper} sx={{ borderRadius: '20px', overflow: 'hidden' }}>
                        <Table sx={{ minWidth: 350 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>S.No.</StyledTableCell>
                                    <StyledTableCell align="left">Airline</StyledTableCell>
                                    <StyledTableCell align="left">Balance</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {airlineBalanceRows?.map((row, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="left">{row.airlineCode}</TableCell>
                                        <TableCell align="left">
                                            {`${row.operatingAirlineCurrency} ${Math.round(
                                                (Number(row.balance) + Number(row.creditLimit)) * 100
                                            ) / 100
                                                }`}{" "}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
};

export default AvailableBalanceScreen;
