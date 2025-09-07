import React, { useState, useRef, useEffect } from 'react';
import { Settings, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface EditableValueProps {
  value: number;
  onSave: (value: number) => Promise<void> | void;
  onCancel?: () => void;
  format?: 'currency' | 'percentage' | 'number';
  suffix?: string;
  prefix?: string;
  className?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  showEditIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'highlight' | 'muted';
}

const EditableValue: React.FC<EditableValueProps> = ({
  value,
  onSave,
  onCancel,
  format = 'number',
  suffix = '',
  prefix = '',
  className = '',
  disabled = false,
  min,
  max,
  step = 1,
  placeholder,
  showEditIcon = true,
  size = 'md',
  variant = 'default'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update edit value when prop value changes
  useEffect(() => {
    if (!isEditing) {
      setEditValue(value.toString());
      setHasChanged(false);
    }
  }, [value, isEditing]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return formatCurrency(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString();
    }
  };

  const handleStartEdit = () => {
    if (disabled) return;
    setIsEditing(true);
    setEditValue(value.toString());
  };

  const handleSave = async () => {
    const numValue = parseFloat(editValue);
    
    // Validation
    if (isNaN(numValue)) {
      setEditValue(value.toString());
      return;
    }
    
    if (min !== undefined && numValue < min) {
      setEditValue(min.toString());
      return;
    }
    
    if (max !== undefined && numValue > max) {
      setEditValue(max.toString());
      return;
    }

    setIsLoading(true);
    try {
      await onSave(numValue);
      setIsEditing(false);
      setHasChanged(true);
      
      // Show change indicator briefly
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setHasChanged(false), 2000);
    } catch (error) {
      console.error('Error saving value:', error);
      setEditValue(value.toString());
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value.toString());
    setIsEditing(false);
    onCancel?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const sizeClasses = {
    sm: 'text-sm h-6',
    md: 'text-base h-8',
    lg: 'text-lg h-10'
  };

  const variantClasses = {
    default: 'text-foreground',
    highlight: 'text-blue-600 font-semibold',
    muted: 'text-muted-foreground'
  };

  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  if (isEditing) {
    return (
      <div className={cn('flex items-center space-x-1', className)}>
        <div className="relative">
          <Input
            ref={inputRef}
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn('pr-8', sizeClasses[size])}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            disabled={isLoading}
          />
          {prefix && (
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
              {prefix}
            </span>
          )}
          {suffix && (
            <span className="absolute right-8 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
              {suffix}
            </span>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleSave}
          disabled={isLoading}
          className="p-1 h-6 w-6"
        >
          {isLoading ? (
            <Loader2 className={cn('animate-spin', iconSize[size])} />
          ) : (
            <Check className={cn('text-green-600', iconSize[size])} />
          )}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCancel}
          disabled={isLoading}
          className="p-1 h-6 w-6"
        >
          <X className={cn('text-red-600', iconSize[size])} />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      'group flex items-center space-x-1 transition-all duration-200',
      hasChanged && 'animate-pulse',
      className
    )}>
      <span className={cn(
        'transition-colors duration-200',
        sizeClasses[size],
        variantClasses[variant],
        hasChanged && 'text-green-600 font-semibold'
      )}>
        {prefix}{formatValue(value)}{suffix}
      </span>
      {showEditIcon && !disabled && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleStartEdit}
          className={cn(
            'p-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200',
            hasChanged && 'opacity-100'
          )}
        >
          <Settings className={cn(
            'text-muted-foreground hover:text-foreground transition-colors',
            iconSize[size],
            hasChanged && 'text-green-600'
          )} />
        </Button>
      )}
    </div>
  );
};

export default EditableValue;