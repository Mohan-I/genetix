// src/utils/storage.ts
import React from 'react';
import { PedigreeData, PEDIGREE_JSON_MAGIC, PEDIGREE_JSON_VERSION, createDefaultPedigree } from '../types/pedigree';

// ============================================================================
// 1. SAFE STORAGE UTILITIES
// ============================================================================

export const safeStorage = {
  getItem: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`Failed to read from localStorage (key: ${key}):`, error);
      return defaultValue;
    }
  },

  setItem: <T>(key: string, value: T): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Failed to write to localStorage (key: ${key}):`, error);
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove from localStorage (key: ${key}):`, error);
      return false;
    }
  },

  isAvailable: (): boolean => {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
};

// ============================================================================
// 2. PEDIGREE VALIDATION
// ============================================================================

export const validatePedigreeData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data) {
    errors.push('No data provided');
    return { isValid: false, errors };
  }

  // Check magic identifier
  if (data._type !== PEDIGREE_JSON_MAGIC) {
    errors.push(`Invalid file type. Expected "${PEDIGREE_JSON_MAGIC}", got "${data._type || 'undefined'}"`);
  }

  // Check version
  if (data._version !== PEDIGREE_JSON_VERSION) {
    errors.push(`Incompatible version. Expected "${PEDIGREE_JSON_VERSION}", got "${data._version || 'undefined'}"`);
  }

  // Check required fields
  if (!Array.isArray(data.members)) {
    errors.push('Missing or invalid "members" array');
  }

  if (!Array.isArray(data.relationships)) {
    errors.push('Missing or invalid "relationships" array');
  }

  if (!data.metadata || typeof data.metadata !== 'object') {
    errors.push('Missing or invalid "metadata" object');
  }

  return { isValid: errors.length === 0, errors };
};

// ============================================================================
// 3. REACT HOOKS
// ============================================================================

// Generic safe storage hook (for any data)
export const useSafeStorage = <T>(key: string, defaultValue: T) => {
  const [value, setValue] = React.useState<T>(() => {
    return safeStorage.getItem(key, defaultValue);
  });

  const updateValue = React.useCallback((newValue: T | ((prev: T) => T)) => {
    setValue(prev => {
      const next = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(prev)
        : newValue;
      safeStorage.setItem(key, next);
      return next;
    });
  }, [key]);

  return [value, updateValue] as const;
};

// Pedigree-specific storage hook with validation
export const usePedigreeStorage = (key: string) => {
  const [data, setData] = React.useState<PedigreeData>(() => {
    const saved = safeStorage.getItem(key, null);
    if (saved) {
      const validation = validatePedigreeData(saved);
      if (validation.isValid) {
        return saved as PedigreeData;
      }
      console.warn('Invalid pedigree data in storage:', validation.errors);
    }
    return createDefaultPedigree();
  });

  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);

  const updateData = React.useCallback((newData: PedigreeData | ((prev: PedigreeData) => PedigreeData)) => {
    setData(prev => {
      const next = typeof newData === 'function' ? newData(prev) : newData;
      const validation = validatePedigreeData(next);
      if (validation.isValid) {
        safeStorage.setItem(key, next);
        setValidationErrors([]);
      } else {
        setValidationErrors(validation.errors);
        console.error('Invalid pedigree data:', validation.errors);
      }
      return next;
    });
  }, [key]);

  const resetToDefault = React.useCallback(() => {
    const defaultData = createDefaultPedigree();
    safeStorage.setItem(key, defaultData);
    setData(defaultData);
    setValidationErrors([]);
  }, [key]);

  return {
    data,
    setData: updateData,
    resetToDefault,
    validationErrors,
    isValid: validationErrors.length === 0
  };
};