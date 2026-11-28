import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// False on the server and during hydration, so browser-only state never causes a mismatch.
export const useHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
