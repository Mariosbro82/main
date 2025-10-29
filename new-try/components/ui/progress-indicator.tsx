import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export interface ProgressIndicatorProps {
  status: 'loading' | 'success' | 'error' | 'idle';
  message?: string;
  progress?: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'detailed';
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  status,
  message,
  progress,
  size = 'md',
  variant = 'default',
  className
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const renderIcon = () => {
    switch (status) {
      case 'loading':
        return (
          <Loader2 
            className={cn(
              'animate-spin text-blue-600',
              sizeClasses[size]
            )} 
          />
        );
      case 'success':
        return (
          <CheckCircle 
            className={cn(
              'text-green-600',
              sizeClasses[size]
            )} 
          />
        );
      case 'error':
        return (
          <AlertCircle 
            className={cn(
              'text-red-600',
              sizeClasses[size]
            )} 
          />
        );
      default:
        return null;
    }
  };

  const renderProgressBar = () => {
    if (typeof progress !== 'number' || variant === 'minimal') return null;

    return (
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    );
  };

  if (status === 'idle') return null;

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {renderIcon()}
        {message && (
          <span className={cn('text-gray-600', textSizeClasses[size])}>
            {message}
          </span>
        )}
      </div>
    );
  }

  return (
    <div 
      className={cn(
        'flex flex-col items-center justify-center p-4 rounded-lg',
        variant === 'detailed' && 'bg-gray-50 border border-gray-200',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 mb-2">
        {renderIcon()}
        {message && (
          <span className={cn(
            'font-medium',
            textSizeClasses[size],
            status === 'error' ? 'text-red-700' : 
            status === 'success' ? 'text-green-700' : 'text-gray-700'
          )}>
            {message}
          </span>
        )}
      </div>
      
      {renderProgressBar()}
      
      {typeof progress === 'number' && variant === 'detailed' && (
        <span className="text-xs text-gray-500 mt-1">
          {Math.round(progress)}% abgeschlossen
        </span>
      )}
    </div>
  );
};

// Specialized loading overlay component
export interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  progress?: number;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Wird geladen...',
  progress,
  className
}) => {
  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        'fixed inset-0 bg-black/50 flex items-center justify-center z-50',
        'backdrop-blur-sm transition-opacity duration-200',
        className
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Ladevorgang"
    >
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
        <ProgressIndicator
          status="loading"
          message={message}
          progress={progress}
          size="lg"
          variant="detailed"
        />
      </div>
    </div>
  );
};

// Hook for managing loading states
export const useProgressIndicator = () => {
  const [status, setStatus] = React.useState<ProgressIndicatorProps['status']>('idle');
  const [message, setMessage] = React.useState<string>('');
  const [progress, setProgress] = React.useState<number>(0);

  const startLoading = React.useCallback((loadingMessage?: string) => {
    setStatus('loading');
    setMessage(loadingMessage || 'Wird geladen...');
    setProgress(0);
  }, []);

  const updateProgress = React.useCallback((newProgress: number, newMessage?: string) => {
    setProgress(newProgress);
    if (newMessage) setMessage(newMessage);
  }, []);

  const setSuccess = React.useCallback((successMessage?: string) => {
    setStatus('success');
    setMessage(successMessage || 'Erfolgreich abgeschlossen');
    setProgress(100);
  }, []);

  const setError = React.useCallback((errorMessage?: string) => {
    setStatus('error');
    setMessage(errorMessage || 'Ein Fehler ist aufgetreten');
  }, []);

  const reset = React.useCallback(() => {
    setStatus('idle');
    setMessage('');
    setProgress(0);
  }, []);

  return {
    status,
    message,
    progress,
    startLoading,
    updateProgress,
    setSuccess,
    setError,
    reset
  };
};