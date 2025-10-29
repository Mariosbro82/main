import React, { useState, useEffect } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface ValidatedSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label: string;
  required?: boolean;
  placeholder?: string;
  validator?: (value: string) => string | null;
  className?: string;
  disabled?: boolean;
  'aria-describedby'?: string;
}

const ValidatedSelect: React.FC<ValidatedSelectProps> = ({
  value,
  onChange,
  options,
  label,
  required = false,
  placeholder = 'Bitte wählen',
  validator,
  className = '',
  disabled = false,
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const selectId = `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = `${selectId}-error`;

  useEffect(() => {
    if (touched && validator) {
      const validationError = validator(value);
      setError(validationError);
    }
  }, [value, validator, touched]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
    
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
  const selectClasses = `
    w-full px-3 py-2 border rounded-md transition-colors duration-200 appearance-none
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
        htmlFor={selectId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="Pflichtfeld">*</span>}
      </label>
      
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={disabled}
          className={selectClasses}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={[
            hasError ? errorId : null,
            ariaDescribedBy
          ].filter(Boolean).join(' ') || undefined}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        <ChevronDown 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
          aria-hidden="true"
        />
      </div>
      
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
    </div>
  );
};

export default ValidatedSelect;