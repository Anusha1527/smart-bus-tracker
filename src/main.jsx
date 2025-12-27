import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { BusDataProvider } from "./context/BusDataContext";
import { UserHistoryProvider } from "./context/UserHistoryContext";
import { AuthProvider } from "./AuthProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BusDataProvider>
          <UserHistoryProvider>
            <App />
          </UserHistoryProvider>
        </BusDataProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
