import { useState, useEffect } from "react";
import { ListingCore } from "data/Listing";

export function useRecents() {
  const [recents, setRecents] = useState<ListingCore[]>([]);

  useEffect(() => {
    const fetchRecents = async () => {
      const recent = await window.api.listRecent();
      if (typeof recent === "string") {
        console.log(recent);
        return;
      }

      setRecents(recent);
    };

    fetchRecents().catch(console.error);
  }, []);

  return recents;
}
