import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface DataPoint {
  date: string;
  value: number;
  timestamp: number;
}

export type TimePeriod = '1T' | '1W' | '1M' | '3M' | '6M' | 'YTD' | '1J' | '2J' | '5J' | '10J' | 'ALLE';

interface FinancialChartWithTimePeriodsProps {
  title: string;
  data: DataPoint[];
  color?: string;
  darkMode?: boolean;
  formatValue?: (value: number) => string;
}

const TIME_PERIODS: { label: TimePeriod; days: number | 'ytd' | 'all' }[] = [
  { label: '1T', days: 1 },
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: 'YTD', days: 'ytd' },
  { label: '1J', days: 365 },
  { label: '2J', days: 730 },
  { label: '5J', days: 1825 },
  { label: '10J', days: 3650 },
  { label: 'ALLE', days: 'all' },
];

export default function FinancialChartWithTimePeriods({
  title,
  data,
  color = '#10b981',
  darkMode = false,
  formatValue = (value) => `${value.toLocaleString('de-DE', { maximumFractionDigits: 2 })} €`,
}: FinancialChartWithTimePeriodsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('5J');

  // Filter data based on selected time period
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const now = Date.now();
    const period = TIME_PERIODS.find((p) => p.label === selectedPeriod);

    if (!period) return data;

    if (period.days === 'all') {
      return data;
    }

    if (period.days === 'ytd') {
      const yearStart = new Date(new Date().getFullYear(), 0, 1).getTime();
      return data.filter((d) => d.timestamp >= yearStart);
    }

    const cutoffTime = now - period.days * 24 * 60 * 60 * 1000;
    return data.filter((d) => d.timestamp >= cutoffTime);
  }, [data, selectedPeriod]);

  // Calculate performance metrics
  const performance = useMemo(() => {
    if (filteredData.length === 0) {
      return { change: 0, changePercent: 0, isPositive: true };
    }

    const firstValue = filteredData[0].value;
    const lastValue = filteredData[filteredData.length - 1].value;
    const change = lastValue - firstValue;
    const changePercent = (change / firstValue) * 100;

    return {
      current: lastValue,
      change,
      changePercent,
      isPositive: change >= 0,
    };
  }, [filteredData]);

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedTextColor = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const gridColor = darkMode ? '#333' : '#f0f0f0';

  return (
    <div className={`${bgColor} rounded-2xl shadow-lg p-6 ${textColor}`}>
      {/* Header with Title and Current Value */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">{title}</h2>
          {performance.current !== undefined && (
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">
                {formatValue(performance.current)}
              </span>
              <div className={`flex items-center gap-1 ${performance.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {performance.isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-semibold">
                  {performance.changePercent > 0 ? '+' : ''}
                  {performance.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          )}
          <p className={`text-sm ${mutedTextColor} mt-1`}>
            Letzten {selectedPeriod === '1T' ? '1 Tag' :
                    selectedPeriod === '1W' ? '1 Woche' :
                    selectedPeriod === '1M' ? '1 Monat' :
                    selectedPeriod === '3M' ? '3 Monate' :
                    selectedPeriod === '6M' ? '6 Monate' :
                    selectedPeriod === 'YTD' ? 'seit Jahresbeginn' :
                    selectedPeriod === '1J' ? '1 Jahr' :
                    selectedPeriod === '2J' ? '2 Jahre' :
                    selectedPeriod === '5J' ? '5 Jahre' :
                    selectedPeriod === '10J' ? '10 Jahre' : 'gesamt'}
          </p>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TIME_PERIODS.map((period) => (
          <motion.button
            key={period.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedPeriod(period.label)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedPeriod === period.label
                ? darkMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-600 text-white'
                : darkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {period.label}
          </motion.button>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="date"
            stroke={darkMode ? '#9ca3af' : '#6b7280'}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            stroke={darkMode ? '#9ca3af' : '#6b7280'}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value.toLocaleString('de-DE')}€`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
            labelStyle={{ color: darkMode ? '#f3f4f6' : '#111827', fontWeight: 600 }}
            itemStyle={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
            formatter={(value: number) => [formatValue(value), 'Wert']}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Stats Footer */}
      <div className={`mt-6 pt-6 border-t ${borderColor} grid grid-cols-3 gap-4`}>
        <div>
          <p className={`text-xs ${mutedTextColor} mb-1`}>Eröffnung</p>
          <p className="text-sm font-semibold">
            {filteredData.length > 0 ? formatValue(filteredData[0].value) : '-'}
          </p>
        </div>
        <div>
          <p className={`text-xs ${mutedTextColor} mb-1`}>Hoch</p>
          <p className="text-sm font-semibold">
            {filteredData.length > 0
              ? formatValue(Math.max(...filteredData.map((d) => d.value)))
              : '-'}
          </p>
        </div>
        <div>
          <p className={`text-xs ${mutedTextColor} mb-1`}>Tief</p>
          <p className="text-sm font-semibold">
            {filteredData.length > 0
              ? formatValue(Math.min(...filteredData.map((d) => d.value)))
              : '-'}
          </p>
        </div>
      </div>
    </div>
  );
}
