import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
  TextField,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Home,
  Calendar,
  Video,
  FileText,
  Users,
  Settings,
  Bell,
  Search,
  MenuIcon,
} from "lucide-react";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const menuItems = [
  { text: "Dashboard", icon: Home, path: "/" },
  { text: "Appointments", icon: Calendar, path: "/appointments" },
  { text: "Video Consultations", icon: Video, path: "/video-consultations" },
  { text: "Medical Records", icon: FileText, path: "/medical-records" },
  { text: "Patients", icon: Users, path: "/patients" },
  { text: "Settings", icon: Settings, path: "/settings" },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications] = useState([
    { id: 1, text: "New appointment request from John Doe" },
    { id: 2, text: "Prescription ready for review" },
    { id: 3, text: "Video consultation starting in 5 minutes" },
  ]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <TextField
            size="small"
            placeholder="Search patients, appointments..."
            variant="outlined"
            sx={{
              ml: 2,
              flex: 1,
              backgroundColor: "white",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
            }}
            InputProps={{
              startAdornment: <Search className="h-5 w-5 text-gray-400 mr-2" />,
            }}
          />
          <IconButton color="inherit" onClick={handleNotificationClick}>
            <Badge badgeContent={notifications.length} color="error">
              <Bell />
            </Badge>
          </IconButton>
          <Avatar sx={{ ml: 2 }}>DS</Avatar>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <Toolbar />
        {children}
      </Main>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleNotificationClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: "30ch",
          },
        }}
      >
        {notifications.map((notification) => (
          <MenuItem key={notification.id} onClick={handleNotificationClose}>
            {notification.text}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
