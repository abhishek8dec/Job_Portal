/**
 * In-Memory High-Concurrency Cache with TTL & Cache Invalidation
 * Designed to handle 1,000+ simultaneous requests with sub-millisecond response times
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class FastCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private inFlight = new Map<string, Promise<unknown>>();

  /**
   * Get cached data by key. Returns null if expired or missing.
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cached data with a time-to-live (TTL) in milliseconds.
   * Default: 30 seconds
   */
  set<T>(key: string, data: T, ttlMs: number = 30_000): void {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Invalidate a single key or pattern prefix.
   */
  invalidate(keyOrPrefix: string): void {
    for (const key of this.store.keys()) {
      if (key === keyOrPrefix || key.startsWith(`${keyOrPrefix}:`)) {
        this.store.delete(key);
      }
    }
    for (const key of this.inFlight.keys()) {
      if (key === keyOrPrefix || key.startsWith(`${keyOrPrefix}:`)) {
        this.inFlight.delete(key);
      }
    }
  }

  /**
   * Clear all cache entries.
   */
  clear(): void {
    this.store.clear();
    this.inFlight.clear();
  }

  /**
   * Cache wrapper with Single-Flight Request Coalescing.
   * Prevents "Thundering Herd" / dogpile when 1,000+ users request data simultaneously.
   */
  async wrap<T>(key: string, fn: () => Promise<T>, ttlMs: number = 30_000): Promise<{ data: T; isCached: boolean }> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return { data: cached, isCached: true };
    }

    // Deduplicate concurrent in-flight requests for the same key
    let promise = this.inFlight.get(key) as Promise<T> | undefined;
    const wasInFlight = !!promise;

    if (!promise) {
      promise = fn()
        .then((data) => {
          this.set(key, data, ttlMs);
          this.inFlight.delete(key);
          return data;
        })
        .catch((err) => {
          this.inFlight.delete(key);
          throw err;
        });
      this.inFlight.set(key, promise);
    }

    const data = await promise;
    return { data, isCached: wasInFlight };
  }
}

const globalForCache = globalThis as unknown as {
  fastCache: FastCache | undefined;
};

export const fastCache = globalForCache.fastCache ?? new FastCache();

if (process.env.NODE_ENV !== "production") {
  globalForCache.fastCache = fastCache;
}
