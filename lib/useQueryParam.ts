"use client";

import { useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  window.addEventListener("popstate", cb);
  return () => window.removeEventListener("popstate", cb);
};

/**
 * Reads one query parameter without opting the page out of static prerendering
 * (useSearchParams would client-render everything up to the nearest Suspense).
 * Returns null during prerender and on the first hydration pass.
 */
export function useQueryParam(name: string) {
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );
  return new URLSearchParams(search).get(name);
}
