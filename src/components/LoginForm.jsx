import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      // ✅ Real Firebase login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Optional: check if email is verified
      // if (!user.emailVerified) {
      //   setError("Please verify your email before logging in.");
      //   setLoading(false);
      //   return;
      // }

      // Same behaviour as before: go to /home
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);

      let message = "Failed to login. Please check your email and password.";

      if (err.code === "auth/invalid-email") {
        message = "Invalid email address.";
      } else if (err.code === "auth/user-not-found") {
        message = "No account found with this email.";
      } else if (err.code === "auth/wrong-password") {
        message = "Incorrect password.";
      } else if (err.code === "auth/too-many-requests") {
        message =
          "Too many failed attempts. Please try again after some time.";
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center mt-10 mb-10 px-4">
      <div className="card w-full max-w-md px-10 py-10">
        {/* Header with logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-3 overflow-hidden">
            <img
              src={logo}
              alt="App Logo"
              className="h-12 w-12 object-contain"
            />
          </div>
          <h1 className="text-lg md:text-xl font-semibold mb-1">
            Smart Public Bus Tracker
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Find your bus in seconds.
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            className="input mb-4"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block text-xs font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            className="input mb-1"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Forgot password link */}
          <p className="text-[11px] text-right mb-4">
            <Link to="/forgot-password" className="text-emerald-600 font-medium">
              Forgot password?
            </Link>
          </p>

          {/* Error message */}
          {error && (
            <p className="text-xs text-red-600 mb-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`btn-primary w-full py-2.5 bg-emerald-500 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-xs text-center mt-4 text-slate-600">
          Do not have an account?{" "}
          <Link to="/register" className="text-emerald-600 font-medium">
            Create New Account
          </Link>
        </p>
      </div>
    </div>
  );
}
