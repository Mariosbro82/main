import React, { memo, useMemo, useCallback } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  AreaChart,
  Area,
  ReferenceLine,
  Brush,
  ComposedChart
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import type { SimulationPoint } from "@/lib/types";

interface PensionChartProps {
  data: SimulationPoint[];
  type?: "line" | "bar" | "area" | "composed";
  className?: string;
  height?: number;
  showBrush?: boolean;
  showReferenceLine?: boolean;
  retirementAge?: number;
  targetAmount?: number;
}

export const PensionChart = memo<PensionChartProps>(function PensionChart({ 
  data, 
  type = "line", 
  className = "", 
  height = 500,
  showBrush = false,
  showReferenceLine = true,
  retirementAge = 67,
  targetAmount
}) {
  // Memoized chart data to prevent unnecessary re-calculations
  const chartData = useMemo(() => 
    data.map((point, index) => ({
      name: `Jahr ${point.year + 1}`,
      shortName: `${point.age}`,
      ageLabel: `Alter ${point.age}`,
      yearLabel: `Jahr ${point.year + 1}`,
      portfolio: Math.round(point.portfolioValue),
      contribution: Math.round(point.contribution * 12), // Annual contribution
      fees: Math.round(point.fees * 12), // Annual fees
      taxes: Math.round(point.taxes * 12), // Annual taxes
      payout: point.payout ? Math.round(point.payout * 12) : 0, // Annual payout
      phase: point.isPayoutPhase ? "Auszahlung" : "Ansparung",
      age: point.age,
      isRetirement: point.age >= retirementAge,
      index,
      year: point.year
    })), [data, retirementAge]);

  // Memoized chart configuration
  const chartConfig = useMemo(() => ({
    portfolio: {
      label: "Portfolio Wert",
      color: "hsl(var(--chart-1))",
    },
    contribution: {
      label: "Beiträge",
      color: "hsl(var(--chart-2))",
    },
    fees: {
      label: "Gebühren",
      color: "hsl(var(--chart-3))",
    },
    taxes: {
      label: "Steuern", 
      color: "hsl(var(--chart-4))",
    },
    payout: {
      label: "Auszahlung",
      color: "hsl(var(--chart-5))",
    }
  }), []);

  // Memoized retirement transition point
  const retirementIndex = useMemo(() => 
    chartData.findIndex(d => d.isRetirement), [chartData]);

  // Memoized custom tooltip component
  const CustomTooltip = useCallback(({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    
    const data = payload[0]?.payload;
    return (
      <div className="rounded-2xl border-2 border-primary/30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-5 py-4 text-sm shadow-2xl ring-4 ring-primary/20 min-w-[300px] max-w-[350px]">
        <div className="font-bold text-slate-900 dark:text-slate-100 mb-3 text-base border-b border-slate-200 dark:border-slate-600 pb-2">{label}</div>
        <div className="space-y-3">
          <div className="flex justify-between items-center gap-6">
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Alter:</span>
            <span className="font-mono text-slate-900 dark:text-slate-100 font-bold text-lg">{data?.age} Jahre</span>
          </div>
          <div className="flex justify-between items-center gap-6">
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Phase:</span>
            <span className={`font-bold px-3 py-1 rounded-full text-xs ${
              data?.phase === 'Auszahlung' 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700' 
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
            }`}>
              {data?.phase}
            </span>
          </div>
          <div className="border-t border-slate-300 dark:border-slate-600 my-3"></div>
          {payload.map((entry: any, index: number) => {
            // Deutsche Übersetzungen für die Labels
            const germanLabels: { [key: string]: string } = {
              'Portfolio Wert': 'Portfolio Wert',
              'Beiträge': 'Beiträge',
              'Gebühren': 'Gebühren',
              'Steuern': 'Steuern',
              'Auszahlung': 'Auszahlung',
              'portfolio': 'Portfolio Wert',
              'contribution': 'Beiträge',
              'fees': 'Gebühren',
              'taxes': 'Steuern',
              'payout': 'Auszahlung'
            };
            
            const displayName = germanLabels[entry.name] || entry.name;
            
            return (
              <div key={index} className="flex justify-between items-center gap-6 py-1">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full shadow-lg border-2 border-white dark:border-slate-700" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">{displayName}:</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-base">
                  {entry.value?.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }, []);

  // Area Chart with gradient fills
  if (type === "area") {
    return (
      <ChartContainer config={chartConfig} className={className}>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="contributionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="shortName" 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              interval={Math.max(1, Math.floor(chartData.length / 12))}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={(value) => {
                if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `€${(value / 1000).toFixed(0)}k`;
                return `€${value.toFixed(0)}`;
              }}
              tickCount={6}
            />
            <ChartTooltip content={<CustomTooltip />} />
            <ChartLegend content={<ChartLegendContent />} />
            
            {showReferenceLine && retirementIndex > 0 && (
              <ReferenceLine 
                x={chartData[retirementIndex]?.shortName} 
                stroke="hsl(var(--destructive))" 
                strokeDasharray="4 4"
                label={{ value: "Rente", position: "top", fill: "hsl(var(--destructive))" }}
              />
            )}
            
            {targetAmount && (
              <ReferenceLine 
                y={targetAmount} 
                stroke="hsl(var(--warning))" 
                strokeDasharray="2 2"
                label={{ value: "Ziel", position: "top", fill: "hsl(var(--warning))" }}
              />
            )}

            <Area 
              type="monotone" 
              dataKey="contribution" 
              stackId="1"
              stroke="hsl(var(--chart-2))" 
              fill="url(#contributionGradient)"
              strokeWidth={1}
            />
            <Area 
              type="monotone" 
              dataKey="portfolio" 
              stroke="hsl(var(--chart-1))" 
              fill="url(#portfolioGradient)"
              strokeWidth={3}
            />
            
            {showBrush && (
              <Brush 
                dataKey="shortName" 
                height={30} 
                stroke="hsl(var(--primary))"
                fill="hsl(var(--muted))"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }

  // Composed Chart with multiple data types
  if (type === "composed") {
    return (
      <ChartContainer config={chartConfig} className={className}>
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="shortName" 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              interval="preserveStartEnd"
              tickFormatter={(value) => `${value}J`}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={(value) => {
                if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `€${(value / 1000).toFixed(0)}k`;
                return `€${value.toFixed(0)}`;
              }}
              tickCount={6}
            />
            <ChartTooltip content={<CustomTooltip />} />
            <ChartLegend content={<ChartLegendContent />} />
            
            {showReferenceLine && retirementIndex > 0 && (
              <ReferenceLine 
                x={chartData[retirementIndex]?.shortName} 
                stroke="hsl(var(--destructive))" 
                strokeDasharray="4 4"
                label={{ value: "Rente", position: "top", fill: "hsl(var(--destructive))" }}
              />
            )}

            <Bar dataKey="contribution" fill="hsl(var(--chart-2))" opacity={0.7} radius={[1, 1, 0, 0]} />
            <Bar dataKey="fees" fill="hsl(var(--chart-3))" opacity={0.8} radius={[1, 1, 0, 0]} />
            <Area 
              type="monotone" 
              dataKey="portfolio" 
              fill="url(#portfolioGradient)" 
              stroke="hsl(var(--chart-1))"
              strokeWidth={3}
            />
            <Line 
              type="monotone" 
              dataKey="portfolio" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={3}
              dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(var(--chart-1))", strokeWidth: 2 }}
            />
            
            {showBrush && (
              <Brush 
                dataKey="shortName" 
                height={30} 
                stroke="hsl(var(--primary))"
                fill="hsl(var(--muted))"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }

  // Enhanced Bar Chart
  if (type === "bar") {
    return (
      <ChartContainer config={chartConfig} className={className}>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={chartData.slice(0, Math.min(20, chartData.length))} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="shortName" 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              interval="preserveStartEnd"
              tickFormatter={(value) => `${value}J`}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={(value) => {
                if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `€${(value / 1000).toFixed(0)}k`;
                return `€${value.toFixed(0)}`;
              }}
              tickCount={6}
            />
            <ChartTooltip content={<CustomTooltip />} />
            <ChartLegend content={<ChartLegendContent />} />
            
            <Bar 
              dataKey="portfolio" 
              fill="hsl(var(--chart-1))" 
              radius={[4, 4, 0, 0]}
              opacity={0.8}
            />
            <Bar 
              dataKey="contribution" 
              fill="hsl(var(--chart-2))" 
              radius={[2, 2, 0, 0]}
              opacity={0.6}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }

  // Enhanced Line Chart (Default)
  return (
    <ChartContainer config={chartConfig} className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="shortName" 
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={{ stroke: 'hsl(var(--border))' }}
            interval="preserveStartEnd"
          />
          <YAxis 
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={{ stroke: 'hsl(var(--border))' }}
            tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
          />
          <ChartTooltip content={<CustomTooltip />} />
          <ChartLegend content={<ChartLegendContent />} />
          
          {showReferenceLine && retirementIndex > 0 && (
            <ReferenceLine 
              x={chartData[retirementIndex]?.shortName} 
              stroke="hsl(var(--destructive))" 
              strokeDasharray="4 4"
              label={{ value: "Rentenbeginn", position: "top", fill: "hsl(var(--destructive))" }}
            />
          )}
          
          {targetAmount && (
            <ReferenceLine 
              y={targetAmount} 
              stroke="hsl(var(--warning))" 
              strokeDasharray="2 2"
              label={{ value: "Zielbetrag", position: "top", fill: "hsl(var(--warning))" }}
            />
          )}

          <Line 
            type="monotone" 
            dataKey="portfolio" 
            stroke="hsl(var(--chart-1))" 
            strokeWidth={3}
            dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 3 }}
            activeDot={{ r: 6, stroke: "hsl(var(--chart-1))", strokeWidth: 2, fill: "hsl(var(--background))" }}
          />
          <Line 
            type="monotone" 
            dataKey="contribution" 
            stroke="hsl(var(--chart-2))" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
          
          {showBrush && (
            <Brush 
              dataKey="shortName" 
              height={30} 
              stroke="hsl(var(--primary))"
              fill="hsl(var(--muted))"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
});
