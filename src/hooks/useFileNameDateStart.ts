import { useState, useEffect, useCallback } from "react";

export function useFileNameDateStart() {
  const [fileNameDateStart, internalSetDateStart] = useState<"year" | "day">(
    "year"
  );

  useEffect(() => {
    const fetchDateStart = async () => {
      const result = await window.api.getFileNameDateStart();
      internalSetDateStart(result);
    };

    fetchDateStart().catch(console.error);
  }, []);

  const setFileNameDateStart = useCallback(
    async (start: "year" | "day") => {
      await window.api.setFileNameDateStart(start);
      internalSetDateStart(start);
    },
    [window.api.setFileNameDateStart]
  );

  return [fileNameDateStart, setFileNameDateStart] as const;
}
