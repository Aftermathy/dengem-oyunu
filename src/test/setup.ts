import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

/**
 * In-memory Storage for tests.
 *
 * The jsdom environment here hands back a bare `{}` for `window.localStorage`:
 * no getItem, no setItem, no clear. Every module that persists anything —
 * gameSave, achievements, cardMemory, userProfile, deviceId, the purchase
 * entitlement cache — therefore threw the moment a test touched it, which is
 * why none of them had tests. This gives them a real Storage to run against.
 */
class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  get length(): number { return this.map.size; }
  key(i: number): string | null { return [...this.map.keys()][i] ?? null; }
  getItem(k: string): string | null { return this.map.has(k) ? this.map.get(k)! : null; }
  setItem(k: string, v: string): void { this.map.set(String(k), String(v)); }
  removeItem(k: string): void { this.map.delete(k); }
  clear(): void { this.map.clear(); }
}

for (const name of ["localStorage", "sessionStorage"] as const) {
  Object.defineProperty(window, name, {
    writable: true,
    configurable: true,
    value: new MemoryStorage(),
  });
}
