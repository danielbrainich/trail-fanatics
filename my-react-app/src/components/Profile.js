import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Profile() {
    let { userId } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
    }, [userId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
<div className="container mt-5 vh-100">
    <div className="card">
        <div className="card-body">
            {console.log("userprof$$$$$$$ile", userProfile)}
            <div>
                {userProfile ? (
                <div>
                    <h2>{userProfile.username}'s Profile</h2>
                    <p>{userProfile.bio}</p>
                    <p>{userProfile.contact_email}</p>
                </div>
                ) : (
                <div>User not found</div>
                )}
            </div>
        </div>
    </div>
</div>

    );
}

export default Profile;
