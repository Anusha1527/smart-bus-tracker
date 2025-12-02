import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";   // or your exact filename

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-emerald-500 text-white"
      : "bg-slate-100 text-slate-700";

  const loggedIn = location.pathname !== "/" && location.pathname !== "/register";

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

        {/* Nav pills */}
        <nav className="flex items-center gap-3 text-xs">
          <Link
            to="/home"
            className={`px-3 py-1 rounded-full ${isActive("/home")}`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`px-3 py-1 rounded-full ${isActive("/about")}`}
          >
            About
          </Link>

          {loggedIn && (
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
