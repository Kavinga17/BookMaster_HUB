import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { toast } from "react-toastify";
import backgroundImage from "../images/login.jpeg"; // Import the background image
import { styled } from "@mui/system";

// Create a styled background section for the Login page
const BackgroundSection = styled(Box)(({ theme }) => ({
  backgroundImage: `url(${backgroundImage})`, // Apply the background image
  backgroundSize: "cover", // Ensure the background covers the entire screen
  backgroundPosition: "center", // Center the background image
  backgroundAttachment: "fixed", // Make the background stay in place while scrolling
  height: "100vh", // Ensure it covers the full viewport height
  display: "flex", // Use flexbox to center the content
  alignItems: "center", // Vertically center the content
  justifyContent: "center", // Horizontally center the content
}));

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { role, dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (role) {
      navigate(`/${role}`);
    }
  }, [role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", {
        username,
        password,
      });
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { token: res.data.token, role: res.data.user.role },
      });
      navigate(`/${res.data.user.role}`);
      toast.success("Login successful!");
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Error during login";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  return (
    <BackgroundSection>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "450px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "auto",
            padding: 4,
            borderRadius: 5,
            backgroundColor: "rgba(255, 255, 255, 0.9)", // Slight transparency for better readability
            // Removed backdropFilter property to avoid background image blur
          }}
        >
          <Typography variant="h3" paddingBottom={2} fontWeight="600">
            Login
          </Typography>

          <TextField
            margin="normal"
            type="text"
            variant="outlined"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
          />

          <TextField
            margin="normal"
            type="password"
            variant="outlined"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
          />

          <Button
            startIcon={<LoginIcon sx={{ color: "white" }} />} // Change the icon color to white
            sx={{
              marginTop: 3,
              borderRadius: 3,
              backgroundColor: "#DF9755", // Button color
              "&:hover": {
                backgroundColor: "#c67f41", // Darker shade on hover
              },
            }}
            variant="contained"
            type="submit"
          >
            Login
          </Button>

          <Link to="/register" style={{ textDecoration: "none" }}>
            <Button
              endIcon={<PersonAddIcon sx={{ color: "#DF9755" }} />} // Change the end icon color to #DF9755
              sx={{ marginTop: 6, borderRadius: 3 }}
              color="secondary"
            >
              <span style={{ color: "#DF9755" }}>Change to Register</span>
            </Button>
          </Link>
        </Box>
      </form>
    </BackgroundSection>
  );
};

export default Login;
