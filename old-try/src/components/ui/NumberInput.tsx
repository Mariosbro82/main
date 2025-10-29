import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  value?: number | string;
  onChange?: (value: number) => void;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  decimals?: number;
  allowNegative?: boolean;
  formatOnBlur?: boolean;
  className?: string;
}

/**
 * NumberInput component that handles number input with proper validation
 * - Strips leading zeros
 * - Validates numeric input
 * - Handles min/max constraints
 * - Formats on blur (optional)
 * - Prevents non-numeric characters
 */
export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value = '',
      onChange,
      onValueChange,
      min,
      max,
      step = 1,
      decimals = 2,
      allowNegative = false,
      formatOnBlur = true,
      className,
      onBlur,
      onFocus,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState<string>('');
    const [isFocused, setIsFocused] = useState(false);

    // Update display value when prop value changes
    useEffect(() => {
      const numValue = typeof value === 'number' ? value : parseFloat(value as string) || 0;
      if (!isFocused) {
        setDisplayValue(numValue.toString());
      }
    }, [value, isFocused]);

    const sanitizeInput = useCallback(
      (input: string): string => {
        // Allow empty string
        if (input === '') return '';

        // Allow negative sign if allowNegative is true and it's at the start
        if (allowNegative && input === '-') return '-';

        // Remove any non-numeric characters except decimal point and negative sign
        let sanitized = input.replace(/[^\d.-]/g, '');

        // Only allow one decimal point
        const parts = sanitized.split('.');
        if (parts.length > 2) {
          sanitized = parts[0] + '.' + parts.slice(1).join('');
        }

        // Only allow negative sign at the start
        if (!allowNegative) {
          sanitized = sanitized.replace(/-/g, '');
        } else {
          const negative = sanitized.startsWith('-');
          sanitized = sanitized.replace(/-/g, '');
          if (negative) sanitized = '-' + sanitized;
        }

        return sanitized;
      },
      [allowNegative]
    );

    const stripLeadingZeros = useCallback((input: string): string => {
      if (input === '' || input === '-') return input;

      // Handle decimal numbers
      if (input.includes('.')) {
        const [intPart, decPart] = input.split('.');
        const cleanedInt = intPart.replace(/^(-?)0+(?=\d)/, '$1') || '0';
        return `${cleanedInt}.${decPart}`;
      }

      // Handle integers
      return input.replace(/^(-?)0+(?=\d)/, '$1') || '0';
    }, []);

    const validateAndClamp = useCallback(
      (numValue: number): number => {
        if (!Number.isFinite(numValue)) return 0;

        let clamped = numValue;
        if (typeof min === 'number') {
          clamped = Math.max(min, clamped);
        }
        if (typeof max === 'number') {
          clamped = Math.min(max, clamped);
        }

        // Round to specified decimals
        if (typeof decimals === 'number') {
          const multiplier = Math.pow(10, decimals);
          clamped = Math.round(clamped * multiplier) / multiplier;
        }

        return clamped;
      },
      [min, max, decimals]
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawInput = e.target.value;
        const sanitized = sanitizeInput(rawInput);

        setDisplayValue(sanitized);

        // Parse and validate
        if (sanitized === '' || sanitized === '-') {
          const zeroValue = 0;
          onChange?.(zeroValue);
          onValueChange?.(zeroValue);
          return;
        }

        const numValue = parseFloat(sanitized);
        if (Number.isFinite(numValue)) {
          const validated = validateAndClamp(numValue);
          onChange?.(validated);
          onValueChange?.(validated);
        }
      },
      [sanitizeInput, validateAndClamp, onChange, onValueChange]
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);

        // Strip leading zeros and format
        const stripped = stripLeadingZeros(displayValue);

        if (stripped === '' || stripped === '-') {
          setDisplayValue('0');
          onChange?.(0);
          onValueChange?.(0);
        } else {
          const numValue = parseFloat(stripped);
          if (Number.isFinite(numValue)) {
            const validated = validateAndClamp(numValue);

            if (formatOnBlur) {
              // Format with proper decimal places
              setDisplayValue(validated.toString());
            } else {
              setDisplayValue(stripped);
            }

            onChange?.(validated);
            onValueChange?.(validated);
          }
        }

        onBlur?.(e);
      },
      [displayValue, stripLeadingZeros, validateAndClamp, formatOnBlur, onChange, onValueChange, onBlur]
    );

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus?.(e);
      },
      [onFocus]
    );

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className={cn(className)}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';

export default NumberInput;
