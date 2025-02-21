import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  IconButton,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookIcon from "@mui/icons-material/Book";
import FeedbackIcon from "@mui/icons-material/Feedback";

const Navbar = () => {
  const { role, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const currentPath = location.pathname;

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    { label: "Home", path: "/", icon: <HomeIcon /> },
    role && {
      label: "Dashboard",
      path: role === "librarian" ? "/librarian" : "/user",
      icon: <DashboardIcon />,
    },
    role === "librarian" &&
      [
        { label: "Manage Sections", path: "/manage-sections", icon: <BookIcon /> },
        { label: "Manage Books", path: "/manage-ebooks", icon: <BookIcon /> },
        { label: "Manage Requests", path: "/manage-requests", icon: <BookIcon /> },
        { label: "Feedback", path: "/manage-feedbacks", icon: <FeedbackIcon /> },
      ],
    role === "user" &&
      [
        { label: "Available Books", path: "/available-books", icon: <BookIcon /> },
        { label: "My Profile", path: "/profile", icon: <AccountCircleIcon /> },
      ],
    role
      ? { label: "Logout", path: "/logout", icon: <LogoutIcon />, action: handleLogout }
      : [
          { label: "Register", path: "/register", icon: <AccountCircleIcon /> },
          { label: "Login", path: "/login", icon: <AccountCircleIcon /> },
        ],
  ].flat().filter(Boolean);

  const renderMenuItems = () => (
    <List>
      {menuItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <Divider />}
          <ListItem
            button
            component={item.action ? "div" : Link}
            to={!item.action ? item.path : undefined}
            onClick={item.action || undefined}
            sx={{
              "&.Mui-selected, &.Mui-selected:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#f3ec78" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} sx={{ color: "#ffffff" }} />
          </ListItem>
        </React.Fragment>
      ))}
    </List>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(90deg, #0f2027, #203a43, #2c5364)",
        padding: "10px 20px",
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.5)",
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          sx={{ "& .MuiDrawer-paper": { background: "#203a43" } }}
        >
          {renderMenuItems()}
        </Drawer>

        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            color: "#ffffff",
            fontWeight: "bold",
            textDecoration: "none",
            letterSpacing: "2px",
            "&:hover": {
              color: "#f3ec78",
            },
          }}
        >
          BookMaster
        </Typography>

        {!isMobile && (
          <Grid container spacing={2} justifyContent="flex-end" alignItems="center">
            {menuItems.map((item, index) => (
              <Grid item key={index}>
                <Button
                  component={item.action ? "button" : Link}
                  to={!item.action ? item.path : undefined}
                  onClick={item.action || undefined}
                  sx={{
                    color: "#f3ec78",
                    fontWeight: "500",
                    border: "1px solid #f3ec78",
                    borderRadius: "25px",
                    padding: "8px 20px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "#ABBA56",
                      color: "#ffffff",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
