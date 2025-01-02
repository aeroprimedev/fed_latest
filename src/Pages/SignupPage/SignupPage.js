import React, {useState} from "react";
import HeaderLogin from "../../Components/HeaderLogin/HeaderLogin";
import './SignupPage.css';
import Footer from "../../Components/Footer/Footer.js";


const SignupForm = () => {
  const [form, setForm] = useState({
    firstName: '',
    email: '',
    agencyName: '',
    password: '',
    lastName: '',
    confirmEmail: '',
    address: '',
    confirmPassword: '',
  });

  // const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form fields here and set errors if necessary
    // If no errors, submit the form data to your server
  };

  return (
    <>
    <HeaderLogin />
    <div className="Signup-form-container">
    <h2 className="Signup-tittle">CREATE AN ACCOUNT</h2>
    <div className='break-line'></div>

    <form onSubmit={handleSubmit} className="Signup-form">
      <input
        type="text"
        name="firstName"
        className="firstName"
        value={form.firstName}
        onChange={handleInputChange}
        placeholder="First Name"
      />
       <input
        type="text"
        name="lastName"
        className="lastName"
        value={form.lastName}
        onChange={handleInputChange}
        placeholder="Last Name"
      />
      <input
        type="email"
        name="email"
        className="email"
        value={form.email}
        onChange={handleInputChange}
        placeholder="Email"
      />
      <input
        type="email"
        name="confirmEmail"
        className="confirmEmail"
        value={form.confirmEmail}
        onChange={handleInputChange}
        placeholder="Confirm Email"
      />
      <input
        type="text"
        name="agencyName"
        className="agencyName"
        value={form.agencyName}
        onChange={handleInputChange}
        placeholder="Agency Name"
      />
      
      
      <input
        type="text"
        name="address"
        className="address"
        value={form.address}
        onChange={handleInputChange}
        placeholder="Address"
      />
      <input
        type="password"
        name="createPassword"
        className="createPassword"
        value={form.password}
        onChange={handleInputChange}
        placeholder="Create Password"
      />
     
      <input
        type="password"
        name="confirmPassword"
        className="confirmPassword"
        value={form.confirmPassword}
        onChange={handleInputChange}
        placeholder="Confirm Password"
      />
      <button type="submit" className="Signup-button">SIGN UP</button>
    </form>
    
    </div>
    <Footer/>
    </>
  );
};

export default SignupForm;