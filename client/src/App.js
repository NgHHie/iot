import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "scenes/layout";
import Dashboard from "scenes/dashboard";
import Transactions from "scenes/transactions";
import Histories from "scenes/histories";

function App() {
  // const [messages, setMessages] = useState([]);

  // useEffect(() => {
  //   socket.on("mqttMessage", (data) => {
  //     console.log("Received MQTT message:", data);
  //     setMessages((prevMessages) => [...prevMessages, data]);
  //   });

  //   return () => {
  //     socket.off("mqttMessage"); // Cleanup listener on component unmount
  //   };
  // }, []);

  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/overview" element={<Navigate to="/" replace />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/data" element={<Transactions />} />
              <Route path="/histories" element={<Histories />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
