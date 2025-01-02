import React from 'react'
import './HeaderLogin.css'
import logo from '../../Components/logo.png';

function HeaderLogin() {
  return (
    <div className='header-body-login'>
        <img className='logo-login' src={logo} alt='logo'   />
    </div>
  )
}

export default HeaderLogin
