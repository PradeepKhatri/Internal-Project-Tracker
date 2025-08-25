import React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const ColouredButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(theme.palette.grey[900]),
  alignItems: "center",
  background: `linear-gradient(
    to bottom,
    ${theme.palette.grey[800]} 0%,
    ${theme.palette.grey[900]} 100%
  )`,
  padding: theme.spacing(1, 2), // vertical, horizontal padding
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius * 2, // more rounded
  textTransform: "none", // disable default uppercase
  boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.grey[700],
    transform: "translateY(-1px)",
    boxShadow: "0 5px 12px rgba(0,0,0,0.15)",
  },
  "&:active": {
    transform: "translateY(0)",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },
}));

const ColourButton = ({ children, startIcon, ...props }) => {
  return (
    <ColouredButton startIcon={startIcon} {...props}>
      {children}
    </ColouredButton>
  );
};

export default ColourButton;
