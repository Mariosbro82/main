import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SegmentedControlOption {
  value: string;
  label: ReactNode;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function SegmentedControl({
  options,
  value,
  onValueChange,
  className = ""
}: SegmentedControlProps) {
  return (
    <div className={cn("segmented-control", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={cn(
            "flex-1 px-4 py-2 text-sm font-medium transition-all duration-200",
            value === option.value
              ? "bg-white text-foreground shadow-sm"
              : "bg-transparent text-muted-foreground hover:text-foreground"
          )}
          onClick={() => onValueChange(option.value)}
          data-testid={`segment-${option.value}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
