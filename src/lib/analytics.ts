/**
 * Analytics module — sends game events to Lovable Cloud for tracking.
 * Events are batched and flushed periodically or on page unload.
 */

import { supabase } from '@/integrations/supabase/client';

const isDev = import.meta.env.DEV;

// Generate a unique session ID per browser session
const SESSION_ID = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// In-memory ring buffer for local debugging
const MAX_BUFFER = 50;
const eventBuffer: { ts: number; type: string; payload: unknown }[] = [];

// Batch queue for DB writes
type EventRow = { event_type: string; event_name: string; properties: Record<string, string | number | boolean | null> };
const batchQueue: EventRow[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
const FLUSH_INTERVAL = 5000;
const MAX_BATCH_SIZE = 20;

function record(type: string, payload: unknown) {
  eventBuffer.push({ ts: Date.now(), type, payload });
  if (eventBuffer.length > MAX_BUFFER) eventBuffer.shift();
}

function enqueue(type: string, name: string, properties: Record<string, unknown> = {}) {
  // Sanitize properties to JSON-compatible values
  const safe: Record<string, string | number | boolean | null> = {};
  for (const [k, v] of Object.entries(properties)) {
    if (v === null || typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
      safe[k] = v;
    } else {
      safe[k] = String(v);
    }
  }
  batchQueue.push({ event_type: type, event_name: name, properties: safe });
  
  if (batchQueue.length >= MAX_BATCH_SIZE) {
    flush();
  } else if (!flushTimer) {
    flushTimer = setTimeout(flush, FLUSH_INTERVAL);
  }
}

async function flush() {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  
  if (batchQueue.length === 0) return;
  
  const batch = batchQueue.splice(0, MAX_BATCH_SIZE);
  const rows = batch.map(e => ({
    session_id: SESSION_ID,
    event_type: e.event_type,
    event_name: e.event_name,
    properties: e.properties as Record<string, string | number | boolean | null>,
  }));

  try {
    const { error } = await supabase.from('game_events').insert(rows as any);
    if (error && isDev) {
      console.warn('[Analytics] Flush error:', error.message);
    }
  } catch (err) {
    if (isDev) console.warn('[Analytics] Flush failed:', err);
  }
}

// Flush on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
  window.addEventListener('pagehide', flush);
}

/** Report a caught error (e.g. from ErrorBoundary or try/catch). */
export function reportError(error: unknown, context?: string) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  record('error', { message, stack, context });
  enqueue('error', message, { stack, context });

  if (isDev) {
    console.error(`[Analytics] Error${context ? ` (${context})` : ''}:`, error);
  }
}

/** Track a named game event with optional metadata. */
export function trackEvent(name: string, properties?: Record<string, unknown>) {
  record('event', { name, properties });
  enqueue('event', name, properties ?? {});

  if (isDev) {
    console.log(`[Analytics] Event: ${name}`, properties ?? '');
  }
}

/** Returns the buffered events (useful for attaching to user-facing bug reports). */
export function getEventBuffer() {
  return [...eventBuffer];
}
