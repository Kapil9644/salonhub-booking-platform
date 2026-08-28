import { createContext, useState } from "react";

export const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem("admin");

    if (!storedAdmin) {
      return null;
    }

    try {
      return JSON.parse(storedAdmin);
    } catch (error) {
      console.error("Failed to restore admin session:", error);
      localStorage.removeItem("admin");
      localStorage.removeItem("adminToken");
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const login = (adminData, token) => {
    localStorage.setItem("admin", JSON.stringify(adminData));
    localStorage.setItem("adminToken", token);

    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");

    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}
