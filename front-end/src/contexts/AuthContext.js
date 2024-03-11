import React, { createContext, useContext } from "react";
import useAuth from "../hooks/useAuth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { user, isLoading, ...rest } = useAuth();

    const value = {
        user,
        isLoading,
        ...rest,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
