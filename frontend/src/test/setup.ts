import "@testing-library/jest-dom/vitest"

// jsdom does not provide localStorage/sessionStorage for the default
// `about:blank` context, and Node >=26 exposes an experimental (uninitialized)
// global `localStorage` that would otherwise shadow it. Provide a minimal
// in-memory Storage implementation so tests can use them directly.

class MemoryStorage implements Storage {
  private store = new Map<string, string>()

  get length(): number {
    return this.store.size
  }

  clear(): void {
    this.store.clear()
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null
  }

  removeItem(key: string): void {
    this.store.delete(key)
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value))
  }
}

if (typeof window !== "undefined") {
  if (typeof window.localStorage === "undefined") {
    Object.defineProperty(window, "localStorage", {
      value: new MemoryStorage(),
      configurable: true,
    })
  }
  if (typeof window.sessionStorage === "undefined") {
    Object.defineProperty(window, "sessionStorage", {
      value: new MemoryStorage(),
      configurable: true,
    })
  }
  Object.defineProperty(globalThis, "localStorage", {
    value: window.localStorage,
    configurable: true,
  })
  Object.defineProperty(globalThis, "sessionStorage", {
    value: window.sessionStorage,
    configurable: true,
  })
}
