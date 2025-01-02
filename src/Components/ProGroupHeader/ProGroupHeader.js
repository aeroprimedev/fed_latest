import React from 'react'
import './ProgroupHeader.css'
// import { Navigate} from 'react-router-dom'
const ProGroupHeader = () => {
  return (
    <div className='header-wrapper'>
     <nav className='navbar-grp'>
        <ul>
            <button className='Dashboard-grp'>
                <a href='ProGroup'>Dashboard</a>
            </button>
            <button className='Dashboard-grp'>
                <a href='/Open-grp'>Open</a>
            </button>
            <button className='Dashboard-grp'>
                <a href='/Quoted-grp'>Quoted</a>
            </button>
            <button className='Dashboard-grp'>
                <a href='/Under-Negotiation-grp'>Under-Negotiation</a>
            </button>
            <button className='Dashboard-grp'>
                <a href='/Confirmed-grp'>Confirmed</a>
            </button>
            <button className="Dashboard-grp"
            //   onClick={navigate('/History-grp')}
            >
                <a href="/History-grp">Group History</a>
            </button>
   
        </ul>
     </nav>
    </div>
  )
}

export default ProGroupHeader