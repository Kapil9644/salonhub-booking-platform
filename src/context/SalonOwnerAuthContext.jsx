import { createContext, useContext, useEffect, useState } from "react";

const SalonOwnerAuthContext = createContext();

export function SalonOwnerAuthProvider({ children }) {
  const [salonOwner, setSalonOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedSalonOwner = localStorage.getItem("salonOwnerUser");

    if (storedSalonOwner) {
      setSalonOwner(JSON.parse(storedSalonOwner));
    }

    setLoading(false);
  }, []);

  const loginSalonOwner = (userData, token) => {
    localStorage.setItem("salonOwnerUser", JSON.stringify(userData));
    localStorage.setItem("salonOwnerToken", token);

    setSalonOwner(userData);
  };

  const updateSalonOwner = (userData) => {
    localStorage.setItem("salonOwnerUser", JSON.stringify(userData));

    setSalonOwner(userData);
  };

  const logoutSalonOwner = () => {
    localStorage.removeItem("salonOwnerUser");
    localStorage.removeItem("salonOwnerToken");

    setSalonOwner(null);
  };

  return (
    <SalonOwnerAuthContext.Provider
      value={{
        salonOwner,
        loginSalonOwner,
        updateSalonOwner,
        logoutSalonOwner,
        loading,
      }}
    >
      {children}
    </SalonOwnerAuthContext.Provider>
  );
}

export function useSalonOwnerAuth() {
  return useContext(SalonOwnerAuthContext);
}
