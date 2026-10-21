import "@testing-library/jest-dom";

// Mock window.matchMedia if needed in jsdom
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
    dispatchEvent: () => false,
  }),
});

// Mock window.scrollTo and Element.prototype.scrollIntoView
window.scrollTo = (() => {}) as any;
window.HTMLElement.prototype.scrollIntoView = (() => {}) as any;
