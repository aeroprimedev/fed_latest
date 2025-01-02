// import React, { useState } from 'react';
// import './PassengerSelector.css';

// function PassengerSelector() {
//   const [adults, setAdults] = useState(1);
//   const [children, setChildren] = useState(0);
//   const [infants, setInfants] = useState(0);

//   const createButtons = (max, value, setValue) => {
//     let buttons = [];
//     for (let i = 1; i <= max; i++) {
//       buttons.push(
//         <button
//           key={i}
//           className={value === i ? 'selected' : ''}
//           onClick={() => setValue(i)}
//         >
//           {i}
//         </button>
//       );
//     }
//     buttons.push(
//       <button
//         key={max + 1}
//         className={value > max ? 'selected' : ''}
//         onClick={() => setValue(max + 1)}
//       >
//         &gt;{max}
//       </button>
//     );
//     return buttons;
//   };

//   return (
//     <div className="passenger-selector">
//       <div className="passenger-group">
//         <label>ADULTS (16y+)</label>
//         <div className="button-group">
//           {createButtons(9, adults, setAdults)}
//         </div>
//       </div>
//       <div className="passenger-group">
//         <label>CHILDREN (2y - 12y)</label>
//         <div className="button-group">
//           {createButtons(6, children, setChildren)}
//         </div>
//       </div>
//       <div className="passenger-group">
//         <label>INFANTS (below 2y)</label>
//         <div className="button-group">
//           {createButtons(6, infants, setInfants)}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PassengerSelector;
