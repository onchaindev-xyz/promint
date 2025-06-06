// /src/hooks/useEnvironment.ts
"use client";

import { useEffect, useState } from "react";
import { sdk } from "@farcaster/frame-sdk";

// Cache global pour éviter de rappeler sdk.isInMiniApp plusieurs fois
let cachedIsMiniApp: boolean | null = null;
let isChecking = false;
let listeners: ((val: boolean) => void)[] = [];

export function useEnvironment(): { isMiniApp: boolean; isWeb: boolean } {
  const [isMiniApp, setIsMiniApp] = useState<boolean>(false);

  useEffect(() => {
    if (cachedIsMiniApp !== null) {
      setIsMiniApp(cachedIsMiniApp);
      return;
    }

    // Ajoute un listener pour mise à jour lorsque le résultat async est résolu
    listeners.push(setIsMiniApp);

    if (!isChecking) {
      isChecking = true;
      sdk.isInMiniApp()
        .then((result) => {
          cachedIsMiniApp = result;
          listeners.forEach((fn) => fn(result));
          listeners = [];
        })
        .catch((error) => {
          console.error("Failed to detect miniapp context:", error);
          listeners = [];
        })
        .finally(() => {
          isChecking = false;
        });
    }
  }, []);

  return {
    isMiniApp,
    isWeb: !isMiniApp,
  };
}
