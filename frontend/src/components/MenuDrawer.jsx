import * as React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import Box from "@mui/material/Box";
import { useState } from "react";
import { Divider, ListItemButton, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const MenuDrawer = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const drawerItem = (label, icon, path, action) => {
    const isActive = location.pathname === path;

    return (
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => {
            onClose();
            if (path) navigate(path);
            if (action) action();
          }}
          sx={{
            bgcolor: isActive ? "grey.200" : "transparent",
            "&:hover": { bgcolor: "grey.100" },
            borderRadius: 1,
            mx: 0.5,
          }}
        >
          <ListItemIcon sx={{ color: "text.primary" }}>{icon}</ListItemIcon>
          <ListItemText
            primary={label}
            primaryTypographyProps={{ fontWeight: 500 }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box
        p={2}
        width="260px"
        role="presentation"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Drawer Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="close drawer"
            onClick={onClose}
            sx={{
              backgroundColor: "grey.200",
              "&:hover": { backgroundColor: "grey.300" },
              mr: 1,
            }}
          >
            <MenuOpenIcon fontSize="medium" />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Menu
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <List>
          {drawerItem("Projects", <InboxIcon />, "/homepage")}
          {drawerItem("Users", <MailIcon />, "/users")}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Divider sx={{ my: 1 }} />

        <List>{drawerItem("Logout", <MailIcon />, null)}</List>
      </Box>
    </Drawer>
  );
};

export default MenuDrawer;
