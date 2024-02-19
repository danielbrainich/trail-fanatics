import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useCsrfToken from '../hooks/useCsrfToken';
import UpdateProfile from './ProfileUpdate';

function Profile() {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(null);

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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, profileUpdateSuccess]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-5">Error: {error}</div>;
  }

  if (!userProfile) {
    return <div className="text-center mt-5">User not found</div>;
  }

  return (
    <div className="container d-flex justify-content-center mt-5 vh-100">
      <div className="row flex-fill d-flex justify-content-center">
        <div className="col-lg-9">
          <div className="card">
            <div className="card-body">
              <h3>Profile</h3>
              <div className="mb-3">
                <strong>Username:</strong> {userProfile.username}
              </div>
              <div className="mb-3">
                <strong>First Name:</strong> {userProfile.first_name}
              </div>
              <div className="mb-3">
                <strong>Last Name:</strong> {userProfile.last_name}
              </div>
              <div className="mb-3">
                <strong>Email:</strong> {userProfile.email}
              </div>
              <div className="mb-3">
                <strong>Bio:</strong> {userProfile.bio}
              </div>
              <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editProfileModal">
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="editProfileModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            <UpdateProfile userId={userId} setProfileUpdateSuccess={setProfileUpdateSuccess} profileUpdateSuccess={profileUpdateSuccess} username={userProfile.username} firstName={userProfile.first_name} lastName={userProfile.last_name} email={userProfile.email} bio={userProfile.bio} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
