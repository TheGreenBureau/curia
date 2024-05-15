import { Defaults } from "config";
import { useState, useEffect, useCallback } from "react";

export function useDefaults() {
  const [defaults, internalSetDefaults] = useState<Defaults>({});

  useEffect(() => {
    const fetchDefaults = async () => {
      const result = await window.api.getDefaults();

      if (typeof result === "string") {
        console.log(result);
        return;
      }

      internalSetDefaults(result);
    };

    fetchDefaults().catch(console.error);
  }, []);

  const setDefaults = useCallback(
    async (defaults: Defaults) => {
      const result = await window.api.setDefaults(defaults);

      if (typeof result === "string") {
        console.log(result);
        return;
      }

      internalSetDefaults(defaults);
    },
    [window.api.setDefaults]
  );

  return [defaults, setDefaults] as const;
}
