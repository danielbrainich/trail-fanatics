import React, { useState } from "react";
import sunglasses from "../assets/avatars/sunglasses.png";
import dog from "../assets/avatars/dog.png";
import mountains from "../assets/avatars/mountains.png";
import map from "../assets/avatars/map.png";
import bottle from "../assets/avatars/bottle.png";
import shoe from "../assets/avatars/shoe.png";
import useAuth from "../hooks/useAuth";
import { useAuthContext } from "../contexts/AuthContext";

const avatarOptions = {
    sunglasses,
    dog,
    mountains,
    map,
    bottle,
    shoe,
};

function SignupForm({ onSignupSuccess, setSignupSuccess, signupSuccess }) {
    const [selectedAvatar, setSelectedAvatar] = useState("");
    const authContext = useAuthContext();
    const { error, setError } = authContext;
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        passwordConfirm: "",
    });
    const { signup } = useAuth();

    const validateUsername = (username) => {
        if (username.includes(" ")) {
            return "Username cannot contain spaces";
        }
        if (username.length < 3) {
            return "Username must be at least 3 characters long";
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return "Username can only contain letters, numbers, and underscores";
        }

        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const usernameError = validateUsername(formData.username);
        if (usernameError) {
            setError(usernameError);
            return;
        }

        if (formData.password !== formData.passwordConfirm) {
            setError("Passwords do not match");
            return;
        }

        if (!selectedAvatar) {
            setError("Please select an avatar");
            return;
        }

        try {
            await signup({
                ...formData,
                avatar: selectedAvatar,
            });
            onSignupSuccess();
            setSignupSuccess(!signupSuccess);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    const usernameErrors = error.response.data.username;
                    if (usernameErrors && usernameErrors.length > 0) {
                        setError(usernameErrors[0]);
                    } else {
                        setError(
                            "Failed to submit form due to validation errors."
                        );
                    }
                } else {
                    setError("An unexpected error occurred.");
                }
            } else {
                setError("An error occurred, please try again later.");
            }
        }
    };

    const handleSelectAvatar = (key) => {
        setSelectedAvatar(key);
    };

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div className="container my-4">
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-4">
                    <label htmlFor="username" className="form-label">
                        Username
                    </label>
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
                    <div className="invalid-feedback">
                        Please enter a username.
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChangeInput}
                        placeholder="Enter a password"
                        required
                        minLength="4"
                    />
                    <div className="invalid-feedback">
                        Password must be at least 4 characters.
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="passwordConfirm" className="form-label">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="passwordConfirm"
                        name="passwordConfirm"
                        value={formData.passwordConfirm}
                        onChange={handleChangeInput}
                        placeholder="Confirm your password"
                        required
                        minLength="4"
                    />
                    <div className="invalid-feedback">
                        Passwords must match.
                    </div>
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
                                cursor: "pointer",
                                width: 50,
                                marginRight: 15,
                                borderRadius: "50%",
                                transform:
                                    selectedAvatar === key
                                        ? "scale(1.2)"
                                        : "scale(1)",
                                transition: "transform 0.3s ease",
                            }}
                        />
                    ))}
                </div>
                <button type="submit" className="btn btn-primary">
                    Signup
                </button>
            </form>
        </div>
    );
}

export default SignupForm;
