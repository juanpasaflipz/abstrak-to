import { vi } from 'vitest';

// Mock localStorage for testing
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage for testing
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock crypto for testing
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn(() => 'test-uuid-1234'),
    getRandomValues: vi.fn((arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    }),
  },
});

// Mock TextEncoder/TextDecoder for Node.js environment
Object.defineProperty(global, 'TextEncoder', {
  value: TextEncoder,
});

Object.defineProperty(global, 'TextDecoder', {
  value: TextDecoder,
});

// Mock fetch for API testing
global.fetch = vi.fn();

// Mock window.ethereum for wallet testing
Object.defineProperty(window, 'ethereum', {
  value: {
    isMetaMask: true,
    request: vi.fn(),
    on: vi.fn(),
    removeListener: vi.fn(),
  },
  writable: true,
});

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.getItem.mockReturnValue(null);
  localStorageMock.setItem.mockImplementation(() => {});
  localStorageMock.removeItem.mockImplementation(() => {});
  localStorageMock.clear.mockImplementation(() => {});
});