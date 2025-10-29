import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface ValidatedInputProps {
  type?: 'text' | 'number' | 'email';
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  label: string;
  required?: boolean;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  validator?: (value: any) => string | null;
  className?: string;
  disabled?: boolean;
  'aria-describedby'?: string;
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  required = false,
  unit,
  min,
  max,
  step,
  validator,
  className = '',
  disabled = false,
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputId = `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = `${inputId}-error`;
  const descriptionId = ariaDescribedBy || (unit ? `${inputId}-description` : undefined);

  useEffect(() => {
    if (touched && validator) {
      const validationError = validator(value);
      setError(validationError);
    }
  }, [value, validator, touched]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    onChange(newValue);
    
    if (!touched) {
      setTouched(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!touched) {
      setTouched(true);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const hasError = touched && error;
  const inputClasses = `
    w-full px-3 py-2 border rounded-md transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${hasError 
      ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300 hover:border-gray-400'
    }
    ${className}
  `.trim();

  return (
    <div className="space-y-1">
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="Pflichtfeld">*</span>}
        {unit && (
          <span 
            id={descriptionId}
            className="text-gray-500 text-xs ml-1"
            aria-label={`Einheit: ${unit}`}
          >
            ({unit})
          </span>
        )}
      </label>
      
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={inputClasses}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={[
          hasError ? errorId : null,
          descriptionId
        ].filter(Boolean).join(' ') || undefined}
        {...props}
      />
      
      {hasError && (
        <div 
          id={errorId}
          className="flex items-center space-x-1 text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
      
      {isFocused && !hasError && unit && (
        <div className="text-xs text-gray-500">
          Geben Sie den Betrag in {unit} ein
        </div>
      )}
    </div>
  );
};

export default ValidatedInput;