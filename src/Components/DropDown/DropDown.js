import React, { useState, useEffect, useRef } from "react";
import "./DropDown.css";
import { abc } from "../../Styling/DropDown/DropDown";
import { abcd } from "../../Styling/DropDown/DropDown";

const Dropdown = ({
  name,
  options,
  value,
  onChange,
  optionLabelKey = "label",
  optionValueKey = "value",
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const optionsRef = useRef(null);
  const selectedIndexRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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
    setSearchQuery("");
  };

  const handleKeyDown = (e) => {
    const key = e.key.toLowerCase();

    // Handle backspace key
    if (key === "backspace") {
      setSearchQuery(searchQuery.slice(0, -1)); // Remove the last character on backspace
    } else {
      // Append other characters to the search query
      setSearchQuery((prevSearch) => prevSearch + key);
    }
  };

  const filteredOptions = options.filter((option) => {
    const label = typeof option === "object" ? option[optionLabelKey] : option;
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    if (isOpen && optionsRef.current && selectedIndexRef.current != null) {
      const selectedOption =
        optionsRef.current.children[selectedIndexRef.current];
      if (selectedOption) {
        selectedOption.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [searchQuery, isOpen]);

  return (
    <div
      className="select-container"
      // className={`select-container ${searchQuery ? "select-container-searching" : ""}`}
      ref={dropdownRef}
    >
      <div
        style={getStyling()}
        className="dropdown"
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        
        <div
          className="selected-option"
          title={
            value
              ? options.find((option) => option[optionValueKey] === value)?.[
                  optionLabelKey
                ] || value
              : placeholder
          } // Show full text on hover
        >
          {value
            ? options.find((option) => option[optionValueKey] === value)?.[
                optionLabelKey
              ] || value
            : placeholder}
        </div>
      </div>
      {isOpen && (
        <div className="dropdown-popup" ref={optionsRef}>
          {filteredOptions.map((option, index) => {
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
                title={displayText} // Show full text on hover
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
