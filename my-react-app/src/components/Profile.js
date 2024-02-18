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
        <div>
            {userProfile ? (
                <div>
                    <h2>{userProfile.user}'s Profile</h2>
                    <p>{userProfile.bio}</p>
                </div>
            ) : (
                <div>User not found</div>
            )}
        </div>
    );
}

export default Profile;
