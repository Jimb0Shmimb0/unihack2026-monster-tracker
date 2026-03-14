'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { drinks, type EnergyDrink } from './data'

interface DrinkContextType {
  selectedDrink: EnergyDrink
  setSelectedDrink: (drink: EnergyDrink) => void
}

const DrinkContext = createContext<DrinkContextType>({
  selectedDrink: drinks[0],
  setSelectedDrink: () => {},
})

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function applyAccentColor(hex: string) {
  const [r, g, b] = hexToRgb(hex)
  const root = document.documentElement.style
  root.setProperty('--accent', hex)
  root.setProperty('--accent-r', String(r))
  root.setProperty('--accent-g', String(g))
  root.setProperty('--accent-b', String(b))
  root.setProperty('--accent-dim', `rgba(${r}, ${g}, ${b}, 0.15)`)
  root.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, 0.3)`)
  root.setProperty('--border-accent', `rgba(${r}, ${g}, ${b}, 0.2)`)
}

export function DrinkProvider({ children }: { children: ReactNode }) {
  const [selectedDrink, setSelectedDrink] = useState<EnergyDrink>(drinks[0])

  useEffect(() => {
    applyAccentColor(selectedDrink.accentColor)
  }, [selectedDrink])

  // Apply initial color on mount
  useEffect(() => {
    applyAccentColor(drinks[0].accentColor)
  }, [])

  return (
    <DrinkContext.Provider value={{ selectedDrink, setSelectedDrink }}>
      {children}
    </DrinkContext.Provider>
  )
}

export function useSelectedDrink() {
  return useContext(DrinkContext)
}
