import { Link } from "react-router-dom";

export default function VerifySuccess() {
  return (
    <div className="flex justify-center items-center mt-10 mb-10 px-4">
      <div className="card w-full max-w-md px-8 py-8 text-center">
        <h1 className="text-lg md:text-xl font-semibold mb-2">
          Email Verified ✅
        </h1>
        <p className="text-xs md:text-sm text-slate-600 mb-4">
          Your email has been successfully verified. You can now log in to Smart Public Bus Tracker.
        </p>

        <Link
          to="/"
          className="inline-block btn-primary px-6 py-2.5 bg-emerald-500 text-sm font-medium"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
