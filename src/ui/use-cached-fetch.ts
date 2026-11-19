import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

const DEFAULT_STALE_MS = 60_000;

interface CacheEntry {
  data?: unknown;
  error?: Error;
  fetchedAt: number;
  pending?: Promise<unknown>;
}

const entries = new Map<string, CacheEntry>();
const listeners = new Map<string, Set<() => void>>();

function update(key: string, next: CacheEntry) {
  entries.set(key, next);
  for (const listener of listeners.get(key) ?? []) listener();
}

function subscribe(key: string, listener: () => void) {
  const set = listeners.get(key) ?? new Set();
  set.add(listener);
  listeners.set(key, set);
  return () => {
    set.delete(listener);
    if (set.size === 0) listeners.delete(key);
  };
}

function isStale(entry: CacheEntry | undefined, staleMs: number) {
  return !entry || Date.now() - entry.fetchedAt >= staleMs;
}

function load(key: string, fetcher: () => Promise<unknown>): Promise<unknown> {
  const current = entries.get(key);
  if (current?.pending) return current.pending;
  const pending = fetcher().then(
    (data) => {
      update(key, { data, fetchedAt: Date.now() });
      return data;
    },
    (cause: unknown) => {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      update(key, {
        data: entries.get(key)?.data,
        error,
        fetchedAt: Date.now(),
      });
      throw error;
    },
  );
  update(key, { ...current, fetchedAt: current?.fetchedAt ?? 0, pending });
  return pending;
}

export function invalidateCached(key: string) {
  const current = entries.get(key);
  if (current) update(key, { ...current, fetchedAt: 0 });
}

export interface CachedFetchOptions {
  staleMs?: number;
}

export function useCachedFetch<T>(
  key: string | null,
  fetcher: () => Promise<T>,
  { staleMs = DEFAULT_STALE_MS }: CachedFetchOptions = {},
) {
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const entry = useSyncExternalStore(
    useCallback(
      (listener: () => void) => (key ? subscribe(key, listener) : () => {}),
      [key],
    ),
    () => (key ? entries.get(key) : undefined),
    () => (key ? entries.get(key) : undefined),
  );

  const revalidateIfStale = useCallback(() => {
    if (!key) return;
    const current = entries.get(key);
    if (!current?.pending && isStale(current, staleMs)) {
      load(key, () => fetcherRef.current()).catch(() => undefined);
    }
  }, [key, staleMs]);

  useEffect(() => {
    if (key && !entry?.pending && isStale(entry, staleMs)) {
      load(key, () => fetcherRef.current()).catch(() => undefined);
    }
  }, [key, staleMs, entry]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") revalidateIfStale();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", revalidateIfStale);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", revalidateIfStale);
    };
  }, [revalidateIfStale]);

  const refresh = useCallback(() => {
    if (!key) return Promise.resolve(undefined);
    invalidateCached(key);
    return load(key, () => fetcherRef.current()) as Promise<T>;
  }, [key]);

  return {
    data: entry?.data as T | undefined,
    error: entry?.error,
    loading: Boolean(entry?.pending),
    refresh,
  };
}
