import { mockSpots } from '@/lib/mock-data'
import { Spot } from '@/types'

describe('Mock Data', () => {
  it('contains valid spot data', () => {
    expect(mockSpots).toBeDefined()
    expect(Array.isArray(mockSpots)).toBe(true)
    expect(mockSpots.length).toBeGreaterThan(0)
  })

  it('each spot has required properties', () => {
    mockSpots.forEach((spot: Spot) => {
      expect(spot).toHaveProperty('id')
      expect(spot).toHaveProperty('name')
      expect(spot).toHaveProperty('description')
      expect(spot).toHaveProperty('images')
      expect(spot).toHaveProperty('location')
      expect(spot).toHaveProperty('address')
      expect(spot).toHaveProperty('tags')
      expect(spot).toHaveProperty('rating')
      expect(spot).toHaveProperty('duration')
      expect(spot).toHaveProperty('bestTime')
      expect(spot).toHaveProperty('vibes')
    })
  })

  it('location data is valid', () => {
    mockSpots.forEach((spot: Spot) => {
      expect(typeof spot.location.lat).toBe('number')
      expect(typeof spot.location.lng).toBe('number')
      expect(spot.location.lat).toBeGreaterThan(-90)
      expect(spot.location.lat).toBeLessThan(90)
      expect(spot.location.lng).toBeGreaterThan(-180)
      expect(spot.location.lng).toBeLessThan(180)
    })
  })

  it('rating is within valid range', () => {
    mockSpots.forEach((spot: Spot) => {
      expect(spot.rating).toBeGreaterThanOrEqual(0)
      expect(spot.rating).toBeLessThanOrEqual(5)
    })
  })

  it('has required string fields that are not empty', () => {
    mockSpots.forEach((spot: Spot) => {
      expect(spot.id.trim()).toBeTruthy()
      expect(spot.name.trim()).toBeTruthy()
      expect(spot.description.trim()).toBeTruthy()
      expect(spot.address.trim()).toBeTruthy()
      expect(spot.duration.trim()).toBeTruthy()
      expect(spot.bestTime.trim()).toBeTruthy()
    })
  })

  it('arrays are not empty', () => {
    mockSpots.forEach((spot: Spot) => {
      expect(spot.images.length).toBeGreaterThan(0)
      expect(spot.tags.length).toBeGreaterThan(0)
      expect(spot.vibes.length).toBeGreaterThan(0)
    })
  })

  it('has unique IDs', () => {
    const ids = mockSpots.map(spot => spot.id)
    const uniqueIds = [...new Set(ids)]
    expect(uniqueIds.length).toBe(ids.length)
  })
})