import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface ChartDataPoint {
  year: number;
  age: number;
  portfolioValue: number;
  contribution: number;
  fees: number;
  payout?: number;
  isPayoutPhase: boolean;
}

interface RealtimeChartProps {
  data: ChartDataPoint[];
  title: string;
  type?: 'line' | 'area' | 'bar';
  showAnimation?: boolean;
  highlightChanges?: boolean;
  onDataPointClick?: (dataPoint: ChartDataPoint) => void;
  isUpdating?: boolean;
  lastUpdate?: string;
}

const RealtimeChart: React.FC<RealtimeChartProps> = ({
  data,
  title,
  type = 'area',
  showAnimation = true,
  highlightChanges = true,
  onDataPointClick,
  isUpdating = false,
  lastUpdate
}) => {
  const [animationKey, setAnimationKey] = useState(0);
  const [previousData, setPreviousData] = useState<ChartDataPoint[]>([]);
  const [changedPoints, setChangedPoints] = useState<Set<number>>(new Set());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect changes in data
  useEffect(() => {
    if (highlightChanges && previousData.length > 0) {
      const changed = new Set<number>();
      data.forEach((point, index) => {
        const prevPoint = previousData[index];
        if (prevPoint && (
          Math.abs(point.portfolioValue - prevPoint.portfolioValue) > 100 ||
          Math.abs(point.contribution - prevPoint.contribution) > 10
        )) {
          changed.add(index);
        }
      });
      setChangedPoints(changed);
      
      // Clear highlights after animation
      if (changed.size > 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => setChangedPoints(new Set()), 2000);
      }
    }
    setPreviousData([...data]);
  }, [data, highlightChanges]); // Removed previousData dependency to prevent infinite re-renders

  // Trigger animation on data change
  useEffect(() => {
    if (showAnimation) {
      setAnimationKey(prev => prev + 1);
    }
  }, [data, showAnimation]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Calculate trend
  const trend = useMemo(() => {
    if (data.length < 2) return null;
    const first = data[0]?.portfolioValue || 0;
    const last = data[data.length - 1]?.portfolioValue || 0;
    const change = last - first;
    const percentage = first > 0 ? (change / first) * 100 : 0;
    return { change, percentage, isPositive: change >= 0 };
  }, [data]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{`Jahr ${label} (Alter: ${data.age})`}</p>
          <p className="text-blue-600">
            {`Portfoliowert: ${formatCurrency(data.portfolioValue)}`}
          </p>
          {data.contribution > 0 && (
            <p className="text-green-600">
              {`Beitrag: ${formatCurrency(data.contribution)}`}
            </p>
          )}
          {data.fees > 0 && (
            <p className="text-red-600">
              {`Gebühren: ${formatCurrency(data.fees)}`}
            </p>
          )}
          {data.payout && (
            <p className="text-purple-600">
              {`Auszahlung: ${formatCurrency(data.payout)}`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom dot for highlighting changes
  const CustomDot = (props: any) => {
    const { cx, cy, index } = props;
    if (changedPoints.has(index)) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={6}
          fill="#ef4444"
          stroke="#ffffff"
          strokeWidth={2}
          className="animate-pulse"
        />
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
      onClick: onDataPointClick
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => formatCurrency(value, true)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="portfolioValue"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={<CustomDot />}
              animationDuration={showAnimation ? 1000 : 0}
              animationBegin={0}
            />
          </LineChart>
        );
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatCurrency(value, true)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="portfolioValue"
              fill="#3b82f6"
              animationDuration={showAnimation ? 1000 : 0}
            />
          </BarChart>
        );
      
      default: // area
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => formatCurrency(value, true)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="portfolioValue"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorPortfolio)"
              dot={<CustomDot />}
              animationDuration={showAnimation ? 1000 : 0}
            />
          </AreaChart>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          {isUpdating && (
            <Badge variant="secondary" className="animate-pulse">
              <Activity className="w-3 h-3 mr-1" />
              Aktualisierung...
            </Badge>
          )}
          {trend && (
            <Badge variant={trend.isPositive ? "default" : "destructive"}>
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {trend.percentage.toFixed(1)}%
            </Badge>
          )}
          {lastUpdate && (
            <span className="text-xs text-muted-foreground">
              {new Date(lastUpdate).toLocaleTimeString()}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%" key={animationKey}>
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealtimeChart;