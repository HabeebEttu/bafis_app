import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  IconButton,
  Link,
  Divider,
  useTheme,
  useMediaQuery,
  Collapse,
  Fade,
  Zoom,
} from "@mui/material";
import {
  ArrowBack,
  Email,
  CheckCircle,
  Refresh,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      await resetPassword(email);
    } catch (err) {
      setError("Failed to resend email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {!isMobile && (
          <Fade in timeout={800}>
            <Box
              sx={{
                width: { md: "50%" },
                position: "relative",
                backgroundImage: 'url("/images/background/open_poultry.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  bgcolor: "primary.main",
                  opacity: 0.25,
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)",
                },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: "80vh",
                  p: 8,
                  color: "white",
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    mb: 2,
                  }}
                >
                  Precision Poultry Management
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    maxWidth: 500,
                    opacity: 0.95,
                    color: "white",
                  }}
                >
                  Recover your account to continue optimizing your flock
                  performance and farm operations with BAFIS.
                </Typography>
              </Box>
            </Box>
          </Fade>
        )}

        {/* Right Side - Form */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 3, sm: 6, md: 8 },
          }}
        >
          <Zoom in timeout={600}>
            <Box sx={{ width: "100%", maxWidth: 480 }}>
              {/* Back Button */}
              <Button
                startIcon={<ArrowBack />}
                size="medium"
                onClick={() => navigate("/login")}
                sx={{
                  color: "primary.main",
                  fontWeight: 600,
                  mb: 4,
                  // "&:hover": {
                  //   bgcolor: "primary.light",
                  //   color: "primary.dark",
                  // },
                }}
              >
                Back to Login
              </Button>

              {/* Header */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    mb: 2,
                    color: "text.primary",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Forgot Password?
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    fontSize: 15,
                  }}
                >
                  Enter the email address associated with your account and we
                  will send you a link to reset your password.
                </Typography>
              </Box>

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
                <Typography mb={1}>Email Address:</Typography>
                <TextField
                  fullWidth
                  label=""
                  type="email"
                  size="small"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  disabled={loading || success}
                  InputProps={{
                    startAdornment: (
                      <Email sx={{ mr: 1, color: "text.secondary" }} />
                    ),
                  }}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                    },
                  }}
                />

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading || success}
                  sx={{
                    height: 48,
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </Box>

              {/* Success Alert */}
              <Collapse in={success}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    bgcolor: "success.light",
                    border: 1,
                    borderColor: "primary.light",
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 2,
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <CheckCircle
                          sx={{ color: "primary.main", fontSize: 20 }}
                        />
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 700, color: "text.primary" }}
                        >
                          Check your email
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", lineHeight: 1.6 }}
                      >
                        If an account exists for your email, you will receive a
                        password reset link shortly,dont forget to check your spam.
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      startIcon={<Refresh />}
                      onClick={handleResend}
                      disabled={loading}
                      sx={{
                        color: "primary.main",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        "&:hover": {
                          bgcolor: "primary.light",
                        },
                      }}
                    >
                      Resend
                    </Button>
                  </Box>
                </Paper>
              </Collapse>

              {/* Support Section */}
              <Divider sx={{ my: 4 }} />
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Having trouble?{" "}
                  <Link
                    href="#"
                    sx={{
                      color: "primary.main",
                      fontWeight: 600,
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Contact Support
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Zoom>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
