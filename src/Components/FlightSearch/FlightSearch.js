// import React,{useState,useEffect }from 'react';
// import './FlightSearch.css';
// import FlightLandIcon from '@mui/icons-material/FlightLand';
// // import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import CustomDropdownWithIcons from '../../Components/CustomDropdown/CustomDropdownWithIcons.js';
// import { useNavigate } from 'react-router-dom';
// function FlightSearch() {

//   const options = [
//     { value: '1', code: 'JFK', location: 'New York', description: 'John F. Kennedy International...' },
//     { value: '2', code: 'LAX', location: 'Los Angeles', description: 'Los Angeles International...' },
//     { value: '3', code: 'ORD', location: 'Chicago', description: 'O\'Hare International...' },
//   ];
  
//   const handleSelect = (option) => {
//     console.log('Selected option:', option);
//   };
  

  
//   return (
//     <div className='Search-Container'>
//         <div className='Origin-Container'>
        
//       <CustomDropdownWithIcons
//         options={options}
//         placeholder="Origin"
//         onSelect={handleSelect}
//       />


//         </div>
//         <div className='Destination-Container'>
//         <p className="label">TO</p>
//         <i className="icon-plane"><FlightLandIcon/></i>



//         </div>
//         <div className='Depart-Date-Container'>
//           <p className='label'>Departure</p>
//           <i className='Calender-icon'>
//           <CalendarMonthIcon/>
//           </i>
          

//         </div>
//         <div className='Arrival-Date-Container'>
//         <p className='label'>Return</p>
//         <i className='Calender-icon'>
//         <CalendarMonthIcon/>
//         </i>



//         </div>
//         <div className='PassengerDetail-Container'>
//         <p className='label'>Traveller & Class</p>
//        <h4 className='Passenger'>1 Traveller</h4>
      
//         </div>
//       <div>
//       <input className="Flight-Search-Submit-Button" type="submit" />
//       </div>



//     </div>
//   )
// }

// export default FlightSearch;