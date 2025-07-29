'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Spot } from '@/lib/mock-data'

export interface Location {
  name: string
  address: string
  lat: number
  lng: number
}

interface SpotSelectionContextType {
  selectedSpots: Spot[]
  addSpot: (spot: Spot) => void
  removeSpot: (spotId: string) => void
  toggleSpot: (spot: Spot) => void
  clearSelection: () => void
  isSelected: (spotId: string) => boolean
  selectedCount: number
  canAddMore: boolean
  maxSpots: number
  reorderSpots: (spots: Spot[]) => void
  // 出発地・到着地
  startLocation: Location | null
  endLocation: Location | null
  setStartLocation: (location: Location) => void
  setEndLocation: (location: Location) => void
  clearStartLocation: () => void
  clearEndLocation: () => void
  getCurrentLocation: () => Promise<Location | null>
}

const MAX_SPOTS = 10

const SpotSelectionContext = createContext<SpotSelectionContextType | undefined>(undefined)

export function SpotSelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedSpots, setSelectedSpots] = useState<Spot[]>([])
  const [startLocation, setStartLocationState] = useState<Location | null>(null)
  const [endLocation, setEndLocationState] = useState<Location | null>(null)

  // LocalStorageから初期値を読み込む
  useEffect(() => {
    const stored = localStorage.getItem('selectedSpots')
    if (stored) {
      try {
        const spots = JSON.parse(stored)
        setSelectedSpots(spots)
      } catch (error) {
        console.error('Failed to parse stored spots:', error)
      }
    }

    const storedStartLocation = localStorage.getItem('startLocation')
    if (storedStartLocation) {
      try {
        const location = JSON.parse(storedStartLocation)
        setStartLocationState(location)
      } catch (error) {
        console.error('Failed to parse stored start location:', error)
      }
    }

    const storedEndLocation = localStorage.getItem('endLocation')
    if (storedEndLocation) {
      try {
        const location = JSON.parse(storedEndLocation)
        setEndLocationState(location)
      } catch (error) {
        console.error('Failed to parse stored end location:', error)
      }
    }
  }, [])

  // 選択状態が変更されたらLocalStorageに保存
  useEffect(() => {
    localStorage.setItem('selectedSpots', JSON.stringify(selectedSpots))
  }, [selectedSpots])

  useEffect(() => {
    if (startLocation) {
      localStorage.setItem('startLocation', JSON.stringify(startLocation))
    }
  }, [startLocation])

  useEffect(() => {
    if (endLocation) {
      localStorage.setItem('endLocation', JSON.stringify(endLocation))
    }
  }, [endLocation])

  const addSpot = useCallback((spot: Spot) => {
    setSelectedSpots(prev => {
      if (prev.length >= MAX_SPOTS) return prev
      if (prev.find(s => s.id === spot.id)) return prev
      return [...prev, spot]
    })
  }, [])

  const removeSpot = useCallback((spotId: string) => {
    setSelectedSpots(prev => prev.filter(spot => spot.id !== spotId))
  }, [])

  const toggleSpot = useCallback((spot: Spot) => {
    setSelectedSpots(prev => {
      const exists = prev.find(s => s.id === spot.id)
      if (exists) {
        return prev.filter(s => s.id !== spot.id)
      } else {
        if (prev.length >= MAX_SPOTS) return prev
        return [...prev, spot]
      }
    })
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedSpots([])
    localStorage.removeItem('selectedSpots')
  }, [])

  const isSelected = useCallback((spotId: string) => {
    return selectedSpots.some(spot => spot.id === spotId)
  }, [selectedSpots])

  const reorderSpots = useCallback((spots: Spot[]) => {
    setSelectedSpots(spots)
  }, [])

  // 現在地取得
  const getCurrentLocation = useCallback(async (): Promise<Location | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.error('Geolocation is not supported by this browser')
        resolve(null)
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            
            // 逆ジオコーディングで住所を取得（仮の実装）
            const address = `緯度${latitude.toFixed(4)}, 経度${longitude.toFixed(4)}`
            
            const location: Location = {
              name: '現在地',
              address,
              lat: latitude,
              lng: longitude
            }
            
            resolve(location)
          } catch (error) {
            console.error('Failed to get address:', error)
            resolve({
              name: '現在地',
              address: '住所不明',
              lat: position.coords.latitude,
              lng: position.coords.longitude
            })
          }
        },
        (error) => {
          console.error('Error getting location:', error)
          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      )
    })
  }, [])

  // 出発地設定
  const setStartLocation = useCallback((location: Location) => {
    setStartLocationState(location)
  }, [])

  // 到着地設定
  const setEndLocation = useCallback((location: Location) => {
    setEndLocationState(location)
  }, [])

  // 出発地削除
  const clearStartLocation = useCallback(() => {
    setStartLocationState(null)
    localStorage.removeItem('startLocation')
  }, [])

  // 到着地削除
  const clearEndLocation = useCallback(() => {
    setEndLocationState(null)
    localStorage.removeItem('endLocation')
  }, [])

  // 初期化時に現在地を出発地・到着地に設定
  useEffect(() => {
    const initializeLocations = async () => {
      const currentLocation = await getCurrentLocation()
      if (currentLocation && !startLocation) {
        setStartLocationState(currentLocation)
      }
      if (currentLocation && !endLocation) {
        setEndLocationState(currentLocation)
      }
    }

    initializeLocations()
  }, [getCurrentLocation]) // startLocationとendLocationを依存に入れると無限ループになるので除外

  const value: SpotSelectionContextType = {
    selectedSpots,
    addSpot,
    removeSpot,
    toggleSpot,
    clearSelection,
    isSelected,
    selectedCount: selectedSpots.length,
    canAddMore: selectedSpots.length < MAX_SPOTS,
    maxSpots: MAX_SPOTS,
    reorderSpots,
    startLocation,
    endLocation,
    setStartLocation,
    setEndLocation,
    clearStartLocation,
    clearEndLocation,
    getCurrentLocation
  }

  return (
    <SpotSelectionContext.Provider value={value}>
      {children}
    </SpotSelectionContext.Provider>
  )
}

export function useSpotSelection() {
  const context = useContext(SpotSelectionContext)
  if (context === undefined) {
    throw new Error('useSpotSelection must be used within a SpotSelectionProvider')
  }
  return context
}