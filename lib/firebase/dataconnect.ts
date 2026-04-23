import {
  connectDataConnectEmulator,
  getDataConnect,
  type DataConnect,
} from "firebase/data-connect";
import * as generated from "@dataconnect/generated";
import { getFirebaseApp } from "./config";

// `generated.__stub` is true until `firebase dataconnect:sdk:generate` replaces
// the stub package with a real generated SDK. We use this flag to skip network
// calls (they would fail) and let the app fall back to demo content.
export const isDataConnectReady: boolean = !generated.__stub;

export function getDC(): DataConnect {
  const dc = getDataConnect(getFirebaseApp(), generated.connectorConfig);
  if (
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_USE_DC_EMULATOR === "1"
  ) {
    try {
      connectDataConnectEmulator(dc, "localhost", 9399);
    } catch {
      // Already connected — ignore.
    }
  }
  return dc;
}

/**
 * Wrap a generated SDK call so that:
 *   - stub mode     → resolve with `fallback`
 *   - network error → log + resolve with `fallback`
 *   - success       → resolve with mapped data
 *
 * Every call site gets a consistent `{ data, error }` shape.
 */
export async function callDC<TData, TFallback = null>(
  fn: () => Promise<{ data: TData | null }>,
  opts: { fallback?: TFallback; label?: string } = {}
): Promise<{ data: TData | TFallback | null; error: Error | null; live: boolean }> {
  if (!isDataConnectReady) {
    return { data: (opts.fallback ?? null) as TFallback, error: null, live: false };
  }
  try {
    const res = await fn();
    return { data: (res?.data ?? opts.fallback ?? null) as TData, error: null, live: true };
  } catch (error) {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.warn(`[DataConnect] ${opts.label ?? "call"} failed:`, error);
    }
    return {
      data: (opts.fallback ?? null) as TFallback,
      error: error as Error,
      live: false,
    };
  }
}
