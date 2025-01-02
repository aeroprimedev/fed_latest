import React,{useState} from 'react';

import './PasswordPage.css';
import Footer from '../../Components/Footer/Footer';    
import HeaderLogin from '../../Components/HeaderLogin/HeaderLogin';


function PasswordPage() {
    const [form, setForm] = useState({
        currentpassword: '',
        newpassword: '',
        confirmpassword: '',
    });

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };


  return (
    <>
    <HeaderLogin/>
    <div className='Password-form-container'>
        <h2 className='Password-tittle'>CHANGE PASSWORD</h2>
        <div className='break-line'></div>

        <form className='Password-form' onSubmit={handleSubmit}>
            <input
            type="password"
            className='Current-Password'
            placeholder="Current Password"
            name="currentpassword"
            onChange={handleInputChange}
            />
            <input
            type="password"
            className='New-Password'
            placeholder="New Password"
            name="newpassword"
            onChange={handleInputChange}
            />

            <input
            type='password'
            className='Confirm-Password'
            placeholder="Confirm Password"
            name="confirmpassword"
            onChange={handleInputChange}
            />

            <button type='submit' className='save-password'>SAVE</button>
        </form>    
    </div>
    <Footer />
    </>
  )
}

export default PasswordPage