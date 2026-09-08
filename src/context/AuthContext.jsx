import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const isSalonOwnerPortal = () => {
  return window.location.pathname.startsWith("/salon-owner");
};

const getStorageKeys = () => {
  if (isSalonOwnerPortal()) {
    return {
      userKey: "salonOwnerUser",
      tokenKey: "salonOwnerToken",
    };
  }

  return {
    userKey: "user",
    tokenKey: "token",
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { userKey } = getStorageKeys();
    const storedUser = localStorage.getItem(userKey);

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem(userKey);
      }
    }

    setLoading(false);
  }, []);

  const login = (userData, token) => {
    const { userKey, tokenKey } = getStorageKeys();

    localStorage.setItem(userKey, JSON.stringify(userData));
    localStorage.setItem(tokenKey, token);

    setUser(userData);
  };

  const updateUser = (userData) => {
    const { userKey } = getStorageKeys();

    localStorage.setItem(userKey, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    const { userKey, tokenKey } = getStorageKeys();

    localStorage.removeItem(userKey);
    localStorage.removeItem(tokenKey);

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        updateUser,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
