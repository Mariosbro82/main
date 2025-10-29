import React, { memo, useMemo, useRef, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { TrendingUp, Euro, Calendar, BarChart3 } from 'lucide-react';

interface DataPoint {
  year: number;
  portfolioValue: number;
  contribution: number;
  fees: number;
  taxes: number;
  age?: number;
  month?: number;
  isPayoutPhase?: boolean;
}

interface PensionChartProps {
  data: DataPoint[];
  height?: number;
  chartType?: 'area' | 'line' | 'composed';
  showLegend?: boolean;
  showGrid?: boolean;
  theme?: 'light' | 'dark';
  ariaLabel?: string;
  ariaDescription?: string;
  onDataPointFocus?: (dataPoint: DataPoint | null) => void;
}

// Enhanced custom tooltip component with better formatting and animations
const CustomTooltip = memo(({ active, payload, label, theme = 'light' }: any) => {
  if (active && payload && payload.length) {
    const isDark = theme === 'dark';
    const bgClass = isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200';
    const textClass = isDark ? 'text-gray-100' : 'text-gray-900';
    const subtextClass = isDark ? 'text-gray-300' : 'text-gray-600';
    
    return (
      <div className={`${bgClass} p-5 border rounded-xl shadow-2xl backdrop-blur-sm transition-all duration-200 transform scale-105`}>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-blue-500" />
          <p className={`font-bold ${textClass} text-base`}>{`Jahr: ${label}`}</p>
        </div>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => {
            const value = typeof entry.value === 'number' ? entry.value : 0;
            const formattedValue = new Intl.NumberFormat('de-DE', {
              style: 'currency',
              currency: 'EUR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(value);
            
            return (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className={`text-sm font-medium ${subtextClass}`}>
                    {entry.name}:
                  </span>
                </div>
                <span className={`font-bold ${textClass} text-sm`}>
                  {formattedValue}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
});

const PensionChart: React.FC<PensionChartProps> = memo(({ 
  data, 
  height = 400, 
  chartType = 'area',
  showLegend = true,
  showGrid = true,
  theme = 'light',
  ariaLabel = 'Kapitalentwicklung Diagramm',
  ariaDescription = 'Zeigt die prognostizierte Entwicklung des Portfoliowerts über die Zeit',
  onDataPointFocus
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [focusedDataPoint, setFocusedDataPoint] = React.useState<DataPoint | null>(null);
  
  // Keyboard navigation for chart data points
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!chartRef.current?.contains(event.target as Node)) return;
      
      const currentIndex = focusedDataPoint ? 
        chartData.findIndex(point => point.year === focusedDataPoint.year) : -1;
      
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          event.preventDefault();
          const nextIndex = Math.min(currentIndex + 1, chartData.length - 1);
          const nextPoint = chartData[nextIndex];
          setFocusedDataPoint(nextPoint);
          onDataPointFocus?.(nextPoint);
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          event.preventDefault();
          const prevIndex = Math.max(currentIndex - 1, 0);
          const prevPoint = chartData[prevIndex];
          setFocusedDataPoint(prevPoint);
          onDataPointFocus?.(prevPoint);
          break;
        case 'Home':
          event.preventDefault();
          const firstPoint = chartData[0];
          setFocusedDataPoint(firstPoint);
          onDataPointFocus?.(firstPoint);
          break;
        case 'End':
          event.preventDefault();
          const lastPoint = chartData[chartData.length - 1];
          setFocusedDataPoint(lastPoint);
          onDataPointFocus?.(lastPoint);
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [chartData, focusedDataPoint, onDataPointFocus]);
  // Memoized chart data processing for performance
  const chartData = useMemo(() => {
    return data.map(point => ({
      ...point,
      portfolioValue: Math.round(point.portfolioValue),
      contribution: Math.round(point.contribution),
      fees: Math.round(point.fees),
      taxes: Math.round(point.taxes),
      netValue: Math.round(point.portfolioValue - point.fees - point.taxes)
    }));
  }, [data]);
  
  // Memoized gradient definitions
  const gradients = useMemo(() => ({
    portfolioGradient: {
      id: 'portfolioGradient',
      colors: ['#3B82F6', '#1E40AF']
    },
    contributionGradient: {
      id: 'contributionGradient', 
      colors: ['#10B981', '#059669']
    },
    feesGradient: {
      id: 'feesGradient',
      colors: ['#F59E0B', '#D97706']
    }
  }), []);
  
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#374151' : '#E5E7EB';
  const textColor = isDark ? '#D1D5DB' : '#6B7280';

  // Chart component renderer based on type
  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };
    
    const commonElements = (
      <>
        <defs>
          {Object.values(gradients).map(gradient => (
            <linearGradient key={gradient.id} id={gradient.id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={gradient.colors[0]} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={gradient.colors[0]} stopOpacity={0.1}/>
            </linearGradient>
          ))}
        </defs>
        {showGrid && (
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={gridColor} 
            opacity={0.3}
          />
        )}
        <XAxis 
          dataKey="year" 
          stroke={textColor}
          fontSize={11}
          tickFormatter={(value) => value.toString()}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          stroke={textColor}
          fontSize={11}
          tickFormatter={(value) => {
            if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `€${(value / 1000).toFixed(0)}k`;
            return `€${value}`;
          }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip theme={theme} />} />
        {showLegend && (
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
        )}
      </>
    );
    
    if (chartType === 'line') {
      return (
        <LineChart {...commonProps}>
          {commonElements}
          <Line
            type="monotone"
            dataKey="portfolioValue"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
            name="Portfoliowert"
          />
          <Line
            type="monotone"
            dataKey="contribution"
            stroke="#10B981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Eingezahlte Beiträge"
          />
        </LineChart>
      );
    }
    
    return (
      <AreaChart {...commonProps}>
        {commonElements}
        <Area
          type="monotone"
          dataKey="portfolioValue"
          stroke="#3B82F6"
          fill="url(#portfolioGradient)"
          name="Portfoliowert"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="contribution"
          stroke="#10B981"
          fill="url(#contributionGradient)"
          name="Eingezahlte Beiträge"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="fees"
          stroke="#F59E0B"
          fill="url(#feesGradient)"
          name="Gebühren"
          strokeWidth={2}
        />
        <ReferenceLine 
          y={0} 
          stroke={textColor} 
          strokeDasharray="5 5" 
          label={{ value: "Break-Even", position: "topLeft" }}
        />
      </AreaChart>
    );
  };
  
  // Generate accessible data summary for screen readers
  const dataSummary = useMemo(() => {
    if (chartData.length === 0) return 'Keine Daten verfügbar';
    
    const firstYear = chartData[0];
    const lastYear = chartData[chartData.length - 1];
    const maxValue = Math.max(...chartData.map(d => d.portfolioValue));
    const totalContributions = lastYear.contribution;
    
    return `Diagramm zeigt Kapitalentwicklung von ${firstYear.year} bis ${lastYear.year}. ` +
           `Maximaler Portfoliowert: ${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(maxValue)}. ` +
           `Gesamte Beiträge: ${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(totalContributions)}. ` +
           `Verwenden Sie die Pfeiltasten zur Navigation durch die Datenpunkte.`;
  }, [chartData]);
  
  return (
    <div 
      ref={chartRef}
      className="w-full chart-container"
      role="img"
      aria-label={ariaLabel}
      aria-describedby="chart-description chart-summary"
      tabIndex={0}
      onFocus={() => {
        if (chartData.length > 0 && !focusedDataPoint) {
          setFocusedDataPoint(chartData[0]);
          onDataPointFocus?.(chartData[0]);
        }
      }}
    >
      {/* Hidden descriptions for screen readers */}
      <div id="chart-description" className="sr-only">
        {ariaDescription}
      </div>
      <div id="chart-summary" className="sr-only">
        {dataSummary}
      </div>
      
      {/* Focused data point announcement for screen readers */}
      {focusedDataPoint && (
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Jahr {focusedDataPoint.year}: Portfoliowert {new Intl.NumberFormat('de-DE', { 
            style: 'currency', 
            currency: 'EUR', 
            maximumFractionDigits: 0 
          }).format(focusedDataPoint.portfolioValue)}, 
          Beiträge {new Intl.NumberFormat('de-DE', { 
            style: 'currency', 
            currency: 'EUR', 
            maximumFractionDigits: 0 
          }).format(focusedDataPoint.contribution)}
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-500" aria-hidden="true" />
          <h3 className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            Kapitalentwicklung
          </h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4" aria-hidden="true" />
          <span>Prognose basierend auf historischen Daten</span>
        </div>
      </div>
      
      {/* Chart container with enhanced accessibility */}
      <div 
        className="relative"
        role="application"
        aria-label="Interaktives Diagramm - Verwenden Sie Pfeiltasten zur Navigation"
      >
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
        
        {/* Keyboard navigation instructions */}
        <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-4">
          <span>⌨️ Navigation: ← → Pfeiltasten</span>
          <span>🏠 Home/End: Erster/Letzter Punkt</span>
        </div>
      </div>
    </div>
  );
});

PensionChart.displayName = 'PensionChart';

export default PensionChart;