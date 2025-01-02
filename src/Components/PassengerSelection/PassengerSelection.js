import React, { useState } from "react";
import "./PassengerSelection.css";

const PassengerSelection = () => {
  const [showPassengerSelection, setShowPassengerSelection] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const handleSelection = (type, value) => {
    if (type === "adults") setAdults(value);
    if (type === "children") setChildren(value);
    if (type === "infants") setInfants(value);
  };

  return (
    <div className="Pax">
    <button 
        className="open-passenger-selection" 
        onClick={() => setShowPassengerSelection(!showPassengerSelection)}
      >
        Select Passengers
      </button>
      {showPassengerSelection && (  
    <div className="passenger-selection-container">
      <div className="passenger-type">
        <label>ADULTS (16y+)</label>
        <div className="passenger-buttons">
          {Array.from({ length: 10 }, (_, i) => (
            <button
              key={i}
              className={adults === i + 1 ? "selected" : ""}
              onClick={() => handleSelection("adults", i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className={adults > 9 ? "selected" : ""}
            onClick={() => handleSelection("adults", ">9")}
          >
            {/* >9 */}
          </button>
        </div>
      </div>

      <div className="passenger-type">
        <label>CHILDREN (2Y - 12Y)</label>
        <div className="passenger-buttons">
          {Array.from({ length: 6 }, (_, i) => (
            <button
              key={i}
              className={children === i + 1 ? "selected" : ""}
              onClick={() => handleSelection("children", i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className={children > 6 ? "selected" : ""}
            onClick={() => handleSelection("children", ">6")}
          >
            {/* >6 */}
          </button>
        </div>
      </div>

      <div className="passenger-type">
        <label>INFANTS (below 2y)</label>
        <div className="passenger-buttons">
          {Array.from({ length: 6 }, (_, i) => (
            <button
              key={i}
              className={infants === i + 1 ? "selected" : ""}
              onClick={() => handleSelection("infants", i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className={infants > 6 ? "selected" : ""}
            onClick={() => handleSelection("infants", ">6")}
          >
            {/* >6 */}
          </button>
        </div>
      </div>

      <button className="apply-button" onClick={() => setShowPassengerSelection(false)}>Apply</button>
    </div>
     )}
    </div>
  );
};

export default PassengerSelection;
