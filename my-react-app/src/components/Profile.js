import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useCsrfToken from '../hooks/useCsrfToken';

function Profile() {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedProfileData, setEditedProfileData] = useState({
    username: "",
    bio: "",
    email: "",
  });

  const csrfToken = useCsrfToken();


  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/accounts/profiles/${userId}/`);
        if (!response.ok) {
          throw new Error('Could not fetch user profile');
        }
        const data = await response.json();
        setUserProfile(data);
        setEditedProfileData({
          username: data.username,
          bio: data.bio,
          email: data.email,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditProfile = async () => {
    try {
      const response = await fetch(`http://localhost:8000/accounts/profiles/${userId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(editedProfileData),
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      // Update profile state or handle success message
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle error state or display error message
    }
  };

  const handleChangeInput = (e) => {
    setEditedProfileData({
      ...editedProfileData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mt-5 vh-100">
      <div className="card">
        <div className="card-body">
          <div>
            {userProfile ? (
              <div>
                <h2>{userProfile.username}'s Profile</h2>
                <p>{userProfile.bio}</p>
                <p>{userProfile.email}</p>
                <button className="btn btn-primary" onClick={() => setShowEditModal(true)}>Edit Profile</button>
              </div>
            ) : (
              <div>User not found</div>
            )}
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="modal fade" id="editProfileModal" tabIndex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editProfileModalLabel">Edit Profile</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="usernameInput" className="form-label">Username</label>
                    <input type="text" className="form-control" id="usernameInput" name="username" value={editedProfileData.username} onChange={handleChangeInput} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="bioInput" className="form-label">Bio</label>
                    <textarea className="form-control" id="bioInput" name="bio" value={editedProfileData.bio} onChange={handleChangeInput}></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="emailInput" className="form-label">Email</label>
                    <input type="email" className="form-control" id="emailInput" name="email" value={editedProfileData.email} onChange={handleChangeInput} />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowEditModal(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleEditProfile}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
