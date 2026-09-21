import { useState } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const savedValue = localStorage.getItem(key)

      if (savedValue) {
        return JSON.parse(savedValue)
      }

      return initialValue
    } catch {
      return initialValue
    }
  })

  function setValue(value: T) {
    try {
      setStoredValue(value)

      localStorage.setItem(
        key,
        JSON.stringify(value),
      )
    } catch (error) {
      console.error(
        'Erro ao salvar dados no navegador:',
        error,
      )
    }
  }

  return [storedValue, setValue] as const
}