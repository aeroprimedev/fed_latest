import React from 'react'
import './Footer.css'
import bwlogo from '../../Components/BWlogo.png';

function Footer() {
  return (
    <div className='footer-body'>
      <img className='bottom-logo' src={bwlogo} alt='img' />
      <div className='footer-text'>All rights reserved 2024</div>
    </div>

  )
}

export default Footer
