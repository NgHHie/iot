import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";

const SwitchBox = ({ title, status, icon }) => {
  const theme = useTheme();

  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive); // Toggle the active state
  };
  console.log(status);
  useEffect(() => {
    if (status === "0") {
      setIsActive(false);
    } else if (status === "1") {
      setIsActive(true);
    }
  }, [status]);

  return (
    <Box
      gridColumn="span 1"
      gridRow="span 1"
      backgroundColor={
        isActive ? theme.palette.neutral[0] : theme.palette.background.default
      }
      p="1.2rem"
      borderRadius="1rem"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        transition: "background-color 0.25s ease, color 0.25s ease",
        boxShadow: isActive
          ? "0px 4px 6px rgba(255, 255, 255, 0.6)"
          : "0px 4px 6px rgba(255, 255, 255, 0.2)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: isActive
            ? theme.palette.background.default
            : theme.palette.neutral[0],
        }}
      >
        {title}
      </Typography>
      {icon &&
        React.cloneElement(icon, {
          sx: {
            color: isActive
              ? theme.palette.background.default
              : theme.palette.neutral[0],
            fontSize: "30px",
          },
        })}
    </Box>
  );
};

export default SwitchBox;
