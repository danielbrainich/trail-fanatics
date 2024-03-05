import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';
import { useAuthContext } from "../contexts/AuthContext";
import sunglasses from '../assets/avatars/sunglasses.png';
import dog from '../assets/avatars/dog.png';
import mountains from '../assets/avatars/mountains.png';
import map from '../assets/avatars/map.png';
import bottle from '../assets/avatars/bottle.png';
import shoe from '../assets/avatars/shoe.png';
import SignupForm from './Signup';
import LoginForm from './Login';



const avatarOptions = {
  sunglasses,
  dog,
  mountains,
  map,
  bottle,
  shoe,
};


function Navbar() {
  const { user, fetchCurrentUser } = useAuthContext();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
  }, [signupSuccess]);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
  };

  const handleSignupSuccess = () => {
    setShowSignupModal(false);
  };

  return (
    <nav className="navbar navbar-expand-lg mt-4">
      <div className="container">
        <Link className="navbar-brand no-underline" to="/">
          Trail People
        </Link>
        <ul className="navbar-nav ms-auto d-flex flex-row">
          {user ? (
            <div className="d-flex align-items-center">
              <span className="custom-nav-link">{user?.username}</span>
              <li className="nav-item dropdown">
                <button className="nav-link" href="#" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  {user?.avatar && <img src={avatarOptions[user.avatar]} alt="avatar" className="rounded-circle ms-2" style={{ width: "45px" }} />}
                </button>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><Link className="dropdown-item no-underline" to={`/profiles/${user?.id}`}>My Profile</Link></li>
                  <li><Link className="dropdown-item no-underline" to={`/trails/`}>My Saved Maps</Link></li>
                  <li><Logout /></li>
                </ul>
              </li>
            </div>
          ) : (
            <>
              <ul className="list-unstyled d-flex flex-wrap align-items-center">
                <li className="nav-item me-3 me-sm-0">
                  <button type="button" className="nav-link text-primary" onClick={() => setShowLoginModal(true)}>
                    Login
                  </button>
                </li>
                <li className="nav-item">
                  <button type="button" className="nav-link text-primary" onClick={() => setShowSignupModal(true)}>
                    Signup
                  </button>
                </li>
              </ul>
            </>
          )}
        </ul>
      </div>

      {showLoginModal && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5">Login</h1>
                <button type="button" className="btn-close" onClick={() => setShowLoginModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <LoginForm onLoginSuccess={handleLoginSuccess} />
              </div>
            </div>
          </div>
        </div>
      )}

      {showSignupModal && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5">Signup</h1>
                <button type="button" className="btn-close" onClick={() => setShowSignupModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <SignupForm onSignupSuccess={handleSignupSuccess} signupSuccess={signupSuccess} setSignupSuccess={setSignupSuccess} />
              </div>
            </div>
          </div>
        </div>
      )}

      {showLoginModal && <div className="modal-backdrop fade show"></div>}
      {showSignupModal && <div className="modal-backdrop fade show"></div>}
    </nav>
  );
}

export default Navbar;
