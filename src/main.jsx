import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { LocationProvider } from "./context/LocationContext";
import { SalonOwnerAuthProvider } from "./context/SalonOwnerAuthContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <SalonOwnerAuthProvider>
        <LocationProvider>
          <AdminAuthProvider>
            <App />
          </AdminAuthProvider>
        </LocationProvider>
      </SalonOwnerAuthProvider>
    </AuthProvider>
  </StrictMode>,
);
