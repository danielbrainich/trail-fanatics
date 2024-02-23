import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Logout from './Logout';
import { AuthProvider, useAuthContext } from "../contexts/AuthContext";


function Navbar() {
  const { user } = useAuthContext();

  return (
    <nav className="navbar navbar-expand-lg mt-4">
      <div className="container">
        <Link className="navbar-brand" to="/">Trail People</Link>
        <ul className="navbar-nav ms-auto d-flex flex-row">
          {user ? (
            <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle text-primary" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Account
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><Link className="dropdown-item text-primary" to={`/profiles/${user?.id}`}>{user?.username}</Link></li>
              <li><Logout /></li>
            </ul>
          </li>
          ) : (
            <ul className="list-unstyled d-flex flex-wrap align-items-center">
              <li className="nav-item me-3 me-sm-0">
                <Link className="nav-link text-primary" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-primary" to="/signup">Signup</Link>
              </li>
            </ul>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
