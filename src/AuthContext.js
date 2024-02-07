// src/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState("");

  const login = (username) => {
    setIsLoggedIn(true);
    setLoggedInUsername(username);
    // Here, add your logic to handle login
  };

  const logout = () => {
    setIsLoggedIn(false);
    setLoggedInUsername("");
    // Here, add your logic to handle logout
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, loggedInUsername, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
