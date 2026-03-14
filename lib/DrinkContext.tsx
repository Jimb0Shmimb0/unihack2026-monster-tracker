'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { drinks, type EnergyDrink } from './data'

interface DrinkContextType {
  selectedDrink: EnergyDrink
  setSelectedDrink: (drink: EnergyDrink) => void
}

const DrinkContext = createContext<DrinkContextType>({
  selectedDrink: drinks[0],
  setSelectedDrink: () => {},
})

export function DrinkProvider({ children }: { children: ReactNode }) {
  const [selectedDrink, setSelectedDrink] = useState<EnergyDrink>(drinks[0])
  return (
    <DrinkContext.Provider value={{ selectedDrink, setSelectedDrink }}>
      {children}
    </DrinkContext.Provider>
  )
}

export function useSelectedDrink() {
  return useContext(DrinkContext)
}
