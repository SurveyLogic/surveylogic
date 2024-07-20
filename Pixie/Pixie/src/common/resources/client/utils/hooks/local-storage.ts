import {useState} from 'react';

export function useLocalStorage<T>(key: string, initialValue: T | null = null) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getFromLocalStorage<T>(key, initialValue);
  });
  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    setInLocalStorage(key, valueToStore);
  };
  return [storedValue, setValue] as const;
}

export function getFromLocalStorage<T>(
  key: string,
  initialValue: T | null = null
) {
  if (typeof window === 'undefined') {
    return initialValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item != null ? JSON.parse(item) : initialValue;
  } catch (error) {
    return initialValue;
  }
}

export function setInLocalStorage<T>(key: string, value: T) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    //
  }
}

export function removeFromLocalStorage(key: string) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  } catch (error) {
    //
  }
}
