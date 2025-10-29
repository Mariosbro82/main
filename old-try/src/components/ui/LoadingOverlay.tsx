import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  timeout?: number; // milliseconds, default 30000 (30s)
  onTimeout?: () => void;
  onRetry?: () => void;
  fullScreen?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/**
 * LoadingOverlay component with automatic timeout protection
 *
 * Features:
 * - Automatic timeout after specified duration (default 30s)
 * - Error state display when timeout occurs
 * - Retry functionality
 * - Full screen or inline mode
 * - Prevents indefinite loading states
 *
 * @example
 * <LoadingOverlay
 *   isLoading={isLoading}
 *   message="Loading data..."
 *   timeout={30000}
 *   onTimeout={() => {
 *     setIsLoading(false);
 *     showError("Request timed out");
 *   }}
 *   onRetry={() => refetch()}
 * >
 *   <YourContent />
 * </LoadingOverlay>
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = 'Laden...',
  timeout = 30000,
  onTimeout,
  onRetry,
  fullScreen = false,
  children,
  className,
}) => {
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Setup timeout when loading starts
  useEffect(() => {
    if (isLoading && !hasTimedOut) {
      const id = setTimeout(() => {
        setHasTimedOut(true);
        onTimeout?.();
      }, timeout);

      setTimeoutId(id);

      return () => {
        if (id) clearTimeout(id);
      };
    } else if (!isLoading) {
      // Reset timeout state when loading completes
      setHasTimedOut(false);
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
    }
  }, [isLoading, timeout, onTimeout, hasTimedOut, timeoutId]);

  const handleRetry = useCallback(() => {
    setHasTimedOut(false);
    onRetry?.();
  }, [onRetry]);

  if (!isLoading && !hasTimedOut) {
    return <>{children}</>;
  }

  const overlayContent = hasTimedOut ? (
    <Card className="bg-background/95 backdrop-blur border-destructive">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Zeitüberschreitung
            </h3>
            <p className="text-sm text-muted-foreground">
              Die Anfrage hat zu lange gedauert. Bitte versuchen Sie es erneut.
            </p>
          </div>
          {onRetry && (
            <Button onClick={handleRetry} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Erneut versuchen
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card className="bg-background/95 backdrop-blur">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          {message && (
            <p className="text-sm text-muted-foreground">{message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (fullScreen) {
    return (
      <div
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm',
          className
        )}
      >
        {overlayContent}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative min-h-[200px]',
        className
      )}
    >
      {children && (
        <div className={cn(isLoading || hasTimedOut ? 'opacity-50 pointer-events-none' : '')}>
          {children}
        </div>
      )}
      {(isLoading || hasTimedOut) && (
        <div className="absolute inset-0 flex items-center justify-center">
          {overlayContent}
        </div>
      )}
    </div>
  );
};

/**
 * Hook to manage loading state with automatic timeout protection
 *
 * @param options Configuration options
 * @returns Loading state management functions
 *
 * @example
 * const { isLoading, startLoading, stopLoading, hasTimedOut } = useLoadingWithTimeout({
 *   timeout: 30000,
 *   onTimeout: () => console.error("Request timed out")
 * });
 */
export const useLoadingWithTimeout = (options: {
  timeout?: number;
  onTimeout?: () => void;
} = {}) => {
  const { timeout = 30000, onTimeout } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setHasTimedOut(false);

    const id = setTimeout(() => {
      setIsLoading(false);
      setHasTimedOut(true);
      onTimeout?.();
    }, timeout);

    setTimeoutId(id);
  }, [timeout, onTimeout]);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setHasTimedOut(false);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setHasTimedOut(false);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return {
    isLoading,
    hasTimedOut,
    startLoading,
    stopLoading,
    reset,
  };
};

export default LoadingOverlay;
