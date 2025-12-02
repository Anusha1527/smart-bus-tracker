import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import BusDetails from "./pages/BusDetails";
import About from "./pages/About";
import VerifySuccess from "./pages/VerifySuccess";
import ForgotPassword from "./pages/ForgotPassword";
import Admin from "./pages/Admin";   

function App() {
  const location = useLocation();

  // Hide navbar on auth-related pages
  const hideNavbarOnPaths = ["/", "/register", "/forgot-password", "/verify-success"];
  const shouldShowNavbar = !hideNavbarOnPaths.includes(location.pathname);

  return (
    <div className="min-h-screen">
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
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<Admin />} />   {/* temporary */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
