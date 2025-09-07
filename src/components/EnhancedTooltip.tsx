import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface EnhancedTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'default' | 'info' | 'warning' | 'error' | 'success';
  delay?: number;
  disabled?: boolean;
  className?: string;
  maxWidth?: string;
  showArrow?: boolean;
}

const variantClasses = {
  default: 'bg-popover text-popover-foreground border-border',
  info: 'bg-blue-500 text-white border-blue-600',
  warning: 'bg-yellow-500 text-yellow-950 border-yellow-600',
  error: 'bg-destructive text-destructive-foreground border-destructive',
  success: 'bg-green-500 text-white border-green-600'
};

const positionClasses = {
  top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
};

const arrowClasses = {
  top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
  bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
  left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
  right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent'
};

export const EnhancedTooltip: React.FC<EnhancedTooltipProps> = ({
  children,
  content,
  position = 'top',
  variant = 'default',
  delay = 500,
  disabled = false,
  className,
  maxWidth = '200px',
  showArrow = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (disabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setShouldShow(true);
      // Small delay for smooth animation
      setTimeout(() => setIsVisible(true), 10);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setIsVisible(false);
    setTimeout(() => setShouldShow(false), 150); // Match animation duration
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      hideTooltip();
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Position adjustment for viewport boundaries
  useEffect(() => {
    if (shouldShow && tooltipRef.current && triggerRef.current) {
      const tooltip = tooltipRef.current;
      const trigger = triggerRef.current;
      const rect = tooltip.getBoundingClientRect();
      const triggerRect = trigger.getBoundingClientRect();
      
      // Adjust position if tooltip goes outside viewport
      if (rect.right > window.innerWidth) {
        tooltip.style.left = 'auto';
        tooltip.style.right = '0';
      }
      if (rect.left < 0) {
        tooltip.style.left = '0';
        tooltip.style.right = 'auto';
      }
      if (rect.bottom > window.innerHeight) {
        tooltip.style.top = 'auto';
        tooltip.style.bottom = '100%';
      }
      if (rect.top < 0) {
        tooltip.style.top = '100%';
        tooltip.style.bottom = 'auto';
      }
    }
  }, [shouldShow]);

  return (
    <div 
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      onKeyDown={handleKeyDown}
    >
      {children}
      
      {shouldShow && (
        <div
          ref={tooltipRef}
          role="tooltip"
          aria-hidden={!isVisible}
          className={cn(
            'absolute z-50 px-3 py-2 text-sm font-medium rounded-lg border shadow-lg',
            'transition-all duration-150 ease-in-out',
            'pointer-events-none select-none',
            positionClasses[position],
            variantClasses[variant],
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            className
          )}
          style={{ maxWidth }}
        >
          {content}
          
          {showArrow && (
            <div
              className={cn(
                'absolute w-0 h-0 border-4',
                arrowClasses[position]
              )}
              style={{
                borderTopColor: variant === 'default' ? 'hsl(var(--popover))' : 
                               variant === 'info' ? '#3b82f6' :
                               variant === 'warning' ? '#eab308' :
                               variant === 'error' ? 'hsl(var(--destructive))' :
                               variant === 'success' ? '#22c55e' : 'hsl(var(--popover))',
                borderBottomColor: variant === 'default' ? 'hsl(var(--popover))' : 
                                  variant === 'info' ? '#3b82f6' :
                                  variant === 'warning' ? '#eab308' :
                                  variant === 'error' ? 'hsl(var(--destructive))' :
                                  variant === 'success' ? '#22c55e' : 'hsl(var(--popover))',
                borderLeftColor: variant === 'default' ? 'hsl(var(--popover))' : 
                                variant === 'info' ? '#3b82f6' :
                                variant === 'warning' ? '#eab308' :
                                variant === 'error' ? 'hsl(var(--destructive))' :
                                variant === 'success' ? '#22c55e' : 'hsl(var(--popover))',
                borderRightColor: variant === 'default' ? 'hsl(var(--popover))' : 
                                 variant === 'info' ? '#3b82f6' :
                                 variant === 'warning' ? '#eab308' :
                                 variant === 'error' ? 'hsl(var(--destructive))' :
                                 variant === 'success' ? '#22c55e' : 'hsl(var(--popover))'
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

// Simplified tooltip for common use cases
export const Tooltip: React.FC<{
  children: React.ReactNode;
  text: string;
  position?: EnhancedTooltipProps['position'];
}> = ({ children, text, position = 'top' }) => (
  <EnhancedTooltip content={text} position={position}>
    {children}
  </EnhancedTooltip>
);

// Info tooltip with icon
export const InfoTooltip: React.FC<{
  children: React.ReactNode;
  title?: string;
  description: string;
}> = ({ children, title, description }) => (
  <EnhancedTooltip
    variant="info"
    content={
      <div className="space-y-1">
        {title && <div className="font-semibold">{title}</div>}
        <div className="text-xs opacity-90">{description}</div>
      </div>
    }
    maxWidth="250px"
  >
    {children}
  </EnhancedTooltip>
);