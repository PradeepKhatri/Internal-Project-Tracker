import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material";
import { getMyProfile, loginUser } from "../api/auth.service";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ColourButton from "../components/ColourButton";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();



  useEffect(() => {
    if (auth.user) {
      navigate("/dashboard", { replace: true });
    }
  }, [auth.user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(email, password);
      const userData = await getMyProfile(data.token);
      auth.login(userData, data.token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    // <div
    //   className="bg-cover bg-center min-h-screen flex items-center justify-center"
    //   style={{
    //     backgroundImage:
    //       "url('https://res.cloudinary.com/dh2vwyyqj/image/upload/v1754840220/Digihomes-Banner_f5zyso.png')",
    //   }}
    // >
    <div
      className="bg-cover bg-top bg-fixed min-h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://cdn.properties.emaar.com/wp-content/uploads/2023/09/MicrosoftTeams-image-70-e1694072306832.jpg')",
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          // backgroundColor: "white",
          backgroundColor: "rgba(355, 355, 355, 0.80)",
          backdropFilter: "blur(20px)",    
          borderRadius: 4,
          paddingBottom: 3,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        }}
      >
        <Box
          sx={{
            marginTop: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            className="w-1/2 h-auto"
            src="https://res.cloudinary.com/dh2vwyyqj/image/upload/v1754892629/Emaar_una4ix.png"
            alt="Emaar logo"
          />
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
              
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <ColourButton type="submit" fullWidth sx={{ mt: 3, mb: 2 }}>
              Sign In
            </ColourButton>
            <Grid container justifyContent="center">
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  underline="hover"
                  sx={{ cursor: "pointer" }}
                >
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default LoginPage;
