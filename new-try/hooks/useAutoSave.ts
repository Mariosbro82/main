import { useCallback, useRef, useEffect, useState } from 'react';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useToast } from '@/hooks/use-toast';

export interface AutoSaveOptions {
  debounceMs?: number;
  showToast?: boolean;
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
}

export interface AutoSaveStatus {
  isSaving: boolean;
  lastSaved: Date | null;
  error: Error | null;
}

/**
 * Hook to automatically save data to onboarding store with debouncing
 *
 * @param options Configuration options for auto-save behavior
 * @returns Object with autoSave function and save status
 *
 * @example
 * const { autoSave, status } = useAutoSave({ debounceMs: 500, showToast: true });
 *
 * // In your component
 * const handleChange = (field, value) => {
 *   autoSave({ [field]: value });
 * };
 */
export const useAutoSave = (options: AutoSaveOptions = {}) => {
  const {
    debounceMs = 300,
    showToast = false,
    onSaveSuccess,
    onSaveError,
  } = options;

  const { updateData, saveToStorage } = useOnboardingStore();
  const { toast } = useToast();

  const [status, setStatus] = useState<AutoSaveStatus>({
    isSaving: false,
    lastSaved: null,
    error: null,
  });

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingSaveRef = useRef<any>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const executeSave = useCallback(async (data: any) => {
    setStatus(prev => ({ ...prev, isSaving: true, error: null }));

    try {
      // Update onboarding store
      updateData(data);

      // Explicitly save to storage (updateData already does this, but being explicit)
      saveToStorage();

      setStatus({
        isSaving: false,
        lastSaved: new Date(),
        error: null,
      });

      if (showToast) {
        toast({
          title: 'Gespeichert',
          description: 'Ihre Änderungen wurden automatisch gespeichert.',
          duration: 2000,
        });
      }

      onSaveSuccess?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Save failed');

      setStatus(prev => ({
        ...prev,
        isSaving: false,
        error: err,
      }));

      if (showToast) {
        toast({
          title: 'Speicherfehler',
          description: 'Ihre Änderungen konnten nicht gespeichert werden.',
          variant: 'destructive',
          duration: 3000,
        });
      }

      onSaveError?.(err);
    }
  }, [updateData, saveToStorage, showToast, toast, onSaveSuccess, onSaveError]);

  /**
   * Auto-save function with debouncing
   * Merges pending changes and executes save after debounce period
   */
  const autoSave = useCallback((data: any) => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Merge with pending changes
    pendingSaveRef.current = {
      ...(pendingSaveRef.current || {}),
      ...data,
    };

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      const dataToSave = pendingSaveRef.current;
      pendingSaveRef.current = null;
      executeSave(dataToSave);
    }, debounceMs);
  }, [debounceMs, executeSave]);

  /**
   * Force immediate save without debouncing
   */
  const saveNow = useCallback((data?: any) => {
    // Clear pending timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Save immediately
    const dataToSave = data || pendingSaveRef.current;
    if (dataToSave) {
      pendingSaveRef.current = null;
      executeSave(dataToSave);
    }
  }, [executeSave]);

  /**
   * Cancel pending save
   */
  const cancelSave = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    pendingSaveRef.current = null;
  }, []);

  return {
    autoSave,
    saveNow,
    cancelSave,
    status,
    isSaving: status.isSaving,
    lastSaved: status.lastSaved,
    error: status.error,
  };
};

export default useAutoSave;
