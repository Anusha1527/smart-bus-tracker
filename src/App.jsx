import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import busBg from "./assets/bus-bg.jpg";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import BusDetails from "./pages/BusDetails";
import About from "./pages/About";
import VerifySuccess from "./pages/VerifySuccess";
import ForgotPassword from "./pages/ForgotPassword";
import Admin from "./pages/Admin";
import UserHistory from "./pages/UserHistory";   

function App() {
  const location = useLocation();

  // Hide navbar on auth-related pages
  const hideNavbarOnPaths = ["/", "/register", "/forgot-password", "/verify-success"];
  const shouldShowNavbar = !hideNavbarOnPaths.includes(location.pathname);

  const appBgStyle = shouldShowNavbar
    ? {
        backgroundImage: `url(${busBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }
    : undefined;

  return (
    <div className="min-h-screen" style={appBgStyle}>
      {shouldShowNavbar && <Navbar />}

      <div className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          {/* Auth routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-success" element={<VerifySuccess />} />

          {/* Main app routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/bus/:busId" element={<BusDetails />} />
          <Route path="/history" element={<UserHistory />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<Admin />} />   {/* temporary */}
        </Routes>
      </div>
      {shouldShowNavbar && <Footer />}
    </div>
  );
}

export default App;
