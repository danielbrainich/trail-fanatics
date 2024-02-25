import { useState, useEffect } from "react";
import useCsrfToken from '../hooks/useCsrfToken';
import useAuth from '../hooks/useAuth';

function UpdateProfile({userId, setProfileUpdateSuccess, profileUpdateSuccess, username, email, firstName, lastName, bio}) {
  const { user } = useAuth();
  const [avatars, setAvatars] = useState([]);
  const [formData, setFormData] = useState({
    username: username || "",
    email: email || "",
    firstName: firstName || "",
    lastName: lastName || "",
    bio: bio || "",
    avatar: null,

  });

  useEffect(() => {
    setFormData({
      username: username || "",
      email: email || "",
      firstName: firstName || "",
      lastName: lastName || "",
      bio: bio || "",
      avatar: null,

    });
  }, [username, email, firstName, lastName, bio, formData.avatar]);

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

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await fetch("http://localhost:8000/accounts/avatars/", {
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken.csrfToken,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAvatars(data);
        } else {
          console.error("Failed to fetch avatars");
        }
      } catch (error) {
        console.error("Error fetching avatars:", error);
      }
    };

    fetchAvatars();
  }, [csrfToken.csrfToken]);

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
                    <label className="form-label">Choose Avatar</label>
                    {avatars.map((avatar) => (
                      <div key={avatar.id} className="form-check">
                        <input
                          type="radio"
                          id={avatar.id}
                          name="avatar"
                          value={avatar.id}
                          onChange={handleChangeInput}
                          checked={formData.avatar === avatar.id}
                          className="form-check-input"
                        />
                        <label htmlFor={avatar.id} className="form-check-label">{avatar.description}</label>
                        <img src={avatar.image} alt="Avatar" />
                      </div>
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
