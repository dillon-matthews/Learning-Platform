import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  useTheme,
  Divider,
  Typography,
} from "@mui/material";
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Announcement as AnnouncementIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  AppRegistration as RegisterIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Book as BookIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useUI } from "../../context/UIContext";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { navbarOpen, toggleNavbar, darkMode, toggleDarkMode } = useUI();
  const theme = useTheme();

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  const menuItems = [
    {
      text: "Home",
      icon: <HomeIcon />,
      path: "/",
      auth: true,
    },
    {
      text: "Profile",
      icon: <PersonIcon />,
      path: "/profile",
      auth: true,
    },
    {
      text: "Modules",
      icon: <BookIcon />,
      path: "/modules",
      auth: true,
    },
    {
      text: "Pages",
      icon: <DescriptionIcon />,
      path: "/pages",
      auth: true,
    },
    {
      text: "Announcements",
      icon: <AnnouncementIcon />,
      path: "/announcements",
      auth: true,
    },
  ];

  return (
    <>
      <Drawer
        variant="permanent"
        open={navbarOpen}
        sx={{
          width: navbarOpen ? 240 : 72,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: navbarOpen ? 240 : 72,
            boxSizing: "border-box",
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          },
        }}
      >
        <List>
          <ListItemButton onClick={toggleNavbar}>
            <ListItemIcon>
              <MenuIcon />
            </ListItemIcon>
            {navbarOpen && (
              <ListItemText
                primary={
                  <Typography variant="h6" noWrap>
                    Menu
                  </Typography>
                }
              />
            )}
          </ListItemButton>
          <Divider />
          {user &&
            menuItems.map((item) => (
              <ListItemButton key={item.text} component={Link} to={item.path}>
                <Tooltip title={navbarOpen ? "" : item.text} placement="right">
                  <ListItemIcon>{item.icon}</ListItemIcon>
                </Tooltip>
                {navbarOpen && <ListItemText primary={item.text} />}
              </ListItemButton>
            ))}
          {!user && (
            <>
              <ListItemButton component={Link} to="/login">
                <Tooltip title={navbarOpen ? "" : "Login"} placement="right">
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>
                </Tooltip>
                {navbarOpen && <ListItemText primary="Login" />}
              </ListItemButton>
              <ListItemButton component={Link} to="/register">
                <Tooltip title={navbarOpen ? "" : "Register"} placement="right">
                  <ListItemIcon>
                    <RegisterIcon />
                  </ListItemIcon>
                </Tooltip>
                {navbarOpen && <ListItemText primary="Register" />}
              </ListItemButton>
            </>
          )}
          {user && (
            <>
              <Divider />
              <ListItemButton onClick={handleLogout}>
                <Tooltip title={navbarOpen ? "" : "Logout"} placement="right">
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                </Tooltip>
                {navbarOpen && <ListItemText primary="Logout" />}
              </ListItemButton>
            </>
          )}
          <Divider />
          <ListItemButton onClick={toggleDarkMode}>
            <Tooltip title={navbarOpen ? "" : "Toggle Theme"} placement="right">
              <ListItemIcon>
                {theme.palette.mode === "dark" ? (
                  <Brightness7Icon />
                ) : (
                  <Brightness4Icon />
                )}
              </ListItemIcon>
            </Tooltip>
            {navbarOpen && (
              <ListItemText
                primary={
                  theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"
                }
              />
            )}
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
