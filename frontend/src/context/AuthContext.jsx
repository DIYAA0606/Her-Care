import { createContext, useState, useContext, useEffect } from "react";
import { setupInterceptors } from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  // Set up interceptor once, giving it a function that always reads current token
  useEffect(() => {
    setupInterceptors(() => accessToken);
  }, [accessToken]);

  const login = (token, userData) => {
    setAccessToken(token);
    setUser(userData);
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
  };

  const value = {
    accessToken,
    user,
    login,
    logout,
    isAuthenticated: !!accessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}