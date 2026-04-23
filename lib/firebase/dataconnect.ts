// Data Connect was removed in favor of Firestore.
// Keep this compatibility module so existing imports do not crash at runtime.
export const isDataConnectReady = false;

export async function callDC<TData, TFallback = null>(
  _fn: () => Promise<{ data: TData | null }>,
  opts: { fallback?: TFallback } = {}
): Promise<{ data: TData | TFallback | null; error: Error | null; live: boolean }> {
  return { data: (opts.fallback ?? null) as TFallback, error: null, live: false };
}
