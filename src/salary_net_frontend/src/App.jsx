import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";

import LandingPage from "./pages/LandingPage";
import ManagementPage from "./pages/ManagementPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/management" element={<ManagementPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
