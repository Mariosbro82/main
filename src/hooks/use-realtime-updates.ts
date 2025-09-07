import { useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface RealtimeUpdateData {
  planId?: string;
  values: Record<string, any>;
  timestamp: string;
}

interface UseRealtimeUpdatesOptions {
  planId?: string;
  onUpdate?: (data: any) => void;
  debounceMs?: number;
}

export function useRealtimeUpdates({
  planId,
  onUpdate,
  debounceMs = 300
}: UseRealtimeUpdatesOptions = {}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const debounceRef = useRef<NodeJS.Timeout>();
  const updateQueueRef = useRef<RealtimeUpdateData[]>([]);

  // Debounced update function
  const debouncedUpdate = useCallback(async (data: RealtimeUpdateData) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setIsUpdating(true);
      
      try {
        let response;
        
        if (data.planId) {
          // Update existing plan
          response = await fetch(`/api/pension-plans/${data.planId}/update-values`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data.values),
          });
        } else {
          // Instant calculation for preview
          response = await fetch('/api/calculate-instant', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data.values),
          });
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Update React Query cache
        if (data.planId) {
          queryClient.setQueryData(['pension-plan', data.planId], result.plan);
          queryClient.setQueryData(['simulation', data.planId], result.simulation);
        }
        
        // Call onUpdate callback
        if (onUpdate) {
          onUpdate(result);
        }
        
        setLastUpdate(new Date().toISOString());
        
        // Process any queued updates
        if (updateQueueRef.current.length > 0) {
          const nextUpdate = updateQueueRef.current.shift();
          if (nextUpdate) {
            debouncedUpdate(nextUpdate);
          }
        }
      } catch (error) {
        console.error('Failed to update values:', error);
        // Optionally trigger error handling
      } finally {
        setIsUpdating(false);
      }
    }, debounceMs);
  }, [planId, onUpdate, debounceMs, queryClient]);

  // Queue update function
  const queueUpdate = useCallback((values: Record<string, any>) => {
    const updateData: RealtimeUpdateData = {
      planId,
      values,
      timestamp: new Date().toISOString()
    };

    if (isUpdating) {
      // Queue the update if currently processing
      updateQueueRef.current.push(updateData);
    } else {
      // Process immediately
      debouncedUpdate(updateData);
    }
  }, [planId, isUpdating, debouncedUpdate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    queueUpdate,
    isUpdating,
    lastUpdate
  };
}

// Hook for managing multiple field updates
export function useFieldUpdates(initialValues: Record<string, any> = {}) {
  const [values, setValues] = useState(initialValues);
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
  
  const updateField = useCallback((field: string, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setChangedFields(prev => new Set([...prev, field]));
  }, []);
  
  const resetChanges = useCallback(() => {
    setChangedFields(new Set());
  }, []);
  
  const getChangedValues = useCallback(() => {
    const changed: Record<string, any> = {};
    changedFields.forEach(field => {
      changed[field] = values[field];
    });
    return changed;
  }, [values, changedFields]);
  
  return {
    values,
    updateField,
    changedFields,
    resetChanges,
    getChangedValues,
    hasChanges: changedFields.size > 0
  };
}