import '@testing-library/jest-dom';

// Mock IntersectionObserver for Framer Motion
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
};

// Mock scrollTo
window.scrollTo = () => {};

// Mock IntersectionObserver for Framer Motion
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
};

// Mock scrollTo
window.scrollTo = () => {};
