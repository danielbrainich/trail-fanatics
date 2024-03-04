import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCsrfToken from '../hooks/useCsrfToken';
import sunglasses from '../assets/avatars/sunglasses.png';
import dog from '../assets/avatars/dog.png';
import mountains from '../assets/avatars/mountains.png';
import map from '../assets/avatars/map.png';
import bottle from '../assets/avatars/bottle.png';
import shoe from '../assets/avatars/shoe.png';

const avatarOptions = {
  sunglasses,
  dog,
  mountains,
  map,
  bottle,
  shoe,
};

function SignupForm() {
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [password] = useState('');
  const [passwordConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConfirm: '',
  });
  const csrfToken = useCsrfToken();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    const dataToSend = {
      username: formData.username,
      password: formData.password,
      passwordConfirm: formData.passwordConfirm,
      avatar: selectedAvatar,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/accounts/signup/`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken.csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        console.log("Signup successful");
        navigate('/login');
      } else {
        const data = await response.json();
        setError(data.error || 'An unknown error occurred');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError('Failed to submit form');
    }
  };

  const handleSelectAvatar = (key) => {
    setSelectedAvatar(key);
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="container mt-3 mt-md-5 mx-auto w-50">
      <h5>Signup</h5>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChangeInput}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChangeInput}
            placeholder="Enter a password"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="passwordConfirm" className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="passwordConfirm"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChangeInput}
            placeholder="Confirm your password"
            required
          />
        </div>
        <div className="mb-4">
          <div className="form-label">Choose an Avatar</div>
          {Object.entries(avatarOptions).map(([key, src]) => (
            <img
              key={key}
              src={src}
              alt={key}
              onClick={() => handleSelectAvatar(key)}
              style={{
                cursor: 'pointer',
                width: 50,
                marginRight: 15,
                borderRadius: '50%',
                transform: selectedAvatar === key ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.3s ease',
              }}
            />
          ))}
        </div>
        <button type="submit" className="btn btn-primary">Signup</button>
      </form>
    </div>
  );
}

export default SignupForm;
