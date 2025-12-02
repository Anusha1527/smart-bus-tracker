import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

export default function CreateAccountForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validatePassword(pw) {
    if (pw.length < 8) return "Must be 8+ characters long.";
    if (!/[A-Z]/.test(pw)) return "Include at least one uppercase letter.";
    if (!/[a-z]/.test(pw)) return "Include at least one lowercase letter.";
    if (!/[0-9]/.test(pw)) return "Include at least one number.";
    if (!/[!@#$%&*]/.test(pw))
      return "Include at least one special symbol (!@#$%&*).";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const pw = form.password.value;
    const confirm = form.confirm.value;

    // 1) Front-end validation (same as before)
    const validationError = validatePassword(pw);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (pw !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // 2) Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pw
      );

      const user = userCredential.user;

      // 3) Send verification / thank-you email
      // You can edit email content in Firebase Console → Authentication → Templates
      if (user) {
        await sendEmailVerification(user, {
          url: window.location.origin + "/verify-success", // after clicking email, user comes here
          handleCodeInApp: false,
        });
      }

      // 4) Same flow as before: alert + go to login
      alert(
        `Account created successfully, ${name}! 🎉\n\nWe’ve sent a verification / welcome email to your inbox. Please check it and then login.`
      );
      navigate("/"); // back to login page

    } catch (err) {
      console.error("Error creating account:", err);
      let message = "Failed to create account. Please try again.";

      if (err.code === "auth/email-already-in-use") {
        message = "This email is already registered. Try logging in instead.";
      } else if (err.code === "auth/invalid-email") {
        message = "Invalid email address.";
      } else if (err.code === "auth/weak-password") {
        message =
          "Password is too weak. Try adding more characters and symbols.";
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center mt-10 mb-10 px-4">
      <div className="card w-full max-w-md px-8 py-8">
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
            <span className="text-emerald-500 text-xl">🚌</span>
          </div>
          <h1 className="text-lg md:text-xl font-semibold mb-1">
            Create New Account
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Join Smart Public Bus Tracker today
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Name
          </label>
          <input
            name="name"
            className="input mb-3"
            placeholder="John Doe"
            required
          />

          <label className="block text-xs font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            name="email"
            className="input mb-3"
            type="email"
            placeholder="your@email.com"
            required
          />

          <label className="block text-xs font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            name="password"
            className="input mb-1"
            type="password"
            required
          />
          <p className="text-[11px] text-slate-500 mb-3">
            Must be 8+ chars with uppercase, lowercase, number, and special
            symbol (!@#$%&*).
          </p>

          <label className="block text-xs font-medium text-slate-700 mb-1">
            Confirm Password
          </label>
          <input
            name="confirm"
            className="input mb-3"
            type="password"
            required
          />

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
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-xs text-center mt-4 text-slate-600">
          Already have an account?{" "}
          <Link to="/" className="text-emerald-600 font-medium">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
