import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import ProfileSidebar from "./ProfileSidebar";

export default function Navbar() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Demo mode removed — real-time behavior only

  const loggedIn = true; // Simplified - user profile only shown when logged in


  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo + name */}
        <button
          onClick={() => navigate(loggedIn ? "/home" : "/")}
          className="flex items-center gap-2"
        >
          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <img src={logo} alt="Logo" className="h-15 w-50" />
          </div>
          <span className="font-semibold text-[15px]">Smart Bus Tracker</span>
        </button>

        {/* User Profile Icon */}
        <div className="flex items-center">
          {loggedIn && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-full hover:bg-slate-100 transition"
              title="User Profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-slate-700"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Profile Sidebar */}
      <ProfileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </header>
  );
}