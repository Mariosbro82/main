import { useState, useEffect, useCallback } from 'react';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useAutoSave } from './useAutoSave';

export interface CalculatorState {
  age: number;
  monthlyContribution: number;
  targetRetirementAge: number;
  expectedReturn: number;
  inflationRate: number;
  // Add more fields as needed
}

export interface UseCalculatorStateOptions {
  autoSave?: boolean;
  debounceMs?: number;
  showSaveToast?: boolean;
}

/**
 * Hook to manage calculator state with automatic onboarding data synchronization
 *
 * Features:
 * - Loads initial values from onboarding store
 * - Auto-saves changes back to onboarding store
 * - Provides type-safe state management
 * - Integrates with useAutoSave for debounced saves
 *
 * @param options Configuration options
 * @returns Calculator state and update functions
 *
 * @example
 * const { state, updateField, updateMultiple, resetToOnboarding } = useCalculatorState({
 *   autoSave: true,
 *   debounceMs: 500
 * });
 */
export const useCalculatorState = (options: UseCalculatorStateOptions = {}) => {
  const {
    autoSave = true,
    debounceMs = 300,
    showSaveToast = false,
  } = options;

  const { data, isCompleted } = useOnboardingStore();
  const { autoSave: saveToOnboarding, saveNow, status } = useAutoSave({
    debounceMs,
    showToast: showSaveToast,
  });

  // Initialize state from onboarding data
  const [state, setState] = useState<Partial<CalculatorState>>(() => {
    const personal = data.personal || {};
    const privatePension = data.privatePension || {};

    return {
      age: personal.age || 30,
      monthlyContribution: privatePension.contribution || 0,
      targetRetirementAge: 67,
      expectedReturn: 5.0, // Default 5%
      inflationRate: 2.0, // Default 2%
    };
  });

  // Update state when onboarding data changes (if not manually edited)
  useEffect(() => {
    const personal = data.personal || {};
    const privatePension = data.privatePension || {};

    setState(prev => ({
      ...prev,
      age: personal.age || prev.age || 30,
      monthlyContribution: privatePension.contribution || prev.monthlyContribution || 0,
    }));
  }, [data]);

  /**
   * Update a single field in the calculator state
   */
  const updateField = useCallback(
    <K extends keyof CalculatorState>(field: K, value: CalculatorState[K]) => {
      setState(prev => {
        const newState = { ...prev, [field]: value };

        // Auto-save to onboarding if enabled
        if (autoSave) {
          const onboardingUpdate = mapCalculatorToOnboarding({ [field]: value });
          if (onboardingUpdate && Object.keys(onboardingUpdate).length > 0) {
            saveToOnboarding(onboardingUpdate);
          }
        }

        return newState;
      });
    },
    [autoSave, saveToOnboarding]
  );

  /**
   * Update multiple fields at once
   */
  const updateMultiple = useCallback(
    (updates: Partial<CalculatorState>) => {
      setState(prev => {
        const newState = { ...prev, ...updates };

        // Auto-save to onboarding if enabled
        if (autoSave) {
          const onboardingUpdate = mapCalculatorToOnboarding(updates);
          if (onboardingUpdate && Object.keys(onboardingUpdate).length > 0) {
            saveToOnboarding(onboardingUpdate);
          }
        }

        return newState;
      });
    },
    [autoSave, saveToOnboarding]
  );

  /**
   * Reset calculator state to onboarding data
   */
  const resetToOnboarding = useCallback(() => {
    const personal = data.personal || {};
    const privatePension = data.privatePension || {};

    setState({
      age: personal.age || 30,
      monthlyContribution: privatePension.contribution || 0,
      targetRetirementAge: 67,
      expectedReturn: 5.0,
      inflationRate: 2.0,
    });
  }, [data]);

  /**
   * Force immediate save of current state
   */
  const saveImmediately = useCallback(() => {
    const onboardingUpdate = mapCalculatorToOnboarding(state);
    if (onboardingUpdate && Object.keys(onboardingUpdate).length > 0) {
      saveNow(onboardingUpdate);
    }
  }, [state, saveNow]);

  return {
    state,
    updateField,
    updateMultiple,
    resetToOnboarding,
    saveImmediately,
    hasOnboardingData: isCompleted || (data.personal?.age && data.income?.netMonthly),
    saveStatus: status,
  };
};

/**
 * Helper function to map calculator state to onboarding data structure
 */
function mapCalculatorToOnboarding(calculatorData: Partial<CalculatorState>): any {
  const update: any = {};

  if ('age' in calculatorData && calculatorData.age !== undefined) {
    update.personal = {
      age: calculatorData.age,
      birthYear: new Date().getFullYear() - calculatorData.age,
    };
  }

  if ('monthlyContribution' in calculatorData && calculatorData.monthlyContribution !== undefined) {
    update.privatePension = {
      contribution: calculatorData.monthlyContribution,
    };
  }

  // Add more mappings as needed

  return update;
}

export default useCalculatorState;
