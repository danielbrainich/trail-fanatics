import React from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';
import useAuth from '../hooks/useAuth';


function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg mt-4">
      <div className="container">
        <Link className="navbar-brand" to="/">TrailPeople</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
              <li className="nav-item">
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Account
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <h5 className="nav-link pt-2">{user && user.username}</h5>    {/* This needs to re-render on login and logout. Fix this */}
                  </li>
                  <li><Link className="dropdown-item" to="/login">Login</Link></li>
                  <li><Link className="dropdown-item" to="/signup">Signup</Link></li>
                  <li><Logout /></li>
                </ul>
              </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
