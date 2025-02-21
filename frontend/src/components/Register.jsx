import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";
import { toast } from "react-toastify";
import backgroundImage from "../images/register.jpeg"; // Import the background image
import { styled } from "@mui/system";

// Create a styled background section for the Register page
const BackgroundSection = styled(Box)(({ theme }) => ({
  backgroundImage: `url(${backgroundImage})`, // Apply the background image
  backgroundSize: "cover", // Make sure the background covers the whole screen
  backgroundPosition: "center", // Center the background image
  height: "100vh", // Ensure it covers the full viewport height
  display: "flex", // Use flexbox to center the content
  alignItems: "center", // Vertically center the content
  justifyContent: "center", // Horizontally center the content
}));

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/auth/register", {
        username,
        password,
        email,
      });
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { token: res.data.token, role: "user" },
      });
      navigate("/user");
      toast.success("Registration successful!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.errors?.[0]?.msg || "Error during register";
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
            backdropFilter: "blur(10px)", // Glassmorphism effect (optional, can be removed if not needed)
          }}
        >
          <Typography variant="h3" paddingBottom={2} fontWeight="600">
            Create an Account
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
            type="email"
            variant="outlined"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            startIcon={<PersonAddIcon sx={{ color: "white" }} />} // Change icon color to white
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
            Register
          </Button>

          <Link to="/login" style={{ textDecoration: "none" }}>
            <Button
              endIcon={<LoginIcon sx={{ color: "#DF9755" }} />} // Change icon color to gold
              sx={{ marginTop: 6, borderRadius: 3 }}
              color="secondary"
            >
              <span style={{ color: "#DF9755" }}>Already have an account? Login</span>
            </Button>
          </Link>
        </Box>
      </form>
    </BackgroundSection>
  );
};

export default Register;
