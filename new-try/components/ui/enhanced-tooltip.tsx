import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { HelpCircle, Info } from 'lucide-react';

interface EnhancedTooltipProps {
  content: string;
  children?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click';
  icon?: 'help' | 'info' | 'none';
  className?: string;
  maxWidth?: string;
}

export const EnhancedTooltip: React.FC<EnhancedTooltipProps> = ({
  content,
  children,
  position = 'top',
  trigger = 'hover',
  icon = 'help',
  className,
  maxWidth = 'max-w-xs'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800'
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') setIsVisible(true);
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') setIsVisible(false);
  };

  const handleClick = () => {
    if (trigger === 'click') setIsVisible(!isVisible);
  };

  const renderIcon = () => {
    if (icon === 'none') return null;
    
    const IconComponent = icon === 'help' ? HelpCircle : Info;
    return (
      <IconComponent className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors cursor-help" />
    );
  };

  return (
    <div className={cn('relative inline-block', className)}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="inline-flex items-center gap-1"
      >
        {children}
        {renderIcon()}
      </div>
      
      {isVisible && (
        <div className={cn(
          'absolute z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg transition-all duration-200 ease-in-out transform scale-100 opacity-100',
          maxWidth,
          positionClasses[position]
        )}>
          {content}
          <div className={cn(
            'absolute w-0 h-0 border-4',
            arrowClasses[position]
          )} />
        </div>
      )}
    </div>
  );
};

export default EnhancedTooltip;