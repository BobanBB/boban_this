import React from "react";
import { Button } from "@mui/material";

const Chip = ({ icon, label, onClick }) => {
  return (
    <Button
      variant="contained"
      startIcon={icon}
      onClick={onClick}
      sx={{
        backgroundColor: "#333", // Dark background for the chip
        color: "#fff",           // White text
        padding: "8px 16px",     // Padding for a chip-like feel
        borderRadius: "12px",    // Rounded corners
        textTransform: "none",   // Disable uppercase
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // Subtle shadow
        "&:hover": {
          backgroundColor: "#444", // Slightly lighter on hover
        },
      }}
    >
      {label}
    </Button>
  );
};

export default Chip;
