import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { authService } from "../services/authService";
import { useLocation } from "react-router-dom";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw Error("Auth context must be used within the auth provider");
  }
  return context;
};

export const AuthProvider = ({ children, allowedRoles = [] }) => {
  const [userData, setUserData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const data = await authService.getCurrentUserData(user.uid);
          setUserData(data);
        } catch (error) {
          console.log("failed to get user", error);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return unSubscribe;
  }, []);
  const value = {
    currentUser,
    userData,
    loading,
    login: async (email, password) => {
      try {
        setError(null);
        const result = await authService.login(email, password);
        return result;
      } catch (error) {
        setError(error.message);
        throw error;
      }
    },
    register: authService.register,
    logout: async () => {
      try {
        setError(null);
        await authService.logout;
      } catch (error) {
        setError(error.message);
      }
    },
    resetPassword: async (email) => {
      try {
        setError(null);
        return await authService.resetPassword(email);
      } catch (error) {
        setError(error.message);
        throw error;
      }
    },
  };
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userData?.role)) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
          textAlign: "center",
          px: 3,
        }}
      >
        <Typography variant="h4" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          You don't have permission to access this page.
        </Typography>
        <Button variant="contained" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </Box>
    );
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
