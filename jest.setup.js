import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ''
  },
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock window.location - only if not already defined
if (!window.location) {
  Object.defineProperty(window, 'location', {
    value: {
      href: 'http://localhost:3000',
      assign: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
    },
    writable: true,
  })
}

// Mock Google Maps API
global.google = {
  maps: {
    Map: jest.fn(),
    Marker: jest.fn(),
    DirectionsService: jest.fn(),
    DirectionsRenderer: jest.fn(),
    places: {
      PlacesService: jest.fn(),
    },
  },
}

// Mock Mapbox GL
jest.mock('mapbox-gl', () => ({
  Map: jest.fn(() => ({
    on: jest.fn(),
    remove: jest.fn(),
    addSource: jest.fn(),
    addLayer: jest.fn(),
    flyTo: jest.fn(),
  })),
  Marker: jest.fn(() => ({
    setLngLat: jest.fn().mockReturnThis(),
    addTo: jest.fn().mockReturnThis(),
    remove: jest.fn(),
  })),
  Popup: jest.fn(() => ({
    setLngLat: jest.fn().mockReturnThis(),
    setHTML: jest.fn().mockReturnThis(),
    addTo: jest.fn().mockReturnThis(),
  })),
}))

// Suppress console warnings during tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
}