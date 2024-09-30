import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";
import { Report } from "@mui/icons-material";

const StatBox = ({ title, value, icon, description, onChange }) => {
  const theme = useTheme();
  const getColor = (description, val) => {
    // console.log(description);
    if (val === 1) {
      switch (description) {
        case "temper":
          return theme.palette.secondary[100];
        case "humid":
          return theme.palette.xanhduong[100];
        case "light":
          return theme.palette.vang[100];
        default:
          return theme.palette.neutral[0];
      }
    } else {
      switch (description) {
        case "temper":
          return theme.palette.secondary[200];
        case "humid":
          return theme.palette.xanhduong[200];
        case "light":
          return theme.palette.vang[200];
        default:
          return theme.palette.neutral[10];
      }
    }
  };

  const getIncrease = (description, value) => {
    value = parseFloat(value);
    let res = { increase: "", alert: false };
    switch (description) {
      case "temper":
        if (value < 10) {
          res.increase = "Rất lạnh";
          res.alert = true;
          return res;
        } else if (value < 20) {
          res.increase = "Khá lạnh";
          return res;
        } else if (value < 27) {
          res.increase = "Mát mẻ";
          return res;
        } else if (value < 32) {
          res.increase = "Khá nóng";
          return res;
        } else if (value < 38) {
          res.increase = "Nóng";
          return res;
        } else if (value < 45) {
          res.increase = "Rất nóng";
          return res;
        } else {
          res.increase = "Nguy hiểm";
          res.alert = true;
          return res;
        }
      case "humid":
        if (value < 30) {
          res.increase = "Khô";
          return res;
        } else if (value < 60) {
          res.increase = "Vừa đủ";
          return res;
        } else {
          res.increase = "Ẩm ướt";
          return res;
        }
      case "light":
        if (value < 1000) {
          res.increase = "Tối";
          return res;
        } else if (value < 5000) {
          res.increase = "Đủ sáng";
          return res;
        } else {
          res.increase = "Quá sáng";
          res.alert = true;
          return res;
        }
      default:
        return "";
    }
  };

  return (
    <Box
      gridColumn="span 2"
      gridRow="span 1"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="1.25rem 1rem"
      flex="1 1 100%"
      backgroundColor={theme.palette.background.alt}
      borderRadius="1.5rem"
      sx={{
        boxShadow: "0px 4px 6px rgba(255, 255, 255, 0.5)",
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": {
          backgroundColor: theme.palette.primary[500],
        },
      }}
    >
      <FlexBetween>
        <Typography variant="h5" sx={{ color: getColor(description, 1) }}>
          {title}
        </Typography>
        {icon}
      </FlexBetween>

      <Typography
        variant={description === "null" ? "h6" : "h2"}
        fontWeight="600"
        sx={{
          color: getColor(description, 2),
          overflowWrap: "break-word",
          wordBreak: "break-word",
        }}
      >
        {value}
      </Typography>
      <FlexBetween>
        <Typography variant="h6">
          {getIncrease(description, value).increase}
        </Typography>
        {getIncrease(description, value).alert && (
          <Report
            sx={{
              color: "rgba(200, 0, 0, 1)",
              mr: "2px",
              "@keyframes blink": {
                "50%": {
                  opacity: 0.1,
                },
              },
              //boxShadow: "0px 4px 6px rgba(255, 0, 0, 0.5)",
              borderRadius: "25%",
              animation: "blink 0.5s infinite",
            }}
          />
        )}
      </FlexBetween>
    </Box>
  );
};

export default StatBox;
