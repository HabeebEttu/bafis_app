import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles.length > 0 && !allowedRoles.includes(userData?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
