import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        `Password reset link sent to ${email}. Please check your inbox or spam folder.`
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  return (
    <div className="flex justify-center items-center mt-10 mb-10 px-4">
      <div className="card w-full max-w-md px-8 py-8">
        <h1 className="text-lg md:text-xl font-semibold mb-4">
          Reset your password
        </h1>

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

          {message && (
            <p className="text-xs text-emerald-600 mb-3">{message}</p>
          )}
          {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

          <button
            type="submit"
            className="btn-primary w-full py-2.5 bg-emerald-500 mb-3"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-xs text-center text-slate-600">
          <Link to="/" className="text-emerald-600 font-medium">
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
