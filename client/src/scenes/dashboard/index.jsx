import React, { useState, useEffect, useRef } from "react";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import {
  BlurOnOutlined,
  WhatshotOutlined,
  WaterDropOutlined,
  LightModeOutlined,
  LightOutlined,
  WindPowerOutlined,
  AcUnitOutlined,
  AddOutlined,
} from "@mui/icons-material";
import {
  Box,
  useTheme,
  Typography,
  useMediaQuery,
  Button,
} from "@mui/material";
import OverviewChart from "components/OverviewChart";
import StatBox from "components/StatBox";
import SwitchBox from "components/SwitchBox";
import socketIOClient from "socket.io-client";

const host = "http://localhost:5001";
const socket = socketIOClient.connect(host);

const Dashboard = () => {
  const [stats, setStats] = useState({
    temper: localStorage.getItem("temper") || "--°C",
    humid: localStorage.getItem("humid") || "--%",
    light: localStorage.getItem("light") || "--",
  });

  const [on, setOns] = useState({
    light: localStorage.getItem("light_status") || "0",
    fan: localStorage.getItem("fan_status") || "0",
    air: localStorage.getItem("air_status") || "0",
  });

  useEffect(() => {
    socket.on("mqttMessage", (data) => {
      if (data.topic == "home/sensor") {
        try {
          // Parse MQTT message to JSON
          console.log(data);
          const messagejson = JSON.parse(data.message);

          // Extract the values and round the temperature
          const newTemper = Math.round(messagejson.temperature) || "--";
          const newHumid = messagejson.humidity || "--";
          const newLight = messagejson.light_level || "--";
          const light_status = messagejson.light || "0";
          const fan_status = messagejson.fan || "0";
          const air_status = messagejson.air_conditioner || "0";

          // Update state with the new values
          setStats({
            temper: `${newTemper}°C`,
            humid: `${newHumid}%`,
            light: `${newLight}`,
          });

          setOns({
            light: light_status,
            fan: fan_status,
            air: air_status,
          });

          // Save data to localStorage
          localStorage.setItem("temper", `${newTemper}°C`);
          localStorage.setItem("humid", `${newHumid}%`);
          localStorage.setItem("light", newLight);

          localStorage.setItem("light_status", light_status);
          localStorage.setItem("fan_status", fan_status);
          localStorage.setItem("air_status", air_status);
        } catch (error) {
          console.error("Error parsing MQTT message:", error);
        }
      } else {
        const messagejson = JSON.parse(data.message);
        if (data.topic == "light_status") {
          localStorage.setItem("light_status", messagejson.status);
          setOns({
            light: messagejson.status,
            fan: localStorage.getItem("fan_status") || "0",
            air: localStorage.getItem("air_status") || "0",
          });
        } else if (data.topic == "fan_status") {
          localStorage.setItem("fan_status", messagejson.status);
          setOns({
            fan: messagejson.status,
            light: localStorage.getItem("light_status") || "0",
            air: localStorage.getItem("air_status") || "0",
          });
        } else if (data.topic == "air_status") {
          localStorage.setItem("air_status", messagejson.status);
          setOns({
            air: messagejson.status,
            light: localStorage.getItem("light_status") || "0",
            fan: localStorage.getItem("fan_status") || "0",
          });
        }
      }
    });

    // Cleanup listener on component unmount
    return () => {
      socket.off("mqttMessage");
    };
  }, []);

  // const []

  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [view, setView] = useState(localStorage.getItem("view") || "temper");
  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header
          title="TỔNG QUAN"
          subtitle="Dữ liệu tổng quan về ngôi nhà của bạn"
        />
      </FlexBetween>
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}
        <StatBox
          title="Chung"
          value="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
          description="null"
          icon={
            <BlurOnOutlined
              sx={{ color: theme.palette.neutral[0], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Nhiệt độ"
          //value={data && data.todayStats.totalSales}
          value={stats.temper}
          icon={
            <WhatshotOutlined
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
          description="temper"
        />
        <StatBox
          title="Độ ẩm"
          //value={data && data.thisMonthStats.totalSales}
          value={stats.humid}
          icon={
            <WaterDropOutlined
              sx={{ color: theme.palette.xanhduong[300], fontSize: "26px" }}
            />
          }
          description="humid"
        />
        <StatBox
          title="Ánh sáng"
          //value={data && data.yearlySalesTotal}
          value={stats.light}
          icon={
            <LightModeOutlined
              sx={{ color: theme.palette.vang[300], fontSize: "26px" }}
            />
          }
          description="light"
        />
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={theme.palette.primary[500]}
          p="1.5rem"
          borderRadius="1.5rem"
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)" // 2 columns
          gridTemplateRows="repeat(8, 1fr)" // 8 rows
          gap="calc(1rem + 2%)"
          sx={{
            boxShadow: "0px 4px 6px rgba(255, 255, 255, 0.5)",
            transition: "box-shadow 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: theme.palette.primary[500],
            },
            "@media (max-width: 600px)": {
              gridTemplateColumns: "1fr", // 1 column on smaller screens
            },
          }}
        >
          <SwitchBox title="Đèn" status={on.light} icon={<LightOutlined />} />
          <SwitchBox
            title="Quạt"
            status={on.fan}
            icon={<WindPowerOutlined />}
          />
          <SwitchBox
            title="Điều hòa"
            status={on.air}
            icon={<AcUnitOutlined />}
          />
          {/* <SwitchBox
            title="Thêm"
            //value={data && data.yearlySalesTotal}
            icon={<AddOutlined />}
          /> */}
        </Box>
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="1.5rem"
          sx={{
            boxShadow: "0px 4px 6px rgba(255, 255, 255, 0.5)",
            transition: "box-shadow 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: theme.palette.primary[500],
            },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box height="95%">
            <OverviewChart view={view} isDashboard={true} />
          </Box>

          <Box
            display="flex"
            sx={{
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <Button
              onClick={() => {
                setView("temper");
                localStorage.setItem("view", "temper");
              }}
              sx={{
                backgroundColor: theme.palette.secondary[300],
                textTransform: "none",
                padding: "0 0",
                "&:hover": {
                  backgroundColor: theme.palette.secondary[400],
                },
              }}
            >
              <Typography variant="h7">Nhiệt độ</Typography>
            </Button>
            <Button
              onClick={() => {
                setView("humid");
                localStorage.setItem("view", "humid");
              }}
              sx={{
                backgroundColor: theme.palette.xanhduong[300],
                textTransform: "none",
                padding: "0 0",
                "&:hover": {
                  backgroundColor: theme.palette.xanhduong[400],
                },
              }}
            >
              <Typography variant="h7">Độ ẩm</Typography>
            </Button>
            <Button
              onClick={() => {
                setView("light");
                localStorage.setItem("view", "light");
              }}
              sx={{
                backgroundColor: theme.palette.vang[300],
                textTransform: "none",
                padding: "0 0",
                "&:hover": {
                  backgroundColor: theme.palette.vang[400],
                },
              }}
            >
              <Typography variant="h7">Ánh sáng</Typography>
            </Button>
          </Box>
        </Box>

        {/* ROW 2 */}
      </Box>
    </Box>
  );
};

export default Dashboard;
