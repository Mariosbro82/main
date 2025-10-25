import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface ResultCardProps {
  title: string;
  value: number;
  formatter?: (value: number) => string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  valueColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  default: {
    card: 'bg-card',
    value: 'text-foreground',
    icon: 'text-primary',
  },
  success: {
    card: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
    value: 'text-green-700 dark:text-green-400',
    icon: 'text-green-600 dark:text-green-500',
  },
  warning: {
    card: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800',
    value: 'text-amber-700 dark:text-amber-400',
    icon: 'text-amber-600 dark:text-amber-500',
  },
  destructive: {
    card: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
    value: 'text-red-700 dark:text-red-400',
    icon: 'text-red-600 dark:text-red-500',
  },
  info: {
    card: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
    value: 'text-blue-700 dark:text-blue-400',
    icon: 'text-blue-600 dark:text-blue-500',
  },
};

const sizeStyles = {
  sm: {
    title: 'text-xs',
    value: 'text-lg',
    icon: 'h-4 w-4',
    padding: 'pt-4',
  },
  md: {
    title: 'text-sm',
    value: 'text-2xl',
    icon: 'h-5 w-5',
    padding: 'pt-6',
  },
  lg: {
    title: 'text-base',
    value: 'text-3xl',
    icon: 'h-6 w-6',
    padding: 'pt-8',
  },
};

/**
 * ResultCard component - Display calculation results in a consistent card format
 *
 * Features:
 * - Multiple variants for different result types (success, warning, error, etc.)
 * - Icon support with custom colors
 * - Trend indicators (up/down arrows)
 * - Flexible value formatting
 * - Size variants (sm, md, lg)
 *
 * @example
 * <ResultCard
 *   title="Monthly Pension"
 *   value={2500}
 *   formatter={formatCurrency}
 *   description="At age 67"
 *   icon={TrendingUp}
 *   variant="success"
 *   trend="up"
 *   trendValue="+15%"
 * />
 */
export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  value,
  formatter = formatCurrency,
  description,
  icon: Icon,
  iconColor,
  valueColor,
  trend,
  trendValue,
  variant = 'default',
  className,
  size = 'md',
}) => {
  const styles = variantStyles[variant];
  const sizes = sizeStyles[size];

  const formattedValue = Number.isFinite(value) ? formatter(value) : '—';

  const getTrendIcon = () => {
    if (trend === 'up') {
      return (
        <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      );
    }
    if (trend === 'down') {
      return (
        <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      );
    }
    return null;
  };

  return (
    <Card className={cn(styles.card, className)}>
      <CardContent className={sizes.padding}>
        <div className="space-y-2">
          {/* Header with title and icon */}
          <div className="flex items-center justify-between">
            <p className={cn('font-medium text-muted-foreground', sizes.title)}>
              {title}
            </p>
            {Icon && (
              <Icon
                className={cn(
                  sizes.icon,
                  iconColor || styles.icon
                )}
              />
            )}
          </div>

          {/* Value with optional trend */}
          <div className="flex items-baseline gap-2">
            <p
              className={cn(
                'font-bold',
                sizes.value,
                valueColor || styles.value
              )}
            >
              {formattedValue}
            </p>
            {trendValue && (
              <div className="flex items-center gap-1 text-sm">
                {getTrendIcon()}
                <span className={cn(
                  'font-medium',
                  trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
                )}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * ResultCardGrid component - Grid layout for multiple result cards
 *
 * @example
 * <ResultCardGrid>
 *   <ResultCard title="..." value={...} />
 *   <ResultCard title="..." value={...} />
 *   <ResultCard title="..." value={...} />
 * </ResultCardGrid>
 */
export const ResultCardGrid: React.FC<{
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}> = ({ children, columns = 4, className }) => {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 xl:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4 grid-cols-1', gridCols[columns], className)}>
      {children}
    </div>
  );
};

export default ResultCard;
