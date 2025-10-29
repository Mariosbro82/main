/**
 * Caching middleware using node-cache
 *
 * Features:
 * - In-memory caching for API responses
 * - TTL (Time To Live) configuration
 * - Cache key generation
 */

import NodeCache from 'node-cache';
import type { Request, Response, NextFunction } from 'express';

// Initialize cache with default TTL of 5 minutes
const cache = new NodeCache({
  stdTTL: 300, // 5 minutes
  checkperiod: 60, // Check for expired keys every 60 seconds
  useClones: false, // Don't clone data (faster but be careful with mutations)
});

/**
 * Generate cache key from request
 */
function generateCacheKey(req: Request): string {
  const { method, path, query, body } = req;

  // For GET requests, use path + query
  if (method === 'GET') {
    return `${path}:${JSON.stringify(query)}`;
  }

  // For POST requests, include body in key
  return `${path}:${JSON.stringify({ query, body })}`;
}

/**
 * Cache middleware factory
 *
 * @param ttl - Time to live in seconds (default: 300)
 * @returns Express middleware
 */
export function cacheMiddleware(ttl: number = 300) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests by default
    if (req.method !== 'GET') {
      return next();
    }

    const key = generateCacheKey(req);
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      // Cache hit
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedResponse);
    }

    // Cache miss - intercept res.json to cache response
    const originalJson = res.json.bind(res);

    res.json = function (data: any) {
      // Store in cache
      cache.set(key, data, ttl);
      res.setHeader('X-Cache', 'MISS');
      return originalJson(data);
    };

    next();
  };
}

/**
 * Clear cache by pattern
 */
export function clearCache(pattern?: string) {
  if (pattern) {
    const keys = cache.keys();
    const matchingKeys = keys.filter(key => key.includes(pattern));
    cache.del(matchingKeys);
    return matchingKeys.length;
  } else {
    cache.flushAll();
    return cache.keys().length;
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return cache.getStats();
}

export { cache };
