// src/pages/Admin.jsx
import { useState } from "react";
import { uploadRoutesToFirestoreOnce } from "../utils/uploadRoutesToFirestore";

export default function Admin() {
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    setLoading(true);
    await uploadRoutesToFirestoreOnce();
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <div className="card p-6">
        <h1 className="text-lg font-semibold mb-3">Admin – Routes Setup</h1>
        <p className="text-sm text-slate-600 mb-4">
          Click this button once to copy all routes from <code>routesData.js</code> 
          into Firestore collection <code>routes</code>.
        </p>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="btn-primary bg-emerald-500 px-4 py-2"
        >
          {loading ? "Uploading..." : "Upload Routes to Firestore"}
        </button>

        <p className="text-xs text-slate-500 mt-3">
          After successful upload, normal users don’t need this page.
        </p>
      </div>
    </div>
  );
}
