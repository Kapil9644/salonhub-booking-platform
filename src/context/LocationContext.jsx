import { createContext, useContext, useState } from "react";

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(() => {
    const savedLocation = localStorage.getItem("salonhub_location");

    if (!savedLocation) {
      return null;
    }

    try {
      return JSON.parse(savedLocation);
    } catch (error) {
      console.error("Failed to load saved location:", error);
      localStorage.removeItem("salonhub_location");
      return null;
    }
  });

  const [locationStatus, setLocationStatus] = useState(() => {
    return localStorage.getItem("salonhub_location") ? "success" : "idle";
  });

  const [locationError, setLocationError] = useState("");

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("unsupported");
      setLocationError("Location is not supported by this browser.");
      return;
    }

    setLocationStatus("loading");
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );

          if (!response.ok) {
            throw new Error("Failed to fetch location details.");
          }

          const data = await response.json();

          setLocation({
            latitude,
            longitude,
            accuracy,
            city: data.city || data.locality || "",
            state: data.principalSubdivision || "",
            country: data.countryName || "",
            postcode: data.postcode || "",
          });

          localStorage.setItem(
            "salonhub_location",
            JSON.stringify({
              latitude,
              longitude,
              accuracy,
              city: data.city || data.locality || "",
              state: data.principalSubdivision || "",
              country: data.countryName || "",
              postcode: data.postcode || "",
            }),
          );

          setLocationStatus("success");
        } catch (error) {
          console.error("Reverse geocoding error:", error);

          setLocation({
            latitude,
            longitude,
            accuracy,
          });

          setLocationStatus("success");
          setLocationError("Could not determine your exact location name.");
        }
      },
      (error) => {
        setLocationStatus("error");

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location permission was denied.");
            break;

          case error.POSITION_UNAVAILABLE:
            setLocationError("Your location is currently unavailable.");
            break;

          case error.TIMEOUT:
            setLocationError("Location request timed out.");
            break;

          default:
            setLocationError("Unable to determine your location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  };

  const selectLocation = (selectedLocation) => {
    setLocation(selectedLocation);
    setLocationStatus("success");
    setLocationError("");

    localStorage.setItem("salonhub_location", JSON.stringify(selectedLocation));
  };

  const value = {
    location,
    locationStatus,
    locationError,
    requestLocation,
    selectLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }

  return context;
}
