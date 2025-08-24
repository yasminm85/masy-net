import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthDesc, AuthProvider } from "./context/AuthContext";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import ManajemenPage from "./pages/ManajemenPage";

const Protected = ({children}) => {
  const { isAuthenticated, loading} = AuthDesc();

  if(loading) {
    return (
      <div className="min-h-screen bg-richBlack flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/management" element={<ManajemenPage />} />
      </Routes>
      <Footer />
    </Router>
    </AuthProvider>
  );
}

export default App;
