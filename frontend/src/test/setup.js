import '@testing-library/jest-dom';

// Mock IntersectionObserver for Framer Motion
if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
    takeRecords() {
      return [];
    }
  };
}

// Mock window.scrollTo
if (typeof window !== 'undefined') {
  window.scrollTo = () => {};
}

