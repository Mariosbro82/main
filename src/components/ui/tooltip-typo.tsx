import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { tooltipCorrections } from "@/lib/types";

interface TooltipTypoProps {
  children: ReactNode;
  text: string;
  className?: string;
}

export function TooltipTypo({ children, text, className = "" }: TooltipTypoProps) {
  const correction = tooltipCorrections[text];
  
  if (!correction) {
    return <span className={className}>{children}</span>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`cursor-help underline decoration-dotted ${className}`}>
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{correction}</p>
      </TooltipContent>
    </Tooltip>
  );
}
