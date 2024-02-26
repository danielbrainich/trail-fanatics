import { useState, useEffect } from "react";
import useCsrfToken from '../hooks/useCsrfToken';
import useAuth from '../hooks/useAuth';
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

function UpdateProfile({userId, setProfileUpdateSuccess, profileUpdateSuccess, username, email, firstName, lastName, bio}) {
  const { user } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [formData, setFormData] = useState({
    username: username || "",
    email: email || "",
    firstName: firstName || "",
    lastName: lastName || "",
    bio: bio || "",
    avatar: "",
  });

  useEffect(() => {
    setFormData({
      username: username || "",
      email: email || "",
      firstName: firstName || "",
      lastName: lastName || "",
      bio: bio || "",
      avatar: "",
    });
  }, [username, email, firstName, lastName, bio]);

const csrfToken = useCsrfToken();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!emailRegex.test(formData.email)) {
        alert("Please enter a valid email address.");
        return;
    }

    const dataToSend = {
        username: formData.username,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        bio: formData.bio,
        avatar: formData.avatar,
    };

    const apiUrl = `http://localhost:8000/accounts/profiles/${userId}/`;

    const fetchConfig = {
      method: "PUT",
      body: JSON.stringify(dataToSend),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken.csrfToken,
      },
      credentials: 'include',
    };

    const response = await fetch(apiUrl, fetchConfig);

    if (response.ok) {
      event.target.reset();
      setFormData({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        bio: "",
        avatar: null,
      });
      setProfileUpdateSuccess(!profileUpdateSuccess)
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectAvatar = (key) => {
    setSelectedAvatar(key);
    setFormData(prev => ({ ...prev, avatar: key }));
  };

  return (
    <div className="card w-100 my-3 border-0">
        <h5 className="card-title">Update Profile</h5>
        <div className="card-body">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                    name="username"
                    type="text"
                    className="form-control"
                    onChange={handleChangeInput}
                    value={formData.username}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                    name="email"
                    className="form-control"
                    onChange={handleChangeInput}
                    value={formData.email}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                    name="firstName"
                    className="form-control"
                    onChange={handleChangeInput}
                    value={formData.firstName}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                    name="lastName"
                    className="form-control"
                    onChange={handleChangeInput}
                    value={formData.lastName}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <textarea
                    name="bio"
                    className="form-control"
                    onChange={handleChangeInput}
                    value={formData.bio}
                    ></textarea>
                </div>
                <div className="mb-3">
                <div className="form-label">Choose Avatar</div>
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
                      transform: selectedAvatar === key ? 'scale(1.25)' : 'scale(1)',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                ))}
              </div>
                <div className="text-end">
                    <button className="btn btn-secondary me-2" data-bs-dismiss="modal" type="reset">
                    Clear
                    </button>
                    <button className="btn btn-primary" data-bs-dismiss="modal" type="submit">
                    Post
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
}

export default UpdateProfile;
