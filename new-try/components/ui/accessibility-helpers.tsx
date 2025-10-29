import React from 'react';
import { cn } from '@/lib/utils';

// Screen reader only text component
export interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  className?: string;
}

export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({ 
  children, 
  className 
}) => {
  return (
    <span 
      className={cn(
        'sr-only absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0',
        className
      )}
    >
      {children}
    </span>
  );
};

// Skip to content link
export interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ 
  href, 
  children, 
  className 
}) => {
  return (
    <a
      href={href}
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4',
        'bg-blue-600 text-white px-4 py-2 rounded-md z-50',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        className
      )}
    >
      {children}
    </a>
  );
};

// Accessible form field wrapper
export interface AccessibleFieldProps {
  id: string;
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const AccessibleField: React.FC<AccessibleFieldProps> = ({
  id,
  label,
  description,
  error,
  required = false,
  children,
  className
}) => {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const ariaDescribedBy = [descriptionId, errorId].filter(Boolean).join(' ');

  return (
    <div className={cn('space-y-2', className)}>
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="Pflichtfeld">
            *
          </span>
        )}
      </label>
      
      {description && (
        <p 
          id={descriptionId}
          className="text-sm text-gray-600"
        >
          {description}
        </p>
      )}
      
      <div className="relative">
        {React.cloneElement(children as React.ReactElement, {
          id,
          'aria-describedby': ariaDescribedBy || undefined,
          'aria-invalid': error ? 'true' : undefined,
          'aria-required': required
        })}
      </div>
      
      {error && (
        <p 
          id={errorId}
          className="text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
};

// Accessible button with loading state
export interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  isLoading = false,
  loadingText = 'Wird geladen...',
  variant = 'primary',
  size = 'md',
  children,
  disabled,
  className,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-describedby={isLoading ? `${props.id}-loading` : undefined}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span id={`${props.id}-loading`}>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

// Accessible tab navigation
export interface AccessibleTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    content: React.ReactNode;
    disabled?: boolean;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const AccessibleTabs: React.FC<AccessibleTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className
}) => {
  const handleKeyDown = (event: React.KeyboardEvent, tabId: string, index: number) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        const prevIndex = index > 0 ? index - 1 : tabs.length - 1;
        const prevTab = tabs[prevIndex];
        if (!prevTab.disabled) {
          onTabChange(prevTab.id);
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        const nextIndex = index < tabs.length - 1 ? index + 1 : 0;
        const nextTab = tabs[nextIndex];
        if (!nextTab.disabled) {
          onTabChange(nextTab.id);
        }
        break;
      case 'Home':
        event.preventDefault();
        const firstTab = tabs.find(tab => !tab.disabled);
        if (firstTab) {
          onTabChange(firstTab.id);
        }
        break;
      case 'End':
        event.preventDefault();
        const lastTab = tabs.slice().reverse().find(tab => !tab.disabled);
        if (lastTab) {
          onTabChange(lastTab.id);
        }
        break;
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div 
        role="tablist" 
        className="flex border-b border-gray-200"
        aria-label="Navigation"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-controls={`panel-${tab.id}`}
            aria-selected={activeTab === tab.id}
            tabIndex={activeTab === tab.id ? 0 : -1}
            disabled={tab.disabled}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              tab.disabled && 'opacity-50 cursor-not-allowed'
            )}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== tab.id}
          className="mt-4"
        >
          {activeTab === tab.id && tab.content}
        </div>
      ))}
    </div>
  );
};

// Hook for managing focus
export const useFocusManagement = () => {
  const focusRef = React.useRef<HTMLElement | null>(null);

  const setFocus = React.useCallback((element: HTMLElement | null) => {
    if (element) {
      element.focus();
      focusRef.current = element;
    }
  }, []);

  const restoreFocus = React.useCallback(() => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  }, []);

  const trapFocus = React.useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    setFocus,
    restoreFocus,
    trapFocus
  };
};

// Announce changes to screen readers
export const useAnnouncer = () => {
  const [announcement, setAnnouncement] = React.useState('');

  const announce = React.useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement(message);
    // Clear after announcement
    setTimeout(() => setAnnouncement(''), 1000);
  }, []);

  const AnnouncerComponent = React.useMemo(() => (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  ), [announcement]);

  return {
    announce,
    AnnouncerComponent
  };
};