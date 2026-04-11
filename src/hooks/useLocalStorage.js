import { useState, useEffect } from 'react'

/**
 * Like useState but persists to localStorage.
 * @param {string} key  - localStorage key
 * @param {*} initial   - default value if nothing stored
 */
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {/* quota exceeded */ }
  }, [key, value])

  return [value, setValue]
}
