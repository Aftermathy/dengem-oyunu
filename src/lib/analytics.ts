/**
 * Analytics & crash reporting module.
 *
 * Currently logs to console in development and buffers events in production.
 * To integrate Sentry: npm install @sentry/capacitor @sentry/react, then
 * call Sentry.init() in main.tsx and replace the stubs below with Sentry calls.
 */

const isDev = import.meta.env.DEV;

// In-memory ring buffer so the last N events are always accessible (e.g. for bug reports)
const MAX_BUFFER = 50;
const eventBuffer: { ts: number; type: string; payload: unknown }[] = [];

function record(type: string, payload: unknown) {
  eventBuffer.push({ ts: Date.now(), type, payload });
  if (eventBuffer.length > MAX_BUFFER) eventBuffer.shift();
}

/** Report a caught error (e.g. from ErrorBoundary or try/catch). */
export function reportError(error: unknown, context?: string) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  record('error', { message, stack, context });

  if (isDev) {
    console.error(`[Analytics] Error${context ? ` (${context})` : ''}:`, error);
  }

  // TODO: Sentry.captureException(error, { extra: { context } });
}

/** Track a named game event with optional metadata. */
export function trackEvent(name: string, properties?: Record<string, unknown>) {
  record('event', { name, properties });

  if (isDev) {
    console.log(`[Analytics] Event: ${name}`, properties ?? '');
  }

  // TODO: Sentry.addBreadcrumb({ message: name, data: properties });
  // TODO: posthog.capture(name, properties);
}

/** Returns the buffered events (useful for attaching to user-facing bug reports). */
export function getEventBuffer() {
  return [...eventBuffer];
}
