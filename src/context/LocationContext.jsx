import { createContext, useContext, useEffect, useRef, useState } from "react";

const LocationContext = createContext(null);

const STORAGE_KEY = "salonhub_location";

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(() => {
    const savedLocation = localStorage.getItem(STORAGE_KEY);

    if (!savedLocation) {
      return null;
    }

    try {
      return JSON.parse(savedLocation);
    } catch (error) {
      console.error("Failed to load saved location:", error);

      localStorage.removeItem(STORAGE_KEY);

      return null;
    }
  });

  const [locationStatus, setLocationStatus] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) ? "success" : "idle";
  });

  const [locationError, setLocationError] = useState("");

  /*
   * Stores the browser watch ID so we can stop
   * watching when the provider unmounts.
   */
  const watchIdRef = useRef(null);

  /*
   * Prevents an automatic GPS update from
   * immediately overwriting a location selected
   * manually through LocationPicker.
   */
  const manualLocationRef = useRef(false);

  // ==================================================
  // SAVE LOCATION
  // ==================================================

  const saveLocation = (nextLocation) => {
    setLocation(nextLocation);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLocation));
  };

  // ==================================================
  // REVERSE GEOCODE GPS LOCATION
  // ==================================================

  const updateGpsLocation = async (position) => {
    const { latitude, longitude, accuracy } = position.coords;

    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch location details.");
      }

      const data = await response.json();

      const nextLocation = {
        latitude,
        longitude,
        accuracy,
        city: data.city || data.locality || "",
        state: data.principalSubdivision || "",
        country: data.countryName || "",
        postcode: data.postcode || "",
      };

      saveLocation(nextLocation);

      setLocationStatus("success");
      setLocationError("");
    } catch (error) {
      console.error("Reverse geocoding error:", error);

      /*
       * Even if reverse geocoding fails,
       * keep the GPS coordinates because
       * Top Picks can still calculate distance.
       */
      const nextLocation = {
        latitude,
        longitude,
        accuracy,
      };

      saveLocation(nextLocation);

      setLocationStatus("success");

      setLocationError("Could not determine your exact location name.");
    }
  };

  // ==================================================
  // START GPS WATCH
  // ==================================================

  const startLocationWatch = () => {
    if (!navigator.geolocation) {
      setLocationStatus("unsupported");

      setLocationError("Location is not supported by this browser.");

      return;
    }

    /*
     * Stop an existing watcher before creating
     * another one.
     */
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    setLocationStatus("loading");
    setLocationError("");

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        /*
         * If customer manually selected a location,
         * don't immediately replace it with GPS.
         */
        if (manualLocationRef.current) {
          return;
        }

        updateGpsLocation(position);
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

        /*
         * Browser may deliver updates when
         * the position changes significantly.
         */
        maximumAge: 30000,

        /*
         * Keep the request from hanging forever.
         */
        timeout: 15000,
      },
    );
  };

  // ==================================================
  // REQUEST LOCATION
  // ==================================================

  const requestLocation = () => {
    manualLocationRef.current = false;

    startLocationWatch();
  };

  // ==================================================
  // MANUAL LOCATION SELECTION
  // ==================================================

  const selectLocation = (selectedLocation) => {
    /*
     * Remember that the user explicitly selected
     * this location.
     */
    manualLocationRef.current = true;

    saveLocation(selectedLocation);

    setLocationStatus("success");
    setLocationError("");
  };

  // ==================================================
  // INITIAL LOCATION WATCH
  // ==================================================

  useEffect(() => {
    /*
     * Don't automatically request browser GPS
     * permission on page load.
     *
     * Existing saved location remains available.
     *
     * requestLocation() is still called by the
     * existing Location UI when the user asks for it.
     */
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);

        watchIdRef.current = null;
      }
    };
  }, []);

  // ==================================================
  // CONTEXT VALUE
  // ==================================================

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
    throw new Error("useLocation must be used within LocationProvider");
  }

  return context;
}
