import React, { useState } from "react";
import "./DropDown.css"; // Import the CSS file
import { abc } from "../../Styling/DropDown/DropDown";
import { abcd } from "../../Styling/DropDown/DropDown";

const Dropdown = ({
  name,
  options,
  value,
  onChange,
  optionLabelKey = "label",
  optionValueKey = "value",
  placeholder = "Select an option..."
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getOptionStyling = () => {
    if (name === "abc") {
      return abc.option;
    } else if (name === "abcd") {
      return abcd.option;
    }
    return {};
  };

  const getStyling = () => {
    if (name === "abc") {
      return abc.select;
    } else if (name === "abcd") {
      return abcd.select;
    }
    return {};
  };

  const handleSelect = (option) => {
    onChange(option[optionValueKey] || option);
    setIsOpen(false); // Close the dropdown when an option is selected
  };

  return (
    <div className="select-container">
      <div
        style={getStyling()}
        className="dropdown"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="selected-option">
          {value ? (options.find(option => option[optionValueKey] === value)?.[optionLabelKey] || value) : placeholder}
        </div>
      </div>
      {isOpen && (
        <div className="dropdown-popup">
          {options.map((option, index) => {
            const displayText =
              optionLabelKey && typeof option === "object"
                ? option[optionLabelKey]
                : option;
            const optionValue =
              optionValueKey && typeof option === "object"
                ? option[optionValueKey]
                : option;

            return (
              <div
                style={getOptionStyling()}
                className="dropdown-option"
                key={index}
                onClick={() => handleSelect(option)} // Selects one option at a time
              >
                {displayText}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;



// import { useState } from 'react';
// function Dropdown() {
//  const [selectedOption, setSelectedOption] = useState('');
//  const [options, setOptions] = useState([ "BAK,Baku",
//         "CIT,Shymkent",
//         "URA,Uralsk",
//         "PLX,Semey",
//         "KZO,Kyzylorda",
//         "KUT,Kutaisi",
//         "GUW,Atyrau",
//         "AKX,Aktobe",
//         "SCO,Aktau",
//         "UKK,Ust-Kamenogorsk",
//         "HSA,Turkistan",
//         "KSN,Kostanay",
//         "NQZ,Astana",
//         "ALA,Almaty"
// ]); // State to hold dropdown options
//   const [isOpen, setIsOpen] = useState(false);

//   // Function to fetch data from API
 


//   const handleSelect = (option) => {
//     setSelectedOption(option);
//     setIsOpen(false); // Close the dropdown when an option is selected
//   };

//   return (
//     <div className="dropdown-container">
//       <label htmlFor="dropdown" className="dropdown-label">Choose an option:</label>
//       <div className="dropdown" onClick={() => setIsOpen(!isOpen)}>
//         <div className="selected-option">{selectedOption || "Select an option"}</div>
//       </div>
//       {isOpen && (
//         <div className="dropdown-popup">
//           {options.map((option, index) => (
//             <div
//               key={index}
//               className="dropdown-option"
//               onClick={() => handleSelect(option)}
//             >
//               {option}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Dropdown;