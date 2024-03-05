import React, { createContext, useContext, useMemo } from "react";
import useAuth from "../hooks/useAuth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = useAuth();
  const value = useMemo(() => auth, [auth.user]);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
