import { useState, useEffect } from "react";
import { ListingCore } from "data/Listing";

export function useListings() {
  const [listings, setListings] = useState<ListingCore[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      const lists = await window.api.listListings();
      if (typeof lists === "string") {
        console.log(lists);
        return;
      }

      setListings(lists);
    };

    fetchListings().catch(console.error);
  });

  return listings;
}
