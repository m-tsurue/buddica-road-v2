import { useState, useEffect } from 'react';
import { storage } from '@/lib/utils';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      const success = storage.set(key, valueToStore);
      if (!success) {
        console.warn(`Failed to save to localStorage: ${key}`);
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Function to remove the value
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      storage.remove(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  // Get from local storage once on mount
  useEffect(() => {
    const item = storage.get(key, initialValue);
    setStoredValue(item);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}