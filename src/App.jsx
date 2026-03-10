import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import TrackOrder from "./components/TrackOrder"; // Asegúrate de crear este componente
import "./assets/styles/main.css";
import "antd/dist/reset.css";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#016066",
          colorInfo: "#016066",
          colorSuccess: "#1f8f55",
          colorWarning: "#d98e04",
          colorError: "#e30615",
          colorTextBase: "#1f2328",
          colorBgBase: "#f4f7f7",
          colorBorder: "rgba(31, 35, 40, 0.12)",
          colorBorderSecondary: "rgba(31, 35, 40, 0.08)",
          borderRadius: 12,
          borderRadiusLG: 18,
          fontFamily:
            "'Aptos', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
        },
        components: {
          Layout: {
            bodyBg: "#f4f7f7",
            headerBg: "#f4f7f7",
            footerBg: "#f4f7f7"
          },
          Card: {
            colorBgContainer: "#ffffff"
          },
          Collapse: {
            headerBg: "#f7fbfb",
            contentBg: "#ffffff"
          },
          Steps: {
            colorPrimary: "#016066",
            colorTextDescription: "rgba(31, 35, 40, 0.6)"
          },
          Tag: {
            defaultBg: "#f0eadf",
            defaultColor: "#4a4f57"
          }
        }
      }}
    >
      <Router>
        <Routes>
          <Route path="/order/:orderId" element={<TrackOrder />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
