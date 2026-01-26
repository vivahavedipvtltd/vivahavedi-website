/**
 * SWR Development Logger
 * Logs SWR cache operations in development mode to verify:
 * - Request deduplication is working
 * - Cache hits vs cache misses
 * - In-flight request sharing
 *
 * This helps developers see that duplicate requests are being prevented.
 */

interface LogEntry {
  endpoint: string;
  action: 'FETCH' | 'CACHE_HIT' | 'DEDUPE' | 'REVALIDATE';
  timestamp: number;
}

// Store recent requests to detect duplicates
const requestLog: LogEntry[] = [];
const MAX_LOG_SIZE = 100;

/**
 * Log SWR request activity in development mode
 */
export function logSwrActivity(
  endpoint: string,
  action: LogEntry['action'],
  additionalInfo?: Record<string, unknown>
) {
  // Only log in development mode
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const entry: LogEntry = {
    endpoint,
    action,
    timestamp: Date.now(),
  };

  requestLog.push(entry);

  // Keep log size manageable
  if (requestLog.length > MAX_LOG_SIZE) {
    requestLog.shift();
  }

  // Detect if this is a deduplicated request
  const recentRequests = requestLog.filter(
    (log) =>
      log.endpoint === endpoint &&
      log.timestamp > entry.timestamp - 2000 && // Within last 2 seconds
      log !== entry
  );

  const isDedupe = recentRequests.length > 0 && action === 'FETCH';

  // Color-coded console logging
  const color = {
    FETCH: '#3b82f6',      // blue
    CACHE_HIT: '#10b981',  // green
    DEDUPE: '#f59e0b',     // orange
    REVALIDATE: '#8b5cf6', // purple
  }[action];

  const icon = {
    FETCH: '🌐',
    CACHE_HIT: '⚡',
    DEDUPE: '🚫',
    REVALIDATE: '🔄',
  }[action];

  console.log(
    `%c${icon} SWR ${isDedupe ? 'DEDUPE' : action}%c ${endpoint}`,
    `color: ${color}; font-weight: bold`,
    'color: #6b7280',
    additionalInfo || ''
  );

  if (isDedupe) {
    console.log(
      `%c   ↳ Request deduplicated! Prevented duplicate call within ${
        entry.timestamp - recentRequests[0].timestamp
      }ms`,
      'color: #f59e0b; font-style: italic'
    );
  }
}

/**
 * Get deduplication statistics
 */
export function getDeduplicationStats() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const stats = requestLog.reduce(
    (acc, entry) => {
      acc[entry.action] = (acc[entry.action] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalRequests = requestLog.length;
  const deduped = stats.DEDUPE || 0;
  const cacheHits = stats.CACHE_HIT || 0;
  const actualFetches = stats.FETCH || 0;
  const saved = deduped + cacheHits;
  const savingsPercent = totalRequests > 0 ? ((saved / totalRequests) * 100).toFixed(1) : 0;

  return {
    totalRequests,
    actualFetches,
    deduped,
    cacheHits,
    saved,
    savingsPercent: `${savingsPercent}%`,
  };
}

/**
 * Print deduplication statistics to console
 */
export function printDeduplicationStats() {
  const stats = getDeduplicationStats();
  if (!stats) return;

  console.group('📊 SWR Deduplication Statistics');
  console.log(`Total Requests:    ${stats.totalRequests}`);
  console.log(`Actual Fetches:    ${stats.actualFetches}`);
  console.log(`Deduplicated:      ${stats.deduped}`);
  console.log(`Cache Hits:        ${stats.cacheHits}`);
  console.log(`Requests Saved:    ${stats.saved} (${stats.savingsPercent})`);
  console.groupEnd();
}

// Log stats every 30 seconds in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  setInterval(() => {
    const stats = getDeduplicationStats();
    if (stats && stats.totalRequests > 0) {
      printDeduplicationStats();
    }
  }, 30000);
}
