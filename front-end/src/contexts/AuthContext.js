import React, { createContext, useContext, useMemo } from "react";
import useAuth from "../hooks/useAuth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, isLoading, error, setError, ...rest } = useAuth();

  const value = useMemo(() => ({
    user,
    isLoading,
    error,
    setError,
    ...rest
  }), [user, isLoading, error, setError, rest]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
