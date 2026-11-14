"use client";

import { useCallback, useSyncExternalStore } from "react";

export default function useMediaQuery(query, serverSnapshot = false) {
  const subscribe = useCallback(
    (listener) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    },
    [query],
  );
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => serverSnapshot, [serverSnapshot]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
