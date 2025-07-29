'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Spot } from '@/lib/mock-data'

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
}

const MAX_SPOTS = 10

const SpotSelectionContext = createContext<SpotSelectionContextType | undefined>(undefined)

export function SpotSelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedSpots, setSelectedSpots] = useState<Spot[]>([])

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
  }, [])

  // 選択状態が変更されたらLocalStorageに保存
  useEffect(() => {
    localStorage.setItem('selectedSpots', JSON.stringify(selectedSpots))
  }, [selectedSpots])

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
    reorderSpots
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