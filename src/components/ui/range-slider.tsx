import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Slider } from "./slider";

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onValueChange: (value: number) => void;
  label?: string;
  suffix?: string;
  className?: string;
}

export function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onValueChange,
  label,
  suffix = "",
  className = ""
}: RangeSliderProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const handleValueChange = useCallback((values: number[]) => {
    const newValue = values[0];
    setDisplayValue(newValue);
    
    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Set new timeout for smoother updates
    debounceRef.current = setTimeout(() => {
      onValueChange(newValue);
    }, 100);
  }, [onValueChange]);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const sliderValue = useMemo(() => [displayValue], [displayValue]);

  return (
    <div className={`space-y-2 ${className}`}>
      <Slider
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onValueChange={handleValueChange}
        className="w-full"
        data-testid="range-slider"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}{suffix}</span>
        <span className="font-medium text-primary" data-testid="slider-value">
          {displayValue} {suffix}
        </span>
        <span>{max}{suffix}</span>
      </div>
    </div>
  );
}
