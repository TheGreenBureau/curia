import { useState, useEffect, useCallback } from "react";

export function useListingsLocation() {
  const [listingsLocation, setListingsLocation] = useState("");
  const [isDefaultLocation, setIsDefaultLocation] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      const result = await window.api.getListingsLocation();

      setListingsLocation(result.dbLocation);
      setIsDefaultLocation(result.isDefault);
    };

    fetchLocation().catch(console.error);
  }, []);

  const chooseLocation = useCallback(async () => {
    const result = await window.api.setListingsLocation();
    if (typeof result === "string") {
      console.log(result);
      return;
    }

    const listingResult = await window.api.getListingsLocation();
    setListingsLocation(listingResult.dbLocation);
    setIsDefaultLocation(listingResult.isDefault);
  }, [window.api.getListingsLocation, window.api.setListingsLocation]);

  const setLocationToDefault = useCallback(async () => {
    if (isDefaultLocation) return;

    const result = await window.api.setDefaultListingsLocation();
    if (typeof result === "string") {
      console.log(result);
      return;
    }

    const listingResult = await window.api.getListingsLocation();
    setListingsLocation(listingResult.dbLocation);
    setIsDefaultLocation(listingResult.isDefault);
  }, [window.api.setDefaultListingsLocation, window.api.getListingsLocation]);

  return [
    listingsLocation,
    chooseLocation,
    isDefaultLocation,
    setLocationToDefault,
  ] as const;
}
