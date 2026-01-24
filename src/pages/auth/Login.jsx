import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Login,
  Agriculture,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [loading,setLoading]= useState(false)
    const [ error,setError] = useState(null)
    const { login } = useAuth()
    const navigate = useNavigate()

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError("")
      setLoading(true)
      
      try {
          const result = await login(email.trim(), password.trim())
          if (remember) {
              localStorage.setItem('rememberMe', 'true')
          }
          console.log('Login sucessfull', result.userData);
          const role = result.userData.role;
          switch (role) {
              case 'admin':
              case 'management':
                  navigate('/dashboard');
                  break;
              case 'poultry_manager':
                  navigate('/poultry/dashboard');
                  break;
              case 'feedmill_manager':
                  navigate('/feedmill/dashboard');
                  break;
              case 'crop_manager':
                  navigate('/crops/dashboard');
                  break;
              case 'veterinary':
                  navigate('/veterinary/dashboard');
                  break;
              case 'operation_staff':
                  navigate('/operations/dashboard');
                  break;
              default:
                  navigate('/dashboard');
          }
      } catch (error) {
        setError(error)
      }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
      }}
    >
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          width: "58%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src="images/background/poultry.png"
          alt="Modern Poultry Farm"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(rgba(46, 125, 50, 0.75), rgba(46, 125, 50, 0.75))",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            px: 10,
            color: "white",
          }}
        >
          <Box sx={{ maxWidth: 500 }}>
            <Agriculture sx={{ fontSize: 50, mb: 3 }} />
            <Typography
              variant="h2"
              sx={{ mb: 2, color: "white", fontSize: "1.9rem" }}
            >
              Precision Poultry Management
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "1.2rem" }}
            >
              Streamline your flock operations, track health, and optimize
              production with the industry's most trusted poultry management
              suite.
            </Typography>
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: 40,
              left: 80,
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.875rem" }}
            >
              © 2024 BAFIS Suite. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          width: { xs: "100%", lg: "50%" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
                  px: { xs: 3, sm: 6, md: 17, xl: 20 },
          py:10,
          bgcolor: "background.paper",
        }}
      >
        <Container maxWidth="sm">
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 6 }}>
            <Box
              sx={{
                p: 1,
                bgcolor: "grey.300",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Agriculture sx={{ color: "primary.main", fontSize: 32 }} />
            </Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              BAFIS
            </Typography>
          </Box>

          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: "1.6rem",
                fontWeight: 700,
                color: "text.primary",
                mb: 1,
              }}
            >
              Sign In
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Welcome back! Please enter your details.
            </Typography>
          </Box>

                  {/* Form */}
                  {error &&(<Alert severity="error" sx={{ mb: 3 }} onClose={()=>setError("")}>
                      {error}
                  </Alert>)}
                  
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Email Field */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}
                >
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  size="small"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                      fontSize: 15,
                      "::placeholder": {
                        fontSize:10
                    }
                  }}
                />
              </Box>

              {/* Password Field */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: "text.primary" }}
                  >
                    Password
                  </Typography>
                  <Link
                    href="#"
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "primary.main",
                      textDecoration: "none",
                      "&:hover": {
                        color: "primary.dark",
                      },
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Box>
                <TextField
                  fullWidth
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="small"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
              </Box>

              {/* Remember Me */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    sx={{
                      color: "grey.300",
                      "&.Mui-checked": {
                        color: "primary.main",
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    Remember me for 30 days
                  </Typography>
                }
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                endIcon={<Login />}
                sx={{
                  py: 1.5,
                  fontSize: "1rem",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                }}
              >
                Sign In
              </Button>
            </Box>
          </form>

          {/* Footer */}
          <Box sx={{ mt: 5, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Don't have an account?{" "}
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
                Contact your Administrator
              </Link>
            </Typography>
          </Box>

          {/* Mobile Copyright */}
          <Box
            sx={{
              display: { xs: "block", lg: "none" },
              mt: 8,
              textAlign: "center",
            }}
          >
            <Typography variant="caption" sx={{ color: "grey.500" }}>
              © 2024 BAFIS Poultry Management.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
