import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
const theme = createTheme({
  palette: {
    primary: {
      main: "#2D7A3E", 
      light: "#4A9D5C",
      dark: "#1F5A2B",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#FF6B35", 
      light: "#FF8A5C",
      dark: "#E55527",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#2D7A3E",
      light: "#E8F5E9",
    },
    background: {
      default: "#FAFAFA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#666666",
    },
    grey: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      500: "#6B7280",
      700: "#374151",
    },
  },
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: "3.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      color: "#666666",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
          fontWeight: 600,
          boxShadow: "none",
        },
        containedPrimary: {
          backgroundColor: "#2D7A3E",
          "&:hover": {
            backgroundColor: "#1F5A2B",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        filled: {
          backgroundColor: "#E8F5E9",
          color: "#2D7A3E",
        },
      },
    },
  },
});
root.render(
  <React.StrictMode>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
