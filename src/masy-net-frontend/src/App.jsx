import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import LandingPage from "./pages/LandingPage";
import ManajemenPage from "./pages/ManajemenPage";
import TimelineHistory from "./pages/TimelineHistory";
import DashboardAnalytics from "./pages/Dashboard";

function App() {
  return (
    <div>
      <Navbar/>
      <LandingPage/>
      <Footer/>
      <ManajemenPage/>
      <DashboardAnalytics/>
      <TimelineHistory/>
    </div>
  );
}

export default App;
