import React from "react";
import { Typography, Grid, Box } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        background: "linear-gradient(90deg, #0f2027, #203a43, #2c5364)", // Same gradient as Navbar
        color: "#f3ec78", // Icon color for footer
        padding: "20px 0",
        textAlign: "center",
        boxShadow: "0px -10px 30px rgba(0, 0, 0, 0.5)",
      }}
    >
      <Grid container justifyContent="center" spacing={3}>
        <Grid item>
          <Typography
            variant="body2"
            sx={{
              color: "#f3ec78", // Yellow text color
              fontWeight: "bold",
              letterSpacing: "2px",
              fontSize: "14px",
              "&:hover": {
                color: "#ffffff", // Hover effect
              },
            }}
          >
            © {new Date().getFullYear()} Book Master. All rights reserved.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
