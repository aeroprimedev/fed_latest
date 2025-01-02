import React from 'react'
import './Confirmed.css'
import ProGroupHeader from '../../../Components/ProGroupHeader/ProGroupHeader';
import SearchIcon from "@mui/icons-material/Search";

const Confirmed = () => {
  return (
    <div>
    <div className='Progroup-Header'>
         <ProGroupHeader/>
        </div>
    <div className='Confirm-Wrapper'>
      
        <div className='Search-Id'>
        </div>
        <div className="Break-line"></div>
      <div className="search-wrapper">
        <SearchIcon className="search-icon" />
        <input
          className="Admin-Search-btn"
          type="text"
          placeholder="Search by Req. ID"
          // value={searchQuery}
          // onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="details-container">
                  {/* <div className={`confirm-text-${detail?.bookingStatus}`}>
                    {detail?.bookingStatus === "Pending" && (
                      <span>Pending</span>
                    )}
                    {detail?.bookingStatus === "Pending due to low balance" && (
                      <span>Pending due to low balance</span>
                    )}
                    {detail?.bookingStatus === "Cancelled" && (
                      <span>Cancelled</span>
                    )}
                    {detail?.bookingStatus === "UnKnown" && (
                      <span>UnKnown</span>
                    )}
                    {detail?.bookingStatus === "Confirmed" && (
                      <>
                        {detail?.isNewSystem === 1 && (
                          <span className="img-wrapper">
                            <button
                            className="download-btn"
                              variant="contained"
                              onClick={() =>
                                handleTicketDownload(detail?.referenceID)
                              }
                            >
                          <CloudDownloadIcon />
                            </button>
                          </span>
                        )} 
                        <span className="text">Confirmed</span>
                      </>
                     )} 
                  </div> */}
                  <div className="details-row">
                    <div className="detail">
                      Airline Code:{" "}
                      <span className="detail-data">
                        {/* {detail?.airlineCode} */}
                        </span>
                    </div>
                    <div className="detail">
                      Origin:{" "}
                      <span className="detail-data">
                        {/* {detail?.origin} */}
                        </span>
                    </div>
                    <div className="detail">
                      Destination:{" "}
                      <span className="detail-data">
                        {/* {detail?.destination} */}
                        </span>
                    </div>
                  </div>
                  <div className="details-row">
                    <div className="detail">
                      Trip Type:{" "}
                      <span className="detail-data">
                        {/* {detail?.tripType === "ONE_WAY" && "One Way"}
                        {detail?.tripType === "ROUND_TRIP" && "Round Trip"} */}
                      </span>
                    </div>
                    <div className="detail">
                      PNR No:{" "}
                      <span className="detail-data">
                        {/* {detail?.bookingID} */}
                        </span>
                    </div>
                    <div className="detail">
                      Reference Id:{" "}
                      <span className="detail-data">
                        {/* {detail?.referenceID} */}

                      </span>
                    </div>
                  </div>
                  <div className="details-row">
                    <div className="detail">
                      Amount:{" "}
                      <span className="detail-data">
                        {/* {`${usersCurrencyList?.[detail?.clientId]} ${detail?.amount
                          }`} */}
                      </span>
                    </div>
                    {/* {loggedInUserDetails?.role === "admin" && ( */}
                      <div className="detail">
                        Agent Name:
                        <span className="detail-data">
                          {/* {loggedInUserClients?.[detail?.clientId] || "Unknown"} */}
                        </span>
                      </div>
                    {/* )} */}
                    <div className="detail bookedOn">
                      Booked On:{" "}
                      <span className="detail-data">
                        {/* {detail?.bookedON} */}
                        </span>
                    </div>
                  </div>
                  <div className="btn-row">
                    <div className="View-Pnr-btn">
                      <button
                        className="View-btn"
                        // onClick={() => fetchPnrHistory(detail?.referenceID)}
                      >
                        <h1 className="View">View Details</h1>
                      </button>
                    </div>
                  </div>
      </div>





    </div>

    </div>
  )
}

export default Confirmed