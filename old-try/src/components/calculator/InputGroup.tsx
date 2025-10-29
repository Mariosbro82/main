import React from 'react';
import { Label } from '@/components/ui/label';
import { NumberInput, NumberInputProps } from '@/components/ui/NumberInput';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface InputGroupProps extends Omit<NumberInputProps, 'value' | 'onChange'> {
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  type?: 'number' | 'currency' | 'percentage';
  helpText?: string;
  tooltip?: string;
  error?: string;
  required?: boolean;
  suffix?: string;
  prefix?: string;
  containerClassName?: string;
  labelClassName?: string;
}

/**
 * InputGroup component - Reusable input with label, validation, and help text
 *
 * Features:
 * - Automatic number validation and formatting
 * - Support for currency, percentage, and number types
 * - Tooltip for additional information
 * - Error state display
 * - Prefix/suffix support (€, %, etc.)
 *
 * @example
 * <InputGroup
 *   label="Monthly Contribution"
 *   value={contribution}
 *   onChange={(val) => setContribution(val)}
 *   type="currency"
 *   helpText="Enter your monthly savings amount"
 *   tooltip="This is the amount you plan to save each month"
 *   min={0}
 *   max={10000}
 * />
 */
export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  value,
  onChange,
  type = 'number',
  helpText,
  tooltip,
  error,
  required = false,
  suffix,
  prefix,
  containerClassName,
  labelClassName,
  className,
  ...inputProps
}) => {
  // Set defaults based on type
  const getTypeDefaults = (): Partial<NumberInputProps> => {
    switch (type) {
      case 'currency':
        return {
          min: 0,
          decimals: 2,
          formatOnBlur: true,
        };
      case 'percentage':
        return {
          min: 0,
          max: 100,
          decimals: 2,
          formatOnBlur: true,
        };
      case 'number':
      default:
        return {
          decimals: 0,
        };
    }
  };

  const typeDefaults = getTypeDefaults();

  // Determine suffix based on type
  const displaySuffix = suffix || (type === 'currency' ? '€' : type === 'percentage' ? '%' : '');
  const displayPrefix = prefix;

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {/* Label with tooltip */}
      <div className="flex items-center gap-2">
        <Label
          className={cn(
            'text-sm font-medium',
            error ? 'text-destructive' : '',
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="inline-flex">
                  <InfoIcon className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Input with prefix/suffix */}
      <div className="relative">
        {displayPrefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
            {displayPrefix}
          </span>
        )}
        <NumberInput
          {...typeDefaults}
          {...inputProps}
          value={value}
          onChange={onChange}
          className={cn(
            displayPrefix && 'pl-8',
            displaySuffix && 'pr-8',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${label}-error` : helpText ? `${label}-help` : undefined}
        />
        {displaySuffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
            {displaySuffix}
          </span>
        )}
      </div>

      {/* Help text or error message */}
      {error ? (
        <p
          id={`${label}-error`}
          className="text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : helpText ? (
        <p
          id={`${label}-help`}
          className="text-sm text-muted-foreground"
        >
          {helpText}
        </p>
      ) : null}
    </div>
  );
};

export default InputGroup;
