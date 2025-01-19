import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create a Context for Auth
const AuthContext = createContext();

// AuthProvider component to wrap around the app and provide auth state
const AuthProvider = ({ children }) => {
  // let navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  // Check session when component mounts
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/auth/check-session",
          { withCredentials: true }
        );
       
        setUser(response.data.user);
      } catch (error) {
        console.log(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (userEmail, userPassword) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        { userEmail, userPassword },
        { withCredentials: true }
      );
      setUser(response.data.user);
      return 200;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await axios.get("http://localhost:3000/logout", {
        withCredentials: true,
      });
      setUser(null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
