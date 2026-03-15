'use client'

import { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react'
import { drinks, type EnergyDrink } from './data'

// Split into two contexts so components that only call setSelectedDrink
// don't re-render when the selected drink changes
const DrinkValueContext = createContext<EnergyDrink>(drinks[0])
const DrinkSetterContext = createContext<(drink: EnergyDrink) => void>(() => {})

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
    const [selectedDrink, setSelectedDrinkState] = useState<EnergyDrink>(drinks[0])

    // Stable setter reference - won't change between renders
    const setSelectedDrink = useCallback((drink: EnergyDrink) => {
        setSelectedDrinkState(drink)
    }, [])

    useEffect(() => {
        applyAccentColor(selectedDrink.accentColor)
    }, [selectedDrink])

    // Apply initial color on mount
    useEffect(() => {
        applyAccentColor(drinks[0].accentColor)
    }, [])

    return (
        <DrinkSetterContext.Provider value={setSelectedDrink}>
            <DrinkValueContext.Provider value={selectedDrink}>
                {children}
            </DrinkValueContext.Provider>
        </DrinkSetterContext.Provider>
    )
}

/** Subscribe to the current drink - re-renders when drink changes */
export function useSelectedDrink() {
    return useContext(DrinkValueContext)
}

/** Subscribe to the setter only - never re-renders from drink changes */
export function useSetDrink() {
    return useContext(DrinkSetterContext)
}