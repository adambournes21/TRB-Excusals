// src/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const storedUsername = localStorage.getItem("loggedInUsername");
  const [loggedInUsername, setLoggedInUsername] = useState(storedUsername || "");

  const login = (username) => {
    setLoggedInUsername(username);
    localStorage.setItem("loggedInUsername", username); // Store username in localStorage
  };

  const logout = () => {
    setLoggedInUsername("");
    localStorage.removeItem("loggedInUsername"); // Remove username from localStorage
  };

  return (
    <AuthContext.Provider value={{ loggedInUsername, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
