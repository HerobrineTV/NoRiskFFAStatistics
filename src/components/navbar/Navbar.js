import React, { useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";
import './Navbar.css';

function Navbar() {
  const { lang } = useParams();

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <Link to={`/${lang}/start`} className="navbar-logo">
        Hero FFA
      </Link>
      <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>
      <div className={`navbar-center ${isOpen ? 'open' : ''}`}>
        <ul className="navbar-links">
          <li className='navbar-a' onClick={closeMenu}><Link to={`/home`}>Home</Link></li>
          <li className='navbar-a' onClick={closeMenu}><Link to={`/home`}>About</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;