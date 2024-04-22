import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TrackOrder from "./components/TrackOrder"; // Asegúrate de crear este componente
import "./assets/styles/main.css";
import "antd/dist/reset.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/order/:orderId" element={<TrackOrder />} />
      </Routes>
    </Router>
  );
}

export default App;
